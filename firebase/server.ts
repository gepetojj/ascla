import firebase, { ServiceAccount, credential } from "firebase-admin";

const credentials: ServiceAccount = {
	projectId: process.env.FIREBASE_PROJECT_ID,
	privateKey: String(process.env.FIREBASE_PRIVATE_KEY).replace(/\\n/g, "\n"),
	clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

if (!firebase.apps.length) {
	firebase.initializeApp({
		credential: credential.cert(credentials),
		databaseURL: `https://${credentials.projectId}.firebaseio.com`,
		storageBucket: "asclasi.appspot.com",
	});
}

export const firestore = firebase.firestore();
export const storage = firebase.storage();
