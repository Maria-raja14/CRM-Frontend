import React, { useEffect, useState } from "react";
import { Menu, User, Power, ChevronDown, Sun, Moon } from "react-feather";
import { Link } from "react-router-dom";

const Navbar = ({ toggleSidebar }) => {
  const [showDropdown, setShowDropdown] = useState(false);
 


  return (
    <div className="w-full bg-white dark:bg-gray-900 dark:text-white p-3 flex justify-between items-center shadow-sm">
      <button onClick={toggleSidebar} className="lg:hidden">
        <Menu size={24} className="text-gray-600 dark:text-gray-300" />
      </button>

     

      <div className="relative">
        <button
          className="flex items-center bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 px-1 py-1 shadow-sm hover:shadow transition-all"
          onClick={() => setShowDropdown(!showDropdown)}
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
            <button className="flex items-center space-x-3 w-full p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
              <Power size={18} className="text-gray-600 dark:text-gray-300" />
              <Link to="/">Logout</Link>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;



