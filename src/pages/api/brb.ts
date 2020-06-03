import addMinutes from "date-fns/addMinutes";
import getUnixTime from "date-fns/getUnixTime";
import { cors } from "src/utils/cors";
import { SlackApiClient } from "src/slack-api";

export default async (req, res) => {
  await cors(req, res);

  const { channel_id, team_id, user_id, text } = req.body;

  const timeAmount = text || 15;

  const slackApi = await SlackApiClient({ userId: user_id, teamId: team_id });

  /* ---------------------- Post message to the channel --------------------- */

  try {
    await slackApi.chat.postMessage({
      channel: channel_id,
      as_user: true,
      text: `I'll be back in ~${timeAmount} minutes`,
    });
  } catch (error) {
    console.warn("--> ERROR posting the message", error);
    throw new Error(error);
  }

  /* -------------------------- Set a custom status ------------------------- */

  const expirationTimestamp = getUnixTime(addMinutes(new Date(), timeAmount));

  try {
    await slackApi.users.profile.set({
      // @ts-ignore
      profile: {
        status_text: "Be right back",
        status_emoji: ":hourglass_flowing_sand:",
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
