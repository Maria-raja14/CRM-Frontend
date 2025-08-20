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
} from "react-feather";

export default function CreateRoleModal({ onRoleCreated }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
    setIsDialogOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "http://localhost:5000/api/roles",
        roleData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Role created successfully!");
      if (onRoleCreated) onRoleCreated();
      handleCancel();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create role");
    }
  };

  return (
    <div>
      <ToastContainer />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Create Role
          </button>
        </DialogTrigger>

        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Create New Role with Permissions</DialogTitle>
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
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Submit
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}