import React, { useState } from "react";
import { Menu, User, LogOut, ChevronDown } from "react-feather";
import { useNavigate } from "react-router-dom"; // Import for navigation
import boy1 from '../../src/assets/boy1.png';

const Header = ({ toggleSidebar }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="w-full bg-white p-2 flex justify-between items-center shadow">
      {/* Toggle Button for Sidebar (Mobile) */}
      <button onClick={toggleSidebar} className="lg:hidden">
        <Menu size={24} className="text-gray-600" />
      </button>

      {/* Profile Section */}
      <div className="relative">
        <button
          className="flex items-center bg-white rounded-[12px] border border-gray-100 p-1 hover:bg-gray-100"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {/* Profile Picture */}
          <img src={boy1} alt="User Avatar" className="w-10 h-10 rounded-full object-cover" />

          {/* Employee Name */}
          <span className="text-gray-500 ml-2">
            Hi, MariaSoosai <span className="text-gray-500">(Employee) !</span>
          </span>

          {/* Dropdown Icon */}
          <ChevronDown size={16} className="text-gray-500 ml-1" />
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-44 bg-white shadow rounded-md p-2 border border-gray-200">
            <button className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded">
              <User size={18} className="text-gray-600" />
              <span>Profile</span>
            </button>
            <button
              onClick={handleLogout} // Call logout function
              className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded"
            >
              <LogOut size={18} className="text-gray-600" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
