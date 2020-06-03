const slackApi = require("../slackApi.js");
const addMinutes = require("date-fns/addMinutes");
const getUnixTime = require("date-fns/getUnixTime");

async function brb(req, res) {
  console.log("req", req.body);

  const timeAmount = req.body.text || 15;

  /* --------------------- Post a message to the channel -------------------- */

  try {
    const postMessage = await slackApi("/chat.postMessage", {
      channel: req.body.channel_id,
      as_user: true,
      text: `I'll be back in ~${timeAmount} minutes`,
    });
  } catch (error) {
    console.error("Failed to post to Slack:", error);
  }

  /* -------------------------- Set a custom status ------------------------- */

  const expirationTimestamp = getUnixTime(addMinutes(new Date(), timeAmount));

  try {
    const customStatus = await slackApi("/users.profile.set", {
      profile: {
        status_text: "Be right back",
        status_emoji: ":hourglass_flowing_sand:",
        status_expiration: expirationTimestamp,
      },
    });
  } catch (error) {
    console.error("Failed to set custom status:", error);
  }

  /* ---------------------------- Mark as away ----------------------------- */

  try {
    const customStatus = await slackApi("/users.setPresence", {
      presence: "away",
    });
  } catch (error) {
    console.error("Failed to set the user's presence:", error);
  }

  /* ------------------------------------------------------------------------ */

  res.end();
}

module.exports = brb;
