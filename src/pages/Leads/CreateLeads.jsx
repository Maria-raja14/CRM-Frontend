// import React, { useState, useEffect } from "react";

// import { useNavigate, useLocation } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function CreateLeads() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const leadId = queryParams.get("id");
  
//   const [formData, setFormData] = useState({
//     leadName: "",
//     phoneNumber: "",
//     email: "",
//     source: "",
//     companyName: "",
//     industry: "",
//     requirement: "",
//     status: "New",
//     assignTo: "",
//     address: "",
//     priorityLevel: "Warm",
//     followUpDate: "",
//     leadStatus: "",
//     notes: "",
//   });

//   const [errors, setErrors] = useState({
//     leadName: false,
//     companyName: false,
//   });

//   // Fetch lead data if in edit mode
//   useEffect(() => {
//     if (leadId) {
//       const fetchLead = async () => {
//         try {
//           const response = await fetch(`http://localhost:5000/api/leads/getLead/${leadId}`);
//           const data = await response.json();
//           setFormData(data);
//         } catch (error) {
//           toast.error("Failed to fetch lead data");
//         }
//       };
//       fetchLead();
//     }
//   }, [leadId]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
    
//     if ((name === "leadName" || name === "companyName") && value.trim() !== "") {
//       setErrors({ ...errors, [name]: false });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Validate required fields
//     const newErrors = {
//       leadName: formData.leadName.trim() === "",
//       companyName: formData.companyName.trim() === "",
//     };
    
//     setErrors(newErrors);
    
//     if (!newErrors.leadName && !newErrors.companyName) {
//       try {
//         const url = leadId
//           ? `http://localhost:5000/api/leads/updateLead/${leadId}`
//           : "http://localhost:5000/api/leads/create";
        
//         const method = leadId ? "PUT" : "POST";
        
//         const response = await fetch(url, {
//           method,
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(formData),
//         });
        
//         if (response.ok) {
//           toast.success(leadId ? "Lead updated successfully" : "Lead created successfully");
//           navigate("/");
//         } else {
//           toast.error(leadId ? "Failed to update lead" : "Failed to create lead");
//         }
//       } catch (error) {
//         toast.error("An error occurred. Please try again.");
//       }
//     }
//   };

//   const fieldGroups = [
//     {
//       title: "Basic Information",
//       fields: ["leadName", "companyName", "phoneNumber", "email", "address"]
//     },
//     {
//       title: "Business Details",
//       fields: ["industry", "source", "requirement"]
//     },
//     {
//       title: "Lead Management",
//       fields: ["status", "assignTo", "priorityLevel", "followUpDate", "leadStatus"]
//     },
//     {
//       title: "Additional Information",
//       fields: ["notes"]
//     }
//   ];

//   const getFieldType = (field) => {
//     if (field.includes("Date")) return "datetime-local";
//     if (field.includes("email")) return "email";
//     if (field === "phoneNumber") return "tel";
//     if (field === "notes") return "textarea";
//     return "text";
//   };

//   const getFieldOptions = (field) => {
//     const options = {
//       status: ["New", "Follow-up", "Converted", "Closed"],
//       priorityLevel: ["Hot", "Warm", "Cold", "Junk"],
//       source: ["Website", "Referral", "Social Media", "Email", "Phone", "Other"],
//       industry: ["IT", "Finance", "Healthcare", "Education", "Manufacturing", "Retail", "Other"]
//     };
//     return options[field] || null;
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
//       <h1 className="text-2xl font-semibold mb-6 text-gray-800">
//         {leadId ? "Edit Lead" : "Create New Lead"}
//       </h1>
      
//       <form onSubmit={handleSubmit} className="space-y-8">
//         {fieldGroups.map((group) => (
//           <div key={group.title} className="space-y-4">
//             <h2 className="text-lg font-medium text-gray-700 border-b pb-2">{group.title}</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {group.fields.map((field) => (
//                 <div key={field} className="flex flex-col">
//                   <label className="text-sm font-medium mb-1 text-gray-600 capitalize">
//                     {field.replace(/([A-Z])/g, ' $1').trim()}
//                     {(field === "leadName" || field === "companyName") && (
//                       <span className="text-red-500 ml-1">*</span>
//                     )}
//                   </label>
                  
