import { WebClient } from "@slack/web-api";
import { db } from "src/firebase-admin";
import { USERS_COLLECTION, WORKSPACES_COLLECTION } from "src/constants";

export async function SlackApiClient({ userId, teamId }) {
  const userDocRef = db
    .collection(`${WORKSPACES_COLLECTION}/${teamId}/${USERS_COLLECTION}`)
    .doc(userId);

  const userDoc = await userDocRef.get();
  const userData = await userDoc.data();

  const { access_token } = userData;

  return new WebClient(access_token);
}
