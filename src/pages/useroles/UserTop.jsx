// import { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "../../components/ui/dialog";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
// import "react-phone-number-input/style.css";
// import { Eye, EyeOff, X } from "lucide-react";

// export default function AddUserModal({ onUserCreated }) {
//   const API_URL = import.meta.env.VITE_API_URL;

//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     gender: "",
//     dateOfBirth: "",
//     mobileNumber: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     address: "",
//     role: "",
//     status: "Active",
//     profileImage: null,
//   });
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [roles, setRoles] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   // Refs
//   const formRef = useRef(null);
//   const dialogContentRef = useRef(null);
//   const fileInputRef = useRef(null);

//   // Reset form completely
//   const resetForm = () => {
//     setFormData({
//       firstName: "",
//       lastName: "",
//       gender: "",
//       dateOfBirth: "",
//       mobileNumber: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//       address: "",
//       role: "",
//       status: "Active",
//       profileImage: null,
//     });
//     setPreviewUrl(null);
//     setErrors({});
//     setShowPassword(false);
//     setShowConfirmPassword(false);
    
//     // Clear file input
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   // Handle dialog open/close
//   const handleOpenChange = (open) => {
//     setIsDialogOpen(open);
//     if (!open) {
//       resetForm();
//     }
//   };

//   // Handle cancel button
//   const handleCancel = () => {
//     resetForm();
//     setIsDialogOpen(false);
//   };

//   useEffect(() => {
//     // Fix any styling issues
//     if (isDialogOpen) {
//       const style = document.createElement('style');
//       style.id = 'phone-input-fix';
//       style.textContent = `
//         .PhoneInput {
//           width: 100%;
//         }
//         .PhoneInputInput {
//           width: 100%;
//           padding: 10px;
//           border-radius: 8px;
//           border: 1px solid #d1d5db;
//           font-size: 14px;
//           outline: none;
//           transition: all 0.2s;
//         }
//         .PhoneInputInput:focus {
//           border-color: #3b82f6;
//           box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
//         }
//         .PhoneInputCountry {
//           padding: 0 12px 0 8px;
//         }
//         .PhoneInputCountrySelect {
//           position: absolute;
//           top: 0;
//           left: 0;
//           height: 100%;
//           width: 100%;
//           z-index: 1;
//           border: 0;
//           opacity: 0;
//           cursor: pointer;
//         }
//         .PhoneInputCountryIcon {
//           width: 24px;
//           height: 18px;
//           box-shadow: 0 0 1px rgba(0,0,0,0.5);
//         }
//         .Toastify__close-button {
//           pointer-events: auto !important;
//         }
//       `;
//       document.head.appendChild(style);
      
//       return () => {
//         const existingStyle = document.getElementById('phone-input-fix');
//         if (existingStyle) {
//           existingStyle.remove();
//         }
//       };
//     }
//   }, [isDialogOpen]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));

//     // Clear error when field is changed
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
    
//     // Real-time password match validation
//     if (name === 'password' || name === 'confirmPassword') {
//       if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
//         setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
//       } else if (formData.password && formData.confirmPassword && formData.password === formData.confirmPassword) {
//         setErrors((prev) => ({ ...prev, confirmPassword: "" }));
//       }
//     }
//   };

//   const handlePhoneChange = (value) => {
//     setFormData((prev) => ({ ...prev, mobileNumber: value || "" }));
    
//     // Clear error if exists
//     if (errors.mobileNumber) {
//       setErrors((prev) => ({ ...prev, mobileNumber: "" }));
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Validate file type
//       const validImageTypes = [
//         "image/jpeg",
//         "image/jpg",
//         "image/png",
//         "image/gif",
//         "image/webp",
//       ];
//       if (!validImageTypes.includes(file.type)) {
//         toast.error("Only JPEG, JPG, PNG, GIF and WebP files are allowed");
//         setErrors((prev) => ({
//           ...prev,
//           profileImage: "Only JPEG, JPG, PNG, GIF and WebP files are allowed",
//         }));
//         return;
//       }

//       // Validate file size (20MB)
//       if (file.size > 20 * 1024 * 1024) {
//         toast.error("File size must be less than 20MB");
//         setErrors((prev) => ({
//           ...prev,
//           profileImage: "File size must be less than 20MB",
//         }));
//         return;
//       }

//       setFormData((prev) => ({ ...prev, profileImage: file }));
      
//       // Create preview URL
//       const url = URL.createObjectURL(file);
//       setPreviewUrl(url);
      
//       setErrors((prev) => ({ ...prev, profileImage: "" }));
//     }
//   };

//   const removeProfileImage = () => {
//     setFormData((prev) => ({ ...prev, profileImage: null }));
//     setPreviewUrl(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   // Helper function to validate phone number with 10 digits after country code
//   const validatePhoneNumber = (phoneNumber) => {
//     if (!phoneNumber) return { isValid: false, error: "Phone number is required" };
    
//     // First check if it's a valid phone number format
//     if (!isValidPhoneNumber(phoneNumber)) {
//       return { isValid: false, error: "Please enter a valid phone number" };
//     }
    
//     // Remove all non-digit characters
//     const digitsOnly = phoneNumber.replace(/\D/g, '');
    
//     // Check total length (should be at least 11 digits: country code + 10 digits)
//     if (digitsOnly.length < 11) {
//       return {
//         isValid: false,
//         error: "Phone number must have at least 10 digits after country code"
//       };
//     }
    
//     // Check if we have at least 10 digits after country code
//     // Country codes can be 1-3 digits
//     // We'll assume the remaining digits should be at least 10
//     // This is a simplified check
//     const minDigitsAfterCountryCode = 10;
    
//     // Get the part after the '+' sign
//     const withoutPlus = phoneNumber.substring(1);
//     const digitsAfterPlus = withoutPlus.replace(/\D/g, '');
    
//     if (digitsAfterPlus.length < minDigitsAfterCountryCode) {
//       return {
//         isValid: false,
//         error: `Phone number must have at least ${minDigitsAfterCountryCode} digits after country code`
//       };
//     }
    
//     return { isValid: true, error: "" };
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     // First Name validation
//     if (!formData.firstName.trim()) newErrors.firstName = "First name is required";

//     // Last Name validation
//     if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

//     // Email validation
//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Email is invalid";
//     }

//     // Phone validation
//     const phoneValidation = validatePhoneNumber(formData.mobileNumber);
//     if (!phoneValidation.isValid) {
//       newErrors.mobileNumber = phoneValidation.error;
//     }

//     // Password validation
//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     } else if (formData.password.length < 8) {
//       newErrors.password = "Password must be at least 8 characters";
//     } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
//       newErrors.password = "Password must contain uppercase, lowercase and numbers";
//     }

//     // Confirm Password validation - check if passwords match
//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = "Confirm password is required";
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match";
//     }

//     // Role validation
//     if (!formData.role) newErrors.role = "Role is required";

//     // Gender validation
//     if (!formData.gender) newErrors.gender = "Gender is required";

//     setErrors(newErrors);
    
//     // Scroll to first error
//     if (Object.keys(newErrors).length > 0 && formRef.current) {
//       setTimeout(() => {
//         const firstErrorElement = formRef.current.querySelector('.border-red-500');
//         if (firstErrorElement) {
//           firstErrorElement.scrollIntoView({
//             behavior: 'smooth',
//             block: 'center'
//           });
//         } else {
//           formRef.current.scrollTo({ top: 0, behavior: 'smooth' });
//         }
//       }, 100);
//     }
    
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (isSubmitting) return;
    
//     setIsSubmitting(true);

//     if (!validateForm()) {
//       // Use a timeout to prevent the toast click from closing the modal
//       setTimeout(() => {
//         toast.error("Please fill all required fields correctly", {
//           autoClose: 5000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           onClick: (e) => {
//             // Prevent event bubbling when clicking on toast
//             e.stopPropagation();
//           },
//         });
//       }, 100);
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       const payload = new FormData();
//       Object.entries(formData).forEach(([key, value]) => {
//         if (value !== null && value !== undefined && value !== '') {
//           payload.append(key, value);
//         }
//       });

//       const token = localStorage.getItem("token");

