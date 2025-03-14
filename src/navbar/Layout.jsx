import React, { useState } from "react";
import Sidebar from "../navbar/sidebar";
import Header from "../navbar/header";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Page Content */}
        <div className="p-6 h-full overflow-auto  backdrop-blur-sm bg-gray-50">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
