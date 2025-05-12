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
  Trello,
  List,
  Calendar,
  Shield,
  XCircle,
  DollarSign,
  MapPin,
  CreditCard,
  Edit,
  Layout,
  FileText,
} from "react-feather";
import { useNavigate, Link } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [showHRM, setShowHRM] = useState(false);
  const [showHRMSystem, setShowHRMSystem] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [proposal, setProposal] = useState(false);
  const [activities, setActivities] = useState(false);
  const [reports, setReports] = useState(false);
  const [showDeals, setShowDeals] = useState(false);
  const [expenses, setExpenses] = useState(false);

  const navigate = useNavigate();

  return (
    <div
      className={`fixed lg:relative top-0 left-0 h-full bg-white p-4 w-64 transition-transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 lg:w-64 z-50`}
    >
      <div className="mb-6 flex justify-between items-center ml-12">
        <img
          src="https://tzi.zaarapp.com//storage/uploads/logo//logo-dark.png"
          alt="Logo"
          className="h-12"
        />
        <button onClick={toggleSidebar} className="lg:hidden">
          <X size={24} className="text-gray-600" />
        </button>
      </div>

      <nav className="flex flex-col space-y-2">
        {/* Dashboard */}
        <button
          className="flex items-center justify-between p-3 rounded-lg text-white font-semibold bg-[#008ecc] shadow-[0_4px_10px_0_#99c7db]"
          onClick={() => setShowHRM(!showHRM)}
        >
          <div className="flex items-center space-x-3 text-sm font-semibold">
            <div className="bg-white p-1 rounded-[12px] shadow-md text-gray-500">
              <Home size={18} className="text-[#008CD3]" />
            </div>
            <span>Dashboard</span>
          </div>
          <ChevronRight
            size={18}
            className={`ml-auto transition-transform duration-300 ${
              showHRM ? "rotate-90" : ""
            }`}
          />
        </button>

        {/* Leads */}
        <button
          className="flex items-center justify-between text-sm space-x-3 p-2 font-semibold text-gray-700 rounded-lg hover:bg-[#008ecc] hover:shadow-[0_4px_10px_0_#99c7db] hover:text-white"
          onClick={() => setShowHRMSystem(!showHRMSystem)}
        >
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-[12px] shadow-lg">
              <User size={18} className="text-gray-600 hover:text-[#008ECC]" />
            </div>
            <span>Leads</span>
          </div>
          <ChevronRight
            size={18}
            className={`ml-auto transition-transform duration-300 ${
              showHRMSystem ? "rotate-90" : ""
            }`}
          />
        </button>

        {showHRMSystem && (
          <>
            <Link
              to="/person"
              className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
            >
              <div className="bg-white p-1 rounded-[12px] shadow-md">
                <User size={18} className="text-gray-500" />
              </div>
              <span>Persons</span>
            </Link>
            <Link
              to="/organization"
              className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
            >
              <div className="bg-white p-1 rounded-[12px] shadow-md">
                <Users size={18} className="text-gray-500" />
              </div>
              <span>Organization</span>
            </Link>
            <Link
              to="/leadGroup"
              className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
            >
              <div className="bg-white p-1 rounded-[12px] shadow-md">
                <Layers size={18} className="text-gray-500" />
              </div>
              <span>Lead groups</span>
            </Link>
          </>
        )}

        {/* Deals */}
        <button
          className="flex items-center justify-between text-sm font-semibold space-x-3 p-3 rounded-lg hover:bg-[#008ECC] hover:shadow-[0_4px_10px_0_#99c7db] hover:text-white text-gray-700"
          onClick={() => setShowUserManagement(!showUserManagement)}
        >
          <div className="flex items-center space-x-3">
            <div className="bg-white shadow-lg p-1 rounded-[12px]">
              <Tag size={18} className="text-gray-500" />
            </div>
            <span>Deals</span>
          </div>
          <ChevronRight
            size={18}
            className={`ml-auto transition-transform duration-300 ${
              showUserManagement ? "rotate-90" : ""
            }`}
          />
        </button>

        {showUserManagement && (
          <>
            <button className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]">
              <div className="bg-white p-1 rounded-[12px] shadow-md">
                <List size={18} className="text-gray-500" />
              </div>
              <span>Pipeline view</span>
            </button>
            <Link
              to="/deals"
              className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
            >
              <div className="bg-white p-1 rounded-[12px] shadow-md">
                <Tag size={18} className="text-gray-500" />
              </div>
              <span>All deals</span>
            </Link>
            <Link
              to="/LostReasons"
              className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
            >
              <div className="bg-white shadow-lg p-1 rounded-[12px]">
                <XCircle size={18} className="text-gray-500" />
              </div>

              <span>Lost reasons</span>
            </Link>
            <Link
              to="/pipeline"
              className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
            >
              <div className="bg-white shadow-lg p-1 rounded-[12px]">
                <List size={18} className="text-gray-500" />
              </div>
              <span>Pipeline</span>
            </Link>
          </>
        )}

        <Link to="/invoice">
          <button className="flex items-center justify-between text-sm space-x-3 w-[220px] p-3 font-semibold text-gray-700 rounded-lg hover:bg-[#008ecc] hover:shadow-[0_4px_10px_0_#99c7db] hover:text-white">
            <div className="flex items-center space-x-3 text-sm font-semibold">
              <div className="bg-white p-1 rounded-[12px] shadow-md text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  fill="#1f1f1f"
                >
                  <path d="M340-460h280v-64H340v64Zm0 120h280v-64H340v64Zm0 120h174v-64H340v64ZM263.72-96Q234-96 213-117.15T192-168v-624q0-29.7 21.15-50.85Q234.3-864 264-864h312l192 192v504q0 29.7-21.16 50.85Q725.68-96 695.96-96H263.72ZM528-624v-168H264v624h432v-456H528ZM264-792v168-168 624-624Z" />
                </svg>
              </div>
              <span>Invoices</span>
            </div>
            <ChevronRight
              size={18}
              className={`ml-auto transition-transform duration-300 ${
                showHRM ? "rotate90" : ""
              }`}
            />
          </button>
        </Link>

        {/* Proposal */}
        <button
          className="flex items-center justify-between text-sm space-x-3 p-2 font-semibold text-gray-700 rounded-lg hover:bg-[#008ecc] hover:shadow-[0_4px_10px_0_#99c7db] hover:text-white"
          onClick={() => setProposal((prev) => !prev)}
        >
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-[12px] shadow-lg">
              <Edit size={18} className="text-gray-600 hover:text-[#008ECC]" />
            </div>
            <span>Proposal</span>
          </div>
          <ChevronRight
            size={18}
            className={`ml-auto transition-transform duration-300 ${
              proposal ? "rotate-90" : ""
            }`}
          />
        </button>

        {proposal && (
          <>
            <Link
              to="/proposal"
              className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
            >
              <div className="bg-white p-2 rounded-[12px] shadow-lg">
                <FileText size={18} className="text-gray-500" />
              </div>
              <span>Proposal list</span>
            </Link>
            <Link
              to="/template"
              className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
            >
              <div className="bg-white p-2 rounded-[12px] shadow-lg">
                <Layout size={18} className="text-gray-500" />
              </div>

              <span>Templates</span>
            </Link>
          </>
        )}

        {/* Activities */}
        <button
          className="flex items-center justify-between text-sm font-semibold space-x-3 p-3 rounded-lg hover:bg-[#008ECC] hover:shadow-[0_4px_10px_0_#99c7db] hover:text-white text-gray-700"
          onClick={() => setActivities(!activities)}
        >
          <div className="flex items-center space-x-3">
            <div className="bg-white shadow-lg p-1 rounded-[12px]">
              <Calendar size={18} className="text-gray-500" />
            </div>
            <span>Activities</span>
          </div>
          <ChevronRight
            size={18}
            className={`ml-auto transition-transform duration-300 ${
              activities ? "rotate-90" : ""
            }`}
          />
        </button>

        {activities && (
          <>
            <Link
              to="/calendar"
              className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
            >
              <div className="bg-white p-1 rounded-[12px] shadow-md">
                <Calendar size={18} className="text-gray-500" />
              </div>
              <span>Calendar View</span>
            </Link>
            <Link
              to="/list"
              className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
            >
              <div className="bg-white p-1 rounded-[12px] shadow-md">
                <List size={18} className="text-gray-500" />
              </div>
              <span>Activity list</span>
            </Link>
          </>
        )}

        {/* Expenses */}
        <button
          className="flex items-center justify-between text-sm font-semibold space-x-3 p-3 rounded-lg hover:bg-[#008ECC] hover:shadow-[0_4px_10px_0_#99c7db] hover:text-white text-gray-700"
          onClick={() => setExpenses(!expenses)}
        >
          <div className="flex items-center space-x-3">
            <div className="bg-white shadow-lg p-1 rounded-[12px]">
              <DollarSign size={18} className="text-gray-500" />
            </div>
            <span>Expenses</span>
          </div>
          <ChevronRight
            size={18}
            className={`ml-auto transition-transform duration-300 ${
              expenses ? "rotate-90" : ""
            }`}
          />
        </button>

        {expenses && (
          <>
            <Link
              to="/expenses"
              className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
            >
              <div className="bg-white p-1 rounded-[12px] shadow-md">
                <DollarSign size={18} className="text-gray-500" />
              </div>
              <span>Expenses</span>
            </Link>
            <Link
              to="/area-expenses"
              className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
            >
              <div className="bg-white p-1 rounded-[12px] shadow-md">
                <MapPin size={18} className="text-gray-500" />
              </div>
              <span>Area of Expenses</span>
            </Link>
          </>
        )}

        {/* Reports */}
        <button
          className="flex items-center justify-between text-sm font-semibold space-x-3 p-3 rounded-lg hover:bg-[#008ECC] hover:shadow-[0_4px_10px_0_#99c7db] hover:text-white text-gray-700"
          onClick={() => setReports(!reports)}
        >
          <div className="flex items-center space-x-3">
            <div className="bg-white shadow-lg p-1 rounded-[12px]">
              <Calendar size={18} className="text-gray-500" />
            </div>
            <span>Reports</span>
          </div>
          <ChevronRight
            size={18}
            className={`ml-auto transition-transform duration-300 ${
              reports ? "rotate-90" : ""
            }`}
          />
        </button>

        {reports && (
          <>
            <Link
              to="/report"
              className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
            >
              <div className="bg-white p-1 rounded-[12px] shadow-md">
                <Tag size={18} className="text-gray-500" />
              </div>
              <span>Deals</span>
            </Link>

            <Link
              to="/report/proposal"
              className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
            >
              <div className="bg-white p-1 rounded-[12px] shadow-md">
                <Edit
                  size={18}
                  className="text-gray-600 hover:text-[#008ECC]"
                />
              </div>
              <span>Proposal</span>
            </Link>
            <Link
              to="/pipeline-charts"
              className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
            >
              <div className="bg-white p-1 rounded-[12px] shadow-md">
                <List size={18} className="text-gray-500" />
              </div>
              <span>Pipline</span>
            </Link>

            <Link
              to="/payment"
              className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
            >
              <div className="bg-white p-1 rounded-[12px] shadow-md">
                <CreditCard size={18} className="text-gray-500" />
              </div>
              <span>Payment history</span>
            </Link>
          </>
        )}

        {/* Users & Roles */}
        <Link
          to="/user/roles"
          className="flex items-center justify-between p-3 rounded-lg font-semibold hover:bg-[#008ECC] hover:shadow-[0_4px_10px_0_#99c7db] hover:text-white text-gray-700"
        >
          <div className="flex items-center space-x-3 text-sm font-semibold">
            <div className="bg-white p-1 rounded-[12px] shadow-md text-gray-500">
              <Shield size={20} />
            </div>
            <span>Users & Roles</span>
          </div>
          <ChevronRight size={18} className="ml-auto" />
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;






