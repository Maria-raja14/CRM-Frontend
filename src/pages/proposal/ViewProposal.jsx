// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "axios";
// import {
//   ArrowLeft,
//   Calendar,
//   FileText,
//   Mail,
//   Paperclip,
//   Tag,
//   Clock,
//   User,
//   Building,
//   DollarSign,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   Download,
//   Eye,
//   ChevronRight,
//   Edit,
//   MoreVertical,
//   Share,
// } from "lucide-react";

// const ViewProposal = () => {

//  const API_URL = import.meta.env.VITE_API_URL;


//   const { id } = useParams();
//   const [proposal, setProposal] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("details");

//   useEffect(() => {
//     const fetchProposal = async () => {
//       try {
//         const res = await axios.get(`${API_URL}/proposal/${id}`);
//         setProposal(res.data);
//       } catch (err) {
//         console.error("Failed to fetch proposal:", err);
//       }
//       setLoading(false);
//     };
//     fetchProposal();
//   }, [id]);

//   const statusConfig = {
//     draft: {
//       icon: FileText,
//       color: "text-slate-700",
//       bgColor: "bg-slate-100",
//       borderColor: "border-slate-200",
//       label: "Draft",
//     },
//     sent: {
//       icon: Mail,
//       color: "text-blue-700",
//       bgColor: "bg-blue-50",
//       borderColor: "border-blue-200",
//       label: "Sent",
//     },
//     "no reply": {
//       icon: AlertCircle,
//       color: "text-amber-700",
//       bgColor: "bg-amber-50",
//       borderColor: "border-amber-200",
//       label: "No Reply",
//     },
//     rejection: {
//       icon: XCircle,
//       color: "text-rose-700",
//       bgColor: "bg-rose-50",
//       borderColor: "border-rose-200",
//       label: "Rejected",
//     },
//     success: {
//       icon: CheckCircle,
//       color: "text-emerald-700",
//       bgColor: "bg-emerald-50",
//       borderColor: "border-emerald-200",
//       label: "Accepted",
//     },
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
//         <div className="flex flex-col items-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
//           <p className="text-slate-600">Loading proposal details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!proposal) {
//     return (
//       <div className="min-h-screen  flex items-center justify-center px-4">
//         <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md w-full">
//           <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <XCircle className="text-rose-600" size={32} />
//           </div>
//           <h2 className="text-2xl font-bold text-slate-800 mb-3">
//             Proposal Not Found
//           </h2>
//           <p className="text-slate-600 mb-6">
//             The proposal you're looking for doesn't exist or may have been
//             removed.
//           </p>
//           <Link
//             to="/proposal"
//             className="inline-flex items-center px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
//           >
//             <ArrowLeft size={18} className="mr-2" />
//             Back to Proposals
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const StatusIcon = statusConfig[proposal.status]?.icon || AlertCircle;
//   const statusStyle = statusConfig[proposal.status] || statusConfig.draft;

//   return (
//     <div className="min-h-screen  py-8 px-4">
//       <div className="max-w-6xl mx-auto">
//         {/* Header Section */}
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
//           <div>
//             <div className="flex items-center text-slate-600 mb-3">
//               <Link
//                 to="/proposal"
//                 className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
//               >
//                 <ArrowLeft size={16} className="mr-1" />
//                 All Proposals
//               </Link>
//               <ChevronRight size={16} className="mx-2" />
//               <span className="text-slate-500">View Proposal</span>
//             </div>
//             <div className="flex items-center gap-4">
//               <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
//                 {proposal.title}
//               </h1>
//               <div
//                 className={`inline-flex items-center px-4 py-2 rounded-full ${statusStyle.bgColor} ${statusStyle.color} border ${statusStyle.borderColor}`}
//               >
//                 <StatusIcon size={16} className="mr-2" />
//                 <span className="capitalize font-medium text-sm">
//                   {statusStyle.label}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Tab Navigation */}
//         <div className="flex border-b border-slate-200 mb-6">
//           <button
//             className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
//               activeTab === "details"
//                 ? "border-blue-500 text-blue-600"
//                 : "border-transparent text-slate-600 hover:text-slate-900"
//             }`}
//             onClick={() => setActiveTab("details")}
//           >
//             Details
//           </button>
//           <button
//             className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
//               activeTab === "content"
//                 ? "border-blue-500 text-blue-600"
//                 : "border-transparent text-slate-600 hover:text-slate-900"
//             }`}
//             onClick={() => setActiveTab("content")}
//           >
//             Content
//           </button>
//           <button
//             className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
//               activeTab === "attachments"
//                 ? "border-blue-500 text-blue-600"
//                 : "border-transparent text-slate-600 hover:text-slate-900"
//             }`}
//             onClick={() => setActiveTab("attachments")}
//           >
//             Attachments{" "}
//             {proposal.attachments &&
//               proposal.attachments.length > 0 &&
//               `(${proposal.attachments.length})`}
//           </button>
//           <button
//             className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
//               activeTab === "activity"
//                 ? "border-blue-500 text-blue-600"
//                 : "border-transparent text-slate-600 hover:text-slate-900"
//             }`}
//             onClick={() => setActiveTab("activity")}
//           >
//             Activity
//           </button>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Main Content Column */}
//           <div className="lg:col-span-2">
//             {/* Content Card */}
//             {activeTab === "content" && (
//               <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
//                 <div className="p-6 border-b border-slate-100">
//                   <div className="flex items-center justify-between">
//                     <h2 className="text-lg font-semibold text-slate-900">
//                       Proposal Content
//                     </h2>
//                   </div>
//                 </div>
//                 <div className="p-6">
//                   <div
//                     className="prose max-w-none p-6 bg-slate-50 rounded-lg border border-slate-200"
//                     dangerouslySetInnerHTML={{ __html: proposal.content }}
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Attachments Card */}
//             {activeTab === "attachments" &&
//               proposal.attachments &&
//               proposal.attachments.length > 0 && (
//                 <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
//                   <div className="p-6 border-b border-slate-100">
//                     <h2 className="text-lg font-semibold text-slate-900">
//                       Attachments
//                     </h2>
//                     <p className="text-sm text-slate-600 mt-1">
//                       Files and documents related to this proposal
//                     </p>
//                   </div>
//                   <div className="p-6">
//                     <ul className="space-y-3">
//                       {proposal.attachments.map((file, idx) => (
//                         <li
//                           key={idx}
//                           className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors group"
//                         >
//                           <div className="flex items-center">
//                             <div className="p-3 bg-blue-100 rounded-lg mr-4">
//                               <FileText size={20} className="text-blue-600" />
//                             </div>
//                             <div>
//                               <p className="text-sm font-medium text-slate-900">
//                                 {file.filename}
//                               </p>
//                               <p className="text-xs text-slate-500 mt-1">
//                                 {file.size
//                                   ? `${(file.size / 1024).toFixed(1)} KB`
//                                   : "Size unknown"}{" "}
//                                 • Uploaded{" "}
//                                 {new Date(
//                                   proposal.createdAt
//                                 ).toLocaleDateString()}
//                               </p>
//                             </div>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <a
//                               href={`http://localhost:5000/${file.path}`}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                               title="Preview"
//                             >
//                               <Eye size={18} />
//                             </a>
//                             <a
//                               href={`http://localhost:5000/${file.path}`}
//                               download
//                               className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                               title="Download"
//                             >
//                               <Download size={18} />
//                             </a>
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>
//               )}

//             {/* Details Card (Default Tab) */}
//             {activeTab === "details" && (
//               <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
//                 <div className="p-6 border-b border-slate-100">
//                   <h2 className="text-lg font-semibold text-slate-900">
//                     Proposal Details
//                   </h2>
//                   <p className="text-sm text-slate-600 mt-1">
//                     Comprehensive information about this proposal
//                   </p>
//                 </div>
//                 <div className="p-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-5">
//                       <div>
//                         <h3 className="text-sm font-medium text-slate-700 mb-3 uppercase tracking-wide">
//                           Client Information
//                         </h3>
//                         <div className="space-y-4">
//                           <div className="flex items-center text-slate-700">
//                             <User size={18} className="mr-3 text-slate-500" />
//                             <div>
//                               <p className="text-sm font-medium">Client Name</p>
//                               <p className="text-slate-900">
//                                 {proposal.dealTitle || "Not specified"}
//                               </p>
//                             </div>
//                           </div>
//                           <div className="flex items-center text-slate-700">
//                             <Building
//                               size={18}
//                               className="mr-3 text-slate-500"
//                             />
//                             <div>
//                               <p className="text-sm font-medium">Company</p>
//                               <p className="text-slate-900">
//                                 {proposal.deal?.companyName || "Not specified"}
//                               </p>
//                             </div>
//                           </div>
//                           <div className="flex items-center text-slate-700">
//                             <Mail size={18} className="mr-3 text-slate-500" />
//                             <div>
//                               <p className="text-sm font-medium">
//                                 Email Address
//                               </p>
//                               <a
//                                 href={`mailto:${proposal.email}`}
//                                 className="text-blue-600 hover:underline "
//                               >
//                                 {proposal.email}
//                               </a>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="space-y-5">
//                       <div>
//                         <h3 className="text-sm font-medium text-slate-700 mb-3 uppercase tracking-wide">
//                           Proposal Information
//                         </h3>
//                         <div className="space-y-4">
//                           <div className="flex items-center text-slate-700">
//                             <DollarSign
//                               size={18}
//                               className="mr-3 text-slate-500"
//                             />
//                             <div>
//                               <p className="text-sm font-medium">
//                                 Proposed Value
//                               </p>
//                               <p className="text-slate-900">
//                                 {proposal.value
//                                   ? `$${proposal.value.toLocaleString()}`
//                                   : "Not specified"}
//                               </p>
//                             </div>
//                           </div>
//                           <div className="flex items-center text-slate-700">
//                             <Calendar
//                               size={18}
//                               className="mr-3 text-slate-500"
//                             />
//                             <div>
//                               <p className="text-sm font-medium">
//                                 Created Date
//                               </p>
//                               <p className="text-slate-900">
//                                 {new Date(
//                                   proposal.createdAt
//                                 ).toLocaleDateString("en-US", {
//                                   weekday: "short",
//                                   year: "numeric",
//                                   month: "short",
//                                   day: "numeric",
//                                 })}
//                               </p>
//                             </div>
//                           </div>
//                           <div className="flex items-center text-slate-700">
//                             <Clock size={18} className="mr-3 text-slate-500" />
//                             <div>
//                               <p className="text-sm font-medium">
//                                 Follow-up Date
//                               </p>
//                               <p className="text-slate-900">
//                                 {proposal.followUpDate
//                                   ? new Date(
//                                       proposal.followUpDate
//                                     ).toLocaleDateString("en-US", {
//                                       weekday: "short",
//                                       year: "numeric",
//                                       month: "short",
//                                       day: "numeric",
//                                     })
//                                   : "Not scheduled"}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {proposal.notes && (
//                     <div className="mt-8 pt-6 border-t border-slate-200">
//                       <h3 className="text-sm font-medium text-slate-700 mb-3 uppercase tracking-wide">
//                         Additional Notes
//                       </h3>
//                       <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
//                         <p className="text-slate-700">{proposal.notes}</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Activity Card */}
//             {activeTab === "activity" && (
//               <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
//                 <div className="p-6 border-b border-slate-100">
//                   <h2 className="text-lg font-semibold text-slate-900">
//                     Activity Timeline
//                   </h2>
//                   <p className="text-sm text-slate-600 mt-1">
//                     Recent activities and updates for this proposal
//                   </p>
//                 </div>
//                 <div className="p-6">
//                   <div className="relative">
//                     {/* Timeline item */}
//                     <div className="flex items-start mb-8">
//                       <div className="flex-shrink-0">
//                         <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                           <FileText size={16} className="text-blue-600" />
//                         </div>
//                       </div>
//                       <div className="ml-4">
//                         <h3 className="text-sm font-medium text-slate-900">
//                           Proposal created
//                         </h3>
//                         <p className="text-sm text-slate-500 mt-1">
//                           {new Date(proposal.createdAt).toLocaleString(
//                             "en-US",
//                             { dateStyle: "medium", timeStyle: "short" }
//                           )}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Timeline item */}
//                     {proposal.followUpDate && (
//                       <div className="flex items-start mb-8">
//                         <div className="flex-shrink-0">
//                           <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
//                             <Clock size={16} className="text-amber-600" />
//                           </div>
//                         </div>
//                         <div className="ml-4">
//                           <h3 className="text-sm font-medium text-slate-900">
//                             Follow-up scheduled
//                           </h3>
//                           <p className="text-sm text-slate-500 mt-1">
//                             {new Date(proposal.followUpDate).toLocaleString(
//                               "en-US",
//                               { dateStyle: "medium", timeStyle: "short" }
//                             )}
//                           </p>
//                         </div>
//                       </div>
//                     )}

//                     {/* Timeline item */}
//                     <div className="flex items-start">
//                       <div className="flex-shrink-0">
//                         <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
//                           <StatusIcon size={16} className="text-emerald-600" />
//                         </div>
//                       </div>
//                       <div className="ml-4">
//                         <h3 className="text-sm font-medium text-slate-900">
//                           Status changed to {statusStyle.label}
//                         </h3>
//                         <p className="text-sm text-slate-500 mt-1">
//                           {new Date(
//                             proposal.updatedAt || proposal.createdAt
//                           ).toLocaleString("en-US", {
//                             dateStyle: "medium",
//                             timeStyle: "short",
//                           })}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Sidebar Column */}
//           <div className="space-y-6">
//             {/* Status Card */}
//             <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 p-5">
//               <h3 className="text-sm font-medium text-slate-700 mb-3 uppercase tracking-wide">
//                 Proposal Status
//               </h3>
//               <div
//                 className={`inline-flex items-center px-4 py-2 rounded-full ${statusStyle.bgColor} ${statusStyle.color} border ${statusStyle.borderColor} mb-4`}
//               >
//                 <StatusIcon size={16} className="mr-2" />
//                 <span className="capitalize font-medium text-sm">
//                   {statusStyle.label}
//                 </span>
//               </div>
//               <p className="text-sm text-slate-600 mt-2">
//                 Last updated{" "}
//                 {new Date(
//                   proposal.updatedAt || proposal.createdAt
//                 ).toLocaleDateString()}
//               </p>
//             </div>

//             {/* Client Card */}
//             <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 p-5">
//               <h3 className="text-sm font-medium text-slate-700 mb-4 uppercase tracking-wide">
//                 Client
//               </h3>
//               <div className="flex items-center mb-4">
//                 <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mr-3">
//                   <User size={20} className="text-slate-600" />
//                 </div>
//                 <div>
//                   <h4 className="font-medium text-slate-900">
//                     {proposal.dealTitle || "Unknown Client"}
//                   </h4>
//                   <p className="text-sm text-slate-600">
//                     {proposal.companyName || "No company"}
//                   </p>
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <a
//                   href={`mailto:${proposal.email}`}
//                   className="flex items-center text-sm text-slate-600 hover:text-blue-600 transition-colors"
//                 >
//                   <Mail size={14} className="mr-2" />
//                   {proposal.email}
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewProposal;//original




// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "axios";
// import {
//   ArrowLeft,
//   Calendar,
//   FileText,
//   Mail,
//   Paperclip,
//   Tag,
//   Clock,
//   User,
//   Building,
//   DollarSign,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   Download,
//   Eye,
//   ChevronRight,
//   Edit,
//   MoreVertical,
//   Share,
// } from "lucide-react";

// // ✅ Use env variable for server base URL (never hardcode localhost)
// const SERVER_URL = import.meta.env.VITE_SI_URI || "http://localhost:5000";

// /**
//  * Build the correct file URL from the path stored in DB.
//  * DB stores:  "uploads/leads/1772689588522-760189818.pdf"
//  * Server serves at: /uploads/leads/...  (via express.static)
//  * So final URL:  http://localhost:5000/uploads/leads/...
//  */
// const getFileUrl = (filePath) => {
//   if (!filePath) return "#";
//   // Normalize backslashes (Windows paths) to forward slashes
//   const normalized = filePath.replace(/\\/g, "/");
//   // Remove leading slash if present to avoid double slashes
//   const clean = normalized.startsWith("/") ? normalized.slice(1) : normalized;
//   return `${SERVER_URL}/${clean}`;
// };

// const ViewProposal = () => {
//   const API_URL = import.meta.env.VITE_API_URL;

//   const { id } = useParams();
//   const [proposal, setProposal] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("details");

//   useEffect(() => {
//     const fetchProposal = async () => {
//       try {
//         const res = await axios.get(`${API_URL}/proposal/${id}`);
//         setProposal(res.data);
//       } catch (err) {
//         console.error("Failed to fetch proposal:", err);
//       }
//       setLoading(false);
//     };
//     fetchProposal();
//   }, [id]);

//   const statusConfig = {
//     draft: {
//       icon: FileText,
//       color: "text-slate-700",
//       bgColor: "bg-slate-100",
//       borderColor: "border-slate-200",
//       label: "Draft",
//     },
//     sent: {
//       icon: Mail,
//       color: "text-blue-700",
//       bgColor: "bg-blue-50",
//       borderColor: "border-blue-200",
//       label: "Sent",
//     },
//     "no reply": {
//       icon: AlertCircle,
//       color: "text-amber-700",
//       bgColor: "bg-amber-50",
//       borderColor: "border-amber-200",
//       label: "No Reply",
//     },
//     rejection: {
//       icon: XCircle,
//       color: "text-rose-700",
//       bgColor: "bg-rose-50",
//       borderColor: "border-rose-200",
//       label: "Rejected",
//     },
//     success: {
//       icon: CheckCircle,
//       color: "text-emerald-700",
//       bgColor: "bg-emerald-50",
//       borderColor: "border-emerald-200",
//       label: "Accepted",
//     },
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
//         <div className="flex flex-col items-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
//           <p className="text-slate-600">Loading proposal details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!proposal) {
//     return (
//       <div className="min-h-screen flex items-center justify-center px-4">
//         <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md w-full">
//           <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <XCircle className="text-rose-600" size={32} />
//           </div>
//           <h2 className="text-2xl font-bold text-slate-800 mb-3">
//             Proposal Not Found
//           </h2>
//           <p className="text-slate-600 mb-6">
//             The proposal you're looking for doesn't exist or may have been
//             removed.
//           </p>
//           <Link
//             to="/proposal"
//             className="inline-flex items-center px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
//           >
//             <ArrowLeft size={18} className="mr-2" />
//             Back to Proposals
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const StatusIcon = statusConfig[proposal.status]?.icon || AlertCircle;
//   const statusStyle = statusConfig[proposal.status] || statusConfig.draft;

//   return (
//     <div className="min-h-screen py-8 px-4">
//       <div className="max-w-6xl mx-auto">
//         {/* Header Section */}
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
//           <div>
//             <div className="flex items-center text-slate-600 mb-3">
//               <Link
//                 to="/proposal"
//                 className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
//               >
//                 <ArrowLeft size={16} className="mr-1" />
//                 All Proposals
//               </Link>
//               <ChevronRight size={16} className="mx-2" />
//               <span className="text-slate-500">View Proposal</span>
//             </div>
//             <div className="flex items-center gap-4">
//               <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
//                 {proposal.title}
//               </h1>
//               <div
//                 className={`inline-flex items-center px-4 py-2 rounded-full ${statusStyle.bgColor} ${statusStyle.color} border ${statusStyle.borderColor}`}
//               >
//                 <StatusIcon size={16} className="mr-2" />
//                 <span className="capitalize font-medium text-sm">
//                   {statusStyle.label}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Tab Navigation */}
//         <div className="flex border-b border-slate-200 mb-6">
//           <button
//             className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
//               activeTab === "details"
//                 ? "border-blue-500 text-blue-600"
//                 : "border-transparent text-slate-600 hover:text-slate-900"
//             }`}
//             onClick={() => setActiveTab("details")}
//           >
//             Details
//           </button>
//           <button
//             className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
//               activeTab === "content"
//                 ? "border-blue-500 text-blue-600"
//                 : "border-transparent text-slate-600 hover:text-slate-900"
//             }`}
//             onClick={() => setActiveTab("content")}
//           >
//             Content
//           </button>
//           <button
//             className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
//               activeTab === "attachments"
//                 ? "border-blue-500 text-blue-600"
//                 : "border-transparent text-slate-600 hover:text-slate-900"
//             }`}
//             onClick={() => setActiveTab("attachments")}
//           >
//             Attachments{" "}
//             {proposal.attachments &&
//               proposal.attachments.length > 0 &&
//               `(${proposal.attachments.length})`}
//           </button>
//           <button
//             className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
//               activeTab === "activity"
//                 ? "border-blue-500 text-blue-600"
//                 : "border-transparent text-slate-600 hover:text-slate-900"
//             }`}
//             onClick={() => setActiveTab("activity")}
//           >
//             Activity
//           </button>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Main Content Column */}
//           <div className="lg:col-span-2">
//             {/* Content Card */}
//             {activeTab === "content" && (
//               <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
//                 <div className="p-6 border-b border-slate-100">
//                   <div className="flex items-center justify-between">
//                     <h2 className="text-lg font-semibold text-slate-900">
//                       Proposal Content
//                     </h2>
//                   </div>
//                 </div>
//                 <div className="p-6">
//                   <div
//                     className="prose max-w-none p-6 bg-slate-50 rounded-lg border border-slate-200"
//                     dangerouslySetInnerHTML={{ __html: proposal.content }}
//                   />
//                 </div>
//               </div>
//             )}

//             {/* ✅ FIXED: Attachments Card - using getFileUrl() helper */}
//             {activeTab === "attachments" &&
//               proposal.attachments &&
//               proposal.attachments.length > 0 && (
//                 <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
//                   <div className="p-6 border-b border-slate-100">
//                     <h2 className="text-lg font-semibold text-slate-900">
//                       Attachments
//                     </h2>
//                     <p className="text-sm text-slate-600 mt-1">
//                       Files and documents related to this proposal
//                     </p>
//                   </div>
//                   <div className="p-6">
//                     <ul className="space-y-3">
//                       {proposal.attachments.map((file, idx) => {
//                         // ✅ Build correct URL using helper
//                         const fileUrl = getFileUrl(file.path);

//                         return (
//                           <li
//                             key={idx}
//                             className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors group"
//                           >
//                             <div className="flex items-center">
//                               <div className="p-3 bg-blue-100 rounded-lg mr-4">
//                                 <FileText size={20} className="text-blue-600" />
//                               </div>
//                               <div>
//                                 <p className="text-sm font-medium text-slate-900">
//                                   {file.filename}
//                                 </p>
//                                 <p className="text-xs text-slate-500 mt-1">
//                                   {file.size
//                                     ? `${(file.size / 1024).toFixed(1)} KB`
//                                     : "Size unknown"}{" "}
//                                   • Uploaded{" "}
//                                   {new Date(
//                                     proposal.createdAt
//                                   ).toLocaleDateString()}
//                                 </p>
//                                 {/* ✅ Debug: show resolved URL in dev */}
//                                 {import.meta.env.DEV && (
//                                   <p className="text-xs text-slate-400 mt-0.5 break-all">
//                                     {fileUrl}
//                                   </p>
//                                 )}
//                               </div>
//                             </div>
//                             <div className="flex items-center gap-2">
//                               {/* ✅ Preview - opens in new tab */}
//                               <a
//                                 href={fileUrl}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                                 title="Preview"
//                               >
//                                 <Eye size={18} />
//                               </a>
//                               {/* ✅ Download - forces download */}
//                               <a
//                                 href={fileUrl}
//                                 download={file.filename}
//                                 className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                                 title="Download"
//                                 onClick={(e) => {
//                                   // For cross-origin files, fetch and create blob URL
//                                   e.preventDefault();
//                                   fetch(fileUrl)
//                                     .then((res) => res.blob())
//                                     .then((blob) => {
//                                       const url = URL.createObjectURL(blob);
//                                       const a = document.createElement("a");
//                                       a.href = url;
//                                       a.download = file.filename;
//                                       document.body.appendChild(a);
//                                       a.click();
//                                       document.body.removeChild(a);
//                                       URL.revokeObjectURL(url);
//                                     })
//                                     .catch(() => {
//                                       // Fallback: open in new tab
//                                       window.open(fileUrl, "_blank");
//                                     });
//                                 }}
//                               >
//                                 <Download size={18} />
//                               </a>
//                             </div>
//                           </li>
//                         );
//                       })}
//                     </ul>
//                   </div>
//                 </div>
//               )}

//             {/* Empty attachments state */}
//             {activeTab === "attachments" &&
//               (!proposal.attachments || proposal.attachments.length === 0) && (
//                 <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
//                   <div className="p-12 text-center">
//                     <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                       <Paperclip size={24} className="text-slate-400" />
//                     </div>
//                     <h3 className="text-slate-700 font-medium mb-1">
//                       No attachments
//                     </h3>
//                     <p className="text-sm text-slate-500">
//                       No files were attached to this proposal.
//                     </p>
//                   </div>
//                 </div>
//               )}

//             {/* Details Card (Default Tab) */}
//             {activeTab === "details" && (
//               <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
//                 <div className="p-6 border-b border-slate-100">
//                   <h2 className="text-lg font-semibold text-slate-900">
//                     Proposal Details
//                   </h2>
//                   <p className="text-sm text-slate-600 mt-1">
//                     Comprehensive information about this proposal
//                   </p>
//                 </div>
//                 <div className="p-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-5">
//                       <div>
//                         <h3 className="text-sm font-medium text-slate-700 mb-3 uppercase tracking-wide">
//                           Client Information
//                         </h3>
//                         <div className="space-y-4">
//                           <div className="flex items-center text-slate-700">
//                             <User size={18} className="mr-3 text-slate-500" />
//                             <div>
//                               <p className="text-sm font-medium">Client Name</p>
//                               <p className="text-slate-900">
//                                 {proposal.dealTitle || "Not specified"}
//                               </p>
//                             </div>
//                           </div>
//                           <div className="flex items-center text-slate-700">
//                             <Building
//                               size={18}
//                               className="mr-3 text-slate-500"
//                             />
//                             <div>
//                               <p className="text-sm font-medium">Company</p>
//                               <p className="text-slate-900">
//                                 {proposal.deal?.companyName || "Not specified"}
//                               </p>
//                             </div>
//                           </div>
//                           <div className="flex items-center text-slate-700">
//                             <Mail size={18} className="mr-3 text-slate-500" />
//                             <div>
//                               <p className="text-sm font-medium">
//                                 Email Address
//                               </p>
//                               <a
//                                 href={`mailto:${proposal.email}`}
//                                 className="text-blue-600 hover:underline"
//                               >
//                                 {proposal.email}
//                               </a>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="space-y-5">
//                       <div>
//                         <h3 className="text-sm font-medium text-slate-700 mb-3 uppercase tracking-wide">
//                           Proposal Information
//                         </h3>
//                         <div className="space-y-4">
//                           <div className="flex items-center text-slate-700">
//                             <DollarSign
//                               size={18}
//                               className="mr-3 text-slate-500"
//                             />
//                             <div>
//                               <p className="text-sm font-medium">
//                                 Proposed Value
//                               </p>
//                               <p className="text-slate-900">
//                                 {proposal.value
//                                   ? `$${proposal.value.toLocaleString()}`
//                                   : "Not specified"}
//                               </p>
//                             </div>
//                           </div>
//                           <div className="flex items-center text-slate-700">
//                             <Calendar
//                               size={18}
//                               className="mr-3 text-slate-500"
//                             />
//                             <div>
//                               <p className="text-sm font-medium">
//                                 Created Date
//                               </p>
//                               <p className="text-slate-900">
//                                 {new Date(
//                                   proposal.createdAt
//                                 ).toLocaleDateString("en-US", {
//                                   weekday: "short",
//                                   year: "numeric",
//                                   month: "short",
//                                   day: "numeric",
//                                 })}
//                               </p>
//                             </div>
//                           </div>
//                           <div className="flex items-center text-slate-700">
//                             <Clock size={18} className="mr-3 text-slate-500" />
//                             <div>
//                               <p className="text-sm font-medium">
//                                 Follow-up Date
//                               </p>
//                               <p className="text-slate-900">
//                                 {proposal.followUpDate
//                                   ? new Date(
//                                       proposal.followUpDate
//                                     ).toLocaleDateString("en-US", {
//                                       weekday: "short",
//                                       year: "numeric",
//                                       month: "short",
//                                       day: "numeric",
//                                     })
//                                   : "Not scheduled"}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {proposal.notes && (
//                     <div className="mt-8 pt-6 border-t border-slate-200">
//                       <h3 className="text-sm font-medium text-slate-700 mb-3 uppercase tracking-wide">
//                         Additional Notes
//                       </h3>
//                       <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
//                         <p className="text-slate-700">{proposal.notes}</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Activity Card */}
//             {activeTab === "activity" && (
//               <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
//                 <div className="p-6 border-b border-slate-100">
//                   <h2 className="text-lg font-semibold text-slate-900">
//                     Activity Timeline
//                   </h2>
//                   <p className="text-sm text-slate-600 mt-1">
//                     Recent activities and updates for this proposal
//                   </p>
//                 </div>
//                 <div className="p-6">
//                   <div className="relative">
//                     <div className="flex items-start mb-8">
//                       <div className="flex-shrink-0">
//                         <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                           <FileText size={16} className="text-blue-600" />
//                         </div>
//                       </div>
//                       <div className="ml-4">
//                         <h3 className="text-sm font-medium text-slate-900">
//                           Proposal created
//                         </h3>
//                         <p className="text-sm text-slate-500 mt-1">
//                           {new Date(proposal.createdAt).toLocaleString(
//                             "en-US",
//                             { dateStyle: "medium", timeStyle: "short" }
//                           )}
//                         </p>
//                       </div>
//                     </div>

//                     {proposal.followUpDate && (
//                       <div className="flex items-start mb-8">
//                         <div className="flex-shrink-0">
//                           <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
//                             <Clock size={16} className="text-amber-600" />
//                           </div>
//                         </div>
//                         <div className="ml-4">
//                           <h3 className="text-sm font-medium text-slate-900">
//                             Follow-up scheduled
//                           </h3>
//                           <p className="text-sm text-slate-500 mt-1">
//                             {new Date(proposal.followUpDate).toLocaleString(
//                               "en-US",
//                               { dateStyle: "medium", timeStyle: "short" }
//                             )}
//                           </p>
//                         </div>
//                       </div>
//                     )}

//                     <div className="flex items-start">
//                       <div className="flex-shrink-0">
//                         <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
//                           <StatusIcon size={16} className="text-emerald-600" />
//                         </div>
//                       </div>
//                       <div className="ml-4">
//                         <h3 className="text-sm font-medium text-slate-900">
//                           Status changed to {statusStyle.label}
//                         </h3>
//                         <p className="text-sm text-slate-500 mt-1">
//                           {new Date(
//                             proposal.updatedAt || proposal.createdAt
//                           ).toLocaleString("en-US", {
//                             dateStyle: "medium",
//                             timeStyle: "short",
//                           })}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Sidebar Column */}
//           <div className="space-y-6">
//             {/* Status Card */}
//             <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 p-5">
//               <h3 className="text-sm font-medium text-slate-700 mb-3 uppercase tracking-wide">
//                 Proposal Status
//               </h3>
//               <div
//                 className={`inline-flex items-center px-4 py-2 rounded-full ${statusStyle.bgColor} ${statusStyle.color} border ${statusStyle.borderColor} mb-4`}
//               >
//                 <StatusIcon size={16} className="mr-2" />
//                 <span className="capitalize font-medium text-sm">
//                   {statusStyle.label}
//                 </span>
//               </div>
//               <p className="text-sm text-slate-600 mt-2">
//                 Last updated{" "}
//                 {new Date(
//                   proposal.updatedAt || proposal.createdAt
//                 ).toLocaleDateString()}
//               </p>
//             </div>

//             {/* Client Card */}
//             <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 p-5">
//               <h3 className="text-sm font-medium text-slate-700 mb-4 uppercase tracking-wide">
//                 Client
//               </h3>
//               <div className="flex items-center mb-4">
//                 <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mr-3">
//                   <User size={20} className="text-slate-600" />
//                 </div>
//                 <div>
//                   <h4 className="font-medium text-slate-900">
//                     {proposal.dealTitle || "Unknown Client"}
//                   </h4>
//                   <p className="text-sm text-slate-600">
//                     {proposal.companyName || "No company"}
//                   </p>
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <a
//                   href={`mailto:${proposal.email}`}
//                   className="flex items-center text-sm text-slate-600 hover:text-blue-600 transition-colors"
//                 >
//                   <Mail size={14} className="mr-2" />
//                   {proposal.email}
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewProposal;//working correctly..



// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "axios";
// import {
//   ArrowLeft,
//   Calendar,
//   FileText,
//   Mail,
//   Paperclip,
//   Clock,
//   User,
//   Building,
//   DollarSign,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   Download,
//   Eye,
//   ChevronRight,
//   X,
//   ZoomIn,
//   ZoomOut,
//   RotateCw,
// } from "lucide-react";

// const SERVER_URL = import.meta.env.VITE_SI_URI || "http://localhost:5000";

// const getFileUrl = (filePath) => {
//   if (!filePath) return "#";
//   const normalized = filePath.replace(/\\/g, "/");
//   const clean = normalized.startsWith("/") ? normalized.slice(1) : normalized;
//   return `${SERVER_URL}/${clean}`;
// };

// const getFileExtension = (filename) => {
//   if (!filename) return "";
//   return filename.split(".").pop().toLowerCase();
// };

// const getFileType = (filename, mimetype) => {
//   const ext = getFileExtension(filename);
//   if (["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(ext)) return "image";
//   if (ext === "pdf") return "pdf";
//   if (["mp4", "webm", "ogg"].includes(ext)) return "video";
//   if (["mp3", "wav"].includes(ext)) return "audio";
//   if (mimetype?.startsWith("image/")) return "image";
//   if (mimetype === "application/pdf") return "pdf";
//   return "other";
// };

// // ─── Preview Modal ────────────────────────────────────────────────────────────
// const PreviewModal = ({ file, onClose }) => {
//   const [zoom, setZoom] = useState(1);
//   const [rotation, setRotation] = useState(0);

//   if (!file) return null;

//   const fileUrl = getFileUrl(file.path);
//   const fileType = getFileType(file.filename, file.mimetype);

//   const handleDownload = () => {
//     fetch(fileUrl)
//       .then((res) => res.blob())
//       .then((blob) => {
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = file.filename;
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//         URL.revokeObjectURL(url);
//       })
//       .catch(() => window.open(fileUrl, "_blank"));
//   };

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center"
//       style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//       <div
//         className="relative bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
//         style={{ width: "min(92vw, 1000px)", height: "min(92vh, 800px)" }}
//       >
//         {/* Modal Header */}
//         <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50 flex-shrink-0">
//           <div className="flex items-center gap-3 min-w-0">
//             <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
//               <FileText size={18} className="text-blue-600" />
//             </div>
//             <div className="min-w-0">
//               <p className="text-sm font-semibold text-slate-900 truncate">{file.filename}</p>
//               <p className="text-xs text-slate-500">
//                 {file.size ? `${(file.size / 1024).toFixed(1)} KB` : ""}
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-1 flex-shrink-0 ml-3">
//             {fileType === "image" && (
//               <>
//                 <button
//                   onClick={() => setZoom((z) => Math.max(0.25, z - 0.25))}
//                   className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                   title="Zoom out"
//                 >
//                   <ZoomOut size={16} />
//                 </button>
//                 <span className="text-xs text-slate-500 w-10 text-center font-medium">
//                   {Math.round(zoom * 100)}%
//                 </span>
//                 <button
//                   onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
//                   className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                   title="Zoom in"
//                 >
//                   <ZoomIn size={16} />
//                 </button>
//                 <button
//                   onClick={() => setRotation((r) => (r + 90) % 360)}
//                   className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                   title="Rotate"
//                 >
//                   <RotateCw size={16} />
//                 </button>
//                 <div className="w-px h-5 bg-slate-200 mx-1" />
//               </>
//             )}
//             <button
//               onClick={handleDownload}
//               className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
//               title="Download"
//             >
//               <Download size={16} />
//             </button>
//             <button
//               onClick={onClose}
//               className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
//               title="Close"
//             >
//               <X size={18} />
//             </button>
//           </div>
//         </div>

//         {/* Modal Body */}
//         <div className="flex-1 overflow-auto flex items-center justify-center bg-slate-100 p-4">
//           {fileType === "image" && (
//             <img
//               src={fileUrl}
//               alt={file.filename}
//               style={{
//                 transform: `scale(${zoom}) rotate(${rotation}deg)`,
//                 transition: "transform 0.2s ease",
//                 maxWidth: "100%",
//                 maxHeight: "100%",
//                 objectFit: "contain",
//                 borderRadius: "8px",
//                 boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
//               }}
//             />
//           )}

//           {fileType === "pdf" && (
//             <iframe
//               src={`${fileUrl}#toolbar=1&navpanes=0`}
//               title={file.filename}
//               className="w-full h-full rounded-lg border-0"
//               style={{ minHeight: "500px" }}
//             />
//           )}

//           {fileType === "video" && (
//             <video
//               src={fileUrl}
//               controls
//               className="max-w-full max-h-full rounded-lg shadow-lg"
//               style={{ maxHeight: "calc(100% - 16px)" }}
//             />
//           )}

//           {fileType === "audio" && (
//             <div className="flex flex-col items-center gap-6 p-8">
//               <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
//                 <FileText size={40} className="text-blue-500" />
//               </div>
//               <p className="text-slate-700 font-medium">{file.filename}</p>
//               <audio src={fileUrl} controls className="w-72" />
//             </div>
//           )}

//           {fileType === "other" && (
//             <div className="flex flex-col items-center gap-6 p-8 text-center">
//               <div className="w-24 h-24 bg-slate-200 rounded-2xl flex items-center justify-center">
//                 <FileText size={40} className="text-slate-500" />
//               </div>
//               <div>
//                 <p className="text-slate-800 font-semibold text-lg mb-1">{file.filename}</p>
//                 <p className="text-slate-500 text-sm mb-6">
//                   This file type cannot be previewed in the browser.
//                 </p>
//                 <button
//                   onClick={handleDownload}
//                   className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-md"
//                 >
//                   <Download size={18} />
//                   Download File
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─── Main Component ───────────────────────────────────────────────────────────
// const ViewProposal = () => {
//   const API_URL = import.meta.env.VITE_API_URL;
//   const { id } = useParams();
//   const [proposal, setProposal] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("details");
//   const [previewFile, setPreviewFile] = useState(null);

//   useEffect(() => {
//     const fetchProposal = async () => {
//       try {
//         const res = await axios.get(`${API_URL}/proposal/${id}`);
//         setProposal(res.data);
//       } catch (err) {
//         console.error("Failed to fetch proposal:", err);
//       }
//       setLoading(false);
//     };
//     fetchProposal();
//   }, [id]);

//   // Close modal on Escape key
//   useEffect(() => {
//     const handler = (e) => e.key === "Escape" && setPreviewFile(null);
//     window.addEventListener("keydown", handler);
//     return () => window.removeEventListener("keydown", handler);
//   }, []);

//   const statusConfig = {
//     draft: { icon: FileText, color: "text-slate-700", bgColor: "bg-slate-100", borderColor: "border-slate-200", label: "Draft" },
//     sent: { icon: Mail, color: "text-blue-700", bgColor: "bg-blue-50", borderColor: "border-blue-200", label: "Sent" },
//     "no reply": { icon: AlertCircle, color: "text-amber-700", bgColor: "bg-amber-50", borderColor: "border-amber-200", label: "No Reply" },
//     rejection: { icon: XCircle, color: "text-rose-700", bgColor: "bg-rose-50", borderColor: "border-rose-200", label: "Rejected" },
//     success: { icon: CheckCircle, color: "text-emerald-700", bgColor: "bg-emerald-50", borderColor: "border-emerald-200", label: "Accepted" },
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
//         <div className="flex flex-col items-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
//           <p className="text-slate-600">Loading proposal details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!proposal) {
//     return (
//       <div className="min-h-screen flex items-center justify-center px-4">
//         <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md w-full">
//           <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <XCircle className="text-rose-600" size={32} />
//           </div>
//           <h2 className="text-2xl font-bold text-slate-800 mb-3">Proposal Not Found</h2>
//           <p className="text-slate-600 mb-6">
//             The proposal you're looking for doesn't exist or may have been removed.
//           </p>
//           <Link
//             to="/proposal"
//             className="inline-flex items-center px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
//           >
//             <ArrowLeft size={18} className="mr-2" />
//             Back to Proposals
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const StatusIcon = statusConfig[proposal.status]?.icon || AlertCircle;
//   const statusStyle = statusConfig[proposal.status] || statusConfig.draft;

//   const tabs = [
//     { key: "details", label: "Details" },
//     { key: "content", label: "Content" },
//     {
//       key: "attachments",
//       label: `Attachments${proposal.attachments?.length > 0 ? ` (${proposal.attachments.length})` : ""}`,
//     },
//     { key: "activity", label: "Activity" },
//   ];

//   return (
//     <>
//       {/* Preview Modal — renders on top of everything */}
//       {previewFile && (
//         <PreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
//       )}

//       <div className="min-h-screen py-8 px-4">
//         <div className="max-w-6xl mx-auto">

//           {/* Header */}
//           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
//             <div>
//               <div className="flex items-center text-slate-600 mb-3">
//                 <Link
//                   to="/proposal"
//                   className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
//                 >
//                   <ArrowLeft size={16} className="mr-1" />
//                   All Proposals
//                 </Link>
//                 <ChevronRight size={16} className="mx-2" />
//                 <span className="text-slate-500">View Proposal</span>
//               </div>
//               <div className="flex items-center gap-4 flex-wrap">
//                 <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{proposal.title}</h1>
//                 <div className={`inline-flex items-center px-4 py-2 rounded-full ${statusStyle.bgColor} ${statusStyle.color} border ${statusStyle.borderColor}`}>
//                   <StatusIcon size={16} className="mr-2" />
//                   <span className="capitalize font-medium text-sm">{statusStyle.label}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Tabs */}
//           <div className="flex border-b border-slate-200 mb-6">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.key}
//                 className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
//                   activeTab === tab.key
//                     ? "border-blue-500 text-blue-600"
//                     : "border-transparent text-slate-600 hover:text-slate-900"
//                 }`}
//                 onClick={() => setActiveTab(tab.key)}
//               >
//                 {tab.label}
//               </button>
//             ))}
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-2">

//               {/* Content Tab */}
//               {activeTab === "content" && (
//                 <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
//                   <div className="p-6 border-b border-slate-100">
//                     <h2 className="text-lg font-semibold text-slate-900">Proposal Content</h2>
//                   </div>
//                   <div className="p-6">
//                     <div
//                       className="prose max-w-none p-6 bg-slate-50 rounded-lg border border-slate-200"
//                       dangerouslySetInnerHTML={{ __html: proposal.content }}
//                     />
//                   </div>
//                 </div>
//               )}

//               {/* Attachments Tab */}
//               {activeTab === "attachments" && (
//                 <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
//                   <div className="p-6 border-b border-slate-100">
//                     <h2 className="text-lg font-semibold text-slate-900">Attachments</h2>
//                     <p className="text-sm text-slate-600 mt-1">Files and documents related to this proposal</p>
//                   </div>
//                   <div className="p-6">
//                     {proposal.attachments && proposal.attachments.length > 0 ? (
//                       <ul className="space-y-3">
//                         {proposal.attachments.map((file, idx) => {
//                           const ext = getFileExtension(file.filename);
//                           const extColors = {
//                             pdf: "bg-rose-100 text-rose-700",
//                             jpg: "bg-emerald-100 text-emerald-700",
//                             jpeg: "bg-emerald-100 text-emerald-700",
//                             png: "bg-emerald-100 text-emerald-700",
//                             gif: "bg-emerald-100 text-emerald-700",
//                             webp: "bg-emerald-100 text-emerald-700",
//                             doc: "bg-blue-100 text-blue-700",
//                             docx: "bg-blue-100 text-blue-700",
//                             xls: "bg-green-100 text-green-700",
//                             xlsx: "bg-green-100 text-green-700",
//                             ppt: "bg-orange-100 text-orange-700",
//                             pptx: "bg-orange-100 text-orange-700",
//                           };
//                           const badgeColor = extColors[ext] || "bg-slate-100 text-slate-600";

//                           const handleDownload = () => {
//                             const fileUrl = getFileUrl(file.path);
//                             fetch(fileUrl)
//                               .then((res) => res.blob())
//                               .then((blob) => {
//                                 const url = URL.createObjectURL(blob);
//                                 const a = document.createElement("a");
//                                 a.href = url;
//                                 a.download = file.filename;
//                                 document.body.appendChild(a);
//                                 a.click();
//                                 document.body.removeChild(a);
//                                 URL.revokeObjectURL(url);
//                               })
//                               .catch(() => window.open(getFileUrl(file.path), "_blank"));
//                           };

//                           return (
//                             <li
//                               key={idx}
//                               className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-white hover:shadow-sm transition-all"
//                             >
//                               <div className="flex items-center min-w-0">
//                                 <div className="p-3 bg-blue-100 rounded-xl mr-4 flex-shrink-0">
//                                   <FileText size={20} className="text-blue-600" />
//                                 </div>
//                                 <div className="min-w-0">
//                                   <div className="flex items-center gap-2 flex-wrap">
//                                     <p className="text-sm font-medium text-slate-900 truncate">
//                                       {file.filename}
//                                     </p>
//                                     <span className={`text-xs font-semibold px-2 py-0.5 rounded-full uppercase ${badgeColor}`}>
//                                       {ext}
//                                     </span>
//                                   </div>
//                                   <p className="text-xs text-slate-500 mt-0.5">
//                                     {file.size ? `${(file.size / 1024).toFixed(1)} KB` : "Size unknown"} •{" "}
//                                     Uploaded {new Date(proposal.createdAt).toLocaleDateString()}
//                                   </p>
//                                 </div>
//                               </div>

//                               <div className="flex items-center gap-1 flex-shrink-0 ml-3">
//                                 {/* ✅ Preview — opens modal on same page */}
//                                 <button
//                                   onClick={() => setPreviewFile(file)}
//                                   className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
//                                 >
//                                   <Eye size={15} />
//                                   Preview
//                                 </button>

//                                 {/* Download */}
//                                 <button
//                                   onClick={handleDownload}
//                                   className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-200"
//                                 >
//                                   <Download size={15} />
//                                   Download
//                                 </button>
//                               </div>
//                             </li>
//                           );
//                         })}
//                       </ul>
//                     ) : (
//                       <div className="py-12 text-center">
//                         <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                           <Paperclip size={24} className="text-slate-400" />
//                         </div>
//                         <h3 className="text-slate-700 font-medium mb-1">No attachments</h3>
//                         <p className="text-sm text-slate-500">No files were attached to this proposal.</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Details Tab */}
//               {activeTab === "details" && (
//                 <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
//                   <div className="p-6 border-b border-slate-100">
//                     <h2 className="text-lg font-semibold text-slate-900">Proposal Details</h2>
//                     <p className="text-sm text-slate-600 mt-1">Comprehensive information about this proposal</p>
//                   </div>
//                   <div className="p-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <h3 className="text-sm font-medium text-slate-700 mb-3 uppercase tracking-wide">
//                           Client Information
//                         </h3>
//                         <div className="space-y-4">
//                           <div className="flex items-center text-slate-700">
//                             <User size={18} className="mr-3 text-slate-500" />
//                             <div>
//                               <p className="text-sm font-medium">Client Name</p>
//                               <p className="text-slate-900">{proposal.dealTitle || "Not specified"}</p>
//                             </div>
//                           </div>
//                           <div className="flex items-center text-slate-700">
//                             <Building size={18} className="mr-3 text-slate-500" />
//                             <div>
//                               <p className="text-sm font-medium">Company</p>
//                               <p className="text-slate-900">{proposal.deal?.companyName || "Not specified"}</p>
//                             </div>
//                           </div>
//                           <div className="flex items-center text-slate-700">
//                             <Mail size={18} className="mr-3 text-slate-500" />
//                             <div>
//                               <p className="text-sm font-medium">Email Address</p>
//                               <a href={`mailto:${proposal.email}`} className="text-blue-600 hover:underline">
//                                 {proposal.email}
//                               </a>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       <div>
//                         <h3 className="text-sm font-medium text-slate-700 mb-3 uppercase tracking-wide">
//                           Proposal Information
//                         </h3>
//                         <div className="space-y-4">
//                           <div className="flex items-center text-slate-700">
//                             <DollarSign size={18} className="mr-3 text-slate-500" />
//                             <div>
//                               <p className="text-sm font-medium">Proposed Value</p>
//                               <p className="text-slate-900">
//                                 {proposal.value ? `$${proposal.value.toLocaleString()}` : "Not specified"}
//                               </p>
//                             </div>
//                           </div>
//                           <div className="flex items-center text-slate-700">
//                             <Calendar size={18} className="mr-3 text-slate-500" />
//                             <div>
//                               <p className="text-sm font-medium">Created Date</p>
//                               <p className="text-slate-900">
//                                 {new Date(proposal.createdAt).toLocaleDateString("en-US", {
//                                   weekday: "short", year: "numeric", month: "short", day: "numeric",
//                                 })}
//                               </p>
//                             </div>
//                           </div>
//                           <div className="flex items-center text-slate-700">
//                             <Clock size={18} className="mr-3 text-slate-500" />
//                             <div>
//                               <p className="text-sm font-medium">Follow-up Date</p>
//                               <p className="text-slate-900">
//                                 {proposal.followUpDate
//                                   ? new Date(proposal.followUpDate).toLocaleDateString("en-US", {
//                                       weekday: "short", year: "numeric", month: "short", day: "numeric",
//                                     })
//                                   : "Not scheduled"}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     {proposal.notes && (
//                       <div className="mt-8 pt-6 border-t border-slate-200">
//                         <h3 className="text-sm font-medium text-slate-700 mb-3 uppercase tracking-wide">
//                           Additional Notes
//                         </h3>
//                         <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
//                           <p className="text-slate-700">{proposal.notes}</p>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Activity Tab */}
//               {activeTab === "activity" && (
//                 <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
//                   <div className="p-6 border-b border-slate-100">
//                     <h2 className="text-lg font-semibold text-slate-900">Activity Timeline</h2>
//                     <p className="text-sm text-slate-600 mt-1">Recent activities and updates for this proposal</p>
//                   </div>
//                   <div className="p-6">
//                     <div className="flex items-start mb-8">
//                       <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
//                         <FileText size={16} className="text-blue-600" />
//                       </div>
//                       <div className="ml-4">
//                         <h3 className="text-sm font-medium text-slate-900">Proposal created</h3>
//                         <p className="text-sm text-slate-500 mt-1">
//                           {new Date(proposal.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
//                         </p>
//                       </div>
//                     </div>
//                     {proposal.followUpDate && (
//                       <div className="flex items-start mb-8">
//                         <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
//                           <Clock size={16} className="text-amber-600" />
//                         </div>
//                         <div className="ml-4">
//                           <h3 className="text-sm font-medium text-slate-900">Follow-up scheduled</h3>
//                           <p className="text-sm text-slate-500 mt-1">
//                             {new Date(proposal.followUpDate).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
//                           </p>
//                         </div>
//                       </div>
//                     )}
//                     <div className="flex items-start">
//                       <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
//                         <StatusIcon size={16} className="text-emerald-600" />
//                       </div>
//                       <div className="ml-4">
//                         <h3 className="text-sm font-medium text-slate-900">
//                           Status changed to {statusStyle.label}
//                         </h3>
//                         <p className="text-sm text-slate-500 mt-1">
//                           {new Date(proposal.updatedAt || proposal.createdAt).toLocaleString("en-US", {
//                             dateStyle: "medium", timeStyle: "short",
//                           })}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Sidebar */}
//             <div className="space-y-6">
//               <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 p-5">
//                 <h3 className="text-sm font-medium text-slate-700 mb-3 uppercase tracking-wide">
//                   Proposal Status
//                 </h3>
//                 <div className={`inline-flex items-center px-4 py-2 rounded-full ${statusStyle.bgColor} ${statusStyle.color} border ${statusStyle.borderColor} mb-4`}>
//                   <StatusIcon size={16} className="mr-2" />
//                   <span className="capitalize font-medium text-sm">{statusStyle.label}</span>
//                 </div>
//                 <p className="text-sm text-slate-600 mt-2">
//                   Last updated {new Date(proposal.updatedAt || proposal.createdAt).toLocaleDateString()}
//                 </p>
//               </div>

//               <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 p-5">
//                 <h3 className="text-sm font-medium text-slate-700 mb-4 uppercase tracking-wide">Client</h3>
//                 <div className="flex items-center mb-4">
//                   <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mr-3">
//                     <User size={20} className="text-slate-600" />
//                   </div>
//                   <div>
//                     <h4 className="font-medium text-slate-900">{proposal.dealTitle || "Unknown Client"}</h4>
//                     <p className="text-sm text-slate-600">{proposal.companyName || "No company"}</p>
//                   </div>
//                 </div>
//                 <a
//                   href={`mailto:${proposal.email}`}
//                   className="flex items-center text-sm text-slate-600 hover:text-blue-600 transition-colors"
//                 >
//                   <Mail size={14} className="mr-2" />
//                   {proposal.email}
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ViewProposal;





