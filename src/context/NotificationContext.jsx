import { createContext, useContext, useState, useEffect } from "react";

import { useSocket } from "./SocketContext";



const NotificationContext = createContext();
const API_URL = import.meta.env.VITE_API_URL;

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  const socket = useSocket();

  // ✅ ADD THIS NEW useEffect RIGHT HERE (ABOVE SOCKET ONE)

  useEffect(() => {
    if (!user?._id) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${API_URL}/notification/${user._id}`);
        const data = await res.json();

        console.log("📦 Loaded notifications from DB:", data);

        setNotifications(data); // load saved notifications
      } catch (err) {
        console.error("❌ Failed to fetch notifications", err);
      }
    };

    fetchNotifications();
  }, [user?._id]);

  useEffect(() => {
    
    console.log("🧠 NotificationProvider mounted");
    console.log("👤 Frontend user ID:", user?._id);
    console.log("🔌 Socket from SocketContext:", socket);
    
    
    if (!user?._id || !socket) {
      console.log("⏳ Waiting for socket...");
      return;
    }


    socket.on("connect", () => {
      console.log("🟢 FRONTEND SOCKET CONNECTED:", socket.id);
    });
    socket.on("connect_error", (err) => {
      console.log("🔴 SOCKET CONNECT ERROR:", err.message, err);
    });



    const handleNewNotification = (data) => {
     
      
      console.log("📥 NEW NOTIFICATION RECEIVED:", data);
      const notif = {
        _id: data._id || data.id || Date.now() + Math.random(),
        title:
          data.type === "followup"
            ? "Follow-up Reminder"
            : data.type === "activity" || data.type === "admin"
            ? "Activity Reminder"
            : data.type === "contact_form"
            ? "Website Contact Form"
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
  }, [socket, user?._id]);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);