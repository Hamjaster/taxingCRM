import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592
const firebaseConfig = {
    apiKey: "AIzaSyBvmz3E_TVKBaEAq8EZUv4Dn-2ksUReoFU",
  authDomain: "taxingcrm.firebaseapp.com",
  databaseURL: "https://taxingcrm-default-rtdb.firebaseio.com",
  projectId: "taxingcrm",
  storageBucket: "taxingcrm.firebasestorage.app",
  messagingSenderId: "645634159422",
  appId: "1:645634159422:web:5399adefe879e6980df26f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);