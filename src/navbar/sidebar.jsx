
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
  Shield
} from "react-feather";
import { useNavigate, Link } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [showHRM, setShowHRM] = useState(false);
  const [showHRMSystem, setShowHRMSystem] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [activities, setActivities] = useState(false);
  const [reports, setReports] = useState(false);


  const navigate = useNavigate();

  return (
    <>
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

          {showHRM && (
            <button className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]">
              <div className="bg-white p-1 rounded-[12px] shadow-md">
                <Briefcase size={18} className="text-gray-500 hover:text-[#008ECC]" />
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
              <Link to="/person" className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]">
                <div className="bg-white p-1 rounded-[12px] shadow-md">
                  <User size={18} className="text-gray-500" />
                </div>
                <span>Persons</span>
              </Link>
              <Link to="/organization" className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]">
                <div className="bg-white p-1 rounded-[12px] shadow-md">
                  <Users size={18} className="text-gray-500" />
                </div>
                <span>Organization</span>
              </Link>
              <Link to="/leadGroup" className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]">
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
                  <Trello size={18} className="text-gray-500" />
                </div>
                <span>Pipeline view</span>
              </button>
              <Link to="/deals" className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]">
                <div className="bg-white p-1 rounded-[12px] shadow-md">
                  <List size={18} className="text-gray-500" />
                </div>
                <span>All deals</span>
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
              <Link to="/calendar" className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]">
                <div className="bg-white p-1 rounded-[12px] shadow-md">
                  <Calendar size={18} className="text-gray-500" />
                </div>
                <span>Calendar View</span>
              </Link>
              <Link to="/list" className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]">
                <div className="bg-white p-1 rounded-[12px] shadow-md">
                  <List size={18} className="text-gray-500" />
                </div>
                <span>Activity list</span>
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
            <Link to="/report" className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]">
              <div className="bg-white p-1 rounded-[12px] shadow-md">
                <Calendar size={18} className="text-gray-500" />
              </div>
              <span>Deals</span>
            </Link>
            <Link to="/payment" className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]">
              <div className="bg-white p-1 rounded-[12px] shadow-md">
                <List size={18} className="text-gray-500" />
              </div>
              <span>Payment history</span>
            </Link>
          </>
          )}

          {/* Users & Roles */}
          <button className="flex items-center justify-between p-3 rounded-lg  font-semibold hover:bg-[#008ECC] hover:shadow-[0_4px_10px_0_#99c7db] hover:text-white text-gray-700">
            <div className="flex items-center space-x-3 text-sm font-semibold">
              <div className="bg-white p-1 rounded-[12px] shadow-md text-gray-500">
                <Shield size={20} />
              </div>
              <span>Users & Roles</span>
            </div>
            <ChevronRight size={18} className="ml-auto" />
          </button>
        </nav>
      </div>

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
