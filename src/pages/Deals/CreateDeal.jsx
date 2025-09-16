// import React, { useState, useEffect, useCallback } from "react";

// import { useNavigate, useLocation } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import axios from "axios";
// import { getNames } from "country-list";
// import {
//   ArrowLeft,
//   DollarSign,
//   Briefcase,
//   UserCheck,
//   StickyNote,
//   Phone,
//   Mail,
//   Building2,
//   Globe,
//   MapPin,
//   FileText,
//   BriefcaseBusiness,
// } from "lucide-react";
// import "react-toastify/dist/ReactToastify.css";

// export default function CreateDeal() {
//   const API_URL = import.meta.env.VITE_API_URL;
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Check if we're editing an existing deal
//   const isEditMode = location.state?.deal;
//   const existingDeal = location.state?.deal || null;

//   const [formData, setFormData] = useState({
//     dealName: "",
//     dealValue: "",
//     currency: "INR", // Default currency
//     stage: "Qualification",
//     assignTo: "",
//     notes: "",
//     phoneNumber: "",
//     email: "",
//     source: "",
//     companyName: "",
//     industry: "",
//     requirement: "",
//     address: "",
//     country: "",
//     attachments: [],
//   });

//   const [errors, setErrors] = useState({});
//   const [salesUsers, setSalesUsers] = useState([]);
//   const [existingAttachments, setExistingAttachments] = useState([]);
//   const [userRole, setUserRole] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [countries] = useState(getNames());

//   // Load user role
//   useEffect(() => {
//     const userData = localStorage.getItem("user");
//     if (userData) setUserRole(JSON.parse(userData).role?.name || "");
//   }, []);

//   // Pre-fill form if editing an existing deal
//   useEffect(() => {
//     if (isEditMode && existingDeal) {
//       // Extract numeric value and currency from the formatted value
//       let dealValue = "";
//       let currency = "INR";

//       if (existingDeal.value) {
//         const valueParts = existingDeal.value.split(" ");
//         if (valueParts.length >= 2) {
//           // Remove commas and get the numeric part
//           dealValue = valueParts[0].replace(/,/g, "");
//           currency = valueParts[1];
//         } else {
//           dealValue = existingDeal.value.replace(/,/g, "");
//         }
//       }

//       setFormData({
//         dealName: existingDeal.dealName || "",
//         dealValue: dealValue,
//         currency: currency,
//         stage: existingDeal.stage || "Qualification",
//         assignTo: existingDeal.assignedTo?._id || "",
//         notes: existingDeal.notes || "",
//         phoneNumber: existingDeal.phoneNumber || "",
//         email: existingDeal.email || "",
//         source: existingDeal.source || "",
//         companyName: existingDeal.companyName || "",
//         industry: existingDeal.industry || "",
//         requirement: existingDeal.requirement || "",
//         address: existingDeal.address || "",
//         country: existingDeal.country || "",
//         attachments: [],
//       });

//       // Set existing attachments if any
//       if (existingDeal.attachments && existingDeal.attachments.length > 0) {
//         setExistingAttachments(existingDeal.attachments);
//       }
//     }
//   }, [isEditMode, existingDeal]);

//   // Fetch sales users
//   useEffect(() => {
//     const fetchSalesUsers = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(`${API_URL}/users`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const filtered = (response.data.users || []).filter(
//           (u) => u.role?.name?.trim().toLowerCase() === "sales"
//         );
//         setSalesUsers(filtered);
//       } catch {
//         toast.error("Failed to fetch sales users");
//       }
//     };
//     fetchSalesUsers();
//   }, [API_URL]);

//   const handleChange = useCallback((e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (value.trim() !== "") {
//       setErrors((prev) => ({ ...prev, [name]: false }));
//     }
//   }, []);

//   const handleFileChange = useCallback((e) => {
//     const files = Array.from(e.target.files);

//     // Validate file sizes (max 5MB each)
//     const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
//     if (oversizedFiles.length > 0) {
//       toast.error("Some files exceed the 5MB size limit");
//       // Only keep files under the size limit
//       e.target.value = null;
//       setFormData((prev) => ({
//         ...prev,
//         attachments: [
//           ...prev.attachments,
//           ...files.filter((file) => file.size <= 5 * 1024 * 1024),
//         ],
//       }));
//       return;
//     }

//     setFormData((prev) => ({
//       ...prev,
//       attachments: [...prev.attachments, ...files],
//     }));
//   }, []);

