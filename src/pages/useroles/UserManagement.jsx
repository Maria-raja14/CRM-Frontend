import { useState, useEffect } from "react";
import AddUserModal from "./UserTop";
import CreateRoleModal from "./CreateRoleModal";
import axios from "axios";
import { toast } from "react-toastify";

export default function UserManagement() {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);

  // ✅ Fetch Roles
  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:5000/api/roles", {
        headers: { Authorization: `Bearer ${token} `},
      });
      setRoles(Array.isArray(data) ? data : data.roles || []);
    } catch (err) {
      console.error(err);
      //toast.error("Failed to load roles");
    }
  };

  // ✅ Fetch Users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token} `},
      });

      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
      //toast.error("Failed to load users");
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Buttons */}
      <div className="flex gap-4 justify-end">
        <AddUserModal roles={roles} onUserCreated={fetchUsers} />
        <CreateRoleModal  onRoleCreated={fetchRoles} />
      </div>

      {/* Tables Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Users Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
            Users
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="bg-gradient-to-r from-blue-400 to-blue-500 text-white text-sm uppercase">
                <tr>
                  <th className="px-6 py-3">Profile</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Mobile</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4">
                        <img
                          src={
                            user.profileImage ||
                            "https://static.vecteezy.com/system/resources/previews/020/429/953/non_2x/admin-icon-vector.jpg"
                          }
                          alt="profile"
                          className="w-10 h-10 rounded-full object-cover border"
                        />
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">{user.mobileNumber || "-"}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600 font-semibold">
                          {user.role?.name || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-semibold ${
                            user.status === "Active" || user.status === true
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {user.status === true ? "Active" : user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button className="px-3 py-1 text-xs bg-yellow-100 text-yellow-600 rounded-md hover:bg-yellow-200 mr-2">
                          Edit
                        </button>
                        <button className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-md hover:bg-red-200">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Roles Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
            Roles
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="bg-gradient-to-r from-green-400 to-green-500 text-white text-sm uppercase">
                <tr>
                  <th className="px-6 py-3">Role Name</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.length > 0 ? (
                  roles.map((role) => (
                    <tr
                      key={role._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 font-medium">{role.name}</td>
                      <td className="px-6 py-4">{role.description || "-"}</td>
                      <td className="px-6 py-4 text-center">
                        <button className="px-3 py-1 text-xs bg-yellow-100 text-yellow-600 rounded-md hover:bg-yellow-200 mr-2">
                          Edit
                        </button>
                        <button className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-md hover:bg-red-200">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No roles found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}