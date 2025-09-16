// import React, { useState, useEffect, useRef } from "react";
// import { Menu, User, Power, ChevronDown, Bell } from "react-feather";
// import { Link, useNavigate } from "react-router-dom";
// import { useNotifications } from "../context/NotificationContext";
// import { disconnectSocket } from "../utils/socket";
// import { ShieldCheck } from "lucide-react";
// import PasswordUpdate from "../pages/password/PasswordUpdate";
// import { Maximize, Minimize } from "lucide-react"; // For fullscreen icons
// import { formatDistanceToNow } from "date-fns";
// const Navbar = ({ toggleSidebar }) => {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showPasswordModal, setShowPasswordModal] = useState(false);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const { notifications } = useNotifications();
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   const notificationRef = useRef(null);
//   const dropdownRef = useRef(null);
//   const API_SI = import.meta.env.VITE_SI_URI;
//   // Load user
//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem("user"));
//     if (storedUser) setUser(storedUser);
//   }, []);

//   // Logout
//   const handleLogout = () => {
//     disconnectSocket();
//     localStorage.clear();
//     navigate("/");
//   };

//   // Outside click detection
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         notificationRef.current &&
//         !notificationRef.current.contains(event.target)
//       ) {
//         setShowNotifications(false);
//       }
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Fullscreen toggle
//   const toggleFullscreen = () => {
//     if (!document.fullscreenElement) {
//       document.documentElement.requestFullscreen().catch((err) => {
//         console.error(`Error attempting to enable fullscreen: ${err.message}`);
//       });
//       setIsFullscreen(true);
//     } else {
//       document.exitFullscreen();
//       setIsFullscreen(false);
//     }
//   };

//   return (
//     <>
//       <div className="w-full bg-white dark:bg-gray-900 dark:text-white p-3 flex justify-between items-center shadow-sm border-b border-gray-200 dark:border-gray-700">
//         {/* Sidebar Toggle */}
//         <button
//           onClick={toggleSidebar}
//           className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//         >
//           <Menu size={24} className="text-gray-600 dark:text-gray-300" />
//         </button>

//         {/* Right Section */}
//         <div className="flex items-center space-x-4 relative">
//           {/* Fullscreen Toggle */}
//           <button
//             onClick={toggleFullscreen}
//             className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//           >
//             {isFullscreen ? (
//               <Minimize
//                 size={22}
//                 className="text-gray-600 dark:text-gray-300"
//               />
//             ) : (
//               <Maximize
//                 size={22}
//                 className="text-gray-600 dark:text-gray-300"
//               />
//             )}
//           </button>

//           {/* Notifications */}
//           <div className="relative" ref={notificationRef}>
//             <button
//               onClick={() => setShowNotifications(!showNotifications)}
//               className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 relative transition-colors"
//             >
//               <Bell size={22} className="text-gray-600 dark:text-gray-300" />
//               {notifications.filter((n) => !n.read).length > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
//                   {notifications.filter((n) => !n.read).length}
//                 </span>
//               )}
//             </button>
//             {showNotifications && (
//               <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
//                 <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 font-semibold text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-900">
//                   Notifications
//                 </div>
//                 <div className="max-h-96 overflow-y-auto">
//                   {notifications.length > 0 ? (
//                     notifications.map((n) => (
//                       <div
//                         key={n._id} // ✅ Use _id
//                         className="flex items-start px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-0"
//                       >
//                         <div className="flex-shrink-0">
//                           <img
//                             src={
//                               n.profileImage
//                                 ? `${API_SI}/${n.profileImage.replace(
//                                     /\\/g,
//                                     "/"
//                                   )}`
//                                 : "https://randomuser.me/api/portraits/men/32.jpg"
//                             }
//                             alt="avatar"
//                             className="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-gray-600"
//                           />
//                         </div>
//                         <div className="ml-3 flex-1">
//                           <p className="text-gray-700 dark:text-gray-200 text-sm font-medium">
//                             {n.title || "Notification"}
//                           </p>
//                           <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
//                             {n.text}
//                           </p>
//                           <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
//                             {formatDistanceToNow(new Date(n.createdAt), {
//                               addSuffix: true,
//                             })}{" "}
//                             {/* ✅ relative time */}
//                           </p>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="p-4 text-gray-500 text-sm text-center">
//                       No new notifications
//                     </div>
//                   )}
//                 </div>
//                 {notifications.length > 0 && (
//                   <Link
//                     to="/dashboard/notifications"
//                     onClick={() => setShowNotifications(false)}
//                     className="block text-center px-4 py-3 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-medium border-t border-gray-200 dark:border-gray-700"
//                   >
//                     View All Notifications
//                   </Link>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* User Dropdown */}
//           <div className="relative" ref={dropdownRef}>
//             <button
//               onClick={() => setShowDropdown(!showDropdown)}
//               className="flex items-center space-x-3 bg-white dark:bg-gray-800 rounded-xl px-4 py-2 shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               {/* User Avatar */}
//               <div className="relative">
//                 <img
//                   src="https://randomuser.me/api/portraits/men/32.jpg"
//                   alt="User Avatar"
//                   className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
//                 />
//                 {/* Optional Online Status */}
//                 <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full animate-pulse"></span>
//               </div>

