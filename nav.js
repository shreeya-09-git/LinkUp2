// ==========================================
// GLOBAL THEME ENGINE (Runs on every page load)
// ==========================================
window.applyTheme = (theme) => {
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
};

// 1. Check memory and instantly apply the theme when ANY page loads
const savedTheme = localStorage.getItem('firechat-theme') || 'system';
window.applyTheme(savedTheme);

// 2. Listen for OS-level dark mode changes (if user selected "System Default")
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (localStorage.getItem('firechat-theme') === 'system') {
        window.applyTheme('system');
    }
});


import { auth, db } from "./config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const currentPath = window.location.pathname;

const navHTML = `
<nav class="bottom-nav">
    <a href="chats.html" class="nav-item ${currentPath.includes('chats.html') ? 'active' : ''}" style="position:relative;">
        <span class="nav-icon">💬</span>
        <span class="nav-label">Chats</span>
        <div id="nav-badge-chats" class="nav-badge" style="display:none;"></div>
    </a>
    
    <a href="ai.html" class="nav-item ${currentPath.includes('ai.html') ? 'active' : ''}" style="position:relative;">
        <span class="nav-icon">✨</span>
        <span class="nav-label">Gemini</span>
    </a>

    <a href="friends.html" class="nav-item ${currentPath.includes('friends.html') ? 'active' : ''}" style="position:relative;">
        <span class="nav-icon">👥</span>
        <span class="nav-label">Friends</span>
    </a>
    <a href="notifications.html" class="nav-item ${currentPath.includes('notifications.html') ? 'active' : ''}" style="position:relative;">
        <span class="nav-icon">🔔</span>
        <span class="nav-label">Alerts</span>
        <div id="nav-badge-alerts" class="nav-badge" style="display:none;"></div>
    </a>
    <a href="profile.html" class="nav-item ${currentPath.includes('profile.html') ? 'active' : ''}" style="position:relative;">
        <span class="nav-icon">👤</span>
        <span class="nav-label">Profile</span>
    </a>
</nav>
`;

document.body.insertAdjacentHTML('beforeend', navHTML);

// Global Listener for Navigation Badges
onAuthStateChanged(auth, u => {
    if (u) {
        // --- 1. CHATS BADGE ---
        let lastChatCount = -1; 
        const chatsQuery = query(collection(db, "chats"), where("participants", "array-contains", u.uid));
        
        onSnapshot(chatsQuery, snap => {
            let unreadCount = 0;
            snap.forEach(d => {
                const data = d.data();
                if (data.unread && data.lastMessageSender !== u.uid) {
                    if (window.currentChatId !== d.id) {
                        unreadCount++;
                    }
                }
            });

            if (unreadCount !== lastChatCount) {
                lastChatCount = unreadCount; 
                const badge = document.getElementById('nav-badge-chats');
                if (badge) {
                    badge.style.display = unreadCount > 0 ? 'block' : 'none';
                }
            }
        });

        // --- 2. ALERTS BADGE ---
        let pendingRequests = 0;
        let unreadNotifs = 0;
        let lastAlertCount = -1;

        const updateAlertBadge = () => {
            // If we are currently ON the notifications page, force the badge to hide immediately
            if (currentPath.includes('notifications.html')) {
                const badge = document.getElementById('nav-badge-alerts');
                if (badge) badge.style.display = 'none';
                return;
            }

            const totalAlerts = pendingRequests + unreadNotifs;
            
            if (totalAlerts !== lastAlertCount) {
                lastAlertCount = totalAlerts;
                const badge = document.getElementById('nav-badge-alerts');
                if (badge) {
                    badge.style.display = totalAlerts > 0 ? 'block' : 'none';
                }
            }
        };

        // Watch for Unseen Friend Requests
        onSnapshot(query(collection(db, "requests"), where("to", "==", u.uid)), snap => {
            pendingRequests = 0;
            snap.forEach(d => {
                // Only count it if the user hasn't seen it yet
                if (d.data().seen !== true) {
                    pendingRequests++;
                }
            });
            updateAlertBadge();
        });

        // Watch for Unread Notifications (Story Likes)
        onSnapshot(query(collection(db, "notifications"), where("to", "==", u.uid), where("read", "==", false)), snap => {
            unreadNotifs = snap.size;
            updateAlertBadge();
        });
    }
});