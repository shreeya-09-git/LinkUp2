import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { doc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your Firebase Configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQdNj_XsGkO1GJE4XEdG2j1tTrKabjhLg",
  authDomain: "webapp-93d50.firebaseapp.com",
  databaseURL: "https://webapp-93d50-default-rtdb.firebaseio.com",
  projectId: "webapp-93d50",
  storageBucket: "webapp-93d50.firebasestorage.app",
  messagingSenderId: "412079172315",
  appId: "1:412079172315:web:4d9f28e1941ad38547bafe",
  measurementId: "G-EY8WSM5PZF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


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
