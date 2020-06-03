const slackApi = require("../slackApi.js");

function randomGoodMorningMessage() {
  const goodMorningMessages = ["morning", "moin", "good morning", "mornings"];

  return goodMorningMessages[
    Math.ceil(Math.random() * goodMorningMessages.length) - 1
  ];
}

async function morning(req, res) {
  console.log("req", req.body);

  /* ---------------------- Post message to the channel --------------------- */

  try {
    const postMessage = await slackApi("/chat.postMessage", {
      channel: req.body.channel_id,
      as_user: true,
      text: randomGoodMorningMessage(),
    });
  } catch (error) {
    console.error("Failed to post to Slack:", error);
  }

  /* ------------------------------------------------------------------------ */

  res.end();
}

module.exports = morning;
