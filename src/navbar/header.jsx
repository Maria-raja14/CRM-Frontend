

import React, { useState, useEffect, useRef } from "react";
import { Menu, User, Power, ChevronDown, Bell } from "react-feather";
import { Link, useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";
import { disconnectSocket } from "../utils/socket";

const Navbar = ({ toggleSidebar }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications } = useNotifications();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 🔹 Refs for outside click detection
  const notificationRef = useRef(null);
  const dropdownRef = useRef(null);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleLogout = () => {
    disconnectSocket();
    localStorage.clear();
    navigate("/");
  };

  // 🔹 Outside click handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full bg-white dark:bg-gray-900 dark:text-white p-3 flex justify-between items-center shadow-sm">
      {/* Sidebar Toggle */}
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Menu size={24} className="text-gray-600 dark:text-gray-300" />
      </button>

      {/* Right Section */}
      <div className="flex items-center space-x-4 relative">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 relative"
          >
            <Bell size={22} className="text-gray-600 dark:text-gray-300" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 font-semibold text-gray-800 dark:text-gray-100">
                Notifications
              </div>

              {/* Notification list */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className="flex items-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all cursor-pointer"
                    >
                      <div className="flex-shrink-0">
                        <img
                          src={
                            n.avatar ||
                            "https://randomuser.me/api/portraits/men/32.jpg"
                          }
                          alt="avatar"
                          className="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-gray-700 dark:text-gray-200 text-sm font-medium">
                          {n.title || "Notification"}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                          {n.text}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-gray-500 text-sm text-center">
                    No new notifications
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <Link
                  to="/dashboard/notifications"
                  className="block text-center px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all font-medium"
                >
                  View All
                </Link>
              )}
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 px-1 py-1 shadow-sm hover:shadow transition-all"
          >
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-gray-500"
            />
            <span className="text-gray-700 dark:text-gray-200 ml-3 font-medium">
              Hi, {user?.name || "Guest"}{" "}
              <span className="text-gray-500">
                ({user?.role?.name || "No Role"})
              </span>
            </span>
            <ChevronDown
              size={16}
              className="text-gray-600 dark:text-gray-300 ml-2"
            />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 border border-gray-200 dark:border-gray-600 z-10">
              <Link
                to="/dashboard/profile"
                className="flex items-center space-x-3 w-full p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <User size={18} className="text-gray-600 dark:text-gray-300" />
                <span>Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-left"
              >
                <Power size={18} className="text-gray-600 dark:text-gray-300" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;