// // import React, { useState } from "react";

// // import {
// //   Home,
// //   Briefcase,
// //   ChevronRight,
// //   Users,
// //   X,
// //   User,

// //   BarChart2,


// //   Layers,
// //   Tag,
// //   Trello,
// //   List,
// //   Calendar,
// //   Shield
// // } from "react-feather";
// // =======
// // import { Home, Briefcase, ChevronRight, Users, X, User } from "react-feather";
// // >>>>>>> 3da078d1cd8286b6ab0ac9b84d6974d900bbc886
// // >>>>>>> f31f23c63cadf9305ef1a6c8f05fca59018973d5
// // import { useNavigate, Link } from "react-router-dom";

// // const Sidebar = ({ isOpen, toggleSidebar }) => {
// //   const [showHRM, setShowHRM] = useState(false);
// //   const [showHRMSystem, setShowHRMSystem] = useState(false);
// //   const [showUserManagement, setShowUserManagement] = useState(false);
// // <<<<<<< HEAD
// //   const [showExpenses, setShowExpenses] = useState(false);
// //   const [showReports, setShowReports] = useState(false);
// //   const [showDeals, setShowDeals] = useState(false);

// // =======
// // <<<<<<< HEAD
// //   const [activities, setActivities] = useState(false);
// //   const [reports, setReports] = useState(false);


// // =======
// //   const [proposal, setProposal] = useState(false);

// // >>>>>>> 3da078d1cd8286b6ab0ac9b84d6974d900bbc886
// // >>>>>>> f31f23c63cadf9305ef1a6c8f05fca59018973d5
// //   const navigate = useNavigate();

// //   return (
// //     <>
// //       <div
// //         className={`fixed lg:relative top-0 left-0 h-full bg-white p-4 w-64 transition-transform ${
// //           isOpen ? "translate-x-0" : "-translate-x-full"
// //         } lg:translate-x-0 lg:w-64 z-50`}
// //       >
// // <<<<<<< HEAD
// //         {/* Logo & Close */}
// // =======
// // >>>>>>> f31f23c63cadf9305ef1a6c8f05fca59018973d5
// //         <div className="mb-6 flex justify-between items-center ml-12">
// //           <img
// //             src="https://tzi.zaarapp.com//storage/uploads/logo//logo-dark.png"
// //             alt="Logo"
// //             className="h-12"
// //           />
// //           <button onClick={toggleSidebar} className="lg:hidden">
// //             <X size={24} className="text-gray-600" />
// //           </button>
// //         </div>

// // <<<<<<< HEAD
// //         {/* Navigation */}
// // =======
// // >>>>>>> f31f23c63cadf9305ef1a6c8f05fca59018973d5
// //         <nav className="flex flex-col space-y-2">
// //           {/* Dashboard */}
// //           <button
// //             className="flex items-center justify-between p-3 rounded-lg text-white font-semibold bg-[#008ecc] shadow-[0_4px_10px_0_#99c7db]"
// //             onClick={() => setShowHRM(!showHRM)}
// //           >
// //             <div className="flex items-center space-x-3 text-sm font-semibold">
// //               <div className="bg-white p-1 rounded-[12px] shadow-md text-gray-500">
// //                 <Home size={18} className="text-[#008CD3]" />
// //               </div>
// //               <span>Dashboard</span>
// //             </div>
// //             <ChevronRight
// //               size={18}
// //               className={`ml-auto transition-transform duration-300 ${
// //                 showHRM ? "rotate-90" : ""
// //               }`}
// //             />
// //           </button>

// //           {showHRM && (
// //             <button className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]">
// //               <div className="bg-white p-1 rounded-[12px] shadow-md">
// //                 <Briefcase size={18} className="text-gray-500 hover:text-[#008ECC]" />
// //               </div>
// //               <span>HRM</span>
// //             </button>
// //           )}

// //           {/* Leads */}
// //           <button
// //             className="flex items-center justify-between text-sm space-x-3 p-2 font-semibold text-gray-700 rounded-lg hover:bg-[#008ecc] hover:shadow-[0_4px_10px_0_#99c7db] hover:text-white"
// //             onClick={() => setProposal((prev) => !prev)}
// //           >
// //             <div className="flex items-center space-x-3">
// //               <div className="bg-white p-2 rounded-[12px] shadow-lg">
// //                 <User size={18} className="text-gray-600" />
// //               </div>
// //               <span>Proposal</span>
// //             </div>
// //             <ChevronRight
// //               size={18}
// //               className={`ml-auto transition-transform duration-300 ${
// //                 proposal ? "rotate-90" : ""
// //               }`}
// //             />
// //           </button>

// //           {proposal && (
// //             <>
// //               <Link
// //                 to="/proposal"
// //                 className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
// //               >
// //                 <div className="bg-white p-1 rounded-[12px] shadow-md">
// //                   {/* Icon here if needed */}
// //                 </div>
// //                 <span>Proposal list</span>
// //               </Link>
// //               <Link
// //                 to="/template"
// //                 className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
// //               >
// //                 <div className="bg-white p-1 rounded-[12px] shadow-md">
// //                   {/* Icon here if needed */}
// //                 </div>
// //                 <span>Templates</span>
// //               </Link>
             
// //             </>
// //           )}

// //           <button
// //             className="flex items-center justify-between text-sm space-x-3 p-2 font-semibold text-gray-700 rounded-lg hover:bg-[#008ecc] hover:shadow-[0_4px_10px_0_#99c7db] hover:text-white"
// //             onClick={() => setShowHRMSystem(!showHRMSystem)}
// //           >
// //             <div className="flex items-center space-x-3">
// //               <div className="bg-white p-2 rounded-[12px] shadow-lg">
// //                 <User size={18} className="text-gray-600 hover:text-[#008ECC]" />
// //               </div>
// //               <span>Leads</span>
// //             </div>
// //             <ChevronRight
// //               size={18}
// //               className={`ml-auto transition-transform duration-300 ${
// //                 showHRMSystem ? "rotate-90" : ""
// //               }`}
// //             />
// //           </button>

// //               {/* Deals */}
// //               <button
// //             className="flex items-center justify-between text-sm font-semibold space-x-3 p-3 rounded-lg hover:bg-[#008ECC] hover:shadow-md hover:text-white text-gray-700"
// //             onClick={() => setShowDeals(!showDeals)}
// //           >
// //             <div className="flex items-center space-x-3">
// //               <div className="bg-white shadow-lg p-1 rounded-[12px]">
// //                 <Layers size={18} className="text-gray-500" />
// //               </div>
// //               <span>Deals</span>
// //             </div>
// //             <ChevronRight
// //               size={18}
// //               className={`ml-auto transition-transform duration-300 ${
// //                 showDeals ? "rotate-90" : ""
// //               }`}
// //             />
// //           </button>

// //           {showDeals && (
// //             <Link
// //               to="/pipeline"
// //               className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
// //             >
// //               <div className="bg-white p-1 rounded-[12px] shadow-md">
// //                 <Layers size={18} className="text-gray-500" />
// //               </div>
// //               <span>Pipelines</span>
// //             </Link>
// //           )}

// //           {showHRMSystem && (
// //             <>
// // <<<<<<< HEAD
// // =======
// // <<<<<<< HEAD
// //               <Link to="/person" className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]">
// // =======
// // >>>>>>> f31f23c63cadf9305ef1a6c8f05fca59018973d5
// //               <Link
// //                 to="/person"
// //                 className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
// //               >
// // <<<<<<< HEAD
// //                 <div className="bg-white p-1 rounded-[12px] shadow-md"></div>
// // =======
// // >>>>>>> 3da078d1cd8286b6ab0ac9b84d6974d900bbc886
// //                 <div className="bg-white p-1 rounded-[12px] shadow-md">
// //                   <User size={18} className="text-gray-500" />
// //                 </div>
// // >>>>>>> f31f23c63cadf9305ef1a6c8f05fca59018973d5
// //                 <span>Persons</span>
// //               </Link>
// //               <Link
// //                 to="/organization"
// //                 className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
// //               >
// // <<<<<<< HEAD
// //                 <div className="bg-white p-1 rounded-[12px] shadow-md"></div>
// //                 <span>Organization</span>
// //               </Link>
// // =======
// //                 <div className="bg-white p-1 rounded-[12px] shadow-md">
// //                   <Users size={18} className="text-gray-500" />
// //                 </div>
// //                 <span>Organization</span>
// //               </Link>
// // <<<<<<< HEAD
// //               <Link to="/leadGroup" className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]">
// //                 <div className="bg-white p-1 rounded-[12px] shadow-md">
// //                   <Layers size={18} className="text-gray-500" />
// //                 </div>
// // =======
// // >>>>>>> f31f23c63cadf9305ef1a6c8f05fca59018973d5
// //               <Link
// //                 to="/leadGroup"
// //                 className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
// //               >
// //                 <div className="bg-white p-1 rounded-[12px] shadow-md"></div>
// // <<<<<<< HEAD
// //                 <span>Lead Groups</span>
// // =======
// // >>>>>>> 3da078d1cd8286b6ab0ac9b84d6974d900bbc886
// //                 <span>Lead groups</span>
// // >>>>>>> f31f23c63cadf9305ef1a6c8f05fca59018973d5
// //               </Link>
// //             </>
// //           )}

// // <<<<<<< HEAD
// //           {/* Deals */}
// // =======
// //           <Link
// //             to="/LostReasons"
// //             className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
// //           >
// //             <div className="bg-white p-1 rounded-[12px] shadow-md"></div>
// //             <span>Lost reasons</span>
// //           </Link>
// //           {/* User Management */}
// // >>>>>>> 3da078d1cd8286b6ab0ac9b84d6974d900bbc886
// //           <button
// //             className="flex items-center justify-between text-sm font-semibold space-x-3 p-3 rounded-lg hover:bg-[#008ECC] hover:shadow-[0_4px_10px_0_#99c7db] hover:text-white text-gray-700"
// //             onClick={() => setShowUserManagement(!showUserManagement)}
// //           >
// //             <div className="flex items-center space-x-3">
// //               <div className="bg-white shadow-lg p-1 rounded-[12px]">
// //                 <Tag size={18} className="text-gray-500" />
// //               </div>
// //               <span>Deals</span>
// //             </div>
// //             <ChevronRight
// //               size={18}
// //               className={`ml-auto transition-transform duration-300 ${
// //                 showUserManagement ? "rotate-90" : ""
// //               }`}
// //               a
// //             />
// //           </button>

