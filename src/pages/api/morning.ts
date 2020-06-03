import { cors } from "src/utils/cors";
import { SlackApiClient } from "src/slack-api";

function randomGoodMorningMessage() {
  const goodMorningMessages = ["morning", "moin", "good morning", "mornings"];

  return goodMorningMessages[
    Math.ceil(Math.random() * goodMorningMessages.length) - 1
  ];
}

export default async (req, res) => {
  await cors(req, res);

  const { channel_id, team_id, user_id, text } = req.body;

  const slackApi = await SlackApiClient({ userId: user_id, teamId: team_id });

  /* ---------------------- Post message to the channel --------------------- */

  try {
    await slackApi.chat.postMessage({
      channel: channel_id,
      as_user: true,
      text: text || randomGoodMorningMessage(),
    });
  } catch (error) {
    console.warn("--> ERROR posting the message", error);
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
