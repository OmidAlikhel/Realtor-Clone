// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWG38Rb35YMbXxS_LcxiPS7yHMKH-LlD0",
  authDomain: "realtor-clone-react-fc9ed.firebaseapp.com",
  projectId: "realtor-clone-react-fc9ed",
  storageBucket: "realtor-clone-react-fc9ed.firebasestorage.app",
  messagingSenderId: "1083783175191",
  appId: "1:1083783175191:web:dcd84272cc61f23fc79052",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
