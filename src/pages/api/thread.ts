import { cors } from "src/utils/cors";
import { SlackApiClient } from "src/slack-api";

type ChannelHistory = {
  ok: boolean;
  messages: [
    {
      bot_id: string;
      type: string;
      text: string;
      user: string;
      ts: string;
      team: string;
      bot_profile: {};
    },
  ];
  has_more: boolean;
  pin_count: number;
  channel_actions_ts?: string;
  channel_actions_count: number;
  response_metadata: {
    next_cursor: string;
    scopes: [string];
    acceptedScopes: [string];
  };
};

export default async (req, res) => {
  await cors(req, res);

  const { channel_id, team_id, user_id, text, trigger_id } = req.body;

  const slackApi = await SlackApiClient({ userId: user_id, teamId: team_id });

  const channelHistory = (await slackApi.conversations.history({
    channel: channel_id,
    limit: text ? 1 : 3,
  })) as ChannelHistory;

  if (text) {
    try {
      await slackApi.chat.postMessage({
        channel: channel_id,
        as_user: true,
        thread_ts: channelHistory.messages[0].ts,
        text,
      });
    } catch (error) {
      console.warn(`--> ERROR posting the thread`, error);
      throw new Error(error);
    }
  } else {
    try {
      await slackApi.views.open({
        trigger_id,
        view: {
          type: "modal",
          title: {
            type: "plain_text",
            text: "Slack Thread Commands",
          },
          submit: {
            type: "plain_text",
            text: "Submit",
          },
          close: {
            type: "plain_text",
            text: "Cancel",
          },
          blocks: [
            {
              type: "input",
              block_id: "thread_text",
              element: {
                type: "plain_text_input",
                multiline: true,
                action_id: "thread_message",
              },
              label: {
                type: "plain_text",
                text: "🧵 Message",
                emoji: true,
              },
            },
            {
              type: "input",
              block_id: "messages",
              element: {
                action_id: "message_id",
                type: "static_select",
                placeholder: {
                  type: "plain_text",
                  text: "Select a message",
                },
                initial_option: {
                  value: channelHistory.messages[0].ts,
                  text: {
                    type: "plain_text",
                    text: channelHistory.messages[0].text,
                  },
                },
                options: channelHistory.messages.map((msg) => ({
                  value: msg.ts,
                  text: {
                    type: "plain_text",
                    text: msg.text,
                  },
                })),
              },
              label: {
                type: "plain_text",
                text: "Message to reply to",
                emoji: true,
              },
            },
          ],
          callback_id: "thread",
          private_metadata: JSON.stringify({
            channel_id,
          }),
        },
      });
      // Action continues in ./modal.ts
    } catch (error) {
      console.warn(`--> ERROR opening the modal`, error);
      throw new Error(error);
    }
  }

  /* ------------------------------------------------------------------------ */

  res.setHeader("Content-Type", "application/json");
  res.status(200).end();
};
