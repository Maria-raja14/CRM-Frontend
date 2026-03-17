
// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import axios from "axios";
// import { getNames } from "country-list";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import {
//   ArrowLeft, DollarSign, Briefcase, UserCheck, StickyNote,
//   Phone, Mail, Building2, Globe, MapPin, FileText, BriefcaseBusiness,
//   Download, Eye, X,
// } from "lucide-react";
// import "react-toastify/dist/ReactToastify.css";

// const currencyOptions = [
//   { code: "USD", symbol: "$",   label: "🇺🇸 USD" },
//   { code: "EUR", symbol: "€",   label: "🇪🇺 EUR" },
//   { code: "INR", symbol: "₹",   label: "🇮🇳 INR" },
//   { code: "GBP", symbol: "£",   label: "🇬🇧 GBP" },
//   { code: "JPY", symbol: "¥",   label: "🇯🇵 JPY" },
//   { code: "AUD", symbol: "A$",  label: "🇦🇺 AUD" },
//   { code: "CAD", symbol: "C$",  label: "🇨🇦 CAD" },
//   { code: "CHF", symbol: "CHF", label: "🇨🇭 CHF" },
//   { code: "MYR", symbol: "RM",  label: "🇲🇾 MYR" },
//   { code: "AED", symbol: "د.إ", label: "🇦🇪 AED" },
//   { code: "SGD", symbol: "S$",  label: "🇸🇬 SGD" },
//   { code: "ZAR", symbol: "R",   label: "🇿🇦 ZAR" },
//   { code: "SAR", symbol: "﷼",   label: "🇸🇦 SAR" },
// ];

// // ─────────────────────────────────────────────
// // File helpers
// // ─────────────────────────────────────────────
// const getFileExtension = (filename = "") =>
//   filename.split(".").pop()?.toLowerCase() || "";

// const getFileCategory = (name = "", mimeType = "") => {
//   const ext  = getFileExtension(name);
//   const mime = mimeType.toLowerCase();
//   if (mime.startsWith("image/") || ["jpg","jpeg","png","gif","webp"].includes(ext)) return "image";
//   if (mime === "application/pdf" || ext === "pdf")  return "pdf";
//   if (mime === "text/plain" || mime === "text/csv" || ["txt","csv"].includes(ext)) return "text";
//   return "other";
// };

// const canPreview = (name, mimeType) =>
//   ["image","pdf","text"].includes(getFileCategory(name, mimeType));

// const formatFileSize = (bytes) => {
//   if (!bytes) return "";
//   if (bytes < 1024)      return `${bytes} B`;
//   if (bytes < 1024*1024) return `${(bytes/1024).toFixed(1)} KB`;
//   return `${(bytes/(1024*1024)).toFixed(1)} MB`;
// };

// const FILE_STYLES = {
//   image: { bg: "bg-green-100",  text: "text-green-600"  },
//   pdf:   { bg: "bg-red-100",    text: "text-red-600"    },
//   text:  { bg: "bg-yellow-100", text: "text-yellow-600" },
//   other: { bg: "bg-blue-100",   text: "text-blue-600"   },
// };

// // ─────────────────────────────────────────────
// // TextPreview
// // ─────────────────────────────────────────────
// const TextPreview = ({ url }) => {
//   const [content, setContent] = useState("Loading…");
//   useEffect(() => {
//     fetch(url).then((r) => r.text()).then(setContent)
//       .catch(() => setContent("Could not load file contents."));
//   }, [url]);
//   return (
//     <pre className="whitespace-pre-wrap text-sm text-slate-700 bg-white p-4 rounded-lg border border-slate-200 max-h-[60vh] overflow-auto font-mono">
//       {content}
//     </pre>
//   );
// };

// // ─────────────────────────────────────────────
// // PreviewModal
// // ─────────────────────────────────────────────
// const PreviewModal = ({ file, onClose }) => {
//   useEffect(() => {
//     const handler = (e) => e.key === "Escape" && onClose();
//     window.addEventListener("keydown", handler);
//     return () => window.removeEventListener("keydown", handler);
//   }, [onClose]);

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" onClick={onClose}>
//       <div
//         className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden"
//         style={{ maxHeight: "92vh" }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 flex-shrink-0">
//           <div className="flex items-center gap-3 min-w-0">
//             <FileText size={20} className="text-slate-500 flex-shrink-0" />
//             <span className="font-medium text-slate-900 truncate text-sm">{file.name}</span>
//           </div>
//           <button onClick={onClose} className="ml-4 p-2 rounded-lg hover:bg-slate-100 transition-colors" title="Close (Esc)">
//             <X size={20} className="text-slate-600" />
//           </button>
//         </div>
//         <div className="flex-1 overflow-auto bg-slate-50 p-3">
//           {file.category === "image" && (
//             <div className="flex items-center justify-center min-h-64 p-4">
//               <img src={file.url} alt={file.name} className="max-w-full max-h-[75vh] object-contain rounded-lg shadow" />
//             </div>
//           )}
//           {file.category === "pdf" && (
//             <iframe src={file.url} title={file.name} className="w-full rounded-lg border-0" style={{ height: "75vh" }} />
//           )}
//           {file.category === "text" && (
//             <div className="p-2"><TextPreview url={file.url} /></div>
//           )}
//         </div>
//         <div className="flex justify-end px-5 py-3 border-t border-slate-100 flex-shrink-0">
//           <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Close</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─────────────────────────────────────────────
// // Main CreateDeal Component
// // ─────────────────────────────────────────────
// export default function CreateDeal() {
//   const API_URL  = import.meta.env.VITE_API_URL;
//   const navigate = useNavigate();
//   const location = useLocation();
//   const isEditMode   = !!location.state?.deal;
//   const existingDeal = location.state?.deal || null;

//   const [formData, setFormData] = useState({
//     dealName: "", dealValue: "", currency: "INR", stage: "Qualification",
//     assignTo: "", notes: "", phoneNumber: "", email: "", source: "",
//     companyName: "", industry: "", requirement: "", address: "", country: "",
//     attachments: [],
//   });

