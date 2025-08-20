import React, { useState } from "react";
import { Menu, User, Power, ChevronDown } from "react-feather";
import { Link, useNavigate } from "react-router-dom";  // ⬅️ navigate use panna import pannunga
import { disconnectSocket } from "../utils/socket";

const Navbar = ({ toggleSidebar }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate(); // ⬅️ navigate hook

const handleLogout = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?._id) {
    disconnectSocket(user._id);
  }
  localStorage.clear();
  navigate("/");
};


  return (
    <div className="w-full bg-white dark:bg-gray-900 dark:text-white p-3 flex justify-between items-center shadow-sm">
      {/* Sidebar Toggle (Mobile only) */}
      <button onClick={toggleSidebar} className="lg:hidden">
        <Menu size={24} className="text-gray-600 dark:text-gray-300" />
      </button>

      {/* User Dropdown */}
      <div className="relative">
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
            Hi, Jovince Felson <span className="text-gray-500">(Employee)</span>
          </span>
          <ChevronDown size={16} className="text-gray-600 dark:text-gray-300 ml-2" />
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

            {/* Logout Button */}
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
  );
};

export default Navbar;