//                   {getFieldOptions(field) ? (
//                     <select
//                       name={field}
//                       value={formData[field]}
//                       onChange={handleChange}
//                       className={`border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                         errors[field] ? "border-red-500" : "border-gray-300"
//                       }`}
//                     >
//                       <option value="">Select {field.replace(/([A-Z])/g, ' $1').trim()}</option>
//                       {getFieldOptions(field).map(option => (
//                         <option key={option} value={option}>{option}</option>
//                       ))}
//                     </select>
//                   ) : getFieldType(field) === "textarea" ? (
//                     <textarea
//                       name={field}
//                       value={formData[field]}
//                       onChange={handleChange}
//                       className={`border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                         errors[field] ? "border-red-500" : "border-gray-300"
//                       }`}
//                       rows={3}
//                     />
//                   ) : (
//                     <input
//                       type={getFieldType(field)}
//                       name={field}
//                       value={formData[field]}
//                       onChange={handleChange}
//                       className={`border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                         errors[field] ? "border-red-500" : "border-gray-300"
//                       }`}
//                       required={field === "leadName" || field === "companyName"}
//                     />
//                   )}
                  
//                   {errors[field] && (
//                     <p className="text-red-500 text-xs mt-1">
//                       This field is required
//                     </p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
        
//         <div className="flex justify-end space-x-4 pt-4 border-t">
//           <button
//             type="button"
//             onClick={() => navigate("/")}
//             className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
//           >
//             {leadId ? "Update Lead" : "Save Lead"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }//original


// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function CreateLeads() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const leadId = queryParams.get("id");
  
//   const [formData, setFormData] = useState({
//     leadName: "",
//     phoneNumber: "",
//     email: "",
//     source: "",
//     companyName: "",
//     industry: "",
//     requirement: "",
//     status: "New",
//     assignTo: "",
//     address: "",
//     priorityLevel: "Warm",
//     followUpDate: "",
//     leadStatus: "",
//     notes: "",
//   });

//   const [errors, setErrors] = useState({
//     leadName: false,
//     companyName: false,
//   });

//   // Fetch lead data if in edit mode
//   useEffect(() => {
//     if (leadId) {
//       const fetchLead = async () => {
//         try {
//           const response = await fetch(`http://localhost:5000/api/leads/getLead/${leadId}`);
//           const data = await response.json();
//           setFormData(data);
//         } catch (error) {
//           toast.error("Failed to fetch lead data");
//         }
//       };
//       fetchLead();
//     }
//   }, [leadId]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
    
//     if ((name === "leadName" || name === "companyName") && value.trim() !== "") {
//       setErrors({ ...errors, [name]: false });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Validate required fields
//     const newErrors = {
//       leadName: formData.leadName.trim() === "",
//       companyName: formData.companyName.trim() === "",
//     };
    
//     setErrors(newErrors);
    
//     if (!newErrors.leadName && !newErrors.companyName) {
//       try {
//         const url = leadId
//           ? `http://localhost:5000/api/leads/updateLead/${leadId}`
//           : "http://localhost:5000/api/leads/create";
        
//         const method = leadId ? "PUT" : "POST";
        
//         const response = await fetch(url, {
//           method,
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(formData),
//         });
        
//         if (response.ok) {
//           toast.success(leadId ? "Lead updated successfully" : "Lead created successfully");
//           navigate("/");
//         } else {
//           toast.error(leadId ? "Failed to update lead" : "Failed to create lead");
//         }
//       } catch (error) {
//         toast.error("An error occurred. Please try again.");
//       }
//     }
//   };

//   const fieldGroups = [
//     {
//       title: "Basic Information",
//       fields: ["leadName", "companyName", "phoneNumber", "email", "address"]
//     },
//     {
//       title: "Business Details",
//       fields: ["industry", "source", "requirement"]
//     },
//     {
//       title: "Lead Management",
//       fields: ["status", "assignTo", "priorityLevel", "followUpDate", "leadStatus"]
//     },
//     {
//       title: "Additional Information",
//       fields: ["notes"]
//     }
//   ];

//   const getFieldType = (field) => {
//     if (field.includes("Date")) return "datetime-local";
//     if (field.includes("email")) return "email";
//     if (field === "phoneNumber") return "tel";
//     if (field === "notes") return "textarea";
//     return "text";
//   };

//   const getFieldOptions = (field) => {
//     const options = {
//       status: ["New", "Follow-up", "Converted", "Closed"],
//       priorityLevel: ["Hot", "Warm", "Cold", "Junk"],
//       source: ["Website", "Referral", "Social Media", "Email", "Phone", "Other"],
//       industry: ["IT", "Finance", "Healthcare", "Education", "Manufacturing", "Retail", "Other"]
//     };
//     return options[field] || null;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-6xl mx-auto">
//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           {/* Header - Simplified */}
//           <div className="bg-white px-6 py-4 border-b border-gray-200">
//             <div className="flex items-center">
//               <button
//                 onClick={() => navigate("/")}
//                 className="text-gray-600 hover:text-gray-900 transition-colors mr-4"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                 </svg>
//               </button>
//               <h1 className="text-2xl font-semibold text-gray-800">
//                 {leadId ? "Edit Lead" : "Create New Lead"}
//               </h1>
//             </div>
//           </div>

