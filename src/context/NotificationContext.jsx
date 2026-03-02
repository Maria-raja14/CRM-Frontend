import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { initSocket } from "../utils/socket";
import { toast } from "react-toastify";

// Create the context
const NotificationContext = createContext(null);

// Custom hook to use the notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const socket = initSocket();

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



    // Handle new notifications from socket
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
        meta: {
          ...(data.meta || {}),
        },
        type: data.type || "notification",
      };

      setNotifications((prev) => {
        // Check if notification already exists
        const exists = prev.some((n) => n._id === notif._id);
        if (exists) return prev;
        
        // Add new notification at the beginning
        return [notif, ...prev];
      });

      // Show toast with appropriate icon
      let icon = '🔔';
      if (data.meta?.leadId) icon = '📅';
      else if (data.meta?.dealId) icon = '📊';
      else if (data.meta?.proposalId) icon = '📄';
      
      toast.info(displayText, {
        position: "top-right",
        autoClose: 5000,
        icon: icon
      });
    };

    // Listen for all notification events
    socket.on("new_notification", handleNewNotification);
    socket.on("followup_reminder", handleNewNotification);

    return () => {
      socket.off("new_notification", handleNewNotification);
      socket.off("followup_reminder", handleNewNotification);
    };
  }, [user?._id, API_URL]);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_URL}/notification/read/${notificationId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await Promise.all(
        notifications
          .filter((n) => !n.read)
          .map((n) =>
            axios.patch(
              `${API_URL}/notification/read/${n._id}`,
              {},
              { headers: { Authorization: `Bearer ${token}` } }
            )
          )
      );
      
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/notification/${notificationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotifications((prev) =>
        prev.filter((n) => n._id !== notificationId)
      );
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      await Promise.all(
        notifications.map((n) =>
          axios.delete(`${API_URL}/notification/${n._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        )
      );
      
      setNotifications([]);
    } catch (err) {
      console.error("Error clearing notifications:", err);
    }
  };

  const value = {
    notifications,
    setNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    unreadCount: notifications.filter((n) => !n.read).length,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};