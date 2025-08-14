// import { useState, useEffect } from "react";
// import axios from "axios";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function AddUserModal() {
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [roles, setRoles] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     gender: "",
//     dateOfBirth: "",
//     mobileNumber: "",
//     email: "",
//     password: "",
//     address: "",
//     role: "",
//     status: "Active", // ✅ Added status
//     profileImage: null,
//   });

//   // Fetch roles
//   useEffect(() => {
//     if (!isDialogOpen) return;
//     const fetchRoles = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const { data } = await axios.get("http://localhost:5000/api/roles", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setRoles(data);
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to load roles");
//       }
//     };
//     fetchRoles();
//   }, [isDialogOpen]);

//   // Fetch users
//   const fetchUsers = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const { data } = await axios.get("http://localhost:5000/api/users", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUsers(data);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load users");
//     }
//   };

//   // When modal opens, load users
//   useEffect(() => {
//     if (isDialogOpen) fetchUsers();
//   }, [isDialogOpen]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setFormData((prev) => ({ ...prev, profileImage: file }));
//   };

//   const handleCancel = () => {
//     setFormData({
//       firstName: "",
//       lastName: "",
//       gender: "",
//       dateOfBirth: "",
//       mobileNumber: "",
//       email: "",
//       password: "",
//       address: "",
//       role: "",
//       status: "Active",
//       profileImage: null,
//     });
//     setIsDialogOpen(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = new FormData();
//       Object.entries(formData).forEach(([key, value]) => {
//         payload.append(key, value);
//       });

//       const token = localStorage.getItem("token");

//       await axios.post(
//         "http://localhost:5000/api/users/create",
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       toast.success("User created successfully!");
//       fetchUsers(); // Refresh table
//       handleCancel();
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Failed to create user");
//     }
//   };

//   return (
//     <div>
//       <ToastContainer />
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogTrigger asChild>
//           <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//             Add User
//           </button>
//         </DialogTrigger>

//         <DialogContent className="max-w-4xl max-h-screen overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="text-lg font-bold">Add New User</DialogTitle>
//           </DialogHeader>

//           {/* Profile Photo Upload */}
//           <div className="flex justify-center py-5">
//             <div className="relative w-28 h-28 flex items-center justify-center rounded-full border-2">
//               <div className="w-24 h-24 overflow-hidden rounded-full border-2 border-gray-300">
//                 {formData.profileImage ? (
//                   <img
//                     src={URL.createObjectURL(formData.profileImage)}
//                     alt="Profile"
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <img
//                     src="https://static.vecteezy.com/system/resources/previews/020/429/953/non_2x/admin-icon-vector.jpg"
//                     alt="User Icon"
//                     className="w-full h-full object-cover"
//                   />
//                 )}
//               </div>
//               <label className="absolute bottom-0 right-0 bg-[#008ecc] p-2 rounded-full cursor-pointer">
//                 <input
//                   type="file"
//                   name="profileImage"
//                   accept="image/*"
//                   onChange={handleFileChange}
//                   className="hidden"
//                 />
//                 <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="white">
//                   <path d="M480-264q72 0 120-49t48-119q0-69-48-118.5T480-600q-72 0-120 49.5t-48 119q0 69.5 48 118.5t120 49Zm0-72q-42 0-69-28.13T384-433q0-39.9 27-67.45Q438-528 480-528t69 27.55q27 27.55 27 67.45 0 40.74-27 68.87Q522-336 480-336ZM168-144q-29 0-50.5-21.5T96-216v-432q0-29 21.5-50.5T168-720h120l72-96h240l72 96h120q29.7 0 50.85 21.5Q864-677 864-648v432q0 29-21.15 50.5T792-144H168Zm0-72h624v-432H636l-72.1-96H396l-72 96H168v432Zm312-217Z" />
//                 </svg>
//               </label>
//             </div>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="p-5 space-y-5">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//               <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="p-2 border rounded-md" required />
//               <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="p-2 border rounded-md" required />
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//               <select name="gender" value={formData.gender} onChange={handleChange} className="p-2 border rounded-md" required>
//                 <option value="">Select Gender</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//                 <option value="Other">Other</option>
//               </select>

//               <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="p-2 border rounded-md" />
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//               <input type="text" name="mobileNumber" placeholder="Mobile Number" value={formData.mobileNumber} onChange={handleChange} className="p-2 border rounded-md" required />
//               <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="p-2 border rounded-md" required />
//             </div>

//             <input type="text" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="p-2 border rounded-md" required />

//             <textarea name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="p-2 border rounded-md" required />

//             <select name="role" value={formData.role} onChange={handleChange} className="p-2 border rounded-md" required>
//               <option value="">Select Role</option>
//               {roles.map((role) => (
//                 <option key={role._id} value={role._id}>
//                   {role.name}
//                 </option>
//               ))}
//             </select>

//             {/* ✅ Status Dropdown */}
//             <select name="status" value={formData.status} onChange={handleChange} className="p-2 border rounded-md" required>
//               <option value="Active">Active</option>
//               <option value="Inactive">Inactive</option>
//             </select>

//             <div className="flex justify-end gap-3 border-t pt-3">
//               <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
//                 Cancel
//               </button>
//               <button type="submit" className="px-4 py-2 bg-[#008ecc] text-white rounded-md hover:bg-blue-700">
//                 Submit
//               </button>
//             </div>
//           </form>

//           {/* ✅ User Table */}
         
//         </DialogContent>
//       </Dialog>
//        <div className="mt-6">
//             <h2 className="font-bold mb-3">Users List</h2>
//             <table className="w-full border-collapse border border-gray-300">
//               <thead>
//                 <tr className="bg-gray-200">
//                   <th className="border p-2">Name</th>
//                   <th className="border p-2">Email</th>
//                   <th className="border p-2">Role</th>
//                   <th className="border p-2">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.length > 0 ? (
//                   users.map((user) => (
//                     <tr key={user._id}>
//                       <td className="border p-2">{user.firstName} {user.lastName}</td>
//                       <td className="border p-2">{user.email}</td>
//                       <td className="border p-2">{user.role?.name}</td>
//                       <td>{user.status ? "Active" : "Inactive"}</td>

//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="4" className="text-center p-2">No users found</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//     </div>
//   );
// }


// import { useState } from "react";
// import axios from "axios";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function AddUserModal({ roles, onUserCreated }) {
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     gender: "",
//     dateOfBirth: "",
//     mobileNumber: "",
//     email: "",
//     password: "",
//     address: "",
//     role: "",
//     status: "Active",
//     profileImage: null,
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setFormData((prev) => ({ ...prev, profileImage: file }));
//   };

//   const handleCancel = () => {
//     setFormData({
//       firstName: "",
//       lastName: "",
//       gender: "",
//       dateOfBirth: "",
//       mobileNumber: "",
//       email: "",
//       password: "",
//       address: "",
//       role: "",
//       status: "Active",
//       profileImage: null,
//     });
//     setIsDialogOpen(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = new FormData();
//       Object.entries(formData).forEach(([key, value]) => {
//         payload.append(key, value);
//       });

//       const token = localStorage.getItem("token");

//       await axios.post(
//         "http://localhost:5000/api/users/create",
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       toast.success("User created successfully!");
//       if (onUserCreated) onUserCreated();
//       handleCancel();
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Failed to create user");
//     }
//   };

//   return (
//     <div>
//       <ToastContainer />
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogTrigger asChild>
//           <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//             Add User
//           </button>
//         </DialogTrigger>

//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle className="text-lg font-bold">Add New User</DialogTitle>
//           </DialogHeader>

//           {/* Profile Photo Upload */}
//           <div className="flex justify-center py-5">
//             <div className="relative w-28 h-28 flex items-center justify-center rounded-full border-2">
//               <div className="w-24 h-24 overflow-hidden rounded-full border-2 border-gray-300">
//                 {formData.profileImage ? (
//                   <img
//                     src={URL.createObjectURL(formData.profileImage)}
//                     alt="Profile"
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <img
//                     src="https://static.vecteezy.com/system/resources/previews/020/429/953/non_2x/admin-icon-vector.jpg"
//                     alt="User Icon"
//                     className="w-full h-full object-cover"
//                   />
//                 )}
//               </div>
//               <label className="absolute bottom-0 right-0 bg-[#008ecc] p-2 rounded-full cursor-pointer">
//                 <input
//                   type="file"
//                   name="profileImage"
//                   accept="image/*"
//                   onChange={handleFileChange}
//                   className="hidden"
//                 />
//                 <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="white">
//                   <path d="M480-264q72 0 120-49t48-119q0-69-48-118.5T480-600q-72 0-120 49.5T312-432q0 69.5 48 118.5t120 49Zm0-72q-42 0-69-28.13T384-433q0-39.9 27-67.45Q438-528 480-528t69 27.55q27 27.55 27 67.45 0 40.74-27 68.87Q522-336 480-336ZM168-144q-29 0-50.5-21.5T96-216v-432q0-29 21.5-50.5T168-720h120l72-96h240l72 96h120q29.7 0 50.85 21.5Q864-677 864-648v432q0 29-21.15 50.5T792-144H168Zm0-72h624v-432H636l-72.1-96H396l-72 96H168v432Zm312-217Z" />
//                 </svg>
//               </label>
//             </div>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="p-5 space-y-5">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//               <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="p-2 border rounded-md" required />
//               <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="p-2 border rounded-md" required />
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//               <select name="gender" value={formData.gender} onChange={handleChange} className="p-2 border rounded-md" required>
//                 <option value="">Select Gender</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//                 <option value="Other">Other</option>
//               </select>

//               <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="p-2 border rounded-md" />
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//               <input type="text" name="mobileNumber" placeholder="Mobile Number" value={formData.mobileNumber} onChange={handleChange} className="p-2 border rounded-md" required />
//               <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="p-2 border rounded-md" required />
//             </div>

//             <input type="text" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="p-2 border rounded-md" required />

//             <textarea name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="p-2 border rounded-md" required />

//             <select name="role" value={formData.role} onChange={handleChange} className="p-2 border rounded-md" required>
//               <option value="">Select Role</option>
//               {roles.map((role) => (
//                 <option key={role._id} value={role._id}>
//                   {role.name}
//                 </option>
//               ))}
//             </select>

//             <select name="status" value={formData.status} onChange={handleChange} className="p-2 border rounded-md" required>
//               <option value="Active">Active</option>
//               <option value="Inactive">Inactive</option>
//             </select>

//             <div className="flex justify-end gap-3 border-t pt-3">
//               <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
//                 Cancel
//               </button>
//               <button type="submit" className="px-4 py-2 bg-[#008ecc] text-white rounded-md hover:bg-blue-700">
//                 Submit
//               </button>
//             </div>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }