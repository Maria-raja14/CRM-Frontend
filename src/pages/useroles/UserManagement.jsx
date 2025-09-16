// import { useState, useEffect, useRef } from "react";
// import AddUserModal from "./UserTop";
// import CreateRoleModal from "./CreateRoleModal";
// import EditUserModal from "./EditUserModal";
// import EditRoleModal from "./EditRoleModal";
// import DeleteModal from "./DeleteModal";
// import axios from "axios";
// import { toast } from "react-toastify";
// import {
//   MoreVertical,
//   Edit,
//   Trash2,
//   ChevronLeft,
//   ChevronRight,
//   Search,
//   Filter,
//   User,
//   Shield,
//   Eye,
//   EyeOff,
// } from "react-feather";

// export default function UserManagement() {

//  const API_URL = import.meta.env.VITE_API_URL;

//   const [roles, setRoles] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [currentPageUsers, setCurrentPageUsers] = useState(1);
//   const [currentPageRoles, setCurrentPageRoles] = useState(1);
//   const [itemsPerPage] = useState(5);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [actionType, setActionType] = useState("");
//   const [itemType, setItemType] = useState("");
//   const [searchUserQuery, setSearchUserQuery] = useState("");
//   const [searchRoleQuery, setSearchRoleQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const dropdownRef = useRef(null);

//   // ✅ Fetch Roles
//   const fetchRoles = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const { data } = await axios.get(`${API_URL}/roles`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setRoles(Array.isArray(data) ? data : data.roles || []);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load roles");
//     }
//   };

//   // ✅ Fetch Users
//   const fetchUsers = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const { data } = await axios.get(`${API_URL}/users`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const usersWithImageUrl = data.users.map((user) => ({
//         ...user,
//         profileImageUrl: user.profileImage
//           ? `http://localhost:5000/${user.profileImage}`
//           : null,
//       }));

//       setUsers(usersWithImageUrl || []);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load users");
//     }
//   };

//   const handleAction = (item, type, action) => {
//     setSelectedItem(item);
//     setItemType(type);
//     setActionType(action);
//   };

//   const handleDeleteConfirm = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       let url = "";

//       if (itemType === "user") {
//         url = `${API_URL}/users/delete-user/${selectedItem._id}`;
//       } else {
//         url = `${API_URL}/roles/delete-role/${selectedItem._id}`;
//       }

//       await axios.delete(url, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       toast.success(
//         `${itemType === "user" ? "User" : "Role"} deleted successfully!`
//       );

//       itemType === "user" ? fetchUsers() : fetchRoles();
//       setActionType("");
//     } catch (err) {
//       console.error(err);
//       toast.error(`Failed to delete ${itemType}`);
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         actionType === "menu" &&
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target)
//       ) {
//         setActionType("");
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [actionType]);

//   useEffect(() => {
//     fetchRoles();
//     fetchUsers();
//   }, []);

//   // Filter users based on search and status
//   const filteredUsers = users.filter((user) => {
//     const matchesSearch =
//       user.firstName.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
//       user.lastName.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchUserQuery.toLowerCase());

//     const matchesStatus =
//       statusFilter === "all" ||
//       (statusFilter === "active" && user.status) ||
//       (statusFilter === "inactive" && !user.status);

//     return matchesSearch && matchesStatus;
//   });

//   // Filter roles based on search
//   const filteredRoles = roles.filter((role) =>
//     role.name.toLowerCase().includes(searchRoleQuery.toLowerCase())
//   );

//   // Pagination logic
//   const indexOfLastUser = currentPageUsers * itemsPerPage;
//   const indexOfFirstUser = indexOfLastUser - itemsPerPage;
//   const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
//   const totalPagesUsers = Math.ceil(filteredUsers.length / itemsPerPage);

//   const indexOfLastRole = currentPageRoles * itemsPerPage;
//   const indexOfFirstRole = indexOfLastRole - itemsPerPage;
//   const currentRoles = filteredRoles.slice(indexOfFirstRole, indexOfLastRole);
//   const totalPagesRoles = Math.ceil(filteredRoles.length / itemsPerPage);

//   return (
//     <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
//       {/* ✅ Modals */}
//       {actionType === "edit" && itemType === "user" && (
//         <EditUserModal
//           user={selectedItem}
//           roles={roles}
//           onClose={() => setActionType("")}
//           onUserUpdated={fetchUsers}
//         />
//       )}

//       {actionType === "edit" && itemType === "role" && (
//         <EditRoleModal
//           role={selectedItem}
//           onClose={() => setActionType("")}
//           onRoleUpdated={fetchRoles}
//         />
//       )}

//       {actionType === "delete" && (
//         <DeleteModal
//           item={selectedItem}
//           itemType={itemType}
//           onClose={() => setActionType("")}
//           onConfirm={handleDeleteConfirm}
//         />
//       )}

//       {/* ✅ Page Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-800">
//             User & Role Management
//           </h1>
//           <p className="text-gray-600 mt-1">
//             Manage users and their access permissions
//           </p>
//         </div>
//         <div className="flex flex-wrap gap-3">
//           <AddUserModal onUserCreated={fetchUsers} />
//           <CreateRoleModal onRoleCreated={fetchRoles} />
//         </div>
//       </div>

//       {/* ✅ Two Tables */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Users Table */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//             <div>
//               <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                 <User size={20} className="text-blue-500" />
//                 Users ({filteredUsers.length})
//               </h2>
//             </div>
//             <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
//               <div className="relative">
//                 <Search
//                   size={16}
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Search users..."
//                   value={searchUserQuery}
//                   onChange={(e) => setSearchUserQuery(e.target.value)}
//                   className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//               <div className="relative">
//                 <Filter
//                   size={16}
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                 />
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Profile
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Email
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Role
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {currentUsers.length > 0 ? (
//                   currentUsers.map((user) => (
//                     <tr
//                       key={user._id}
//                       className="hover:bg-gray-50 transition-colors"
//                     >
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-10 w-10">
//                             <img
//                               src={
//                                 user.profileImageUrl ||
//                                 "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
//                               }
//                               alt="profile"
//                               className="h-10 w-10 rounded-full object-cover border border-gray-200"
//                             />
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">
//                           {user.firstName} {user.lastName}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           {user.mobileNumber || "-"}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {user.email}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
//                           {user.role?.name || "N/A"}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span
//                           className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                             user.status === "Active"
//                               ? "bg-green-100 text-green-800"
//                               : "bg-red-100 text-red-800"
//                           }`}
//                         >
//                           {user.status === "Active" ? (
//                             <>
//                               <Eye size={12} className="mr-1" /> Active
//                             </>
//                           ) : (
//                             <>
//                               <EyeOff size={12} className="mr-1" /> Inactive
//                             </>
//                           )}
//                         </span>
//                       </td>

//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <div className="relative inline-block text-left">
//                           <button
//                             onClick={() => handleAction(user, "user", "menu")}
//                             className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                           >
//                             <MoreVertical size={16} />
//                           </button>

//                           {selectedItem?._id === user._id &&
//                             actionType === "menu" &&
//                             itemType === "user" && (
//                               <div
//                                 ref={dropdownRef}
//                                 className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white "
//                               >
//                                 <div className="py-1" role="none">
//                                   <button
//                                     onClick={() =>
//                                       handleAction(user, "user", "edit")
//                                     }
//                                     className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full"
//                                   >
//                                     <Edit
//                                       size={14}
//                                       className="mr-3 text-gray-400 group-hover:text-gray-500"
//                                     />
//                                     Edit
//                                   </button>
//                                   <button
//                                     onClick={() =>
//                                       handleAction(user, "user", "delete")
//                                     }
//                                     className="group flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 hover:text-red-700 w-full"
//                                   >
//                                     <Trash2
//                                       size={14}
//                                       className="mr-3 text-red-400 group-hover:text-red-500"
//                                     />
//                                     Delete
//                                   </button>
//                                 </div>
//                               </div>
//                             )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan="6"
//                       className="px-6 py-8 text-center text-gray-500"
//                     >
//                       <User size={40} className="mx-auto text-gray-300 mb-2" />
//                       <p>No users found</p>
//                       <p className="text-sm mt-1">
//                         Try adjusting your search or filter
//                       </p>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {totalPagesUsers > 1 && (
//             <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200">
//               <div className="flex-1 flex justify-between items-center">
//                 <div>
//                   <p className="text-sm text-gray-700">
//                     Showing{" "}
//                     <span className="font-medium">{indexOfFirstUser + 1}</span>{" "}
//                     to{" "}
//                     <span className="font-medium">
//                       {Math.min(indexOfLastUser, filteredUsers.length)}
//                     </span>{" "}
//                     of{" "}
//                     <span className="font-medium">{filteredUsers.length}</span>{" "}
//                     results
//                   </p>
//                 </div>
//                 <div>
//                   <nav
//                     className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
//                     aria-label="Pagination"
//                   >
//                     <button
//                       onClick={() =>
//                         setCurrentPageUsers((prev) => Math.max(prev - 1, 1))
//                       }
//                       disabled={currentPageUsers === 1}
//                       className="relative inline-flex items-center px-2.5 py-1.5 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                     >
//                       <span className="sr-only">Previous</span>
//                       <ChevronLeft size={16} />
//                     </button>
//                     <div className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
//                       Page {currentPageUsers} of {totalPagesUsers}
//                     </div>
//                     <button
//                       onClick={() =>
//                         setCurrentPageUsers((prev) =>
//                           Math.min(prev + 1, totalPagesUsers)
//                         )
//                       }
//                       disabled={currentPageUsers === totalPagesUsers}
//                       className="relative inline-flex items-center px-2.5 py-1.5 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                     >
//                       <span className="sr-only">Next</span>
//                       <ChevronRight size={16} />
//                     </button>
//                   </nav>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Roles Table */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//             <div>
//               <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                 <Shield size={20} className="text-green-500" />
//                 Roles ({filteredRoles.length})
//               </h2>
//             </div>
//             <div className="relative">
//               <Search
//                 size={16}
//                 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//               />
//               <input
//                 type="text"
//                 placeholder="Search roles..."
//                 value={searchRoleQuery}
//                 onChange={(e) => setSearchRoleQuery(e.target.value)}
//                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               />
//             </div>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Role Name
//                   </th>
//                   <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {currentRoles.length > 0 ? (
//                   currentRoles.map((role) => (
//                     <tr
//                       key={role._id}
//                       className="hover:bg-gray-50 transition-colors"
//                     >
//                       <td className="px-6 py-4">
//                         <div className="text-sm font-medium text-gray-900">
//                           {role.name}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <div className="relative inline-block text-left">
//                           <button
//                             onClick={() => handleAction(role, "role", "menu")}
//                             className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//                           >
//                             <MoreVertical size={16} />
//                           </button>
//                           {selectedItem?._id === role._id &&
//                             actionType === "menu" &&
//                             itemType === "role" && (
//                               <div
//                                 ref={dropdownRef}
//                                 className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white "
//                               >
//                                 <div className="py-1" role="none">
//                                   <button
//                                     onClick={() =>
//                                       handleAction(role, "role", "edit")
//                                     }
//                                     className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full"
//                                   >
//                                     <Edit
//                                       size={14}
//                                       className="mr-3 text-gray-400 group-hover:text-gray-500"
//                                     />
//                                     Edit
//                                   </button>
//                                   <button
//                                     onClick={() =>
//                                       handleAction(role, "role", "delete")
//                                     }
//                                     className="group flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 hover:text-red-700 w-full"
//                                   >
//                                     <Trash2
//                                       size={14}
//                                       className="mr-3 text-red-400 group-hover:text-red-500"
//                                     />
//                                     Delete
//                                   </button>
//                                 </div>
//                               </div>
//                             )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan="2"
//                       className="px-6 py-8 text-center text-gray-500"
//                     >
//                       <Shield
//                         size={40}
//                         className="mx-auto text-gray-300 mb-2"
//                       />
//                       <p>No roles found</p>
//                       <p className="text-sm mt-1">
//                         Try adjusting your search or create a new role
//                       </p>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {totalPagesRoles > 1 && (
//             <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200">
//               <div className="flex-1 flex justify-between items-center">
//                 <div>
//                   <p className="text-sm text-gray-700">
//                     Showing{" "}
//                     <span className="font-medium">{indexOfFirstRole + 1}</span>{" "}
//                     to{" "}
//                     <span className="font-medium">
//                       {Math.min(indexOfLastRole, filteredRoles.length)}
//                     </span>{" "}
//                     of{" "}
//                     <span className="font-medium">{filteredRoles.length}</span>{" "}
//                     results
//                   </p>
//                 </div>
//                 <div>
//                   <nav
//                     className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
//                     aria-label="Pagination"
//                   >
//                     <button
//                       onClick={() =>
//                         setCurrentPageRoles((prev) => Math.max(prev - 1, 1))
//                       }
//                       disabled={currentPageRoles === 1}
//                       className="relative inline-flex items-center px-2.5 py-1.5 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                     >
//                       <span className="sr-only">Previous</span>
//                       <ChevronLeft size={16} />
//                     </button>
//                     <div className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
//                       Page {currentPageRoles} of {totalPagesRoles}
//                     </div>
//                     <button
//                       onClick={() =>
//                         setCurrentPageRoles((prev) =>
//                           Math.min(prev + 1, totalPagesRoles)
//                         )
//                       }
//                       disabled={currentPageRoles === totalPagesRoles}
//                       className="relative inline-flex items-center px-2.5 py-1.5 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                     >
//                       <span className="sr-only">Next</span>
//                       <ChevronRight size={16} />
//                     </button>
//                   </nav>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useState, useEffect, useRef } from "react";
// import AddUserModal from "./UserTop";
// import CreateRoleModal from "./CreateRoleModal";
// import EditUserModal from "./EditUserModal";
// import EditRoleModal from "./EditRoleModal";
// import DeleteModal from "./DeleteModal";
// import axios from "axios";
// import { toast } from "react-toastify";
// import {
//   MoreVertical,
//   Edit,
//   Trash2,
//   ChevronLeft,
//   ChevronRight,
//   Search,
//   Filter,
//   User,
//   Shield,
//   Eye,
//   EyeOff,
// } from "react-feather";

// export default function UserManagement() {

//  const API_URL = import.meta.env.VITE_API_URL;

//   const [roles, setRoles] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [currentPageUsers, setCurrentPageUsers] = useState(1);
//   const [currentPageRoles, setCurrentPageRoles] = useState(1);
//   const [itemsPerPage] = useState(5);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [actionType, setActionType] = useState("");
//   const [itemType, setItemType] = useState("");
//   const [searchUserQuery, setSearchUserQuery] = useState("");
//   const [searchRoleQuery, setSearchRoleQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [openMenuId, setOpenMenuId] = useState(null); // Track which menu is open
//   const dropdownRef = useRef(null);

//   // ✅ Fetch Roles
//   const fetchRoles = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const { data } = await axios.get(`${API_URL}/roles`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setRoles(Array.isArray(data) ? data : data.roles || []);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load roles");
//     }
//   };

//   // ✅ Fetch Users
//   const fetchUsers = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const { data } = await axios.get(`${API_URL}/users`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const usersWithImageUrl = data.users.map((user) => ({
//         ...user,
//         profileImageUrl: user.profileImage
//           ? `http://localhost:5000/${user.profileImage}`
//           : null,
//       }));

//       setUsers(usersWithImageUrl || []);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load users");
//     }
//   };

//   const handleAction = (item, type, action) => {
//     setSelectedItem(item);
//     setItemType(type);
//     setActionType(action);

//     // Close menu if opening a modal
//     if (action !== "menu") {
//       setOpenMenuId(null);
//     }
//   };

//   const handleMenuToggle = (id) => {
//     setOpenMenuId(openMenuId === id ? null : id);
//   };

//   const handleDeleteConfirm = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       let url = "";

//       if (itemType === "user") {
//         url = `${API_URL}/users/delete-user/${selectedItem._id}`;
//       } else {
//         url = `${API_URL}/roles/delete-role/${selectedItem._id}`;
//       }

//       await axios.delete(url, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       toast.success(
//         `${itemType === "user" ? "User" : "Role"} deleted successfully!`
//       );

//       itemType === "user" ? fetchUsers() : fetchRoles();
//       setActionType("");
//     } catch (err) {
//       console.error(err);
//       toast.error(`Failed to delete ${itemType}`);
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target) &&
//         !event.target.closest('.menu-button')
//       ) {
//         setOpenMenuId(null);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   useEffect(() => {
//     fetchRoles();
//     fetchUsers();
//   }, []);

//   // Filter users based on search and status
//   const filteredUsers = users.filter((user) => {
//     const matchesSearch =
//       user.firstName.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
//       user.lastName.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchUserQuery.toLowerCase());

//     const matchesStatus =
//       statusFilter === "all" ||
//       (statusFilter === "active" && user.status) ||
//       (statusFilter === "inactive" && !user.status);

//     return matchesSearch && matchesStatus;
//   });

//   // Filter roles based on search
//   const filteredRoles = roles.filter((role) =>
//     role.name.toLowerCase().includes(searchRoleQuery.toLowerCase())
//   );

//   // Pagination logic
//   const indexOfLastUser = currentPageUsers * itemsPerPage;
//   const indexOfFirstUser = indexOfLastUser - itemsPerPage;
//   const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
//   const totalPagesUsers = Math.ceil(filteredUsers.length / itemsPerPage);

//   const indexOfLastRole = currentPageRoles * itemsPerPage;
//   const indexOfFirstRole = indexOfLastRole - itemsPerPage;
//   const currentRoles = filteredRoles.slice(indexOfFirstRole, indexOfLastRole);
//   const totalPagesRoles = Math.ceil(filteredRoles.length / itemsPerPage);

//   return (
//     <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
//       {/* ✅ Modals */}
//       {actionType === "edit" && itemType === "user" && (
//         <EditUserModal
//           user={selectedItem}
//           roles={roles}
//           onClose={() => setActionType("")}
//           onUserUpdated={fetchUsers}
//         />
//       )}

//       {actionType === "edit" && itemType === "role" && (
//         <EditRoleModal
//           role={selectedItem}
//           onClose={() => setActionType("")}
//           onRoleUpdated={fetchRoles}
//         />
//       )}

//       {actionType === "delete" && (
//         <DeleteModal
//           item={selectedItem}
//           itemType={itemType}
//           onClose={() => setActionType("")}
//           onConfirm={handleDeleteConfirm}
//         />
//       )}

//       {/* ✅ Page Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-800">
//             User & Role Management
//           </h1>
//           <p className="text-gray-600 mt-1">
//             Manage users and their access permissions
//           </p>
//         </div>
//         <div className="flex flex-wrap gap-3">
//           <AddUserModal onUserCreated={fetchUsers} />
//           <CreateRoleModal onRoleCreated={fetchRoles} />
//         </div>
//       </div>

//       {/* ✅ Two Tables */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Users Table */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//             <div>
//               <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                 <User size={20} className="text-blue-500" />
//                 Users ({filteredUsers.length})
//               </h2>
//             </div>
//             <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
//               <div className="relative">
//                 <Search
//                   size={16}
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Search users..."
//                   value={searchUserQuery}
//                   onChange={(e) => setSearchUserQuery(e.target.value)}
//                   className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//               <div className="relative">
//                 <Filter
//                   size={16}
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                 />
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Profile
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Email
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Role
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {currentUsers.length > 0 ? (
//                   currentUsers.map((user) => (
//                     <tr
//                       key={user._id}
//                       className="hover:bg-gray-50 transition-colors"
//                     >
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-10 w-10">
//                             <img
//                               src={
//                                 user.profileImageUrl ||
//                                 "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
//                               }
//                               alt="profile"
//                               className="h-10 w-10 rounded-full object-cover border border-gray-200"
//                             />
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">
//                           {user.firstName} {user.lastName}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           {user.mobileNumber || "-"}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {user.email}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
//                           {user.role?.name || "N/A"}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span
//                           className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                             user.status === "Active"
//                               ? "bg-green-100 text-green-800"
//                               : "bg-red-100 text-red-800"
//                           }`}
//                         >
//                           {user.status === "Active" ? (
//                             <>
//                               <Eye size={12} className="mr-1" /> Active
//                             </>
//                           ) : (
//                             <>
//                               <EyeOff size={12} className="mr-1" /> Inactive
//                             </>
//                           )}
//                         </span>
//                       </td>

//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <div className="relative inline-block text-left">
//                           <button
//                             onClick={() => handleMenuToggle(user._id)}
//                             className="menu-button inline-flex items-center p-1 text-gray-400 hover:text-gray-600 transition-colors"
//                           >
//                             <MoreVertical size={16} />
//                           </button>

//                           {openMenuId === user._id && (
//                             <div
//                               ref={dropdownRef}
//                               className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white z-10 border border-gray-200"
//                             >
//                               <div className="py-1" role="none">
//                                 <button
//                                   onClick={() =>
//                                     handleAction(user, "user", "edit")
//                                   }
//                                   className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full"
//                                 >
//                                   <Edit
//                                     size={14}
//                                     className="mr-3 text-gray-400 group-hover:text-gray-500"
//                                   />
//                                   Edit
//                                 </button>
//                                 <button
//                                   onClick={() =>
//                                     handleAction(user, "user", "delete")
//                                   }
//                                   className="group flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 hover:text-red-700 w-full"
//                                 >
//                                   <Trash2
//                                     size={14}
//                                     className="mr-3 text-red-400 group-hover:text-red-500"
//                                   />
//                                   Delete
//                                 </button>
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan="6"
//                       className="px-6 py-8 text-center text-gray-500"
//                     >
//                       <User size={40} className="mx-auto text-gray-300 mb-2" />
//                       <p>No users found</p>
//                       <p className="text-sm mt-1">
//                         Try adjusting your search or filter
//                       </p>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {totalPagesUsers > 1 && (
//             <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200">
//               <div className="flex-1 flex justify-between items-center">
//                 <div>
//                   <p className="text-sm text-gray-700">
//                     Showing{" "}
//                     <span className="font-medium">{indexOfFirstUser + 1}</span>{" "}
//                     to{" "}
//                     <span className="font-medium">
//                       {Math.min(indexOfLastUser, filteredUsers.length)}
//                     </span>{" "}
//                     of{" "}
//                     <span className="font-medium">{filteredUsers.length}</span>{" "}
//                     results
//                   </p>
//                 </div>
//                 <div>
//                   <nav
//                     className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
//                     aria-label="Pagination"
//                   >
//                     <button
//                       onClick={() =>
//                         setCurrentPageUsers((prev) => Math.max(prev - 1, 1))
//                       }
//                       disabled={currentPageUsers === 1}
//                       className="relative inline-flex items-center px-2.5 py-1.5 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                     >
//                       <span className="sr-only">Previous</span>
//                       <ChevronLeft size={16} />
//                     </button>
//                     <div className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
//                       Page {currentPageUsers} of {totalPagesUsers}
//                     </div>
//                     <button
//                       onClick={() =>
//                         setCurrentPageUsers((prev) =>
//                           Math.min(prev + 1, totalPagesUsers)
//                         )
//                       }
//                       disabled={currentPageUsers === totalPagesUsers}
//                       className="relative inline-flex items-center px-2.5 py-1.5 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                     >
//                       <span className="sr-only">Next</span>
//                       <ChevronRight size={16} />
//                     </button>
//                   </nav>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Roles Table */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//             <div>
//               <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                 <Shield size={20} className="text-green-500" />
//                 Roles ({filteredRoles.length})
//               </h2>
//             </div>
//             <div className="relative">
//               <Search
//                 size={16}
//                 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//               />
//               <input
//                 type="text"
//                 placeholder="Search roles..."
//                 value={searchRoleQuery}
//                 onChange={(e) => setSearchRoleQuery(e.target.value)}
//                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               />
//             </div>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Role Name
//                   </th>
//                   <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {currentRoles.length > 0 ? (
//                   currentRoles.map((role) => (
//                     <tr
//                       key={role._id}
//                       className="hover:bg-gray-50 transition-colors"
//                     >
//                       <td className="px-6 py-4">
//                         <div className="text-sm font-medium text-gray-900">
//                           {role.name}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <div className="relative inline-block text-left">
//                           <button
//                             onClick={() => handleMenuToggle(`role-${role._id}`)}
//                             className="menu-button inline-flex items-center p-1 text-gray-400 hover:text-gray-600 transition-colors"
//                           >
//                             <MoreVertical size={16} />
//                           </button>
//                           {openMenuId === `role-${role._id}` && (
//                             <div
//                               ref={dropdownRef}
//                               className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white z-10 border border-gray-200"
//                             >
//                               <div className="py-1" role="none">
//                                 <button
//                                   onClick={() =>
//                                     handleAction(role, "role", "edit")
//                                   }
//                                   className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full"
//                                 >
//                                   <Edit
//                                     size={14}
//                                     className="mr-3 text-gray-400 group-hover:text-gray-500"
//                                   />
//                                   Edit
//                                 </button>
//                                 <button
//                                   onClick={() =>
//                                     handleAction(role, "role", "delete")
//                                   }
//                                   className="group flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 hover:text-red-700 w-full"
//                                 >
//                                   <Trash2
//                                     size={14}
//                                     className="mr-3 text-red-400 group-hover:text-red-500"
//                                   />
//                                   Delete
//                                 </button>
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan="2"
//                       className="px-6 py-8 text-center text-gray-500"
//                     >
//                       <Shield
//                         size={40}
//                         className="mx-auto text-gray-300 mb-2"
//                       />
//                       <p>No roles found</p>
//                       <p className="text-sm mt-1">
//                         Try adjusting your search or create a new role
//                       </p>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {totalPagesRoles > 1 && (
//             <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200">
//               <div className="flex-1 flex justify-between items-center">
//                 <div>
//                   <p className="text-sm text-gray-700">
//                     Showing{" "}
//                     <span className="font-medium">{indexOfFirstRole + 1}</span>{" "}
//                     to{" "}
//                     <span className="font-medium">
//                       {Math.min(indexOfLastRole, filteredRoles.length)}
//                     </span>{" "}
//                     of{" "}
//                     <span className="font-medium">{filteredRoles.length}</span>{" "}
//                     results
//                   </p>
//                 </div>
//                 <div>
//                   <nav
//                     className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
//                     aria-label="Pagination"
//                   >
//                     <button
//                       onClick={() =>
//                         setCurrentPageRoles((prev) => Math.max(prev - 1, 1))
//                       }
//                       disabled={currentPageRoles === 1}
//                       className="relative inline-flex items-center px-2.5 py-1.5 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                     >
//                       <span className="sr-only">Previous</span>
//                       <ChevronLeft size={16} />
//                     </button>
//                     <div className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
//                       Page {currentPageRoles} of {totalPagesRoles}
//                     </div>
//                     <button
//                       onClick={() =>
//                         setCurrentPageRoles((prev) =>
//                           Math.min(prev + 1, totalPagesRoles)
//                         )
//                       }
//                       disabled={currentPageRoles === totalPagesRoles}
//                       className="relative inline-flex items-center px-2.5 py-1.5 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                     >
//                       <span className="sr-only">Next</span>
//                       <ChevronRight size={16} />
//                     </button>
//                   </nav>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }//orginal code..

// import { useState, useEffect, useRef } from "react";
// import AddUserModal from "./UserTop";
// import CreateRoleModal from "./CreateRoleModal";
// import EditUserModal from "./EditUserModal";
// import EditRoleModal from "./EditRoleModal";
// import DeleteModal from "./DeleteModal";
// import axios from "axios";
// import { toast } from "react-toastify";
// import {
//   MoreVertical,
//   Edit,
//   Trash2,
//   ChevronLeft,
//   ChevronRight,
//   Search,
//   Filter,
//   User,
//   Shield,
//   Eye,
//   EyeOff,
// } from "react-feather";
// import { TourProvider, useTour } from "@reactour/tour";

// // ✅ Enhanced Tour Steps with more detailed points
// const tourSteps = [
//   {
//     selector: ".add-user-btn",
//     content: "Click here to add a new user to the system. You can set their details, role, and status.",
//   },
//   {
//     selector: ".create-role-btn",
//     content: "Click here to create a new role with specific permissions and access levels.",
//   },
//   {
//     selector: ".users-table .search-input",
//     content: "Search users by name, email, or phone number. The table will filter results as you type.",
//   },
//   {
//     selector: ".users-table .filter-select",
//     content: "Filter users by status - show all users, only active users, or only inactive users.",
//   },
//   {
//     selector: ".users-table .user-row:first-child",
//     content: "Each user row displays profile information, name, contact details, role, and status.",
//   },
//   {
//     selector: ".users-table .status-badge",
//     content: "User status indicators show if the user is currently active (green) or inactive (red).",
//   },
//   {
//     selector: ".users-table .action-menu:first-child",
//     content: "Click the three-dot menu to access user actions like edit or delete.",
//   },
//   {
//     selector: ".users-table .pagination",
//     content: "Navigate through multiple pages of users. The counter shows your current position and total results.",
//   },
//   {
//     selector: ".roles-table .search-input",
//     content: "Search roles by name. The table will update automatically as you type.",
//   },
//   {
//     selector: ".roles-table .role-row:first-child",
//     content: "Each role row displays the role name and provides management options.",
//   },
//   {
//     selector: ".roles-table .action-menu:first-child",
//     content: "Click the three-dot menu to edit or delete roles. Note: Some system roles may not be deletable.",
//   },
//   {
//     selector: ".roles-table .pagination",
//     content: "Navigate through multiple pages of roles. Helpful when you have many roles defined.",
//   },
//   {
//     selector: ".tour-finish",
//     content: "You've completed the tour! You can review these points anytime by clicking 'Take Tour' again.",
//   },
// ];

// function UserManagementInner() {
//   const API_URL = import.meta.env.VITE_API_URL;
//   const [roles, setRoles] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [currentPageUsers, setCurrentPageUsers] = useState(1);
//   const [currentPageRoles, setCurrentPageRoles] = useState(1);
//   const [itemsPerPage] = useState(5);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [actionType, setActionType] = useState("");
//   const [itemType, setItemType] = useState("");
//   const [searchUserQuery, setSearchUserQuery] = useState("");
//   const [searchRoleQuery, setSearchRoleQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [openMenuId, setOpenMenuId] = useState(null);
//   const dropdownRef = useRef(null);

//   // ✅ Reactour states
//   const { setIsOpen, setCurrentStep } = useTour();

//   // Start tour
//   const startTour = () => {
//     setCurrentStep(0);
//     setIsOpen(true);
//   };

//   // ✅ Fetch Roles
//   const fetchRoles = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const { data } = await axios.get(`${API_URL}/roles`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setRoles(Array.isArray(data) ? data : data.roles || []);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load roles");
//     }
//   };

//   // ✅ Fetch Users
//   const fetchUsers = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const { data } = await axios.get(`${API_URL}/users`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const usersWithImageUrl = data.users.map((user) => ({
//         ...user,
//         profileImageUrl: user.profileImage
//           ? `http://localhost:5000/${user.profileImage}`
//           : null,
//       }));
//       setUsers(usersWithImageUrl || []);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load users");
//     }
//   };

//   const handleAction = (item, type, action) => {
//     setSelectedItem(item);
//     setItemType(type);
//     setActionType(action);
//     if (action !== "menu") setOpenMenuId(null);
//   };

//   const handleMenuToggle = (id) => {
//     setOpenMenuId(openMenuId === id ? null : id);
//   };

//   const handleDeleteConfirm = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       let url = "";
//       if (itemType === "user") {
//         url = `${API_URL}/users/delete-user/${selectedItem._id}`;
//       } else {
//         url = `${API_URL}/roles/delete-role/${selectedItem._id}`;
//       }
//       await axios.delete(url, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success(
//         `${itemType === "user" ? "User" : "Role"} deleted successfully!`
//       );
//       itemType === "user" ? fetchUsers() : fetchRoles();
//       setActionType("");
//     } catch (err) {
//       console.error(err);
//       toast.error(`Failed to delete ${itemType}`);
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target) &&
//         !event.target.closest(".menu-button")
//       ) {
//         setOpenMenuId(null);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   useEffect(() => {
//     fetchRoles();
//     fetchUsers();
//   }, []);

//   // Filter users
//   const filteredUsers = users.filter((user) => {
//     const matchesSearch =
//       user.firstName.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
//       user.lastName.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchUserQuery.toLowerCase());
//     const matchesStatus =
//       statusFilter === "all" ||
//       (statusFilter === "active" && user.status === "Active") ||
//       (statusFilter === "inactive" && user.status !== "Active");
//     return matchesSearch && matchesStatus;
//   });

//   // Filter roles
//   const filteredRoles = roles.filter((role) =>
//     role.name.toLowerCase().includes(searchRoleQuery.toLowerCase())
//   );

//   // Pagination
//   const indexOfLastUser = currentPageUsers * itemsPerPage;
//   const indexOfFirstUser = indexOfLastUser - itemsPerPage;
//   const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
//   const totalPagesUsers = Math.ceil(filteredUsers.length / itemsPerPage);

//   const indexOfLastRole = currentPageRoles * itemsPerPage;
//   const indexOfFirstRole = indexOfLastRole - itemsPerPage;
//   const currentRoles = filteredRoles.slice(indexOfFirstRole, indexOfLastRole);
//   const totalPagesRoles = Math.ceil(filteredRoles.length / itemsPerPage);

//   return (
//     <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
//       {/* ✅ Modals */}
//       {actionType === "edit" && itemType === "user" && (
//         <EditUserModal
//           user={selectedItem}
//           roles={roles}
//           onClose={() => setActionType("")}
//           onUserUpdated={fetchUsers}
//         />
//       )}
//       {actionType === "edit" && itemType === "role" && (
//         <EditRoleModal
//           role={selectedItem}
//           onClose={() => setActionType("")}
//           onRoleUpdated={fetchRoles}
//         />
//       )}
//       {actionType === "delete" && (
//         <DeleteModal
//           item={selectedItem}
//           itemType={itemType}
//           onClose={() => setActionType("")}
//           onConfirm={handleDeleteConfirm}
//         />
//       )}

//       {/* ✅ Page Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-800">
//             User & Role Management
//           </h1>
//           <p className="text-gray-600 mt-1">
//             Manage users and their access permissions
//           </p>
//         </div>
//         <div className="flex flex-wrap gap-3 items-center">
//           <div className="add-user-btn">
//             <AddUserModal onUserCreated={fetchUsers} />
//           </div>
//           <div className="create-role-btn">
//             <CreateRoleModal onRoleCreated={fetchRoles} />
//           </div>
//           {/* ✅ Take Tour Button */}
//           <button
//             onClick={startTour}
//             className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 tour-finish"
//           >
//             <Eye className="w-4 h-4" /> Take Tour
//           </button>
//         </div>
//       </div>

//       {/* ✅ Users & Roles Tables */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Users Table */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden users-table">
//           <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//             <div>
//               <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                 <User size={20} className="text-blue-500" />
//                 Users ({filteredUsers.length})
//               </h2>
//             </div>
//             <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
//               <div className="relative">
//                 <Search
//                   size={16}
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Search users..."
//                   value={searchUserQuery}
//                   onChange={(e) => setSearchUserQuery(e.target.value)}
//                   className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent search-input"
//                 />
//               </div>
//               <div className="relative">
//                 <Filter
//                   size={16}
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                 />
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none filter-select"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Profile
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Email
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Role
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {currentUsers.length > 0 ? (
//                   currentUsers.map((user, index) => (
//                     <tr
//                       key={user._id}
//                       className={`hover:bg-gray-50 transition-colors user-row ${index === 0 ? 'first-user-row' : ''}`}
//                     >
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-10 w-10">
//                             <img
//                               src={
//                                 user.profileImageUrl ||
//                                 "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
//                               }
//                               alt="profile"
//                               className="h-10 w-10 rounded-full object-cover border border-gray-200"
//                             />
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">
//                           {user.firstName} {user.lastName}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           {user.mobileNumber || "-"}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {user.email}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
//                           {user.role?.name || "N/A"}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span
//                           className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium status-badge ${
//                             user.status === "Active"
//                               ? "bg-green-100 text-green-800"
//                               : "bg-red-100 text-red-800"
//                           }`}
//                         >
//                           {user.status === "Active" ? (
//                             <>
//                               <Eye size={12} className="mr-1" /> Active
//                             </>
//                           ) : (
//                             <>
//                               <EyeOff size={12} className="mr-1" /> Inactive
//                             </>
//                           )}
//                         </span>
//                       </td>

//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <div className="relative inline-block text-left action-menu">
//                           <button
//                             onClick={() => handleMenuToggle(user._id)}
//                             className="menu-button inline-flex items-center p-1 text-gray-400 hover:text-gray-600 transition-colors"
//                           >
//                             <MoreVertical size={16} />
//                           </button>

//                           {openMenuId === user._id && (
//                             <div
//                               ref={dropdownRef}
//                               className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white z-10 border border-gray-200"
//                             >
//                               <div className="py-1" role="none">
//                                 <button
//                                   onClick={() =>
//                                     handleAction(user, "user", "edit")
//                                   }
//                                   className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full"
//                                 >
//                                   <Edit
//                                     size={14}
//                                     className="mr-3 text-gray-400 group-hover:text-gray-500"
//                                   />
//                                   Edit
//                                 </button>
//                                 <button
//                                   onClick={() =>
//                                     handleAction(user, "user", "delete")
//                                   }
//                                   className="group flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 hover:text-red-700 w-full"
//                                 >
//                                   <Trash2
//                                     size={14}
//                                     className="mr-3 text-red-400 group-hover:text-red-500"
//                                   />
//                                   Delete
//                                 </button>
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan="6"
//                       className="px-6 py-8 text-center text-gray-500"
//                     >
//                       <User size={40} className="mx-auto text-gray-300 mb-2" />
//                       <p>No users found</p>
//                       <p className="text-sm mt-1">
//                         Try adjusting your search or filter
//                       </p>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {totalPagesUsers > 1 && (
//             <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200 pagination">
//               <div className="flex-1 flex justify-between items-center">
//                 <div>
//                   <p className="text-sm text-gray-700">
//                     Showing{" "}
//                     <span className="font-medium">{indexOfFirstUser + 1}</span>{" "}
//                     to{" "}
//                     <span className="font-medium">
//                       {Math.min(indexOfLastUser, filteredUsers.length)}
//                     </span>{" "}
//                     of{" "}
//                     <span className="font-medium">{filteredUsers.length}</span>{" "}
//                     results
//                   </p>
//                 </div>
//                 <div>
//                   <nav
//                     className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
//                     aria-label="Pagination"
//                   >
//                     <button
//                       onClick={() =>
//                         setCurrentPageUsers((prev) => Math.max(prev - 1, 1))
//                       }
//                       disabled={currentPageUsers === 1}
//                       className="relative inline-flex items-center px-2.5 py-1.5 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                     >
//                       <span className="sr-only">Previous</span>
//                       <ChevronLeft size={16} />
//                     </button>
//                     <div className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
//                       Page {currentPageUsers} of {totalPagesUsers}
//                     </div>
//                     <button
//                       onClick={() =>
//                         setCurrentPageUsers((prev) =>
//                           Math.min(prev + 1, totalPagesUsers)
//                         )
//                       }
//                       disabled={currentPageUsers === totalPagesUsers}
//                       className="relative inline-flex items-center px-2.5 py-1.5 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                     >
//                       <span className="sr-only">Next</span>
//                       <ChevronRight size={16} />
//                     </button>
//                   </nav>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Roles Table */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden roles-table">
//           <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//             <div>
//               <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                 <Shield size={20} className="text-green-500" />
//                 Roles ({filteredRoles.length})
//               </h2>
//             </div>
//             <div className="relative">
//               <Search
//                 size={16}
//                 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//               />
//               <input
//                 type="text"
//                 placeholder="Search roles..."
//                 value={searchRoleQuery}
//                 onChange={(e) => setSearchRoleQuery(e.target.value)}
//                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent search-input"
//               />
//             </div>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Role Name
//                   </th>
//                   <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {currentRoles.length > 0 ? (
//                   currentRoles.map((role, index) => (
//                     <tr
//                       key={role._id}
//                       className={`hover:bg-gray-50 transition-colors role-row ${index === 0 ? 'first-role-row' : ''}`}
//                     >
//                       <td className="px-6 py-4">
//                         <div className="text-sm font-medium text-gray-900">
//                           {role.name}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <div className="relative inline-block text-left action-menu">
//                           <button
//                             onClick={() => handleMenuToggle(`role-${role._id}`)}
//                             className="menu-button inline-flex items-center p-1 text-gray-400 hover:text-gray-600 transition-colors"
//                           >
//                             <MoreVertical size={16} />
//                           </button>
//                           {openMenuId === `role-${role._id}` && (
//                             <div
//                               ref={dropdownRef}
//                               className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white z-10 border border-gray-200"
//                             >
//                               <div className="py-1" role="none">
//                                 <button
//                                   onClick={() =>
//                                     handleAction(role, "role", "edit")
//                                   }
//                                   className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full"
//                                 >
//                                   <Edit
//                                     size={14}
//                                     className="mr-3 text-gray-400 group-hover:text-gray-500"
//                                   />
//                                   Edit
//                                 </button>
//                                 <button
//                                   onClick={() =>
//                                     handleAction(role, "role", "delete")
//                                   }
//                                   className="group flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 hover:text-red-700 w-full"
//                                 >
//                                   <Trash2
//                                     size={14}
//                                     className="mr-3 text-red-400 group-hover:text-red-500"
//                                   />
//                                   Delete
//                                 </button>
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan="2"
//                       className="px-6 py-8 text-center text-gray-500"
//                     >
//                       <Shield
//                         size={40}
//                         className="mx-auto text-gray-300 mb-2"
//                       />
//                       <p>No roles found</p>
//                       <p className="text-sm mt-1">
//                         Try adjusting your search or create a new role
//                       </p>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {totalPagesRoles > 1 && (
//             <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200 pagination">
//               <div className="flex-1 flex justify-between items-center">
//                 <div>
//                   <p className="text-sm text-gray-700">
//                     Showing{" "}
//                     <span className="font-medium">{indexOfFirstRole + 1}</span>{" "}
//                     to{" "}
//                     <span className="font-medium">
//                       {Math.min(indexOfLastRole, filteredRoles.length)}
//                     </span>{" "}
//                     of{" "}
//                     <span className="font-medium">{filteredRoles.length}</span>{" "}
//                     results
//                   </p>
//                 </div>
//                 <div>
//                   <nav
//                     className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
//                     aria-label="Pagination"
//                   >
//                     <button
//                       onClick={() =>
//                         setCurrentPageRoles((prev) => Math.max(prev - 1, 1))
//                       }
//                       disabled={currentPageRoles === 1}
//                       className="relative inline-flex items-center px-2.5 py-1.5 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                     >
//                       <span className="sr-only">Previous</span>
//                       <ChevronLeft size={16} />
//                     </button>
//                     <div className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
//                       Page {currentPageRoles} of {totalPagesRoles}
//                     </div>
//                     <button
//                       onClick={() =>
//                         setCurrentPageRoles((prev) =>
//                           Math.min(prev + 1, totalPagesRoles)
//                         )
//                       }
//                       disabled={currentPageRoles === totalPagesRoles}
//                       className="relative inline-flex items-center px-2.5 py-1.5 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                     >
//                       <span className="sr-only">Next</span>
//                       <ChevronRight size={16} />
//                     </button>
//                   </nav>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ✅ Wrap main component inside TourProvider
// export default function UserManagement() {
//   return (
//     <TourProvider
//       steps={tourSteps}
//       afterOpen={() => (document.body.style.overflow = "hidden")}
//       beforeClose={() => (document.body.style.overflow = "unset")}
//       styles={{
//         popover: (base) => ({
//           ...base,
//           backgroundColor: "#fff",
//           color: "#1f1f1f",
//           maxWidth: "320px",
//         }),
//         maskArea: (base) => ({ ...base, rx: 8 }),
//         badge: (base) => ({ ...base, left: "auto", right: "-0.8125em" }),
//         close: (base) => ({
//           ...base,
//           right: "auto",
//           left: 8,
//           top: 8,
//         }),
//       }}
//     >
//       <UserManagementInner />
//     </TourProvider>
//   );
// }

import { useState, useEffect, useRef } from "react";
import AddUserModal from "./UserTop";
import CreateRoleModal from "./CreateRoleModal";
import EditUserModal from "./EditUserModal";
import EditRoleModal from "./EditRoleModal";
import DeleteModal from "./DeleteModal";
import axios from "axios";
import { toast } from "react-toastify";
import {
  MoreVertical,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  User,
  Shield,
  Eye,
  EyeOff,
} from "react-feather";
import { TourProvider, useTour } from "@reactour/tour";

// Utility: Scroll an element into view with its scrollable parents
function scrollIntoViewWithParents(el, options = {}) {
  if (!el) return;
  // Scroll this element in its parent scroll container(s)
  let parent = el.parentElement;
  while (parent) {
    const style = getComputedStyle(parent);
    const overflowY = style.overflowY;
    if (overflowY === "auto" || overflowY === "scroll") {
      const parentRect = parent.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      if (elRect.top < parentRect.top || elRect.bottom > parentRect.bottom) {
        parent.scrollTop +=
          elRect.top -
          parentRect.top -
          parentRect.height / 2 +
          elRect.height / 2;
      }
    }
    parent = parent.parentElement;
  }
  // Also scroll the element into the main viewport
  el.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "center",
    ...options,
  });
}

// ✅ Enhanced Tour Steps with corrected selectors
const tourSteps = [
  {
    selector: ".add-user-btn button",
    content: "Click here to add a new user with details, role, and status.",
  },
  {
    selector: ".create-role-btn button",
    content: "Click here to create a new role with permissions.",
  },
  {
    selector: ".users-table .search-input",
    content: "Search users by name, email, or phone number.",
  },
  // {
  //   selector: ".users-table .filter-select",
  //   content: "Filter users by active or inactive status.",
  // },
  // {
  //   selector: ".users-table .first-user-row",
  //   content: "Each row displays user information, role, and status.",
  // },
  // {
  //   selector: ".users-table .action-menu",
  //   content: "Click here to access user actions like edit or delete.",
  // },
  {
    selector: ".users-table .pagination",
    content: "Use the pagination controls to navigate users.",
  },
  {
    selector: ".roles-table .search-input",
    content: "Search roles by name. The table updates as you type.",
  },
  {
    selector: ".roles-table .first-role-row",
    content: "Each role row shows the role name with edit/delete options.",
  },
  {
    selector: ".roles-table .action-menu",
    content: "Click here for role actions like edit or delete.",
  },
  {
    selector: ".tour-finish",
    content: "You’ve completed the tour! Restart anytime.",
  },
];

function UserManagementInner() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentPageUsers, setCurrentPageUsers] = useState(1);
  const [currentPageRoles, setCurrentPageRoles] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionType, setActionType] = useState("");
  const [itemType, setItemType] = useState("");
  const [searchUserQuery, setSearchUserQuery] = useState("");
  const [searchRoleQuery, setSearchRoleQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openMenuId, setOpenMenuId] = useState(null);
  const dropdownRef = useRef(null);

  // ✅ Reactour states
  const { setIsOpen, setCurrentStep, currentStep } = useTour();

  // ✅ Auto-scroll when step changes (with parents)
  useEffect(() => {
    if (currentStep != null && tourSteps[currentStep]?.selector) {
      const el = document.querySelector(tourSteps[currentStep].selector);
      if (el) {
        setTimeout(() => {
          scrollIntoViewWithParents(el);
        }, 250); // Slightly longer delay for smoother experience
      }
    }
  }, [currentStep]);

  const startTour = () => {
    setCurrentStep(0);
    setIsOpen(true);
  };

  // ✅ Fetch Roles
  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_URL}/roles`, {
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
      const { data } = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const usersWithImageUrl = data.users.map((user) => ({
        ...user,
        profileImageUrl: user.profileImage
          ? `http://localhost:5000/${user.profileImage}`
          : null,
      }));
      setUsers(usersWithImageUrl || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    }
  };

  const handleAction = (item, type, action) => {
    setSelectedItem(item);
    setItemType(type);
    setActionType(action);
    if (action !== "menu") setOpenMenuId(null);
  };

  const handleMenuToggle = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      let url = "";
      if (itemType === "user") {
        url = `${API_URL}/users/delete-user/${selectedItem._id}`;
      } else {
        url = `${API_URL}/roles/delete-role/${selectedItem._id}`;
      }
      await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(
        `${itemType === "user" ? "User" : "Role"} deleted successfully!`
      );
      itemType === "user" ? fetchUsers() : fetchRoles();
      setActionType("");
    } catch (err) {
      console.error(err);
      toast.error(`Failed to delete ${itemType}`);
    }
  };

  // ✅ Click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest(".menu-button")
      ) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);

  // ✅ Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchUserQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && user.status === "Active") ||
      (statusFilter === "inactive" && user.status !== "Active");
    return matchesSearch && matchesStatus;
  });

  // ✅ Filter roles
  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchRoleQuery.toLowerCase())
  );

  // ✅ Pagination
  const indexOfLastUser = currentPageUsers * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPagesUsers = Math.ceil(filteredUsers.length / itemsPerPage);

  const indexOfLastRole = currentPageRoles * itemsPerPage;
  const indexOfFirstRole = indexOfLastRole - itemsPerPage;
  const currentRoles = filteredRoles.slice(indexOfFirstRole, indexOfLastRole);
  const totalPagesRoles = Math.ceil(filteredRoles.length / itemsPerPage);

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      {/* ✅ Modals */}
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

      {/* ✅ Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            User & Role Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage users and their access permissions
          </p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="add-user-btn">
            <AddUserModal onUserCreated={fetchUsers} />
          </div>
          <div className="create-role-btn">
            <CreateRoleModal onRoleCreated={fetchRoles} />
          </div>
          <button
            onClick={startTour}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 tour-finish"
          >
            <Eye className="w-4 h-4" /> Take Tour
          </button>
        </div>
      </div>

      {/* ✅ Users & Roles Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden users-table">
          <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <User size={20} className="text-blue-500" />
                Users ({filteredUsers.length})
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchUserQuery}
                  onChange={(e) => setSearchUserQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent search-input"
                />
              </div>
              <div className="relative">
                <Filter
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none filter-select"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profile
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.length > 0 ? (
                  currentUsers.map((user, index) => (
                    <tr
                      key={user._id}
                      className={`hover:bg-gray-50 transition-colors user-row ${
                        index === 0 ? "first-user-row" : ""
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              src={
                                user.profileImageUrl ||
                                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                              }
                              alt="profile"
                              className="h-10 w-10 rounded-full object-cover border border-gray-200"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.mobileNumber || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {user.role?.name || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium status-badge ${
                            user.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.status === "Active" ? (
                            <>
                              <Eye size={12} className="mr-1" /> Active
                            </>
                          ) : (
                            <>
                              <EyeOff size={12} className="mr-1" /> Inactive
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="relative inline-block text-left action-menu">
                          <button
                            onClick={() => handleMenuToggle(user._id)}
                            className="menu-button inline-flex items-center p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <MoreVertical size={16} />
                          </button>
                          {openMenuId === user._id && (
                            <div
                              ref={dropdownRef}
                              className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white z-10 border border-gray-200"
                            >
                              <div className="py-1" role="none">
                                <button
                                  onClick={() =>
                                    handleAction(user, "user", "edit")
                                  }
                                  className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full"
                                >
                                  <Edit
                                    size={14}
                                    className="mr-3 text-gray-400 group-hover:text-gray-500"
                                  />
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleAction(user, "user", "delete")
                                  }
                                  className="group flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 hover:text-red-700 w-full"
                                >
                                  <Trash2
                                    size={14}
                                    className="mr-3 text-red-400 group-hover:text-red-500"
                                  />
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
                      colSpan="6"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      <User size={40} className="mx-auto text-gray-300 mb-2" />
                      <p>No users found</p>
                      <p className="text-sm mt-1">
                        Try adjusting your search or filter
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {totalPagesUsers > 1 && (
            <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200 pagination">
              <div className="flex-1 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">{indexOfFirstUser + 1}</span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastUser, filteredUsers.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">{filteredUsers.length}</span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() =>
                        setCurrentPageUsers((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPageUsers === 1}
                      className="relative inline-flex items-center px-2.5 py-1.5 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft size={16} />
                    </button>
                    <div className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      Page {currentPageUsers} of {totalPagesUsers}
                    </div>
                    <button
                      onClick={() =>
                        setCurrentPageUsers((prev) =>
                          Math.min(prev + 1, totalPagesUsers)
                        )
                      }
                      disabled={currentPageUsers === totalPagesUsers}
                      className="relative inline-flex items-center px-2.5 py-1.5 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight size={16} />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Roles Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden roles-table">
          <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Shield size={20} className="text-green-500" />
                Roles ({filteredRoles.length})
              </h2>
            </div>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search roles..."
                value={searchRoleQuery}
                onChange={(e) => setSearchRoleQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent search-input"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role Name
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentRoles.length > 0 ? (
                  currentRoles.map((role, index) => (
                    <tr
                      key={role._id}
                      className={`hover:bg-gray-50 transition-colors role-row ${
                        index === 0 ? "first-role-row" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {role.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="relative inline-block text-left action-menu">
                          <button
                            onClick={() => handleMenuToggle(`role-${role._id}`)}
                            className="menu-button inline-flex items-center p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <MoreVertical size={16} />
                          </button>
                          {openMenuId === `role-${role._id}` && (
                            <div
                              ref={dropdownRef}
                              className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white z-10 border border-gray-200"
                            >
                              <div className="py-1" role="none">
                                <button
                                  onClick={() =>
                                    handleAction(role, "role", "edit")
                                  }
                                  className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full"
                                >
                                  <Edit
                                    size={14}
                                    className="mr-3 text-gray-400 group-hover:text-gray-500"
                                  />
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleAction(role, "role", "delete")
                                  }
                                  className="group flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 hover:text-red-700 w-full"
                                >
                                  <Trash2
                                    size={14}
                                    className="mr-3 text-red-400 group-hover:text-red-500"
                                  />
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
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      <Shield
                        size={40}
                        className="mx-auto text-gray-300 mb-2"
                      />
                      <p>No roles found</p>
                      <p className="text-sm mt-1">
                        Try adjusting your search or create a new role
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {totalPagesRoles > 1 && (
            <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200 pagination">
              <div className="flex-1 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">{indexOfFirstRole + 1}</span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastRole, filteredRoles.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">{filteredRoles.length}</span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() =>
                        setCurrentPageRoles((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPageRoles === 1}
                      className="relative inline-flex items-center px-2.5 py-1.5 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft size={16} />
                    </button>
                    <div className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      Page {currentPageRoles} of {totalPagesRoles}
                    </div>
                    <button
                      onClick={() =>
                        setCurrentPageRoles((prev) =>
                          Math.min(prev + 1, totalPagesRoles)
                        )
                      }
                      disabled={currentPageRoles === totalPagesRoles}
                      className="relative inline-flex items-center px-2.5 py-1.5 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight size={16} />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ✅ Wrap inside TourProvider
export default function UserManagement() {
  return (
    <TourProvider
      steps={tourSteps}
      scrollSmooth
      mutationObservables={[document.querySelector("#root")]}
      scrollIntoViewOptions={{
        behavior: "smooth",
        block: "center",
        inline: "center",
      }}
      afterOpen={() => (document.body.style.overflow = "hidden")}
      beforeClose={() => (document.body.style.overflow = "unset")}
      styles={{
        popover: (base) => ({
          ...base,
          backgroundColor: "#fff",
          color: "#1f1f1f",
          maxWidth: "320px",
        }),
        maskArea: (base) => ({ ...base, rx: 8 }),
       badge: (base) => ({
          ...base,
          display: "none", // Hide the default number badge
        }),
        close: (base) => ({
          ...base,
          right: "auto",
          left: 8,
          top: 8,
        }),
      }}
    >
      <UserManagementInner />
    </TourProvider>
  );
} //all come perfectly scroll correctly come..
