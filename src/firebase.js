import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBok_ZFmZHEq-RUGC-M74Do9n1NEvx1BAY",
  authDomain: "journal-44161.firebaseapp.com",
  projectId: "journal-44161",
  storageBucket: "journal-44161.firebasestorage.app",
  messagingSenderId: "771936928760",
  appId: "1:771936928760:web:4f6f25efa300799c50cc0d",
  measurementId: "G-3GV0Y4E033"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };