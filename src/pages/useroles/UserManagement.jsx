// import AddUserModal from "./UserTop";
// import CreateRoleModal from "./CreateRoleModal";

// export default function UserManagement() {
//   const refreshRoles = () => {
//     // Logic to refresh roles in AddUserModal (can use lifting state up or context)
//   };

//   return (
//     <div className="flex gap-3">
//       <AddUserModal onRolesUpdated={refreshRoles} />
//       <CreateRoleModal onRoleCreated={refreshRoles} />
//     </div>
//   );
// }


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

      {/* Users Table - Outside the modal */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Users List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-3 text-left">Name</th>
                <th className="border p-3 text-left">Email</th>
                <th className="border p-3 text-left">Role</th>
                <th className="border p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="border p-3">{user.firstName} {user.lastName}</td>
                    <td className="border p-3">{user.email}</td>
                    <td className="border p-3">{user.role?.name || 'N/A'}</td>
                    <td className="border p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-3">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}