//           {/* Form Content */}
//           <div className="p-6">
//             <form onSubmit={handleSubmit} className="space-y-8">
//               {fieldGroups.map((group) => (
//                 <div key={group.title} className="space-y-6">
//                   <h2 className="text-lg font-medium text-gray-800 border-b pb-2">
//                     {group.title}
//                   </h2>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {group.fields.map((field) => (
//                       <div key={field} className="space-y-2">
//                         <label className="block text-sm font-medium text-gray-700 capitalize">
//                           {field.replace(/([A-Z])/g, ' $1').trim()}
//                           {(field === "leadName" || field === "companyName") && (
//                             <span className="text-red-500 ml-1">*</span>
//                           )}
//                         </label>
                        
//                         {getFieldOptions(field) ? (
//                           <select
//                             name={field}
//                             value={formData[field]}
//                             onChange={handleChange}
//                             className={`block w-full px-4 py-3 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
//                               errors[field] ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
//                               : "border-gray-300"
//                             }`}
//                           >
//                             <option value="">Select {field.replace(/([A-Z])/g, ' $1').trim()}</option>
//                             {getFieldOptions(field).map(option => (
//                               <option key={option} value={option}>{option}</option>
//                             ))}
//                           </select>
//                         ) : getFieldType(field) === "textarea" ? (
//                           <textarea
//                             name={field}
//                             value={formData[field]}
//                             onChange={handleChange}
//                             rows={4}
//                             className={`block w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
//                               errors[field] ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
//                               : "border-gray-300"
//                             }`}
//                           />
//                         ) : (
//                           <input
//                             type={getFieldType(field)}
//                             name={field}
//                             value={formData[field]}
//                             onChange={handleChange}
//                             className={`block w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
//                               errors[field] ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
//                               : "border-gray-300"
//                             }`}
//                             required={field === "leadName" || field === "companyName"}
//                           />
//                         )}
                        
//                         {errors[field] && (
//                           <p className="mt-1 text-sm text-red-600">
//                             This field is required
//                           </p>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
              
//               {/* Form Footer */}
//               <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
//                 <button
//                   type="button"
//                   onClick={() => navigate("/")}
//                   className="inline-flex items-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   {leadId ? "Update Lead" : "Save Lead"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }//design ok.


// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function CreateLeads() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const leadId = queryParams.get("id");
  
//   const [formData, setFormData] = useState({
//     leadName: "",
//     phoneNumber: "",
//     email: "",
//     source: "",
//     companyName: "",
//     industry: "",
//     requirement: "",
//     status: "New",
//     assignTo: "",
//     address: "",
//     priorityLevel: "Warm",
//     followUpDate: "",
//     leadStatus: "",
//     notes: "",
//   });

//   const [errors, setErrors] = useState({
//     leadName: false,
//     companyName: false,
//   });

//   // Fetch lead data if in edit mode
//   useEffect(() => {
//     if (leadId) {
//       const fetchLead = async () => {
//         try {
//           const response = await fetch(`http://localhost:5000/api/leads/getLead/${leadId}`);
//           const data = await response.json();
//           setFormData(data);
//         } catch (error) {
//           toast.error("Failed to fetch lead data");
//         }
//       };
//       fetchLead();
//     }
//   }, [leadId]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
    
//     if ((name === "leadName" || name === "companyName") && value.trim() !== "") {
//       setErrors({ ...errors, [name]: false });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Validate required fields
//     const newErrors = {
//       leadName: formData.leadName.trim() === "",
//       companyName: formData.companyName.trim() === "",
//     };
    
//     setErrors(newErrors);
    
//     if (!newErrors.leadName && !newErrors.companyName) {
//       try {
//         const url = leadId
//           ? `http://localhost:5000/api/leads/updateLead/${leadId}`
//           : "http://localhost:5000/api/leads/create";
        
//         const method = leadId ? "PUT" : "POST";
        
//         const response = await fetch(url, {
//           method,
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(formData),
//         });
        
//         if (response.ok) {
//           toast.success(leadId ? "Lead updated successfully" : "Lead created successfully");
//           navigate("/leads"); // Changed to navigate to leads page after success
//         } else {
//           toast.error(leadId ? "Failed to update lead" : "Failed to create lead");
//         }
//       } catch (error) {
//         toast.error("An error occurred. Please try again.");
//       }
//     }
//   };

//   const handleBackClick = () => {
//     navigate(-1); // This will go back to the previous page in history
//   };

//   const fieldGroups = [
//     {
//       title: "Basic Information",
//       fields: ["leadName", "companyName", "phoneNumber", "email", "address"]
//     },
//     {
//       title: "Business Details",
//       fields: ["industry", "source", "requirement"]
//     },
//     {
//       title: "Lead Management",
//       fields: ["status", "assignTo", "priorityLevel", "followUpDate", "leadStatus"]
//     },
//     {
//       title: "Additional Information",
//       fields: ["notes"]
//     }
//   ];

//   const getFieldType = (field) => {
//     if (field.includes("Date")) return "datetime-local";
//     if (field.includes("email")) return "email";
//     if (field === "phoneNumber") return "tel";
//     if (field === "notes") return "textarea";
//     return "text";
//   };

//   const getFieldOptions = (field) => {
//     const options = {
//       status: ["New", "Follow-up", "Converted", "Closed"],
//       priorityLevel: ["Hot", "Warm", "Cold", "Junk"],
//       source: ["Website", "Referral", "Social Media", "Email", "Phone", "Other"],
//       industry: ["IT", "Finance", "Healthcare", "Education", "Manufacturing", "Retail", "Other"]
//     };
//     return options[field] || null;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-6xl mx-auto">
//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           {/* Header - Simplified */}
//           <div className="bg-white px-6 py-4 border-b border-gray-200">
//             <div className="flex items-center">
//               <button
//                 onClick={handleBackClick} // Updated to use handleBackClick
//                 className="text-gray-600 hover:text-gray-900 transition-colors mr-4"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                 </svg>
//               </button>
//               <h1 className="text-2xl font-semibold text-gray-800">
//                 {leadId ? "Edit Lead" : "Create New Lead"}
//               </h1>
//             </div>
//           </div>

//           {/* Form Content */}
//           <div className="p-6">
//             <form onSubmit={handleSubmit} className="space-y-8">
//               {fieldGroups.map((group) => (
//                 <div key={group.title} className="space-y-6">
//                   <h2 className="text-lg font-medium text-gray-800 border-b pb-2">
//                     {group.title}
//                   </h2>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {group.fields.map((field) => (
//                       <div key={field} className="space-y-2">
//                         <label className="block text-sm font-medium text-gray-700 capitalize">
//                           {field.replace(/([A-Z])/g, ' $1').trim()}
//                           {(field === "leadName" || field === "companyName") && (
//                             <span className="text-red-500 ml-1">*</span>
//                           )}
//                         </label>
                        
//                         {getFieldOptions(field) ? (
//                           <select
//                             name={field}
//                             value={formData[field]}
//                             onChange={handleChange}
//                             className={`block w-full px-4 py-3 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
//                               errors[field] ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
//                               : "border-gray-300"
//                             }`}
//                           >
//                             <option value="">Select {field.replace(/([A-Z])/g, ' $1').trim()}</option>
//                             {getFieldOptions(field).map(option => (
//                               <option key={option} value={option}>{option}</option>
//                             ))}
//                           </select>
//                         ) : getFieldType(field) === "textarea" ? (
//                           <textarea
//                             name={field}
//                             value={formData[field]}
//                             onChange={handleChange}
//                             rows={4}
//                             className={`block w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
//                               errors[field] ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
//                               : "border-gray-300"
//                             }`}
//                           />
//                         ) : (
//                           <input
//                             type={getFieldType(field)}
//                             name={field}
//                             value={formData[field]}
//                             onChange={handleChange}
//                             className={`block w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
//                               errors[field] ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
//                               : "border-gray-300"
//                             }`}
//                             required={field === "leadName" || field === "companyName"}
//                           />
//                         )}
                        
//                         {errors[field] && (
//                           <p className="mt-1 text-sm text-red-600">
//                             This field is required
//                           </p>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
              
//               {/* Form Footer */}
//               <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
//                 <button
//                   type="button"
//                   onClick={handleBackClick} // Updated to use handleBackClick
//                   className="inline-flex items-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   {leadId ? "Update Lead" : "Save Lead"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }//ok


