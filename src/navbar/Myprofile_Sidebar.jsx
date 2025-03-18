// import React from "react";
// import { FaUser } from "react-icons/fa";
// import { Link } from "react-router-dom";

// const Sidebar = () => {
//   return (
//     <div className="w-64 h-screen flex flex-col items-start p-6">
//       <div className="w-full flex flex-col items-center py-6">
//         <div className="bg-gray-100 p-4 rounded-full flex items-center justify-center">
//           <FaUser className="text-blue-500 text-2xl" />
//         </div>
//       </div>
//       <nav className="w-full mt-2">
//         <ul className="space-y-4">
//           <li>
//             <Link to="/myprofile" className="text-blue-500 font-medium">
//               Personal Info
//             </Link>
//           </li>
//           <li>
//             <Link to="/myprofile/passwordchange" className="text-gray-500 hover:text-blue-500">
//               Password Change
//             </Link>
//           </li>
//           <li className="text-gray-500 hover:text-blue-500 cursor-pointer">
//             Activity Logs
//           </li>
//           <li>
//             <Link to="/myprofile/social-links" className="text-gray-500 hover:text-blue-500">
//               Social Links
//             </Link>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;


import React from "react";
import { FaUser } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/myprofile", label: "Personal Info" },
    { path: "/myprofile/passwordchange", label: "Password Change" },
    // { path: "/myprofile/activity-logs", label: "Activity Logs" },
    { path: "/myprofile/social-links", label: "Social Links" },
  ];

  return (
    <div className="w-64 h-screen flex flex-col items-start p-6">
      <div className="w-full flex flex-col items-center py-6">
        <div className="bg-gray-100 p-4 rounded-full flex items-center justify-center">
          <FaUser className="text-blue-500 text-2xl" />
        </div>
      </div>
      <nav className="w-full mt-2">
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center justify-between ${
                  location.pathname === item.path
                    ? "text-blue-500 font-bold"
                    : "text-gray-500 hover:text-blue-500"
                }`}
              >
                <span>{item.label}</span>
                {location.pathname === item.path && <FaArrowRight className="text-blue-500" />}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
