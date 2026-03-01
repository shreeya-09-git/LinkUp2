import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { doc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your Firebase Configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Your Gemini API Key
export const GEMINI_API_KEY = "AIzaSyB3vMMCr5l8zHRRDZaSVVm5zme8UHxDsCg"; 

// ==========================================
// GLOBAL ONLINE/OFFLINE ENGINE
// ==========================================
export const updateUserStatus = async (uid, isOnline) => {
    if (!uid) return;
    try {
        await updateDoc(doc(db, "users", uid), {
            online: isOnline,
            lastSeen: serverTimestamp()
        });
    } catch (e) {
        console.error("Status Update Error:", e);
    }
};