//   const handleRemoveFile = useCallback((idx, type = "new") => {
//     if (type === "new") {
//       setFormData((prev) => ({
//         ...prev,
//         attachments: prev.attachments.filter((_, i) => i !== idx),
//       }));
//     } else {
//       setExistingAttachments((prev) => prev.filter((_, i) => i !== idx));
//     }
//   }, []);

//   // Function to handle file download with authentication
//   const handleFileDownload = async (filePath) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(
//         `${API_URL}/files/download?filePath=${encodeURIComponent(filePath)}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           responseType: "blob",
//         }
//       );

//       // Create a blob from the response
//       const blob = new Blob([response.data]);
      
//       // Create a URL for the blob
//       const url = window.URL.createObjectURL(blob);
      
//       // Create a temporary anchor element to trigger download
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = filePath.split("/").pop() || "download";
//       document.body.appendChild(a);
//       a.click();
      
//       // Clean up
//       window.URL.revokeObjectURL(url);
//       document.body.removeChild(a);
//     } catch (error) {
//       console.error("Download error:", error);
//       toast.error("Failed to download file");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     const newErrors = {
//       dealName: formData.dealName.trim() === "",
//       dealValue: formData.dealValue.trim() === "",
//       phoneNumber: formData.phoneNumber.trim() === "",
//       companyName: formData.companyName.trim() === "",
//     };

//     setErrors(newErrors);

//     if (Object.values(newErrors).some(Boolean)) {
//       toast.error("Please fill in all required fields");
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       const data = new FormData();

//       // Append all form fields
//       Object.keys(formData).forEach((key) => {
//         if (key !== "attachments") {
//           data.append(key, formData[key]);
//         }
//       });

//       // Append attachments individually
//       formData.attachments.forEach((file) => {
//         data.append("attachments", file);
//       });

//       // Append existing attachments as JSON string
//       data.append("existingAttachments", JSON.stringify(existingAttachments));

//       let response;
//       if (isEditMode && existingDeal) {
//         // Update existing deal
//         response = await axios.patch(
//           `${API_URL}/deals/update-deal/${existingDeal._id}`,
//           data,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         toast.success("Deal updated successfully");
//       } else {
//         // Create new deal
//         response = await axios.post(`${API_URL}/deals/createManual`, data, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         toast.success("Deal created successfully");
//       }

//       setTimeout(() => navigate("/deals"), 2000);
//     } catch (err) {
//       console.error("Deal operation error:", err);
//       if (err.response?.data?.message) {
//         toast.error(err.response.data.message);
//       } else {
//         toast.error(
//           isEditMode ? "Failed to update deal" : "Failed to create deal"
//         );
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleBackClick = () => navigate(-1);

//   return (
//     <div className="min-h-screen flex items-start justify-center py-10 px-4">
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />

//       <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl border border-gray-100">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-5 border-b rounded-t-2xl">
//           <div className="flex items-center gap-3">
//             <button
//               onClick={handleBackClick}
//               className="p-2 rounded-lg bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition"
//             >
//               <ArrowLeft size={20} />
//             </button>
//             <h1 className="text-2xl font-bold text-gray-800">
//               {isEditMode ? "Edit Deal" : "Create New Deal"}
//             </h1>
//           </div>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="p-8 space-y-10">
//           {/* Deal Info */}
//           <div className="space-y-6 p-6 border border-gray-200 rounded-xl shadow-sm">
//             <h2 className="text-lg font-semibold border-b pb-2 text-blue-600">
//               Deal Information
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {[
//                 {
//                   name: "dealName",
//                   label: "Deal Name",
//                   icon: <FileText size={16} />,
//                 },
//                 {
//                   name: "dealValue",
//                   label: "Deal Value",
//                   icon: <DollarSign size={16} />,
//                   type: "number",
//                 },
//                 {
//                   name: "currency",
//                   label: "Currency",
//                   icon: <DollarSign size={16} />,
//                   type: "select",
//                   options: [
//                     { value: "INR", label: "INR" },
//                     { value: "USD", label: "USD" },
//                     { value: "EUR", label: "EUR" },
//                     { value: "GBP", label: "GBP" },
//                   ],
//                 },
//                 {
//                   name: "stage",
//                   label: "Stage",
//                   icon: <Briefcase size={16} />,
//                   type: "select",
//                   options: [
//                     "Qualification",
//                     "Proposal",
//                     "Negotiation",
//                     "Closed Won",
//                     "Closed Lost",
//                   ],
//                 },
//                 {
//                   name: "phoneNumber",
//                   label: "Phone Number",
//                   icon: <Phone size={16} />,
//                 },
//                 { name: "email", label: "Email", icon: <Mail size={16} /> },
//                 {
//                   name: "companyName",
//                   label: "Company Name",
//                   icon: <Building2 size={16} />,
//                 },
//                 {
//                   name: "industry",
//                   label: "Industry",
//                   icon: <BriefcaseBusiness size={16} />,
//                   type: "select",
//                   options: [
//                     "IT",
//                     "Finance",
//                     "Healthcare",
//                     "Education",
//                     "Manufacturing",
//                     "Retail",
//                     "Other",
//                   ],
//                 },
//                 {
//                   name: "source",
//                   label: "Source",
//                   icon: <Globe size={16} />,
//                   type: "select",
//                   options: [
//                     "Website",
//                     "Referral",
//                     "Social Media",
//                     "Email",
//                     "Phone",
//                     "Other",
//                   ],
//                 },
//                 {
//                   name: "address",
//                   label: "Address",
//                   icon: <MapPin size={16} />,
//                 },
//                 {
//                   name: "country",
//                   label: "Country",
//                   icon: <Globe size={16} />,
//                   type: "select",
//                   options: countries,
//                 },
//               ].map((field) => (
//                 <div
//                   key={field.name}
//                   className={`${
//                     field.type === "textarea" ? "md:col-span-3" : ""
//                   }`}
//                 >
//                   <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                     {field.icon} {field.label}{" "}
//                     {(field.name === "dealName" ||
//                       field.name === "dealValue" ||
//                       field.name === "phoneNumber" ||
//                       field.name === "companyName") && (
//                       <span className="text-red-500">*</span>
//                     )}
//                   </label>
//                   {field.type === "select" ? (
//                     <select
//                       name={field.name}
//                       value={formData[field.name] || ""}
//                       onChange={handleChange}
//                       className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition h-11"
//                     >
//                       <option value="">Select {field.label}</option>
//                       {field.options.map((opt) =>
//                         typeof opt === "string" ? (
//                           <option key={opt} value={opt}>
//                             {opt}
//                           </option>
//                         ) : (
//                           <option key={opt.value} value={opt.value}>
//                             {opt.label}
//                           </option>
//                         )
//                       )}
//                     </select>
//                   ) : (
//                     <input
//                       type={field.type || "text"}
//                       name={field.name}
//                       value={formData[field.name] || ""}
//                       onChange={handleChange}
//                       placeholder={`Enter ${field.label}`}
//                       className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition h-11"
//                     />
//                   )}
//                   {errors[field.name] && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {field.label} is required
//                     </p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Management & Notes */}
//           {userRole === "Admin" && (
//             <div className="p-6 border border-gray-200 rounded-xl shadow-sm">
//               <h2 className="text-lg font-semibold border-b pb-2 text-yellow-600">
//                 Management
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                     <UserCheck size={16} /> Assign To
//                   </label>
//                   <select
//                     name="assignTo"
//                     value={formData.assignTo}
//                     onChange={handleChange}
//                     className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition h-11"
//                   >
//                     <option value="">Select User</option>
//                     {salesUsers.map((u) => (
//                       <option key={u._id} value={u._id}>
//                         {u.firstName} {u.lastName}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//               <StickyNote size={16} /> Notes
//             </label>
//             <textarea
//               name="notes"
//               rows={4}
//               value={formData.notes}
//               onChange={handleChange}
//               placeholder="Enter Notes..."
//               className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white shadow-sm text-sm text-gray-700 placeholder-gray-400 transition resize-none"
//             />
//           </div>

//           {/* Attachments Section */}
//           <div className="p-6 border rounded-xl shadow-sm">
//             <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
//               Attachments
//             </h2>

//             {/* Existing Files */}
//             {existingAttachments.length > 0 && (
//               <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {existingAttachments.map((file, idx) => (
//                   <div
//                     key={idx}
//                     className="flex flex-col items-center justify-center w-full bg-white border rounded-xl shadow-sm p-3"
//                   >
//                     <button
//                       onClick={() => handleFileDownload(file)}
//                       className="text-xs text-indigo-600 hover:underline truncate w-full text-center"
//                     >
//                       {file.split("/").pop()}
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => handleRemoveFile(idx, "existing")}
//                       className="text-[12px] text-red-600 hover:underline mt-1"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Upload New Files */}
//             <div className="mt-4">
//               <label
//                 htmlFor="attachments"
//                 className="flex flex-col items-center justify-center w-full min-h-32 border-2 border-dashed border-indigo-300 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition p-6"
//               >
//                 {formData.attachments.length === 0 ? (
//                   <>
//                     <svg
//                       className="w-8 h-8 text-gray-400 mb-2"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth={2}
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M7 16V8m0 0l-4 4m4-4l4 4M17 8v8m0 0l4-4m-4 4l-4-4"
//                       />
//                     </svg>
//                     <span className="text-sm text-gray-600">
//                       Click or drag new files here (Max 5MB per file)
//                     </span>
//                   </>
//                 ) : (
//                   <div className="w-full flex flex-wrap gap-4">
//                     {formData.attachments.map((file, idx) => (
//                       <div
//                         key={idx}
//                         className="flex flex-col items-center justify-center w-28 h-28 bg-white border rounded-xl shadow-sm p-2"
//                       >
//                         <div className="w-12 h-12 flex items-center justify-center bg-indigo-100 rounded-md mb-1">
//                           <span className="text-xs font-semibold text-indigo-600">
//                             {file.name.split(".").pop().toUpperCase()}
//                           </span>
//                         </div>
//                         <p className="text-xs text-gray-500">
//                           {(file.size / 1024).toFixed(1)} KB
//                         </p>
//                         <p className="text-[10px] text-gray-700 truncate w-full text-center">
//                           {file.name}
//                         </p>
//                         <button
//                           type="button"
//                           onClick={() => handleRemoveFile(idx, "new")}
//                           className="text-[12px] text-red-600 hover:underline mt-1"
//                         >
//                           Remove
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//                 <input
//                   id="attachments"
//                   type="file"
//                   multiple
//                   onChange={handleFileChange}
//                   className="hidden"
//                 />
//               </label>
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="flex justify-end gap-4 pt-6 border-t">
//             <button
//               type="button"
//               onClick={handleBackClick}
//               className="px-6 py-2 rounded-lg border bg-white hover:bg-gray-100 text-gray-700 transition"
//               disabled={isSubmitting}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md transition disabled:bg-blue-400 disabled:cursor-not-allowed"
//               disabled={isSubmitting}
//             >
//               {isSubmitting
//                 ? isEditMode
//                   ? "Updating..."
//                   : "Creating..."
//                 : isEditMode
//                 ? "Update Deal"
//                 : "Save Deal"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }//attachments download come correctly..



import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { getNames } from "country-list";
import {
  ArrowLeft,
  DollarSign,
  Briefcase,
  UserCheck,
  StickyNote,
  Phone,
  Mail,
  Building2,
  Globe,
  MapPin,
  FileText,
  BriefcaseBusiness,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

// Currency options with symbol and label
const currencyOptions = [
  { code: "USD", symbol: "$", label: "🇺🇸 USD" },
  { code: "EUR", symbol: "€", label: "🇪🇺 EUR" },
  { code: "INR", symbol: "₹", label: "🇮🇳 INR" },
  { code: "GBP", symbol: "£", label: "🇬🇧 GBP" },
  { code: "JPY", symbol: "¥", label: "🇯🇵 JPY" },
  { code: "AUD", symbol: "A$", label: "🇦🇺 AUD" },
  { code: "CAD", symbol: "C$", label: "🇨🇦 CAD" },
  { code: "CHF", symbol: "CHF", label: "🇨🇭 CHF" },
  { code: "MYR", symbol: "RM", label: "🇲🇾 MYR" },
  { code: "AED", symbol: "د.إ", label: "🇦🇪 AED" },
  { code: "SGD", symbol: "S$", label: "🇸🇬 SGD" },
  { code: "ZAR", symbol: "R", label: "🇿🇦 ZAR" },
  { code: "SAR", symbol: "﷼", label: "🇸🇦 SAR" },
];

export default function CreateDeal() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = location.state?.deal;
  const existingDeal = location.state?.deal || null;

  const [formData, setFormData] = useState({
    dealName: "",
    dealValue: "",
    currency: "INR",
    stage: "Qualification",
    assignTo: "",
    notes: "",
    phoneNumber: "",
    email: "",
    source: "",
    companyName: "",
    industry: "",
    requirement: "",
    address: "",
    country: "",
    attachments: [],
  });

  const [errors, setErrors] = useState({});
  const [salesUsers, setSalesUsers] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countries] = useState(getNames());

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUserRole(JSON.parse(userData).role?.name || "");
  }, []);

  useEffect(() => {
    if (isEditMode && existingDeal) {
      let dealValue = "";
      let currency = "INR";
      if (existingDeal.value) {
        const valueParts = existingDeal.value.split(" ");
        if (valueParts.length >= 2) {
          dealValue = valueParts[0].replace(/,/g, "");
          currency = valueParts[1];
        } else {
          dealValue = existingDeal.value.replace(/,/g, "");
        }
      }
      setFormData({
        dealName: existingDeal.dealName || "",
        dealValue: dealValue,
        currency: currency,
        stage: existingDeal.stage || "Qualification",
        assignTo: existingDeal.assignedTo?._id || "",
        notes: existingDeal.notes || "",
        phoneNumber: existingDeal.phoneNumber || "",
        email: existingDeal.email || "",
        source: existingDeal.source || "",
        companyName: existingDeal.companyName || "",
        industry: existingDeal.industry || "",
        requirement: existingDeal.requirement || "",
        address: existingDeal.address || "",
        country: existingDeal.country || "",
        attachments: [],
      });
      if (existingDeal.attachments && existingDeal.attachments.length > 0) {
        setExistingAttachments(existingDeal.attachments);
      }
    }
  }, [isEditMode, existingDeal]);

  useEffect(() => {
    const fetchSalesUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const filtered = (response.data.users || []).filter(
          (u) => u.role?.name?.trim().toLowerCase() === "sales"
        );
        setSalesUsers(filtered);
      } catch {
        toast.error("Failed to fetch sales users");
      }
    };
    fetchSalesUsers();
  }, [API_URL]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (value.trim() !== "") {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  }, []);

  const handleFileChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error("Some files exceed the 5MB size limit");
      e.target.value = null;
      setFormData((prev) => ({
        ...prev,
        attachments: [
          ...prev.attachments,
          ...files.filter((file) => file.size <= 5 * 1024 * 1024),
        ],
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
  }, []);

  const handleRemoveFile = useCallback((idx, type = "new") => {
    if (type === "new") {
      setFormData((prev) => ({
        ...prev,
        attachments: prev.attachments.filter((_, i) => i !== idx),
      }));
    } else {
      setExistingAttachments((prev) => prev.filter((_, i) => i !== idx));
    }
  }, []);

  const handleFileDownload = async (filePath) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/files/download?filePath=${encodeURIComponent(filePath)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filePath.split("/").pop() || "download";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download file");
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);
  //   const newErrors = {
  //     dealName: formData.dealName.trim() === "",
  //     dealValue: formData.dealValue.trim() === "",
  //     phoneNumber: formData.phoneNumber.trim() === "",
  //     companyName: formData.companyName.trim() === "",
  //   };
  //   setErrors(newErrors);
  //   if (Object.values(newErrors).some(Boolean)) {
  //     toast.error("Please fill in all required fields");
  //     setIsSubmitting(false);
  //     return;
  //   }
  //   try {
  //     const token = localStorage.getItem("token");
  //     const data = new FormData();
  //     Object.keys(formData).forEach((key) => {
  //       if (key !== "attachments") {
  //         data.append(key, formData[key]);
  //       }
  //     });
  //     formData.attachments.forEach((file) => {
  //       data.append("attachments", file);
  //     });
  //     data.append("existingAttachments", JSON.stringify(existingAttachments));
  //     let response;
  //     if (isEditMode && existingDeal) {
  //       response = await axios.patch(
  //         `${API_URL}/deals/update-deal/${existingDeal._id}`,
  //         data,
  //         {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       toast.success("Deal updated successfully");
  //     } else {
  //       response = await axios.post(`${API_URL}/deals/createManual`, data, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       toast.success("Deal created successfully");
  //     }
  //     setTimeout(() => navigate("/deals"), 2000);
  //   } catch (err) {
  //     console.error("Deal operation error:", err);
  //     if (err.response?.data?.message) {
  //       toast.error(err.response.data.message);
  //     } else {
  //       toast.error(
  //         isEditMode ? "Failed to update deal" : "Failed to create deal"
  //       );
  //     }
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };//org
const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newErrors = {
      dealName: formData.dealName.trim() === "",
      dealValue: formData.dealValue.trim() === "",
      phoneNumber: formData.phoneNumber.trim() === "",
      companyName: formData.companyName.trim() === "",
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      
      // Append all form fields except attachments
      Object.keys(formData).forEach((key) => {
        if (key !== "attachments") {
          data.append(key, formData[key]);
        }
      });
      
      // Append new files
      formData.attachments.forEach((file) => {
        data.append("attachments", file);
      });
      
      // Append existing attachments as JSON string
      data.append("existingAttachments", JSON.stringify(existingAttachments));
      
      let response;
      if (isEditMode && existingDeal) {
        response = await axios.patch(
          `${API_URL}/deals/update-deal/${existingDeal._id}`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Deal updated successfully");
      } else {
        response = await axios.post(`${API_URL}/deals/createManual`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Deal created successfully");
      }
      setTimeout(() => navigate("/deals"), 2000);
    } catch (err) {
      console.error("Deal operation error:", err);
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error(
          isEditMode ? "Failed to update deal" : "Failed to create deal"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  
  const handleBackClick = () => navigate(-1);

  // --- FIELD METADATA ---
  const formFields = [
  
    // dealValue & currency handled custom below!
    {
      name: "stage",
      label: "Stage",
      icon: <Briefcase size={16} />,
      type: "select",
      options: [
        "Qualification",
        "Proposal",
        "Negotiation",
        "Closed Won",
        "Closed Lost",
      ],
    },
    {
      name: "phoneNumber",
      label: "Phone Number",
      icon: <Phone size={16} />,
    },
    { name: "email", label: "Email", icon: <Mail size={16} /> },
    {
      name: "companyName",
      label: "Company Name",
      icon: <Building2 size={16} />,
    },
    {
      name: "industry",
      label: "Industry",
      icon: <BriefcaseBusiness size={16} />,
      type: "select",
      options: [
        "IT",
        "Finance",
        "Healthcare",
        "Education",
        "Manufacturing",
        "Retail",
        "Other",
      ],
    },
    {
      name: "source",
      label: "Source",
      icon: <Globe size={16} />,
      type: "select",
      options: [
        "Website",
        "Referral",
        "Social Media",
        "Email",
        "Phone",
        "Other",
      ],
    },
    {
      name: "address",
      label: "Address",
      icon: <MapPin size={16} />,
    },
    {
      name: "country",
      label: "Country",
      icon: <Globe size={16} />,
      type: "select",
      options: countries,
    },
  ];

  return (
    <div className="min-h-screen flex items-start justify-center py-10 px-4">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl border border-gray-100">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-5 border-b rounded-t-2xl">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackClick}
              className="p-2 rounded-lg bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              {isEditMode ? "Edit Deal" : "Create New Deal"}
            </h1>
          </div>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          {/* Deal Info */}
          <div className="space-y-6 p-6 border border-gray-200 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold border-b pb-2 text-blue-600">
              Deal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Deal Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FileText size={16} /> Deal Name{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="dealName"
                  value={formData.dealName}
                  onChange={handleChange}
                  placeholder="Enter Deal Name"
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition h-11"
                />
                {errors.dealName && (
                  <p className="text-red-500 text-sm mt-1">
                    Deal Name is required
                  </p>
                )}
              </div>
              {/* Deal Value & Currency Dropdown -- INTEGRATED DESIGN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <DollarSign size={16} /> Deal Value{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  {/* Currency Dropdown */}
                  <select
                    value={formData.currency}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        currency: e.target.value,
                      }))
                    }
                    className="w-28 border rounded-lg px-2 text-sm h-11 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  >
                    {currencyOptions.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.symbol} {c.code}
                      </option>
                    ))}
                  </select>
                  {/* Number Input */}
                  {/* <input
                    type="number"
                    name="dealValue"
                    value={formData.dealValue}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        dealValue: e.target.value,
                      }));
                      if (e.target.value.toString().trim() !== "") {
                        setErrors((prev) => ({ ...prev, dealValue: false }));
                      }
                    }}
                    placeholder="Enter deal value"
                    className="flex-1 border rounded-lg px-3 py-2 text-sm h-11 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  /> */}
                 

