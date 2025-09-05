


// // components/Sidebar.jsx
// import React, { useState, useEffect } from "react";
// import {
//   Home,
//   ChevronRight,
//   X,
//   User,
//   Tag,
//   List,
//   Calendar,
//   Shield,
// } from "react-feather";
// import { NavLink, useLocation } from "react-router-dom";

// const IconCircle = ({ children, isActive }) => (
//   <div className="w-10 h-10 flex items-center justify-center rounded-full shadow-sm bg-white">
//     {/* Icon color changes based on active state */}
//     {React.cloneElement(children, {
//       color: isActive ? "#008ecc" : "#1f1f1f",
//     })}
//   </div>
// );

// const SidebarItem = ({
//   to,
//   icon,
//   label,
//   exact = false,
//   onClick,
//   hasPermission = true,
// }) => {
//   if (!hasPermission) return null;

//   return (
//     <NavLink
//       to={to}
//       end={exact}
//       onClick={onClick}
//       className={({ isActive }) =>
//         `flex items-center justify-between w-full p-3 rounded-full transition-all duration-300
//         ${isActive ? "bg-[#f2fbff]" : "hover:bg-[#f8f9fb]"}`
//       }
//     >
//       <div className="flex items-center space-x-3">
//         <IconCircle isActive={window.location.pathname === to}>{icon}</IconCircle>
//         <span
//           className={`text-base font-medium ${
//             window.location.pathname === to ? "text-[#008ecc]" : "text-gray-700"
//           }`}
//         >
//           {label}
//         </span>
//       </div>
//     </NavLink>
//   );
// };

// const Collapsible = ({
//   label,
//   icon,
//   open,
//   onToggle,
//   children,
//   hasPermission = true,
// }) => {
//   if (!hasPermission) return null;

//   return (
//     <div>
//       <button
//         onClick={onToggle}
//         className={`flex items-center justify-between w-full p-3 rounded-full transition-all duration-300
//           ${open ? "bg-[#f0fbff]" : "hover:bg-[#f8f9fb]"}`}
//       >
//         <div className="flex items-center space-x-3">
//           <IconCircle isActive={open}>{icon}</IconCircle>
//           <span className="text-base font-medium">{label}</span>
//         </div>
//         <ChevronRight
//           size={18}
//           className={`ml-2 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
//         />
//       </button>

//       {open && <div className="pl-12 mt-2 flex flex-col gap-2">{children}</div>}
//     </div>
//   );
// };

// const SmallLink = ({ to, icon, label, hasPermission = true }) => {
//   if (!hasPermission) return null;

//   return (
//     <NavLink
//       to={to}
//       className={({ isActive }) =>
//         `flex items-center gap-3 p-2 rounded-full transition-all duration-300
//         ${isActive ? "bg-[#f2fbff]" : "hover:bg-[#f8f9fb]"}`
//       }
//     >
//       <div className="w-7 h-7 flex items-center justify-center rounded-full shadow-sm bg-white">
//         {React.cloneElement(icon, { color: window.location.pathname === to ? "#008ecc" : "#1f1f1f" })}
//       </div>
//       <span
//         className={`${
//           window.location.pathname === to ? "text-[#008ecc]" : "text-gray-700"
//         }`}
//       >
//         {label}
//       </span>
//     </NavLink>
//   );
// };

// const Sidebar = ({ isOpen, toggleSidebar }) => {
//   const [showActivities, setShowActivities] = useState(false);
//   const [userPermissions, setUserPermissions] = useState({});
//   const [isAdmin, setIsAdmin] = useState(false);

//   const location = useLocation();

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user") || "{}");
//     if (user.role && user.role.name === "Admin") {
//       setIsAdmin(true);
//       setUserPermissions({
//         dashboard: true,
//         leads: true,
//         deals: true,
//         pipeline: true,
//         invoice: true,
//         proposal: true,
//         templates: true,
//         calendar: true,
//         activityList: true,
//         usersRoles: true,
//       });
//     } else if (user.role && user.role.permissions) {
//       setUserPermissions(user.role.permissions);
//     }
//   }, []);

//   return (
//     <aside
//       className={`fixed lg:relative top-0 left-0 h-full bg-white p-4 w-64 transition-transform overflow-y-auto sidebar-scroll z-50
//         ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
//     >
//       {/* Header */}
//       <div className="mb-6 flex items-center justify-between px-4">
//         <img
//           src="https://tzi.zaarapp.com//storage/uploads/logo//logo-dark.png"
//           alt="Logo"
//           className="h-12"
//         />
//         <button onClick={toggleSidebar} className="lg:hidden p-1">
//           <X size={22} className="text-gray-600" />
//         </button>
//       </div>

//       <nav className="flex flex-col gap-3 px-2">
//         {/* Dashboard */}
//         <SidebarItem
//           to="/adminDashboard"
//           icon={<Home size={18} />}
//           label="Dashboard"
//           hasPermission={isAdmin || userPermissions.dashboard}
//         />

//         {/* Leads */}
//         <SidebarItem
//           to="/leads"
//           icon={<User size={18} />}
//           label="Leads"
//           hasPermission={isAdmin || userPermissions.leads}
//         />

//         {/* Pipeline View */}
//         <SidebarItem
//           to="/Pipelineview"
//           icon={<User size={18} />}
//           label="Pipeline View"
//           hasPermission={isAdmin || userPermissions.leads}
//         />

//         {/* Deals */}
//         <SidebarItem
//           to="/deals"
//           icon={<Tag size={18} />}
//           label="All Deals"
//           hasPermission={isAdmin || userPermissions.deals}
//         />

//         {/* Invoice */}
//         <SidebarItem
//           to="/invoice"
//           exact
//           icon={
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               height="18px"
//               viewBox="0 -960 960 960"
//               width="18px"
//               fill={window.location.pathname === "/invoice" ? "#008ecc" : "#1f1f1f"}
//             >
//               <path d="M340-460h280v-64H340v64Zm0 120h280v-64H340v64Zm0 120h174v-64H340v64ZM263.72-96Q234-96 213-117.15T192-168v-624q0-29.7 21.15-50.85Q234.3-864 264-864h312l192 192v504q0 29.7-21.16 50.85Q725.68-96 695.96-96H263.72ZM528-624v-168H264v624h432v-456H528ZM264-792v168-168 624-624Z" />
//             </svg>
//           }
//           label="Invoices"
//           hasPermission={isAdmin || userPermissions.invoice}
//         />

//         {/* Proposal */}
//         <SidebarItem
//           to="/proposal"
//           icon={<Tag size={18} />}
//           label="Proposal"
//           hasPermission={isAdmin || userPermissions.proposal}
//         />

