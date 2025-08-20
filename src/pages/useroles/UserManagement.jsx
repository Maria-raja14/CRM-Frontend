


import { useState, useEffect, useRef } from "react";
import AddUserModal from "./UserTop";
import CreateRoleModal from "./CreateRoleModal";
import EditUserModal from "./EditUserModal";
import EditRoleModal from "./EditRoleModal";
import DeleteModal from "./DeleteModal";
import axios from "axios";
import { toast } from "react-toastify";
import { MoreVertical, Edit, Trash2, ChevronLeft, ChevronRight } from "react-feather";

export default function UserManagement() {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentPageUsers, setCurrentPageUsers] = useState(1);
  const [currentPageRoles, setCurrentPageRoles] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionType, setActionType] = useState("");
  const [itemType, setItemType] = useState("");
  const dropdownRef = useRef(null);

  // ✅ Fetch Roles
  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:5000/api/roles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoles(Array.isArray(data) ? data : data.roles || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load roles");
    }
  };

  // ✅ Fetch Users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Add full image URL to each user
      const usersWithImageUrl = data.users.map(user => ({
        ...user,
        profileImageUrl: user.profileImage 
          ? `http://localhost:5000/${user.profileImage}`
          : null
      }));

      setUsers(usersWithImageUrl || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    }
  };

  // Handle actions
  const handleAction = (item, type, action) => {
    setSelectedItem(item);
    setItemType(type);
    setActionType(action);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      let url = "";
      
      if (itemType === "user") {
        url = `http://localhost:5000/api/users/delete-user/${selectedItem._id}`;
      } else {
        url = `http://localhost:5000/api/roles/delete-role/${selectedItem._id}`;
      }
      
      await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      toast.success(`${itemType === "user" ? "User" : "Role"} deleted successfully!`);
      
      // Refresh data
      if (itemType === "user") {
        fetchUsers();
      } else {
        fetchRoles();
      }
      
      // Close modal
      setActionType("");
    } catch (err) {
      console.error(err);
      toast.error(`Failed to delete ${itemType}`);
    }
  };

  // Close dropdown when clicking outside - only for menu actions
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close menu dropdowns, not modals
      if (actionType === "menu" && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActionType("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [actionType]);

  // Initial data fetch
  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);

  // Pagination calculations
  const indexOfLastUser = currentPageUsers * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPagesUsers = Math.ceil(users.length / itemsPerPage);

  const indexOfLastRole = currentPageRoles * itemsPerPage;
  const indexOfFirstRole = indexOfLastRole - itemsPerPage;
  const currentRoles = roles.slice(indexOfFirstRole, indexOfLastRole);
  const totalPagesRoles = Math.ceil(roles.length / itemsPerPage);

  // Next page
  const nextPageUsers = () => {
    if (currentPageUsers < totalPagesUsers) {
      setCurrentPageUsers(currentPageUsers + 1);
    }
  };

  const nextPageRoles = () => {
    if (currentPageRoles < totalPagesRoles) {
      setCurrentPageRoles(currentPageRoles + 1);
    }
  };

  // Previous page
  const prevPageUsers = () => {
    if (currentPageUsers > 1) {
      setCurrentPageUsers(currentPageUsers - 1);
    }
  };

  const prevPageRoles = () => {
    if (currentPageRoles > 1) {
      setCurrentPageRoles(currentPageRoles - 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Modals */}
      {actionType === "edit" && itemType === "user" && (
        <EditUserModal
          user={selectedItem}
          roles={roles}
          onClose={() => setActionType("")}
          onUserUpdated={fetchUsers}
        />
      )}
      
      {actionType === "edit" && itemType === "role" && (
        <EditRoleModal
          role={selectedItem}
          onClose={() => setActionType("")}
          onRoleUpdated={fetchRoles}
        />
      )}
      
      {actionType === "delete" && (
        <DeleteModal
          item={selectedItem}
          itemType={itemType}
          onClose={() => setActionType("")}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {/* Top Buttons */}
      <div className="flex gap-4 justify-end">
        <AddUserModal onUserCreated={fetchUsers} />
        <CreateRoleModal onRoleCreated={fetchRoles} />
      </div>

      {/* Tables Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
            Users ({users.length})
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
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4">
                        <img
                          src={
                            user.profileImageUrl ||
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
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() => handleAction(user, "user", "menu")}
                            className="p-1 rounded-md hover:bg-gray-200"
                          >
                            <MoreVertical size={16} />
                          </button>
                          
                          {selectedItem?._id === user._id && actionType === "menu" && itemType === "user" && (
                            <div 
                              className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                              ref={dropdownRef}
                            >
                              <div className="py-1">
                                <button
                                  onClick={() => handleAction(user, "user", "edit")}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <Edit size={14} className="mr-2" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleAction(user, "user", "delete")}
                                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                >
                                  <Trash2 size={14} className="mr-2" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
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
            
            {/* Pagination for Users */}
            {totalPagesUsers > 0 && (
              <div className="flex items-center justify-between mt-4 px-2">
                <div className="text-sm text-gray-700">
                  Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, users.length)} of {users.length} entries
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={prevPageUsers}
                    disabled={currentPageUsers === 1}
                    className="p-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  <span className="text-sm">
                    Page {currentPageUsers} of {totalPagesUsers}
                  </span>
                  
                  <button
                    onClick={nextPageUsers}
                    disabled={currentPageUsers === totalPagesUsers}
                    className="p-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Roles Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
            Roles ({roles.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="bg-gradient-to-r from-green-400 to-green-500 text-white text-sm uppercase">
                <tr>
                  <th className="px-6 py-3">Role Name</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRoles.length > 0 ? (
                  currentRoles.map((role) => (
                    <tr
                      key={role._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 font-medium">{role.name}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() => handleAction(role, "role", "menu")}
                            className="p-1 rounded-md hover:bg-gray-200"
                          >
                            <MoreVertical size={16} />
                          </button>
                          
                          {selectedItem?._id === role._id && actionType === "menu" && itemType === "role" && (
                            <div 
                              className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                              ref={dropdownRef}
                            >
                              <div className="py-1">
                                <button
                                  onClick={() => handleAction(role, "role", "edit")}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <Edit size={14} className="mr-2" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleAction(role, "role", "delete")}
                                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                >
                                  <Trash2 size={14} className="mr-2" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="2"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No roles found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {/* Pagination for Roles */}
            {totalPagesRoles > 0 && (
              <div className="flex items-center justify-between mt-4 px-2">
                <div className="text-sm text-gray-700">
                  Showing {indexOfFirstRole + 1} to {Math.min(indexOfLastRole, roles.length)} of {roles.length} entries
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={prevPageRoles}
                    disabled={currentPageRoles === 1}
                    className="p-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  <span className="text-sm">
                    Page {currentPageRoles} of {totalPagesRoles}
                  </span>
                  
                  <button
                    onClick={nextPageRoles}
                    disabled={currentPageRoles === totalPagesRoles}
                    className="p-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}