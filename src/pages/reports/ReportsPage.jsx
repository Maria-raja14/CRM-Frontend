// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FaUserAlt } from "react-icons/fa";

// const ReportsPage = () => {
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedDate, setSelectedDate] = useState("");
//   const [expandedUsers, setExpandedUsers] = useState(new Set());

//   const API_URL = import.meta.env.VITE_API_URL;
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     fetchReports();
//   }, [selectedDate]);

//   const fetchReports = async () => {
//     try {
//       setLoading(true);
//       const { data: salesUsers } = await axios.get(`${API_URL}/users/sales`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const reportPromises = salesUsers.users.map(async (user) => {
//         const { data } = await axios.get(`${API_URL}/sales/performance`, {
//           headers: { Authorization: `Bearer ${token}` },
//           params: {
//             userId: user._id,
//             startDate: selectedDate || undefined,
//             endDate: selectedDate || undefined,
//           },
//         });

//         const totalHours = data.loginHistory.reduce((acc, log) => {
//           if (log.login && log.logout) {
//             return acc + (new Date(log.logout) - new Date(log.login)) / 1000 / 60 / 60;
//           }
//           return acc;
//         }, 0);

//         const totalActivities = data.activities.length;
//         const completedActivities = data.activities.filter(a => a.status === "Completed").length;

//         const totalFollowUps = data.leads.filter(
//           (lead) => lead.followUpDate && new Date(lead.followUpDate) >= new Date()
//         ).length;

//         return {
//           userId: user._id,
//           name: `${user.firstName} ${user.lastName}`,
//           totalLogins: data.loginHistory.length,
//           totalLeads: data.metrics.totalLeadsAssigned,
//           totalActivities,
//           completedActivities,
//           totalFollowUps,
//           totalHours,
//           loginHistory: data.loginHistory,
//           activityCompletionRate: totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0,
//         };
//       });

//       const reportsData = await Promise.all(reportPromises);
//       setReports(reportsData);
//       setLoading(false);
//     } catch (err) {
//       console.error("Error fetching reports:", err);
//       setLoading(false);
//     }
//   };

//   const toggleUserExpansion = (userId) => {
//     const newExpanded = new Set(expandedUsers);
//     newExpanded.has(userId) ? newExpanded.delete(userId) : newExpanded.add(userId);
//     setExpandedUsers(newExpanded);
//   };

//   const formatTime = (dateString) =>
//     dateString ? new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-";

//   const formatDate = (dateString) =>
//     dateString ? new Date(dateString).toLocaleDateString() : "-";

//   const calculateSessionHours = (login, logout) => {
//     if (!login || !logout) return "-";
//     const hours = (new Date(logout) - new Date(login)) / 1000 / 60 / 60;
//     return `${hours.toFixed(1)}h`;
//   };

//   if (loading)
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008ecc]"></div>
//       </div>
//     );

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
//         <div>
//           <h2 className="text-3xl font-bold text-gray-900">Sales Performance</h2>
//           <p className="text-gray-600 mt-2">
//             Track your team's activities and performance metrics
//           </p>
//         </div>

//         <div className="flex items-center gap-3">
//           <label className="text-sm font-medium text-gray-700">Filter by Date:</label>
//           <input
//             type="date"
//             value={selectedDate}
//             onChange={(e) => setSelectedDate(e.target.value)}
//             className="pl-4 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008ecc] focus:border-transparent transition-all duration-200"
//           />
//         </div>
//       </div>

//       {/* Reports Grid */}
//       <div className="space-y-5">
//         {reports.map((rep) => (
//           <div
//             key={rep.userId}
//             className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
//           >
//             {/* Summary Card */}
//             <div
//               className="p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 cursor-pointer"
//               onClick={() => toggleUserExpansion(rep.userId)}
//             >
//               <div className="flex items-center gap-4">
//                 <div className="w-12 h-12 bg-gradient-to-br from-[#008ecc] to-[#0066cc] rounded-full flex items-center justify-center text-white font-semibold text-lg">
//                   {rep.name.split(" ").map(n => n[0]).join("")}
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900 text-lg">{rep.name}</h3>
//                   <p className="text-sm text-gray-500">{rep.totalLogins} login sessions</p>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 flex-1 lg:px-8">
//                 <MetricCard label="Leads" value={rep.totalLeads} color="bg-blue-100 text-blue-800" />
//                 <MetricCard label="Activities" value={rep.totalActivities} color="bg-green-100 text-green-800" />
//                 <MetricCard label="Completed" value={rep.completedActivities} color="bg-teal-100 text-teal-800" />
//                 <MetricCard label="Total Hours" value={`${rep.totalHours.toFixed(1)}h`} color="bg-purple-100 text-purple-800" />
//               </div>

