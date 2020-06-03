import { SlackApiClient } from "src/slack-api";
import { cors } from "src/utils/cors";

export default async (req, res) => {
  await cors(req, res);

  const {
    team: { id: team_id },
    user: { id: user_id },
    view: { private_metadata, state, callback_id },
  } = JSON.parse(req.body.payload);
  const { channel_id } = JSON.parse(private_metadata);

  const slackApi = await SlackApiClient({ userId: user_id, teamId: team_id });

  /* -------------------- Post the message from the modal ------------------- */

  if (callback_id === "thread") {
    try {
      await slackApi.chat.postMessage({
        channel: channel_id,
        as_user: true,
        thread_ts: state.values.messages.message_id.selected_option.value,
        text: state.values.thread_text.thread_message.value,
      });
    } catch (error) {
      console.warn(`--> ERROR posting the message`, error);
      throw new Error(error);
    }
  }

  /* ------------------------------------------------------------------------ */

  res.setHeader("Content-Type", "application/json");
  res.status(200).end();
};
