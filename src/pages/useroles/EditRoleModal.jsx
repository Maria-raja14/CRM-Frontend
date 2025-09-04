import { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { toast } from "react-toastify";

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
} from "react-feather";

export default function EditRoleModal({ role, onClose, onRoleUpdated }) {
const API_URL = import.meta.env.VITE_API_URL;


  const [roleData, setRoleData] = useState({
    name: "",
    permissions: {
      dashboard: false,
      leads: false,
      deals: false,
      pipeline: false,
      invoice: false,
      proposal: false,
      templates: false,
      calendar: false,
      activityList: false,
      expenses: false,
      areaExpenses: false,
      dealReports: false,
      proposalReports: false,
      pipelineReports: false,
      paymentHistory: false,
      usersRoles: false,
    }
  });

  useEffect(() => {
    if (role) {
      setRoleData({
        name: role.name || "",
        permissions: role.permissions || {
          dashboard: false,
          leads: false,
          deals: false,
          pipeline: false,
          invoice: false,
          proposal: false,
          templates: false,
          calendar: false,
          activityList: false,
          expenses: false,
          areaExpenses: false,
          dealReports: false,
          proposalReports: false,
          pipelineReports: false,
          paymentHistory: false,
          usersRoles: false,
        }
      });
    }
  }, [role]);

  const handlePermissionChange = (permission) => {
    setRoleData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission]
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/roles/update-role/${role._id}`,
        roleData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Role updated successfully!");
      if (onRoleUpdated) onRoleUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update role");
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Edit Role with Permissions</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 p-3">
          <input
            type="text"
            name="name"
            placeholder="Role Name"
            value={roleData.name}
            onChange={(e) => setRoleData({...roleData, name: e.target.value})}
            className="p-2 border rounded-md w-full"
            required
          />
          
          <div className="border rounded-md p-4">
            <h3 className="font-semibold mb-3">Sidebar Permissions</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Dashboard */}
              <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={roleData.permissions.dashboard}
                  onChange={() => handlePermissionChange("dashboard")}
                />
                <Home size={16} />
                <span>Dashboard</span>
              </label>
              
              {/* Leads */}
              <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={roleData.permissions.leads}
                  onChange={() => handlePermissionChange("leads")}
                />
                <Users size={16} />
                <span>Leads</span>
              </label>
              
              {/* Deals */}
              <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={roleData.permissions.deals}
                  onChange={() => handlePermissionChange("deals")}
                />
                <Tag size={16} />
                <span>All Deals</span>
              </label>
              
              {/* Pipeline */}
              <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={roleData.permissions.pipeline}
                  onChange={() => handlePermissionChange("pipeline")}
                />
                <List size={16} />
                <span>Pipeline</span>
              </label>
              
              {/* Invoice */}
              <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={roleData.permissions.invoice}
                  onChange={() => handlePermissionChange("invoice")}
                />
                <FileText size={16} />
                <span>Invoices</span>
              </label>
              
              {/* Proposal */}
              <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={roleData.permissions.proposal}
                  onChange={() => handlePermissionChange("proposal")}
                />
                <Edit size={16} />
                <span>Proposal List</span>
              </label>
              
              {/* Templates */}
              <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={roleData.permissions.templates}
                  onChange={() => handlePermissionChange("templates")}
                />
                <Layout size={16} />
                <span>Templates</span>
              </label>
              
              {/* Calendar */}
              <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={roleData.permissions.calendar}
                  onChange={() => handlePermissionChange("calendar")}
                />
                <Calendar size={16} />
                <span>Calendar View</span>
              </label>
              
              {/* Activity List */}
              <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={roleData.permissions.activityList}
                  onChange={() => handlePermissionChange("activityList")}
                />
                <List size={16} />
                <span>Activity List</span>
              </label>
              
              {/* Expenses */}
              <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={roleData.permissions.expenses}
                  onChange={() => handlePermissionChange("expenses")}
                />
                <DollarSign size={16} />
                <span>Expenses</span>
              </label>
              
              {/* Area Expenses */}
              <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={roleData.permissions.areaExpenses}
                  onChange={() => handlePermissionChange("areaExpenses")}
                />
                <MapPin size={16} />
                <span>Area of Expenses</span>
              </label>
              
              {/* Deal Reports */}
              <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={roleData.permissions.dealReports}
                  onChange={() => handlePermissionChange("dealReports")}
                />
                <Tag size={16} />
                <span>Deal Reports</span>
              </label>
              
              {/* Proposal Reports */}
              <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={roleData.permissions.proposalReports}
                  onChange={() => handlePermissionChange("proposalReports")}
                />
                <Edit size={16} />
                <span>Proposal Reports</span>
              </label>
              
              {/* Pipeline Reports */}
              <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={roleData.permissions.pipelineReports}
                  onChange={() => handlePermissionChange("pipelineReports")}
                />
                <List size={16} />
                <span>Pipeline Reports</span>
              </label>
              
              {/* Payment History */}
              <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={roleData.permissions.paymentHistory}
                  onChange={() => handlePermissionChange("paymentHistory")}
                />
                <CreditCard size={16} />
                <span>Payment History</span>
              </label>
              
              {/* Users & Roles */}
              <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={roleData.permissions.usersRoles}
                  onChange={() => handlePermissionChange("usersRoles")}
                />
                <Shield size={16} />
                <span>Users & Roles</span>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Update
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}