import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateLeads() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const leadId = queryParams.get("id");
  
  const [formData, setFormData] = useState({
    leadName: "",
    phoneNumber: "",
    email: "",
    source: "",
    companyName: "",
    industry: "",
    requirement: "",
    status: "New",
    assignTo: "",
    address: "",
    priorityLevel: "Warm",
    followUpDate: "",
    leadStatus: "",
    notes: "",
  });

  const [errors, setErrors] = useState({
    leadName: false,
    companyName: false,
  });

  // Fetch lead data if in edit mode
  useEffect(() => {
    if (leadId) {
      const fetchLead = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/leads/getLead/${leadId}`);
          const data = await response.json();
          setFormData(data);
        } catch (error) {
          toast.error("Failed to fetch lead data");
        }
      };
      fetchLead();
    }
  }, [leadId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if ((name === "leadName" || name === "companyName") && value.trim() !== "") {
      setErrors({ ...errors, [name]: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const newErrors = {
      leadName: formData.leadName.trim() === "",
      companyName: formData.companyName.trim() === "",
    };
    
    setErrors(newErrors);
    
    if (!newErrors.leadName && !newErrors.companyName) {
      try {
        const url = leadId
          ? `http://localhost:5000/api/leads/updateLead/${leadId}`
          : "http://localhost:5000/api/leads/create";
        
        const method = leadId ? "PUT" : "POST";
        
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        
        if (response.ok) {
          toast.success(leadId ? "Lead updated successfully" : "Lead created successfully");
          navigate("/leads");
        } else {
          toast.error(leadId ? "Failed to update lead" : "Failed to create lead");
        }
      } catch (error) {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const fieldGroups = [
    {
      title: "Basic Information",
      fields: ["leadName", "companyName", "phoneNumber", "email", "address"]
    },
    {
      title: "Business Details",
      fields: ["industry", "source", "requirement"]
    },
    {
      title: "Lead Management",
      fields: ["status", "assignTo", "priorityLevel", "followUpDate", "leadStatus"]
    },
    {
      title: "Additional Information",
      fields: ["notes"]
    }
  ];

  const getFieldType = (field) => {
    if (field.includes("Date")) return "datetime-local";
    if (field.includes("email")) return "email";
    if (field === "phoneNumber") return "tel";
    if (field === "notes") return "textarea";
    return "text";
  };

  const getFieldPlaceholder = (field) => {
    const placeholders = {
      leadName: "Enter lead name",
      companyName: "Enter company name",
      phoneNumber: "Enter phone number",
      email: "Enter email address",
      address: "Enter full address",
      requirement: "Enter requirements",
      assignTo: "Assign to team member",
      notes: "Enter additional notes"
    };
    return placeholders[field] || "";
  };

  const getFieldOptions = (field) => {
    const options = {
      status: ["New", "Follow-up", "Converted", "Closed"],
      priorityLevel: ["Hot", "Warm", "Cold", "Junk"],
      source: ["Website", "Referral", "Social Media", "Email", "Phone", "Other"],
      industry: ["IT", "Finance", "Healthcare", "Education", "Manufacturing", "Retail", "Other"]
    };
    return options[field] || null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <button
                onClick={handleBackClick}
                className="text-gray-600 hover:text-gray-900 transition-colors mr-4"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-2xl font-semibold text-gray-800">
                {leadId ? "Edit Lead" : "Create New Lead"}
              </h1>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {fieldGroups.map((group) => (
                <div key={group.title} className="space-y-6">
                  <h2 className="text-lg font-medium text-gray-800 border-b pb-2">
                    {group.title}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.fields.map((field) => (
                      <div key={field} className={`space-y-2 ${field === 'notes' ? 'md:col-span-2 lg:col-span-3' : ''}`}>
                        <label className="block text-sm font-medium text-gray-700 capitalize">
                          {field.replace(/([A-Z])/g, ' $1').trim()}
                          {(field === "leadName" || field === "companyName") && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </label>
                        
                        {getFieldOptions(field) ? (
                          <select
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            className={`block w-full px-4 py-3 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                              errors[field] ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300"
                            }`}
                          >
                            <option value="">Select {field.replace(/([A-Z])/g, ' $1').trim()}</option>
                            {getFieldOptions(field).map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        ) : getFieldType(field) === "textarea" ? (
                          <textarea
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            rows={6}
                            placeholder={getFieldPlaceholder(field)}
                            className={`block w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                              errors[field] ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300"
                            }`}
                          />
                        ) : (
                          <div>
                            <input
                              type={getFieldType(field)}
                              name={field}
                              value={formData[field]}
                              onChange={handleChange}
                              placeholder={getFieldPlaceholder(field)}
                              className={`block w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                errors[field] ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300"
                              }`}
                              required={field === "leadName" || field === "companyName"}
                            />
                            {errors[field] && (
                              <p className="mt-1 text-sm text-red-600">
                                {field === "leadName" ? "Lead name is required" : "Company name is required"}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {/* Form Footer */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleBackClick}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {leadId ? "Update Lead" : "Save Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}//With PlaceHolder             


