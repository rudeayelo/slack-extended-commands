import { WebClient } from "@slack/web-api";
import addYears from "date-fns/addYears";
import { db } from "src/firebase-admin";
import { USERS_COLLECTION, WORKSPACES_COLLECTION } from "src/constants";
import { cors } from "src/utils/cors";
import { cookies } from "src/utils/cookies";

type OAuthV2Response = {
  ok: boolean;
  app_id: string;
  authed_user: {
    id: string;
    scope: string;
    access_token: string;
    token_type: string;
  };
  scope: string;
  token_type: string;
  access_token: string;
  bot_user_id: string;
  team: {
    id: string;
    name: string;
  };
  enterprise?: boolean;
  response_metadata: {};
  [key: string]: unknown;
};

const clientId = process.env.SLACK_CLIENT_ID;
const clientSecret = process.env.SLACK_CLIENT_SECRET;

const handler = async (req, res) => {
  await cors(req, res);

  const { code, error } = req.query;

  if (error) {
    res.statusCode = 303;
    res.setHeader("Location", "https://" + req.headers["host"] + "/error");
    res.end();
  }

  const result = (await new WebClient().oauth.v2
    .access({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    })
    .catch((error) => {
      console.error("--> ERROR requesting oAuth:", error);

      res.setHeader("Location", "https://" + req.headers["host"] + "/error");
      res.status(303).end();
    })) as OAuthV2Response;

  const workspaceDocRef = db
    .collection(WORKSPACES_COLLECTION)
    .doc(result.team.id);
  const userDocRef = workspaceDocRef
    .collection(USERS_COLLECTION)
    .doc(result.authed_user.id);

  try {
    await workspaceDocRef.set({
      team_id: result.team.id,
      team_name: result.team.name,
      access_token: result.access_token,
    });
    await userDocRef.set({
      user_id: result.authed_user.id,
      access_token: result.authed_user.access_token,
    });
    console.log("--> Succesfully saved user to db");
  } catch (error) {
    console.warn("--> ERROR saving user to db:", error);
    throw new Error(error);
  }

  res.cookie(
    "su",
    JSON.stringify({
      team_id: result.team.id,
      user_id: result.authed_user.id,
      access_token: result.authed_user.access_token,
    }),
    {
      expires: addYears(new Date(), 1),
      path: "/",
    }
  );
  res.setHeader("Location", "/");
  res.status(302).end();
};

export default cookies(handler);
