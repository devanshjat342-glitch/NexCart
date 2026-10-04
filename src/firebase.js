import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBCu1-zl8_10e7bHRFwxMlI4rgCGFKb9_M",
  authDomain: "nexcart-dbc6e.firebaseapp.com",
  projectId: "nexcart-dbc6e",
  storageBucket: "nexcart-dbc6e.firebasestorage.app",
  messagingSenderId: "712242834772",
  appId: "1:712242834772:web:8b9f704513d0bfb662ecc1",
  measurementId: "G-BLX2KJJP25",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);