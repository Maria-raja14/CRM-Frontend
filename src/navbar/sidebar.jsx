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
         ${
           isActive
             ? "bg-[#008ecc] text-white shadow-[0_6px_18px_rgba(0,140,204,0.18)]"
             : "text-gray-700 hover:bg-[#f2fbff]"
         }`
      }
    >
      <div className="flex items-center space-x-3">
        <IconCircle>{icon}</IconCircle>
        <span className="text-sm font-medium">{label}</span>
      </div>
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
          className={`ml-2 transition-transform duration-200 ${
            open ? "rotate-90" : ""
          }`}
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
      `flex items-center gap-3 p-2 rounded-lg text-sm ${
        isActive
          ? "text-[#008ECC] font-semibold"
          : "text-gray-700 hover:text-[#008ECC]"
      }`
    }
  >
    <div className="w-7 h-7 flex items-center justify-center rounded-md bg-white shadow-sm">
      {icon}
    </div>
    <span>{label}</span>
  </NavLink>
);

const Sidebar = ({ isOpen, toggleSidebar }) => {
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
        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-full shadow-[0_6px_18px_rgba(0,140,204,0.18)] w-full text-sm font-semibold
             ${
               isActive
                 ? "bg-[#008ecc] text-white"
                 : "bg-transparent text-gray-700 hover:bg-[#f2fbff]"
             }`
          }
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white">
            <Home
              size={18}
              className={
                location.pathname === "/dashboard"
                  ? "text-[#008CD3]"
                  : "text-gray-700"
              }
            />
          </div>
          <span>Dashboard</span>
        </NavLink>

        {/* Leads (direct link, no arrow) */}
        <SidebarItem
          to="/leads"
          icon={<User size={18} className="text-gray-700" />}
          label="Leads"
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
          <SmallLink
            to="/proposal"
            icon={<FileText size={16} />}
            label="Proposal list"
          />
          <SmallLink
            to="/template"
            icon={<Layout size={16} />}
            label="Templates"
          />
        </Collapsible>

        {/* Activities */}
        <Collapsible
          label="Activities"
          icon={<Calendar size={18} className="text-gray-700" />}
          open={showActivities}
          onToggle={() => setShowActivities((s) => !s)}
        >
          <SmallLink
            to="/calendar"
            icon={<Calendar size={16} />}
            label="Calendar View"
          />
          <SmallLink
            to="/list"
            icon={<List size={16} />}
            label="Activity list"
          />
        </Collapsible>

        {/* Expenses */}
        <Collapsible
          label="Expenses"
          icon={<DollarSign size={18} className="text-gray-700" />}
          open={showExpenses}
          onToggle={() => setShowExpenses((s) => !s)}
        >
          <SmallLink
            to="/expenses"
            icon={<DollarSign size={16} />}
            label="Expenses"
          />
          <SmallLink
            to="/area-expenses"
            icon={<MapPin size={16} />}
            label="Area of Expenses"
          />
        </Collapsible>

        {/* Reports */}
        <Collapsible
          label="Reports"
          icon={<Calendar size={18} className="text-gray-700" />}
          open={showReports}
          onToggle={() => setShowReports((s) => !s)}
        >
          <SmallLink to="/report" icon={<Tag size={16} />} label="Deals" />
          <SmallLink
            to="/report/proposal"
            icon={<Edit size={16} />}
            label="Proposal"
          />
          <SmallLink
            to="/pipeline-charts"
            icon={<List size={16} />}
            label="Pipeline"
          />
          <SmallLink
            to="/payment"
            icon={<CreditCard size={16} />}
            label="Payment history"
          />
        </Collapsible>

        {/* Users & Roles */}
        <SidebarItem
          to="/user/roles"
          icon={<Shield size={18} />}
          label="Users & Roles"
        />
      </nav>
    </aside>
  );
};

export default Sidebar;
