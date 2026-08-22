// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "cortexai-d4944.firebaseapp.com",
  projectId: "cortexai-d4944",
  storageBucket: "cortexai-d4944.firebasestorage.app",
  messagingSenderId: "145054460646",
  appId: "1:145054460646:web:9e8141cf1271ae295ba927"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
export {app,auth}
