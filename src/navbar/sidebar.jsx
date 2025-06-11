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
      className={`fixed lg:relative top-0 left-0 h-full bg-white p-4 w-64 transition-transform  overflow-y-auto sidebar-scroll ${
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
            <Link to="/dashboard">Dashboard</Link>
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
            {/* <button className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]">
              <div className="bg-white p-1 rounded-[12px] shadow-md">
                <List size={18} className="text-gray-500" />
              </div>
              <span>Pipeline view</span>
            </button> */}
            <Link
              to="/deals"
              className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
            >
              <div className="bg-white p-1 rounded-[12px] shadow-md">
                <Tag size={18} className="text-gray-500" />
              </div>
              <span>All deals</span>
            </Link>
            {/* <Link
              to="/LostReasons"
              className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
            >
              <div className="bg-white shadow-lg p-1 rounded-[12px]">
                <XCircle size={18} className="text-gray-500" />
              </div>

              <span>Lost reasons</span>
            </Link> */}
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

export default Sidebar;
