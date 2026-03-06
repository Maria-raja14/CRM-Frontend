// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FaUserAlt, FaDownload, FaChartLine, FaUsers, FaCheckCircle } from "react-icons/fa";
// import {
//   FiChevronDown,
//   FiChevronUp,
//   FiSearch,
//   FiTrendingUp,
//   FiTrendingDown
// } from "react-icons/fi";
// import * as XLSX from "xlsx";
// import { useNavigate } from "react-router-dom";

// const ReportsPage = () => {
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedDate, setSelectedDate] = useState("");
//   const [expandedUsers, setExpandedUsers] = useState(new Set());
//   const [searchTerm, setSearchTerm] = useState("");
//   const [error, setError] = useState(null);
//   const [fetchErrors, setFetchErrors] = useState([]);

//   const navigate = useNavigate();
//   const API_URL = import.meta.env.VITE_API_URL;
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     if (!token) {
//       navigate("/login");
//       return;
//     }
//     fetchReports();
//   }, [selectedDate]);

//   // ==================== HELPER: FORMAT DURATION ====================
//   const formatDuration = (seconds) => {
//     if (!seconds || seconds <= 0) return "0 sec";
//     const hrs = Math.floor(seconds / 3600);
//     const mins = Math.floor((seconds % 3600) / 60);
//     const secs = Math.floor(seconds % 60);
//     const parts = [];
//     if (hrs > 0) parts.push(`${hrs} hr`);
//     if (mins > 0) parts.push(`${mins} min`);
//     if (secs > 0 || parts.length === 0) parts.push(`${secs} sec`); // always show seconds if nothing else
//     return parts.join(' ');
//   };

//   const fetchReports = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       setFetchErrors([]);

//       const { data: salesUsers } = await axios.get(`${API_URL}/users/sales`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const users = salesUsers.users || [];
//       if (users.length === 0) {
//         setReports([]);
//         setLoading(false);
//         return;
//       }

//       const results = await Promise.allSettled(
//         users.map(async (user) => {
//           try {
//             const { data } = await axios.get(`${API_URL}/sales/performance`, {
//               headers: { Authorization: `Bearer ${token}` },
//               params: {
//                 userId: user._id,
//                 startDate: selectedDate || undefined,
//                 endDate: selectedDate || undefined,
//               },
//             });

//             const loginHistory = data.loginHistory || [];
//             const activities = data.activities || [];
//             const leads = data.leads || [];

//             // Calculate total seconds from loginHistory
//             let totalSeconds = 0;
//             loginHistory.forEach((log) => {
//               if (log.login && log.logout) {
//                 totalSeconds += (new Date(log.logout) - new Date(log.login)) / 1000;
//               }
//             });
//             const totalHours = totalSeconds / 3600; // keep for productivity calculation

//             const totalActivities = activities.length;
//             const completedActivities = activities.filter(
//               (a) => a.status === "Completed"
//             ).length;

//             const totalFollowUps = leads.filter(
//               (lead) => lead.followUpDate && new Date(lead.followUpDate) >= new Date()
//             ).length;

//             const productivityScore = calculateProductivityScore(
//               totalHours,
//               completedActivities,
//               totalFollowUps,
//               totalActivities
//             );

//             return {
//               userId: user._id,
//               name: `${user.firstName} ${user.lastName}`,
//               email: user.email,
//               totalLogins: loginHistory.length,
//               totalLeads: data.metrics?.totalLeadsAssigned || 0,
//               totalActivities,
//               completedActivities,
//               totalFollowUps,
//               totalSeconds,           // store seconds for formatting
//               totalDuration: formatDuration(totalSeconds), // human‑readable total
//               loginHistory,
//               activityCompletionRate:
//                 totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0,
//               productivityScore,
//             };
//           } catch (err) {
//             const errorDetail = {
//               userId: user._id,
//               name: `${user.firstName} ${user.lastName}`,
//               status: err.response?.status,
//               message: err.response?.data?.message || err.message,
//             };
//             console.error("Failed to fetch performance for", user.email, errorDetail);
//             throw errorDetail;
//           }
//         })
//       );

//       const successful = [];
//       const failed = [];
//       results.forEach((result) => {
//         if (result.status === "fulfilled") {
//           successful.push(result.value);
//         } else {
//           failed.push(result.reason);
//         }
//       });

//       setReports(successful);
//       setFetchErrors(failed);

//       if (failed.length > 0) {
//         setError(`Could not load data for ${failed.length} team member(s). Check console for details.`);
//       }
//     } catch (err) {
//       console.error("Error fetching sales users:", err);
//       setError("Failed to load team members. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateProductivityScore = (hours, completed, followUps, totalActivities) => {
//     const activityScore = totalActivities > 0 ? (completed / totalActivities) * 40 : 0;
//     const timeScore = Math.min(hours * 2, 30);
//     const followUpScore = Math.min(followUps * 2, 30);
//     return Math.min(activityScore + timeScore + followUpScore, 100);
//   };

//   const getProductivityColor = (score) => {
//     if (score >= 80) return "bg-green-100 text-green-800";
//     if (score >= 60) return "bg-blue-100 text-blue-800";
//     if (score >= 40) return "bg-yellow-100 text-yellow-800";
//     return "bg-red-100 text-red-800";
//   };

//   const getPerformanceLevel = (score) => {
//     if (score >= 80) return "Excellent";
//     if (score >= 60) return "Good";
//     if (score >= 40) return "Average";
//     return "Needs Improvement";
//   };

//   const getTodayDate = () => new Date().toISOString().split("T")[0];

//   const getTodaysLoginHistory = (loginHistory) => {
//     const today = getTodayDate();
//     return loginHistory.filter((log) => {
//       if (!log.login) return false;
//       const loginDate = new Date(log.login).toISOString().split("T")[0];
//       return loginDate === today;
//     });
//   };

//   // ==================== DOWNLOAD FUNCTIONS ====================
//   const downloadAllReports = () => {
//     const worksheetData = [];

//     reports.forEach((rep) => {
//       if (rep.loginHistory.length > 0) {
//         rep.loginHistory.forEach((log) => {
//           const loginTime = log.login ? new Date(log.login) : null;
//           const logoutTime = log.logout ? new Date(log.logout) : null;
//           const duration =
//             loginTime && logoutTime
//               ? ((logoutTime - loginTime) / 1000 / 60 / 60).toFixed(2) + " hours"
//               : "N/A";

//           worksheetData.push({
//             "Salesman Name": rep.name,
//             Email: rep.email,
//             "Login Date": loginTime ? loginTime.toLocaleDateString() : "N/A",
//             "Login Time": loginTime ? loginTime.toLocaleTimeString() : "N/A",
//             "Logout Date": logoutTime ? logoutTime.toLocaleDateString() : "N/A",
//             "Logout Time": logoutTime ? logoutTime.toLocaleTimeString() : "N/A",
//             Duration: duration,
//             "Total Leads": rep.totalLeads,
//             "Total Activities": rep.totalActivities,
//             "Completed Activities": rep.completedActivities,
//             "Activity Completion Rate": `${rep.activityCompletionRate.toFixed(2)}%`,
//             "Productivity Score": `${rep.productivityScore.toFixed(0)}%`,
//           });
//         });
//       } else {
//         worksheetData.push({
//           "Salesman Name": rep.name,
//           Email: rep.email,
//           "Login Date": "No Data",
//           "Login Time": "No Data",
//           "Logout Date": "No Data",
//           "Logout Time": "No Data",
//           Duration: "No Data",
//           "Total Leads": rep.totalLeads,
//           "Total Activities": rep.totalActivities,
//           "Completed Activities": rep.completedActivities,
//           "Activity Completion Rate": `${rep.activityCompletionRate.toFixed(2)}%`,
//           "Productivity Score": `${rep.productivityScore.toFixed(0)}%`,
//         });
//       }
//     });

//     const wb = XLSX.utils.book_new();
//     const ws = XLSX.utils.json_to_sheet(worksheetData);

//     const colWidths = [
//       { wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 15 },
//       { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 12 },
//       { wch: 15 }, { wch: 20 }, { wch: 22 }, { wch: 18 },
//     ];
//     ws["!cols"] = colWidths;

//     XLSX.utils.book_append_sheet(wb, ws, "Sales Performance Report");
//     const dateStr = selectedDate ? selectedDate.replace(/-/g, "") : "all";
//     const filename = `sales_performance_${dateStr}.xlsx`;
//     XLSX.writeFile(wb, filename);
//   };

//   const downloadSalesmanReport = (rep) => {
//     const worksheetData = [];

//     if (rep.loginHistory.length > 0) {
//       rep.loginHistory.forEach((log) => {
//         const loginTime = log.login ? new Date(log.login) : null;
//         const logoutTime = log.logout ? new Date(log.logout) : null;
//         const duration =
//           loginTime && logoutTime
//             ? ((logoutTime - loginTime) / 1000 / 60 / 60).toFixed(2) + " hours"
//             : "N/A";

//         worksheetData.push({
//           "Salesman Name": rep.name,
//           "Salesman Email": rep.email,
//           "Login Date": loginTime ? loginTime.toLocaleDateString() : "N/A",
//           "Login Time": loginTime ? loginTime.toLocaleTimeString() : "N/A",
//           "Logout Date": logoutTime ? logoutTime.toLocaleDateString() : "N/A",
//           "Logout Time": logoutTime ? logoutTime.toLocaleTimeString() : "N/A",
//           "Duration (Hours)": duration,
//           "Total Leads Assigned": rep.totalLeads,
//           "Total Activities": rep.totalActivities,
//           "Completed Activities": rep.completedActivities,
//           "Pending Follow-ups": rep.totalFollowUps,
//           "Total Working Hours": rep.totalDuration, // human‑readable
//           "Activity Completion Rate": `${rep.activityCompletionRate.toFixed(2)}%`,
//           "Productivity Score": `${rep.productivityScore.toFixed(0)}%`,
//           "Performance Level": getPerformanceLevel(rep.productivityScore),
//         });
//       });
//     } else {
//       worksheetData.push({
//         "Salesman Name": rep.name,
//         "Salesman Email": rep.email,
//         "Login Date": "No Data",
//         "Login Time": "No Data",
//         "Logout Date": "No Data",
//         "Logout Time": "No Data",
//         "Duration (Hours)": "No Data",
//         "Total Leads Assigned": rep.totalLeads,
//         "Total Activities": rep.totalActivities,
//         "Completed Activities": rep.completedActivities,
//         "Pending Follow-ups": rep.totalFollowUps,
//         "Total Working Hours": rep.totalDuration,
//         "Activity Completion Rate": `${rep.activityCompletionRate.toFixed(2)}%`,
//         "Productivity Score": `${rep.productivityScore.toFixed(0)}%`,
//         "Performance Level": getPerformanceLevel(rep.productivityScore),
//       });
//     }

//     const wb = XLSX.utils.book_new();
//     const ws = XLSX.utils.json_to_sheet(worksheetData);
//     const colWidths = [
//       { wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 15 },
//       { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 18 },
//       { wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 22 },
//       { wch: 18 }, { wch: 18 }
//     ];
//     ws["!cols"] = colWidths;
//     XLSX.utils.book_append_sheet(wb, ws, `${rep.name} Report`);
//     const dateStr = selectedDate ? selectedDate.replace(/-/g, "") : "all";
//     const filename = `${rep.name.replace(/\s+/g, "_")}_complete_report_${dateStr}.xlsx`;
//     XLSX.writeFile(wb, filename);
//   };
//   // ==================== END DOWNLOAD FUNCTIONS ====================

//   const toggleUserExpansion = (userId) => {
//     const newExpanded = new Set(expandedUsers);
//     newExpanded.has(userId) ? newExpanded.delete(userId) : newExpanded.add(userId);
//     setExpandedUsers(newExpanded);
//   };

//   const formatTime = (dateString) =>
//     dateString
//       ? new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })
//       : "-";

//   const formatDate = (dateString) =>
//     dateString ? new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "-";

//   // Format duration for a single session (login/logout)
//   const formatSessionDuration = (login, logout) => {
//     if (!login || !logout) return "-";
//     const seconds = (new Date(logout) - new Date(login)) / 1000;
//     return formatDuration(seconds);
//   };

//   const filteredReports = reports.filter((rep) =>
//     rep.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading performance data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-6">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//             <div>
//               <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Team Analytics</h1>
//             </div>
//             <div className="flex flex-col sm:flex-row gap-3">
//               <div className="relative">
//                 <FiSearch className="absolute left-3 top-3 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search team members..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white w-full sm:w-64"
//                 />
//               </div>
//               <button
//                 onClick={downloadAllReports}
//                 className="flex items-center justify-center gap-2 bg-blue-600 text-white font-medium px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 <FaDownload className="w-4 h-4" />
//                 <span>Export All</span>
//               </button>
//             </div>
//           </div>

//           {error && (
//             <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
//               ⚠️ {error}
//             </div>
//           )}
//         </div>

//         {/* Summary Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//           <SummaryCard
//             title="Total Team Members"
//             value={reports.length}
//             icon={<FaUsers className="w-5 h-5" />}
//             color="blue"
//           />
//           <SummaryCard
//             title="Avg Productivity"
//             value={`${reports.length > 0 ? (reports.reduce((acc, rep) => acc + rep.productivityScore, 0) / reports.length).toFixed(0) : 0}%`}
//             icon={<FaChartLine className="w-5 h-5" />}
//             color="green"
//           />
//           <SummaryCard
//             title="Avg Completion Rate"
//             value={`${reports.length > 0 ? (reports.reduce((acc, rep) => acc + rep.activityCompletionRate, 0) / reports.length).toFixed(0) : 0}%`}
//             icon={<FaCheckCircle className="w-5 h-5" />}
//             color="purple"
//           />
//         </div>

//         {/* Reports Table */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Member</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leads</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activities</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Logged</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredReports.map((rep) => (
//                   <React.Fragment key={rep.userId}>
//                     <tr className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
//                             {rep.name.split(' ').map(n => n[0]).join('')}
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">{rep.name}</div>
//                             <div className="text-xs text-gray-500">{rep.email}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex flex-col gap-1">
//                           <div className="text-sm font-semibold text-gray-900">{rep.productivityScore.toFixed(0)}%</div>
//                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getProductivityColor(rep.productivityScore)}`}>
//                             {getPerformanceLevel(rep.productivityScore)}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900 font-medium">{rep.totalLeads}</div>
//                         <div className="text-xs text-gray-500">Assigned</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center gap-2">
//                           <div className="text-sm text-gray-900 font-medium">{rep.completedActivities}/{rep.totalActivities}</div>
//                           {rep.completedActivities > 0 && rep.totalActivities > 0 && (
//                             <span className={`text-xs ${rep.completedActivities/rep.totalActivities >= 0.8 ? 'text-green-600' : 'text-yellow-600'}`}>
//                               {rep.completedActivities/rep.totalActivities >= 0.8 ? <FiTrendingUp /> : <FiTrendingDown />}
//                             </span>
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900 font-medium">{rep.totalDuration}</div>
//                         <div className="text-xs text-gray-500">Total logged</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
//                             <div
//                               className={`h-2 rounded-full ${
//                                 rep.activityCompletionRate >= 80 ? 'bg-green-500' :
//                                 rep.activityCompletionRate >= 60 ? 'bg-blue-500' :
//                                 rep.activityCompletionRate >= 40 ? 'bg-yellow-500' : 'bg-red-500'
//                               }`}
//                               style={{ width: `${Math.min(rep.activityCompletionRate, 100)}%` }}
//                             />
//                           </div>
//                           <div className="text-sm font-medium text-gray-900">{rep.activityCompletionRate.toFixed(0)}%</div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex items-center gap-2">
//                           <button
//                             onClick={() => downloadSalesmanReport(rep)}
//                             className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                             title="Export Report"
//                           >
//                             <FaDownload className="w-4 h-4" />
//                           </button>
//                           <button
//                             onClick={() => toggleUserExpansion(rep.userId)}
//                             className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                             title="View Details"
//                           >
//                             {expandedUsers.has(rep.userId) ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
//                           </button>
//                         </div>
//                       </td>
//                     </tr>

//                     {/* Expanded Row - Today's Sessions */}
//                     {expandedUsers.has(rep.userId) && (
//                       <tr className="bg-gray-50">
//                         <td colSpan="7" className="px-6 py-6">
//                           <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
//                             <div className="px-6 py-4 border-b border-gray-200">
//                               <div className="flex justify-between items-center">
//                                 <h4 className="text-sm font-semibold text-gray-900">Today's Login Sessions - {rep.name}</h4>
//                                 <span className="text-xs text-gray-500">{getTodaysLoginHistory(rep.loginHistory).length} sessions</span>
//                               </div>
//                             </div>
//                             <div className="overflow-x-auto">
//                               <table className="min-w-full divide-y divide-gray-200">
//                                 <thead className="bg-gray-50">
//                                   <tr>
//                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Login Time</th>
//                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logout Time</th>
//                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
//                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                                   </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-gray-200">
//                                   {getTodaysLoginHistory(rep.loginHistory).length > 0 ? (
//                                     getTodaysLoginHistory(rep.loginHistory).map((log, idx) => (
//                                       <tr key={idx} className="hover:bg-gray-50">
//                                         <td className="px-4 py-3 text-sm text-gray-900">{formatDate(log.login)}</td>
//                                         <td className="px-4 py-3 text-sm text-gray-600">{formatTime(log.login)}</td>
//                                         <td className="px-4 py-3 text-sm text-gray-600">{formatTime(log.logout)}</td>
//                                         <td className="px-4 py-3">
//                                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                                             {formatSessionDuration(log.login, log.logout)}
//                                           </span>
//                                         </td>
//                                         <td className="px-4 py-3">
//                                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                                             log.logout ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//                                           }`}>
//                                             {log.logout ? 'Completed' : 'Active'}
//                                           </span>
//                                         </td>
//                                       </tr>
//                                     ))
//                                   ) : (
//                                     <tr>
//                                       <td colSpan="5" className="px-4 py-8 text-center">
//                                         <FaUserAlt className="mx-auto w-8 h-8 mb-2 text-gray-300" />
//                                         <p className="text-sm text-gray-500">No login sessions found for today</p>
//                                       </td>
//                                     </tr>
//                                   )}
//                                 </tbody>
//                               </table>
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Empty State */}
//           {filteredReports.length === 0 && !loading && (
//             <div className="text-center py-12">
//               <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
//                 <FaUsers className="w-full h-full" />
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">No team members found</h3>
//               <p className="text-gray-600 text-sm max-w-md mx-auto">
//                 {searchTerm
//                   ? "No team members match your search criteria. Try adjusting your search terms."
//                   : error || "No performance data available for the selected date range."}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const SummaryCard = ({ title, value, icon, color }) => {
//   const colorClasses = {
//     blue: "bg-blue-50 text-blue-700",
//     green: "bg-green-50 text-green-700",
//     purple: "bg-purple-50 text-purple-700",
//     orange: "bg-orange-50 text-orange-700"
//   };

