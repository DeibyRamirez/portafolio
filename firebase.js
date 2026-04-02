// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgJazBCd-nNI3p_h19KE4c_a07oCwa5JE",
  authDomain: "portafoliodeibyramirez.firebaseapp.com",
  projectId: "portafoliodeibyramirez",
  storageBucket: "portafoliodeibyramirez.firebasestorage.app",
  messagingSenderId: "158530827208",
  appId: "1:158530827208:web:dec867586b72a83dbb06fd",
  measurementId: "G-YK6HZ8DV4H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);