// // src/components/PasswordUpdate.js
// import React, { useState } from "react";
// import { Eye, EyeOff, ShieldCheck } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const PasswordUpdate = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });
//   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     // Validation
//     if (formData.newPassword !== formData.confirmPassword) {
//       setError("New password and confirm password do not match");
//       return;
//     }

//     if (formData.newPassword.length < 6) {
//       setError("Password must be at least 6 characters long");
//       return;
//     }

//     setLoading(true);

//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch("http://localhost:5000/api/users/update-password", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setSuccess("Password updated successfully!");
//         setTimeout(() => {
//          // navigate("/dashboard/profile");
//         }, 2000);
//       } else {
//         setError(data.message || "Failed to update password");
//       }
//     } catch (err) {
//       setError("An error occurred. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
//       <div className="flex items-center justify-center mb-6">
//         <ShieldCheck size={32} className="text-blue-500 mr-2" />
//         <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
//           Update Password
//         </h2>
//       </div>

//       {error && (
//         <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
//           {error}
//         </div>
//       )}

//       {success && (
//         <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
//           {success}
//         </div>
//       )}

//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
//             Email
//           </label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
//             Current Password
//           </label>
//           <div className="relative">
//             <input
//               type={showCurrentPassword ? "text" : "password"}
//               name="currentPassword"
//               value={formData.currentPassword}
//               onChange={handleChange}
//               required
//               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white pr-10"
//             />
//             <button
//               type="button"
//               className="absolute inset-y-0 right-0 pr-3 flex items-center"
//               onClick={() => setShowCurrentPassword(!showCurrentPassword)}
//             >
//               {showCurrentPassword ? (
//                 <EyeOff size={18} className="text-gray-500" />
//               ) : (
//                 <Eye size={18} className="text-gray-500" />
//               )}
//             </button>
//           </div>
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
//             New Password
//           </label>
//           <div className="relative">
//             <input
//               type={showNewPassword ? "text" : "password"}
//               name="newPassword"
//               value={formData.newPassword}
//               onChange={handleChange}
//               required
//               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white pr-10"
//             />
//             <button
//               type="button"
//               className="absolute inset-y-0 right-0 pr-3 flex items-center"
//               onClick={() => setShowNewPassword(!showNewPassword)}
//             >
//               {showNewPassword ? (
//                 <EyeOff size={18} className="text-gray-500" />
//               ) : (
//                 <Eye size={18} className="text-gray-500" />
//               )}
//             </button>
//           </div>
//         </div>

//         <div className="mb-6">
//           <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
//             Confirm New Password
//           </label>
//           <div className="relative">
//             <input
//               type={showConfirmPassword ? "text" : "password"}
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               required
//               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white pr-10"
//             />
//             <button
//               type="button"
//               className="absolute inset-y-0 right-0 pr-3 flex items-center"
//               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//             >
//               {showConfirmPassword ? (
//                 <EyeOff size={18} className="text-gray-500" />
//               ) : (
//                 <Eye size={18} className="text-gray-500" />
//               )}
//             </button>
//           </div>
//         </div>

//         <div className="flex items-center justify-between">
//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={loading}
//             className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
//           >
//             {loading ? "Updating..." : "Update Password"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default PasswordUpdate;


// import React, { useState } from "react";
// import { Eye, EyeOff, ShieldCheck } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "../../components/ui/dialog";

// const PasswordUpdate = ({ open, onOpenChange }) => {
//   const [formData, setFormData] = useState({
//     email: "",
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });
//   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     // Validation
//     if (formData.newPassword !== formData.confirmPassword) {
//       setError("New password and confirm password do not match");
//       return;
//     }

//     if (formData.newPassword.length < 6) {
//       setError("Password must be at least 6 characters long");
//       return;
//     }

//     setLoading(true);

//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch("http://localhost:5000/api/users/update-password", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setSuccess("Password updated successfully!");
//         setTimeout(() => {
//           onOpenChange(false);
//           // Reset form
//           setFormData({
//             email: "",
//             currentPassword: "",
//             newPassword: "",
//             confirmPassword: "",
//           });
//         }, 2000);
//       } else {
//         setError(data.message || "Failed to update password");
//       }
//     } catch (err) {
//       setError("An error occurred. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     onOpenChange(false);
//     // Reset form and errors when closing
//     setFormData({
//       email: "",
//       currentPassword: "",
//       newPassword: "",
//       confirmPassword: "",
//     });
//     setError("");
//     setSuccess("");
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle className="flex items-center justify-center">
//             <ShieldCheck size={32} className="text-blue-500 mr-2" />
//             <span className="text-2xl font-bold text-gray-800 dark:text-white">
//               Update Password
//             </span>
//           </DialogTitle>
//         </DialogHeader>

//         <div className="p-4">
//           {error && (
//             <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
//               {error}
//             </div>
//           )}

//           {success && (
//             <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
//               {success}
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>
//             <div className="mb-4">
//               <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
//                 Current Password
//               </label>
//               <div className="relative">
//                 <input
//                   type={showCurrentPassword ? "text" : "password"}
//                   name="currentPassword"
//                   value={formData.currentPassword}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white pr-10"
//                 />
//                 <button
//                   type="button"
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   onClick={() => setShowCurrentPassword(!showCurrentPassword)}
//                 >
//                   {showCurrentPassword ? (
//                     <EyeOff size={18} className="text-gray-500" />
//                   ) : (
//                     <Eye size={18} className="text-gray-500" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             <div className="mb-4">
//               <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
//                 New Password
//               </label>
//               <div className="relative">
//                 <input
//                   type={showNewPassword ? "text" : "password"}
//                   name="newPassword"
//                   value={formData.newPassword}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white pr-10"
//                 />
//                 <button
//                   type="button"
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   onClick={() => setShowNewPassword(!showNewPassword)}
//                 >
//                   {showNewPassword ? (
//                     <EyeOff size={18} className="text-gray-500" />
//                   ) : (
//                     <Eye size={18} className="text-gray-500" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             <div className="mb-6">
//               <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
//                 Confirm New Password
//               </label>
//               <div className="relative">
//                 <input
//                   type={showConfirmPassword ? "text" : "password"}
//                   name="confirmPassword"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white pr-10"
//                 />
//                 <button
//                   type="button"
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 >
//                   {showConfirmPassword ? (
//                     <EyeOff size={18} className="text-gray-500" />
//                   ) : (
//                     <Eye size={18} className="text-gray-500" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             <div className="flex items-center justify-between">
//               <button
//                 type="button"
//                 onClick={handleClose}
//                 className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
//               >
//                 {loading ? "Updating..." : "Update Password"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default PasswordUpdate;

// PasswordUpdate.js
import React, { useState } from "react";
import { Eye, EyeOff, ShieldCheck, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

const PasswordUpdate = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/users/update-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Password updated successfully!");
        setTimeout(() => {
          onClose();
          // Reset form
          setFormData({
            email: "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        }, 2000);
      } else {
        setError(data.message || "Failed to update password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="flex items-center text-xl font-bold text-gray-800 dark:text-white">
            <ShieldCheck size={24} className="text-blue-500 mr-2" />
            Update Password
          </DialogTitle>
          <button
            onClick={onClose}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </DialogHeader>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff size={18} className="text-gray-500" />
                ) : (
                  <Eye size={18} className="text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff size={18} className="text-gray-500" />
                ) : (
                  <Eye size={18} className="text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} className="text-gray-500" />
                ) : (
                  <Eye size={18} className="text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordUpdate;