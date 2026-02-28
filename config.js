import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCLWbJAw5Le6Fqxq9THQFYqp2JL5WCPSxk",
  authDomain: "weba-f5bc5.firebaseapp.com",
  databaseURL: "https://weba-f5bc5-default-rtdb.firebaseio.com",
  projectId: "weba-f5bc5",
  storageBucket: "weba-f5bc5.firebasestorage.app",
  messagingSenderId: "1054296497174",
  appId: "1:1054296497174:web:a66dfdc7c0cd3772c1e937",
  measurementId: "G-XVEJSERLYQ"
};

export const GEMINI_API_KEY = "AIzaSyBofTsBGFZATWeXasaS81TMhkT04xTD4h8"; 

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);