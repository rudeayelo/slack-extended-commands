import { db } from "src/firebase-admin";
import {
  USERS_COLLECTION,
  WORKSPACES_COLLECTION,
  USER_INITIAL_SETTINGS,
} from "src/constants";
import { cors } from "src/utils/cors";
import { SlackApiClient } from "src/slack-api";

export default async (req, res) => {
  await cors(req, res);

  const { channel_id, team_id, user_id, text } = req.body;

  const slackApi = await SlackApiClient({ userId: user_id, teamId: team_id });

  const userDocRef = db
    .collection(WORKSPACES_COLLECTION)
    .doc(team_id)
    .collection(USERS_COLLECTION)
    .doc(user_id);
  const userData = (await userDocRef.get()).data();

  /* ---------------------- Post message to the channel --------------------- */

  async function randomMorningMessage() {
    let { morningMessages } = await userData;
    morningMessages = morningMessages
      ? morningMessages.split(";")
      : USER_INITIAL_SETTINGS.morningMessages.split(";");

    return morningMessages[
      Math.ceil(Math.random() * morningMessages.length) - 1
    ];
  }

  try {
    const randomMorningText = await randomMorningMessage();

    await slackApi.chat.postMessage({
      channel: channel_id,
      as_user: true,
      text: text || randomMorningText,
    });
  } catch (error) {
    console.error("--> ERROR posting the message", error);
    throw new Error(error);
  }

  /* -------------------------- Remove custom status ------------------------ */

  try {
    await slackApi.users.profile.set({
      // @ts-ignore
      profile: {
        status_text: "",
        status_emoji: "",
      },
    });
  } catch (error) {
    console.error("--> ERROR setting custom status:", error);
  }

  /* --------------------------- Mark as available -------------------------- */

  try {
    await slackApi.users.setPresence({ presence: "auto" });
  } catch (error) {
    console.error("--> ERROR setting user's presence:", error);
  }

  /* ----------------------- Toggle off Do Not Disturb ---------------------- */

  try {
    await slackApi.dnd.endDnd();
  } catch (error) {
    console.error("--> ERROR setting Do Not Disturb porperty:", error);
  }

  /* ------------------------------------------------------------------------ */

  res.setHeader("Content-Type", "application/json");
  res.status(200).end();
};
