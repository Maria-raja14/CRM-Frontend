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
  DollarSign,
  MapPin,
  CreditCard,
  Edit,
  Layout,
  FileText,
} from "react-feather";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [showLeads, setShowLeads] = useState(false);
  const [showDeals, setShowDeals] = useState(false);
  const [proposal, setProposal] = useState(false);
  const [activities, setActivities] = useState(false);
  const [reports, setReports] = useState(false);
  const [expenses, setExpenses] = useState(false);

  return (
    <div
      className={`fixed lg:relative top-0 left-0 h-full bg-white p-4 w-64 transition-transform overflow-y-auto sidebar-scroll ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 z-50`}
    >
      {/* Logo & Close button */}
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

      {/* Sidebar Navigation */}
      <nav className="flex flex-col space-y-2">
        {/* Dashboard */}
        <Link
          to="/dashboard"
          className="flex items-center justify-between p-3 rounded-lg text-white font-semibold bg-[#008ecc] shadow-[0_4px_10px_0_#99c7db]"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-white p-1 rounded-[12px] shadow-md text-gray-500">
              <Home size={18} className="text-[#008CD3]" />
            </div>
            <span>Dashboard</span>
          </div>
        </Link>

        {/* Leads */}
        <button
          onClick={() => setShowLeads(!showLeads)}
          className="flex items-center justify-between p-3 rounded-lg font-semibold text-sm text-gray-700 hover:bg-[#008ECC] hover:shadow-[0_4px_10px_0_#99c7db] hover:text-white"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-[12px] shadow-md">
              <User size={18} />
            </div>
            <span>Leads</span>
          </div>
          <ChevronRight
            size={18}
            className={`transition-transform duration-300 ${
              showLeads ? "rotate-90" : ""
            }`}
          />
        </button>

        {showLeads && (
          <>
            <Link to="/person" className="sidebar-subitem">
              <User size={18} />
              <span>Persons</span>
            </Link>
            <Link to="/organization" className="sidebar-subitem">
              <Briefcase size={18} />
              <span>Organization</span>
            </Link>
            <Link to="/leadGroup" className="sidebar-subitem">
              <Layers size={18} />
              <span>Lead groups</span>
            </Link>
          </>
        )}

        {/* Deals */}
        <button
          onClick={() => setShowDeals(!showDeals)}
          className="sidebar-item"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-[12px] shadow-md">
              <Tag size={18} />
            </div>
            <span>Deals</span>
          </div>
          <ChevronRight
            size={18}
            className={`transition-transform duration-300 ${
              showDeals ? "rotate-90" : ""
            }`}
          />
        </button>

        {showDeals && (
          <>
            <Link to="/deals" className="sidebar-subitem">
              <Tag size={18} />
              <span>All deals</span>
            </Link>
            <Link to="/pipeline" className="sidebar-subitem">
              <List size={18} />
              <span>Pipeline</span>
            </Link>
          </>
        )}

        {/* Proposal */}
        <button
          onClick={() => setProposal(!proposal)}
          className="sidebar-item"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-[12px] shadow-md">
              <Edit size={18} />
            </div>
            <span>Proposal</span>
          </div>
          <ChevronRight
            size={18}
            className={`transition-transform duration-300 ${
              proposal ? "rotate-90" : ""
            }`}
          />
        </button>

        {proposal && (
          <>
            <Link to="/proposal" className="sidebar-subitem">
              <FileText size={18} />
              <span>Proposal list</span>
            </Link>
            <Link to="/template" className="sidebar-subitem">
              <Layout size={18} />
              <span>Templates</span>
            </Link>
          </>
        )}

        {/* Activities */}
        <button
          onClick={() => setActivities(!activities)}
          className="sidebar-item"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-[12px] shadow-md">
              <Calendar size={18} />
            </div>
            <span>Activities</span>
          </div>
          <ChevronRight
            size={18}
            className={`transition-transform duration-300 ${
              activities ? "rotate-90" : ""
            }`}
          />
        </button>

        {activities && (
          <>
            <Link to="/calendar" className="sidebar-subitem">
              <Calendar size={18} />
              <span>Calendar View</span>
            </Link>
            <Link to="/list" className="sidebar-subitem">
              <List size={18} />
              <span>Activity list</span>
            </Link>
          </>
        )}

        {/* Expenses */}
        <button
          onClick={() => setExpenses(!expenses)}
          className="sidebar-item"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-[12px] shadow-md">
              <DollarSign size={18} />
            </div>
            <span>Expenses</span>
          </div>
          <ChevronRight
            size={18}
            className={`transition-transform duration-300 ${
              expenses ? "rotate-90" : ""
            }`}
          />
        </button>

        {expenses && (
          <>
            <Link to="/expenses" className="sidebar-subitem">
              <DollarSign size={18} />
              <span>Expenses</span>
            </Link>
            <Link to="/area-expenses" className="sidebar-subitem">
              <MapPin size={18} />
              <span>Area of Expenses</span>
            </Link>
          </>
        )}

        {/* Reports */}
        <button
          onClick={() => setReports(!reports)}
          className="sidebar-item"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-[12px] shadow-md">
              <Calendar size={18} />
            </div>
            <span>Reports</span>
          </div>
          <ChevronRight
            size={18}
            className={`transition-transform duration-300 ${
              reports ? "rotate-90" : ""
            }`}
          />
        </button>

        {reports && (
          <>
            <Link to="/report" className="sidebar-subitem">
              <Tag size={18} />
              <span>Deals</span>
            </Link>
            <Link to="/report/proposal" className="sidebar-subitem">
              <Edit size={18} />
              <span>Proposal</span>
            </Link>
            <Link to="/pipeline-charts" className="sidebar-subitem">
              <List size={18} />
              <span>Pipeline</span>
            </Link>
            <Link to="/payment" className="sidebar-subitem">
              <CreditCard size={18} />
              <span>Payment History</span>
            </Link>
          </>
        )}

        {/* Users & Roles */}
        <Link to="/user/roles" className="sidebar-item">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-[12px] shadow-md">
              <Shield size={18} />
            </div>
            <span>Users & Roles</span>
          </div>
          <ChevronRight size={18} />
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
