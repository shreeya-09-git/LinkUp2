import { auth, db } from "./config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const currentPath = window.location.pathname;

const navHTML = `
<nav class="bottom-nav">
    <a href="chats.html" class="nav-item ${currentPath.includes('chats.html') ? 'active' : ''}">
        <span class="nav-icon">💬</span>
        <span class="nav-label">Chats</span>
        <div id="nav-badge-chats" class="nav-badge" style="display:none; justify-content:center; align-items:center;"></div>
    </a>
    <a href="friends.html" class="nav-item ${currentPath.includes('friends.html') ? 'active' : ''}">
        <span class="nav-icon">👥</span>
        <span class="nav-label">Friends</span>
    </a>
    <a href="notifications.html" class="nav-item ${currentPath.includes('notifications.html') ? 'active' : ''}">
        <span class="nav-icon">🔔</span>
        <span class="nav-label">Alerts</span>
        <div id="nav-badge-alerts" class="nav-badge" style="display:none; justify-content:center; align-items:center;"></div>
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
        // 1. CHATS BADGE: Listen for Unread Messages
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
                badge.style.display = unreadCount > 0 ? 'flex' : 'none';
                badge.innerText = unreadCount;
            }
        });

        // 2. ALERTS BADGE: Listen for Friend Requests & Unread Story Likes
        let pendingRequests = 0;
        let unreadNotifs = 0;

        const updateAlertBadge = () => {
            const totalAlerts = pendingRequests + unreadNotifs;
            const badge = document.getElementById('nav-badge-alerts');
            if (badge) {
                badge.style.display = totalAlerts > 0 ? 'flex' : 'none';
                badge.innerText = totalAlerts;
            }
        };

        // Watch for Friend Requests
        onSnapshot(query(collection(db, "requests"), where("to", "==", u.uid)), snap => {
            pendingRequests = snap.size;
            updateAlertBadge();
        });

        // Watch for Unread Notifications (Story Likes)
        onSnapshot(query(collection(db, "notifications"), where("to", "==", u.uid), where("read", "==", false)), snap => {
            unreadNotifs = snap.size;
            updateAlertBadge();
        });
    }
});