// //           {showUserManagement && (
// //             <>
// //               <button className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]">
// //                 <div className="bg-white p-1 rounded-[12px] shadow-md">
// // <<<<<<< HEAD
// //                   <Briefcase size={18} className="text-gray-500" />
// // =======
// //                   <Trello size={18} className="text-gray-500" />
// // >>>>>>> f31f23c63cadf9305ef1a6c8f05fca59018973d5
// //                 </div>
// //                 <span>Pipeline view</span>
// //               </button>
// //               <Link
// //                 to="/deals"
// //                 className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
// //               >
// //                 <div className="bg-white p-1 rounded-[12px] shadow-md">
// // <<<<<<< HEAD
// //                   <Briefcase size={18} className="text-gray-500" />
// // =======
// //                   <List size={18} className="text-gray-500" />
// // >>>>>>> f31f23c63cadf9305ef1a6c8f05fca59018973d5
// //                 </div>
// //                 <span>All deals</span>
// //               </Link>
// //             </>
// //           )}
// // <<<<<<< HEAD

// // <<<<<<< HEAD
// //           {/* Expenses */}
// //           <button
// //             className="flex items-center justify-between text-sm font-semibold space-x-3 p-3 rounded-lg hover:bg-[#008ECC] hover:shadow-[0_4px_10px_0_#99c7db] hover:text-white text-gray-700"
// //             onClick={() => setShowExpenses(!showExpenses)}
// //           >
// //             <div className="flex items-center space-x-3">
// //               <div className="bg-white shadow-lg p-1 rounded-[12px]">
// //                 <Users size={18} className="text-gray-500" />
// //               </div>
// //               <span>Expenses</span>
// // =======
// //           {/* Activities */}
// //           <button
// //             className="flex items-center justify-between text-sm font-semibold space-x-3 p-3 rounded-lg hover:bg-[#008ECC] hover:shadow-[0_4px_10px_0_#99c7db] hover:text-white text-gray-700"
// //             onClick={() => setActivities(!activities)}
// //           >
// //             <div className="flex items-center space-x-3">
// //               <div className="bg-white shadow-lg p-1 rounded-[12px]">
// //                 <Calendar size={18} className="text-gray-500" />
// //               </div>
// //               <span>Activities</span>
// // >>>>>>> f31f23c63cadf9305ef1a6c8f05fca59018973d5
// //             </div>
// //             <ChevronRight
// //               size={18}
// //               className={`ml-auto transition-transform duration-300 ${
// // <<<<<<< HEAD
// //                 showExpenses ? "rotate-90" : ""
// // =======
// //                 activities ? "rotate-90" : ""
// // >>>>>>> f31f23c63cadf9305ef1a6c8f05fca59018973d5
// //               }`}
// //             />
// //           </button>

// // <<<<<<< HEAD
// //           {showExpenses && (
// //             <>
// //               <Link
// //                 to="/expenses"
// //                 className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
// //               >
// //                 <div className="bg-white p-1 rounded-[12px] shadow-md">
// //                   <Briefcase size={18} className="text-gray-500" />
// //                 </div>
// //                 <span>Expenses</span>
// //               </Link>
// //               <Link
// //                 to="/area-expenses"
// //                 className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
// //               >
// //                 <div className="bg-white p-1 rounded-[12px] shadow-md">
// //                   <Briefcase size={18} className="text-gray-500" />
// //                 </div>
// //                 <span>Area Expenses</span>
// // =======
// //           {activities && (
// //             <>
// //               <Link to="/calendar" className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]">
// //                 <div className="bg-white p-1 rounded-[12px] shadow-md">
// //                   <Calendar size={18} className="text-gray-500" />
// //                 </div>
// //                 <span>Calendar View</span>
// //               </Link>
// //               <Link to="/list" className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]">
// //                 <div className="bg-white p-1 rounded-[12px] shadow-md">
// //                   <List size={18} className="text-gray-500" />
// //                 </div>
// //                 <span>Activity list</span>
// // >>>>>>> f31f23c63cadf9305ef1a6c8f05fca59018973d5
// //               </Link>
// //             </>
// //           )}

// // <<<<<<< HEAD
// //           {/* Reports */}
// //           <button
// //             className="flex items-center justify-between text-sm font-semibold space-x-3 p-3 rounded-lg hover:bg-[#008ECC] hover:shadow-md hover:text-white text-gray-700"
// //             onClick={() => setShowReports(!showReports)}
// //           >
// //             <div className="flex items-center space-x-3">
// //               <div className="bg-white shadow-lg p-1 rounded-[12px]">
// //                 <BarChart2 size={18} className="text-gray-500" />
// // =======

// //           {/* Reports */}
// //           <button
// //             className="flex items-center justify-between text-sm font-semibold space-x-3 p-3 rounded-lg hover:bg-[#008ECC] hover:shadow-[0_4px_10px_0_#99c7db] hover:text-white text-gray-700"
// //             onClick={() => setReports(!reports)}
// //           >
// //             <div className="flex items-center space-x-3">
// //               <div className="bg-white shadow-lg p-1 rounded-[12px]">
// //                 <Calendar size={18} className="text-gray-500" />
// // >>>>>>> f31f23c63cadf9305ef1a6c8f05fca59018973d5
// //               </div>
// //               <span>Reports</span>
// //             </div>
// //             <ChevronRight
// //               size={18}
// //               className={`ml-auto transition-transform duration-300 ${
// // <<<<<<< HEAD
// //                 showReports ? "rotate-90" : ""
// // =======
// //                 reports ? "rotate-90" : ""
// // >>>>>>> f31f23c63cadf9305ef1a6c8f05fca59018973d5
// //               }`}
// //             />
// //           </button>

// // <<<<<<< HEAD
// //           {showReports && (
// //             <Link
// //               to="/pipeline-charts"
// //               className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
// //             >
// //               <div className="bg-white p-1 rounded-[12px] shadow-md">
// //                 <BarChart2 size={18} className="text-gray-500" />
// //               </div>
// //               <span>Pipeline Charts</span>
// //             </Link>
// //           )}

      

        
// //         </nav>
// //       </div>

