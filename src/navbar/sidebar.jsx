import React, { useState } from "react";
import { Home, Briefcase, ChevronRight, Users, X, User } from "react-feather";
import { useNavigate, Link } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [showHRM, setShowHRM] = useState(false);
  const [showHRMSystem, setShowHRMSystem] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);

  const navigate = useNavigate();

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed lg:relative top-0 left-0 h-full bg-white p-4  w-64 transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:w-64 z-50`}
      >
        {/* Logo & Close Button */}
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

        {/* Navigation Items */}
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

          {/* HRM System */}
          <button
            className="flex items-center justify-between text-sm space-x-3 p-2 font-semibold text-gray-700 rounded-lg hover:bg-[#008ecc] hover:shadow-[0_4px_10px_0_#99c7db] hover:text-white"
            onClick={() => setShowHRMSystem(!showHRMSystem)}
          >
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-[12px] shadow-lg">
                <User
                  size={18}
                  className="text-gray-600 hover:text-[#008ECC]"
                />
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
                  {/* <Briefcase
                    size={18}
                    className="text-gray-500 hover:text-[#008ECC]"
                  /> */}
                </div>
                <span>Persons</span>
              </Link>
              <Link
                to="/organization"
                className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
              >
                <div className="bg-white p-1 rounded-[12px] shadow-md">
                  {/* <Briefcase
                    size={18}
                    className="text-gray-500 hover:text-[#008ECC]"
                  /> */}
                </div>
                <span>Organization</span>
              </Link>
              <Link
                to="/leadGroup"
                className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
              >
                <div className="bg-white p-1 rounded-[12px] shadow-md"></div>
                <span>Lead groups</span>
              </Link>
            </>
          )}
 <Link
                to="/LostReasons"
                className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]"
              >
                <div className="bg-white p-1 rounded-[12px] shadow-md"></div>
                <span>Lost reasons</span>
              </Link>
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
              a
            />
          </button>

          {showUserManagement && (
            <>
              <button className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]">
                <div className="bg-white p-1 rounded-[12px] shadow-md">
                  <Briefcase
                    size={18}
                    className="text-gray-500 hover:text-[#008ECC]"
                  />
                </div>
                <span>Roles</span>
              </button>
              <button className="flex ml-2 text-sm items-center space-x-3 p-3 rounded-lg hover:text-[#008ECC]">
                <div className="bg-white p-1 rounded-[12px] shadow-md">
                  <Briefcase
                    size={18}
                    className="text-gray-500 hover:text-[#008ECC]"
                  />
                </div>
                <span>Permissions</span>
              </button>
            </>
          )}
          <Link to="/user/roles">
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
                    <path d="M695-456 576-575l51-51 68 68 153-152 51 50-204 204Zm-311-24q-60 0-102-42t-42-102q0-60 42-102t102-42q60 0 102 42t42 102q0 60-42 102t-102 42ZM96-192v-92q0-25.78 12.5-47.39T143-366q55-32 116-49t125-17q64 0 125 17t116 49q22 13 34.5 34.61T672-284v92H96Zm72-72h432v-20q0-6.47-3.03-11.76-3.02-5.3-7.97-8.24-47-27-99-41.5T384-360q-54 0-106 14.5T179-304q-4.95 2.94-7.98 8.24Q168-290.47 168-284v20Zm216.21-288Q414-552 435-573.21t21-51Q456-654 434.79-675t-51-21Q354-696 333-674.79t-21 51Q312-594 333.21-573t51 21ZM384-312Zm0-312Z" />
                  </svg>
                </div>
                <span>Users & Roles</span>
              </div>
              <ChevronRight
                size={18}
                className={`ml-auto transition-transform duration-300 ${
                  showHRM ? "rotate90" : ""
                }`}
              />
            </button>
          </Link>

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
        </nav>
      </div>

      {/* Overlay when sidebar is open (Mobile) */}
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
