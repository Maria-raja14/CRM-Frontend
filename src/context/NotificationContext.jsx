


// import { createContext, useContext, useState, useEffect } from "react";
// import { initSocket } from "../utils/socket";

// const NotificationContext = createContext();

// export const NotificationProvider = ({ children }) => {
//   const [notifications, setNotifications] = useState([]);
//   const user = JSON.parse(localStorage.getItem("user"));

//   useEffect(() => {
//     if (!user?._id) return;

//     // ✅ Initialize socket here instead of App.jsx
//     const socket = initSocket(user._id);
//     if (!socket) return;

//     const handleNewNotification = (data) => {
//       const notif = {
//         _id: data._id || data.id || Date.now() + Math.random(),
//         title:
//           data.type === "followup"
//             ? "Follow-up Reminder"
//             : data.type === "activity" || data.type === "admin"
//             ? "Activity Reminder"
//             : "Notification",
//         text: data.text,
//         read: false,
//         profileImage: data.profileImage || "/default-avatar.png",
//         createdAt: data.createdAt || new Date().toISOString(),
//         meta: data.meta || {},
//         type: data.type || "notification",
//       };

//       setNotifications((prev) => {
//         if (notif._id && prev.some((n) => n._id === notif._id)) return prev;
//         return [notif, ...prev];
//       });
//     };

//     socket.on("new_notification", handleNewNotification);
//     socket.on("activity_reminder", handleNewNotification);
//     socket.on("admin_reminder", handleNewNotification);

//     return () => {
//       socket.off("new_notification", handleNewNotification);
//       socket.off("activity_reminder", handleNewNotification);
//       socket.off("admin_reminder", handleNewNotification);
//     };
//   }, [user?._id]);

//   return (
//     <NotificationContext.Provider value={{ notifications, setNotifications }}>
//       {children}
//     </NotificationContext.Provider>
//   );
// };

// export const useNotifications = () => useContext(NotificationContext);
// //original


import { createContext, useContext, useState, useEffect } from "react";
import { initSocket } from "../utils/socket";
import axios from "axios";

const NotificationContext = createContext();

const STORAGE_KEY = "crm_notifications";

// ── helpers ──────────────────────────────────────────────────────
const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (notifications) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch {
    // storage quota exceeded — silently ignore
  }
};

const buildNotif = (data) => ({
  _id: data._id || data.id || Date.now() + Math.random(),
  title:
    data.type === "followup"
      ? "Follow-up Reminder"
      : data.type === "activity" || data.type === "admin"
      ? "Activity Reminder"
      : "Notification",
  text: data.text,
  read: data.read ?? false,
  profileImage: data.profileImage || "/default-avatar.png",
  createdAt: data.createdAt || new Date().toISOString(),
  meta: data.meta || {},
  type: data.type || "notification",
});
// ─────────────────────────────────────────────────────────────────

export const NotificationProvider = ({ children }) => {
  // ✅ Seed state from localStorage so refresh doesn't wipe everything
  const [notifications, setNotificationsRaw] = useState(loadFromStorage);

  const user = JSON.parse(localStorage.getItem("user"));
  const API_URL = import.meta.env.VITE_API_URL;

  // ✅ Wrapper that always keeps localStorage in sync
  const setNotifications = (updater) => {
    setNotificationsRaw((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveToStorage(next);
      return next;
    });
  };

  // ✅ Fetch persisted notifications from the API on mount
  useEffect(() => {
    if (!user?._id || !API_URL) return;

    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/notification/${user._id}`);
        const fetched = (Array.isArray(data) ? data : data.notifications ?? [])
          .map(buildNotif);

        // Merge: API is source-of-truth; keep any local-only (socket) ones
        // that haven't arrived from the API yet
        setNotifications((prev) => {
          const apiIds = new Set(fetched.map((n) => String(n._id)));
          const localOnly = prev.filter((n) => !apiIds.has(String(n._id)));
          const merged = [...fetched, ...localOnly].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          return merged;
        });
      } catch (err) {
        // Network error — already have localStorage data, so just log
        console.warn("Could not fetch notifications from API:", err.message);
      }
    };

    fetchNotifications();
  }, [user?._id]);

  // ✅ Socket: real-time new notifications
  useEffect(() => {
    if (!user?._id) return;

    const socket = initSocket(user._id);
    if (!socket) return;

    const handleNewNotification = (data) => {
      const notif = buildNotif(data);
      setNotifications((prev) => {
        if (notif._id && prev.some((n) => String(n._id) === String(notif._id)))
          return prev;
        return [notif, ...prev];
      });
    };

    socket.on("new_notification", handleNewNotification);
    socket.on("activity_reminder", handleNewNotification);
    socket.on("admin_reminder", handleNewNotification);

    return () => {
      socket.off("new_notification", handleNewNotification);
      socket.off("activity_reminder", handleNewNotification);
      socket.off("admin_reminder", handleNewNotification);
    };
  }, [user?._id]);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);//work..