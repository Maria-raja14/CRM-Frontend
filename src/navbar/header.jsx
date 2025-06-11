import React, { useEffect, useState } from "react";
import { Menu, User, Power, ChevronDown, Sun, Moon } from "react-feather";
import { Link } from "react-router-dom";

const Navbar = ({ toggleSidebar }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // On mount, set the theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
<<<<<<< HEAD
    <div className=" bg-white p-2 flex md:justify-between items-center shadow">
      {/* Toggle Button for Sidebar (Mobile) */}
=======
    <div className="w-full bg-white dark:bg-gray-900 dark:text-white p-3 flex justify-between items-center shadow-sm">
>>>>>>> 12a703ec2fe2d9b162ffb03dbcc7545999855c3d
      <button onClick={toggleSidebar} className="lg:hidden">
        <Menu size={24} className="text-gray-600 dark:text-gray-300" />
      </button>

      {/* Toggle Light/Dark Mode Button */}
      <button
        onClick={toggleTheme}
        className="mr-4 bg-gray-100 dark:bg-gray-700 p-2 rounded-full"
        title="Toggle Theme"
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
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
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;



// import React, { useState } from "react";
// import { Menu, User, Power, ChevronDown } from "react-feather";
// import { Link } from "react-router-dom";

// const Navbar = ({ toggleSidebar }) => {
//   const [showDropdown, setShowDropdown] = useState(false);

//   return (
//     <div className="w-full bg-white p-3 flex justify-between items-center">
//       <button onClick={toggleSidebar} className="lg:hidden">
//         <Menu size={24} className="text-gray-600" />
//       </button>

     
//       <div className="relative">
//         <button
//           className="flex items-center bg-white rounded-xl border border-gray-200 px-1 py-1 shadow-sm hover:shadow-sm transition-all"
//           onClick={() => setShowDropdown(!showDropdown)}
//         >
         
//           <img
//             src="https://randomuser.me/api/portraits/men/32.jpg"
//             alt="User Avatar"
//             className="w-10 h-10 rounded-full object-cover border border-gray-300"
//           />

         
//           <span className="text-gray-700 ml-3 font-medium">
//             Hi, Jovince Felson   <span className="text-gray-500">(Employee)</span>
//           </span>

         
//           <ChevronDown size={16} className="text-gray-600 ml-2" />
//         </button>

       
//         {showDropdown && (
//           <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2 border border-gray-200 z-10">
//             <Link to="/dashboard/profile" className="flex items-center space-x-3 w-full p-3 hover:bg-gray-100 rounded-md">
//               <User size={18} className="text-gray-600" />
//               <span>Profile</span>
//             </Link>
//             <button className="flex items-center space-x-3 w-full p-3 hover:bg-gray-100 rounded-md">
//               <Power size={18} className="text-gray-600" />
//               <span>Logout</span>
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Navbar;