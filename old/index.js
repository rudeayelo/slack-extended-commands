const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const grant = require("grant-express");
const fetch = require("isomorphic-unfetch");

const morning = require("./controllers/morning");
const brb = require("./controllers/brb");

const app = express();

app.use(session({ secret: "grant", saveUninitialized: true, resave: false }));
app.use(grant(require("./config.json")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app
  .get("/hello", (req, res) => {
    // req.session.grant.response:
    // {
    //   {
    //     "access_token": "xoxp-628291344193-634639999680-1152893874275-971bb516c26f99f2d38309cbaf6abc21",
    //     "raw": {
    //     "ok": true,
    //     "access_token": "xoxp-628291344193-634639999680-1152893874275-971bb516c26f99f2d38309cbaf6abc21",
    //     "scope": "identify,chat:write:user,users:write,users.profile:write",
    //     "user_id": "UJNJTVDL0",
    //     "team_id": "TJG8KA45P",
    //     "enterprise_id": null,
    //     "team_name": "Rude's playground"
    //   }
    // }

    const token = req.session.grant.response.access_token;

    res.end(JSON.stringify(req.session.grant.response, null, 2));
  })
  .post("/morning", morning)
  .post("/brb", brb)
  .listen(3000);
