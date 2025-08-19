// import { useState } from "react";
// import axios from "axios";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function CreateRoleModal({ onRoleCreated }) {
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [roleData, setRoleData] = useState({
//     name: "",
//     description: ""
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setRoleData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleCancel = () => {
//     setRoleData({ name: "", description: "" });
//     setIsDialogOpen(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       const { data } = await axios.post(
//         "http://localhost:5000/api/roles",
//         roleData,
//         { headers: { Authorization: `Bearer ${token} `} }
//       );

//       toast.success("Role created successfully!");
//       if (onRoleCreated) onRoleCreated();
//       handleCancel();
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Failed to create role");
//     }
//   };

//   return (
//     <div>
//       <ToastContainer />
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogTrigger asChild>
//           <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
//             Create Role
//           </button>
//         </DialogTrigger>

//         <DialogContent className="max-w-md">
//           <DialogHeader>
//             <DialogTitle className="text-lg font-bold">Create New Role</DialogTitle>
//           </DialogHeader>

//           <form onSubmit={handleSubmit} className="space-y-4 p-3">
//             <input
//               type="text"
//               name="name"
//               placeholder="Role Name"
//               value={roleData.name}
//               onChange={handleChange}
//               className="p-2 border rounded-md w-full"
//               required
//             />
//             <textarea
//               name="description"
//               placeholder="Description"
//               value={roleData.description}
//               onChange={handleChange}
//               className="p-2 border rounded-md w-full"
//             />
//             <div className="flex justify-end gap-3">
//               <button
//                 type="button"
//                 onClick={handleCancel}
//                 className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
//               >
//                 Submit
//               </button>
//             </div>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }//original




import { useState } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateRoleModal({ onRoleCreated }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [roleData, setRoleData] = useState({
    name: "",
    permissions: {
      dashboard: true,
      leads: true,
      deals: true,
      deals_all: true,
      deals_pipeline: true,
      invoices: true,
      proposal: true,
      proposal_list: true,
      proposal_templates: true,
      activities: true,
      activities_calendar: true,
      activities_list: true,
      expenses: true,
      expenses_all: true,
      expenses_area: true,
      reports: true,
      reports_deals: true,
      reports_proposal: true,
      reports_pipeline: true,
      reports_payment: true,
      admin_access: false
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setRoleData({
      name: "",
      permissions: {
        dashboard: true,
        leads: true,
        deals: true,
        deals_all: true,
        deals_pipeline: true,
        invoices: true,
        proposal: true,
        proposal_list: true,
        proposal_templates: true,
        activities: true,
        activities_calendar: true,
        activities_list: true,
        expenses: true,
        expenses_all: true,
        expenses_area: true,
        reports: true,
        reports_deals: true,
        reports_proposal: true,
        reports_pipeline: true,
        reports_payment: true,
        admin_access: false
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

  return (
    <div>
      <ToastContainer />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Create Role
          </button>
        </DialogTrigger>

        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Create New Role</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 p-3">
            <input
              type="text"
              name="name"
              placeholder="Role Name"
              value={roleData.name}
              onChange={handleChange}
              className="p-2 border rounded-md w-full"
              required
            />
            
            <div className="border rounded-md p-4">
              <h3 className="font-semibold mb-3">Permissions</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Dashboard */}
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={roleData.permissions.dashboard}
                    onChange={() => handlePermissionChange("dashboard")}
                    className="mr-2"
                  />
                  Dashboard
                </label>
                
                {/* Leads */}
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={roleData.permissions.leads}
                    onChange={() => handlePermissionChange("leads")}
                    className="mr-2"
                  />
                  Leads
                </label>
                
                {/* Deals */}
                <div className="col-span-2">
                  <label className="flex items-center font-medium">
                    <input
                      type="checkbox"
                      checked={roleData.permissions.deals}
                      onChange={() => handlePermissionChange("deals")}
                      className="mr-2"
                    />
                    Deals
                  </label>
                  <div className="pl-6 mt-1 space-y-1">
                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={roleData.permissions.deals_all}
                        onChange={() => handlePermissionChange("deals_all")}
                        className="mr-2"
                      />
                      All Deals
                    </label>
                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={roleData.permissions.deals_pipeline}
                        onChange={() => handlePermissionChange("deals_pipeline")}
                        className="mr-2"
                      />
                      Pipeline
                    </label>
                  </div>
                </div>
                
                {/* Invoices */}
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={roleData.permissions.invoices}
                    onChange={() => handlePermissionChange("invoices")}
                    className="mr-2"
                  />
                  Invoices
                </label>
                
                {/* Proposal */}
                <div className="col-span-2">
                  <label className="flex items-center font-medium">
                    <input
                      type="checkbox"
                      checked={roleData.permissions.proposal}
                      onChange={() => handlePermissionChange("proposal")}
                      className="mr-2"
                    />
                    Proposal
                  </label>
                  <div className="pl-6 mt-1 space-y-1">
                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={roleData.permissions.proposal_list}
                        onChange={() => handlePermissionChange("proposal_list")}
                        className="mr-2"
                      />
                      Proposal List
                    </label>
                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={roleData.permissions.proposal_templates}
                        onChange={() => handlePermissionChange("proposal_templates")}
                        className="mr-2"
                      />
                      Templates
                    </label>
                  </div>
                </div>
                
                {/* Activities */}
                <div className="col-span-2">
                  <label className="flex items-center font-medium">
                    <input
                      type="checkbox"
                      checked={roleData.permissions.activities}
                      onChange={() => handlePermissionChange("activities")}
                      className="mr-2"
                    />
                    Activities
                  </label>
                  <div className="pl-6 mt-1 space-y-1">
                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={roleData.permissions.activities_calendar}
                        onChange={() => handlePermissionChange("activities_calendar")}
                        className="mr-2"
                      />
                      Calendar View
                    </label>
                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={roleData.permissions.activities_list}
                        onChange={() => handlePermissionChange("activities_list")}
                        className="mr-2"
                      />
                      Activity List
                    </label>
                  </div>
                </div>
                
                {/* Expenses */}
                <div className="col-span-2">
                  <label className="flex items-center font-medium">
                    <input
                      type="checkbox"
                      checked={roleData.permissions.expenses}
                      onChange={() => handlePermissionChange("expenses")}
                      className="mr-2"
                    />
                    Expenses
                  </label>
                  <div className="pl-6 mt-1 space-y-1">
                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={roleData.permissions.expenses_all}
                        onChange={() => handlePermissionChange("expenses_all")}
                        className="mr-2"
                      />
                      Expenses
                    </label>
                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={roleData.permissions.expenses_area}
                        onChange={() => handlePermissionChange("expenses_area")}
                        className="mr-2"
                      />
                      Area of Expenses
                    </label>
                  </div>
                </div>
                
                {/* Reports */}
                <div className="col-span-2">
                  <label className="flex items-center font-medium">
                    <input
                      type="checkbox"
                      checked={roleData.permissions.reports}
                      onChange={() => handlePermissionChange("reports")}
                      className="mr-2"
                    />
                    Reports
                  </label>
                  <div className="pl-6 mt-1 space-y-1">
                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={roleData.permissions.reports_deals}
                        onChange={() => handlePermissionChange("reports_deals")}
                        className="mr-2"
                      />
                      Deals Reports
                    </label>
                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={roleData.permissions.reports_proposal}
                        onChange={() => handlePermissionChange("reports_proposal")}
                        className="mr-2"
                      />
                      Proposal Reports
                    </label>
                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={roleData.permissions.reports_pipeline}
                        onChange={() => handlePermissionChange("reports_pipeline")}
                        className="mr-2"
                      />
                      Pipeline Reports
                    </label>
                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={roleData.permissions.reports_payment}
                        onChange={() => handlePermissionChange("reports_payment")}
                        className="mr-2"
                      />
                      Payment History
                    </label>
                  </div>
                </div>
                
                {/* Admin Access */}
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={roleData.permissions.admin_access}
                    onChange={() => handlePermissionChange("admin_access")}
                    className="mr-2"
                  />
                  Admin Access (Users & Roles)
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
