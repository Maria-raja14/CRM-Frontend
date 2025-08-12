// import React, { useState } from "react";
// import {
//   Home,
//   Briefcase,
//   ChevronRight,
//   Users,
//   X,
//   User,
//   Layers,
//   Tag,
//   Trello,
//   List,
//   Calendar,
//   Shield,
//   DollarSign,
//   MapPin,
//   CreditCard,
//   Edit,
//   Layout,
//   FileText,
// } from "react-feather";
// import { useNavigate, Link } from "react-router-dom";

// const Sidebar = ({ isOpen, toggleSidebar }) => {
//   const [showHRMSystem, setShowHRMSystem] = useState(false);
//   const [showUserManagement, setShowUserManagement] = useState(false);
//   const [proposal, setProposal] = useState(false);
//   const [activities, setActivities] = useState(false);
//   const [reports, setReports] = useState(false);
//   const [expenses, setExpenses] = useState(false);

//   const navigate = useNavigate();

//   return (
//     <div
//       className={`fixed lg:relative top-0 left-0 h-full bg-white p-4 w-64 transition-transform overflow-y-auto sidebar-scroll ${
//         isOpen ? "translate-x-0" : "-translate-x-full"
//       } lg:translate-x-0 z-50`}
//     >
//       {/* Logo & Close button */}
//       <div className="mb-6 flex justify-between items-center ml-12">
//         <img
//           src="https://tzi.zaarapp.com//storage/uploads/logo//logo-dark.png"
//           alt="Logo"
//           className="h-12"
//         />
//         <button onClick={toggleSidebar} className="lg:hidden">
//           <X size={24} className="text-gray-600" />
//         </button>
//       </div>

//       {/* Sidebar Navigation */}
//       <nav className="flex flex-col space-y-2">
//         {/* Dashboard */}
//         <Link
//           to="/dashboard"
//           className="flex items-center justify-between p-3 rounded-lg text-white font-semibold bg-[#008ecc] shadow-[0_4px_10px_0_#99c7db]"
//         >
//           <div className="flex items-center space-x-3">
//             <div className="bg-white p-1 rounded-[12px] shadow-md text-gray-500">
//               <Home size={18} className="text-[#008CD3]" />
//             </div>
//             <span>Dashboard</span>
//           </div>
//         </Link>

//         {/* Leads */}
//         <button
//           className="flex items-center justify-between text-sm space-x-3 p-2 font-semibold text-gray-700 rounded-lg hover:bg-[#008ecc] hover:shadow-[0_4px_10px_0_#99c7db] hover:text-white"
//           onClick={() => setShowHRMSystem(!showHRMSystem)}
//         >
//           <div className="flex items-center space-x-3">
//             <div className="bg-white p-2 rounded-[12px] shadow-lg">
//               <User size={18} className="text-gray-600 hover:text-[#008ECC]" />
//             </div>
//             <span>Leads</span>
//           </div>
//           <ChevronRight
//             size={18}
//             className={`ml-auto transition-transform duration-300 ${
//               showHRMSystem ? "rotate-90" : ""
//             }`}
//           />
//         </button>

//         {showHRMSystem && (
//           <>
//             <Link
//               to="/person"
//               className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
//             >
//               <div className="bg-white p-1 rounded-[12px] shadow-md">
//                 <User size={18} className="text-gray-500" />
//               </div>
//               <span>Persons</span>
//             </Link>
//             <Link
//               to="/organization"
//               className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
//             >
//               <div className="bg-white p-1 rounded-[12px] shadow-md">
//                 <Users size={18} className="text-gray-500" />
//               </div>
//               <span>Organization</span>
//             </Link>
//             <Link
//               to="/leadGroup"
//               className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
//             >
//               <div className="bg-white p-1 rounded-[12px] shadow-md">
//                 <Layers size={18} className="text-gray-500" />
//               </div>
//               <span>Lead groups</span>
//             </Link>
//           </>
//         )}