//         {/* Activities */}
//         <Collapsible
//           label="Activities"
//           icon={<Calendar size={18} />}
//           open={showActivities}
//           onToggle={() => setShowActivities((s) => !s)}
//           hasPermission={isAdmin || userPermissions.calendar}
//         >
//           <SmallLink
//             to="/calendar"
//             icon={<Calendar size={16} />}
//             label="Calendar View"
//             hasPermission={isAdmin || userPermissions.calendar}
//           />
//           <SmallLink
//             to="/list"
//             icon={<List size={16} />}
//             label="Activity list"
//             hasPermission={isAdmin || userPermissions.activityList}
//           />
//         </Collapsible>

//         {/* Users & Roles */}
//         <SidebarItem
//           to="/user/roles"
//           icon={<Shield size={18} />}
//           label="Users & Roles"
//           hasPermission={isAdmin || userPermissions.usersRoles}
//         />
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;


// import React, { useState, useEffect } from "react";
// import {
//   Home,
//   ChevronRight,
//   X,
//   User,
//   Tag,
//   List,
//   Calendar,
//   Shield,
//   HelpCircle,
// } from "react-feather";
// import { NavLink, useLocation } from "react-router-dom";
// import { useTour } from "../component/Tour/TourContext";

// const IconCircle = ({ children, isActive }) => (
//   <div className="w-10 h-10 flex items-center justify-center rounded-full shadow-sm bg-white">
//     {/* Icon color changes based on active state */}
//     {React.cloneElement(children, {
//       color: isActive ? "#008ecc" : "#1f1f1f",
//     })}
//   </div>
// );

// const SidebarItem = ({
//   to,
//   icon,
//   label,
//   exact = false,
//   onClick,
//   hasPermission = true,
// }) => {
//   if (!hasPermission) return null;

//   return (
//     <NavLink
//       to={to}
//       end={exact}
//       onClick={onClick}
//       className={({ isActive }) =>
//         `flex items-center justify-between w-full p-3 rounded-full transition-all duration-300
//         ${isActive ? "bg-[#f2fbff]" : "hover:bg-[#f8f9fb]"}`
//       }
//     >
//       <div className="flex items-center space-x-3">
//         <IconCircle isActive={window.location.pathname === to}>{icon}</IconCircle>
//         <span
//           className={`text-base font-medium ${
//             window.location.pathname === to ? "text-[#008ecc]" : "text-gray-700"
//           }`}
//         >
//           {label}
//         </span>
//       </div>
//     </NavLink>
//   );
// };

// const Collapsible = ({
//   label,
//   icon,
//   open,
//   onToggle,
//   children,
//   hasPermission = true,
// }) => {
//   if (!hasPermission) return null;

//   return (
//     <div>
//       <button
//         onClick={onToggle}
//         className={`flex items-center justify-between w-full p-3 rounded-full transition-all duration-300
//           ${open ? "bg-[#f0fbff]" : "hover:bg-[#f8f9fb]"}`}
//       >
//         <div className="flex items-center space-x-3">
//           <IconCircle isActive={open}>{icon}</IconCircle>
//           <span className="text-base font-medium">{label}</span>
//         </div>
//         <ChevronRight
//           size={18}
//           className={`ml-2 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
//         />
//       </button>

//       {open && <div className="pl-12 mt-2 flex flex-col gap-2">{children}</div>}
//     </div>
//   );
// };

// const SmallLink = ({ to, icon, label, hasPermission = true }) => {
//   if (!hasPermission) return null;

//   return (
//     <NavLink
//       to={to}
//       className={({ isActive }) =>
//         `flex items-center gap-3 p-2 rounded-full transition-all duration-300
//         ${isActive ? "bg-[#f2fbff]" : "hover:bg-[#f8f9fb]"}`
//       }
//     >
//       <div className="w-7 h-7 flex items-center justify-center rounded-full shadow-sm bg-white">
//         {React.cloneElement(icon, { color: window.location.pathname === to ? "#008ecc" : "#1f1f1f" })}
//       </div>
//       <span
//         className={`${
//           window.location.pathname === to ? "text-[#008ecc]" : "text-gray-700"
//         }`}
//       >
//         {label}
//       </span>
//     </NavLink>
//   );
// };

// const Sidebar = ({ isOpen, toggleSidebar }) => {
//   const [showActivities, setShowActivities] = useState(false);
//   const [userPermissions, setUserPermissions] = useState({});
//   const [isAdmin, setIsAdmin] = useState(false);
//   const { startTour } = useTour();

//   const location = useLocation();

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user") || "{}");
//     if (user.role && user.role.name === "Admin") {
//       setIsAdmin(true);
//       setUserPermissions({
//         dashboard: true,
//         leads: true,
//         deals: true,
//         pipeline: true,
//         invoice: true,
//         proposal: true,
//         templates: true,
//         calendar: true,
//         activityList: true,
//         usersRoles: true,
//       });
//     } else if (user.role && user.role.permissions) {
//       setUserPermissions(user.role.permissions);
//     }
//   }, []);

//   const startSidebarTour = () => {
//     const tourSteps = [
//       {
//         target: '[data-tour="dashboard"]',
//         title: "Dashboard",
//         content: "This is your main dashboard where you can see an overview of your activities.",
//         position: "right"
//       },
//       {
//         target: '[data-tour="leads"]',
//         title: "Leads",
//         content: "Manage all your potential customers and leads here.",
//         position: "right"
//       },
//       {
//         target: '[data-tour="pipeline"]',
//         title: "Pipeline View",
//         content: "Visualize your deals and their progress through your sales pipeline.",
//         position: "right"
//       },
//       {
//         target: '[data-tour="deals"]',
//         title: "All Deals",
//         content: "View and manage all your ongoing deals in one place.",
//         position: "right"
//       },
//       {
//         target: '[data-tour="activities"]',
//         title: "Activities",
//         content: "Access your calendar view and activity list to manage your schedule.",
//         position: "right"
//       }
//     ];
    
//     startTour(tourSteps);
//   };

//   return (
//     <aside
//       className={`fixed lg:relative top-0 left-0 h-full bg-white p-4 w-64 transition-transform overflow-y-auto sidebar-scroll z-50
//         ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
//     >
//       {/* Header */}
//       <div className="mb-6 flex items-center justify-between px-4">
//         <img
//           src="https://tzi.zaarapp.com//storage/uploads/logo//logo-dark.png"
//           alt="Logo"
//           className="h-12"
//         />
//         <button onClick={toggleSidebar} className="lg:hidden p-1">
//           <X size={22} className="text-gray-600" />
//         </button>
//       </div>

//       <nav className="flex flex-col gap-3 px-2">
//         {/* Dashboard */}
//         <div data-tour="dashboard">
//           <SidebarItem
//             to="/adminDashboard"
//             icon={<Home size={18} />}
//             label="Dashboard"
//             hasPermission={isAdmin || userPermissions.dashboard}
//           />
//         </div>

