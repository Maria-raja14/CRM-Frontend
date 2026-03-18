// import { createContext, useContext, useState, useEffect, useRef } from "react";
// import { initSocket } from "../utils/socket";
// import axios from "axios";

// const NotificationContext = createContext();

// export const NotificationProvider = ({ children }) => {
//   const [notifications, setNotifications] = useState([]);
//   const socketRef = useRef(null);

//   const API_URL = import.meta.env.VITE_API_URL;

//   // Read user fresh on every render (handles login/logout)
//   const user = (() => {
//     try {
//       return JSON.parse(localStorage.getItem("user"));
//     } catch {
//       return null;
//     }
//   })();

//   useEffect(() => {
//     if (!user?._id) {
//       setNotifications([]);
//       return;
//     }

//     // ─── 1. Fetch existing notifications from server ────────────────────
//     // ✅ FIX: Use /:userId path param — NOT ?userId= query string
//     // Route is:  GET /api/notifications/:userId
//     const fetchNotifications = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(
//           `${API_URL}/notifications/${user._id}`,   // ← FIXED URL
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         const fetched = Array.isArray(response.data) ? response.data : [];

//         setNotifications((prev) => {
//           const all = [...prev, ...fetched];
//           const unique = Array.from(
//             new Map(all.map((n) => [String(n._id), n])).values()
//           );
//           return unique.sort(
//             (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//           );
//         });
//       } catch (error) {
//         console.error("Failed to fetch notifications:", error?.response?.data || error.message);
//       }
//     };

//     fetchNotifications();

//     // ─── 2. Socket.IO real-time listeners ──────────────────────────────
//     const socket = initSocket(user._id);
//     socketRef.current = socket;

//     if (!socket) return;

//     const handleNewNotification = (data) => {
//       const notif = {
//         _id: data._id || data.id || `${Date.now()}-${Math.random()}`,
//         title:
//           data.type === "followup"
//             ? "Follow-up Reminder"
//             : data.type === "activity" || data.type === "admin"
//             ? "Activity Reminder"
//             : "Notification",
//         text:         data.text,
//         read:         false,
//         profileImage: data.profileImage || null,
//         createdAt:    data.createdAt || new Date().toISOString(),
//         meta:         data.meta || {},
//         type:         data.type || "notification",
//       };

//       setNotifications((prev) => {
//         // Deduplicate — socket flush on reconnect can re-deliver
//         if (prev.some((n) => String(n._id) === String(notif._id))) return prev;
//         return [notif, ...prev];
//       });
//     };

//     const handleNotificationDeleted = (data) => {
//       const { ids } = data;
//       if (Array.isArray(ids) && ids.length > 0) {
//         setNotifications((prev) =>
//           prev.filter((n) => !ids.includes(String(n._id)))
//         );
//       }
//     };

//     socket.on("new_notification",    handleNewNotification);
//     socket.on("activity_reminder",   handleNewNotification);
//     socket.on("admin_reminder",      handleNewNotification);
//     socket.on("notification_deleted", handleNotificationDeleted);

//     return () => {
//       socket.off("new_notification",    handleNewNotification);
//       socket.off("activity_reminder",   handleNewNotification);
//       socket.off("admin_reminder",      handleNewNotification);
//       socket.off("notification_deleted", handleNotificationDeleted);
//     };
//   }, [user?._id, API_URL]);

//   return (
//     <NotificationContext.Provider value={{ notifications, setNotifications }}>
//       {children}
//     </NotificationContext.Provider>
//   );
// };

// export const useNotifications = () => useContext(NotificationContext);//all finally working correct code..




// context/NotificationContext.jsx
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { initSocket } from "../utils/socket";
import axios from "axios";

const NotificationContext = createContext();

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns true if a notification should be shown:
 *  1. createdAt must be today (>= midnight of the current calendar day)
 *  2. expiresAt must not have passed (or be absent)
 */
const isValidNotification = (n) => {
  const now = new Date();

  // Midnight of today
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  // Rule 1 — created today
  const createdAt = n.createdAt ? new Date(n.createdAt) : null;
  if (!createdAt || createdAt < startOfToday) return false;

  // Rule 2 — not expired
  if (n.expiresAt) {
    const expiresAt = new Date(n.expiresAt);
    if (expiresAt <= now) return false;
  }

  return true;
};

// ─── Provider ────────────────────────────────────────────────────────────────

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL;

  // Read user fresh on every render (handles login/logout)
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (!user?._id) {
      setNotifications([]);
      return;
    }

    // ─── 1. Fetch existing notifications from server ────────────────────────
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_URL}/notifications/${user._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // The server already applies today + expiry filters.
        // Apply the same guard on the client as a safety net in case of
        // clock skew or stale cache responses.
        const fetched = (Array.isArray(response.data) ? response.data : [])
          .filter(isValidNotification);

        setNotifications((prev) => {
          const all = [...prev, ...fetched];
          const unique = Array.from(
            new Map(all.map((n) => [String(n._id), n])).values()
          );
          return unique
            .filter(isValidNotification) // re-validate the merged list
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        });
      } catch (error) {
        console.error(
          "Failed to fetch notifications:",
          error?.response?.data || error.message
        );
      }
    };

    fetchNotifications();

    // ─── 2. Socket.IO real-time listeners ──────────────────────────────────
    const socket = initSocket(user._id);
    socketRef.current = socket;

    if (!socket) return;

    const handleNewNotification = (data) => {
      const notif = {
        _id:          data._id || data.id || `${Date.now()}-${Math.random()}`,
        title:
          data.type === "followup"
            ? "Follow-up Reminder"
            : data.type === "activity" || data.type === "admin"
            ? "Activity Reminder"
            : "Notification",
        text:         data.text,
        read:         false,
        profileImage: data.profileImage || null,
        createdAt:    data.createdAt || new Date().toISOString(),
        expiresAt:    data.expiresAt  || null,
        meta:         data.meta || {},
        type:         data.type || "notification",
      };

      // ✅ KEY FIX: Reject socket notifications from past days or already expired
      if (!isValidNotification(notif)) {
        console.log("🚫 Rejected stale/expired socket notification:", notif._id);
        return;
      }

      setNotifications((prev) => {
        // Deduplicate — socket flush on reconnect can re-deliver
        if (prev.some((n) => String(n._id) === String(notif._id))) return prev;
        return [notif, ...prev];
      });
    };

    const handleNotificationDeleted = (data) => {
      const { ids } = data;
      if (Array.isArray(ids) && ids.length > 0) {
        setNotifications((prev) =>
          prev.filter((n) => !ids.includes(String(n._id)))
        );
      }
    };

    socket.on("new_notification",     handleNewNotification);
    socket.on("activity_reminder",    handleNewNotification);
    socket.on("admin_reminder",       handleNewNotification);
    socket.on("notification_deleted", handleNotificationDeleted);

    return () => {
      socket.off("new_notification",     handleNewNotification);
      socket.off("activity_reminder",    handleNewNotification);
      socket.off("admin_reminder",       handleNewNotification);
      socket.off("notification_deleted", handleNotificationDeleted);
    };
  }, [user?._id, API_URL]);

  // ─── Periodic cleanup: drop expired notifications from state ────────────
  // Runs every minute so that a notification which expires while the page
  // is open disappears without a full reload.
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications((prev) => {
        const filtered = prev.filter(isValidNotification);
        // Only trigger a re-render if something was actually removed
        return filtered.length === prev.length ? prev : filtered;
      });
    }, 60_000); // every 60 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);