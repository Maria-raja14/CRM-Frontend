// // components/Sidebar.jsx
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
} from "react-feather";
import { NavLink, useLocation } from "react-router-dom";

const IconCircle = ({ children, isActive }) => (
  <div className="w-10 h-10 flex items-center justify-center rounded-full shadow-sm bg-white">
    {/* Icon color changes based on active state */}
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
}) => {
  if (!hasPermission) return null;

  return (
    <div>
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

const SmallLink = ({ to, icon, label, hasPermission = true }) => {
  if (!hasPermission) return null;

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 p-2 rounded-full transition-all duration-300
        ${isActive ? "bg-[#f2fbff]" : "hover:bg-[#f8f9fb]"}`
      }
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

      <nav className="flex flex-col gap-3 px-2">
        {/* Dashboard */}
        <SidebarItem
          to="/adminDashboard"
          icon={<Home size={18} />}
          label="Dashboard"
          hasPermission={isAdmin || userPermissions.dashboard}
        />

        {/* Leads */}
        <SidebarItem
          to="/leads"
          icon={<User size={18} />}
          label="Leads"
          hasPermission={isAdmin || userPermissions.leads}
        />

        {/* Pipeline View */}
        <SidebarItem
          to="/Pipelineview"
          icon={<User size={18} />}
          label="Pipeline View"
          hasPermission={isAdmin || userPermissions.leads}
        />

        {/* Deals */}
        <SidebarItem
          to="/deals"
          icon={<Tag size={18} />}
          label="All Deals"
          hasPermission={isAdmin || userPermissions.deals}
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
        >
          <SmallLink
            to="/calendar"
            icon={<Calendar size={16} />}
            label="Calendar View"
            hasPermission={isAdmin || userPermissions.calendar}
          />
          <SmallLink
            to="/list"
            icon={<List size={16} />}
            label="Activity list"
            hasPermission={isAdmin || userPermissions.activityList}
          />
        </Collapsible>

        {/* Users & Roles */}
        <SidebarItem
          to="/user/roles"
          icon={<Shield size={18} />}
          label="Users & Roles"
          hasPermission={isAdmin || userPermissions.usersRoles}
        />
      </nav>
    </aside>
  );
};

export default Sidebar;//original