//         {/* Leads */}
//         <div data-tour="leads">
//           <SidebarItem
//             to="/leads"
//             icon={<User size={18} />}
//             label="Leads"
//             hasPermission={isAdmin || userPermissions.leads}
//           />
//         </div>

//         {/* Pipeline View */}
//         <div data-tour="pipeline">
//           <SidebarItem
//             to="/Pipelineview"
//             icon={<User size={18} />}
//             label="Pipeline View"
//             hasPermission={isAdmin || userPermissions.leads}
//           />
//         </div>

//         {/* Deals */}
//         <div data-tour="deals">
//           <SidebarItem
//             to="/deals"
//             icon={<Tag size={18} />}
//             label="All Deals"
//             hasPermission={isAdmin || userPermissions.deals}
//           />
//         </div>

//         {/* Invoice */}
//         <SidebarItem
//           to="/invoice"
//           exact
//           icon={
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               height="18px"
//               viewBox="0 -960 960 960"
//               width="18px"
//               fill={window.location.pathname === "/invoice" ? "#008ecc" : "#1f1f1f"}
//             >
//               <path d="M340-460h280v-64H340v64Zm0 120h280v-64H340v64Zm0 120h174v-64H340v64ZM263.72-96Q234-96 213-117.15T192-168v-624q0-29.7 21.15-50.85Q234.3-864 264-864h312l192 192v504q0 29.7-21.16 50.85Q725.68-96 695.96-96H263.72ZM528-624v-168H264v624h432v-456H528ZM264-792v168-168 624-624Z" />
//             </svg>
//           }
//           label="Invoices"
//           hasPermission={isAdmin || userPermissions.invoice}
//         />

//         {/* Proposal */}
//         <SidebarItem
//           to="/proposal"
//           icon={<Tag size={18} />}
//           label="Proposal"
//           hasPermission={isAdmin || userPermissions.proposal}
//         />

//         {/* Activities */}
//         <div data-tour="activities">
//           <Collapsible
//             label="Activities"
//             icon={<Calendar size={18} />}
//             open={showActivities}
//             onToggle={() => setShowActivities((s) => !s)}
//             hasPermission={isAdmin || userPermissions.calendar}
//           >
//             <SmallLink
//               to="/calendar"
//               icon={<Calendar size={16} />}
//               label="Calendar View"
//               hasPermission={isAdmin || userPermissions.calendar}
//             />
//             <SmallLink
//               to="/list"
//               icon={<List size={16} />}
//               label="Activity list"
//               hasPermission={isAdmin || userPermissions.activityList}
//             />
//           </Collapsible>
//         </div>

//         {/* Users & Roles */}
//         <SidebarItem
//           to="/user/roles"
//           icon={<Shield size={18} />}
//           label="Users & Roles"
//           hasPermission={isAdmin || userPermissions.usersRoles}
//         />

//         {/* Help Button */}
//         <button
//           onClick={startSidebarTour}
//           className="flex items-center gap-3 p-3 mt-6 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
//         >
//           <HelpCircle size={18} className="text-blue-500" />
//           <span className="text-gray-700">Take a Tour</span>
//         </button>
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;


// import React, { useState, useEffect } from "react";
// import {
//   Home,
//   ChevronRight,
//   X,
//   User,
//   Tag,
//   List,
//   Calendar,
//   Shield,
//   HelpCircle,
// } from "react-feather";
// import { NavLink, useLocation } from "react-router-dom";
// import { useTour } from "../component/Tour/TourContext";

// const IconCircle = ({ children, isActive }) => (
//   <div className="w-10 h-10 flex items-center justify-center rounded-full shadow-sm bg-white">
//     {React.cloneElement(children, {
//       color: isActive ? "#008ecc" : "#1f1f1f",
//     })}
//   </div>
// );

// const SidebarItem = ({
//   to,
//   icon,
//   label,
//   exact = false,
//   onClick,
//   hasPermission = true,
//   tourStep = null,
// }) => {
//   if (!hasPermission) return null;

//   return (
//     <NavLink
//       to={to}
//       end={exact}
//       onClick={onClick}
//       className={({ isActive }) =>
//         `flex items-center justify-between w-full p-3 rounded-full transition-all duration-300
//         ${isActive ? "bg-[#f2fbff]" : "hover:bg-[#f8f9fb]"}`
//       }
//       id={tourStep ? `sidebar-${tourStep}` : undefined}
//     >
//       <div className="flex items-center space-x-3">
//         <IconCircle isActive={window.location.pathname === to}>{icon}</IconCircle>
//         <span
//           className={`text-base font-medium ${
//             window.location.pathname === to ? "text-[#008ecc]" : "text-gray-700"
//           }`}
//         >
//           {label}
//         </span>
//       </div>
//     </NavLink>
//   );
// };

// const Collapsible = ({
//   label,
//   icon,
//   open,
//   onToggle,
//   children,
//   hasPermission = true,
//   tourStep = null,
// }) => {
//   if (!hasPermission) return null;

//   return (
//     <div id={tourStep ? `sidebar-${tourStep}` : undefined}>
//       <button
//         onClick={onToggle}
//         className={`flex items-center justify-between w-full p-3 rounded-full transition-all duration-300
//           ${open ? "bg-[#f0fbff]" : "hover:bg-[#f8f9fb]"}`}
//       >
//         <div className="flex items-center space-x-3">
//           <IconCircle isActive={open}>{icon}</IconCircle>
//           <span className="text-base font-medium">{label}</span>
//         </div>
//         <ChevronRight
//           size={18}
//           className={`ml-2 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
//         />
//       </button>

//       {open && <div className="pl-12 mt-2 flex flex-col gap-2">{children}</div>}
//     </div>
//   );
// };

// const SmallLink = ({ to, icon, label, hasPermission = true, tourStep = null }) => {
//   if (!hasPermission) return null;

//   return (
//     <NavLink
//       to={to}
//       className={({ isActive }) =>
//         `flex items-center gap-3 p-2 rounded-full transition-all duration-300
//         ${isActive ? "bg-[#f2fbff]" : "hover:bg-[#f8f9fb]"}`
//       }
//       id={tourStep ? `sidebar-${tourStep}` : undefined}
//     >
//       <div className="w-7 h-7 flex items-center justify-center rounded-full shadow-sm bg-white">
//         {React.cloneElement(icon, { color: window.location.pathname === to ? "#008ecc" : "#1f1f1f" })}
//       </div>
//       <span
//         className={`${
//           window.location.pathname === to ? "text-[#008ecc]" : "text-gray-700"
//         }`}
//       >
//         {label}
//       </span>
//     </NavLink>
//   );
// };