import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Mail,
  Paperclip,
  Clock,
  User,
  Building,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Eye,
  ChevronRight,
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  AlertTriangle,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SERVER_URL = (import.meta.env.VITE_SI_URI || "http://localhost:5000").replace(/\/+$/, "");

/**
 * Build a clean file URL from the path stored in DB.
 *
 * DB may store any of these (all must produce the same result):
 *   "uploads/leads/file.pdf"      → http://server/uploads/leads/file.pdf  ✅
 *   "/uploads/leads/file.pdf"     → http://server/uploads/leads/file.pdf  ✅
 *   "\\uploads\\leads\\file.pdf"  → http://server/uploads/leads/file.pdf  ✅
 */
const getFileUrl = (filePath) => {
  if (!filePath) return "";
  const normalized = filePath
    .replace(/\\/g, "/")   // backslash → forward slash (Windows)
    .replace(/^\/+/, "");  // strip ALL leading slashes
  return `${SERVER_URL}/${normalized}`;
};

const getFileExtension = (filename) => {
  if (!filename) return "";
  return filename.split(".").pop().toLowerCase();
};

const getFileType = (filename, mimetype) => {
  const ext = getFileExtension(filename);
  if (["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(ext)) return "image";
  if (ext === "pdf") return "pdf";
  if (["mp4", "webm", "ogv"].includes(ext)) return "video";
  if (["mp3", "wav", "oga"].includes(ext)) return "audio";
  if (mimetype?.startsWith("image/")) return "image";
  if (mimetype === "application/pdf") return "pdf";
  return "other";
};

/**
 * Download helper — uses fetch+blob so the browser always saves the file
 * instead of opening it (works cross-origin too).
 */
const downloadFile = (fileUrl, filename) => {
  fetch(fileUrl, { mode: "cors" })
    .then((res) => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.blob();
    })
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    })
    .catch(() => {
      // Fallback: open in new tab
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    });
};

