import React from "react";
import { useNotifications } from "../../context/NotificationContext";
import { formatDistanceToNow } from "date-fns";

const NotificationsPage = () => {
  const { notifications } = useNotifications();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
        All Notifications
      </h1>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n.id}
              className="flex items-start p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700"
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                <img
                  src={n.avatar || "https://randomuser.me/api/portraits/men/32.jpg"}
                  alt="avatar"
                  className="w-12 h-12 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                />
              </div>

              {/* Content */}
              <div className="ml-4 flex-1">
                <p className="text-gray-800 dark:text-gray-200 text-sm font-medium">
                  {n.title || "Notification"}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  {n.text}
                </p>

                {/* Time + Status */}
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-gray-400 text-xs">
                    {n.createdAt
                      ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })
                      : "Just now"}
                  </span>
                  {!n.read && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                      New
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-10">
            No notifications found.
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