//       await axios.post(`${API_URL}/users/create`, payload, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       toast.success("User created successfully!", {
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         onClick: (e) => {
//           // Prevent event bubbling when clicking on toast
//           e.stopPropagation();
//         },
//       });

//       // ✅ notify parent to refresh list
//       if (onUserCreated) {
//         await onUserCreated();
//       }

//       resetForm();
//       setIsDialogOpen(false);
//     } catch (err) {
//       console.error(err);
//       const errorMsg = err.response?.data?.message || "Failed to create user";
//       toast.error(errorMsg, {
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         onClick: (e) => {
//           // Prevent event bubbling when clicking on toast
//           e.stopPropagation();
//         },
//       });

//       // Set server validation errors
//       if (err.response?.data?.errors) {
//         setErrors(err.response.data.errors);
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const fetchRoles = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(`${API_URL}/roles`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Check your API response structure
//       const rolesData = Array.isArray(response.data)
//         ? response.data
//         : response.data.roles || [];

//       setRoles(rolesData);
//     } catch (err) {
//       console.error("Failed to fetch roles", err);
//       toast.error("Failed to load roles. Please try again.", {
//         onClick: (e) => {
//           // Prevent event bubbling when clicking on toast
//           e.stopPropagation();
//         },
//       });
//     }
//   };

//   useEffect(() => {
//     if (isDialogOpen) {
//       fetchRoles();
//     }
//   }, [isDialogOpen]);

//   // Clean up preview URL
//   useEffect(() => {
//     return () => {
//       if (previewUrl) {
//         URL.revokeObjectURL(previewUrl);
//       }
//     };
//   }, [previewUrl]);

//   // Function to check if click is on toast
//   const isToastClick = (event) => {
//     return event.target.closest('.Toastify__toast') !== null;
//   };

//   return (
//     <div>
//       <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
//         <DialogTrigger asChild>
//           <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
//             Add User
//           </button>
//         </DialogTrigger>

//         <DialogContent
//           ref={dialogContentRef}
//           className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-0"
//           style={{ zIndex: 50 }}
//           onPointerDownOutside={(e) => {
//             // Prevent closing when clicking on toast
//             if (isToastClick(e)) {
//               e.preventDefault();
//             }
//           }}
//           onInteractOutside={(e) => {
//             // Prevent closing when clicking on toast
//             if (isToastClick(e)) {
//               e.preventDefault();
//             }
//           }}
//           onEscapeKeyDown={(e) => {
//             // Allow escape key to close the dialog even if toast is open
//             // No prevention needed
//           }}
//         >
//           <DialogHeader className="px-6 pt-6 pb-0">
//             <div className="flex justify-between items-center">
//               <DialogTitle className="text-xl font-bold text-gray-800">
//                 Add New User
//               </DialogTitle>
//               <button
//                 onClick={() => handleOpenChange(false)}
//                 className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors flex items-center justify-center w-8 h-8"
//                 aria-label="Close"
//               >
             
//               </button>
//             </div>
//           </DialogHeader>

//           {/* Profile Photo Upload */}
//           <div className="flex justify-center py-6 px-6">
//             <div className="relative w-32 h-32">
//               <div className="w-full h-full overflow-hidden rounded-full border-4 border-white shadow-lg">
//                 {previewUrl ? (
//                   <img
//                     src={previewUrl}
//                     alt="Profile Preview"
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
              
//               {/* Upload Button */}
//               <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 p-2.5 rounded-full cursor-pointer shadow-lg transition-all duration-200 transform hover:scale-105">
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   name="profileImage"
//                   accept="image/*"
//                   onChange={handleFileChange}
//                   className="hidden"
//                 />
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   height="20px"
//                   viewBox="0 -960 960 960"
//                   width="20px"
//                   fill="white"
//                 >
//                   <path d="M480-264q72 0 120-49t48-119q0-69-48-118.5T480-600q-72 0-120 49.5T312-432q0 69.5 48 118.5t120 49Zm0-72q-42 0-69-28.13T384-433q0-39.9 27-67.45Q438-528 480-528t69 27.55q27 27.55 27 67.45 0 40.74-27 68.87Q522-336 480-336ZM168-144q-29 0-50.5-21.5T96-216v-432q0-29 21.5-50.5T168-720h120l72-96h240l72 96h120q29.7 0 50.85 21.5Q864-677 864-648v432q0 29-21.15 50.5T792-144H168Zm0-72h624v-432H636l-72.1-96H396l-72 96H168v432Zm312-217Z" />
//                 </svg>
//               </label>
              
//               {/* Remove Image Button (only shown when image exists) */}
//               {previewUrl && (
//                 <button
//                   type="button"
//                   onClick={removeProfileImage}
//                   className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 p-1.5 rounded-full cursor-pointer shadow-lg transition-all duration-200"
//                   aria-label="Remove profile image"
//                 >
//                   <X size={14} className="text-white" />
//                 </button>
//               )}
//             </div>
//           </div>
          
//           {errors.profileImage && (
//             <div className="px-6 -mt-4">
//               <p className="text-red-500 text-sm text-center bg-red-50 py-1.5 px-3 rounded-md inline-block">
//                 {errors.profileImage}
//               </p>
//             </div>
//           )}

//           {/* Form */}
//           <form
//             ref={formRef}
//             onSubmit={handleSubmit}
//             className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6"
//             onClick={(e) => {
//               // Prevent form clicks from bubbling to dialog
//               e.stopPropagation();
//             }}
//           >
//             {/* First Name - Required */}
//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-1 block">
//                 First Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="firstName"
//                 placeholder="Enter first name"
//                 value={formData.firstName}
//                 onChange={handleChange}
//                 className={`p-2.5 border rounded-lg w-full transition-all duration-200 ${
//                   errors.firstName
//                     ? "border-red-500 bg-red-50"
//                     : "border-gray-300 hover:border-gray-400"
//                 } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
//               />
//               {errors.firstName && (
//                 <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
//                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                   </svg>
//                   {errors.firstName}
//                 </p>
//               )}
//             </div>

//             {/* Last Name - Required */}
//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-1 block">
//                 Last Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="lastName"
//                 placeholder="Enter last name"
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 className={`p-2.5 border rounded-lg w-full transition-all duration-200 ${
//                   errors.lastName
//                     ? "border-red-500 bg-red-50"
//                     : "border-gray-300 hover:border-gray-400"
//                 } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
//               />
//               {errors.lastName && (
//                 <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
//                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                   </svg>
//                   {errors.lastName}
//                 </p>
//               )}
//             </div>

//             {/* Gender - Required */}
//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-1 block">
//                 Gender <span className="text-red-500">*</span>
//               </label>
//               <select
//                 name="gender"
//                 value={formData.gender}
//                 onChange={handleChange}
//                 className={`p-2.5 border rounded-lg w-full transition-all duration-200 ${
//                   errors.gender
//                     ? "border-red-500 bg-red-50"
//                     : "border-gray-300 hover:border-gray-400"
//                 } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
//               >
//                 <option value="">Select Gender</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//                 <option value="Other">Other</option>
//               </select>
//               {errors.gender && (
//                 <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
//                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                   </svg>
//                   {errors.gender}
//                 </p>
//               )}
//             </div>

//             {/* DOB - Optional */}
//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-1 block">
//                 Date of Birth
//               </label>
//               <input
//                 type="date"
//                 name="dateOfBirth"
//                 value={formData.dateOfBirth}
//                 onChange={handleChange}
//                 className="p-2.5 border border-gray-300 rounded-lg w-full transition-all duration-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             {/* Mobile Number - Required */}
//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-1 block">
//                 Phone Number <span className="text-red-500">*</span>
//               </label>
//               <div className={`border rounded-lg transition-all duration-200 ${
//                 errors.mobileNumber
//                   ? "border-red-500 bg-red-50"
//                   : "border-gray-300 hover:border-gray-400"
//               } focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent`}>
//                 <PhoneInput
//                   international
//                   defaultCountry="IN"
//                   value={formData.mobileNumber}
//                   onChange={handlePhoneChange}
//                   placeholder="Enter phone number with country code"
//                   className="w-full"
//                   inputClassName={`w-full p-2.5 bg-transparent border-none focus:outline-none focus:ring-0 ${
//                     errors.mobileNumber ? 'placeholder-red-300' : ''
//                   }`}
//                   countrySelectProps={{
//                     className: "border-none bg-transparent"
//                   }}
//                 />
//               </div>
//               {errors.mobileNumber && (
//                 <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
//                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                   </svg>
//                   {errors.mobileNumber}
//                 </p>
//               )}
//               <p className="text-xs text-gray-500 mt-1.5">
//                 Enter phone number with country code (must have 10 digits after country code)
//               </p>
//             </div>

//             {/* Email - Required */}
//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-1 block">
//                 Email <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Enter email address"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className={`p-2.5 border rounded-lg w-full transition-all duration-200 ${
//                   errors.email
//                     ? "border-red-500 bg-red-50"
//                     : "border-gray-300 hover:border-gray-400"
//                 } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
//               />
//               {errors.email && (
//                 <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
//                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                   </svg>
//                   {errors.email}
//                 </p>
//               )}
//             </div>

//             {/* Password - Required */}
//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-1 block">
//                 Password <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   placeholder="Enter password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className={`p-2.5 border rounded-lg w-full pr-10 transition-all duration-200 ${
//                     errors.password
//                       ? "border-red-500 bg-red-50"
//                       : "border-gray-300 hover:border-gray-400"
//                   } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
//                 />
//                 <button
//                   type="button"
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
//                   onClick={() => setShowPassword(!showPassword)}
//                   aria-label={showPassword ? "Hide password" : "Show password"}
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
//                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                   </svg>
//                   {errors.password}
//                 </p>
//               )}
//               <p className="text-xs text-gray-500 mt-1.5">
//                 Minimum 8 characters with uppercase, lowercase and numbers
//               </p>
//             </div>

//             {/* Confirm Password - Required */}
//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-1 block">
//                 Confirm Password <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <input
//                   type={showConfirmPassword ? "text" : "password"}
//                   name="confirmPassword"
//                   placeholder="Confirm password"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   className={`p-2.5 border rounded-lg w-full pr-10 transition-all duration-200 ${
//                     errors.confirmPassword
//                       ? "border-red-500 bg-red-50"
//                       : "border-gray-300 hover:border-gray-400"
//                   } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
//                 />
//                 <button
//                   type="button"
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   aria-label={showConfirmPassword ? "Hide password" : "Show password"}
//                 >
//                   {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>
//               {errors.confirmPassword && (
//                 <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
//                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                   </svg>
//                   {errors.confirmPassword}
//                 </p>
//               )}
              
//               {/* Real-time password match validation */}
//               {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && !errors.confirmPassword && (
//                 <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
//                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                   </svg>
//                   Passwords do not match
//                 </p>
//               )}
//             </div>

//             {/* Address (full width row) */}
//             <div className="sm:col-span-2">
//               <label className="text-sm font-medium text-gray-700 mb-1 block">
//                 Address
//               </label>
//               <textarea
//                 name="address"
//                 placeholder="Enter address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 className="p-2.5 border border-gray-300 rounded-lg w-full transition-all duration-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//                 rows="3"
//               />
//             </div>

//             {/* Role - Required */}
//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-1 block">
//                 Role <span className="text-red-500">*</span>
//               </label>
//               <select
//                 name="role"
//                 value={formData.role}
//                 onChange={handleChange}
//                 className={`p-2.5 border rounded-lg w-full transition-all duration-200 ${
//                   errors.role
//                     ? "border-red-500 bg-red-50"
//                     : "border-gray-300 hover:border-gray-400"
//                 } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
//               >
//                 <option value="">Select Role</option>
//                 {roles.length === 0 ? (
//                   <option disabled>Loading roles...</option>
//                 ) : (
//                   roles.map((role) => (
//                     <option key={role._id} value={role._id}>
//                       {role.name}
//                     </option>
//                   ))
//                 )}
//               </select>
//               {errors.role && (
//                 <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
//                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                   </svg>
//                   {errors.role}
//                 </p>
//               )}
//             </div>

//             {/* Status */}
//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-1 block">
//                 Status
//               </label>
//               <select
//                 name="status"
//                 value={formData.status}
//                 onChange={handleChange}
//                 className="p-2.5 border border-gray-300 rounded-lg w-full transition-all duration-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option value="Active">Active</option>
//                 <option value="Inactive">Inactive</option>
//               </select>
//             </div>

//             {/* Buttons (span full row) */}
//             <div className="flex justify-end gap-3 border-t pt-4 sm:col-span-2">
//               <button
//                 type="button"
//                 onClick={handleCancel}
//                 disabled={isSubmitting}
//                 className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//               >
//                 {isSubmitting ? (
//                   <>
//                     <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Creating...
//                   </>
//                 ) : (
//                   'Submit'
//                 )}
//               </button>
//             </div>

//             {/* Required field note */}
//             <div className="sm:col-span-2 text-xs text-gray-500 pt-2">
//               <p className="flex items-center gap-1">
//                 <span className="text-red-500">*</span>
//                 <span>Required fields</span>
//               </p>
//             </div>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }//original code..


import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Eye, EyeOff, X } from "lucide-react";

export default function AddUserModal({ onUserCreated }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const API_SI = import.meta.env.VITE_SI_URI; // Add this line

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    role: "",
    status: "Active",
    profileImage: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Refs
  const formRef = useRef(null);
  const dialogContentRef = useRef(null);
  const fileInputRef = useRef(null);

  // Get profile image URL function
  const getProfileImageUrl = (image) => {
    if (!image) return "https://static.vecteezy.com/system/resources/previews/020/429/953/non_2x/admin-icon-vector.jpg";
    if (image.startsWith('blob:')) return image;
    if (image.startsWith('http')) return image;
    return `${API_SI}/${image.replace(/\\/g, "/")}`;
  };

  // Reset form completely
  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      gender: "",
      dateOfBirth: "",
      mobileNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      address: "",
      role: "",
      status: "Active",
      profileImage: null,
    });
    setPreviewUrl(getProfileImageUrl(null));
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle dialog open/close
  const handleOpenChange = (open) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  // Handle cancel button
  const handleCancel = () => {
    resetForm();
    setIsDialogOpen(false);
  };

  useEffect(() => {
    // Fix any styling issues
    if (isDialogOpen) {
      const style = document.createElement('style');
      style.id = 'phone-input-fix';
      style.textContent = `
        .PhoneInput {
          width: 100%;
        }
        .PhoneInputInput {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          font-size: 14px;
          outline: none;
          transition: all 0.2s;
        }
        .PhoneInputInput:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .PhoneInputCountry {
          padding: 0 12px 0 8px;
        }
        .PhoneInputCountrySelect {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          z-index: 1;
          border: 0;
          opacity: 0;
          cursor: pointer;
        }
        .PhoneInputCountryIcon {
          width: 24px;
          height: 18px;
          box-shadow: 0 0 1px rgba(0,0,0,0.5);
        }
        .Toastify__close-button {
          pointer-events: auto !important;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        const existingStyle = document.getElementById('phone-input-fix');
        if (existingStyle) {
          existingStyle.remove();
        }
      };
    }
  }, [isDialogOpen]);

  // Initialize preview URL
  useEffect(() => {
    if (!previewUrl) {
      setPreviewUrl(getProfileImageUrl(null));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is changed
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    
    // Real-time password match validation
    if (name === 'password' || name === 'confirmPassword') {
      if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
      } else if (formData.password && formData.confirmPassword && formData.password === formData.confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, mobileNumber: value || "" }));
    
    // Clear error if exists
    if (errors.mobileNumber) {
      setErrors((prev) => ({ ...prev, mobileNumber: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validImageTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!validImageTypes.includes(file.type)) {
        toast.error("Only JPEG, JPG, PNG, GIF and WebP files are allowed");
        setErrors((prev) => ({
          ...prev,
          profileImage: "Only JPEG, JPG, PNG, GIF and WebP files are allowed",
        }));
        return;
      }

      // Validate file size (20MB)
      if (file.size > 20 * 1024 * 1024) {
        toast.error("File size must be less than 20MB");
        setErrors((prev) => ({
          ...prev,
          profileImage: "File size must be less than 20MB",
        }));
        return;
      }

      setFormData((prev) => ({ ...prev, profileImage: file }));
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      setErrors((prev) => ({ ...prev, profileImage: "" }));
    }
  };

  const removeProfileImage = () => {
    setFormData((prev) => ({ ...prev, profileImage: null }));
    setPreviewUrl(getProfileImageUrl(null));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Helper function to validate phone number with 10 digits after country code
  const validatePhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return { isValid: false, error: "Phone number is required" };
    
    // First check if it's a valid phone number format
    if (!isValidPhoneNumber(phoneNumber)) {
      return { isValid: false, error: "Please enter a valid phone number" };
    }
    
    // Remove all non-digit characters
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    
    // Check total length (should be at least 11 digits: country code + 10 digits)
    if (digitsOnly.length < 11) {
      return { 
        isValid: false, 
        error: "Phone number must have at least 10 digits after country code" 
      };
    }
    
    // Check if we have at least 10 digits after country code
    // Country codes can be 1-3 digits
    // We'll assume the remaining digits should be at least 10
    // This is a simplified check
    const minDigitsAfterCountryCode = 10;
    
    // Get the part after the '+' sign
    const withoutPlus = phoneNumber.substring(1);
    const digitsAfterPlus = withoutPlus.replace(/\D/g, '');
    
    if (digitsAfterPlus.length < minDigitsAfterCountryCode) {
      return { 
        isValid: false, 
        error: `Phone number must have at least ${minDigitsAfterCountryCode} digits after country code` 
      };
    }
    
    return { isValid: true, error: "" };
  };

  const validateForm = () => {
    const newErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";

    // Last Name validation
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Phone validation
    const phoneValidation = validatePhoneNumber(formData.mobileNumber);
    if (!phoneValidation.isValid) {
      newErrors.mobileNumber = phoneValidation.error;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase and numbers";
    }

    // Confirm Password validation - check if passwords match
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Role validation
    if (!formData.role) newErrors.role = "Role is required";

    // Gender validation
    if (!formData.gender) newErrors.gender = "Gender is required";

    setErrors(newErrors);
    
    // Scroll to first error
    if (Object.keys(newErrors).length > 0 && formRef.current) {
      setTimeout(() => {
        const firstErrorElement = formRef.current.querySelector('.border-red-500');
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        } else {
          formRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    if (!validateForm()) {
      // Use a timeout to prevent the toast click from closing the modal
      setTimeout(() => {
        toast.error("Please fill all required fields correctly", {
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          onClick: (e) => {
            // Prevent event bubbling when clicking on toast
            e.stopPropagation();
          },
        });
      }, 100);
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          payload.append(key, value);
        }
      });

      const token = localStorage.getItem("token");

      await axios.post(`${API_URL}/users/create`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("User created successfully!", {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClick: (e) => {
          // Prevent event bubbling when clicking on toast
          e.stopPropagation();
        },
      });

      // ✅ notify parent to refresh list
      if (onUserCreated) {
        await onUserCreated();
      }

      resetForm();
      setIsDialogOpen(false);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Failed to create user";
      toast.error(errorMsg, {
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClick: (e) => {
          // Prevent event bubbling when clicking on toast
          e.stopPropagation();
        },
      });

      // Set server validation errors
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/roles`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Check your API response structure
      const rolesData = Array.isArray(response.data)
        ? response.data
        : response.data.roles || [];

      setRoles(rolesData);
    } catch (err) {
      console.error("Failed to fetch roles", err);
      toast.error("Failed to load roles. Please try again.", {
        onClick: (e) => {
          // Prevent event bubbling when clicking on toast
          e.stopPropagation();
        },
      });
    }
  };

  useEffect(() => {
    if (isDialogOpen) {
      fetchRoles();
    }
  }, [isDialogOpen]);

  // Clean up preview URL
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Function to check if click is on toast
  const isToastClick = (event) => {
    return event.target.closest('.Toastify__toast') !== null;
  };

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Add User
          </button>
        </DialogTrigger>

        <DialogContent 
          ref={dialogContentRef}
          className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-0"
          style={{ zIndex: 50 }}
          onPointerDownOutside={(e) => {
            // Prevent closing when clicking on toast
            if (isToastClick(e)) {
              e.preventDefault();
            }
          }}
          onInteractOutside={(e) => {
            // Prevent closing when clicking on toast
            if (isToastClick(e)) {
              e.preventDefault();
            }
          }}
          onEscapeKeyDown={(e) => {
            // Allow escape key to close the dialog even if toast is open
            // No prevention needed
          }}
        >
          <DialogHeader className="px-6 pt-6 pb-0">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl font-bold text-gray-800">
                Add New User
              </DialogTitle>
              <button
                onClick={() => handleOpenChange(false)}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors flex items-center justify-center w-8 h-8"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
          </DialogHeader>

          {/* Profile Photo Upload */}
          <div className="flex justify-center py-6 px-6">
            <div className="relative w-32 h-32">
              <div className="w-full h-full overflow-hidden rounded-full border-4 border-white shadow-lg">
                <img
                  src={previewUrl}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://static.vecteezy.com/system/resources/previews/020/429/953/non_2x/admin-icon-vector.jpg";
                  }}
                />
              </div>
              
              {/* Upload Button */}
              <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 p-2.5 rounded-full cursor-pointer shadow-lg transition-all duration-200 transform hover:scale-105">
                <input
                  ref={fileInputRef}
                  type="file"
                  name="profileImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  fill="white"
                >
                  <path d="M480-264q72 0 120-49t48-119q0-69-48-118.5T480-600q-72 0-120 49.5T312-432q0 69.5 48 118.5t120 49Zm0-72q-42 0-69-28.13T384-433q0-39.9 27-67.45Q438-528 480-528t69 27.55q27 27.55 27 67.45 0 40.74-27 68.87Q522-336 480-336ZM168-144q-29 0-50.5-21.5T96-216v-432q0-29 21.5-50.5T168-720h120l72-96h240l72 96h120q29.7 0 50.85 21.5Q864-677 864-648v432q0 29-21.15 50.5T792-144H168Zm0-72h624v-432H636l-72.1-96H396l-72 96H168v432Zm312-217Z" />
                </svg>
              </label>
              
              {/* Remove Image Button (only shown when image exists) */}
              {formData.profileImage && (
                <button
                  type="button"
                  onClick={removeProfileImage}
                  className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 p-1.5 rounded-full cursor-pointer shadow-lg transition-all duration-200"
                  aria-label="Remove profile image"
                >
                  <X size={14} className="text-white" />
                </button>
              )}
            </div>
          </div>
          
          {errors.profileImage && (
            <div className="px-6 -mt-4">
              <p className="text-red-500 text-sm text-center bg-red-50 py-1.5 px-3 rounded-md inline-block">
                {errors.profileImage}
              </p>
            </div>
          )}

          {/* Form */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6"
            onClick={(e) => {
              // Prevent form clicks from bubbling to dialog
              e.stopPropagation();
            }}
          >
            {/* Rest of the form remains the same... */}
            {/* ... [All the form fields remain exactly as they were] ... */}
            
            {/* First Name - Required */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleChange}
                className={`p-2.5 border rounded-lg w-full transition-all duration-200 ${
                  errors.firstName 
                    ? "border-red-500 bg-red-50" 
                    : "border-gray-300 hover:border-gray-400"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.firstName}
                </p>
              )}
            </div>

            {/* Last Name - Required */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleChange}
                className={`p-2.5 border rounded-lg w-full transition-all duration-200 ${
                  errors.lastName 
                    ? "border-red-500 bg-red-50" 
                    : "border-gray-300 hover:border-gray-400"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.lastName}
                </p>
              )}
            </div>

            {/* Gender - Required */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`p-2.5 border rounded-lg w-full transition-all duration-200 ${
                  errors.gender 
                    ? "border-red-500 bg-red-50" 
                    : "border-gray-300 hover:border-gray-400"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.gender}
                </p>
              )}
            </div>

            {/* DOB - Optional */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="p-2.5 border border-gray-300 rounded-lg w-full transition-all duration-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Mobile Number - Required */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className={`border rounded-lg transition-all duration-200 ${
                errors.mobileNumber 
                  ? "border-red-500 bg-red-50" 
                  : "border-gray-300 hover:border-gray-400"
              } focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent`}>
                <PhoneInput
                  international
                  defaultCountry="IN"
                  value={formData.mobileNumber}
                  onChange={handlePhoneChange}
                  placeholder="Enter phone number with country code"
                  className="w-full"
                  inputClassName={`w-full p-2.5 bg-transparent border-none focus:outline-none focus:ring-0 ${
                    errors.mobileNumber ? 'placeholder-red-300' : ''
                  }`}
                  countrySelectProps={{
                    className: "border-none bg-transparent"
                  }}
                />
              </div>
              {errors.mobileNumber && (
                <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.mobileNumber}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1.5">
                Enter phone number with country code (must have 10 digits after country code)
              </p>
            </div>

            {/* Email - Required */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                className={`p-2.5 border rounded-lg w-full transition-all duration-200 ${
                  errors.email 
                    ? "border-red-500 bg-red-50" 
                    : "border-gray-300 hover:border-gray-400"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password - Required */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`p-2.5 border rounded-lg w-full pr-10 transition-all duration-200 ${
                    errors.password 
                      ? "border-red-500 bg-red-50" 
                      : "border-gray-300 hover:border-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1.5">
                Minimum 8 characters with uppercase, lowercase and numbers
              </p>
            </div>

            {/* Confirm Password - Required */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`p-2.5 border rounded-lg w-full pr-10 transition-all duration-200 ${
                    errors.confirmPassword 
                      ? "border-red-500 bg-red-50" 
                      : "border-gray-300 hover:border-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.confirmPassword}
                </p>
              )}
              
              {/* Real-time password match validation */}
              {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && !errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Address (full width row) */}
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Address
              </label>
              <textarea
                name="address"
                placeholder="Enter address"
                value={formData.address}
                onChange={handleChange}
                className="p-2.5 border border-gray-300 rounded-lg w-full transition-all duration-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="3"
              />
            </div>

            {/* Role - Required */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`p-2.5 border rounded-lg w-full transition-all duration-200 ${
                  errors.role 
                    ? "border-red-500 bg-red-50" 
                    : "border-gray-300 hover:border-gray-400"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="">Select Role</option>
                {roles.length === 0 ? (
                  <option disabled>Loading roles...</option>
                ) : (
                  roles.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.name}
                    </option>
                  ))
                )}
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.role}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="p-2.5 border border-gray-300 rounded-lg w-full transition-all duration-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Buttons (span full row) */}
            <div className="flex justify-end gap-3 border-t pt-4 sm:col-span-2">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            </div>

            {/* Required field note */}
            <div className="sm:col-span-2 text-xs text-gray-500 pt-2">
              <p className="flex items-center gap-1">
                <span className="text-red-500">*</span>
                <span>Required fields</span>
              </p>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}