//         {/* Deals */}
//         <button
//           className="flex items-center justify-between text-sm font-semibold space-x-3 p-3 rounded-lg hover:bg-[#008ECC] hover:shadow-[0_4px_10px_0_#99c7db] hover:text-white text-gray-700"
//           onClick={() => setShowUserManagement(!showUserManagement)}
//         >
//           <div className="flex items-center space-x-3">
//             <div className="bg-white shadow-lg p-1 rounded-[12px]">
//               <Tag size={18} className="text-gray-500" />
//             </div>
//             <span>Deals</span>
//           </div>
//           <ChevronRight
//             size={18}
//             className={`ml-auto transition-transform duration-300 ${
//               showUserManagement ? "rotate-90" : ""
//             }`}
//           />
//         </button>

//         {showUserManagement && (
//           <>
//             <Link
//               to="/deals"
//               className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
//             >
//               <div className="bg-white p-1 rounded-[12px] shadow-md">
//                 <Tag size={18} className="text-gray-500" />
//               </div>
//               <span>All deals</span>
//             </Link>
//             <Link
//               to="/pipeline"
//               className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
//             >
//               <div className="bg-white shadow-lg p-1 rounded-[12px]">
//                 <List size={18} className="text-gray-500" />
//               </div>
//               <span>Pipeline</span>
//             </Link>
//           </>
//         )}

//         {/* Invoices */}
//         <Link to="/invoice">
//           <button className="flex items-center justify-between text-sm space-x-3 w-[220px] p-3 font-semibold text-gray-700 rounded-lg hover:bg-[#008ecc] hover:shadow-[0_4px_10px_0_#99c7db] hover:text-white">
//             <div className="flex items-center space-x-3 text-sm font-semibold">
//               <div className="bg-white p-1 rounded-[12px] shadow-md text-gray-500">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   height="20px"
//                   viewBox="0 -960 960 960"
//                   width="20px"
//                   fill="#1f1f1f"
//                 >
//                   <path d="M340-460h280v-64H340v64Zm0 120h280v-64H340v64Zm0 120h174v-64H340v64ZM263.72-96Q234-96 213-117.15T192-168v-624q0-29.7 21.15-50.85Q234.3-864 264-864h312l192 192v504q0 29.7-21.16 50.85Q725.68-96 695.96-96H263.72ZM528-624v-168H264v624h432v-456H528ZM264-792v168-168 624-624Z" />
//                 </svg>
//               </div>
//               <span>Invoices</span>
//             </div>
//             <ChevronRight size={18} />
//           </button>
//         </Link>

//         {/* Proposal */}
//         <button onClick={() => setProposal(!proposal)} className="sidebar-item">
//           <div className="flex items-center space-x-3">
//             <div className="bg-white p-2 rounded-[12px] shadow-lg">
//               <Edit size={18} className="text-gray-600 hover:text-[#008ECC]" />
//             </div>
//             <span>Proposal</span>
//           </div>
//           <ChevronRight
//             size={18}
//             className={`transition-transform duration-300 ${
//               proposal ? "rotate-90" : ""
//             }`}
//           />
//         </button>

//         {proposal && (
//           <>
//             <Link
//               to="/proposal"
//               className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
//             >
//               <div className="bg-white p-2 rounded-[12px] shadow-lg">
//                 <FileText size={18} className="text-gray-500" />
//               </div>
//               <span>Proposal list</span>
//             </Link>
//             <Link
//               to="/template"
//               className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
//             >
//               <div className="bg-white p-2 rounded-[12px] shadow-lg">
//                 <Layout size={18} className="text-gray-500" />
//               </div>
//               <span>Templates</span>
//             </Link>
//           </>
//         )}

