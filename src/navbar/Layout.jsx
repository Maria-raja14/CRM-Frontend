


// import React, { useState } from "react";
// import Sidebar from "../navbar/sidebar";
// import Header from "../navbar/header";
// import { Outlet } from "react-router-dom";

// const Layout = ({ isModalOpen }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   return (
//     <div className="flex h-screen overflow-hidden">
//       {/* Sidebar */}
//       <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Header toggleSidebar={toggleSidebar} />

//         <div className={`flex-1 overflow-auto p-6 ${isModalOpen ? "backdrop-blur-md pointer-events-none" : ""}`}>
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Layout;


import React, { useState } from "react";
import Sidebar from "../navbar/Sidebar";
import Navbar from "./header";
import { Outlet } from "react-router-dom";

const Layout = ({ isModalOpen }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // 👈 Sidebar default visible

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      {sidebarOpen && ( // 👈 Toggle show/hide
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />

        <div
          className={`flex-1 overflow-auto p-6 ${
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