//   const [errors, setErrors]                           = useState({});
//   const [salesUsers, setSalesUsers]                   = useState([]);
//   const [existingAttachments, setExistingAttachments] = useState([]);
//   const [userRole, setUserRole]                       = useState("");
//   const [userId, setUserId]                           = useState("");
//   const [isSubmitting, setIsSubmitting]               = useState(false);
//   const [countries]                                   = useState(getNames());
//   const [phoneError, setPhoneError]                   = useState("");
//   const [emailError, setEmailError]                   = useState("");
//   const [previewFile, setPreviewFile]                 = useState(null);
//   const [previewLoading, setPreviewLoading]           = useState(null);

//   const dealNameRef    = useRef(null);
//   const dealValueRef   = useRef(null);
//   const phoneNumberRef = useRef(null);
//   const emailRef       = useRef(null);
//   const companyNameRef = useRef(null);

//   useEffect(() => {
//     const userData = localStorage.getItem("user");
//     if (userData) {
//       const user = JSON.parse(userData);
//       setUserRole(user.role?.name || "");
//       setUserId(user._id || "");
//     }
//   }, []);

//   useEffect(() => {
//     if (isEditMode && existingDeal) {
//       let dealValue = "";
//       let currency  = "INR";
//       if (existingDeal.value) {
//         const parts = existingDeal.value.split(" ");
//         if (parts.length >= 2) { dealValue = parts[0].replace(/,/g, ""); currency = parts[1]; }
//         else { dealValue = existingDeal.value.replace(/,/g, ""); }
//       }
//       setFormData({
//         dealName:    existingDeal.dealName    || "",
//         dealValue,
//         currency,
//         stage:       existingDeal.stage       || "Qualification",
//         assignTo:    existingDeal.assignedTo?._id || "",
//         notes:       existingDeal.notes       || "",
//         phoneNumber: existingDeal.phoneNumber || "",
//         email:       existingDeal.email       || "",
//         source:      existingDeal.source      || "",
//         companyName: existingDeal.companyName || "",
//         industry:    existingDeal.industry    || "",
//         requirement: existingDeal.requirement || "",
//         address:     existingDeal.address     || "",
//         country:     existingDeal.country     || "",
//         attachments: [],
//       });
//       if (existingDeal.attachments?.length > 0) {
//         setExistingAttachments(existingDeal.attachments);
//       }
//     }
//   }, [isEditMode, existingDeal]);

//   useEffect(() => {
//     const fetchSalesUsers = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res   = await axios.get(`${API_URL}/users/sales`, { headers: { Authorization: `Bearer ${token}` } });
//         setSalesUsers(res.data.users || []);
//       } catch {}
//     };
//     fetchSalesUsers();
//   }, [API_URL]);

//   const handleChange = useCallback((e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (value.trim() !== "") setErrors((prev) => ({ ...prev, [name]: false }));
//     if (name === "email" && value.trim() !== "") {
//       setEmailError(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Please enter a valid email address");
//     }
//   }, []);

//   const handlePhoneChange = (value, country) => {
//     if (!value) { setFormData((prev) => ({ ...prev, phoneNumber: "" })); return; }
//     const nationalNumber = value.slice(country.dialCode.length);
//     if (country.countryCode === "in" && nationalNumber.length > 10) return;
//     setFormData((prev) => ({ ...prev, phoneNumber: "+" + value }));
//   };

//   const scrollToElement = (ref) => {
//     if (ref?.current) {
//       ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
//       setTimeout(() => {
//         const el = ref.current.querySelector("input") || ref.current.querySelector("textarea") || ref.current.querySelector("select");
//         if (el) el.focus();
//       }, 300);
//     }
//   };

//   const handleFileChange = useCallback((e) => {
//     const files = Array.from(e.target.files);
//     const valid = files.filter((f) => f.size <= 20 * 1024 * 1024);
//     if (valid.length < files.length) toast.error("Some files exceed 20MB limit and were skipped");
//     setFormData((prev) => ({ ...prev, attachments: [...prev.attachments, ...valid] }));
//     e.target.value = null;
//   }, []);

//   const handleRemoveFile = useCallback((idx, type = "new") => {
//     if (type === "new") setFormData((prev) => ({ ...prev, attachments: prev.attachments.filter((_, i) => i !== idx) }));
//     else setExistingAttachments((prev) => prev.filter((_, i) => i !== idx));
//   }, []);

//   // ✅ FIXED: URLSearchParams encoding
//   const handleFileDownload = useCallback(async (filePath, fileName) => {
//     if (!filePath) return toast.error("File path missing");
//     try {
//       const token  = localStorage.getItem("token");
//       const params = new URLSearchParams({ filePath });
//       const res    = await axios.get(`${API_URL}/files/download?${params}`, {
//         headers: { Authorization: `Bearer ${token}` }, responseType: "blob",
//       });
//       const url  = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement("a");
//       link.href  = url;
//       link.setAttribute("download", fileName || filePath.split("/").pop() || "file");
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
//       toast.success("Downloaded successfully");
//     } catch (error) {
//       console.error("Download error:", error);
//       toast.error("Failed to download file");
//     }
//   }, [API_URL]);

//   // ✅ NEW: preview handler
//   const handleFilePreview = useCallback(async (filePath, fileName, mimeType, idx) => {
//     if (!filePath) return toast.error("File path missing");
//     setPreviewLoading(idx);
//     try {
//       const token  = localStorage.getItem("token");
//       const params = new URLSearchParams({ filePath });
//       const res    = await axios.get(`${API_URL}/files/preview?${params}`, {
//         headers: { Authorization: `Bearer ${token}` }, responseType: "blob",
//       });
//       const contentType = res.headers["content-type"] || "application/octet-stream";
//       const blobUrl     = window.URL.createObjectURL(new Blob([res.data], { type: contentType }));
//       setPreviewFile({ url: blobUrl, name: fileName, category: getFileCategory(fileName, mimeType) });
//     } catch (error) {
//       console.error("Preview error:", error);
//       toast.error("Failed to load preview");
//     } finally {
//       setPreviewLoading(null);
//     }
//   }, [API_URL]);

//   const closePreview = useCallback(() => {
//     if (previewFile?.url) window.URL.revokeObjectURL(previewFile.url);
//     setPreviewFile(null);
//   }, [previewFile]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     const newErrors = {
//       dealName:    formData.dealName.trim()    === "",
//       dealValue:   formData.dealValue.trim()   === "",
//       phoneNumber: formData.phoneNumber.trim() === "",
//       email:       formData.email.trim()       === "",
//       companyName: formData.companyName.trim() === "",
//     };
//     setErrors(newErrors);

//     if (formData.phoneNumber.trim()) {
//       const localNumber = formData.phoneNumber.replace(/\D/g, "").slice(-10);
//       if (localNumber.length < 10) { setPhoneError("Phone number should be at least 10 digits"); setIsSubmitting(false); return; }
//     }
//     if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       setEmailError("Please enter a valid email address"); setIsSubmitting(false); return;
//     }

//     const errorFields = Object.entries(newErrors).filter(([, v]) => v);
//     if (errorFields.length > 0) {
//       const refs = { dealName: dealNameRef, dealValue: dealValueRef, phoneNumber: phoneNumberRef, email: emailRef, companyName: companyNameRef };
//       scrollToElement(refs[errorFields[0][0]]);
//       toast.error("Please fill in all required fields");
//       setIsSubmitting(false); return;
//     }
//     if (phoneError || emailError) { setIsSubmitting(false); return; }

//     try {
//       const token = localStorage.getItem("token");
//       const data  = new FormData();
//       Object.keys(formData).forEach((key) => {
//         if (key !== "attachments") data.append(key, formData[key]);
//       });
//       if (!isEditMode && userRole === "Sales" && !formData.assignTo) data.set("assignTo", userId);
//       formData.attachments.forEach((file) => data.append("attachments", file));
//       data.append("existingAttachments", JSON.stringify(existingAttachments));

//       if (isEditMode && existingDeal) {
//         await axios.patch(`${API_URL}/deals/update-deal/${existingDeal._id}`, data, {
//           headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
//         });
//         toast.success("Deal updated successfully");
//       } else {
//         await axios.post(`${API_URL}/deals/createManual`, data, {
//           headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
//         });
//         toast.success("Deal created successfully");
//       }
//       setTimeout(() => navigate("/deals"), 2000);
//     } catch (err) {
//       console.error("Deal operation error:", err);
//       toast.error(err.response?.data?.message || (isEditMode ? "Failed to update deal" : "Failed to create deal"));
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const showAssignToField = userRole === "Admin" || (isEditMode && userRole === "Sales");

//   const formFields = [
//     { name: "stage",       label: "Stage",        icon: <Briefcase size={16} />,        type: "select", options: ["Qualification","Proposal","Negotiation","Closed Won","Closed Lost"] },
//     { name: "companyName", label: "Company Name",  icon: <Building2 size={16} /> },
//     { name: "industry",    label: "Industry",      icon: <BriefcaseBusiness size={16} />, type: "select", options: ["IT","Finance","Healthcare","Education","Manufacturing","Retail","Other"] },
//     { name: "source",      label: "Source",        icon: <Globe size={16} />,            type: "select", options: ["Website","Referral","Social Media","Email","Phone","Other"] },
//     { name: "country",     label: "Country",       icon: <Globe size={16} />,            type: "select", options: countries },
//   ];

//   return (
//     <div className="min-h-screen flex items-start justify-center py-10 px-4">
//       <ToastContainer position="top-right" autoClose={5000} />
//       <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl border border-gray-100">

//         {/* Header */}
//         <div className="flex items-center gap-3 px-6 py-5 border-b rounded-t-2xl">
//           <button onClick={() => navigate(-1)} className="p-2 rounded-lg bg-white text-gray-600 hover:bg-gray-100 transition">
//             <ArrowLeft size={20} />
//           </button>
//           <h1 className="text-2xl font-bold text-gray-800">
//             {isEditMode ? "Edit Deal" : "Create New Deal"}
//           </h1>
//         </div>

//         <form onSubmit={handleSubmit} className="p-8 space-y-10">

//           {/* Deal Information */}
//           <div className="space-y-6 p-6 border border-gray-200 rounded-xl shadow-sm">
//             <h2 className="text-lg font-semibold border-b pb-2 text-blue-600">Deal Information</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//               {/* Deal Name */}
//               <div ref={dealNameRef}>
//                 <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                   <FileText size={16} /> Deal Name <span className="text-red-500">*</span>
//                 </label>
//                 <input type="text" name="dealName" value={formData.dealName} onChange={handleChange}
//                   placeholder="Enter Deal Name"
//                   className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none transition h-11" />
//                 {errors.dealName && <p className="text-red-500 text-sm mt-1">Deal Name is required</p>}
//               </div>

//               {/* Deal Value */}
//               <div ref={dealValueRef}>
//                 <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                   <DollarSign size={16} /> Deal Value <span className="text-red-500">*</span>
//                 </label>
//                 <div className="flex gap-2">
//                   <select value={formData.currency}
//                     onChange={(e) => setFormData((prev) => ({ ...prev, currency: e.target.value }))}
//                     className="w-28 border rounded-lg px-2 text-sm h-11 focus:ring-2 focus:ring-green-500 focus:outline-none">
//                     {currencyOptions.map((c) => <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>)}
//                   </select>
//                   <input type="text" name="dealValue" value={formData.dealValue}
//                     onChange={(e) => {
//                       const val = e.target.value;
//                       if (val === "" || /^[0-9\b]+$/.test(val)) {
//                         setFormData((prev) => ({ ...prev, dealValue: val }));
//                         if (val.trim()) setErrors((prev) => ({ ...prev, dealValue: false }));
//                       }
//                     }}
//                     placeholder="Enter deal value"
//                     className="flex-1 border rounded-lg px-3 py-2 text-sm h-11 focus:ring-2 focus:ring-green-500 focus:outline-none" />
//                 </div>
//                 {errors.dealValue && <p className="text-red-500 text-sm mt-1">Deal Value is required</p>}
//               </div>

//               {/* Phone */}
//               <div ref={phoneNumberRef}>
//                 <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                   <Phone size={16} /> Phone Number <span className="text-red-500">*</span>
//                 </label>
//                 <div className="border rounded-lg">
//                   <PhoneInput country="in" value={formData.phoneNumber?.replace("+", "")}
//                     onChange={handlePhoneChange} enableSearch disableSearchIcon
//                     inputStyle={{ width: "100%", height: "44px", border: "none", fontSize: "14px" }}
//                     buttonStyle={{ border: "none", borderRight: "1px solid #d1d5db" }}
//                     containerStyle={{ width: "100%" }}
//                     inputProps={{ name: "phoneNumber", required: true }} />
//                 </div>
//                 {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
//                 {errors.phoneNumber && !phoneError && <p className="text-red-500 text-sm mt-1">Phone Number is required</p>}
//               </div>

//               {/* Email */}
//               <div ref={emailRef}>
//                 <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                   <Mail size={16} /> Email <span className="text-red-500">*</span>
//                 </label>
//                 <input type="email" name="email" value={formData.email} onChange={handleChange}
//                   placeholder="Enter email address"
//                   className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none transition h-11" />
//                 {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
//                 {errors.email && !emailError && <p className="text-red-500 text-sm mt-1">Email is required</p>}
//               </div>

//               {/* Dynamic fields */}
//               {formFields.map((field) => (
//                 <div key={field.name} ref={field.name === "companyName" ? companyNameRef : null}>
//                   <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                     {field.icon} {field.label}
//                     {field.name === "companyName" && <span className="text-red-500">*</span>}
//                   </label>
//                   {field.type === "select" ? (
//                     <select name={field.name} value={formData[field.name] || ""} onChange={handleChange}
//                       className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none transition h-11">
//                       <option value="">Select {field.label}</option>
//                       {field.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
//                     </select>
//                   ) : (
//                     <input type="text" name={field.name} value={formData[field.name] || ""} onChange={handleChange}
//                       placeholder={`Enter ${field.label}`}
//                       className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none transition h-11" />
//                   )}
//                   {errors[field.name] && <p className="text-red-500 text-sm mt-1">{field.label} is required</p>}
//                 </div>
//               ))}

//               {/* Address */}
//               <div className="md:col-span-3">
//                 <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                   <MapPin size={16} /> Address
//                 </label>
//                 <textarea name="address" rows={3} value={formData.address} onChange={handleChange}
//                   placeholder="Enter full address..."
//                   className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white shadow-sm text-sm placeholder-gray-400 transition resize-none" />
//               </div>
//             </div>
//           </div>

//           {/* Management */}
//           {showAssignToField && (
//             <div className="p-6 border border-gray-200 rounded-xl shadow-sm">
//               <h2 className="text-lg font-semibold border-b pb-2 text-yellow-600">Management</h2>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                     <UserCheck size={16} /> Assign To
//                   </label>
//                   <select name="assignTo" value={formData.assignTo} onChange={handleChange}
//                     className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none transition h-11">
//                     <option value="">Select User</option>
//                     {salesUsers.map((u) => (
//                       <option key={u._id} value={u._id}>{u.firstName} {u.lastName}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Notes */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//               <StickyNote size={16} /> Notes
//             </label>
//             <textarea name="notes" rows={4} value={formData.notes} onChange={handleChange}
//               placeholder="Enter Notes..."
//               className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white shadow-sm text-sm placeholder-gray-400 transition resize-none" />
//           </div>

//           {/* Attachments */}
//           <div className="p-6 border rounded-xl shadow-sm">
//             <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Attachments</h2>

//             {/* Existing attachments */}
//             {existingAttachments.length > 0 && (
//               <div className="mt-5">
//                 <h3 className="text-sm font-medium text-gray-700 mb-3">Existing Files</h3>
//                 <div className="space-y-2">
//                   {existingAttachments.map((file, idx) => {
//                     // file can be object {name,path,type,size} or legacy string
//                     const filePath  = typeof file === "string" ? file : file.path;
//                     const fileName  = typeof file === "string" ? file.split("/").pop() : (file.name || file.path?.split("/").pop());
//                     const mimeType  = typeof file === "object" ? (file.type || "") : "";
//                     const fileSize  = typeof file === "object" ? file.size : 0;
//                     const cat       = getFileCategory(fileName, mimeType);
//                     const style     = FILE_STYLES[cat];
//                     const showPreviewBtn = canPreview(fileName, mimeType);

//                     return (
//                       <div key={idx}
//                         className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition">
//                         <div className="flex items-center gap-3 min-w-0 flex-1">
//                           <div className={`w-8 h-8 flex items-center justify-center rounded-md flex-shrink-0 ${style.bg}`}>
//                             <FileText size={16} className={style.text} />
//                           </div>
//                           <div className="min-w-0">
//                             <p className="text-sm font-medium text-gray-700 truncate">{fileName}</p>
//                             <p className="text-xs text-gray-500">
//                               {cat.toUpperCase()}
//                               {fileSize > 0 && ` • ${formatFileSize(fileSize)}`}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-1 ml-3 flex-shrink-0">
//                           {showPreviewBtn && (
//                             <button type="button"
//                               onClick={() => handleFilePreview(filePath, fileName, mimeType, `ex-${idx}`)}
//                               disabled={previewLoading === `ex-${idx}`}
//                               className="flex items-center gap-1 px-2 py-1.5 text-xs text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
//                               title="Preview">
//                               {previewLoading === `ex-${idx}`
//                                 ? <span className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin inline-block" />
//                                 : <Eye size={14} />}
//                               <span className="hidden sm:inline">Preview</span>
//                             </button>
//                           )}
//                           <button type="button"
//                             onClick={() => handleFileDownload(filePath, fileName)}
//                             className="flex items-center gap-1 px-2 py-1.5 text-xs text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                             title="Download">
//                             <Download size={14} />
//                             <span className="hidden sm:inline">Download</span>
//                           </button>
//                           <button type="button" onClick={() => handleRemoveFile(idx, "existing")}
//                             className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
//                             title="Remove">
//                             <X size={14} />
//                           </button>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}

//             {/* New attachments */}
//             <div className="mt-5">
//               <h3 className="text-sm font-medium text-gray-700 mb-3">Upload New Files</h3>

//               {formData.attachments.length > 0 && (
//                 <div className="space-y-2 mb-4">
//                   {formData.attachments.map((file, idx) => (
//                     <div key={idx} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                       <div className="flex items-center gap-3 min-w-0">
//                         <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-md">
//                           <span className="text-xs font-semibold text-blue-600">{file.name.split(".").pop().toUpperCase()}</span>
//                         </div>
//                         <div className="min-w-0">
//                           <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
//                           <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
//                         </div>
//                       </div>
//                       <button type="button" onClick={() => handleRemoveFile(idx, "new")}
//                         className="p-1.5 text-red-500 hover:text-red-700 ml-3 rounded-lg hover:bg-red-50 transition-colors">
//                         <X size={14} />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               <label htmlFor="attachments"
//                 className="flex flex-col items-center justify-center w-full min-h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition p-8">
//                 <div className="text-center">
//                   <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-blue-100 rounded-full">
//                     <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
//                         d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
//                     </svg>
//                   </div>
//                   <p className="text-sm font-medium text-gray-700 mb-1">Drop files here or click to upload</p>
//                   <p className="text-xs text-gray-500">Maximum file size: 20MB</p>
//                   <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, GIF</p>
//                 </div>
//                 <input id="attachments" type="file" multiple onChange={handleFileChange} className="hidden" />
//               </label>
//             </div>
//           </div>

//           {/* Submit */}
//           <div className="flex justify-end gap-4 pt-6 border-t">
//             <button type="button" onClick={() => navigate(-1)} disabled={isSubmitting}
//               className="px-6 py-2 rounded-lg border bg-white hover:bg-gray-100 text-gray-700 transition">
//               Cancel
//             </button>
//             <button type="submit" disabled={isSubmitting}
//               className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md transition disabled:bg-blue-400 disabled:cursor-not-allowed">
//               {isSubmitting ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Deal" : "Save Deal")}
//             </button>
//           </div>
//         </form>
//       </div>

//       {previewFile && <PreviewModal file={previewFile} onClose={closePreview} />}
//     </div>
//   );
// }//original


import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { getNames } from "country-list";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  ArrowLeft, DollarSign, Briefcase, UserCheck, StickyNote,
  Phone, Mail, Building2, Globe, MapPin, FileText, BriefcaseBusiness,
  Download, Eye, X,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const currencyOptions = [
  { code: "USD", symbol: "$",   label: "🇺🇸 USD" },
  { code: "EUR", symbol: "€",   label: "🇪🇺 EUR" },
  { code: "INR", symbol: "₹",   label: "🇮🇳 INR" },
  { code: "GBP", symbol: "£",   label: "🇬🇧 GBP" },
  { code: "JPY", symbol: "¥",   label: "🇯🇵 JPY" },
  { code: "AUD", symbol: "A$",  label: "🇦🇺 AUD" },
  { code: "CAD", symbol: "C$",  label: "🇨🇦 CAD" },
  { code: "CHF", symbol: "CHF", label: "🇨🇭 CHF" },
  { code: "MYR", symbol: "RM",  label: "🇲🇾 MYR" },
  { code: "AED", symbol: "د.إ", label: "🇦🇪 AED" },
  { code: "SGD", symbol: "S$",  label: "🇸🇬 SGD" },
  { code: "ZAR", symbol: "R",   label: "🇿🇦 ZAR" },
  { code: "SAR", symbol: "﷼",   label: "🇸🇦 SAR" },
];

// ✅ Updated source options — added Just Dial, Sulekha, Trip Magic, Hello Travel
const SOURCE_OPTIONS = [
  "Website", "Referral", "Social Media", "Email", "Phone",
  "Just Dial", "Sulekha", "Trip Magic", "Hello Travel", "Other",
];

// ─────────────────────────────────────────────
// File helpers
// ─────────────────────────────────────────────
const getFileExtension = (filename = "") =>
  filename.split(".").pop()?.toLowerCase() || "";

const getFileCategory = (name = "", mimeType = "") => {
  const ext  = getFileExtension(name);
  const mime = mimeType.toLowerCase();
  if (mime.startsWith("image/") || ["jpg","jpeg","png","gif","webp"].includes(ext)) return "image";
  if (mime === "application/pdf" || ext === "pdf")  return "pdf";
  if (mime === "text/plain" || mime === "text/csv" || ["txt","csv"].includes(ext)) return "text";
  return "other";
};

const canPreview = (name, mimeType) =>
  ["image","pdf","text"].includes(getFileCategory(name, mimeType));

const formatFileSize = (bytes) => {
  if (!bytes) return "";
  if (bytes < 1024)      return `${bytes} B`;
  if (bytes < 1024*1024) return `${(bytes/1024).toFixed(1)} KB`;
  return `${(bytes/(1024*1024)).toFixed(1)} MB`;
};

const FILE_STYLES = {
  image: { bg: "bg-green-100",  text: "text-green-600"  },
  pdf:   { bg: "bg-red-100",    text: "text-red-600"    },
  text:  { bg: "bg-yellow-100", text: "text-yellow-600" },
  other: { bg: "bg-blue-100",   text: "text-blue-600"   },
};

// ─────────────────────────────────────────────
// TextPreview
// ─────────────────────────────────────────────
const TextPreview = ({ url }) => {
  const [content, setContent] = useState("Loading…");
  useEffect(() => {
    fetch(url).then((r) => r.text()).then(setContent)
      .catch(() => setContent("Could not load file contents."));
  }, [url]);
  return (
    <pre className="whitespace-pre-wrap text-sm text-slate-700 bg-white p-4 rounded-lg border border-slate-200 max-h-[60vh] overflow-auto font-mono">
      {content}
    </pre>
  );
};