// const Sidebar = ({ isOpen, toggleSidebar }) => {
//   const [showActivities, setShowActivities] = useState(false);
//   const [userPermissions, setUserPermissions] = useState({});
//   const [isAdmin, setIsAdmin] = useState(false);
//   const { startTour } = useTour();

//   const location = useLocation();

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user") || "{}");
//     if (user.role && user.role.name === "Admin") {
//       setIsAdmin(true);
//       setUserPermissions({
//         dashboard: true,
//         leads: true,
//         deals: true,
//         pipeline: true,
//         invoice: true,
//         proposal: true,
//         templates: true,
//         calendar: true,
//         activityList: true,
//         usersRoles: true,
//       });
//     } else if (user.role && user.role.permissions) {
//       setUserPermissions(user.role.permissions);
//     }
//   }, []);

//   const startSidebarTour = () => {
//     // Ensure the activities section is open for the tour
//     setShowActivities(true);
    
//     // Small delay to ensure DOM is updated before starting the tour
//     // setTimeout(() => {
//     //   const tourSteps = [
//     //     {
//     //       target: '#sidebar-dashboard',
//     //       title: "Dashboard",
//     //       content: "This is your main dashboard where you can see an overview of your activities.",
//     //       placement: "right",
//     //       disableBeacon: true,
//     //     },
//     //     {
//     //       target: '#sidebar-leads',
//     //       title: "Leads",
//     //       content: "Manage all your potential customers and leads here.",
//     //       placement: "right"
//     //     },
//     //     {
//     //       target: '#sidebar-pipeline',
//     //       title: "Pipeline View",
//     //       content: "Visualize your deals and their progress through your sales pipeline.",
//     //       placement: "right"
//     //     },
//     //     {
//     //       target: '#sidebar-deals',
//     //       title: "All Deals",
//     //       content: "View and manage all your ongoing deals in one place.",
//     //       placement: "right"
//     //     },
//     //     {
//     //       target: '#sidebar-activities',
//     //       title: "Activities",
//     //       content: "Access your calendar view and activity list to manage your schedule.",
//     //       placement: "right"
//     //     },
//     //     {
//     //       target: '#sidebar-calendar',
//     //       title: "Calendar View",
//     //       content: "See your scheduled activities in a calendar format.",
//     //       placement: "right"
//     //     },
//     //     {
//     //       target: '#sidebar-activityList',
//     //       title: "Activity List",
//     //       content: "View all your activities in a list format for easy management.",
//     //       placement: "right"
//     //     },
//     //     {
//     //       target: '#sidebar-tourButton',
//     //       title: "Need Help?",
//     //       content: "You can always restart this tour by clicking this button.",
//     //       placement: "right"
//     //     }
//     //   ];
      
//     //   startTour(tourSteps);
//     // }, 100);
// setTimeout(() => {
//   const tourSteps = [
//     {
//       target: '#sidebar-dashboard',
//       title: "Dashboard Overview",
//       content: "Your central hub for all business metrics: Total Deals, Deals Won, Revenue, Pending Invoices, Sales Pipeline visualization, Revenue Overview, Deals Performance analytics, and Deal Distribution across categories.",
//       placement: "right",
//       disableBeacon: true,
//     },
//     {
//       target: '#sidebar-leads',
//       title: "Leads Management",
//       content: "Create new leads, filter your lead database, convert qualified leads to deals, edit and delete lead records, update information, and access complete lead details with interaction history.",
//       placement: "right"
//     },
//     {
//       target: '#sidebar-deals',
//       title: "Deals Management",
//       content: "View converted lead details, create new deals, edit and delete deal records, update deal information, apply filters to organize your deals, and track all deal-related activities.",
//       placement: "right"
//     },
//     {
//       target: '#sidebar-pipeline',
//       title: "Pipeline Visualization",
//       content: "Five-stage pipeline view (Qualification, Negotiation, Proposal Sent, Closed Won, Closed Lost) with drag-and-drop functionality between stages. Click any deal to view complete information, attachments, and creation/update dates. Add new deals directly from this view.",
//       placement: "right"
//     },
//     {
//       target: '#sidebar-invoices',
//       title: "Invoice Management",
//       content: "Track total paid amounts, total invoice values, and due amounts. Create new invoices, apply filters to organize them, edit and delete invoices, update statuses, send invoices via email, and download PDF versions.",
//       placement: "right"
//     },
//     {
//       target: '#sidebar-activities',
//       title: "Activities & Calendar",
//       content: "View automatically generated calendar meetings, add new activities, switch between month/week/year views to see all meeting and call details, and manage your schedule visually.",
//       placement: "right"
//     },
//     {
//       target: '#sidebar-activityList',
//       title: "Activity List",
//       content: "Add new activities, apply filters to find specific items, schedule meetings and calls, track email communications, and edit, delete, or update activity details as needed.",
//       placement: "right"
//     },
//     {
//       target: '#sidebar-users',
//       title: "User & Role Management",
//       content: "Add new users, create custom roles with specific permissions, filter users by various criteria, add/edit user details, update permissions, and delete user accounts as needed.",
//       placement: "right"
//     },
//     {
//       target: '#sidebar-tourButton',
//       title: "Need Additional Help?",
//       content: "Restart this tour anytime by clicking this button. Access our knowledge base, contact support, or join training webinars for additional assistance.",
//       placement: "right"
//     }
//   ];
  
//   // You'll need to implement the startTour function or use a state management solution
//   // to pass these steps to the Tour component
//   startTour(tourSteps);
// }, 100);

//   };

//   return (
//     <aside
//       className={`fixed lg:relative top-0 left-0 h-full bg-white p-4 w-64 transition-transform overflow-y-auto sidebar-scroll z-50
//         ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
//       id="main-sidebar"
//     >
//       {/* Header */}
//       <div className="mb-6 flex items-center justify-between px-4">
//         <img
//           src="https://tzi.zaarapp.com//storage/uploads/logo//logo-dark.png"
//           alt="Logo"
//           className="h-12"
//         />
//         <button onClick={toggleSidebar} className="lg:hidden p-1">
//           <X size={22} className="text-gray-600" />
//         </button>
//       </div>

//       <nav className="flex flex-col gap-3 px-2">
//         {/* Dashboard */}
//         <SidebarItem
//           to="/adminDashboard"
//           icon={<Home size={18} />}
//           label="Dashboard"
//           hasPermission={isAdmin || userPermissions.dashboard}
//           tourStep="dashboard"
//         />

//         {/* Leads */}
//         <SidebarItem
//           to="/leads"
//           icon={<User size={18} />}
//           label="Leads"
//           hasPermission={isAdmin || userPermissions.leads}
//           tourStep="leads"
//         />

