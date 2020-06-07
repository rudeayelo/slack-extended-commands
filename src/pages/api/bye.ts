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

  const slackApi = await SlackApiClient({
    userId: user_id,
    teamId: team_id,
  });

  const userDocRef = db
    .collection(WORKSPACES_COLLECTION)
    .doc(team_id)
    .collection(USERS_COLLECTION)
    .doc(user_id);
  const userData = (await userDocRef.get()).data();

  /* ---------------------- Post message to the channel --------------------- */

  async function randomByeMessage() {
    let { byeMessages } = await userData;
    byeMessages = byeMessages
      ? byeMessages.split(";")
      : USER_INITIAL_SETTINGS.byeMessages.split(";");

    return byeMessages[Math.ceil(Math.random() * byeMessages.length) - 1];
  }

  try {
    const randomByeText = await randomByeMessage();

    await slackApi.chat.postMessage({
      channel: channel_id,
      as_user: true,
      text: text || randomByeText,
    });
  } catch (error) {
    console.error("--> ERROR posting the message", error);
    throw new Error(error);
  }

  /* -------------------------- Set a custom status ------------------------- */

  const { byeCustomStatus } = userData;
  let [status_emoji, ...status_text_rest] = byeCustomStatus
    ? byeCustomStatus.split(" ")
    : USER_INITIAL_SETTINGS.byeCustomStatus.split(" ");
  let status_text = status_text_rest.join(" ");

  try {
    await slackApi.users.profile.set({
      // @ts-ignore
      profile: {
        status_emoji,
        status_text,
      },
    });
  } catch (error) {
    console.error("--> ERROR setting custom status:", error);
  }

  /* -------------------------- Mark as unavailable ------------------------- */

  try {
    await slackApi.users.setPresence({
      presence: "away",
    });
  } catch (error) {
    console.error("--> ERROR setting the user's presence:", error);
  }

  /* ------------------------------------------------------------------------ */

  res.setHeader("Content-Type", "application/json");
  res.status(200).end();
};