// //       {/* Mobile overlay */}
// // =======
// //           {reports && (
// //             <>
// //             <Link to="/report" className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]">
// //               <div className="bg-white p-1 rounded-[12px] shadow-md">
// //                 <Calendar size={18} className="text-gray-500" />
// //               </div>
// //               <span>Deals</span>
// //             </Link>
// //             <Link to="/payment" className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]">
// //               <div className="bg-white p-1 rounded-[12px] shadow-md">
// //                 <List size={18} className="text-gray-500" />
// //               </div>
// //               <span>Payment history</span>
// //             </Link>
// //           </>
// //           )}

// //           {/* Users & Roles */}
// //           <button className="flex items-center justify-between p-3 rounded-lg  font-semibold hover:bg-[#008ECC] hover:shadow-[0_4px_10px_0_#99c7db] hover:text-white text-gray-700">
// //             <div className="flex items-center space-x-3 text-sm font-semibold">
// //               <div className="bg-white p-1 rounded-[12px] shadow-md text-gray-500">
// //                 <Shield size={20} />
// //               </div>
// //               <span>Users & Roles</span>
// //             </div>
// //             <ChevronRight size={18} className="ml-auto" />
// //           </button>
// // =======
// //           <Link to="/user/roles">
// //             <button className="flex items-center justify-between text-sm space-x-3 w-[220px] p-3 font-semibold text-gray-700 rounded-lg hover:bg-[#008ecc] hover:shadow-[0_4px_10px_0_#99c7db] hover:text-white">
// //               <div className="flex items-center space-x-3 text-sm font-semibold">
// //                 <div className="bg-white p-1 rounded-[12px] shadow-md text-gray-500">
// //                   <svg
// //                     xmlns="http://www.w3.org/2000/svg"
// //                     height="20px"
// //                     viewBox="0 -960 960 960"
// //                     width="20px"
// //                     fill="#1f1f1f"
// //                   >
// //                     <path d="M695-456 576-575l51-51 68 68 153-152 51 50-204 204Zm-311-24q-60 0-102-42t-42-102q0-60 42-102t102-42q60 0 102 42t42 102q0 60-42 102t-102 42ZM96-192v-92q0-25.78 12.5-47.39T143-366q55-32 116-49t125-17q64 0 125 17t116 49q22 13 34.5 34.61T672-284v92H96Zm72-72h432v-20q0-6.47-3.03-11.76-3.02-5.3-7.97-8.24-47-27-99-41.5T384-360q-54 0-106 14.5T179-304q-4.95 2.94-7.98 8.24Q168-290.47 168-284v20Zm216.21-288Q414-552 435-573.21t21-51Q456-654 434.79-675t-51-21Q354-696 333-674.79t-21 51Q312-594 333.21-573t51 21ZM384-312Zm0-312Z" />
// //                   </svg>
// //                 </div>
// //                 <span>Users & Roles</span>
// //               </div>
// //               <ChevronRight
// //                 size={18}
// //                 className={`ml-auto transition-transform duration-300 ${
// //                   showHRM ? "rotate90" : ""
// //                 }`}
// //               />
// //             </button>
// //           </Link>

// //           <Link to="/invoice">
// //             <button className="flex items-center justify-between text-sm space-x-3 w-[220px] p-3 font-semibold text-gray-700 rounded-lg hover:bg-[#008ecc] hover:shadow-[0_4px_10px_0_#99c7db] hover:text-white">
// //               <div className="flex items-center space-x-3 text-sm font-semibold">
// //                 <div className="bg-white p-1 rounded-[12px] shadow-md text-gray-500">
// //                   <svg
// //                     xmlns="http://www.w3.org/2000/svg"
// //                     height="20px"
// //                     viewBox="0 -960 960 960"
// //                     width="20px"
// //                     fill="#1f1f1f"
// //                   >
// //                     <path d="M340-460h280v-64H340v64Zm0 120h280v-64H340v64Zm0 120h174v-64H340v64ZM263.72-96Q234-96 213-117.15T192-168v-624q0-29.7 21.15-50.85Q234.3-864 264-864h312l192 192v504q0 29.7-21.16 50.85Q725.68-96 695.96-96H263.72ZM528-624v-168H264v624h432v-456H528ZM264-792v168-168 624-624Z" />
// //                   </svg>
// //                 </div>
// //                 <span>Invoices</span>
// //               </div>
// //               <ChevronRight
// //                 size={18}
// //                 className={`ml-auto transition-transform duration-300 ${
// //                   showHRM ? "rotate90" : ""
// //                 }`}
// //               />
// //             </button>
// //           </Link>
// // >>>>>>> 3da078d1cd8286b6ab0ac9b84d6974d900bbc886
// //         </nav>
// //       </div>

// // >>>>>>> f31f23c63cadf9305ef1a6c8f05fca59018973d5
// //       {isOpen && (
// //         <div
// //           className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
// //           onClick={toggleSidebar}
// //         ></div>
// //       )}
// //     </>
// //   );
// // };

// // export default Sidebar;


// // import React, { useState } from "react";
// // import {
// //   Home,
// //   Briefcase,
// //   ChevronRight,
// //   Users,
// //   X,
// //   User,
// //   Layers
// // } from "react-feather";
// // import { useNavigate, Link } from "react-router-dom";

// // const Sidebar = ({ isOpen, toggleSidebar }) => {
// //   const [showHRM, setShowHRM] = useState(false);
// //   const [showHRMSystem, setShowHRMSystem] = useState(false);
// //   const [showDeals, setShowDeals] = useState(false);
// //   const [proposal, setProposal] = useState(false);

// //   const navigate = useNavigate();

