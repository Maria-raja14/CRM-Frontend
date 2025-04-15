import React, { useState } from "react";
import {
  Home,
  Briefcase,
  ChevronRight,
  Users,
  X,
  User,
  BarChart2,
  Layers
} from "react-feather";
import { useNavigate, Link } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [showHRM, setShowHRM] = useState(false);
  const [showHRMSystem, setShowHRMSystem] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showExpenses, setShowExpenses] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showDeals, setShowDeals] = useState(false);

  const navigate = useNavigate();

  return (
    <>
      <div
        className={`fixed lg:relative top-0 left-0 h-full bg-white p-4 w-64 transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:w-64 z-50`}
      >
        {/* Logo & Close */}
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

        {/* Navigation */}
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

          {showHRM && (
            <button className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]">
              <div className="bg-white p-1 rounded-[12px] shadow-md">
                <Briefcase
                  size={18}
                  className="text-gray-500 hover:text-[#008ECC]"
                />
              </div>
              <span>HRM</span>
            </button>
          )}

          {/* Leads */}
          <button
            className="flex items-center justify-between text-sm space-x-3 p-2 font-semibold text-gray-700 rounded-lg hover:bg-[#008ecc] hover:shadow-[0_4px_10px_0_#99c7db] hover:text-white"
            onClick={() => setShowHRMSystem(!showHRMSystem)}
          >
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-[12px] shadow-lg">
                <User size={18} className="text-gray-600" />
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

              {/* Deals */}
              <button
            className="flex items-center justify-between text-sm font-semibold space-x-3 p-3 rounded-lg hover:bg-[#008ECC] hover:shadow-md hover:text-white text-gray-700"
            onClick={() => setShowDeals(!showDeals)}
          >
            <div className="flex items-center space-x-3">
              <div className="bg-white shadow-lg p-1 rounded-[12px]">
                <Layers size={18} className="text-gray-500" />
              </div>
              <span>Deals</span>
            </div>
            <ChevronRight
              size={18}
              className={`ml-auto transition-transform duration-300 ${
                showDeals ? "rotate-90" : ""
              }`}
            />
          </button>

          {showDeals && (
            <Link
              to="/pipeline"
              className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
            >
              <div className="bg-white p-1 rounded-[12px] shadow-md">
                <Layers size={18} className="text-gray-500" />
              </div>
              <span>Pipelines</span>
            </Link>
          )}

          {showHRMSystem && (
            <>
              <Link
                to="/person"
                className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
              >
                <div className="bg-white p-1 rounded-[12px] shadow-md"></div>
                <span>Persons</span>
              </Link>
              <Link
                to="/organization"
                className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
              >
                <div className="bg-white p-1 rounded-[12px] shadow-md"></div>
                <span>Organization</span>
              </Link>
              <Link
                to="/leadGroup"
                className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
              >
                <div className="bg-white p-1 rounded-[12px] shadow-md"></div>
                <span>Lead Groups</span>
              </Link>
            </>
          )}

          {/* User Management */}
          <button
            className="flex items-center justify-between text-sm font-semibold space-x-3 p-3 rounded-lg hover:bg-[#008ECC] hover:shadow-[0_4px_10px_0_#99c7db] hover:text-white text-gray-700"
            onClick={() => setShowUserManagement(!showUserManagement)}
          >
            <div className="flex items-center space-x-3">
              <div className="bg-white shadow-lg p-1 rounded-[12px]">
                <Users size={18} className="text-gray-500" />
              </div>
              <span>User Management</span>
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
                  <Briefcase size={18} className="text-gray-500" />
                </div>
                <span>Roles</span>
              </button>
              <button className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]">
                <div className="bg-white p-1 rounded-[12px] shadow-md">
                  <Briefcase size={18} className="text-gray-500" />
                </div>
                <span>Permissions</span>
              </button>
            </>
          )}

          {/* Expenses */}
          <button
            className="flex items-center justify-between text-sm font-semibold space-x-3 p-3 rounded-lg hover:bg-[#008ECC] hover:shadow-[0_4px_10px_0_#99c7db] hover:text-white text-gray-700"
            onClick={() => setShowExpenses(!showExpenses)}
          >
            <div className="flex items-center space-x-3">
              <div className="bg-white shadow-lg p-1 rounded-[12px]">
                <Users size={18} className="text-gray-500" />
              </div>
              <span>Expenses</span>
            </div>
            <ChevronRight
              size={18}
              className={`ml-auto transition-transform duration-300 ${
                showExpenses ? "rotate-90" : ""
              }`}
            />
          </button>

          {showExpenses && (
            <>
              <Link
                to="/expenses"
                className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
              >
                <div className="bg-white p-1 rounded-[12px] shadow-md">
                  <Briefcase size={18} className="text-gray-500" />
                </div>
                <span>Expenses</span>
              </Link>
              <Link
                to="/area-expenses"
                className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
              >
                <div className="bg-white p-1 rounded-[12px] shadow-md">
                  <Briefcase size={18} className="text-gray-500" />
                </div>
                <span>Area Expenses</span>
              </Link>
            </>
          )}

          {/* Reports */}
          <button
            className="flex items-center justify-between text-sm font-semibold space-x-3 p-3 rounded-lg hover:bg-[#008ECC] hover:shadow-md hover:text-white text-gray-700"
            onClick={() => setShowReports(!showReports)}
          >
            <div className="flex items-center space-x-3">
              <div className="bg-white shadow-lg p-1 rounded-[12px]">
                <BarChart2 size={18} className="text-gray-500" />
              </div>
              <span>Reports</span>
            </div>
            <ChevronRight
              size={18}
              className={`ml-auto transition-transform duration-300 ${
                showReports ? "rotate-90" : ""
              }`}
            />
          </button>

          {showReports && (
            <Link
              to="/pipeline-charts"
              className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
            >
              <div className="bg-white p-1 rounded-[12px] shadow-md">
                <BarChart2 size={18} className="text-gray-500" />
              </div>
              <span>Pipeline Charts</span>
            </Link>
          )}

      

        
        </nav>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