//               <div className="flex items-center gap-4">
//                 <div className="text-right">
//                   <div className="text-sm font-medium text-gray-900">{rep.activityCompletionRate.toFixed(0)}% Completed</div>
//                   <div className="w-28 bg-gray-200 rounded-full h-2 mt-1">
//                     <div
//                       className="bg-green-500 h-2 rounded-full transition-all duration-500"
//                       style={{ width: `${Math.min(rep.activityCompletionRate, 100)}%` }}
//                     ></div>
//                   </div>
//                 </div>
//                 <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
//                   <svg
//                     className={`w-5 h-5 transform transition-transform ${expandedUsers.has(rep.userId) ? 'rotate-180' : ''}`}
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                   </svg>
//                 </button>
//               </div>
//             </div>

//             {/* Expanded Sessions */}
//             {expandedUsers.has(rep.userId) && (
//               <div className="bg-gray-50 border-t border-gray-200">
//                 <div className="p-6">
//                   <h4 className="font-medium text-gray-900 mb-4">Login Sessions</h4>
//                   <div className="overflow-x-auto rounded-lg border border-gray-200">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-100">
//                         <tr>
//                           <TableHeader label="Date" />
//                           <TableHeader label="Login Time" />
//                           <TableHeader label="Logout Time" />
//                           <TableHeader label="Duration" />
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {rep.loginHistory.length > 0 ? (
//                           rep.loginHistory.map((log, idx) => (
//                             <tr key={idx} className="hover:bg-gray-50 transition-colors">
//                               <td className="px-4 py-3 text-sm text-gray-900">{formatDate(log.login)}</td>
//                               <td className="px-4 py-3 text-sm text-gray-900">{formatTime(log.login)}</td>
//                               <td className="px-4 py-3 text-sm text-gray-900">{formatTime(log.logout)}</td>
//                               <td className="px-4 py-3 text-sm">
//                                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                                   {calculateSessionHours(log.login, log.logout)}
//                                 </span>
//                               </td>
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td colSpan={4} className="px-4 py-4 text-center text-sm text-gray-500">
//                               No login sessions found
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Empty State */}
//       {reports.length === 0 && !loading && (
//         <div className="text-center py-12">
//           <FaUserAlt className="text-gray-300 mx-auto mb-4 w-12 h-12" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No reports available</h3>
//           <p className="text-gray-600">Try adjusting your date filter or check back later.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// // Metric Card Component
// const MetricCard = ({ label, value, color }) => (
//   <div className="text-center">
//     <div className={`text-2xl font-bold ${color}`}>{value}</div>
//     <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
//   </div>
// );

// // Table Header Component
// const TableHeader = ({ label }) => (
//   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//     {label}
//   </th>
// );

// export default ReportsPage;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserAlt, FaDownload } from "react-icons/fa";
import {
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiActivity,
} from "react-icons/fi";
import * as XLSX from "xlsx";

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [expandedUsers, setExpandedUsers] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchReports();
  }, [selectedDate]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data: salesUsers } = await axios.get(`${API_URL}/users/sales`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const reportPromises = salesUsers.users.map(async (user) => {
        const { data } = await axios.get(`${API_URL}/sales/performance`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            userId: user._id,
            startDate: selectedDate || undefined,
            endDate: selectedDate || undefined,
          },
        });

        const totalHours = data.loginHistory.reduce((acc, log) => {
          if (log.login && log.logout) {
            return (
              acc +
              (new Date(log.logout) - new Date(log.login)) / 1000 / 60 / 60
            );
          }
          return acc;
        }, 0);

        const totalActivities = data.activities.length;
        const completedActivities = data.activities.filter(
          (a) => a.status === "Completed"
        ).length;

        const totalFollowUps = data.leads.filter(
          (lead) =>
            lead.followUpDate && new Date(lead.followUpDate) >= new Date()
        ).length;

        const productivityScore = calculateProductivityScore(
          totalHours,
          completedActivities,
          totalFollowUps,
          totalActivities
        );

        return {
          userId: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          totalLogins: data.loginHistory.length,
          totalLeads: data.metrics.totalLeadsAssigned,
          totalActivities,
          completedActivities,
          totalFollowUps,
          totalHours,
          loginHistory: data.loginHistory,
          activityCompletionRate:
            totalActivities > 0
              ? (completedActivities / totalActivities) * 100
              : 0,
          productivityScore,
        };
      });

      const reportsData = await Promise.all(reportPromises);
      setReports(reportsData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setLoading(false);
    }
  };

  const calculateProductivityScore = (
    hours,
    completed,
    followUps,
    totalActivities
  ) => {
    const activityScore =
      totalActivities > 0 ? (completed / totalActivities) * 40 : 0;
    const timeScore = Math.min(hours * 2, 30); // Max 30 points for time
    const followUpScore = Math.min(followUps * 2, 30); // Max 30 points for follow-ups
    return Math.min(activityScore + timeScore + followUpScore, 100);
  };

  const getProductivityColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 60) return "text-blue-600 bg-blue-50 border-blue-200";
    if (score >= 40) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getPerformanceLevel = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Average";
    return "Needs Improvement";
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  // Filter login history to show only today's sessions
  const getTodaysLoginHistory = (loginHistory) => {
    const today = getTodayDate();
    return loginHistory.filter((log) => {
      if (!log.login) return false;
      const loginDate = new Date(log.login).toISOString().split("T")[0];
      return loginDate === today;
    });
  };

  // Download Excel for all salesmen
  const downloadAllReports = () => {
    const worksheetData = [];

    reports.forEach((rep) => {
      if (rep.loginHistory.length > 0) {
        rep.loginHistory.forEach((log) => {
          const loginTime = log.login ? new Date(log.login) : null;
          const logoutTime = log.logout ? new Date(log.logout) : null;
          const duration =
            loginTime && logoutTime
              ? ((logoutTime - loginTime) / 1000 / 60 / 60).toFixed(2) +
                " hours"
              : "N/A";

          worksheetData.push({
            "Salesman Name": rep.name,
            Email: rep.email,
            "Login Date": loginTime ? loginTime.toLocaleDateString() : "N/A",
            "Login Time": loginTime ? loginTime.toLocaleTimeString() : "N/A",
            "Logout Date": logoutTime ? logoutTime.toLocaleDateString() : "N/A",
            "Logout Time": logoutTime ? logoutTime.toLocaleTimeString() : "N/A",
            Duration: duration,
            "Total Leads": rep.totalLeads,
            "Total Activities": rep.totalActivities,
            "Completed Activities": rep.completedActivities,
            "Activity Completion Rate": `${rep.activityCompletionRate.toFixed(
              2
            )}%`,
            "Productivity Score": `${rep.productivityScore.toFixed(0)}%`,
          });
        });
      } else {
        worksheetData.push({
          "Salesman Name": rep.name,
          Email: rep.email,
          "Login Date": "No Data",
          "Login Time": "No Data",
          "Logout Date": "No Data",
          "Logout Time": "No Data",
          Duration: "No Data",
          "Total Leads": rep.totalLeads,
          "Total Activities": rep.totalActivities,
          "Completed Activities": rep.completedActivities,
          "Activity Completion Rate": `${rep.activityCompletionRate.toFixed(
            2
          )}%`,
          "Productivity Score": `${rep.productivityScore.toFixed(0)}%`,
        });
      }
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(worksheetData);

    const colWidths = [
      { wch: 20 },
      { wch: 25 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 12 },
      { wch: 12 },
      { wch: 15 },
      { wch: 20 },
      { wch: 22 },
      { wch: 18 },
    ];
    ws["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, "Sales Performance Report");
    const dateStr = selectedDate ? selectedDate.replace(/-/g, "") : "all";
    const filename = `sales_performance_${dateStr}.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  // Download individual salesman report with ALL login history
  const downloadSalesmanReport = (rep) => {
    const worksheetData = [];

    if (rep.loginHistory.length > 0) {
      rep.loginHistory.forEach((log) => {
        const loginTime = log.login ? new Date(log.login) : null;
        const logoutTime = log.logout ? new Date(log.logout) : null;
        const duration =
          loginTime && logoutTime
            ? ((logoutTime - loginTime) / 1000 / 60 / 60).toFixed(2) + " hours"
            : "N/A";

        worksheetData.push({
          "Salesman Name": rep.name,
          "Salesman Email": rep.email,
          "Login Date": loginTime ? loginTime.toLocaleDateString() : "N/A",
          "Login Time": loginTime ? loginTime.toLocaleTimeString() : "N/A",
          "Logout Date": logoutTime ? logoutTime.toLocaleDateString() : "N/A",
          "Logout Time": logoutTime ? logoutTime.toLocaleTimeString() : "N/A",
          "Duration (Hours)": duration,
          "Total Leads Assigned": rep.totalLeads,
          "Total Activities": rep.totalActivities,
          "Completed Activities": rep.completedActivities,
          "Pending Follow-ups": rep.totalFollowUps,
          "Total Working Hours": `${rep.totalHours.toFixed(2)} hours`,
          "Activity Completion Rate": `${rep.activityCompletionRate.toFixed(2)}%`,
          "Productivity Score": `${rep.productivityScore.toFixed(0)}%`,
          "Performance Level": getPerformanceLevel(rep.productivityScore),
        });
      });
    } else {
      worksheetData.push({
        "Salesman Name": rep.name,
        "Salesman Email": rep.email,
        "Login Date": "No Data",
        "Login Time": "No Data",
        "Logout Date": "No Data",
        "Logout Time": "No Data",
        "Duration (Hours)": "No Data",
        "Total Leads Assigned": rep.totalLeads,
        "Total Activities": rep.totalActivities,
        "Completed Activities": rep.completedActivities,
        "Pending Follow-ups": rep.totalFollowUps,
        "Total Working Hours": `${rep.totalHours.toFixed(2)} hours`,
        "Activity Completion Rate": `${rep.activityCompletionRate.toFixed(2)}%`,
        "Productivity Score": `${rep.productivityScore.toFixed(0)}%`,
        "Performance Level": getPerformanceLevel(rep.productivityScore),
      });
    }

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(worksheetData);
    
    // Set column widths for better Excel formatting
    const colWidths = [
      { wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 15 }, 
      { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 18 },
      { wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 22 },
      { wch: 18 }, { wch: 18 }
    ];
    ws["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, `${rep.name} Report`);
    const dateStr = selectedDate ? selectedDate.replace(/-/g, "") : "all";
    const filename = `${rep.name.replace(/\s+/g, "_")}_complete_report_${dateStr}.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  const toggleUserExpansion = (userId) => {
    const newExpanded = new Set(expandedUsers);
    newExpanded.has(userId)
      ? newExpanded.delete(userId)
      : newExpanded.add(userId);
    setExpandedUsers(newExpanded);
  };

  const formatTime = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString() : "-";

  const calculateSessionHours = (login, logout) => {
    if (!login || !logout) return "-";
    const hours = (new Date(logout) - new Date(login)) / 1000 / 60 / 60;
    return `${hours.toFixed(1)}h`;
  };

  const filteredReports = reports.filter((rep) =>
    rep.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading performance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-700  ">
                Team Analytics
              </h1>
              <p className="text-gray-600 mt-3 text-lg">
                Comprehensive performance insights and activity tracking
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiActivity className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search salespeople..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200 w-full sm:w-64"
                />
              </div>

              <button
                onClick={downloadAllReports}
                className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <FaDownload className="w-4 h-4" />
                <span>Export All Reports</span>
              </button>

              <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl px-4 py-3">
                <FiCalendar className="text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent border-none focus:outline-none text-gray-700 w-36"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="space-y-6">
          {filteredReports.map((rep) => {
            const todaysLoginHistory = getTodaysLoginHistory(rep.loginHistory);

            return (
              <div
                key={rep.userId}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                {/* Summary Card */}
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* User Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          {rep.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                     
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-gray-900 text-xl">
                            {rep.name}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getProductivityColor(
                              rep.productivityScore
                            )}`}
                          >
                            {getPerformanceLevel(rep.productivityScore)}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{rep.email}</p>
                      
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 flex-1 lg:px-8">
                      <MetricCard
                        value={rep.totalLeads}
                        label="Leads"
                        trend="up"
                      />
                      <MetricCard
                        value={rep.completedActivities}
                        label="Completed"
                        trend="up"
                      />
                      <MetricCard
                        value={`${rep.totalHours.toFixed(1)}h`}
                        label="Hours"
                        trend="neutral"
                      />
                      <MetricCard
                        value={`${rep.activityCompletionRate.toFixed(0)}%`}
                        label="Rate"
                        trend="up"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => downloadSalesmanReport(rep)}
                        className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-sm"
                      >
                        <FaDownload className="w-4 h-4" />
                        <span className="hidden sm:inline">Export</span>
                      </button>
                      <button
                        onClick={() => toggleUserExpansion(rep.userId)}
                        className="flex items-center gap-2 bg-blue-600 text-white font-medium px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-all duration-200"
                      >
                        {expandedUsers.has(rep.userId) ? (
                          <FiChevronUp className="w-4 h-4" />
                        ) : (
                          <FiChevronDown className="w-4 h-4" />
                        )}
                        <span className="hidden sm:inline">Details</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Sessions - Show only today's login details */}
                {expandedUsers.has(rep.userId) && (
                  <div className="border-t border-gray-200 bg-gray-50/50">
                    <div className="p-8">
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="font-semibold text-gray-900 text-lg">
                          Today's Login Sessions
                        </h4>
                        <span className="text-sm text-gray-600">
                          {todaysLoginHistory.length} sessions today
                        </span>
                      </div>
                      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-100/80 border-b border-gray-200">
                            <tr>
                              <TableHeader label="Date" />
                              <TableHeader label="Login Time" />
                              <TableHeader label="Logout Time" />
                              <TableHeader label="Duration" />
                              <TableHeader label="Status" />
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {todaysLoginHistory.length > 0 ? (
                              todaysLoginHistory.map((log, idx) => (
                                <tr
                                  key={idx}
                                  className="hover:bg-gray-50/80 transition-colors"
                                >
                                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    {formatDate(log.login)}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-600">
                                    {formatTime(log.login)}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-600">
                                    {formatTime(log.logout)}
                                  </td>
                                  <td className="px-6 py-4 text-sm">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      {calculateSessionHours(
                                        log.login,
                                        log.logout
                                      )}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-sm">
                                    <span
                                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                        log.logout
                                          ? "bg-green-100 text-green-800"
                                          : "bg-yellow-100 text-yellow-800"
                                      }`}
                                    >
                                      {log.logout ? "Completed" : "Active"}
                                    </span>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan={5}
                                  className="px-6 py-8 text-center text-gray-500"
                                >
                                  <FaUserAlt className="mx-auto w-8 h-8 mb-2 text-gray-300" />
                                  <p>No login sessions found for today</p>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredReports.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-32 h-32 mx-auto mb-6 text-gray-300">
              <FaUserAlt className="w-full h-full" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              No reports available
            </h3>
            <p className="text-gray-600 max-w-md mx-auto text-lg">
              {searchTerm
                ? "No salespeople match your search. Try adjusting your search terms."
                : "Try adjusting your date filter or check back later for performance data."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ icon, value, label, trend }) => (
  <div className="text-center group hover:scale-105 transition-transform duration-200">
    <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
    <div className="flex items-center justify-center gap-1 text-xs text-gray-500 uppercase tracking-wide">
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  </div>
);

// Table Header Component
const TableHeader = ({ label }) => (
  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
    {label}
  </th>
);

export default ReportsPage;