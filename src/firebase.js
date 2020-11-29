import firebase from "firebase/app"
import "firebase/auth"
import "firebase/storage";
import 'firebase/firestore';

const app = firebase.initializeApp({
    apiKey: process.env.REACT_APP_APIKEY,
    authDomain: process.env.REACT_APP_AUTHDOMAIN,
    databaseURL: process.env.REACT_APP_DATABASEURL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
});

var db_obj = firebase.firestore();
if (process.env.REACT_APP_HOST === "localhost") {
  db_obj.useEmulator("localhost", 8080);
  console.log("useEmulator:firestore")
}

var auth_obj = firebase.auth();
if (process.env.REACT_APP_HOST === "localhost") {
    console.log("useEmulator:auth")
    auth_obj.useEmulator("http://localhost:9099")
} 

var storage_obj = firebase.storage();
/* storage_obj.useEmulator is not a functionというエラーがでたのでコメントアウト
if (process.env.REACT_APP_HOST === "localhost") {
    console.log("useEmulator:storage")
    storage_obj.useEmulator("http://localhost:9099")
}
*/

export const db = db_obj;
export const auth = auth_obj;
export const storage = storage_obj;
export default app

