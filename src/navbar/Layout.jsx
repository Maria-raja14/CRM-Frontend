import React, { useState } from "react";
import Sidebar from "../navbar/sidebar";
import Header from "../navbar/header";
import { Outlet } from "react-router-dom";

const Layout = ({ isModalOpen }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Page Content */}
        <div
          className={`p-6 h-full overflow-auto bg-gray-50 transition-all duration-300 ${
            isModalOpen ? "backdrop-blur-md pointer-events-none" : ""
          }`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