// ─── Preview Modal ────────────────────────────────────────────────────────────
const PreviewModal = ({ file, onClose }) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);

  if (!file) return null;

  const fileUrl = getFileUrl(file.path);
  const fileType = getFileType(file.filename, file.mimetype);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.80)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ width: "min(94vw, 1050px)", height: "min(94vh, 820px)" }}
      >
        {/* ── Modal Header ── */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-white flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <FileText size={16} className="text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate max-w-xs md:max-w-lg">
                {file.filename}
              </p>
              <p className="text-xs text-slate-400">
                {file.size ? `${(file.size / 1024).toFixed(1)} KB` : ""}
                {fileUrl && (
                  <span className="ml-2 font-mono text-slate-300 hidden lg:inline">
                    {fileUrl}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-0.5 flex-shrink-0 ml-2">
            {/* Image controls */}
            {fileType === "image" && (
              <>
                <button onClick={() => setZoom((z) => Math.max(0.25, +(z - 0.25).toFixed(2)))}
                  className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Zoom out">
                  <ZoomOut size={16} />
                </button>
                <span className="text-xs text-slate-500 w-12 text-center font-medium tabular-nums">
                  {Math.round(zoom * 100)}%
                </span>
                <button onClick={() => setZoom((z) => Math.min(4, +(z + 0.25).toFixed(2)))}
                  className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Zoom in">
                  <ZoomIn size={16} />
                </button>
                <button onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Rotate 90°">
                  <RotateCw size={16} />
                </button>
                <button onClick={() => { setZoom(1); setRotation(0); }}
                  className="px-2 py-1.5 text-xs text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Reset">
                  Reset
                </button>
                <div className="w-px h-5 bg-slate-200 mx-1" />
              </>
            )}
            <button onClick={() => downloadFile(fileUrl, file.filename)}
              className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Download">
              <Download size={16} />
            </button>
            <button onClick={onClose}
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1" title="Close (Esc)">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Modal Body ── */}
        <div className="flex-1 overflow-auto flex items-center justify-center bg-slate-100">

          {/* IMAGE */}
          {fileType === "image" && (
            <div className="relative w-full h-full flex items-center justify-center p-6 overflow-auto">
              {imgLoading && !imgError && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
                </div>
              )}
              {imgError ? (
                <div className="flex flex-col items-center gap-4 text-center p-8">
                  <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center">
                    <AlertTriangle size={28} className="text-rose-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 mb-1">Image failed to load</p>
                    <p className="text-sm text-slate-500 mb-1">The file may have been moved or the server is unreachable.</p>
                    <p className="text-xs font-mono text-slate-400 break-all mb-4">{fileUrl}</p>
                    <button onClick={() => downloadFile(fileUrl, file.filename)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors">
                      <Download size={16} /> Download Instead
                    </button>
                  </div>
                </div>
              ) : (
                <img
                  src={fileUrl}
                  alt={file.filename}
                  crossOrigin="anonymous"
                  onLoad={() => setImgLoading(false)}
                  onError={() => { setImgLoading(false); setImgError(true); }}
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    transition: "transform 0.2s ease",
                    maxWidth: zoom <= 1 ? "100%" : "none",
                    maxHeight: zoom <= 1 ? "100%" : "none",
                    objectFit: "contain",
                    borderRadius: "8px",
                    boxShadow: "0 4px 32px rgba(0,0,0,0.18)",
                    opacity: imgLoading ? 0 : 1,
                    cursor: zoom > 1 ? "grab" : "default",
                  }}
                />
              )}
            </div>
          )}

          {/* PDF */}
          {fileType === "pdf" && (
            <iframe
              src={fileUrl}
              title={file.filename}
              className="w-full border-0"
              style={{ height: "100%", minHeight: "600px" }}
            />
          )}

          {/* VIDEO */}
          {fileType === "video" && (
            <div className="w-full h-full flex items-center justify-center p-4">
              <video src={fileUrl} controls className="max-w-full max-h-full rounded-xl shadow-lg"
                style={{ maxHeight: "calc(100% - 32px)" }} />
            </div>
          )}

          {/* AUDIO */}
          {fileType === "audio" && (
            <div className="flex flex-col items-center gap-6 p-10 text-center">
              <div className="w-28 h-28 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center shadow-inner">
                <FileText size={44} className="text-blue-500" />
              </div>
              <div>
                <p className="text-slate-800 font-semibold mb-1">{file.filename}</p>
                <p className="text-xs text-slate-400 mb-4">Audio File</p>
              </div>
              <audio src={fileUrl} controls className="w-80 rounded-lg" />
            </div>
          )}

          {/* OTHER (Word, Excel, ZIP, etc.) */}
          {fileType === "other" && (
            <div className="flex flex-col items-center gap-5 p-10 text-center">
              <div className="w-24 h-24 bg-slate-200 rounded-2xl flex items-center justify-center shadow-inner">
                <FileText size={42} className="text-slate-500" />
              </div>
              <div>
                <p className="text-slate-800 font-semibold text-lg mb-1">{file.filename}</p>
                <p className="text-slate-500 text-sm mb-6">
                  This file type ({getFileExtension(file.filename).toUpperCase()}) cannot be previewed in the browser.
                </p>
                <button onClick={() => downloadFile(fileUrl, file.filename)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-md">
                  <Download size={18} /> Download File
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const ViewProposal = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [previewFile, setPreviewFile] = useState(null);

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const res = await axios.get(`${API_URL}/proposal/${id}`);
        setProposal(res.data);
      } catch (err) {
        console.error("Failed to fetch proposal:", err);
      }
      setLoading(false);
    };
    fetchProposal();
  }, [id]);

  // Close modal on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setPreviewFile(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = previewFile ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [previewFile]);

  const statusConfig = {
    draft:     { icon: FileText,     color: "text-slate-700",  bgColor: "bg-slate-100",  borderColor: "border-slate-200",  label: "Draft"    },
    sent:      { icon: Mail,         color: "text-blue-700",   bgColor: "bg-blue-50",    borderColor: "border-blue-200",   label: "Sent"     },
    "no reply":{ icon: AlertCircle,  color: "text-amber-700",  bgColor: "bg-amber-50",   borderColor: "border-amber-200",  label: "No Reply" },
    rejection: { icon: XCircle,      color: "text-rose-700",   bgColor: "bg-rose-50",    borderColor: "border-rose-200",   label: "Rejected" },
    success:   { icon: CheckCircle,  color: "text-emerald-700",bgColor: "bg-emerald-50", borderColor: "border-emerald-200",label: "Accepted" },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4" />
          <p className="text-slate-600">Loading proposal details...</p>
        </div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md w-full">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="text-rose-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Proposal Not Found</h2>
          <p className="text-slate-600 mb-6">The proposal you're looking for doesn't exist or may have been removed.</p>
          <Link to="/proposal" className="inline-flex items-center px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg">
            <ArrowLeft size={18} className="mr-2" /> Back to Proposals
          </Link>
        </div>
      </div>
    );
  }

  const StatusIcon  = statusConfig[proposal.status]?.icon || AlertCircle;
  const statusStyle = statusConfig[proposal.status] || statusConfig.draft;

  const tabs = [
    { key: "details", label: "Details" },
    { key: "content", label: "Content" },
    { key: "attachments", label: `Attachments${proposal.attachments?.length > 0 ? ` (${proposal.attachments.length})` : ""}` },
    { key: "activity",    label: "Activity" },
  ];

  // Badge colors per extension
  const extBadgeColors = {
    pdf: "bg-rose-100 text-rose-700",
    jpg: "bg-emerald-100 text-emerald-700", jpeg: "bg-emerald-100 text-emerald-700",
    png: "bg-emerald-100 text-emerald-700", gif: "bg-emerald-100 text-emerald-700",
    webp:"bg-emerald-100 text-emerald-700", svg: "bg-emerald-100 text-emerald-700",
    doc: "bg-blue-100 text-blue-700",   docx:"bg-blue-100 text-blue-700",
    xls: "bg-green-100 text-green-700", xlsx:"bg-green-100 text-green-700",
    ppt: "bg-orange-100 text-orange-700", pptx:"bg-orange-100 text-orange-700",
    zip: "bg-purple-100 text-purple-700", rar: "bg-purple-100 text-purple-700",
    txt: "bg-slate-100 text-slate-600",
    csv: "bg-teal-100 text-teal-700",
  };

  return (
    <>
      {previewFile && <PreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />}

      <div className="min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto">

          {/* ── Header ── */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
            <div>
              <div className="flex items-center text-slate-600 mb-3">
                <Link to="/proposal" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                  <ArrowLeft size={16} className="mr-1" /> All Proposals
                </Link>
                <ChevronRight size={16} className="mx-2" />
                <span className="text-slate-500">View Proposal</span>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{proposal.title}</h1>
                <div className={`inline-flex items-center px-4 py-2 rounded-full ${statusStyle.bgColor} ${statusStyle.color} border ${statusStyle.borderColor}`}>
                  <StatusIcon size={16} className="mr-2" />
                  <span className="capitalize font-medium text-sm">{statusStyle.label}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="flex border-b border-slate-200 mb-6">
            {tabs.map((tab) => (
              <button key={tab.key}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.key ? "border-blue-500 text-blue-600" : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
                onClick={() => setActiveTab(tab.key)}>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">

              {/* ── Content Tab ── */}
              {activeTab === "content" && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
                  <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900">Proposal Content</h2>
                  </div>
                  <div className="p-6">
                    <div className="prose max-w-none p-6 bg-slate-50 rounded-lg border border-slate-200"
                      dangerouslySetInnerHTML={{ __html: proposal.content }} />
                  </div>
                </div>
              )}

              {/* ── Attachments Tab ── */}
              {activeTab === "attachments" && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
                  <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900">Attachments</h2>
                    <p className="text-sm text-slate-600 mt-1">Files and documents related to this proposal</p>
                  </div>
                  <div className="p-6">
                    {proposal.attachments && proposal.attachments.length > 0 ? (
                      <ul className="space-y-3">
                        {proposal.attachments.map((file, idx) => {
                          const ext = getFileExtension(file.filename);
                          const badgeColor = extBadgeColors[ext] || "bg-slate-100 text-slate-600";
                          const fileUrl = getFileUrl(file.path);

                          return (
                            <li key={idx}
                              className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-white hover:shadow-sm transition-all group">
                              <div className="flex items-center min-w-0">
                                <div className="p-3 bg-blue-100 rounded-xl mr-4 flex-shrink-0">
                                  <FileText size={20} className="text-blue-600" />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="text-sm font-medium text-slate-900 truncate max-w-xs">
                                      {file.filename}
                                    </p>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${badgeColor}`}>
                                      {ext}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-500 mt-0.5">
                                    {file.size ? `${(file.size / 1024).toFixed(1)} KB` : "Size unknown"} •{" "}
                                    Uploaded {new Date(proposal.createdAt).toLocaleDateString()}
                                  </p>
                                  {/* Dev debug — shows resolved URL */}
                                  {import.meta.env.DEV && (
                                    <p className="text-xs font-mono text-blue-300 mt-0.5 break-all">{fileUrl}</p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-1 flex-shrink-0 ml-3">
                                {/* Preview → modal */}
                                <button
                                  onClick={() => setPreviewFile(file)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                                >
                                  <Eye size={14} /> Preview
                                </button>
                                {/* Download */}
                                <button
                                  onClick={() => downloadFile(fileUrl, file.filename)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-200"
                                >
                                  <Download size={14} /> Download
                                </button>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <div className="py-12 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Paperclip size={24} className="text-slate-400" />
                        </div>
                        <h3 className="text-slate-700 font-medium mb-1">No attachments</h3>
                        <p className="text-sm text-slate-500">No files were attached to this proposal.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Details Tab ── */}
              {activeTab === "details" && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
                  <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900">Proposal Details</h2>
                    <p className="text-sm text-slate-600 mt-1">Comprehensive information about this proposal</p>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-slate-700 mb-3 uppercase tracking-wide">Client Information</h3>
                        <div className="space-y-4">
                          <div className="flex items-center text-slate-700">
                            <User size={18} className="mr-3 text-slate-500" />
                            <div><p className="text-sm font-medium">Client Name</p><p className="text-slate-900">{proposal.dealTitle || "Not specified"}</p></div>
                          </div>
                          <div className="flex items-center text-slate-700">
                            <Building size={18} className="mr-3 text-slate-500" />
                            <div><p className="text-sm font-medium">Company</p><p className="text-slate-900">{proposal.deal?.companyName || "Not specified"}</p></div>
                          </div>
                          <div className="flex items-center text-slate-700">
                            <Mail size={18} className="mr-3 text-slate-500" />
                            <div>
                              <p className="text-sm font-medium">Email Address</p>
                              <a href={`mailto:${proposal.email}`} className="text-blue-600 hover:underline">{proposal.email}</a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-700 mb-3 uppercase tracking-wide">Proposal Information</h3>
                        <div className="space-y-4">
                          <div className="flex items-center text-slate-700">
                            <DollarSign size={18} className="mr-3 text-slate-500" />
                            <div><p className="text-sm font-medium">Proposed Value</p><p className="text-slate-900">{proposal.value ? `$${proposal.value.toLocaleString()}` : "Not specified"}</p></div>
                          </div>
                          <div className="flex items-center text-slate-700">
                            <Calendar size={18} className="mr-3 text-slate-500" />
                            <div>
                              <p className="text-sm font-medium">Created Date</p>
                              <p className="text-slate-900">{new Date(proposal.createdAt).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}</p>
                            </div>
                          </div>
                          <div className="flex items-center text-slate-700">
                            <Clock size={18} className="mr-3 text-slate-500" />
                            <div>
                              <p className="text-sm font-medium">Follow-up Date</p>
                              <p className="text-slate-900">{proposal.followUpDate ? new Date(proposal.followUpDate).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" }) : "Not scheduled"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {proposal.notes && (
                      <div className="mt-8 pt-6 border-t border-slate-200">
                        <h3 className="text-sm font-medium text-slate-700 mb-3 uppercase tracking-wide">Additional Notes</h3>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                          <p className="text-slate-700">{proposal.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Activity Tab ── */}
              {activeTab === "activity" && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
                  <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900">Activity Timeline</h2>
                    <p className="text-sm text-slate-600 mt-1">Recent activities and updates for this proposal</p>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start mb-8">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FileText size={16} className="text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-slate-900">Proposal created</h3>
                        <p className="text-sm text-slate-500 mt-1">{new Date(proposal.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</p>
                      </div>
                    </div>
                    {proposal.followUpDate && (
                      <div className="flex items-start mb-8">
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Clock size={16} className="text-amber-600" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-slate-900">Follow-up scheduled</h3>
                          <p className="text-sm text-slate-500 mt-1">{new Date(proposal.followUpDate).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <StatusIcon size={16} className="text-emerald-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-slate-900">Status changed to {statusStyle.label}</h3>
                        <p className="text-sm text-slate-500 mt-1">{new Date(proposal.updatedAt || proposal.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Sidebar ── */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 p-5">
                <h3 className="text-sm font-medium text-slate-700 mb-3 uppercase tracking-wide">Proposal Status</h3>
                <div className={`inline-flex items-center px-4 py-2 rounded-full ${statusStyle.bgColor} ${statusStyle.color} border ${statusStyle.borderColor} mb-4`}>
                  <StatusIcon size={16} className="mr-2" />
                  <span className="capitalize font-medium text-sm">{statusStyle.label}</span>
                </div>
                <p className="text-sm text-slate-600 mt-2">Last updated {new Date(proposal.updatedAt || proposal.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 p-5">
                <h3 className="text-sm font-medium text-slate-700 mb-4 uppercase tracking-wide">Client</h3>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mr-3">
                    <User size={20} className="text-slate-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">{proposal.dealTitle || "Unknown Client"}</h4>
                    <p className="text-sm text-slate-600">{proposal.companyName || "No company"}</p>
                  </div>
                </div>
                <a href={`mailto:${proposal.email}`} className="flex items-center text-sm text-slate-600 hover:text-blue-600 transition-colors">
                  <Mail size={14} className="mr-2" />{proposal.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewProposal;