
// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import axios from "axios";
// import { getNames } from "country-list";
// import {
//   User, Phone, Mail, MapPin, FileText, Globe, Building2,
//   Briefcase, UserCheck, Calendar, StickyNote, ArrowLeft, Upload, X,
// } from "lucide-react";
// import "react-toastify/dist/ReactToastify.css";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";

// export default function CreateLeads() {
//   const API_URL = import.meta.env.VITE_API_URL;

//   const navigate    = useNavigate();
//   const location    = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const leadId      = queryParams.get("id");

//   const [userRole,     setUserRole]     = useState("");
//   const [userId,       setUserId]       = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [fieldErrors,  setFieldErrors]  = useState({});

//   const sourceOptions = [
//     "Website", "Referral", "Social Media", "Email", "Phone",
//     "Just Dial", "Sulekha", "Trip Magic", "Hello Travel", "Other",
//   ];

//   const [formData, setFormData] = useState({
//     leadName:     "",
//     phoneNumber:  "",
//     email:        "",
//     source:       "",
//     destination:  "",
//     duration:     "",
//     requirement:  "",
//     status:       "Cold",
//     assignTo:     "",
//     address:      "",
//     country:      "",
//     followUpDate: "",
//     notes:        "",
//     attachments:  [],
//   });

//   const [customSource,        setCustomSource]        = useState("");
//   const [errors,              setErrors]              = useState({});
//   const [salesUsers,          setSalesUsers]          = useState([]);
//   const [countries]                                   = useState(getNames());
//   const [existingAttachments, setExistingAttachments] = useState([]);
//   const [isLoading,           setIsLoading]           = useState(false);
//   const [isDragging,          setIsDragging]          = useState(false);

//   // ✅ NEW: store full country metadata from PhoneInput
//   //    react-phone-input-2 passes: { dialCode, countryCode, name, ... }
//   const [phoneCountryData, setPhoneCountryData] = useState({
//     countryCode: "in",
//     dialCode:    "91",
//     name:        "India",
//   });

//   useEffect(() => {
//     const userData = localStorage.getItem("user");
//     if (userData) {
//       const user = JSON.parse(userData);
//       setUserRole(user.role?.name || "");
//       setUserId(user._id || "");
//     }
//   }, []);

//   useEffect(() => {
//     const fetchSalesUsers = async () => {
//       try {
//         const token    = localStorage.getItem("token");
//         const userData = localStorage.getItem("user");
//         const user     = userData ? JSON.parse(userData) : null;

//         if (user && user.role?.name === "Admin") {
//           const response = await axios.get(`${API_URL}/users/sales`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           const salesData =
//             response.data.salesUsers || response.data.users || response.data;
//           setSalesUsers(Array.isArray(salesData) ? salesData : []);
//         }
//       } catch (error) {
//         console.error("Error fetching sales users:", error);
//       }
//     };
//     fetchSalesUsers();
//   }, [API_URL]);

//   useEffect(() => {
//     if (leadId) {
//       const fetchLead = async () => {
//         try {
//           setIsLoading(true);
//           const token    = localStorage.getItem("token");
//           const response = await axios.get(`${API_URL}/leads/getLead/${leadId}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });

//           const leadData = response.data;

//           const predefined      = sourceOptions.filter((opt) => opt !== "Other");
//           const isCustomSource  = leadData.source && !predefined.includes(leadData.source);
//           let sourceValue       = leadData.source || "";
//           let customSourceValue = "";

//           if (isCustomSource) {
//             sourceValue       = "Other";
//             customSourceValue = leadData.source;
//           }

//           setCustomSource(customSourceValue);
//           setExistingAttachments(leadData.attachments || []);
//           setFormData({
//             leadName:    leadData.leadName    || "",
//             destination: leadData.destination || "",
//             phoneNumber: leadData.phoneNumber || "",
//             email:       leadData.email       || "",
//             source:      sourceValue,
//             duration:    leadData.duration    || "",
//             requirement: leadData.requirement || "",
//             status:      leadData.status      || "Cold",
//             assignTo:    leadData.assignTo?._id || "",
//             address:     leadData.address     || "",
//             country:     leadData.country     || "",
//             followUpDate: leadData.followUpDate
//               ? new Date(leadData.followUpDate).toISOString().split("T")[0]
//               : "",
//             notes:       leadData.notes || "",
//             attachments: [],
//           });
//         } catch (error) {
//           console.error("Error fetching lead:", error);
//           toast.error("Failed to fetch lead data");
//         } finally {
//           setIsLoading(false);
//         }
//       };
//       fetchLead();
//     }
//   }, [leadId, API_URL]);

//   const getSalesUsersOptions = () =>
//     salesUsers.map((u) => ({
//       label: `${u.firstName} ${u.lastName}`,
//       value: u._id,
//     }));

//   const validateEmailDomain = (email) => {
//     if (!email) return false;
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) return false;
//     const domain = email.split("@")[1];
//     if (!domain) return false;
//     const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
//     return domainRegex.test(domain);
//   };

//   // ─────────────────────────────────────────────────────────────────────────
//   // ✅ FIXED: International phone number validation
//   //
//   // ROOT CAUSE OF THE BUG (shown in screenshot):
//   //   Old code only checked for Indian numbers (10 digits starting 6-9)
//   //   and a few hardcoded countries. For El Salvador (+504), UAE, or ANY
//   //   other country it returned false with "8-15 digits" message.
//   //
//   // HOW IT WORKS NOW:
//   //   - PhoneInput gives us the full number WITH dial code e.g. "50412345678"
//   //   - We strip the dial code ("504") → national number = "12345678"
//   //   - India → strict: must be exactly 10 digits starting with 6-9
//   //   - All other countries → ITU-T E.164: national number must be 4-15 digits
//   //   - Returns { valid: boolean, message: string } for precise error display
//   // ─────────────────────────────────────────────────────────────────────────
//   const validatePhoneNumber = (fullNumber, countryData) => {
//     if (!fullNumber) {
//       return { valid: false, message: "Phone number is required" };
//     }

//     const digitsOnly = String(fullNumber).replace(/\D/g, "");
//     const dialCode   = String(countryData?.dialCode || "").replace(/\D/g, "");

//     // Strip dial code prefix to get national number
//     let nationalNumber = digitsOnly;
//     if (dialCode && digitsOnly.startsWith(dialCode)) {
//       nationalNumber = digitsOnly.slice(dialCode.length);
//     }

//     // Strip leading zeros (some countries use 0 as trunk prefix)
//     const nationalDigits = nationalNumber.replace(/^0+/, "") || nationalNumber;

//     // ── India: strict 10-digit validation ───────────────────────────────
//     if (countryData?.countryCode === "in") {
//       if (nationalDigits.length !== 10) {
//         return {
//           valid:   false,
//           message: "Indian phone number must be exactly 10 digits",
//         };
//       }
//       if (!/^[6-9]/.test(nationalDigits)) {
//         return {
//           valid:   false,
//           message: "Indian phone number must start with 6, 7, 8, or 9",
//         };
//       }
//       return { valid: true, message: "" };
//     }

//     // ── All other countries: ITU-T E.164 international standard ─────────
//     // Total E.164 max = 15 digits (including country code)
//     // National subscriber numbers are typically 4–12 digits
//     // We use 4–15 to cover all edge cases globally
//     if (nationalDigits.length < 4) {
//       return {
//         valid:   false,
//         message: `Phone number too short for ${countryData?.name || "this country"} (min 4 digits)`,
//       };
//     }
//     if (nationalDigits.length > 15) {
//       return {
//         valid:   false,
//         message: "Phone number too long (max 15 digits)",
//       };
//     }

//     return { valid: true, message: "" };
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((p) => ({ ...p, [name]: value }));
//     if (errors[name])      setErrors((p)      => ({ ...p, [name]: false }));
//     if (fieldErrors[name]) setFieldErrors((p) => ({ ...p, [name]: "" }));
//     if (name === "source" && value !== "Other") setCustomSource("");
//   };

//   // ✅ FIXED: capture full countryData (dialCode + countryCode + name)
//   //    Old code only captured countryCode, losing dialCode needed to strip prefix
//   const handlePhoneChange = (phone, countryData) => {
//     setFormData((p) => ({ ...p, phoneNumber: phone }));
//     setPhoneCountryData(countryData); // store full metadata
//     if (errors.phoneNumber)      setErrors((p)      => ({ ...p, phoneNumber: false }));
//     if (fieldErrors.phoneNumber) setFieldErrors((p) => ({ ...p, phoneNumber: "" }));
//   };

//   const handleDragOver  = (e) => { e.preventDefault(); setIsDragging(true);  };
//   const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
//   const handleDrop      = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//     processFiles(Array.from(e.dataTransfer.files));
//   };

//   const processFiles = (files) => {
//     const totalFiles =
//       formData.attachments.length + files.length + existingAttachments.length;
//     if (totalFiles > 5) { toast.error("Maximum 5 attachments allowed"); return; }
//     const oversized = files.filter((f) => f.size > 20 * 1024 * 1024);
//     if (oversized.length > 0) { toast.error("Some files exceed the 20MB size limit"); return; }
//     setFormData((p) => ({ ...p, attachments: [...p.attachments, ...files] }));
//   };

//   const handleFileChange = (e) => processFiles(Array.from(e.target.files));

//   const handleRemoveFile = (idx, type = "new") => {
//     if (type === "new")
//       setFormData((prev) => ({
//         ...prev,
//         attachments: prev.attachments.filter((_, i) => i !== idx),
//       }));
//     else
//       setExistingAttachments((prev) => prev.filter((_, i) => i !== idx));
//   };

//   const validateForm = () => {
//     const newErrors      = {};
//     const newFieldErrors = {};

//     if (!formData.leadName.trim()) {
//       newErrors.leadName      = true;
//       newFieldErrors.leadName = "Lead name is required";
//     }

//     if (!formData.destination.trim()) {
//       newErrors.destination      = true;
//       newFieldErrors.destination = "Destination is required";
//     }

//     if (!formData.phoneNumber) {
//       newErrors.phoneNumber      = true;
//       newFieldErrors.phoneNumber = "Phone number is required";
//     } else {
//       // ✅ FIXED: use international validator with full countryData
//       const { valid, message } = validatePhoneNumber(
//         formData.phoneNumber,
//         phoneCountryData
//       );
//       if (!valid) {
//         newErrors.phoneNumber      = true;
//         newFieldErrors.phoneNumber = message;
//       }
//     }

//     if (formData.email.trim() && !validateEmailDomain(formData.email)) {
//       newErrors.email      = true;
//       newFieldErrors.email =
//         "Please enter a valid email address with a proper domain (e.g., name@company.com)";
//     }

//     setErrors(newErrors);
//     setFieldErrors(newFieldErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setFieldErrors({});

//     let finalSource = formData.source;
//     if (formData.source === "Other") {
//       if (!customSource.trim()) {
//         setFieldErrors({ source: "Please enter a custom source" });
//         setErrors({ source: true });
//         toast.error("Please enter a custom source");
//         return;
//       }
//       finalSource = customSource.trim();
//     }

//     const dataToSendForm = { ...formData, source: finalSource };

//     if (!validateForm()) {
//       toast.error("Please fix the errors in the form");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const token       = localStorage.getItem("token");
//       const formDataObj = new FormData();

//       for (let key in dataToSendForm) {
//         if (key === "attachments") {
//           dataToSendForm.attachments.forEach((file) =>
//             formDataObj.append("attachments", file)
//           );
//         } else if (key === "assignTo") {
//           if (dataToSendForm.assignTo)
//             formDataObj.append(key, dataToSendForm.assignTo);
//         } else if (key === "followUpDate") {
//           const dateVal = dataToSendForm.followUpDate;
//           if (dateVal && dateVal.trim() !== "") {
//             formDataObj.append("followUpDate", dateVal);
//           } else {
//             formDataObj.append("followUpDate", "null");
//           }
//         } else {
//           formDataObj.append(key, dataToSendForm[key]);
//         }
//       }

//       formDataObj.append(
//         "existingAttachments",
//         JSON.stringify(existingAttachments)
//       );

//       const config = {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization:  `Bearer ${token}`,
//         },
//         onUploadProgress: (progressEvent) => {
//           const progress = Math.round(
//             (progressEvent.loaded * 100) / progressEvent.total
//           );
//           console.log(`Upload progress: ${progress}%`);
//         },
//       };

//       if (leadId) {
//         await axios.put(
//           `${API_URL}/leads/updateLead/${leadId}`,
//           formDataObj,
//           config
//         );
//         toast.success("Lead updated successfully");
//       } else {
//         await axios.post(`${API_URL}/leads/create`, formDataObj, config);
//         toast.success("Lead created successfully");
//       }

//       setTimeout(() => navigate("/leads"), 1200);
//     } catch (err) {
//       console.error("Error submitting form:", err);
//       if (err.response?.data?.message) {
//         const errorMsg = err.response.data.message.toLowerCase();
//         if (errorMsg.includes("email") && errorMsg.includes("already")) {
//           setFieldErrors({ email: "This email is already associated with another lead" });
//           setErrors({ email: true });
//           toast.error("Email already exists");
//         } else if (errorMsg.includes("phone") && errorMsg.includes("already")) {
//           setFieldErrors({ phoneNumber: "This phone number is already associated with another lead" });
//           setErrors({ phoneNumber: true });
//           toast.error("Phone number already exists");
//         } else if (errorMsg.includes("name") && errorMsg.includes("already")) {
//           setFieldErrors({ leadName: "This lead name already exists" });
//           setErrors({ leadName: true });
//           toast.error("Lead name already exists");
//         } else if (
//           (errorMsg.includes("file") && errorMsg.includes("large")) ||
//           errorMsg.includes("size")
//         ) {
//           toast.error("File size exceeds the 20MB limit");
//         } else if (err.response.data.errors) {
//           const backendErrors  = err.response.data.errors;
//           const newFieldErrors = {};
//           Object.keys(backendErrors).forEach((key) => {
//             newFieldErrors[key] = backendErrors[key].message || backendErrors[key];
//             setErrors((prev) => ({ ...prev, [key]: true }));
//           });
//           setFieldErrors(newFieldErrors);
//           toast.error("Please check the form for errors");
//         } else {
//           toast.error(
//             err.response.data.message ||
//               (leadId ? "Failed to update lead" : "Failed to create lead")
//           );
//         }
//       } else if (err.message?.includes("Network Error")) {
//         toast.error("Network error. Please check your connection.");
//       } else {
//         toast.error("An unexpected error occurred");
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleBackClick = () => navigate(-1);

//   const fieldGroups = [
//     {
//       title:  "Basic Information",
//       color:  "text-blue-600",
//       fields: [
//         { name: "leadName",    label: "Lead Name",    icon: <User      size={16} /> },
//         { name: "destination", label: "Destination",  icon: <Building2 size={16} /> },
//         { name: "phoneNumber", label: "Phone Number", icon: <Phone     size={16} /> },
//         { name: "email",       label: "Email",        icon: <Mail      size={16} /> },
//         { name: "address",     label: "Address",      icon: <MapPin    size={16} /> },
//         {
//           name: "country", label: "Country", icon: <Globe size={16} />,
//           type: "select",  options: countries,
//         },
//       ],
//     },
//     {
//       title:  "Business Details",
//       color:  "text-green-600",
//       fields: [
//         {
//           name: "duration", label: "Duration", icon: <Briefcase size={16} />,
//           type: "text", placeholder: "e.g., 3 months, 1 year, etc.",
//         },
//         { name: "source",      label: "Source",      icon: <Globe    size={16} /> },
//         { name: "requirement", label: "Requirement", icon: <FileText size={16} /> },
//       ],
//     },
//     {
//       title:  "Lead Management",
//       color:  "text-yellow-600",
//       fields: [
//         {
//           name: "status", label: "Status", icon: <UserCheck size={16} />,
//           type: "select", options: ["Hot", "Warm", "Cold", "Junk"],
//         },
//         {
//           name: "assignTo", label: "Assign To", icon: <User size={16} />,
//           type: "select",   options: getSalesUsersOptions(),
//         },
//         {
//           name: "followUpDate", label: "Follow-up Date",
//           icon: <Calendar size={16} />, type: "date",
//         },
//       ],
//     },
//     {
//       title:  "Additional Information",
//       color:  "text-purple-600",
//       fields: [
//         {
//           name: "notes", label: "Notes",
//           icon: <StickyNote size={16} />, type: "textarea",
//         },
//       ],
//     },
//   ];

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-lg">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="min-h-screen flex items-start justify-center py-10 px-4">
//         <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl border border-gray-100">

//           {/* Header */}
//           <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-5 border-b rounded-t-2xl">
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={handleBackClick}
//                 className="p-2 rounded-lg bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition"
//               >
//                 <ArrowLeft size={20} />
//               </button>
//               <h1 className="text-2xl font-bold text-gray-800">
//                 {leadId ? "Edit Lead" : "Create New Lead"}
//               </h1>
//             </div>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="p-8 space-y-10">
//             {fieldGroups.map((group) => (
//               <div
//                 key={group.title}
//                 className="space-y-6 p-6 border border-gray-200 rounded-xl shadow-sm"
//               >
//                 <h2 className={`text-lg font-semibold border-b pb-2 ${group.color}`}>
//                   {group.title}
//                 </h2>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   {group.fields.map((field) => (
//                     <div
//                       key={field.name}
//                       className={`${field.type === "textarea" ? "md:col-span-3" : ""}`}
//                     >
//                       <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                         {field.icon} {field.label}
//                         {(field.name === "leadName" ||
//                           field.name === "destination" ||
//                           field.name === "phoneNumber") && (
//                           <span className="text-red-500">*</span>
//                         )}
//                       </label>

//                       {/* ── Phone ── */}
//                       {field.name === "phoneNumber" ? (
//                         <div>
//                           <div
//                             className={`border rounded-lg ${
//                               errors.phoneNumber ? "border-red-500" : "border-gray-300"
//                             }`}
//                           >
//                             {/*
//                               ✅ FIXED PhoneInput props:
//                               - enableSearch: user can search any country
//                               - countryCodeEditable={false}: prevents manual
//                                 dial code edits that would break validation
//                               - onChange now passes full countryData object
//                                 with dialCode so we can strip it in validation
//                             */}
//                             <PhoneInput
//                               country={"in"}
//                               value={formData.phoneNumber}
//                               onChange={handlePhoneChange}
//                               enableSearch
//                               countryCodeEditable={false}
//                               specialLabel=""
//                               inputStyle={{
//                                 width: "100%", height: "42px", fontSize: "14px",
//                                 paddingLeft: "55px", borderRadius: "0.5rem",
//                                 boxSizing: "border-box", border: "none",
//                               }}
//                               buttonStyle={{
//                                 borderRadius: "0.5rem 0 0 0.5rem", height: "42px",
//                                 background: "white", border: "none",
//                                 borderRight: "1px solid #e5e7eb",
//                               }}
//                               containerStyle={{ width: "100%" }}
//                               dropdownStyle={{ borderRadius: "0.5rem" }}
//                             />
//                           </div>

//                           {/* ✅ Precise error message from validator */}
//                           {fieldErrors.phoneNumber && (
//                             <p className="text-sm text-red-500 mt-1">
//                               {fieldErrors.phoneNumber}
//                             </p>
//                           )}

//                           {/* ✅ Country-specific hint when no error */}
//                           {!fieldErrors.phoneNumber && formData.phoneNumber && (
//                             <p className="text-xs text-gray-400 mt-1">
//                               {phoneCountryData?.countryCode === "in"
//                                 ? "India: 10 digits starting with 6–9"
//                                 : `${phoneCountryData?.name || "International"}: enter national number`}
//                             </p>
//                           )}
//                         </div>

//                       ) : field.name === "source" ? (
//                         /* ── Source ── */
//                         <div>
//                           <select
//                             name="source"
//                             value={formData.source || ""}
//                             onChange={handleChange}
//                             className={`w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none transition h-11 ${
//                               errors.source ? "border-red-500" : "border-gray-300"
//                             }`}
//                           >
//                             <option value="">Select Source</option>
//                             {sourceOptions.map((opt) => (
//                               <option key={opt} value={opt}>{opt}</option>
//                             ))}
//                           </select>

//                           {formData.source === "Other" && (
//                             <div className="mt-2">
//                               <input
//                                 type="text"
//                                 placeholder="Enter custom source"
//                                 value={customSource}
//                                 onChange={(e) => setCustomSource(e.target.value)}
//                                 className={`w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none transition h-11 ${
//                                   errors.source ? "border-red-500" : "border-gray-300"
//                                 }`}
//                               />
//                             </div>
//                           )}
//                           {fieldErrors.source && (
//                             <p className="text-sm text-red-500 mt-1">{fieldErrors.source}</p>
//                           )}
//                         </div>

//                       ) : field.type === "select" ? (
//                         /* ── Select ── */
//                         <div>
//                           <select
//                             name={field.name}
//                             value={formData[field.name] || ""}
//                             onChange={handleChange}
//                             className={`w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none transition h-11 ${
//                               errors[field.name] ? "border-red-500" : "border-gray-300"
//                             }`}
//                           >
//                             <option value="">Select {field.label}</option>
//                             {field.options.map((opt) =>
//                               typeof opt === "string" ? (
//                                 <option key={opt} value={opt}>{opt}</option>
//                               ) : (
//                                 <option key={opt.value} value={opt.value}>
//                                   {opt.label}
//                                 </option>
//                               )
//                             )}
//                           </select>
//                           {fieldErrors[field.name] && (
//                             <p className="text-sm text-red-500 mt-1">
//                               {fieldErrors[field.name]}
//                             </p>
//                           )}
//                         </div>

//                       ) : field.type === "textarea" ? (
//                         /* ── Textarea ── */
//                         <div>
//                           <textarea
//                             name={field.name}
//                             rows={5}
//                             value={formData[field.name] || ""}
//                             onChange={handleChange}
//                             placeholder={`Enter ${field.label}...`}
//                             className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white shadow-sm text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 placeholder-gray-400 transition resize-none"
//                             maxLength={500}
//                           />
//                           {fieldErrors[field.name] && (
//                             <p className="text-sm text-red-500 mt-1">
//                               {fieldErrors[field.name]}
//                             </p>
//                           )}
//                         </div>

//                       ) : (
//                         /* ── Text / Date ── */
//                         <div>
//                           <input
//                             type={field.type || "text"}
//                             name={field.name}
//                             value={formData[field.name] || ""}
//                             onChange={handleChange}
//                             placeholder={field.placeholder || `Enter ${field.label}`}
//                             className={`w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none transition h-11 ${
//                               errors[field.name] ? "border-red-500" : "border-gray-300"
//                             }`}
//                           />
//                           {fieldErrors[field.name] && (
//                             <p className="text-sm text-red-500 mt-1">
//                               {fieldErrors[field.name]}
//                             </p>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}

//             {/* Attachments Section */}
//             <div className="space-y-6 p-6 border border-gray-200 rounded-xl shadow-sm">
//               <h2 className="text-lg font-semibold border-b pb-2 text-indigo-600 flex items-center gap-2">
//                 <Upload size={20} /> Attachments
//               </h2>

//               <div className="space-y-4">
//                 <div
//                   className={`flex flex-col items-center justify-center w-full min-h-32 border-2 border-dashed rounded-xl cursor-pointer transition p-6 ${
//                     isDragging
//                       ? "border-indigo-500 bg-indigo-50"
//                       : "border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50"
//                   }`}
//                   onDragOver={handleDragOver}
//                   onDragLeave={handleDragLeave}
//                   onDrop={handleDrop}
//                   onClick={() => document.getElementById("attachments").click()}
//                 >
//                   <div className="w-full flex flex-wrap gap-4">
//                     {existingAttachments.map((file, idx) => (
//                       <div
//                         key={`existing-${idx}`}
//                         className="flex flex-col items-center justify-center w-28 h-28 bg-white border rounded-xl shadow-sm p-2 relative group"
//                       >
//                         <button
//                           type="button"
//                           onClick={(e) => { e.stopPropagation(); handleRemoveFile(idx, "existing"); }}
//                           className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                         >
//                           <X size={12} />
//                         </button>
//                         <div className="w-12 h-12 flex items-center justify-center bg-indigo-100 rounded-md mb-1">
//                           <span className="text-xs font-semibold text-indigo-600">
//                             {file.name.split(".").pop().toUpperCase()}
//                           </span>
//                         </div>
//                         <p className="text-xs text-gray-500 truncate w-full text-center">
//                           {file.name}
//                         </p>
//                         <button
//                           type="button"
//                           onClick={(e) => { e.stopPropagation(); handleRemoveFile(idx, "existing"); }}
//                           className="text-[12px] text-red-600 hover:underline mt-1"
//                         >
//                           Remove
//                         </button>
//                       </div>
//                     ))}

//                     {formData.attachments.map((file, idx) => (
//                       <div
//                         key={`new-${idx}`}
//                         className="flex flex-col items-center justify-center w-28 h-28 bg-white border rounded-xl shadow-sm p-2 relative group"
//                       >
//                         <button
//                           type="button"
//                           onClick={(e) => { e.stopPropagation(); handleRemoveFile(idx, "new"); }}
//                           className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                         >
//                           <X size={12} />
//                         </button>
//                         <div className="w-12 h-12 flex items-center justify-center bg-indigo-100 rounded-md mb-1">
//                           <span className="text-xs font-semibold text-indigo-600">
//                             {file.name.split(".").pop().toUpperCase()}
//                           </span>
//                         </div>
//                         <p className="text-xs text-gray-500">
//                           {(file.size / 1024 / 1024).toFixed(2)} MB
//                         </p>
//                         <p className="text-[10px] text-gray-700 truncate w-full text-center">
//                           {file.name}
//                         </p>
//                         <button
//                           type="button"
//                           onClick={(e) => { e.stopPropagation(); handleRemoveFile(idx, "new"); }}
//                           className="text-[12px] text-red-600 hover:underline mt-1"
//                         >
//                           Remove
//                         </button>
//                       </div>
//                     ))}

//                     {existingAttachments.length === 0 &&
//                       formData.attachments.length === 0 && (
//                         <div className="flex flex-col items-center justify-center text-center">
//                           <Upload size={48} className="text-indigo-300 mb-2" />
//                           <p className="text-sm text-gray-600">
//                             Drag & drop files here or click to browse
//                           </p>
//                           <p className="text-xs text-gray-500 mt-1">
//                             Max 5 files, 20MB Limit
//                           </p>
//                         </div>
//                       )}
//                   </div>

//                   <input
//                     id="attachments"
//                     type="file"
//                     multiple
//                     onChange={handleFileChange}
//                     className="hidden"
//                     disabled={
//                       formData.attachments.length + existingAttachments.length >= 5
//                     }
//                   />
//                 </div>

//                 <div className="text-sm text-gray-600 flex flex-wrap gap-4 items-center">
//                   <div>
//                     <span
//                       className={`font-medium ${
//                         formData.attachments.length + existingAttachments.length >= 5
//                           ? "text-red-500"
//                           : "text-gray-600"
//                       }`}
//                     >
//                       Files: {formData.attachments.length + existingAttachments.length}/5
//                     </span>
//                   </div>
//                   <div><span className="font-medium">Max size:</span> 20MB</div>
//                   <div>
//                     <span className="font-medium">Supported types:</span> All file types
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Buttons */}
//             <div className="flex justify-end gap-4 pt-6 border-t">
//               <button
//                 type="button"
//                 onClick={handleBackClick}
//                 className="px-6 py-2 rounded-lg border bg-white hover:bg-gray-100 text-gray-700 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isSubmitting
//                   ? "Processing..."
//                   : leadId
//                   ? "Update Lead"
//                   : "Save Lead"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>

//       <ToastContainer position="top-right" autoClose={3000} theme="light" />
//     </>
//   );
// }//all work correctly...



import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { getNames } from "country-list";
import {
  User, Phone, Mail, MapPin, FileText, Globe, Building2,
  Briefcase, UserCheck, Calendar, StickyNote, ArrowLeft, Upload, X,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function CreateLeads() {
  const API_URL = import.meta.env.VITE_API_URL;

  const navigate    = useNavigate();
  const location    = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const leadId      = queryParams.get("id");

  const [userRole,     setUserRole]     = useState("");
  const [userId,       setUserId]       = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors,  setFieldErrors]  = useState({});

  const sourceOptions = [
    "Website", "Referral", "Social Media", "Email", "Phone",
    "Just Dial", "Sulekha", "Trip Magic", "Hello Travel", "Other",
  ];

  const [formData, setFormData] = useState({
    leadName:     "",
    phoneNumber:  "",
    email:        "",
    source:       "",
    destination:  "",
    duration:     "",
    requirement:  "",
    status:       "Cold",
    assignTo:     "",
    address:      "",
    country:      "",
    followUpDate: "",
    notes:        "",
    attachments:  [],
  });

  const [customSource,        setCustomSource]        = useState("");
  const [errors,              setErrors]              = useState({});
  const [salesUsers,          setSalesUsers]          = useState([]);
  const [countries]                                   = useState(getNames());
  const [existingAttachments, setExistingAttachments] = useState([]);
  const [isLoading,           setIsLoading]           = useState(false);
  const [isDragging,          setIsDragging]          = useState(false);

  const [phoneCountryData, setPhoneCountryData] = useState({
    countryCode: "in",
    dialCode:    "91",
    name:        "India",
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserRole(user.role?.name || "");
      setUserId(user._id || "");
    }
  }, []);

  useEffect(() => {
    const fetchSalesUsers = async () => {
      try {
        const token    = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        const user     = userData ? JSON.parse(userData) : null;

        if (user && user.role?.name === "Admin") {
          const response = await axios.get(`${API_URL}/users/sales`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const salesData =
            response.data.salesUsers || response.data.users || response.data;
          setSalesUsers(Array.isArray(salesData) ? salesData : []);
        }
      } catch (error) {
        console.error("Error fetching sales users:", error);
      }
    };
    fetchSalesUsers();
  }, [API_URL]);

  useEffect(() => {
    if (leadId) {
      const fetchLead = async () => {
        try {
          setIsLoading(true);
          const token    = localStorage.getItem("token");
          const response = await axios.get(`${API_URL}/leads/getLead/${leadId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const leadData = response.data;

          const predefined      = sourceOptions.filter((opt) => opt !== "Other");
          const isCustomSource  = leadData.source && !predefined.includes(leadData.source);
          let sourceValue       = leadData.source || "";
          let customSourceValue = "";

          if (isCustomSource) {
            sourceValue       = "Other";
            customSourceValue = leadData.source;
          }

          setCustomSource(customSourceValue);
          setExistingAttachments(leadData.attachments || []);
          setFormData({
            leadName:    leadData.leadName    || "",
            destination: leadData.destination || "",
            phoneNumber: leadData.phoneNumber || "",
            email:       leadData.email       || "",
            source:      sourceValue,
            duration:    leadData.duration    || "",
            requirement: leadData.requirement || "",
            status:      leadData.status      || "Cold",
            assignTo:    leadData.assignTo?._id || "",
            address:     leadData.address     || "",
            country:     leadData.country     || "",
            followUpDate: leadData.followUpDate
              ? new Date(leadData.followUpDate).toISOString().split("T")[0]
              : "",
            // ✅ FIXED: notes loaded correctly in edit mode (no truncation)
            notes:       leadData.notes || "",
            attachments: [],
          });
        } catch (error) {
          console.error("Error fetching lead:", error);
          toast.error("Failed to fetch lead data");
        } finally {
          setIsLoading(false);
        }
      };
      fetchLead();
    }
  }, [leadId, API_URL]);

  const getSalesUsersOptions = () =>
    salesUsers.map((u) => ({
      label: `${u.firstName} ${u.lastName}`,
      value: u._id,
    }));

  const validateEmailDomain = (email) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;
    const domain = email.split("@")[1];
    if (!domain) return false;
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  };

  const validatePhoneNumber = (fullNumber, countryData) => {
    if (!fullNumber) {
      return { valid: false, message: "Phone number is required" };
    }

    const digitsOnly = String(fullNumber).replace(/\D/g, "");
    const dialCode   = String(countryData?.dialCode || "").replace(/\D/g, "");

    let nationalNumber = digitsOnly;
    if (dialCode && digitsOnly.startsWith(dialCode)) {
      nationalNumber = digitsOnly.slice(dialCode.length);
    }

    const nationalDigits = nationalNumber.replace(/^0+/, "") || nationalNumber;

    if (countryData?.countryCode === "in") {
      if (nationalDigits.length !== 10) {
        return {
          valid:   false,
          message: "Indian phone number must be exactly 10 digits",
        };
      }
      if (!/^[6-9]/.test(nationalDigits)) {
        return {
          valid:   false,
          message: "Indian phone number must start with 6, 7, 8, or 9",
        };
      }
      return { valid: true, message: "" };
    }

    if (nationalDigits.length < 4) {
      return {
        valid:   false,
        message: `Phone number too short for ${countryData?.name || "this country"} (min 4 digits)`,
      };
    }
    if (nationalDigits.length > 15) {
      return {
        valid:   false,
        message: "Phone number too long (max 15 digits)",
      };
    }

    return { valid: true, message: "" };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name])      setErrors((p)      => ({ ...p, [name]: false }));
    if (fieldErrors[name]) setFieldErrors((p) => ({ ...p, [name]: "" }));
    if (name === "source" && value !== "Other") setCustomSource("");
  };

  const handlePhoneChange = (phone, countryData) => {
    setFormData((p) => ({ ...p, phoneNumber: phone }));
    setPhoneCountryData(countryData);
    if (errors.phoneNumber)      setErrors((p)      => ({ ...p, phoneNumber: false }));
    if (fieldErrors.phoneNumber) setFieldErrors((p) => ({ ...p, phoneNumber: "" }));
  };

  const handleDragOver  = (e) => { e.preventDefault(); setIsDragging(true);  };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop      = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(Array.from(e.dataTransfer.files));
  };

  const processFiles = (files) => {
    const totalFiles =
      formData.attachments.length + files.length + existingAttachments.length;
    if (totalFiles > 5) { toast.error("Maximum 5 attachments allowed"); return; }
    const oversized = files.filter((f) => f.size > 20 * 1024 * 1024);
    if (oversized.length > 0) { toast.error("Some files exceed the 20MB size limit"); return; }
    setFormData((p) => ({ ...p, attachments: [...p.attachments, ...files] }));
  };

  const handleFileChange = (e) => processFiles(Array.from(e.target.files));

  const handleRemoveFile = (idx, type = "new") => {
    if (type === "new")
      setFormData((prev) => ({
        ...prev,
        attachments: prev.attachments.filter((_, i) => i !== idx),
      }));
    else
      setExistingAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  const validateForm = () => {
    const newErrors      = {};
    const newFieldErrors = {};

    if (!formData.leadName.trim()) {
      newErrors.leadName      = true;
      newFieldErrors.leadName = "Lead name is required";
    }

    if (!formData.destination.trim()) {
      newErrors.destination      = true;
      newFieldErrors.destination = "Destination is required";
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber      = true;
      newFieldErrors.phoneNumber = "Phone number is required";
    } else {
      const { valid, message } = validatePhoneNumber(
        formData.phoneNumber,
        phoneCountryData
      );
      if (!valid) {
        newErrors.phoneNumber      = true;
        newFieldErrors.phoneNumber = message;
      }
    }

    if (formData.email.trim() && !validateEmailDomain(formData.email)) {
      newErrors.email      = true;
      newFieldErrors.email =
        "Please enter a valid email address with a proper domain (e.g., name@company.com)";
    }

    setErrors(newErrors);
    setFieldErrors(newFieldErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    let finalSource = formData.source;
    if (formData.source === "Other") {
      if (!customSource.trim()) {
        setFieldErrors({ source: "Please enter a custom source" });
        setErrors({ source: true });
        toast.error("Please enter a custom source");
        return;
      }
      finalSource = customSource.trim();
    }

    const dataToSendForm = { ...formData, source: finalSource };

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const token       = localStorage.getItem("token");
      const formDataObj = new FormData();

      for (let key in dataToSendForm) {
        if (key === "attachments") {
          dataToSendForm.attachments.forEach((file) =>
            formDataObj.append("attachments", file)
          );
        } else if (key === "assignTo") {
          if (dataToSendForm.assignTo)
            formDataObj.append(key, dataToSendForm.assignTo);
        } else if (key === "followUpDate") {
          const dateVal = dataToSendForm.followUpDate;
          if (dateVal && dateVal.trim() !== "") {
            formDataObj.append("followUpDate", dateVal);
          } else {
            formDataObj.append("followUpDate", "null");
          }
        } else {
          formDataObj.append(key, dataToSendForm[key]);
        }
      }

      formDataObj.append(
        "existingAttachments",
        JSON.stringify(existingAttachments)
      );

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization:  `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload progress: ${progress}%`);
        },
      };

      if (leadId) {
        await axios.put(
          `${API_URL}/leads/updateLead/${leadId}`,
          formDataObj,
          config
        );
        toast.success("Lead updated successfully");
      } else {
        await axios.post(`${API_URL}/leads/create`, formDataObj, config);
        toast.success("Lead created successfully");
      }

      setTimeout(() => navigate("/leads"), 1200);
    } catch (err) {
      console.error("Error submitting form:", err);
      if (err.response?.data?.message) {
        const errorMsg = err.response.data.message.toLowerCase();
        if (errorMsg.includes("email") && errorMsg.includes("already")) {
          setFieldErrors({ email: "This email is already associated with another lead" });
          setErrors({ email: true });
          toast.error("Email already exists");
        } else if (errorMsg.includes("phone") && errorMsg.includes("already")) {
          setFieldErrors({ phoneNumber: "This phone number is already associated with another lead" });
          setErrors({ phoneNumber: true });
          toast.error("Phone number already exists");
        } else if (errorMsg.includes("name") && errorMsg.includes("already")) {
          setFieldErrors({ leadName: "This lead name already exists" });
          setErrors({ leadName: true });
          toast.error("Lead name already exists");
        } else if (
          (errorMsg.includes("file") && errorMsg.includes("large")) ||
          errorMsg.includes("size")
        ) {
          toast.error("File size exceeds the 20MB limit");
        } else if (err.response.data.errors) {
          const backendErrors  = err.response.data.errors;
          const newFieldErrors = {};
          Object.keys(backendErrors).forEach((key) => {
            newFieldErrors[key] = backendErrors[key].message || backendErrors[key];
            setErrors((prev) => ({ ...prev, [key]: true }));
          });
          setFieldErrors(newFieldErrors);
          toast.error("Please check the form for errors");
        } else {
          toast.error(
            err.response.data.message ||
              (leadId ? "Failed to update lead" : "Failed to create lead")
          );
        }
      } else if (err.message?.includes("Network Error")) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackClick = () => navigate(-1);

  const fieldGroups = [
    {
      title:  "Basic Information",
      color:  "text-blue-600",
      fields: [
        { name: "leadName",    label: "Lead Name",    icon: <User      size={16} /> },
        { name: "destination", label: "Destination",  icon: <Building2 size={16} /> },
        { name: "phoneNumber", label: "Phone Number", icon: <Phone     size={16} /> },
        { name: "email",       label: "Email",        icon: <Mail      size={16} /> },
        { name: "address",     label: "Address",      icon: <MapPin    size={16} /> },
        {
          name: "country", label: "Country", icon: <Globe size={16} />,
          type: "select",  options: countries,
        },
      ],
    },
    {
      title:  "Business Details",
      color:  "text-green-600",
      fields: [
        {
          name: "duration", label: "Duration", icon: <Briefcase size={16} />,
          type: "text", placeholder: "e.g., 3 months, 1 year, etc.",
        },
        { name: "source",      label: "Source",      icon: <Globe    size={16} /> },
        { name: "requirement", label: "Requirement", icon: <FileText size={16} /> },
      ],
    },
    {
      title:  "Lead Management",
      color:  "text-yellow-600",
      fields: [
        {
          name: "status", label: "Status", icon: <UserCheck size={16} />,
          type: "select", options: ["Hot", "Warm", "Cold", "Junk"],
        },
        {
          name: "assignTo", label: "Assign To", icon: <User size={16} />,
          type: "select",   options: getSalesUsersOptions(),
        },
        {
          name: "followUpDate", label: "Follow-up Date",
          icon: <Calendar size={16} />, type: "date",
        },
      ],
    },
    {
      title:  "Additional Information",
      color:  "text-purple-600",
      fields: [
        {
          name: "notes", label: "Notes",
          icon: <StickyNote size={16} />, type: "textarea",
        },
      ],
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex items-start justify-center py-10 px-4">
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
                {leadId ? "Edit Lead" : "Create New Lead"}
              </h1>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-10">
            {fieldGroups.map((group) => (
              <div
                key={group.title}
                className="space-y-6 p-6 border border-gray-200 rounded-xl shadow-sm"
              >
                <h2 className={`text-lg font-semibold border-b pb-2 ${group.color}`}>
                  {group.title}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {group.fields.map((field) => (
                    <div
                      key={field.name}
                      className={`${field.type === "textarea" ? "md:col-span-3" : ""}`}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        {field.icon} {field.label}
                        {(field.name === "leadName" ||
                          field.name === "destination" ||
                          field.name === "phoneNumber") && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>

                      {/* ── Phone ── */}
                      {field.name === "phoneNumber" ? (
                        <div>
                          <div
                            className={`border rounded-lg ${
                              errors.phoneNumber ? "border-red-500" : "border-gray-300"
                            }`}
                          >
                            <PhoneInput
                              country={"in"}
                              value={formData.phoneNumber}
                              onChange={handlePhoneChange}
                              enableSearch
                              countryCodeEditable={false}
                              specialLabel=""
                              inputStyle={{
                                width: "100%", height: "42px", fontSize: "14px",
                                paddingLeft: "55px", borderRadius: "0.5rem",
                                boxSizing: "border-box", border: "none",
                              }}
                              buttonStyle={{
                                borderRadius: "0.5rem 0 0 0.5rem", height: "42px",
                                background: "white", border: "none",
                                borderRight: "1px solid #e5e7eb",
                              }}
                              containerStyle={{ width: "100%" }}
                              dropdownStyle={{ borderRadius: "0.5rem" }}
                            />
                          </div>

                          {fieldErrors.phoneNumber && (
                            <p className="text-sm text-red-500 mt-1">
                              {fieldErrors.phoneNumber}
                            </p>
                          )}

                          {!fieldErrors.phoneNumber && formData.phoneNumber && (
                            <p className="text-xs text-gray-400 mt-1">
                              {phoneCountryData?.countryCode === "in"
                                ? "India: 10 digits starting with 6–9"
                                : `${phoneCountryData?.name || "International"}: enter national number`}
                            </p>
                          )}
                        </div>

                      ) : field.name === "source" ? (
                        /* ── Source ── */
                        <div>
                          <select
                            name="source"
                            value={formData.source || ""}
                            onChange={handleChange}
                            className={`w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none transition h-11 ${
                              errors.source ? "border-red-500" : "border-gray-300"
                            }`}
                          >
                            <option value="">Select Source</option>
                            {sourceOptions.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>

                          {formData.source === "Other" && (
                            <div className="mt-2">
                              <input
                                type="text"
                                placeholder="Enter custom source"
                                value={customSource}
                                onChange={(e) => setCustomSource(e.target.value)}
                                className={`w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none transition h-11 ${
                                  errors.source ? "border-red-500" : "border-gray-300"
                                }`}
                              />
                            </div>
                          )}
                          {fieldErrors.source && (
                            <p className="text-sm text-red-500 mt-1">{fieldErrors.source}</p>
                          )}
                        </div>

                      ) : field.type === "select" ? (
                        /* ── Select ── */
                        <div>
                          <select
                            name={field.name}
                            value={formData[field.name] || ""}
                            onChange={handleChange}
                            className={`w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none transition h-11 ${
                              errors[field.name] ? "border-red-500" : "border-gray-300"
                            }`}
                          >
                            <option value="">Select {field.label}</option>
                            {field.options.map((opt) =>
                              typeof opt === "string" ? (
                                <option key={opt} value={opt}>{opt}</option>
                              ) : (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              )
                            )}
                          </select>
                          {fieldErrors[field.name] && (
                            <p className="text-sm text-red-500 mt-1">
                              {fieldErrors[field.name]}
                            </p>
                          )}
                        </div>

                      ) : field.type === "textarea" ? (
                        /* ── Textarea — NO maxLength, auto-grows with content ── */
                        <div>
                          <textarea
                            name={field.name}
                            rows={8}
                            value={formData[field.name] || ""}
                            onChange={handleChange}
                            placeholder={`Enter ${field.label}... (unlimited)`}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white shadow-sm text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 placeholder-gray-400 transition resize-y min-h-[120px]"
                          />
                          {fieldErrors[field.name] && (
                            <p className="text-sm text-red-500 mt-1">
                              {fieldErrors[field.name]}
                            </p>
                          )}
                        </div>

                      ) : (
                        /* ── Text / Date ── */
                        <div>
                          <input
                            type={field.type || "text"}
                            name={field.name}
                            value={formData[field.name] || ""}
                            onChange={handleChange}
                            placeholder={field.placeholder || `Enter ${field.label}`}
                            className={`w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none transition h-11 ${
                              errors[field.name] ? "border-red-500" : "border-gray-300"
                            }`}
                          />
                          {fieldErrors[field.name] && (
                            <p className="text-sm text-red-500 mt-1">
                              {fieldErrors[field.name]}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Attachments Section */}
            <div className="space-y-6 p-6 border border-gray-200 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold border-b pb-2 text-indigo-600 flex items-center gap-2">
                <Upload size={20} /> Attachments
              </h2>

              <div className="space-y-4">
                <div
                  className={`flex flex-col items-center justify-center w-full min-h-32 border-2 border-dashed rounded-xl cursor-pointer transition p-6 ${
                    isDragging
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("attachments").click()}
                >
                  <div className="w-full flex flex-wrap gap-4">
                    {existingAttachments.map((file, idx) => (
                      <div
                        key={`existing-${idx}`}
                        className="flex flex-col items-center justify-center w-28 h-28 bg-white border rounded-xl shadow-sm p-2 relative group"
                      >
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleRemoveFile(idx, "existing"); }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                        <div className="w-12 h-12 flex items-center justify-center bg-indigo-100 rounded-md mb-1">
                          <span className="text-xs font-semibold text-indigo-600">
                            {file.name.split(".").pop().toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate w-full text-center">
                          {file.name}
                        </p>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleRemoveFile(idx, "existing"); }}
                          className="text-[12px] text-red-600 hover:underline mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    ))}

                    {formData.attachments.map((file, idx) => (
                      <div
                        key={`new-${idx}`}
                        className="flex flex-col items-center justify-center w-28 h-28 bg-white border rounded-xl shadow-sm p-2 relative group"
                      >
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleRemoveFile(idx, "new"); }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                        <div className="w-12 h-12 flex items-center justify-center bg-indigo-100 rounded-md mb-1">
                          <span className="text-xs font-semibold text-indigo-600">
                            {file.name.split(".").pop().toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <p className="text-[10px] text-gray-700 truncate w-full text-center">
                          {file.name}
                        </p>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleRemoveFile(idx, "new"); }}
                          className="text-[12px] text-red-600 hover:underline mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    ))}

                    {existingAttachments.length === 0 &&
                      formData.attachments.length === 0 && (
                        <div className="flex flex-col items-center justify-center text-center">
                          <Upload size={48} className="text-indigo-300 mb-2" />
                          <p className="text-sm text-gray-600">
                            Drag & drop files here or click to browse
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Max 5 files, 20MB Limit
                          </p>
                        </div>
                      )}
                  </div>

                  <input
                    id="attachments"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={
                      formData.attachments.length + existingAttachments.length >= 5
                    }
                  />
                </div>

                <div className="text-sm text-gray-600 flex flex-wrap gap-4 items-center">
                  <div>
                    <span
                      className={`font-medium ${
                        formData.attachments.length + existingAttachments.length >= 5
                          ? "text-red-500"
                          : "text-gray-600"
                      }`}
                    >
                      Files: {formData.attachments.length + existingAttachments.length}/5
                    </span>
                  </div>
                  <div><span className="font-medium">Max size:</span> 20MB</div>
                  <div>
                    <span className="font-medium">Supported types:</span> All file types
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={handleBackClick}
                className="px-6 py-2 rounded-lg border bg-white hover:bg-gray-100 text-gray-700 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? "Processing..."
                  : leadId
                  ? "Update Lead"
                  : "Save Lead"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </>
  );
}