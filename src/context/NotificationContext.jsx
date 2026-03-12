


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

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user?._id) return;

    const socket = initSocket(user._id);
    if (!socket) return;

    // ---- Handle new notifications ----
    const handleNewNotification = (data) => {
      const notif = {
        _id: data._id || data.id || Date.now() + Math.random(),
        title:
          data.type === "followup"
            ? "Follow-up Reminder"
            : data.type === "activity" || data.type === "admin"
            ? "Activity Reminder"
            : "Notification",
        text: data.text,
        read: false,
        profileImage: data.profileImage || "/default-avatar.png",
        createdAt: data.createdAt || new Date().toISOString(),
        meta: data.meta || {},
        type: data.type || "notification",
      };

      setNotifications((prev) => {
        if (notif._id && prev.some((n) => n._id === notif._id)) return prev;
        return [notif, ...prev];
      });
    };

    // ---- Handle deleted notifications ----
    const handleNotificationDeleted = (data) => {
      const { ids } = data; // array of deleted notification IDs
      if (Array.isArray(ids) && ids.length > 0) {
        setNotifications((prev) =>
          prev.filter((n) => !ids.includes(n._id))
        );
      }
    };

    socket.on("new_notification", handleNewNotification);
    socket.on("activity_reminder", handleNewNotification);
    socket.on("admin_reminder", handleNewNotification);
    socket.on("notification_deleted", handleNotificationDeleted); // <-- new listener

    return () => {
      socket.off("new_notification", handleNewNotification);
      socket.off("activity_reminder", handleNewNotification);
      socket.off("admin_reminder", handleNewNotification);
      socket.off("notification_deleted", handleNotificationDeleted);
    };
  }, [user?._id]);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);