import { auth, db } from "./config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const currentPath = window.location.pathname;

const navHTML = `
<nav class="bottom-nav">
    <a href="chats.html" class="nav-item ${currentPath.includes('chats.html') ? 'active' : ''}">
        <span class="nav-icon">💬</span>
        <span class="nav-label">Chats</span>
        <div id="nav-badge-chats" class="nav-badge"></div>
    </a>
    <a href="friends.html" class="nav-item ${currentPath.includes('friends.html') ? 'active' : ''}">
        <span class="nav-icon">👥</span>
        <span class="nav-label">Friends</span>
    </a>
    <a href="notifications.html" class="nav-item ${currentPath.includes('notifications.html') ? 'active' : ''}">
        <span class="nav-icon">🔔</span>
        <span class="nav-label">Alerts</span>
        <div id="nav-badge-alerts" class="nav-badge"></div>
    </a>
    <a href="ai.html" class="nav-item ${currentPath.includes('ai.html') ? 'active' : ''}">
        <span class="nav-icon">✨</span>
        <span class="nav-label">AI</span>
    </a>
    <a href="profile.html" class="nav-item ${currentPath.includes('profile.html') ? 'active' : ''}">
        <span class="nav-icon">👤</span>
        <span class="nav-label">Profile</span>
    </a>
</nav>
`;

document.body.insertAdjacentHTML('beforeend', navHTML);

// Global Listener for Navigation Badges
onAuthStateChanged(auth, u => {
    if (u) {
        // 1. Listen for Unread Messages across ALL chats
        onSnapshot(collection(db, "chats"), snap => {
            let unreadCount = 0;
            snap.forEach(d => {
                const data = d.data();
                if (data.participants && data.participants.includes(u.uid) && data.unread && data.lastMessageSender !== u.uid) {
                    unreadCount++;
                }
            });
            const badge = document.getElementById('nav-badge-chats');
            if (badge) {
                badge.style.display = unreadCount > 0 ? 'block' : 'none';
                badge.innerText = unreadCount;
            }
        });

        // 2. Listen for Pending Friend Requests
        onSnapshot(query(collection(db, "requests"), where("to", "==", u.uid)), snap => {
            const reqCount = snap.size;
            const badge = document.getElementById('nav-badge-alerts');
            if (badge) {
                badge.style.display = reqCount > 0 ? 'block' : 'none';
                badge.innerText = reqCount;
            }
        });
    }
});