import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserAlt, FaDownload, FaChartLine, FaUsers, FaCheckCircle, FaClock } from "react-icons/fa";
import {
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiActivity,
  FiSearch,
  FiTrendingUp,
  FiTrendingDown
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
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-blue-100 text-blue-800";
    if (score >= 40) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
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
          hour12: true
        })
      : "-";

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }) : "-";

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading performance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Team Analytics
              </h1>
             
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search team members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white w-full sm:w-64"
                />
              </div>

         

              <button
                onClick={downloadAllReports}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white font-medium px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaDownload className="w-4 h-4" />
                <span>Export All</span>
              </button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <SummaryCard
            title="Total Team Members"
            value={reports.length}
            icon={<FaUsers className="w-5 h-5" />}
            color="blue"
          />
          <SummaryCard
            title="Avg Productivity"
            value={`${reports.length > 0 ? (reports.reduce((acc, rep) => acc + rep.productivityScore, 0) / reports.length).toFixed(0) : 0}%`}
            icon={<FaChartLine className="w-5 h-5" />}
            color="green"
          />
          <SummaryCard
            title="Avg Completion Rate"
            value={`${reports.length > 0 ? (reports.reduce((acc, rep) => acc + rep.activityCompletionRate, 0) / reports.length).toFixed(0) : 0}%`}
            icon={<FaCheckCircle className="w-5 h-5" />}
            color="purple"
          />
        
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leads
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activities
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map((rep) => (
                  <React.Fragment key={rep.userId}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                            {rep.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {rep.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {rep.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <div className="text-sm font-semibold text-gray-900">
                            {rep.productivityScore.toFixed(0)}%
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getProductivityColor(rep.productivityScore)}`}>
                            {getPerformanceLevel(rep.productivityScore)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          {rep.totalLeads}
                        </div>
                        <div className="text-xs text-gray-500">
                          Assigned
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-gray-900 font-medium">
                            {rep.completedActivities}/{rep.totalActivities}
                          </div>
                          {rep.completedActivities > 0 && rep.totalActivities > 0 && (
                            <span className={`text-xs ${rep.completedActivities/rep.totalActivities >= 0.8 ? 'text-green-600' : 'text-yellow-600'}`}>
                              {rep.completedActivities/rep.totalActivities >= 0.8 ? <FiTrendingUp /> : <FiTrendingDown />}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          {rep.totalHours.toFixed(1)}h
                        </div>
                        <div className="text-xs text-gray-500">
                          Total logged
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                            <div 
                              className={`h-2 rounded-full ${
                                rep.activityCompletionRate >= 80 ? 'bg-green-500' :
                                rep.activityCompletionRate >= 60 ? 'bg-blue-500' :
                                rep.activityCompletionRate >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(rep.activityCompletionRate, 100)}%` }}
                            />
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {rep.activityCompletionRate.toFixed(0)}%
                          </div>
                        </div>
                      </td>
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
                            title="View Details"
                          >
                            {expandedUsers.has(rep.userId) ? 
                              <FiChevronUp className="w-4 h-4" /> : 
                              <FiChevronDown className="w-4 h-4" />
                            }
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expanded Row - Today's Sessions */}
                    {expandedUsers.has(rep.userId) && (
                      <tr className="bg-gray-50">
                        <td colSpan="7" className="px-6 py-6">
                          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-200">
                              <div className="flex justify-between items-center">
                                <h4 className="text-sm font-semibold text-gray-900">
                                  Today's Login Sessions - {rep.name}
                                </h4>
                                <span className="text-xs text-gray-500">
                                  {getTodaysLoginHistory(rep.loginHistory).length} sessions
                                </span>
                              </div>
                            </div>
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Date
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Login Time
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Logout Time
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Duration
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Status
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {getTodaysLoginHistory(rep.loginHistory).length > 0 ? (
                                    getTodaysLoginHistory(rep.loginHistory).map((log, idx) => (
                                      <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                          {formatDate(log.login)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                          {formatTime(log.login)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                          {formatTime(log.logout)}
                                        </td>
                                        <td className="px-4 py-3">
                                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {calculateSessionHours(log.login, log.logout)}
                                          </span>
                                        </td>
                                        <td className="px-4 py-3">
                                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            log.logout ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                          }`}>
                                            {log.logout ? 'Completed' : 'Active'}
                                          </span>
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan="5" className="px-4 py-8 text-center">
                                        <FaUserAlt className="mx-auto w-8 h-8 mb-2 text-gray-300" />
                                        <p className="text-sm text-gray-500">No login sessions found for today</p>
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
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

          {/* Empty State */}
          {filteredReports.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                <FaUsers className="w-full h-full" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No team members found
              </h3>
              <p className="text-gray-600 text-sm max-w-md mx-auto">
                {searchTerm
                  ? "No team members match your search criteria. Try adjusting your search terms."
                  : "No performance data available for the selected date range."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Summary Card Component
const SummaryCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    purple: "bg-purple-50 text-purple-700",
    orange: "bg-orange-50 text-orange-700"
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;