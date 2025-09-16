
import { useState } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import all sidebar icons
import {
  Home,
  Briefcase,
  Users,
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
  Check,
  X,
  UserPlus
} from "react-feather";

export default function CreateRoleModal({ onRoleCreated }) {

const API_URL = import.meta.env.VITE_API_URL;


  const [isDialogOpen, setIsDialogOpen] = useState(false);
 const [roleData, setRoleData] = useState({
  name: "",
  permissions: {
    dashboard: false,
    leads: false,
    deals_all: false,
    deals_pipeline: false,
    invoices: false,
    proposal: false,
    activities: false,
    activities_calendar: false,
    activities_list: false,
    users_roles: false,
    admin_access: false,
  }
});


  const handlePermissionChange = (permission) => {
    setRoleData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission]
      }
    }));
  };

const handleCancel = () => {
  setRoleData({
    name: "",
    permissions: {
      dashboard: false,
      leads: false,
      deals_all: false,
      deals_pipeline: false,
      invoices: false,
      proposal: false,
      activities: false,
      activities_calendar: false,
      activities_list: false,
      users_roles: false,
      admin_access: false,
    }
  });
  setIsDialogOpen(false);
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${API_URL}/roles`,
        roleData,
        { headers: { Authorization: `Bearer ${token} `} }
      );

      toast.success("Role created successfully!");
      if (onRoleCreated) onRoleCreated();
      handleCancel();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create role");
    }
  };

  // Permission groups for better organization
 const permissionGroups = [
  {
    title: "Core Modules",
    permissions: [
      { key: "dashboard", label: "Dashboard", icon: Home },
      { key: "leads", label: "Leads", icon: Users },
      { key: "deals_all", label: "All Deals", icon: Tag },
      { key: "deals_pipeline", label: "Pipeline View", icon: List },
    ]
  },
  {
    title: "Documents",
    permissions: [
      { key: "invoices", label: "Invoices", icon: FileText },
      { key: "proposal", label: "Proposal", icon: Edit },
    ]
  },
  {
    title: "Activities",
    permissions: [
      { key: "activities", label: "Activities", icon: Briefcase },
      { key: "activities_calendar", label: "Calendar View", icon: Calendar },
      { key: "activities_list", label: "Activity List", icon: List },
    ]
  },
  {
    title: "Administration",
    permissions: [
      { key: "users_roles", label: "Users & Roles", icon: Shield },
      { key: "admin_access", label: "Admin Access", icon: Shield },
    ]
  }
];


  return (
    <div>
      <ToastContainer />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md">
            <UserPlus size={18} />
            <span>Create Role</span>
          </button>
        </DialogTrigger>

        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <UserPlus size={20} />
              Create New Role
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-1">
              Define a new role and set permissions for accessing different parts of the system
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 p-1">
            <div className="space-y-2">
              <label htmlFor="roleName" className="block text-sm font-medium text-gray-700">
                Role Name
              </label>
              <input
                id="roleName"
                type="text"
                name="name"
                placeholder="e.g., Sales Manager, Marketing Specialist"
                value={roleData.name}
                onChange={(e) => setRoleData({...roleData, name: e.target.value})}
                className="p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
              />
            </div>
            
            <div className="border rounded-lg p-5 bg-gray-50">
              <h3 className="font-semibold text-lg mb-4 text-gray-800 flex items-center gap-2">
                <Shield size={18} />
                Permissions Configuration
              </h3>
              
              <div className="grid grid-cols-1 gap-6">
                {permissionGroups.map((group, groupIndex) => (
                  <div key={groupIndex} className="space-y-3">
                    <h4 className="font-medium text-gray-700 border-b pb-1">{group.title}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {group.permissions.map((permission) => {
                        const IconComponent = permission.icon;
                        return (
                          <label 
                            key={permission.key}
                            className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                              roleData.permissions[permission.key] 
                                ? "bg-green-50 border-green-500" 
                                : "bg-white border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            <div className={`flex items-center justify-center w-6 h-6 rounded border ${
                              roleData.permissions[permission.key] 
                                ? "bg-green-500 border-green-500 text-white" 
                                : "bg-white border-gray-300"
                            }`}>
                              <input
                                type="checkbox"
                                checked={roleData.permissions[permission.key]}
                                onChange={() => handlePermissionChange(permission.key)}
                                className="absolute opacity-0 h-0 w-0"
                              />
                              {roleData.permissions[permission.key] && <Check size={14} />}
                            </div>
                            <IconComponent size={18} className={roleData.permissions[permission.key] ? "text-green-600" : "text-gray-600"} />
                            <span className={roleData.permissions[permission.key] ? "text-green-800 font-medium" : "text-gray-700"}>
                              {permission.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-md font-medium"
              >
                <Check size={16} />
                Create Role
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}