//         {/* Activities */}
//         <button
//           onClick={() => setActivities(!activities)}
//           className="sidebar-item"
//         >
//           <div className="flex items-center space-x-3">
//             <div className="bg-white p-2 rounded-[12px] shadow-md">
//               <Calendar size={18} />
//             </div>
//             <span>Activities</span>
//           </div>
//           <ChevronRight
//             size={18}
//             className={`transition-transform duration-300 ${
//               activities ? "rotate-90" : ""
//             }`}
//           />
//         </button>

//         {activities && (
//           <>
//             <Link
//               to="/calendar"
//               className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
//             >
//               <div className="bg-white p-1 rounded-[12px] shadow-md">
//                 <Calendar size={18} className="text-gray-500" />
//               </div>
//               <span>Calendar View</span>
//             </Link>
//             <Link
//               to="/list"
//               className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
//             >
//               <div className="bg-white p-1 rounded-[12px] shadow-md">
//                 <List size={18} className="text-gray-500" />
//               </div>
//               <span>Activity list</span>
//             </Link>
//           </>
//         )}

//         {/* Expenses */}
//         <button
//           onClick={() => setExpenses(!expenses)}
//           className="sidebar-item"
//         >
//           <div className="flex items-center space-x-3">
//             <div className="bg-white p-2 rounded-[12px] shadow-md">
//               <DollarSign size={18} />
//             </div>
//             <span>Expenses</span>
//           </div>
//           <ChevronRight
//             size={18}
//             className={`transition-transform duration-300 ${
//               expenses ? "rotate-90" : ""
//             }`}
//           />
//         </button>

//         {expenses && (
//           <>
//             <Link
//               to="/expenses"
//               className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
//             >
//               <div className="bg-white p-1 rounded-[12px] shadow-md">
//                 <DollarSign size={18} className="text-gray-500" />
//               </div>
//               <span>Expenses</span>
//             </Link>
//             <Link
//               to="/area-expenses"
//               className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
//             >
//               <div className="bg-white p-1 rounded-[12px] shadow-md">
//                 <MapPin size={18} className="text-gray-500" />
//               </div>
//               <span>Area of Expenses</span>
//             </Link>
//           </>
//         )}

//         {/* Reports */}
//         <button
//           className="flex items-center justify-between text-sm font-semibold space-x-3 p-3 rounded-lg hover:bg-[#008ECC] hover:shadow-[0_4px_10px_0_#99c7db] hover:text-white text-gray-700"
//           onClick={() => setReports(!reports)}
//         >
//           <div className="flex items-center space-x-3">
//             <div className="bg-white shadow-lg p-1 rounded-[12px]">
//               <Calendar size={18} className="text-gray-500" />
//             </div>
//             <span>Reports</span>
//           </div>
//           <ChevronRight
//             size={18}
//             className={`ml-auto transition-transform duration-300 ${
//               reports ? "rotate-90" : ""
//             }`}
//           />
//         </button>

//         {reports && (
//           <>
//             <Link
//               to="/report"
//               className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
//             >
//               <div className="bg-white p-1 rounded-[12px] shadow-md">
//                 <Tag size={18} className="text-gray-500" />
//               </div>
//               <span>Deals</span>
//             </Link>
//             <Link
//               to="/report/proposal"
//               className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
//             >
//               <div className="bg-white p-1 rounded-[12px] shadow-md">
//                 <Edit size={18} className="text-gray-600 hover:text-[#008ECC]" />
//               </div>
//               <span>Proposal</span>
//             </Link>
//             <Link
//               to="/pipeline-charts"
//               className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
//             >
//               <div className="bg-white p-1 rounded-[12px] shadow-md">
//                 <List size={18} className="text-gray-500" />
//               </div>
//               <span>Pipeline</span>
//             </Link>
//             <Link
//               to="/payment"
//               className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
//             >
//               <div className="bg-white p-1 rounded-[12px] shadow-md">
//                 <CreditCard size={18} className="text-gray-500" />
//               </div>
//               <span>Payment history</span>
//             </Link>
//           </>
//         )}

