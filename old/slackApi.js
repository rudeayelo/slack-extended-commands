const userToken = require("./token.js");

const apiUrl = "https://slack.com/api";

function slackApi(endpoint, body) {
  return fetch(apiUrl + endpoint, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + userToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: userToken,
      ...body,
    }),
  });
}

module.exports = slackApi;
