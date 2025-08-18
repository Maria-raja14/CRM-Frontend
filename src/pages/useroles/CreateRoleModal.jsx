


import { useState } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateRoleModal({ onRoleCreated }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [roleData, setRoleData] = useState({
    name: "",
    description: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setRoleData({ name: "", description: "" });
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

        <DialogContent className="max-w-md">
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
            <textarea
              name="description"
              placeholder="Description"
              value={roleData.description}
              onChange={handleChange}
              className="p-2 border rounded-md w-full"
            />
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