// ─────────────────────────────────────────────
// PreviewModal
// ─────────────────────────────────────────────
const PreviewModal = ({ file, onClose }) => {
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" onClick={onClose}>
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden"
        style={{ maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <FileText size={20} className="text-slate-500 flex-shrink-0" />
            <span className="font-medium text-slate-900 truncate text-sm">{file.name}</span>
          </div>
          <button onClick={onClose} className="ml-4 p-2 rounded-lg hover:bg-slate-100 transition-colors" title="Close (Esc)">
            <X size={20} className="text-slate-600" />
          </button>
        </div>
        <div className="flex-1 overflow-auto bg-slate-50 p-3">
          {file.category === "image" && (
            <div className="flex items-center justify-center min-h-64 p-4">
              <img src={file.url} alt={file.name} className="max-w-full max-h-[75vh] object-contain rounded-lg shadow" />
            </div>
          )}
          {file.category === "pdf" && (
            <iframe src={file.url} title={file.name} className="w-full rounded-lg border-0" style={{ height: "75vh" }} />
          )}
          {file.category === "text" && (
            <div className="p-2"><TextPreview url={file.url} /></div>
          )}
        </div>
        <div className="flex justify-end px-5 py-3 border-t border-slate-100 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Main CreateDeal Component
// ─────────────────────────────────────────────
export default function CreateDeal() {
  const API_URL  = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode   = !!location.state?.deal;
  const existingDeal = location.state?.deal || null;

  const [formData, setFormData] = useState({
    dealName:    "",
    dealValue:   "",
    currency:    "INR",
    stage:       "Qualification",
    assignTo:    "",
    notes:       "",
    phoneNumber: "",
    email:       "",
    source:      "",
    // ✅ CHANGED: companyName → destination
    destination: "",
    // ✅ CHANGED: industry → duration
    duration:    "",
    requirement: "",
    address:     "",
    country:     "",
    attachments: [],
  });

  // ✅ NEW: custom source text when user picks "Other"
  const [customSource, setCustomSource] = useState("");

  const [errors, setErrors]                           = useState({});
  const [salesUsers, setSalesUsers]                   = useState([]);
  const [existingAttachments, setExistingAttachments] = useState([]);
  const [userRole, setUserRole]                       = useState("");
  const [userId, setUserId]                           = useState("");
  const [isSubmitting, setIsSubmitting]               = useState(false);
  const [countries]                                   = useState(getNames());
  const [phoneError, setPhoneError]                   = useState("");
  const [emailError, setEmailError]                   = useState("");
  const [previewFile, setPreviewFile]                 = useState(null);
  const [previewLoading, setPreviewLoading]           = useState(null);

  const dealNameRef    = useRef(null);
  const dealValueRef   = useRef(null);
  const phoneNumberRef = useRef(null);
  const emailRef       = useRef(null);
  // ✅ CHANGED: ref renamed from companyNameRef → destinationRef
  const destinationRef = useRef(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserRole(user.role?.name || "");
      setUserId(user._id || "");
    }
  }, []);

  useEffect(() => {
    if (isEditMode && existingDeal) {
      let dealValue = "";
      let currency  = "INR";
      if (existingDeal.value) {
        const parts = existingDeal.value.split(" ");
        if (parts.length >= 2) { dealValue = parts[0].replace(/,/g, ""); currency = parts[1]; }
        else { dealValue = existingDeal.value.replace(/,/g, ""); }
      }

      // ✅ Handle existing source — detect if it's a custom value
      const existingSource = existingDeal.source || "";
      const isCustomSource = existingSource && !SOURCE_OPTIONS.slice(0, -1).includes(existingSource);
      if (isCustomSource) {
        setCustomSource(existingSource);
      }

      setFormData({
        dealName:    existingDeal.dealName    || "",
        dealValue,
        currency,
        stage:       existingDeal.stage       || "Qualification",
        assignTo:    existingDeal.assignedTo?._id || "",
        notes:       existingDeal.notes       || "",
        phoneNumber: existingDeal.phoneNumber || "",
        email:       existingDeal.email       || "",
        // ✅ Map old companyName OR new destination field
        source:      isCustomSource ? "Other" : existingSource,
        destination: existingDeal.destination || existingDeal.companyName || "",
        duration:    existingDeal.duration    || existingDeal.industry    || "",
        requirement: existingDeal.requirement || "",
        address:     existingDeal.address     || "",
        country:     existingDeal.country     || "",
        attachments: [],
      });
      if (existingDeal.attachments?.length > 0) {
        setExistingAttachments(existingDeal.attachments);
      }
    }
  }, [isEditMode, existingDeal]);

  useEffect(() => {
    const fetchSalesUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res   = await axios.get(`${API_URL}/users/sales`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSalesUsers(res.data.users || []);
      } catch {}
    };
    fetchSalesUsers();
  }, [API_URL]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (value.trim() !== "") setErrors((prev) => ({ ...prev, [name]: false }));
    // ✅ Clear custom source when switching away from "Other"
    if (name === "source" && value !== "Other") setCustomSource("");
    if (name === "email" && value.trim() !== "") {
      setEmailError(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Please enter a valid email address");
    }
  }, []);

  const handlePhoneChange = (value, country) => {
    if (!value) { setFormData((prev) => ({ ...prev, phoneNumber: "" })); return; }
    const nationalNumber = value.slice(country.dialCode.length);
    if (country.countryCode === "in" && nationalNumber.length > 10) return;
    setFormData((prev) => ({ ...prev, phoneNumber: "+" + value }));
  };

  const scrollToElement = (ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        const el =
          ref.current.querySelector("input") ||
          ref.current.querySelector("textarea") ||
          ref.current.querySelector("select");
        if (el) el.focus();
      }, 300);
    }
  };

  const handleFileChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    const valid = files.filter((f) => f.size <= 20 * 1024 * 1024);
    if (valid.length < files.length)
      toast.error("Some files exceed 20MB limit and were skipped");
    setFormData((prev) => ({ ...prev, attachments: [...prev.attachments, ...valid] }));
    e.target.value = null;
  }, []);

  const handleRemoveFile = useCallback((idx, type = "new") => {
    if (type === "new")
      setFormData((prev) => ({
        ...prev,
        attachments: prev.attachments.filter((_, i) => i !== idx),
      }));
    else setExistingAttachments((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const handleFileDownload = useCallback(async (filePath, fileName) => {
    if (!filePath) return toast.error("File path missing");
    try {
      const token  = localStorage.getItem("token");
      const params = new URLSearchParams({ filePath });
      const res    = await axios.get(`${API_URL}/files/download?${params}`, {
        headers: { Authorization: `Bearer ${token}` }, responseType: "blob",
      });
      const url  = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href  = url;
      link.setAttribute("download", fileName || filePath.split("/").pop() || "file");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download file");
    }
  }, [API_URL]);

  const handleFilePreview = useCallback(async (filePath, fileName, mimeType, idx) => {
    if (!filePath) return toast.error("File path missing");
    setPreviewLoading(idx);
    try {
      const token  = localStorage.getItem("token");
      const params = new URLSearchParams({ filePath });
      const res    = await axios.get(`${API_URL}/files/preview?${params}`, {
        headers: { Authorization: `Bearer ${token}` }, responseType: "blob",
      });
      const contentType = res.headers["content-type"] || "application/octet-stream";
      const blobUrl     = window.URL.createObjectURL(
        new Blob([res.data], { type: contentType })
      );
      setPreviewFile({
        url:      blobUrl,
        name:     fileName,
        category: getFileCategory(fileName, mimeType),
      });
    } catch (error) {
      console.error("Preview error:", error);
      toast.error("Failed to load preview");
    } finally {
      setPreviewLoading(null);
    }
  }, [API_URL]);

  const closePreview = useCallback(() => {
    if (previewFile?.url) window.URL.revokeObjectURL(previewFile.url);
    setPreviewFile(null);
  }, [previewFile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // ✅ CHANGED: dealValue and email are NO LONGER mandatory
    // ✅ CHANGED: companyName → destination (mandatory)
    const newErrors = {
      dealName:    formData.dealName.trim()    === "",
      phoneNumber: formData.phoneNumber.trim() === "",
      destination: formData.destination.trim() === "",
      // ✅ Validate custom source if "Other" selected
      source: formData.source === "Other" && customSource.trim() === "",
    };
    setErrors(newErrors);

    if (formData.phoneNumber.trim()) {
      const localNumber = formData.phoneNumber.replace(/\D/g, "").slice(-10);
      if (localNumber.length < 10) {
        setPhoneError("Phone number should be at least 10 digits");
        setIsSubmitting(false);
        return;
      }
    }

    // ✅ Email validation only if a value is entered (not mandatory)
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setEmailError("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    const errorFields = Object.entries(newErrors).filter(([, v]) => v);
    if (errorFields.length > 0) {
      const refs = {
        dealName:    dealNameRef,
        dealValue:   dealValueRef,
        phoneNumber: phoneNumberRef,
        email:       emailRef,
        destination: destinationRef,
      };
      if (refs[errorFields[0][0]]) scrollToElement(refs[errorFields[0][0]]);
      if (newErrors.source) {
        toast.error("Please enter a custom source");
      } else {
        toast.error("Please fill in all required fields");
      }
      setIsSubmitting(false);
      return;
    }
    if (phoneError || emailError) { setIsSubmitting(false); return; }

    try {
      const token = localStorage.getItem("token");
      const data  = new FormData();

      // ✅ Resolve final source value
      const finalSource = formData.source === "Other"
        ? customSource.trim()
        : formData.source;

      Object.keys(formData).forEach((key) => {
        if (key === "attachments") return;
        if (key === "source") {
          data.append("source", finalSource);
        } else {
          data.append(key, formData[key]);
        }
      });

      if (!isEditMode && userRole === "Sales" && !formData.assignTo)
        data.set("assignTo", userId);

      formData.attachments.forEach((file) => data.append("attachments", file));
      data.append("existingAttachments", JSON.stringify(existingAttachments));

      if (isEditMode && existingDeal) {
        await axios.patch(
          `${API_URL}/deals/update-deal/${existingDeal._id}`,
          data,
          { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` } }
        );
        toast.success("Deal updated successfully");
      } else {
        await axios.post(
          `${API_URL}/deals/createManual`,
          data,
          { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` } }
        );
        toast.success("Deal created successfully");
      }
      setTimeout(() => navigate("/deals"), 2000);
    } catch (err) {
      console.error("Deal operation error:", err);
      toast.error(
        err.response?.data?.message ||
          (isEditMode ? "Failed to update deal" : "Failed to create deal")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const showAssignToField =
    userRole === "Admin" || (isEditMode && userRole === "Sales");

  // ✅ Updated formFields:
  //    - companyName  → destination  (required)
  //    - industry     → duration     (text input, not select)
  //    - source       → handled separately below (custom "Other" logic)
  const formFields = [
    {
      name:    "stage",
      label:   "Stage",
      icon:    <Briefcase size={16} />,
      type:    "select",
      options: ["Qualification","Proposal","Negotiation","Closed Won","Closed Lost"],
    },
    {
      // ✅ CHANGED: companyName → destination
      name:     "destination",
      label:    "Destination",
      icon:     <Building2 size={16} />,
      required: true,
    },
    {
      // ✅ CHANGED: industry (select) → duration (text input)
      name:        "duration",
      label:       "Duration",
      icon:        <BriefcaseBusiness size={16} />,
      type:        "text",
      placeholder: "e.g., 3 months, 1 year, etc.",
    },
    {
      name:    "country",
      label:   "Country",
      icon:    <Globe size={16} />,
      type:    "select",
      options: countries,
    },
  ];

  return (
    <div className="min-h-screen flex items-start justify-center py-10 px-4">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl border border-gray-100">

        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b rounded-t-2xl">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-white text-gray-600 hover:bg-gray-100 transition"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditMode ? "Edit Deal" : "Create New Deal"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-10">

          {/* Deal Information */}
          <div className="space-y-6 p-6 border border-gray-200 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold border-b pb-2 text-blue-600">
              Deal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Deal Name — required */}
              <div ref={dealNameRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FileText size={16} /> Deal Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" name="dealName" value={formData.dealName}
                  onChange={handleChange} placeholder="Enter Deal Name"
                  className={`w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none transition h-11 ${errors.dealName ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.dealName && (
                  <p className="text-red-500 text-sm mt-1">Deal Name is required</p>
                )}
              </div>

              {/* Deal Value — ✅ NOT mandatory anymore (asterisk removed) */}
              <div ref={dealValueRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <DollarSign size={16} /> Deal Value
                  {/* ✅ No asterisk — not required */}
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.currency}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, currency: e.target.value }))
                    }
                    className="w-28 border border-gray-300 rounded-lg px-2 text-sm h-11 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  >
                    {currencyOptions.map((c) => (
                      <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
                    ))}
                  </select>
                  <input
                    type="text" name="dealValue" value={formData.dealValue}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "" || /^[0-9\b]+$/.test(val)) {
                        setFormData((prev) => ({ ...prev, dealValue: val }));
                        if (val.trim()) setErrors((prev) => ({ ...prev, dealValue: false }));
                      }
                    }}
                    placeholder="Enter deal value"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm h-11 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
                {/* ✅ No required error for dealValue */}
              </div>

              {/* Phone — required */}
              <div ref={phoneNumberRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Phone size={16} /> Phone Number <span className="text-red-500">*</span>
                </label>
                <div className={`border rounded-lg ${errors.phoneNumber || phoneError ? "border-red-500" : "border-gray-300"}`}>
                  <PhoneInput
                    country="in" value={formData.phoneNumber?.replace("+", "")}
                    onChange={handlePhoneChange} enableSearch disableSearchIcon
                    inputStyle={{ width: "100%", height: "44px", border: "none", fontSize: "14px" }}
                    buttonStyle={{ border: "none", borderRight: "1px solid #d1d5db" }}
                    containerStyle={{ width: "100%" }}
                    inputProps={{ name: "phoneNumber", required: true }}
                  />
                </div>
                {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
                {errors.phoneNumber && !phoneError && (
                  <p className="text-red-500 text-sm mt-1">Phone Number is required</p>
                )}
              </div>

              {/* Email — ✅ NOT mandatory anymore (asterisk removed) */}
              <div ref={emailRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Mail size={16} /> Email
                  {/* ✅ No asterisk — not required */}
                </label>
                <input
                  type="email" name="email" value={formData.email}
                  onChange={handleChange} placeholder="Enter email address"
                  className={`w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none transition h-11 ${emailError ? "border-red-500" : "border-gray-300"}`}
                />
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                {/* ✅ No "Email is required" error — it's optional */}
              </div>

              {/* ✅ Source field — now rendered inline with custom "Other" input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Globe size={16} /> Source
                </label>
                <select
                  name="source"
                  value={formData.source || ""}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none transition h-11 ${errors.source ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">Select Source</option>
                  {SOURCE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>

                {/* ✅ Custom source input — shown only when "Other" is selected */}
                {formData.source === "Other" && (
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Enter custom source"
                      value={customSource}
                      onChange={(e) => {
                        setCustomSource(e.target.value);
                        if (e.target.value.trim())
                          setErrors((prev) => ({ ...prev, source: false }));
                      }}
                      className={`w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none transition h-11 ${errors.source ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.source && (
                      <p className="text-red-500 text-sm mt-1">
                        Please enter a custom source
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Dynamic fields (stage, destination, duration, country) */}
              {formFields.map((field) => (
                <div
                  key={field.name}
                  ref={field.name === "destination" ? destinationRef : null}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    {field.icon} {field.label}
                    {/* ✅ Only destination is required */}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>

                  {field.type === "select" ? (
                    <select
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      className={`w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none transition h-11 ${errors[field.name] ? "border-red-500" : "border-gray-300"}`}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      placeholder={field.placeholder || `Enter ${field.label}`}
                      className={`w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none transition h-11 ${errors[field.name] ? "border-red-500" : "border-gray-300"}`}
                    />
                  )}

                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-1">{field.label} is required</p>
                  )}
                </div>
              ))}

              {/* Requirement */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FileText size={16} /> Requirement
                </label>
                <input
                  type="text" name="requirement" value={formData.requirement || ""}
                  onChange={handleChange} placeholder="Enter Requirement"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none transition h-11"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin size={16} /> Address
                </label>
                <textarea
                  name="address" rows={3} value={formData.address}
                  onChange={handleChange} placeholder="Enter full address..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white shadow-sm text-sm placeholder-gray-400 transition resize-none"
                />
              </div>
            </div>
          </div>

          {/* Management */}
          {showAssignToField && (
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
                    name="assignTo" value={formData.assignTo} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none transition h-11"
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

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <StickyNote size={16} /> Notes
            </label>
            <textarea
              name="notes" rows={4} value={formData.notes} onChange={handleChange}
              placeholder="Enter Notes..."
              className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white shadow-sm text-sm placeholder-gray-400 transition resize-none"
            />
          </div>

          {/* Attachments */}
          <div className="p-6 border rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Attachments
            </h2>

            {/* Existing attachments */}
            {existingAttachments.length > 0 && (
              <div className="mt-5">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Existing Files</h3>
                <div className="space-y-2">
                  {existingAttachments.map((file, idx) => {
                    const filePath       = typeof file === "string" ? file : file.path;
                    const fileName       = typeof file === "string"
                      ? file.split("/").pop()
                      : (file.name || file.path?.split("/").pop());
                    const mimeType       = typeof file === "object" ? (file.type || "") : "";
                    const fileSize       = typeof file === "object" ? file.size : 0;
                    const cat            = getFileCategory(fileName, mimeType);
                    const style          = FILE_STYLES[cat];
                    const showPreviewBtn = canPreview(fileName, mimeType);

                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className={`w-8 h-8 flex items-center justify-center rounded-md flex-shrink-0 ${style.bg}`}>
                            <FileText size={16} className={style.text} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-700 truncate">
                              {fileName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {cat.toUpperCase()}
                              {fileSize > 0 && ` • ${formatFileSize(fileSize)}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-3 flex-shrink-0">
                          {showPreviewBtn && (
                            <button
                              type="button"
                              onClick={() =>
                                handleFilePreview(filePath, fileName, mimeType, `ex-${idx}`)
                              }
                              disabled={previewLoading === `ex-${idx}`}
                              className="flex items-center gap-1 px-2 py-1.5 text-xs text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Preview"
                            >
                              {previewLoading === `ex-${idx}`
                                ? <span className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin inline-block" />
                                : <Eye size={14} />}
                              <span className="hidden sm:inline">Preview</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleFileDownload(filePath, fileName)}
                            className="flex items-center gap-1 px-2 py-1.5 text-xs text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Download"
                          >
                            <Download size={14} />
                            <span className="hidden sm:inline">Download</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(idx, "existing")}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* New attachments */}
            <div className="mt-5">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Upload New Files</h3>

              {formData.attachments.length > 0 && (
                <div className="space-y-2 mb-4">
                  {formData.attachments.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-md">
                          <span className="text-xs font-semibold text-blue-600">
                            {file.name.split(".").pop().toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx, "new")}
                        className="p-1.5 text-red-500 hover:text-red-700 ml-3 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <label
                htmlFor="attachments"
                className="flex flex-col items-center justify-center w-full min-h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition p-8"
              >
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-blue-100 rounded-full">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Drop files here or click to upload
                  </p>
                  <p className="text-xs text-gray-500">Maximum file size: 20MB</p>
                  <p className="text-xs text-gray-400 mt-1">
                    PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, GIF
                  </p>
                </div>
                <input
                  id="attachments" type="file" multiple
                  onChange={handleFileChange} className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button" onClick={() => navigate(-1)} disabled={isSubmitting}
              className="px-6 py-2 rounded-lg border bg-white hover:bg-gray-100 text-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={isSubmitting}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md transition disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? (isEditMode ? "Updating..." : "Creating...")
                : (isEditMode ? "Update Deal" : "Save Deal")}
            </button>
          </div>
        </form>
      </div>

      {previewFile && <PreviewModal file={previewFile} onClose={closePreview} />}
    </div>
  );
}