//   return (
//     <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm text-gray-600 mb-1">{title}</p>
//           <p className="text-2xl font-bold text-gray-900">{value}</p>
//         </div>
//         <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
//           {icon}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReportsPage;//original




import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserAlt, FaDownload, FaChartLine, FaUsers, FaCheckCircle } from "react-icons/fa";
import {
  FiChevronDown,
  FiChevronUp,
  FiSearch,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [expandedUsers, setExpandedUsers] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchReports();
  }, [selectedDate]);

  // ─── Format seconds → "X hr Y min Z sec" ────────────────────
  const formatDuration = (seconds) => {
    if (!seconds || seconds <= 0) return "0 sec";
    const hrs  = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const parts = [];
    if (hrs  > 0) parts.push(`${hrs} hr`);
    if (mins > 0) parts.push(`${mins} min`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs} sec`);
    return parts.join(" ");
  };

  // ─── Productivity score (0-100) ──────────────────────────────
  // Based purely on real data ratios, not hard-coded thresholds:
  //   40% weight → activity completion ratio
  //   30% weight → time logged (capped at 8 hrs/day = full score)
  //   30% weight → follow-up coverage (followUps / totalLeads, capped at 1)
  const calcProductivityScore = (totalSeconds, completedActivities, totalActivities, totalFollowUps, totalLeads) => {
    // Activity score: proportion of completed activities × 40
    const activityScore =
      totalActivities > 0
        ? (completedActivities / totalActivities) * 40
        : 0;

    // Time score: 8 hours = full 30 points
    const hours     = totalSeconds / 3600;
    const timeScore = Math.min((hours / 8) * 30, 30);

    // Follow-up score: follow-ups relative to total leads × 30
    const followUpScore =
      totalLeads > 0
        ? Math.min((totalFollowUps / totalLeads) * 30, 30)
        : 0;

    return Math.min(activityScore + timeScore + followUpScore, 100);
  };

  // ─── Fetch all sales users + their performance data ──────────
  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: salesData } = await axios.get(`${API_URL}/users/sales`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const users = salesData.salesUsers || salesData.users || salesData || [];
      if (!Array.isArray(users) || users.length === 0) {
        setReports([]);
        setLoading(false);
        return;
      }

      const results = await Promise.allSettled(
        users.map(async (user) => {
          const { data } = await axios.get(`${API_URL}/sales/performance`, {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              userId:    user._id,
              startDate: selectedDate || undefined,
              endDate:   selectedDate || undefined,
            },
          });

          // ── Login history ──────────────────────────────────────
          const loginHistory = Array.isArray(data.loginHistory) ? data.loginHistory : [];

          // Total logged seconds across ALL sessions
          let totalSeconds = 0;
          loginHistory.forEach((log) => {
            if (log.login && log.logout) {
              const diff = (new Date(log.logout) - new Date(log.login)) / 1000;
              if (diff > 0) totalSeconds += diff;
            }
          });

          // ── Activities ─────────────────────────────────────────
          // API may return activities directly or nested inside data
          const activities = Array.isArray(data.activities) ? data.activities : [];

          const totalActivities     = activities.length;
          const completedActivities = activities.filter(
            (a) => String(a.status).toLowerCase() === "completed"
          ).length;

          const activityCompletionRate =
            totalActivities > 0
              ? (completedActivities / totalActivities) * 100
              : 0;

          // ── Leads & follow-ups ─────────────────────────────────
          const leads      = Array.isArray(data.leads) ? data.leads : [];
          const totalLeads = data.metrics?.totalLeadsAssigned
            ?? data.metrics?.totalLeads
            ?? leads.length
            ?? 0;

          // Pending follow-ups: leads with a future followUpDate
          const now           = new Date();
          const totalFollowUps = leads.filter(
            (lead) => lead.followUpDate && new Date(lead.followUpDate) >= now
          ).length;

          // ── Productivity score ─────────────────────────────────
          const productivityScore = calcProductivityScore(
            totalSeconds,
            completedActivities,
            totalActivities,
            totalFollowUps,
            totalLeads
          );

          return {
            userId:              user._id,
            name:                `${user.firstName} ${user.lastName}`,
            email:               user.email,
            totalLogins:         loginHistory.length,
            totalLeads,
            totalActivities,
            completedActivities,
            totalFollowUps,
            totalSeconds,
            totalDuration:       formatDuration(totalSeconds),
            loginHistory,
            activityCompletionRate,
            productivityScore,
          };
        })
      );

      const successful = [];
      const failed     = [];
      results.forEach((r) => {
        if (r.status === "fulfilled") successful.push(r.value);
        else                          failed.push(r.reason);
      });

      setReports(successful);

      if (failed.length > 0) {
        console.error("Failed to load some users:", failed);
        setError(`Could not load data for ${failed.length} team member(s).`);
      }
    } catch (err) {
      console.error("fetchReports error:", err);
      setError("Failed to load team data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Score helpers ────────────────────────────────────────────
  const getProductivityColor = (score) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-blue-100 text-blue-800";
    if (score >= 40) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getPerformanceLabel = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Average";
    return "Needs Improvement";
  };

  // ─── Date/time helpers ────────────────────────────────────────
  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const getTodaysLoginHistory = (loginHistory) => {
    const today = getTodayDate();
    return loginHistory.filter((log) => {
      if (!log.login) return false;
      return new Date(log.login).toISOString().split("T")[0] === today;
    });
  };

  const formatTime = (ds) =>
    ds
      ? new Date(ds).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })
      : "-";

  const formatDate = (ds) =>
    ds
      ? new Date(ds).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "-";

  const formatSessionDuration = (login, logout) => {
    if (!login || !logout) return "-";
    const secs = (new Date(logout) - new Date(login)) / 1000;
    return formatDuration(secs);
  };

  // ─── Toggle expanded row ──────────────────────────────────────
  const toggleUserExpansion = (userId) => {
    setExpandedUsers((prev) => {
      const next = new Set(prev);
      next.has(userId) ? next.delete(userId) : next.add(userId);
      return next;
    });
  };

  // ─── Aggregate summary stats ──────────────────────────────────
  const avgProductivity =
    reports.length > 0
      ? reports.reduce((a, r) => a + r.productivityScore, 0) / reports.length
      : 0;

  const avgCompletion =
    reports.length > 0
      ? reports.reduce((a, r) => a + r.activityCompletionRate, 0) / reports.length
      : 0;

  // ─── Export helpers ───────────────────────────────────────────
  const buildExportRows = (rep) => {
    if (rep.loginHistory.length === 0) {
      return [{
        "Salesman Name":           rep.name,
        "Email":                   rep.email,
        "Login Date":              "No Data",
        "Login Time":              "No Data",
        "Logout Date":             "No Data",
        "Logout Time":             "No Data",
        "Session Duration":        "No Data",
        "Total Leads Assigned":    rep.totalLeads,
        "Total Activities":        rep.totalActivities,
        "Completed Activities":    rep.completedActivities,
        "Activity Completion %":   `${rep.activityCompletionRate.toFixed(1)}%`,
        "Pending Follow-ups":      rep.totalFollowUps,
        "Total Time Logged":       rep.totalDuration,
        "Productivity Score":      `${rep.productivityScore.toFixed(0)}%`,
        "Performance Level":       getPerformanceLabel(rep.productivityScore),
      }];
    }

    return rep.loginHistory.map((log) => {
      const login  = log.login  ? new Date(log.login)  : null;
      const logout = log.logout ? new Date(log.logout) : null;
      const dur    = login && logout
        ? formatSessionDuration(log.login, log.logout)
        : "Active";

      return {
        "Salesman Name":         rep.name,
        "Email":                 rep.email,
        "Login Date":            login  ? login.toLocaleDateString()  : "N/A",
        "Login Time":            login  ? login.toLocaleTimeString()  : "N/A",
        "Logout Date":           logout ? logout.toLocaleDateString() : "N/A",
        "Logout Time":           logout ? logout.toLocaleTimeString() : "N/A",
        "Session Duration":      dur,
        "Total Leads Assigned":  rep.totalLeads,
        "Total Activities":      rep.totalActivities,
        "Completed Activities":  rep.completedActivities,
        "Activity Completion %": `${rep.activityCompletionRate.toFixed(1)}%`,
        "Pending Follow-ups":    rep.totalFollowUps,
        "Total Time Logged":     rep.totalDuration,
        "Productivity Score":    `${rep.productivityScore.toFixed(0)}%`,
        "Performance Level":     getPerformanceLabel(rep.productivityScore),
      };
    });
  };

  const downloadAllReports = () => {
    const rows = reports.flatMap(buildExportRows);
    const wb   = XLSX.utils.book_new();
    const ws   = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = Array(15).fill({ wch: 20 });
    XLSX.utils.book_append_sheet(wb, ws, "Team Performance");
    const dateStr = selectedDate ? selectedDate.replace(/-/g, "") : "all";
    XLSX.writeFile(wb, `team_performance_${dateStr}.xlsx`);
  };

  const downloadSalesmanReport = (rep) => {
    const rows = buildExportRows(rep);
    const wb   = XLSX.utils.book_new();
    const ws   = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = Array(15).fill({ wch: 20 });
    XLSX.utils.book_append_sheet(wb, ws, rep.name.slice(0, 31));
    const dateStr = selectedDate ? selectedDate.replace(/-/g, "") : "all";
    XLSX.writeFile(wb, `${rep.name.replace(/\s+/g, "_")}_report_${dateStr}.xlsx`);
  };

  // ─── Filtered list ────────────────────────────────────────────
  const filteredReports = reports.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ─── Loading state ────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading performance data…</p>
      </div>
    </div>
  );

  // ─── Render ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Team Analytics</h1>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Date filter */}
              <input
                type="date"
                value={selectedDate}
                max={getTodayDate()}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search team members…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white w-full sm:w-64 text-sm"
                />
              </div>

              {/* Export all */}
              <button
                onClick={downloadAllReports}
                disabled={reports.length === 0}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white font-medium px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <FaDownload className="w-4 h-4" />
                Export All
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <SummaryCard
            title="Total Team Members"
            value={reports.length}
            icon={<FaUsers className="w-5 h-5" />}
            color="blue"
          />
          <SummaryCard
            title="Avg Productivity"
            value={`${avgProductivity.toFixed(0)}%`}
            icon={<FaChartLine className="w-5 h-5" />}
            color="green"
            subtitle={getPerformanceLabel(avgProductivity)}
          />
          <SummaryCard
            title="Avg Completion Rate"
            value={`${avgCompletion.toFixed(0)}%`}
            icon={<FaCheckCircle className="w-5 h-5" />}
            color="purple"
            subtitle={`Across ${reports.length} member${reports.length !== 1 ? "s" : ""}`}
          />
        </div>

        {/* ── Main Table ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["Team Member","Leads","Activities","Time Logged","Completion","Actions"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map((rep) => (
                  <React.Fragment key={rep.userId}>

                    {/* ── Main row ── */}
                    <tr className="hover:bg-gray-50 transition-colors">

                      {/* Team Member */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                            {rep.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{rep.name}</div>
                            <div className="text-xs text-gray-500">{rep.email}</div>
                          </div>
                        </div>
                      </td>
{/* 
                      Performance */}
                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <div className="text-sm font-semibold text-gray-900">
                            {rep.productivityScore.toFixed(0)}%
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getProductivityColor(rep.productivityScore)}`}>
                            {getPerformanceLabel(rep.productivityScore)}
                          </span>
                        </div>
                      </td> */}

                      {/* Leads */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{rep.totalLeads}</div>
                        <div className="text-xs text-gray-500">Assigned</div>
                      </td>

                      {/* Activities */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-gray-900">
                            {rep.completedActivities}/{rep.totalActivities}
                          </div>
                          {rep.totalActivities > 0 && (
                            <span className={`text-xs ${
                              rep.activityCompletionRate >= 80 ? "text-green-600" : "text-yellow-600"
                            }`}>
                              {rep.activityCompletionRate >= 80 ? <FiTrendingUp /> : <FiTrendingDown />}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {rep.totalActivities > 0
                            ? `${rep.activityCompletionRate.toFixed(0)}% done`
                            : "No activities"}
                        </div>
                      </td>

                      {/* Time Logged */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{rep.totalDuration}</div>
                        <div className="text-xs text-gray-500">{rep.totalLogins} session{rep.totalLogins !== 1 ? "s" : ""}</div>
                      </td>

                      {/* Completion bar */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                rep.activityCompletionRate >= 80 ? "bg-green-500"
                                : rep.activityCompletionRate >= 60 ? "bg-blue-500"
                                : rep.activityCompletionRate >= 40 ? "bg-yellow-500"
                                : "bg-red-500"
                              }`}
                              style={{ width: `${Math.min(rep.activityCompletionRate, 100)}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {rep.activityCompletionRate.toFixed(0)}%
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => downloadSalesmanReport(rep)}
                            className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Export Report"
                          >
                            <FaDownload className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleUserExpansion(rep.userId)}
                            className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Sessions"
                          >
                            {expandedUsers.has(rep.userId)
                              ? <FiChevronUp className="w-4 h-4" />
                              : <FiChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* ── Expanded: Today's Sessions ── */}
                    {expandedUsers.has(rep.userId) && (
                      <tr className="bg-gray-50">
                        <td colSpan="7" className="px-6 py-6">
                          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">

                            {/* Sub-header */}
                            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                              <h4 className="text-sm font-semibold text-gray-900">
                                Today's Login Sessions — {rep.name}
                              </h4>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>{getTodaysLoginHistory(rep.loginHistory).length} session(s) today</span>
                                <span className="font-medium text-gray-700">
                                  Today's time: {formatDuration(
                                    getTodaysLoginHistory(rep.loginHistory).reduce((acc, log) => {
                                      if (log.login && log.logout) {
                                        const diff = (new Date(log.logout) - new Date(log.login)) / 1000;
                                        return acc + (diff > 0 ? diff : 0);
                                      }
                                      return acc;
                                    }, 0)
                                  )}
                                </span>
                              </div>
                            </div>

                            {/* Sessions table */}
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    {["#","Date","Login Time","Logout Time","Duration","Status"].map((h) => (
                                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {h}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {getTodaysLoginHistory(rep.loginHistory).length > 0 ? (
                                    getTodaysLoginHistory(rep.loginHistory).map((log, idx) => (
                                      <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-500">{idx + 1}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900">{formatDate(log.login)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{formatTime(log.login)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{formatTime(log.logout)}</td>
                                        <td className="px-4 py-3">
                                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {formatSessionDuration(log.login, log.logout)}
                                          </span>
                                        </td>
                                        <td className="px-4 py-3">
                                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            log.logout
                                              ? "bg-green-100 text-green-800"
                                              : "bg-yellow-100 text-yellow-800"
                                          }`}>
                                            {log.logout ? "Completed" : "Active"}
                                          </span>
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan="6" className="px-4 py-10 text-center">
                                        <FaUserAlt className="mx-auto w-8 h-8 mb-2 text-gray-300" />
                                        <p className="text-sm text-gray-500">No login sessions found for today</p>
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>

                            {/* Activity summary inside expanded row */}
                            <div className="px-6 py-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
                              <MiniStat label="Total Leads"    value={rep.totalLeads} />
                              <MiniStat label="Activities"     value={`${rep.completedActivities}/${rep.totalActivities}`} />
                              <MiniStat label="Follow-ups"     value={rep.totalFollowUps} />
                              <MiniStat label="Total Logged"   value={rep.totalDuration} />
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty state */}
          {filteredReports.length === 0 && !loading && (
            <div className="text-center py-16">
              <FaUsers className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No team members found</h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                {searchTerm
                  ? "No members match your search. Try a different name."
                  : error || "No performance data available for the selected period."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Summary Card ─────────────────────────────────────────────
const SummaryCard = ({ title, value, icon, color, subtitle }) => {
  const colors = {
    blue:   "bg-blue-50 text-blue-700",
    green:  "bg-green-50 text-green-700",
    purple: "bg-purple-50 text-purple-700",
    orange: "bg-orange-50 text-orange-700",
  };
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${colors[color]}`}>{icon}</div>
      </div>
    </div>
  );
};

// ─── Mini stat (inside expanded row) ─────────────────────────
const MiniStat = ({ label, value }) => (
  <div className="text-center">
    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
    <p className="text-sm font-semibold text-gray-900">{value}</p>
  </div>
);

export default ReportsPage;