


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




// import { createContext, useContext, useState, useEffect } from "react";
// import { initSocket } from "../utils/socket";

// const NotificationContext = createContext();

// export const NotificationProvider = ({ children }) => {
//   const [notifications, setNotifications] = useState([]);
//   const user = JSON.parse(localStorage.getItem("user"));

//   useEffect(() => {
//     if (!user?._id) return;

//     const socket = initSocket(user._id);
//     if (!socket) return;

//     // ---- Handle new notifications ----
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

//     // ---- Handle deleted notifications ----
//     const handleNotificationDeleted = (data) => {
//       const { ids } = data; // array of deleted notification IDs
//       if (Array.isArray(ids) && ids.length > 0) {
//         setNotifications((prev) =>
//           prev.filter((n) => !ids.includes(n._id))
//         );
//       }
//     };

//     socket.on("new_notification", handleNewNotification);
//     socket.on("activity_reminder", handleNewNotification);
//     socket.on("admin_reminder", handleNewNotification);
//     socket.on("notification_deleted", handleNotificationDeleted); // <-- new listener

//     return () => {
//       socket.off("new_notification", handleNewNotification);
//       socket.off("activity_reminder", handleNewNotification);
//       socket.off("admin_reminder", handleNewNotification);
//       socket.off("notification_deleted", handleNotificationDeleted);
//     };
//   }, [user?._id]);

//   return (
//     <NotificationContext.Provider value={{ notifications, setNotifications }}>
//       {children}
//     </NotificationContext.Provider>
//   );
// };

// export const useNotifications = () => useContext(NotificationContext);//all work perfectly..



// import { createContext, useContext, useState, useEffect } from "react";
// import { initSocket } from "../utils/socket";
// import axios from "axios";

// const NotificationContext = createContext();

// export const NotificationProvider = ({ children }) => {
//   const [notifications, setNotifications] = useState([]);
//   const user = JSON.parse(localStorage.getItem("user"));

//   const API_URL = import.meta.env.VITE_API_URL; // adjust to your env variable

//   useEffect(() => {
//     // Clear notifications if no user is logged in
//     if (!user?._id) {
//       setNotifications([]);
//       return;
//     }

//     // 1. Fetch existing notifications from the server
//     const fetchNotifications = async () => {
//       try {
//         // Replace with your actual endpoint – adjust as needed
//         const response = await axios.get(`${API_URL}/notifications?userId=${user._id}`);
//         const fetched = response.data;

//         setNotifications((prev) => {
//           // Combine existing notifications (possibly from socket) with fetched ones
//           const all = [...prev, ...fetched];
//           // Deduplicate by _id
//           const unique = Array.from(new Map(all.map((n) => [n._id, n])).values());
//           // Sort by createdAt descending (newest first)
//           return unique.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//         });
//       } catch (error) {
//         console.error("Failed to fetch notifications", error);
//       }
//     };

//     fetchNotifications();

//     // 2. Set up Socket.IO listeners for real‑time updates
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
//         // Avoid duplicate if the same notification arrives via socket after fetch
//         if (prev.some((n) => n._id === notif._id)) return prev;
//         return [notif, ...prev];
//       });
//     };

//     const handleNotificationDeleted = (data) => {
//       const { ids } = data; // array of deleted notification IDs
//       if (Array.isArray(ids) && ids.length > 0) {
//         setNotifications((prev) => prev.filter((n) => !ids.includes(n._id)));
//       }
//     };

//     socket.on("new_notification", handleNewNotification);
//     socket.on("activity_reminder", handleNewNotification);
//     socket.on("admin_reminder", handleNewNotification);
//     socket.on("notification_deleted", handleNotificationDeleted);

//     return () => {
//       socket.off("new_notification", handleNewNotification);
//       socket.off("activity_reminder", handleNewNotification);
//       socket.off("admin_reminder", handleNewNotification);
//       socket.off("notification_deleted", handleNotificationDeleted);
//     };
//   }, [user?._id, API_URL]); // API_URL is stable, but included for completeness

//   return (
//     <NotificationContext.Provider value={{ notifications, setNotifications }}>
//       {children}
//     </NotificationContext.Provider>
//   );
// };

// export const useNotifications = () => useContext(NotificationContext);//all come perfectly work fine..



import { createContext, useContext, useState, useEffect, useRef } from "react";
import { initSocket } from "../utils/socket";
import axios from "axios";

const NotificationContext = createContext();

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

    // ─── 1. Fetch existing notifications from server ────────────────────
    // ✅ FIX: Use /:userId path param — NOT ?userId= query string
    // Route is:  GET /api/notifications/:userId
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_URL}/notifications/${user._id}`,   // ← FIXED URL
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const fetched = Array.isArray(response.data) ? response.data : [];

        setNotifications((prev) => {
          const all = [...prev, ...fetched];
          const unique = Array.from(
            new Map(all.map((n) => [String(n._id), n])).values()
          );
          return unique.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
        });
      } catch (error) {
        console.error("Failed to fetch notifications:", error?.response?.data || error.message);
      }
    };

    fetchNotifications();

    // ─── 2. Socket.IO real-time listeners ──────────────────────────────
    const socket = initSocket(user._id);
    socketRef.current = socket;

    if (!socket) return;

    const handleNewNotification = (data) => {
      const notif = {
        _id: data._id || data.id || `${Date.now()}-${Math.random()}`,
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
        meta:         data.meta || {},
        type:         data.type || "notification",
      };

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

    socket.on("new_notification",    handleNewNotification);
    socket.on("activity_reminder",   handleNewNotification);
    socket.on("admin_reminder",      handleNewNotification);
    socket.on("notification_deleted", handleNotificationDeleted);

    return () => {
      socket.off("new_notification",    handleNewNotification);
      socket.off("activity_reminder",   handleNewNotification);
      socket.off("admin_reminder",      handleNewNotification);
      socket.off("notification_deleted", handleNotificationDeleted);
    };
  }, [user?._id, API_URL]);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);