<input
  type="text" // change from number to text
  name="dealValue"
  value={formData.dealValue}
  onChange={(e) => {
    const val = e.target.value;
    // Validate if val is numeric or empty before allowing update (optional)
    // But keep it string to avoid rounding issues
    if (val === "" || /^[0-9\b]+$/.test(val)) {
      setFormData((prev) => ({
        ...prev,
        dealValue: val,
      }));
      if (val.trim() !== "") {
        setErrors((prev) => ({ ...prev, dealValue: false }));
      }
    }
  }}
  placeholder="Enter deal value"
  className="flex-1 border rounded-lg px-3 py-2 text-sm h-11 focus:ring-2 focus:ring-green-500 focus:outline-none"
/>

                </div>
                {errors.dealValue && (
                  <p className="text-red-500 text-sm mt-1">
                    Deal Value is required
                  </p>
                )}
              </div>
              {/* Other fields */}
              {formFields.map((field) => (
                <div
                  key={field.name}
                  className={`${
                    field.type === "textarea" ? "md:col-span-3" : ""
                  }`}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    {field.icon} {field.label}{" "}
                    {(field.name === "dealName" ||
                      field.name === "dealValue" ||
                      field.name === "phoneNumber" ||
                      field.name === "companyName") && (
                      <span className="text-red-500">*</span>
                    )}
                  </label>
                  {field.type === "select" ? (
                    <select
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition h-11"
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map((opt) =>
                        typeof opt === "string" ? (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ) : (
                          <option key={opt.value || opt} value={opt.value || opt}>
                            {opt.label || opt}
                          </option>
                        )
                      )}
                    </select>
                  ) : (
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      placeholder={`Enter ${field.label}`}
                      className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition h-11"
                    />
                  )}
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-1">
                      {field.label} is required
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Management & Notes */}
          {userRole === "Admin" && (
            <div className="p-6 border border-gray-200 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold border-b pb-2 text-yellow-600">
                Management
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <UserCheck size={16} /> Assign To
                  </label>
                  <select
                    name="assignTo"
                    value={formData.assignTo}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition h-11"
                  >
                    <option value="">Select User</option>
                    {salesUsers.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.firstName} {u.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <StickyNote size={16} /> Notes
            </label>
            <textarea
              name="notes"
              rows={4}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Enter Notes..."
              className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white shadow-sm text-sm text-gray-700 placeholder-gray-400 transition resize-none"
            />
          </div>
          {/* Attachments Section */}
          <div className="p-6 border rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Attachments
            </h2>
            {/* Existing Files */}
            {existingAttachments.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {existingAttachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center w-full bg-white border rounded-xl shadow-sm p-3"
                  >
                    <button
                      onClick={() => handleFileDownload(file)}
                      className="text-xs text-indigo-600 hover:underline truncate w-full text-center"
                    >
                      {file.split("/").pop()}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(idx, "existing")}
                      className="text-[12px] text-red-600 hover:underline mt-1"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
            {/* Upload New Files */}
            <div className="mt-4">
              <label
                htmlFor="attachments"
                className="flex flex-col items-center justify-center w-full min-h-32 border-2 border-dashed border-indigo-300 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition p-6"
              >
                {formData.attachments.length === 0 ? (
                  <>
                    <svg
                      className="w-8 h-8 text-gray-400 mb-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 16V8m0 0l-4 4m4-4l4 4M17 8v8m0 0l4-4m-4 4l-4-4"
                      />
                    </svg>
                    <span className="text-sm text-gray-600">
                      Click or drag new files here (Max 5MB per file)
                    </span>
                  </>
                ) : (
                  <div className="w-full flex flex-wrap gap-4">
                    {formData.attachments.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col items-center justify-center w-28 h-28 bg-white border rounded-xl shadow-sm p-2"
                      >
                        <div className="w-12 h-12 flex items-center justify-center bg-indigo-100 rounded-md mb-1">
                          <span className="text-xs font-semibold text-indigo-600">
                            {file.name.split(".").pop().toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                        <p className="text-[10px] text-gray-700 truncate w-full text-center">
                          {file.name}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(idx, "new")}
                          className="text-[12px] text-red-600 hover:underline mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <input
                  id="attachments"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={handleBackClick}
              className="px-6 py-2 rounded-lg border bg-white hover:bg-gray-100 text-gray-700 transition"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md transition disabled:bg-blue-400 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update Deal"
                : "Save Deal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}//all perfect
