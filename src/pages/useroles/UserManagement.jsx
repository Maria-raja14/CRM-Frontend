


import { useState, useEffect } from "react";
import AddUserModal from "./UserTop";
import CreateRoleModal from "./CreateRoleModal";
import axios from "axios";
import { toast } from "react-toastify";

export default function UserManagement() {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:5000/api/roles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoles(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load roles");
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <AddUserModal
          roles={roles}
          onUserCreated={fetchUsers}
          onRolesUpdated={fetchRoles}
        />
        <CreateRoleModal onRoleCreated={fetchRoles} />
      </div>

      
    </div>
  );
}