//               {/* User Info */}
//               <div className="flex flex-col text-left hidden md:flex">
//                 <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
//                   {user?.name || "Guest"}
//                 </p>
//                 <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
//                   {user?.role?.name || "No Role"}
//                 </p>
//               </div>

//               {/* Dropdown Icon */}
//               <ChevronDown
//                 size={20}
//                 className={`text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
//                   showDropdown ? "rotate-180" : ""
//                 }`}
//               />
//             </button>

//             {showDropdown && (
//               <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 z-50">
//                 <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
//                   <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
//                     {user?.name || "Guest"}
//                   </p>
//                   <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
//                     {user?.email || "No email"}
//                   </p>
//                 </div>
//                 <div className="py-1">
//                   <button
//                     onClick={() => setShowPasswordModal(true)}
//                     className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
//                   >
//                     <ShieldCheck
//                       size={16}
//                       className="mr-3 text-gray-500 dark:text-gray-400"
//                     />
//                     <span>Password Update</span>
//                   </button>
//                   <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
//                   <button
//                     onClick={handleLogout}
//                     className="flex items-center w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors"
//                   >
//                     <Power size={16} className="mr-3" />
//                     <span>Logout</span>
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Password Update Modal */}
//       {showPasswordModal && (
//         <PasswordUpdate
//           isOpen={showPasswordModal}
//           onClose={() => setShowPasswordModal(false)}
//         />
//       )}
//     </>
//   );
// };

// export default Navbar;//org



import React, { useState, useEffect, useRef } from "react";
import { Menu, User, Power, ChevronDown, Bell } from "react-feather";
import { Link, useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";
import { disconnectSocket } from "../utils/socket";
import { ShieldCheck } from "lucide-react";
import PasswordUpdate from "../pages/password/PasswordUpdate";
import { Maximize, Minimize } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const Navbar = ({ toggleSidebar }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { notifications } = useNotifications();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const notificationRef = useRef(null);
  const dropdownRef = useRef(null);
  const API_SI = import.meta.env.VITE_SI_URI;

  // Load user
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  // Logout
  const handleLogout = () => {
    disconnectSocket();
    localStorage.clear();
    navigate("/");
  };

  // Outside click detection
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Function to get profile image URL
  const getProfileImageUrl = (profileImage) => {
    if (!profileImage) return "https://randomuser.me/api/portraits/men/32.jpg";
    
    if (profileImage.startsWith('http')) {
      return profileImage;
    }
    
    return `${API_SI}/${profileImage.replace(/\\/g, "/")}`;
  };

  return (
    <>
      <div className="w-full bg-white dark:bg-gray-900 dark:text-white p-3 flex justify-between items-center shadow-sm border-b border-gray-200 dark:border-gray-700">
        {/* Sidebar Toggle */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Menu size={24} className="text-gray-600 dark:text-gray-300" />
        </button>

        {/* Right Section */}
        <div className="flex items-center space-x-4 relative">
          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isFullscreen ? (
              <Minimize
                size={22}
                className="text-gray-600 dark:text-gray-300"
              />
            ) : (
              <Maximize
                size={22}
                className="text-gray-600 dark:text-gray-300"
              />
            )}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 relative transition-colors"
            >
              <Bell size={22} className="text-gray-600 dark:text-gray-300" />
              {notifications.filter((n) => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {notifications.filter((n) => !n.read).length}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 font-semibold text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-900">
                  Notifications
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        className="flex items-start px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-0"
                      >
                        <div className="flex-shrink-0">
                          <img
                            src={getProfileImageUrl(n.profileImage)}
                            alt="avatar"
                            className="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                          />
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-gray-700 dark:text-gray-200 text-sm font-medium">
                            {n.title || "Notification"}
                          </p>
                          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                            {n.text}
                          </p>
                          <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
                            {formatDistanceToNow(new Date(n.createdAt), {
                              addSuffix: true,
                            })}
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
                {notifications.length > 0 && (
                  <Link
                    to="/dashboard/notifications"
                    onClick={() => setShowNotifications(false)}
                    className="block text-center px-4 py-3 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-medium border-t border-gray-200 dark:border-gray-700"
                  >
                    View All Notifications
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-3 bg-white dark:bg-gray-800 rounded-xl px-4 py-2 shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {/* User Avatar */}
              <div className="relative">
                <img
                  src={getProfileImageUrl(user?.profileImage)}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                />
                {/* Optional Online Status */}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full animate-pulse"></span>
              </div>

              {/* User Info */}
              <div className="flex flex-col text-left hidden md:flex">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  {user?.name || "Guest"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {user?.role?.name || "No Role"}
                </p>
              </div>

              {/* Dropdown Icon */}
              <ChevronDown
                size={20}
                className={`text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 z-50">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {user?.name || "Guest"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email || "No email"}
                  </p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <ShieldCheck
                      size={16}
                      className="mr-3 text-gray-500 dark:text-gray-400"
                    />
                    <span>Password Update</span>
                  </button>
                  <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Power size={16} className="mr-3" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Password Update Modal */}
      {showPasswordModal && (
        <PasswordUpdate
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </>
  );
};

export default Navbar;