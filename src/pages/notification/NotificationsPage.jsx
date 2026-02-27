

import React, { useState, useEffect } from "react";
import { useNotifications } from "../../context/NotificationContext";
import { formatDistanceToNow, differenceInHours } from "date-fns";
import { Bell, Trash2, Clock, CheckCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const NotificationsPage = () => {
  const { notifications, setNotifications } = useNotifications();
  const [deletingId, setDeletingId] = useState(null);
  const location = useLocation();
  const initialFilter = location.state?.filter || "all";
  const [filter, setFilter] = useState(initialFilter);
  const API_URL = import.meta.env.VITE_API_URL;
  const API_SI = import.meta.env.VITE_SI_URI;

  useEffect(() => {
    if (!location.state?.filter) setFilter("all");
  }, [location.state]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`${API_URL}/notification/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success("Notification deleted successfully");
    } catch (err) {
      toast.error("Failed to delete notification");
    } finally {
      setTimeout(() => setDeletingId(null), 300);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`${API_URL}/notification/read/${id}`, { read: true });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      toast.success("Marked as read");
    } catch (err) {
      toast.error("Failed to mark as read");
    }
  };

  // Filter notifications by type
  let filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "followup") return n.type === "followup";
    if (filter === "activity") return n.type === "activity" || n.type === "admin";
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  // Sort unread first
  filteredNotifications = filteredNotifications.sort((a, b) =>
    a.read === b.read ? 0 : a.read ? 1 : -1
  );

  return (
    <div className="w-full mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <Bell className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
              Notifications
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Stay updated with your alerts
            </p>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          {notifications.length > 0 && (
            <>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {notifications.filter((n) => !n.read).length}
                </span>{" "}
                unread
              </div>

              <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 shadow-inner">
                {["all", "unread", "read"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilter(t)}
                    className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                      filter === t
                        ? t === "unread"
                          ? "bg-blue-100 dark:bg-blue-900/40 shadow-sm font-medium text-blue-700 dark:text-blue-300"
                          : t === "read"
                          ? "bg-green-100 dark:bg-green-900/40 shadow-sm font-medium text-green-700 dark:text-green-300"
                          : "bg-white dark:bg-gray-700 shadow-sm font-medium text-gray-800 dark:text-gray-200"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tabs for type */}
      <div className="flex gap-2 mb-4">
        {["all", "followup", "activity"].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              filter === t
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            {t === "all" ? "All" : t === "followup" ? "Lead follow-ups" : "Activity follow-ups"}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((n) => {
            const createdAt = new Date(n.createdAt);
            const expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
            const hoursLeft = differenceInHours(expiresAt, new Date());
            const isExpired = hoursLeft <= 0;

            return (
              <div
                key={n._id}
                className={`relative group p-5 rounded-2xl transition-all duration-300 border ${
                  n.read
                    ? "bg-white dark:bg-gray-800/70 border-gray-200 dark:border-gray-700/50 shadow-sm"
                    : "bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800/30 shadow-md"
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 relative mr-4">
                    <img
                      src={
                        n.profileImage
                          ? `${API_SI}/${n.profileImage.replace(/\\/g, "/")}`
                          : "/default-avatar.png"
                      }
                      alt={n.firstName || "User"}
                      className="w-8 h-8 rounded-full"
                    />
                    {!n.read && (
                      <div className="absolute -top-1 -right-1">
                        <div className="bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                          <div className="bg-blue-500 rounded-full w-2 h-2 animate-ping absolute"></div>
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p
                          className={`text-base font-semibold ${
                            n.read
                              ? "text-gray-700 dark:text-gray-200"
                              : "text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          {n.title || "Notification"}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 leading-relaxed">
                          {n.text}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDelete(n._id)}
                        disabled={deletingId === n._id}
                        className="ml-4 flex items-center justify-center p-2 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 rounded-xl transition-all duration-200 transform hover:scale-110"
                      >
                        {deletingId === n._id ? (
                          <div className="w-5 h-5 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Clock size={14} className="mr-1.5" />
                        {n.createdAt
                          ? formatDistanceToNow(createdAt, { addSuffix: true })
                          : "Just now"}
                      </div>

                      {!n.read && (
                        <button
                          onClick={() => markAsRead(n._id)}
                          className="flex items-center text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                        >
                          <CheckCircle size={14} className="mr-1.5" />
                          Mark as read
                        </button>
                      )}

                      <div
                        className={`flex items-center text-xs font-medium ${
                          isExpired ? "text-red-500" : "text-amber-500"
                        }`}
                      >
                        <Clock size={14} className="mr-1.5" />
                        {isExpired
                          ? "Expired"
                          : `Expires in ${hoursLeft} hour${hoursLeft > 1 ? "s" : ""}`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mb-4">
              <Bell size={30} className="text-gray-400 dark:text-gray-300" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              No notifications
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
