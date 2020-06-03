import * as firebase from "firebase-admin";

const serviceAccount = JSON.parse(
  Buffer.from(process.env.GCLOUD_CREDENTIALS, "base64").toString(),
);

if (firebase.apps.length <= 0) {
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://slack-extended-commands.firebaseio.com",
  });
}

export const db = firebase.firestore();

export default firebase;
