import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAtsl8fqV1z-1dn7zzRe7GrYZCIfob_ZYA",
  authDomain: "bookmyticket-48fd6.firebaseapp.com",
  projectId: "bookmyticket-48fd6",
  storageBucket: "bookmyticket-48fd6.firebasestorage.app",
  messagingSenderId: "444519862569",
  appId: "1:444519862569:web:58e3c88ab9ac7033ed2738"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);