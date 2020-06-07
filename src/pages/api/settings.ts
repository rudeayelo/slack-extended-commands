import { db } from "src/firebase-admin";
import { USERS_COLLECTION, WORKSPACES_COLLECTION } from "src/constants";

export default async (req, res) => {
  if (req.method === "POST") {
    const { userId, teamId, ...userSettings } = JSON.parse(req.body);

    const userDocRef = db
      .collection(WORKSPACES_COLLECTION)
      .doc(teamId)
      .collection(USERS_COLLECTION)
      .doc(userId);

    try {
      await userDocRef.set(userSettings, { merge: true });
      console.log("--> Succesfully saved user settings to db");
    } catch (error) {
      console.warn("--> ERROR saving user settings to db:", error);
      throw new Error(error);
    }
  } else {
    const { userId, teamId } = req.query;

    const userDocRef = db
      .collection(WORKSPACES_COLLECTION)
      .doc(teamId)
      .collection(USERS_COLLECTION)
      .doc(userId);
    const { access_token, user_id, ...userSettings } = (
      await userDocRef.get()
    ).data();

    res.setHeader("Content-Type", "application/json");
    res.status(200).end(JSON.stringify(userSettings));
  }

  res.status(200).end();
};
