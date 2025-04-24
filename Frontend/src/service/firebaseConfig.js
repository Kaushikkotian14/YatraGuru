// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore" ;
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDf3_pPeqU3IqRq6m-jAHTfnsWK1POZZso",
  authDomain: "yatra-guru-5b202.firebaseapp.com",
  projectId: "yatra-guru-5b202",
  storageBucket: "yatra-guru-5b202.appspot.com",
  messagingSenderId: "919770764606",
  appId: "1:919770764606:web:bd14a64ca519b08cbd086f",
  measurementId: "G-MNJ3JS38RY"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