// //   return (
// //     <div
// //       className={`fixed lg:relative top-0 left-0 h-full bg-white p-4 w-64 transition-transform ${
// //         isOpen ? "translate-x-0" : "-translate-x-full"
// //       } lg:translate-x-0 lg:w-64 z-50`}
// //     >
// //       {/* Logo & Close */}
// //       <div className="mb-6 flex justify-between items-center ml-12">
// //         <img
// //           src="https://tzi.zaarapp.com//storage/uploads/logo//logo-dark.png"
// //           alt="Logo"
// //           className="h-12"
// //         />
// //         <button onClick={toggleSidebar} className="lg:hidden">
// //           <X size={24} className="text-gray-600" />
// //         </button>
// //       </div>

// //       {/* Navigation */}
// //       <nav className="flex flex-col space-y-2">
// //         {/* Dashboard */}
// //         <button
// //           className="flex items-center justify-between p-3 rounded-lg text-white font-semibold bg-[#008ecc] shadow-[0_4px_10px_0_#99c7db]"
// //           onClick={() => setShowHRM(!showHRM)}
// //         >
// //           <div className="flex items-center space-x-3 text-sm font-semibold">
// //             <div className="bg-white p-1 rounded-[12px] shadow-md text-gray-500">
// //               <Home size={18} className="text-[#008CD3]" />
// //             </div>
// //             <span>Dashboard</span>
// //           </div>
// //           <ChevronRight
// //             size={18}
// //             className={`ml-auto transition-transform duration-300 ${
// //               showHRM ? "rotate-90" : ""
// //             }`}
// //           />
// //         </button>

// //         {showHRM && (
// //           <button className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]">
// //             <div className="bg-white p-1 rounded-[12px] shadow-md">
// //               <Briefcase size={18} className="text-gray-500 hover:text-[#008ECC]" />
// //             </div>
// //             <span>HRM</span>
// //           </button>
// //         )}

// //         {/* Proposal */}
// //         <button
// //           className="flex items-center justify-between text-sm space-x-3 p-2 font-semibold text-gray-700 rounded-lg hover:bg-[#008ecc] hover:shadow-[0_4px_10px_0_#99c7db] hover:text-white"
// //           onClick={() => setProposal((prev) => !prev)}
// //         >
// //           <div className="flex items-center space-x-3">
// //             <div className="bg-white p-2 rounded-[12px] shadow-lg">
// //               <User size={18} className="text-gray-600" />
// //             </div>
// //             <span>Proposal</span>
// //           </div>
// //           <ChevronRight
// //             size={18}
// //             className={`ml-auto transition-transform duration-300 ${
// //               proposal ? "rotate-90" : ""
// //             }`}
// //           />
// //         </button>

// //         {proposal && (
// //           <>
// //             <Link
// //               to="/proposal"
// //               className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
// //             >
// //               <div className="bg-white p-1 rounded-[12px] shadow-md"></div>
// //               <span>Proposal list</span>
// //             </Link>
// //             <Link
// //               to="/template"
// //               className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
// //             >
// //               <div className="bg-white p-1 rounded-[12px] shadow-md"></div>
// //               <span>Templates</span>
// //             </Link>
// //           </>
// //         )}

// //         {/* Leads */}
// //         <button
// //           className="flex items-center justify-between text-sm space-x-3 p-2 font-semibold text-gray-700 rounded-lg hover:bg-[#008ecc] hover:shadow-[0_4px_10px_0_#99c7db] hover:text-white"
// //           onClick={() => setShowHRMSystem(!showHRMSystem)}
// //         >
// //           <div className="flex items-center space-x-3">
// //             <div className="bg-white p-2 rounded-[12px] shadow-lg">
// //               <User size={18} className="text-gray-600 hover:text-[#008ECC]" />
// //             </div>
// //             <span>Leads</span>
// //           </div>
// //           <ChevronRight
// //             size={18}
// //             className={`ml-auto transition-transform duration-300 ${
// //               showHRMSystem ? "rotate-90" : ""
// //             }`}
// //           />
// //         </button>

// //         {showHRMSystem && (
// //           <>
// //             <Link
// //               to="/person"
// //               className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
// //             >
// //               <div className="bg-white p-1 rounded-[12px] shadow-md">
// //                 <User size={18} className="text-gray-500" />
// //               </div>
// //               <span>Persons</span>
// //             </Link>
// //             <Link
// //               to="/organization"
// //               className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
// //             >
// //               <div className="bg-white p-1 rounded-[12px] shadow-md">
// //                 <Users size={18} className="text-gray-500" />
// //               </div>
// //               <span>Organization</span>
// //             </Link>
// //             <Link
// //               to="/leadGroup"
// //               className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
// //             >
// //               <div className="bg-white p-1 rounded-[12px] shadow-md">
// //                 <Layers size={18} className="text-gray-500" />
// //               </div>
// //               <span>Lead Groups</span>
// //             </Link>
// //           </>
// //         )}

// //         {/* Deals */}
// //         <button
// //           className="flex items-center justify-between text-sm font-semibold space-x-3 p-3 rounded-lg hover:bg-[#008ECC] hover:shadow-md hover:text-white text-gray-700"
// //           onClick={() => setShowDeals(!showDeals)}
// //         >
// //           <div className="flex items-center space-x-3">
// //             <div className="bg-white shadow-lg p-1 rounded-[12px]">
// //               <Layers size={18} className="text-gray-500" />
// //             </div>
// //             <span>Deals</span>
// //           </div>
// //           <ChevronRight
// //             size={18}
// //             className={`ml-auto transition-transform duration-300 ${
// //               showDeals ? "rotate-90" : ""
// //             }`}
// //           />
// //         </button>

// //         {showDeals && (
// //           <Link
// //             to="/pipeline"
// //             className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
// //           >
// //             <div className="bg-white p-1 rounded-[12px] shadow-md">
// //               <Layers size={18} className="text-gray-500" />
// //             </div>
// //             <span>Pipelines</span>
// //           </Link>
// //         )}
// //       </nav>
// //     </div>
// //   );
// // };