//         {/* Users & Roles */}
//         <Link
//           to="/user/roles"
//           className="flex items-center justify-between p-3 rounded-lg font-semibold hover:bg-[#008ECC] hover:shadow-[0_4px_10px_0_#99c7db] hover:text-white text-gray-700"
//         >
//           <div className="flex items-center space-x-3 text-sm font-semibold">
//             <div className="bg-white p-1 rounded-[12px] shadow-md text-gray-500">
//               <Shield size={20} />
//             </div>
//             <span>Users & Roles</span>
//           </div>
//           <ChevronRight size={18} className="ml-auto" />
//         </Link>
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;




// Sidebar.jsx
import React, { useState } from "react";
import {
  Home,
  Briefcase,
  ChevronRight,
  Users,
  X,
  User,
  Layers,
  Tag,
  List,
  Calendar,
  Shield,
  DollarSign,
  MapPin,
  CreditCard,
  Edit,
  Layout,
  FileText,
} from "react-feather";
import { NavLink, Link, useLocation } from "react-router-dom";

const IconCircle = ({ children }) => (
  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md">
    {children}
  </div>
);

const SidebarItem = ({ to, icon, label, exact = false, onClick }) => {
  return (
    <NavLink
      to={to}
      end={exact}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center justify-between w-full p-3 rounded-lg transition-colors duration-150 
         ${isActive ? "bg-[#008ecc] text-white shadow-[0_6px_18px_rgba(0,140,204,0.18)]" : "text-gray-700 hover:bg-[#f2fbff]"}`
      }
    >
      <div className="flex items-center space-x-3">
        <IconCircle>{icon}</IconCircle>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <ChevronRight size={16} className="opacity-0" />
    </NavLink>
  );
};

const Collapsible = ({ label, icon, open, onToggle, children }) => {
  return (
    <div>
      <button
        onClick={onToggle}
        className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors duration-150
          ${open ? "bg-[#f0fbff] text-gray-900" : "text-gray-700 hover:bg-[#f8f9fb]"}`}
      >
        <div className="flex items-center space-x-3">
          <IconCircle>{icon}</IconCircle>
          <span className="text-sm font-medium">{label}</span>
        </div>
        <ChevronRight
          size={18}
          className={`ml-2 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
        />
      </button>

      {open && <div className="pl-12 mt-1 flex flex-col gap-1">{children}</div>}
    </div>
  );
};

const SmallLink = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 p-2 rounded-lg text-sm ${isActive ? "text-[#008ECC] font-semibold" : "text-gray-700 hover:text-[#008ECC]"}`
    }
  >
    <div className="w-7 h-7 flex items-center justify-center rounded-md bg-white shadow-sm">
      {icon}
    </div>
    <span>{label}</span>
  </NavLink>
);

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [showLeads, setShowLeads] = useState(false);
  const [showDeals, setShowDeals] = useState(false);
  const [showProposal, setShowProposal] = useState(false);
  const [showActivities, setShowActivities] = useState(false);
  const [showExpenses, setShowExpenses] = useState(false);
  const [showReports, setShowReports] = useState(false);

  const location = useLocation();

  return (
    <aside
      className={`fixed lg:relative top-0 left-0 h-full bg-white p-4 w-64 transition-transform overflow-y-auto sidebar-scroll z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
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

      <nav className="flex flex-col gap-2 px-2">
        {/* Dashboard (active pill style) */}
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-full shadow-[0_6px_18px_rgba(0,140,204,0.18)] w-full text-sm font-semibold
             ${isActive ? "bg-[#008ecc] text-white" : "bg-transparent text-gray-700 hover:bg-[#f2fbff]"}`
          }
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white">
            <Home size={18} className={location.pathname === "/dashboard" ? "text-[#008CD3]" : "text-gray-700"} />
          </div>
          <span>Dashboard</span>
        </NavLink>

        {/* Leads */}
        {/* <Collapsible
          label="Leads"
          icon={<User size={18} className="text-gray-700" />}
          open={showLeads}
          onToggle={() => setShowLeads((s) => !s)}
        > */}
          {/* <SmallLink to="/person" icon={<User size={16} />} label="Persons" /> */}
          {/* <SmallLink to="/organization" icon={<Users size={16} />} label="Organization" />
          <SmallLink to="/leadGroup" icon={<Layers size={16} />} label="Lead groups" /> */}
        {/* </Collapsible> */}

 <Collapsible
  label={
    <Link to="/leads" className="flex items-center gap-2">
      <User size={18} className="text-gray-700" />
      Leads
    </Link>
  }
  icon={null} // removes arrow icon
  open={false} // no dropdown
  onToggle={() => {}} // no toggle
/>
       

        {/* Deals */}
        <Collapsible
          label="Deals"
          icon={<Tag size={18} className="text-gray-700" />}
          open={showDeals}
          onToggle={() => setShowDeals((s) => !s)}
        >
          <SmallLink to="/deals" icon={<Tag size={16} />} label="All deals" />
          <SmallLink to="/pipeline" icon={<List size={16} />} label="Pipeline" />
        </Collapsible>

        {/* Invoices */}
        <SidebarItem
          to="/invoice"
          exact
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="18px"
              viewBox="0 -960 960 960"
              width="18px"
              fill="#1f1f1f"
            >
              <path d="M340-460h280v-64H340v64Zm0 120h280v-64H340v64Zm0 120h174v-64H340v64ZM263.72-96Q234-96 213-117.15T192-168v-624q0-29.7 21.15-50.85Q234.3-864 264-864h312l192 192v504q0 29.7-21.16 50.85Q725.68-96 695.96-96H263.72ZM528-624v-168H264v624h432v-456H528ZM264-792v168-168 624-624Z" />
            </svg>
          }
          label="Invoices"
        />

        {/* Proposal */}
        <Collapsible
          label="Proposal"
          icon={<Edit size={18} className="text-gray-700" />}
          open={showProposal}
          onToggle={() => setShowProposal((s) => !s)}
        >
          <SmallLink to="/proposal" icon={<FileText size={16} />} label="Proposal list" />
          <SmallLink to="/template" icon={<Layout size={16} />} label="Templates" />
        </Collapsible>

        {/* Activities */}
        <Collapsible
          label="Activities"
          icon={<Calendar size={18} className="text-gray-700" />}
          open={showActivities}
          onToggle={() => setShowActivities((s) => !s)}
        >
          <SmallLink to="/calendar" icon={<Calendar size={16} />} label="Calendar View" />
          <SmallLink to="/list" icon={<List size={16} />} label="Activity list" />
        </Collapsible>

        {/* Expenses */}
        <Collapsible
          label="Expenses"
          icon={<DollarSign size={18} className="text-gray-700" />}
          open={showExpenses}
          onToggle={() => setShowExpenses((s) => !s)}
        >
          <SmallLink to="/expenses" icon={<DollarSign size={16} />} label="Expenses" />
          <SmallLink to="/area-expenses" icon={<MapPin size={16} />} label="Area of Expenses" />
        </Collapsible>

        {/* Reports */}
        <Collapsible
          label="Reports"
          icon={<Calendar size={18} className="text-gray-700" />}
          open={showReports}
          onToggle={() => setShowReports((s) => !s)}
        >
          <SmallLink to="/report" icon={<Tag size={16} />} label="Deals" />
          <SmallLink to="/report/proposal" icon={<Edit size={16} />} label="Proposal" />
          <SmallLink to="/pipeline-charts" icon={<List size={16} />} label="Pipeline" />
          <SmallLink to="/payment" icon={<CreditCard size={16} />} label="Payment history" />
        </Collapsible>

        {/* Users & Roles */}
        <SidebarItem to="/user/roles" icon={<Shield size={18} />} label="Users & Roles" />
      </nav>
    </aside>
  );
};

export default Sidebar;
