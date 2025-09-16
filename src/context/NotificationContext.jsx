// import { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";
// import { getSocket } from "../utils/socket"; 
// import { toast } from "react-toastify";

// const NotificationContext = createContext();

// export const NotificationProvider = ({ children }) => {
//   const API_URL = import.meta.env.VITE_API_URL;
//   const [notifications, setNotifications] = useState([]);
//   const user = JSON.parse(localStorage.getItem("user"));

//   useEffect(() => {
//     if (!user?._id) return;

//     // Fetch notifications from backend
//     const fetchNotifications = async () => {
//       try {
//         const res = await axios.get(`${API_URL}/notification/${user._id}`);
//         const data = res.data || [];
        
//         // Ensure all notifications have _id and default profile image
//         const normalized = data.map((n) => ({
//           _id: n._id || n.id || Date.now() + Math.random(),
//           title: n.type === "followup" ? "Follow-up Reminder" :
//                  n.type === "activity" || n.type === "admin" ? "Activity Reminder" :
//                  "Notification",
//           text: n.text,
//           read: !!n.read,
//           profileImage: n.profileImage || "/default-avatar.png",
//           createdAt: n.createdAt || new Date().toISOString(),
//           meta: n.meta || {},
//           type: n.type || "notification",
//         }));

//         setNotifications(normalized);
//       } catch (err) {
//         console.error("Error fetching notifications:", err);
//       }
//     };
//     fetchNotifications();

//     // Setup socket listener
//     const socket = getSocket();
//     if (!socket) {
//       console.log("NotificationProvider: socket not initialized yet");
//       return;
//     }

//     const handleNewNotification = (data) => {
//       const notif = {
//         _id: data._id || data.id || Date.now() + Math.random(),
//         title: data.type === "followup" ? "Follow-up Reminder" :
//                data.type === "activity" || data.type === "admin" ? "Activity Reminder" :
//                "Notification",
//         text: data.text,
//         read: false,
//         profileImage: data.profileImage || "/default-avatar.png",
//         createdAt: data.createdAt || new Date().toISOString(),
//         meta: data.meta || {},
//         type: data.type || "notification",
//       };

//       // Deduplicate by _id
//       setNotifications((prev) => {
//         const exists = prev.some((n) => n._id === notif._id);
//         if (exists) return prev;
//         return [notif, ...prev];
//       });

//       toast.info(notif.text);
//     };

//     socket.on("new_notification", handleNewNotification);
//     return () => socket.off("new_notification", handleNewNotification);
//   }, [user?._id]);

//   return (
//     <NotificationContext.Provider value={{ notifications, setNotifications }}>
//       {children}
//     </NotificationContext.Provider>
//   );
// };

// export const useNotifications = () => useContext(NotificationContext);


import { createContext, useContext, useState, useEffect } from "react";
import { initSocket } from "../utils/socket";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user?._id) return;

    // ✅ Initialize socket here instead of App.jsx
    const socket = initSocket(user._id);
    if (!socket) return;

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

export const useNotifications = () => useContext(NotificationContext);
