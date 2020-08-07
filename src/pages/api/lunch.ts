import { db } from "src/firebase-admin";
import addMinutes from "date-fns/addMinutes";
import {
  USERS_COLLECTION,
  WORKSPACES_COLLECTION,
  USER_INITIAL_SETTINGS,
} from "src/constants";
import getUnixTime from "date-fns/getUnixTime";
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

  try {
    await slackApi.chat.postMessage({
      channel: channel_id,
      as_user: true,
      text: text || "Lunch",
    });
  } catch (error) {
    console.warn("--> ERROR posting the message", error);
    throw new Error(error);
  }

  /* -------------------------- Set a custom status ------------------------- */

  const { lunchDuration } = userData;
  const minutes = lunchDuration
    ? parseInt(lunchDuration, 10)
    : parseInt(USER_INITIAL_SETTINGS.lunchDuration, 10);
  const expirationTimestamp = getUnixTime(addMinutes(new Date(), minutes));

  try {
    await slackApi.users.profile.set({
      // @ts-ignore
      profile: {
        status_text: "Lunch",
        status_emoji: ":hamburger:",
        status_expiration: expirationTimestamp,
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