//         {/* Pipeline View */}
//         <SidebarItem
//           to="/Pipelineview"
//           icon={<User size={18} />}
//           label="Pipeline View"
//           hasPermission={isAdmin || userPermissions.leads}
//           tourStep="pipeline"
//         />

//         {/* Deals */}
//         <SidebarItem
//           to="/deals"
//           icon={<Tag size={18} />}
//           label="All Deals"
//           hasPermission={isAdmin || userPermissions.deals}
//           tourStep="deals"
//         />

//         {/* Invoice */}
//         <SidebarItem
//           to="/invoice"
//           exact
//           icon={
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               height="18px"
//               viewBox="0 -960 960 960"
//               width="18px"
//               fill={window.location.pathname === "/invoice" ? "#008ecc" : "#1f1f1f"}
//             >
//               <path d="M340-460h280v-64H340v64Zm0 120h280v-64H340v64Zm0 120h174v-64H340v64ZM263.72-96Q234-96 213-117.15T192-168v-624q0-29.7 21.15-50.85Q234.3-864 264-864h312l192 192v504q0 29.7-21.16 50.85Q725.68-96 695.96-96H263.72ZM528-624v-168H264v624h432v-456H528ZM264-792v168-168 624-624Z" />
//             </svg>
//           }
//           label="Invoices"
//           hasPermission={isAdmin || userPermissions.invoice}
//         />

//         {/* Proposal */}
//         <SidebarItem
//           to="/proposal"
//           icon={<Tag size={18} />}
//           label="Proposal"
//           hasPermission={isAdmin || userPermissions.proposal}
//         />

//         {/* Activities */}
//         <Collapsible
//           label="Activities"
//           icon={<Calendar size={18} />}
//           open={showActivities}
//           onToggle={() => setShowActivities((s) => !s)}
//           hasPermission={isAdmin || userPermissions.calendar}
//           tourStep="activities"
//         >
//           <SmallLink
//             to="/calendar"
//             icon={<Calendar size={16} />}
//             label="Calendar View"
//             hasPermission={isAdmin || userPermissions.calendar}
//             tourStep="calendar"
//           />
//           <SmallLink
//             to="/list"
//             icon={<List size={16} />}
//             label="Activity list"
//             hasPermission={isAdmin || userPermissions.activityList}
//             tourStep="activityList"
//           />
//         </Collapsible>

//         {/* Users & Roles */}
//         <SidebarItem
//           to="/user/roles"
//           icon={<Shield size={18} />}
//           label="Users & Roles"
//           hasPermission={isAdmin || userPermissions.usersRoles}
//         />

//         {/* Help Button */}
//         <button
//           onClick={startSidebarTour}
//           className="flex items-center gap-3 p-3 mt-6 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
//           id="sidebar-tourButton"
//         >
//           <HelpCircle size={18} className="text-blue-500" />
//           <span className="text-gray-700">Take a Tour</span>
//         </button>
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;


// import React, { useState, useEffect } from "react";
// import {
//   Home,
//   ChevronRight,
//   X,
//   User,
//   Tag,
//   List,
//   Calendar,
//   Shield,
//   HelpCircle,
// } from "react-feather";
// import { NavLink, useLocation } from "react-router-dom";
// import { useTour } from "../component/Tour/TourContext";

// const IconCircle = ({ children, isActive }) => (
//   <div className="w-10 h-10 flex items-center justify-center rounded-full shadow-sm bg-white">
//     {React.cloneElement(children, {
//       color: isActive ? "#008ecc" : "#1f1f1f",
//     })}
  
//   </div>
// );

// const SidebarItem = ({
//   to,
//   icon,
//   label,
//   exact = false,
//   onClick,
//   hasPermission = true,
//   tourStep = null,
// }) => {
//   if (!hasPermission) return null;

//   return (
//     <NavLink
//       to={to}
//       end={exact}
//       onClick={onClick}
//       className={({ isActive }) =>
//         `flex items-center justify-between w-full p-3 rounded-full transition-all duration-300
//         ${isActive ? "bg-[#f2fbff]" : "hover:bg-[#f8f9fb]"}`
//       }
//       id={tourStep ? `sidebar-${tourStep}` : undefined}
//     >
//       <div className="flex items-center space-x-3">
//         <IconCircle isActive={window.location.pathname === to}>{icon}</IconCircle>
//         <span
//           className={`text-base font-medium ${
//             window.location.pathname === to ? "text-[#008ecc]" : "text-gray-700"
//           }`}
//         >
//           {label}
//         </span>
//       </div>
//     </NavLink>
//   );
// };

// const Collapsible = ({
//   label,
//   icon,
//   open,
//   onToggle,
//   children,
//   hasPermission = true,
//   tourStep = null,
// }) => {
//   if (!hasPermission) return null;

//   return (
//     <div id={tourStep ? `sidebar-${tourStep}` : undefined}>
//       <button
//         onClick={onToggle}
//         className={`flex items-center justify-between w-full p-3 rounded-full transition-all duration-300
//           ${open ? "bg-[#f0fbff]" : "hover:bg-[#f8f9fb]"}`}
//       >
//         <div className="flex items-center space-x-3">
//           <IconCircle isActive={open}>{icon}</IconCircle>
//           <span className="text-base font-medium">{label}</span>
//         </div>
//         <ChevronRight
//           size={18}
//           className={`ml-2 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
//         />
//       </button>

//       {open && <div className="pl-12 mt-2 flex flex-col gap-2">{children}</div>}
//     </div>
//   );
// };

// const SmallLink = ({ to, icon, label, hasPermission = true, tourStep = null }) => {
//   if (!hasPermission) return null;

//   return (
//     <NavLink
//       to={to}
//       className={({ isActive }) =>
//         `flex items-center gap-3 p-2 rounded-full transition-all duration-300
//         ${isActive ? "bg-[#f2fbff]" : "hover:bg-[#f8f9fb]"}`
//       }
//       id={tourStep ? `sidebar-${tourStep}` : undefined}
//     >
//       <div className="w-7 h-7 flex items-center justify-center rounded-full shadow-sm bg-white">
//         {React.cloneElement(icon, { color: window.location.pathname === to ? "#008ecc" : "#1f1f1f" })}
//       </div>
//       <span
//         className={`${
//           window.location.pathname === to ? "text-[#008ecc]" : "text-gray-700"
//         }`}
//       >
//         {label}
//       </span>
//     </NavLink>
//   );
// };

// const Sidebar = ({ isOpen, toggleSidebar }) => {
//   const [showActivities, setShowActivities] = useState(false);
//   const [userPermissions, setUserPermissions] = useState({});
//   const [isAdmin, setIsAdmin] = useState(false);
//   const { startTour } = useTour();

//   const location = useLocation();

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user") || "{}");
//     if (user.role && user.role.name === "Admin") {
//       setIsAdmin(true);
//       setUserPermissions({
//         dashboard: true,
//         leads: true,
//         deals: true,
//         pipeline: true,
//         invoice: true,
//         proposal: true,
//         templates: true,
//         calendar: true,
//         activityList: true,
//         usersRoles: true,
//       });
//     } else if (user.role && user.role.permissions) {
//       setUserPermissions(user.role.permissions);
//     }
//   }, []);

//   const startSidebarTour = () => {
//     // Ensure the activities section is open for the tour
//     setShowActivities(true);
    
//     // Start the tour after a small delay to ensure the DOM is updated
//     setTimeout(() => {
//       const tourSteps = [
//         {
//           target: '#sidebar-dashboard',
//           title: "Dashboard Overview",
//           content: "Your central hub for all business metrics: Total Deals, Deals Won, Revenue, Pending Invoices, Sales Pipeline visualization, Revenue Overview, Deals Performance analytics, and Deal Distribution across categories.",
//           placement: "right",
//           disableBeacon: true,
//         },
//         {
//           target: '#sidebar-leads',
//           title: "Leads Management",
//           content: "Create new leads, filter your lead database, convert qualified leads to deals, edit and delete lead records, update information, and access complete lead details with interaction history.",
//           placement: "right"
//         },
//         {
//           target: '#sidebar-deals',
//           title: "Deals Management",
//           content: "View converted lead details, create new deals, edit and delete deal records, update deal information, apply filters to organize your deals, and track all deal-related activities.",
//           placement: "right"
//         },
//         {
//           target: '#sidebar-pipeline',
//           title: "Pipeline Visualization",
//           content: "Five-stage pipeline view (Qualification, Negotiation, Proposal Sent, Closed Won, Closed Lost) with drag-and-drop functionality between stages. Click any deal to view complete information, attachments, and creation/update dates. Add new deals directly from this view.",
//           placement: "right"
//         },
//         {
//           target: '#sidebar-invoices',
//           title: "Invoice Management",
//           content: "Track total paid amounts, total invoice values, and due amounts. Create new invoices, apply filters to organize them, edit and delete invoices, update statuses, send invoices via email, and download PDF versions.",
//           placement: "right"
//         },
//         {
//           target: '#sidebar-activities',
//           title: "Activities & Calendar",
//           content: "View automatically generated calendar meetings, add new activities, switch between month/week/year views to see all meeting and call details, and manage your schedule visually.",
//           placement: "right"
//         },
//         {
//           target: '#sidebar-activityList',
//           title: "Activity List",
//           content: "Add new activities, apply filters to find specific items, schedule meetings and calls, track email communications, and edit, delete, or update activity details as needed.",
//           placement: "right"
//         },
//         {
//           target: '#sidebar-users',
//           title: "User & Role Management",
//           content: "Add new users, create custom roles with specific permissions, filter users by various criteria, add/edit user details, update permissions, and delete user accounts as needed.",
//           placement: "right"
//         },
//         {
//           target: '#sidebar-tourButton',
//           title: "Need Additional Help?",
//           content: "Restart this tour anytime by clicking this button. Access our knowledge base, contact support, or join training webinars for additional assistance.",
//           placement: "right"
//         }
//       ];
      
//       startTour(tourSteps);
//     }, 100);
    
//   };

//   return (
//     <aside
//       className={`fixed lg:relative top-0 left-0 h-full bg-white p-4 w-64 transition-transform overflow-y-auto sidebar-scroll z-50
//         ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
//       id="main-sidebar"
//     >
//       {/* Header */}
//       <div className="mb-6 flex items-center justify-between px-4">
//         <img
//           src="https://tzi.zaarapp.com//storage/uploads/logo//logo-dark.png"
//           alt="Logo"
//           className="h-12"
//         />
//         <button onClick={toggleSidebar} className="lg:hidden p-1">
//           <X size={22} className="text-gray-600" />
//         </button>
//       </div>

//       <nav className="flex flex-col gap-3 px-2">
//         {/* Dashboard */}
//         <SidebarItem
//           to="/adminDashboard"
//           icon={<Home size={18} />}
//           label="Dashboard"
//           hasPermission={isAdmin || userPermissions.dashboard}
//           tourStep="dashboard"
//         />

//         {/* Leads */}
//         <SidebarItem
//           to="/leads"
//           icon={<User size={18} />}
//           label="Leads"
//           hasPermission={isAdmin || userPermissions.leads}
//           tourStep="leads"
//         />

//         {/* Pipeline View */}
//         <SidebarItem
//           to="/Pipelineview"
//           icon={<User size={18} />}
//           label="Pipeline View"
//           hasPermission={isAdmin || userPermissions.leads}
//           tourStep="pipeline"
//         />

//         {/* Deals */}
//         <SidebarItem
//           to="/deals"
//           icon={<Tag size={18} />}
//           label="All Deals"
//           hasPermission={isAdmin || userPermissions.deals}
//           tourStep="deals"
//         />

//         {/* Invoice */}
//         <SidebarItem
//           to="/invoice"
//           exact
//           icon={
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               height="18px"
//               viewBox="0 -960 960 960"
//               width="18px"
//               fill={window.location.pathname === "/invoice" ? "#008ecc" : "#1f1f1f"}
//             >
//               <path d="M340-460h280v-64H340v64Zm0 120h280v-64H340v64Zm0 120h174v-64H340v64ZM263.72-96Q234-96 213-117.15T192-168v-624q0-29.7 21.15-50.85Q234.3-864 264-864h312l192 192v504q0 29.7-21.16 50.85Q725.68-96 695.96-96H263.72ZM528-624v-168H264v624h432v-456H528ZM264-792v168-168 624-624Z" />
//             </svg>
//           }
//           label="Invoices"
//           hasPermission={isAdmin || userPermissions.invoice}
//         />

//         {/* Proposal */}
//         <SidebarItem
//           to="/proposal"
//           icon={<Tag size={18} />}
//           label="Proposal"
//           hasPermission={isAdmin || userPermissions.proposal}
//         />

//         {/* Activities */}
//         <Collapsible
//           label="Activities"
//           icon={<Calendar size={18} />}
//           open={showActivities}
//           onToggle={() => setShowActivities((s) => !s)}
//           hasPermission={isAdmin || userPermissions.calendar}
//           tourStep="activities"
//         >
//           <SmallLink
//             to="/calendar"
//             icon={<Calendar size={16} />}
//             label="Calendar View"
//             hasPermission={isAdmin || userPermissions.calendar}
//             tourStep="calendar"
//           />
//           <SmallLink
//             to="/list"
//             icon={<List size={16} />}
//             label="Activity list"
//             hasPermission={isAdmin || userPermissions.activityList}
//             tourStep="activityList"
//           />
//         </Collapsible>

//         {/* Users & Roles */}
//         <SidebarItem
//           to="/user/roles"
//           icon={<Shield size={18} />}
//           label="Users & Roles"
//           hasPermission={isAdmin || userPermissions.usersRoles}
//         />

//         {/* Help Button */}
//         <button
//           onClick={startSidebarTour}
//           className="flex items-center gap-3 p-3 mt-6 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
//           id="sidebar-tourButton"
//         >
//           <HelpCircle size={18} className="text-blue-500" />
//           <span className="text-gray-700">Take a Tour</span>
//         </button>
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;


import React, { useState, useEffect } from "react";
import {
  Home,
  ChevronRight,
  X,
  User,
  Tag,
  List,
  Calendar,
  Shield,
  HelpCircle,
} from "react-feather";
import { NavLink, useLocation } from "react-router-dom";
import { useTour } from "../component/Tour/TourContext";

const IconCircle = ({ children, isActive }) => (
  <div className="w-10 h-10 flex items-center justify-center rounded-full shadow-sm bg-white">
    {React.cloneElement(children, {
      color: isActive ? "#008ecc" : "#1f1f1f",
    })}
  </div>
);

const SidebarItem = ({
  to,
  icon,
  label,
  exact = false,
  onClick,
  hasPermission = true,
  tourStep = null,
}) => {
  if (!hasPermission) return null;

  return (
    <NavLink
      to={to}
      end={exact}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center justify-between w-full p-3 rounded-full transition-all duration-300
        ${isActive ? "bg-[#f2fbff]" : "hover:bg-[#f8f9fb]"}`
      }
      id={tourStep ? `sidebar-${tourStep}` : undefined}
    >
      <div className="flex items-center space-x-3">
        <IconCircle isActive={window.location.pathname === to}>{icon}</IconCircle>
        <span
          className={`text-base font-medium ${
            window.location.pathname === to ? "text-[#008ecc]" : "text-gray-700"
          }`}
        >
          {label}
        </span>
      </div>
    </NavLink>
  );
};

const Collapsible = ({
  label,
  icon,
  open,
  onToggle,
  children,
  hasPermission = true,
  tourStep = null,
}) => {
  if (!hasPermission) return null;

  return (
    <div id={tourStep ? `sidebar-${tourStep}` : undefined}>
      <button
        onClick={onToggle}
        className={`flex items-center justify-between w-full p-3 rounded-full transition-all duration-300
          ${open ? "bg-[#f0fbff]" : "hover:bg-[#f8f9fb]"}`}
      >
        <div className="flex items-center space-x-3">
          <IconCircle isActive={open}>{icon}</IconCircle>
          <span className="text-base font-medium">{label}</span>
        </div>
        <ChevronRight
          size={18}
          className={`ml-2 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
        />
      </button>

      {open && <div className="pl-12 mt-2 flex flex-col gap-2">{children}</div>}
    </div>
  );
};

const SmallLink = ({ to, icon, label, hasPermission = true, tourStep = null }) => {
  if (!hasPermission) return null;

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 p-2 rounded-full transition-all duration-300
        ${isActive ? "bg-[#f2fbff]" : "hover:bg-[#f8f9fb]"}`
      }
      id={tourStep ? `sidebar-${tourStep}` : undefined}
    >
      <div className="w-7 h-7 flex items-center justify-center rounded-full shadow-sm bg-white">
        {React.cloneElement(icon, { color: window.location.pathname === to ? "#008ecc" : "#1f1f1f" })}
      </div>
      <span
        className={`${
          window.location.pathname === to ? "text-[#008ecc]" : "text-gray-700"
        }`}
      >
        {label}
      </span>
    </NavLink>
  );
};

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [showActivities, setShowActivities] = useState(false);
  const [userPermissions, setUserPermissions] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const { startTour } = useTour();

  const location = useLocation();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role && user.role.name === "Admin") {
      setIsAdmin(true);
      setUserPermissions({
        dashboard: true,
        leads: true,
        deals: true,
        pipeline: true,
        invoice: true,
        proposal: true,
        templates: true,
        calendar: true,
        activityList: true,
        usersRoles: true,
      });
    } else if (user.role && user.role.permissions) {
      setUserPermissions(user.role.permissions);
    }
  }, []);

  const startSidebarTour = () => {
    // Ensure the activities section is open for the tour
    setShowActivities(true);
    
    // Start the tour after a small delay to ensure the DOM is updated
    setTimeout(() => {
      const tourSteps = [
        {
          target: '#sidebar-dashboard',
          title: "Dashboard Overview",
          content: (
            <div className="space-y-2">
              <p>Your central hub for all business metrics and performance indicators:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Total Deals:</strong> Track all active opportunities</li>
                <li><strong>Deals Won:</strong> Monitor successfully closed deals</li>
                <li><strong>Revenue:</strong> View total revenue generated</li>
                <li><strong>Pending Invoices:</strong> Track outstanding payments</li>
                <li><strong>Sales Pipeline:</strong> Visual representation of deals</li>
                <li><strong>Revenue Overview:</strong> Monthly/quarterly trends</li>
              </ul>
            </div>
          ),
          placement: "right",
          disableBeacon: true,
        },
        {
          target: '#sidebar-leads',
          title: "Leads Management",
          content: (
            <div className="space-y-2">
              <p>Comprehensive lead management system:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Create Lead:</strong> Add new leads with contact information</li>
                <li><strong>Advanced Filtering:</strong> Segment leads by status or source</li>
                <li><strong>Convert to Deal:</strong> Transform qualified leads into deals</li>
                <li><strong>Edit & Delete:</strong> Modify or remove lead records</li>
                <li><strong>Update Information:</strong> Keep records current with history</li>
              </ul>
            </div>
          ),
          placement: "right"
        },
        {
          target: '#sidebar-deals',
          title: "Deals Management",
          content: (
            <div className="space-y-2">
              <p>End-to-end deal management system:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Create Deals:</strong> Set up new deals with parameters</li>
                <li><strong>Edit & Delete:</strong> Modify deal terms or remove deals</li>
                <li><strong>Update Progress:</strong> Change deal stages and probabilities</li>
                <li><strong>Deal Information:</strong> View comprehensive details</li>
                <li><strong>Advanced Filtering:</strong> Organize deals by various criteria</li>
              </ul>
            </div>
          ),
          placement: "right"
        },
        {
          target: '#sidebar-pipeline',
          title: "Pipeline Visualization",
          content: (
            <div className="space-y-2">
              <p>Five-stage pipeline management:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Qualification:</strong> Evaluate potential deals</li>
                <li><strong>Negotiation:</strong> Terms and pricing discussions</li>
                <li><strong>Proposal Sent:</strong> Formal offers delivered</li>
                <li><strong>Closed Won:</strong> Successfully secured deals</li>
                <li><strong>Closed Lost:</strong> Unsuccessful deals with tracking</li>
              </ul>
              <p>Drag and drop deals between stages, click to view complete information.</p>
            </div>
          ),
          placement: "right"
        },
        {
          target: '#sidebar-invoices',
          title: "Invoice Management",
          content: (
            <div className="space-y-2">
              <p>Comprehensive billing system:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Total Paid:</strong> Track received payments</li>
                <li><strong>Total Amount:</strong> Monitor invoice values</li>
                <li><strong>Total Due:</strong> Identify outstanding payments</li>
                <li><strong>Create Invoices:</strong> Generate professional invoices</li>
                <li><strong>Email Integration:</strong> Send directly to clients</li>
                <li><strong>PDF Export:</strong> Download for records</li>
              </ul>
            </div>
          ),
          placement: "right"
        },
        {
          target: '#sidebar-activities',
          title: "Activities Section",
          content: (
            <div className="space-y-2">
              <p>Access your activity management tools:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Calendar view for scheduled meetings</li>
                <li>Activity list for task management</li>
                <li>Schedule calls, meetings, and reminders</li>
                <li>Track email communications</li>
                <li>Manage your daily activities</li>
              </ul>
            </div>
          ),
          placement: "right"
        },
        {
          target: '#sidebar-calendar',
          title: "Calendar View",
          content: (
            <div className="space-y-2">
              <p>Visual calendar management:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>View scheduled meetings and events</li>
                <li>Switch between month, week, and day views</li>
                <li>Color-coded events by type and priority</li>
                <li>Plan long-term activities and milestones</li>
                <li>Access complete meeting details</li>
              </ul>
            </div>
          ),
          placement: "right"
        },
        {
          target: '#sidebar-activityList',
          title: "Activity List",
          content: (
            <div className="space-y-2">
              <p>Detailed task management:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Add new tasks, calls, or meetings</li>
                <li>Advanced filtering by type, date, or priority</li>
                <li>Schedule meetings and calls efficiently</li>
                <li>Track email communications</li>
                <li>Monitor finished versus pending activities</li>
              </ul>
            </div>
          ),
          placement: "right"
        },
        {
          target: '#sidebar-users',
          title: "User & Role Management",
          content: (
            <div className="space-y-2">
              <p>System administration and access control:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Add new user accounts</li>
                <li>Create custom roles with specific permissions</li>
                <li>Organize users by role or department</li>
                <li>Fine-tune access rights</li>
                <li>Track user activity and system changes</li>
              </ul>
            </div>
          ),
          placement: "right"
        },
        {
          target: '#sidebar-tourButton',
          title: "Need Additional Help?",
          content: (
            <div className="space-y-2">
              <p>You can always restart this guided tour by clicking this button.</p>
              <p>For additional support:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Check our knowledge base</li>
                <li>Contact our support team</li>
                {/* <li>Join training webinars</li> */}
              </ul>
            </div>
          ),
          placement: "right"
        }
      ];
      
      startTour(tourSteps);
    }, 100);
  };

  return (
    <aside
      className={`fixed lg:relative top-0 left-0 h-full bg-white p-4 w-64 transition-transform overflow-y-auto sidebar-scroll z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      id="main-sidebar"
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between px-4">
        <img
          src="https://tzi.zaarapp.com//storage/uploads/logo//logo-dark.png"
          alt="Logo"
          className="h-12"
        />
        <button onClick={toggleSidebar} className="lg:hidden p-1">
          <X size={22} className="text-gray-600" />
        </button>
      </div>

      <nav className="flex flex-col gap-3 px-2">
        {/* Dashboard */}
        <SidebarItem
          to="/adminDashboard"
          icon={<Home size={18} />}
          label="Dashboard"
          hasPermission={isAdmin || userPermissions.dashboard}
          tourStep="dashboard"
        />

        {/* Leads */}
        <SidebarItem
          to="/leads"
          icon={<User size={18} />}
          label="Leads"
          hasPermission={isAdmin || userPermissions.leads}
          tourStep="leads"
        />

        {/* Pipeline View */}
        <SidebarItem
          to="/Pipelineview"
          icon={<User size={18} />}
          label="Pipeline View"
          hasPermission={isAdmin || userPermissions.leads}
          tourStep="pipeline"
        />

        {/* Deals */}
        <SidebarItem
          to="/deals"
          icon={<Tag size={18} />}
          label="All Deals"
          hasPermission={isAdmin || userPermissions.deals}
          tourStep="deals"
        />

        {/* Invoice */}
        <SidebarItem
          to="/invoice"
          exact
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="18px"
              viewBox="0 -960 960 960"
              width="18px"
              fill={window.location.pathname === "/invoice" ? "#008ecc" : "#1f1f1f"}
            >
              <path d="M340-460h280v-64H340v64Zm0 120h280v-64H340v64Zm0 120h174v-64H340v64ZM263.72-96Q234-96 213-117.15T192-168v-624q0-29.7 21.15-50.85Q234.3-864 264-864h312l192 192v504q0 29.7-21.16 50.85Q725.68-96 695.96-96H263.72ZM528-624v-168H264v624h432v-456H528ZM264-792v168-168 624-624Z" />
            </svg>
          }
          label="Invoices"
          hasPermission={isAdmin || userPermissions.invoice}
        />

        {/* Proposal */}
        <SidebarItem
          to="/proposal"
          icon={<Tag size={18} />}
          label="Proposal"
          hasPermission={isAdmin || userPermissions.proposal}
        />

        {/* Activities */}
        <Collapsible
          label="Activities"
          icon={<Calendar size={18} />}
          open={showActivities}
          onToggle={() => setShowActivities((s) => !s)}
          hasPermission={isAdmin || userPermissions.calendar}
          tourStep="activities"
        >
          <SmallLink
            to="/calendar"
            icon={<Calendar size={16} />}
            label="Calendar View"
            hasPermission={isAdmin || userPermissions.calendar}
            tourStep="calendar"
          />
          <SmallLink
            to="/list"
            icon={<List size={16} />}
            label="Activity list"
            hasPermission={isAdmin || userPermissions.activityList}
            tourStep="activityList"
          />
        </Collapsible>

        {/* Users & Roles */}
        <SidebarItem
          to="/user/roles"
          icon={<Shield size={18} />}
          label="Users & Roles"
          hasPermission={isAdmin || userPermissions.usersRoles}
          tourStep="users"
        />

        {/* Help Button */}
        <button
          onClick={startSidebarTour}
          className="flex items-center gap-3 p-3 mt-6 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          id="sidebar-tourButton"
        >
          <HelpCircle size={18} className="text-blue-500" />
          <span className="text-gray-700">Take a Tour</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;