// // export default Sidebar;

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
// } from "react-feather";
// import { useNavigate, Link } from "react-router-dom";

// const Sidebar = ({ isOpen, toggleSidebar }) => {
//   const [showDashboard, setShowDashboard] = useState(false);
//   const [showProposal, setShowProposal] = useState(false);
//   const [showLeads, setShowLeads] = useState(false);
//   const [showDeals, setShowDeals] = useState(false);
//   const [showActivities, setShowActivities] = useState(false);
//   const [showReports, setShowReports] = useState(false);

//   const navigate = useNavigate();

//   const MenuButton = ({ icon, label, isOpen, toggle }) => (
//     <button
//       className="flex items-center justify-between p-3 rounded-lg text-sm font-semibold text-gray-700 hover:bg-[#008ecc] hover:shadow-[0_4px_10px_0_#99c7db] hover:text-white"
//       onClick={toggle}
//     >
//       <div className="flex items-center space-x-3">
//         <div className="bg-white p-1 rounded-[12px] shadow-md">
//           {icon}
//         </div>
//         <span>{label}</span>
//       </div>
//       <ChevronRight
//         size={18}
//         className={`ml-auto transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
//       />
//     </button>
//   );

//   const SubLink = ({ to, icon, label }) => (
//     <Link
//       to={to}
//       className="flex ml-6 text-sm items-center space-x-3 p-2 rounded-lg hover:text-[#008ECC]"
//     >
//       <div className="bg-white p-1 rounded-[12px] shadow-md">{icon}</div>
//       <span>{label}</span>
//     </Link>
//   );

//   return (
//     <div
//       className={`fixed lg:relative top-0 left-0 h-full bg-white p-4 w-64 transition-transform ${
//         isOpen ? "translate-x-0" : "-translate-x-full"
//       } lg:translate-x-0 z-50`}
//     >
//       {/* Logo and Close button */}
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

//       {/* Menu */}
//       <nav className="flex flex-col space-y-2">
//         {/* Dashboard */}
//         <MenuButton
//           icon={<Home size={18} className="text-[#008CD3]" />}
//           label="Dashboard"
//           isOpen={showDashboard}
//           toggle={() => setShowDashboard(!showDashboard)}
//         />
//         {showDashboard && (
//           <SubLink
//             to="/hrm"
//             icon={<Briefcase size={18} className="text-gray-500" />}
//             label="HRM"
//           />
//         )}

//         {/* Proposal */}
//         <MenuButton
//           icon={<User size={18} className="text-gray-600" />}
//           label="Proposal"
//           isOpen={showProposal}
//           toggle={() => setShowProposal(!showProposal)}
//         />
//         {showProposal && (
//           <>
//             <SubLink to="/proposal" label="Proposal list" icon={<div />} />
//             <SubLink to="/template" label="Templates" icon={<div />} />
//           </>
//         )}

//         {/* Leads */}
//         <MenuButton
//           icon={<User size={18} className="text-gray-600" />}
//           label="Leads"
//           isOpen={showLeads}
//           toggle={() => setShowLeads(!showLeads)}
//         />
//         {showLeads && (
//           <>
//             <SubLink
//               to="/person"
//               icon={<User size={18} className="text-gray-500" />}
//               label="Persons"
//             />
//             <SubLink
//               to="/organization"
//               icon={<Users size={18} className="text-gray-500" />}
//               label="Organization"
//             />
//             <SubLink
//               to="/leadGroup"
//               icon={<Layers size={18} className="text-gray-500" />}
//               label="Lead groups"
//             />
//           </>
//         )}

//         {/* Deals */}
//         <MenuButton
//           icon={<Tag size={18} className="text-gray-500" />}
//           label="Deals"
//           isOpen={showDeals}
//           toggle={() => setShowDeals(!showDeals)}
//         />
//         {showDeals && (
//           <>
//             <SubLink
//               to="#"
//               icon={<Trello size={18} className="text-gray-500" />}
//               label="Pipeline view"
//             />
//             <SubLink
//               to="/deals"
//               icon={<List size={18} className="text-gray-500" />}
//               label="All deals"
//             />
//             <SubLink
//               to="/LostReasons"
//               icon={<div />}
//               label="Lost reasons"
//             />
//           </>
//         )}

//         {/* Activities */}
//         <MenuButton
//           icon={<Calendar size={18} className="text-gray-500" />}
//           label="Activities"
//           isOpen={showActivities}
//           toggle={() => setShowActivities(!showActivities)}
//         />
//         {showActivities && (
//           <>
//             <SubLink
//               to="/calendar"
//               icon={<Calendar size={18} className="text-gray-500" />}
//               label="Calendar View"
//             />
//             <SubLink
//               to="/list"
//               icon={<List size={18} className="text-gray-500" />}
//               label="Activity list"
//             />
//           </>
//         )}

//         {/* Reports */}
//         <MenuButton
//           icon={<Calendar size={18} className="text-gray-500" />}
//           label="Reports"
//           isOpen={showReports}
//           toggle={() => setShowReports(!showReports)}
//         />
//         {showReports && (
//           <>
//             <SubLink
//               to="/report"
//               icon={<Calendar size={18} className="text-gray-500" />}
//               label="Deals"
//             />
//             <SubLink
//               to="/payment"
//               icon={<List size={18} className="text-gray-500" />}
//               label="Payment history"
//             />
//           </>
//         )}

//         {/* Invoices */}
//         <Link to="/invoice">
//           <button className="flex items-center justify-between text-sm space-x-3 w-full p-3 font-semibold text-gray-700 rounded-lg hover:bg-[#008ecc] hover:shadow-[0_4px_10px_0_#99c7db] hover:text-white">
//             <div className="flex items-center space-x-3">
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
//             <ChevronRight size={18} className="ml-auto" />
//           </button>
//         </Link>

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
