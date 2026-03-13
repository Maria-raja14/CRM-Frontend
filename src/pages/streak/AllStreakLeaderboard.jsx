// import React, { useState, useEffect } from "react"; // Remove forwardRef
// import {
//   Trophy, Filter, RefreshCw, ChevronLeft, ChevronRight,
//   Calendar, Activity, Clock, Search, ChevronDown, ChevronUp,
//   Mail, Users, Briefcase, Flame, Target, Zap, TrendingUp,
//   Eye, EyeOff
// } from "lucide-react";
// import axios from "axios";
// import "react-datepicker/dist/react-datepicker.css";
// import { FiCalendar } from "react-icons/fi";
// const AllStreakLeaderboard = () => {
//   const [performers, setPerformers] = useState([]);
//   const [filteredPerformers, setFilteredPerformers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortBy, setSortBy] = useState("convertedLeads");
//   const [sortOrder, setSortOrder] = useState("desc");
//   const [currentPage, setCurrentPage] = useState(1);

//   const [startDate, setStartDate] = useState(() => {
//     const today = new Date();
//     const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
//     return firstDay.toISOString().split('T')[0]; // Format: YYYY-MM-DD
//   });

//   const [endDate, setEndDate] = useState(() => {
//     const today = new Date();
//     return today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
//   });

//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

//   const [currentUser, setCurrentUser] = useState(null);
//   const [userRole, setUserRole] = useState(null);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [stats, setStats] = useState({
//     totalSalespeople: 0,
//     activeSalespeople: 0,
//     avgConversionRate: 0,
//     totalLeads: 0,
//     totalQualificationDeals: 0,
//     totalConvertedLeads: 0,
//     cumulativeTotalLeads: 0,
//     cumulativeAvgConversionRate: 0
//   });

//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [totalCount, setTotalCount] = useState(0);

//   const API_URL = import.meta.env.VITE_API_URL;
//   const token = localStorage.getItem("token");

//   const months = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];

//   const years = [2024, 2025, 2026];

//   // REPLACE your existing formatDateRange function with this:

//   const formatDateRange = () => {
//     if (!startDate || !endDate) return '';

//     const start = new Date(startDate);
//     const end = new Date(endDate);

//     return `${start.toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     })} - ${end.toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     })}`;
//   };
//   // ADD these handler functions after formatDateRange:
//   const handleThisMonth = () => {
//     const today = new Date();
//     const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
//     setStartDate(firstDay.toISOString().split('T')[0]);
//     setEndDate(today.toISOString().split('T')[0]);
//   };
//   const handleLastMonth = () => {
//     const today = new Date();
//     const lastMonth = new Date(today);
//     lastMonth.setMonth(lastMonth.getMonth() - 1);

//     const firstDayLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
//     const lastDayLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0);
//     setStartDate(firstDayLastMonth.toISOString().split('T')[0]);
//     setEndDate(lastDayLastMonth.toISOString().split('T')[0]);
//   };
//   const handleLast7Days = () => {
//     const today = new Date();
//     const last7Days = new Date(today);
//     last7Days.setDate(last7Days.getDate() - 7);
//     setStartDate(last7Days.toISOString().split('T')[0]);
//     setEndDate(today.toISOString().split('T')[0]);
//   };
//   const handleLast30Days = () => {
//     const today = new Date();
//     const last30Days = new Date(today);
//     last30Days.setDate(last30Days.getDate() - 30);
//     setStartDate(last30Days.toISOString().split('T')[0]);
//     setEndDate(today.toISOString().split('T')[0]);
//   };
//   // GET CURRENT USER & ROLE
//   useEffect(() => {
//     try {
//       const userData = JSON.parse(localStorage.getItem("user") || "{}");
//       setCurrentUser(userData);
//       const role = userData?.role?.name || userData?.role || 'User';
//       setUserRole(role);
//       setIsAdmin(role === 'Admin');
//       console.log(`👤 Logged in as: ${userData?.firstName || ''} ${userData?.lastName || ''}`);
//       console.log(`🎭 Role: ${role} ${role === 'Admin' ? '(Admin - Full Access)' : '(Sales - Self View Only)'}`);
//     } catch (error) {
//       console.error("Error getting user data:", error);
//     }
//   }, []);
//   // DEAL STATUS HELPERS
//   const isDealQualification = (deal) => {
//     return deal?.stage?.toLowerCase() === 'qualification';
//   };
//   // EXTRACT ID HELPERS
//   const extractLeadAssigneeId = (lead) => {
//     if (!lead?.assignTo) return null;
//     if (typeof lead.assignTo === 'string') return lead.assignTo;
//     if (lead.assignTo._id) return lead.assignTo._id.toString();
//     return null;
//   };
//   const extractDealAssigneeId = (deal) => {
//     if (!deal?.assignedTo) return null;
//     if (typeof deal.assignedTo === 'string') return deal.assignedTo;
//     if (deal.assignedTo._id) return deal.assignedTo._id.toString();
//     return null;
//   };
//   const getSalespersonDetails = (item, type) => {
//     if (!item) return null;
//     if (type === 'lead' && item.assignTo) {
//       return {
//         id: item.assignTo._id?.toString() || item.assignTo.toString(),
//         firstName: item.assignTo.firstName || '',
//         lastName: item.assignTo.lastName || '',
//         email: item.assignTo.email || '',
//         role: item.assignTo.role?.name || 'Sales'
//       };
//     }
//     if (type === 'deal' && item.assignedTo) {
//       return {
//         id: item.assignedTo._id?.toString() || item.assignedTo.toString(),
//         firstName: item.assignedTo.firstName || '',
//         lastName: item.assignedTo.lastName || '',
//         email: item.assignedTo.email || '',
//         role: item.assignedTo.role?.name || 'Sales'
//       };
//     }
//     return null;
//   };
//   // EXTRACT ALL SALESPEOPLE FROM LEADS AND DEALS
//   const extractAllSalespeople = (leads, deals) => {
//     const salespeopleMap = new Map();
//     // Extract from leads
//     leads.forEach(lead => {
//       const details = getSalespersonDetails(lead, 'lead');
//       if (details?.id) {
//         if (!salespeopleMap.has(details.id)) {
//           salespeopleMap.set(details.id, {
//             _id: details.id,
//             firstName: details.firstName || '',
//             lastName: details.lastName || '',
//             email: details.email || '',
//             role: details.role || 'Sales',
//             team: 'General Sales',
//             avatar: (details.firstName?.charAt(0) || 'U').toUpperCase()
//           });
//         }
//       }
//     });
//     // Extract from deals
//     deals.forEach(deal => {
//       const details = getSalespersonDetails(deal, 'deal');
//       if (details?.id) {
//         if (!salespeopleMap.has(details.id)) {
//           salespeopleMap.set(details.id, {
//             _id: details.id,
//             firstName: details.firstName || '',
//             lastName: details.lastName || '',
//             email: details.email || '',
//             role: details.role || 'Sales',
//             team: 'General Sales',
//             avatar: (details.firstName?.charAt(0) || 'U').toUpperCase()
//           });
//         }
//       }
//     });
//     return Array.from(salespeopleMap.values());
//   };
//   // FORMATTING HELPERS
//   const formatTime = (date) => {
//     if (!date) return '—';
//     return new Date(date).toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     });
//   };
//   const formatWorkHours = (dailySessions) => {
//     if (!dailySessions || dailySessions.length === 0) return '—';
//     // Get today's date string
//     const today = new Date();
//     const todayStr = today.toDateString();
//     // Find today's session
//     const todaySession = dailySessions.find(session => {
//       const sessionDate = new Date(session.login);
//       return sessionDate.toDateString() === todayStr;
//     });
//     if (!todaySession) return 'No activity today';
//     // Format today's login and logout
//     const loginTime = formatTime(todaySession.login);
//     if (todaySession.logout) {
//       const logoutTime = formatTime(todaySession.logout);
//       return `${loginTime} - ${logoutTime}`;
//     } else {
//       return `${loginTime} - Ongoing`;
//     }
//   };
//   // STREAK CALCULATION
//   const calculateStreak = (loginHistory, monthlyActiveDays) => {
//     if (!loginHistory || loginHistory.length === 0) return 0;
//     const logins = loginHistory
//       .filter(log => log?.login)
//       .map(log => new Date(log.login))
//       .sort((a, b) => a - b);
//     if (logins.length === 0) return 0;
//     const uniqueDates = [];
//     const seenDates = new Set();
//     logins.forEach(date => {
//       const dateStr = date.toDateString();
//       if (!seenDates.has(dateStr)) {
//         seenDates.add(dateStr);
//         uniqueDates.push(date);
//       }
//     });
//     if (uniqueDates.length === 0) return 0;
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const yesterday = new Date(today);
//     yesterday.setDate(yesterday.getDate() - 1);
//     const lastLoginDate = uniqueDates[uniqueDates.length - 1];
//     lastLoginDate.setHours(0, 0, 0, 0);
//     if (lastLoginDate.getTime() !== today.getTime() &&
//       lastLoginDate.getTime() !== yesterday.getTime()) {
//       return 0;
//     }
//     let streak = 1;
//     for (let i = uniqueDates.length - 1; i > 0; i--) {
//       const currentDate = new Date(uniqueDates[i]);
//       const prevDate = new Date(uniqueDates[i - 1]);
//       currentDate.setHours(0, 0, 0, 0);
//       prevDate.setHours(0, 0, 0, 0);
//       const diffDays = Math.round((currentDate - prevDate) / (1000 * 60 * 60 * 24));
//       if (diffDays === 1) {
//         streak++;
//       } else {
//         break;
//       }
//     }
//     return Math.min(streak, monthlyActiveDays);
//   };
//   // MAIN CALCULATION ENGINE WITH VOLUME-FIRST SORTING
//   const calculateMonthlyLeaderboard = (deals, leads, userLogsMap, salespeople) => {
//     const rangeStartDate = new Date(startDate);
//     rangeStartDate.setHours(0, 0, 0, 0);
//     const rangeEndDate = new Date(endDate);
//     rangeEndDate.setHours(23, 59, 59, 999);
//     const performanceData = {};
//     salespeople.forEach(user => {
//       if (user._id) {
//         performanceData[user._id.toString()] = {
//           id: user._id.toString(),
//           name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Unknown',
//           email: user.email || '',
//           role: user.role || 'Sales',
//           team: user.team || 'General Sales',
//           avatar: user.avatar || 'U',
//           rangeRawLeads: 0,
//           rangeQualificationDeals: 0,
//           rangeConvertedLeads: 0,
//           cumulativeRawLeads: 0,
//           cumulativeQualificationDeals: 0,
//           cumulativeConvertedLeads: 0,
//           streak: 0,
//           productiveDays: 0,
//           dailySessions: [],
//           allLoginHistory: []
//         };
//       }
//     });
//     // ===== TRACK UNIQUE LEADS FOR CUMULATIVE STATS =====
//     const uniqueLeadTracker = new Set(); // Track lead IDs to prevent double counting
//     const uniqueDealTracker = new Set(); // Track deal IDs to prevent double counting
//     // ===== STEP 1: COUNT LEADS IN DATE RANGE =====
//     leads.forEach(lead => {
//       const salespersonId = extractLeadAssigneeId(lead);
//       if (!salespersonId || !performanceData[salespersonId]) return;
//       const leadDate = new Date(lead.createdAt);
//       const leadId = lead._id?.toString();
//       if (leadDate >= rangeStartDate && leadDate <= rangeEndDate) {
//         performanceData[salespersonId].rangeRawLeads += 1;
//       }
//       // FIX: Only count for cumulative if we haven't seen this lead before
//       if (leadId && !uniqueLeadTracker.has(leadId)) {
//         uniqueLeadTracker.add(leadId);
//         performanceData[salespersonId].cumulativeRawLeads += 1;
//       }
//     });
//     // ===== STEP 2: COUNT DEALS IN DATE RANGE =====
//     deals.forEach(deal => {
//       const salespersonId = extractDealAssigneeId(deal);
//       if (!salespersonId || !performanceData[salespersonId]) return;
//       const isQualification = isDealQualification(deal);
//       const dealDate = new Date(deal.createdAt);
//       const dealId = deal._id?.toString();
//       if (isQualification) {
//         if (dealDate >= rangeStartDate && dealDate <= rangeEndDate) {
//           performanceData[salespersonId].rangeQualificationDeals += 1;
//           if (deal.leadId) {
//             performanceData[salespersonId].rangeConvertedLeads += 1;
//           }
//         }
//         // FIX: Only count for cumulative if we haven't seen this deal before
//         if (dealId && !uniqueDealTracker.has(dealId)) {
//           uniqueDealTracker.add(dealId);
//           performanceData[salespersonId].cumulativeQualificationDeals += 1;
//           if (deal.leadId) {
//             performanceData[salespersonId].cumulativeConvertedLeads += 1;
//           }
//         }
//       }
//     });
//     // ===== STEP 3: CALCULATE TOTALS AND CONVERSION RATES =====
//     Object.keys(performanceData).forEach(userId => {
//       const person = performanceData[userId];
//       person.rangeTotalLeads = person.rangeRawLeads + person.rangeQualificationDeals;
//       person.rangeConversionRate = person.rangeTotalLeads > 0
//         ? (person.rangeConvertedLeads / person.rangeTotalLeads) * 100
//         : 0;
//       person.cumulativeTotalLeads = person.cumulativeRawLeads + person.cumulativeQualificationDeals;
//       person.cumulativeConversionRate = person.cumulativeTotalLeads > 0
//         ? (person.cumulativeConvertedLeads / person.cumulativeTotalLeads) * 100
//         : 0;
//     });
//     // ===== STEP 4: PROCESS LOGIN HISTORY =====
//     Object.keys(performanceData).forEach(userId => {
//       const userLogs = userLogsMap[userId] || [];
//       performanceData[userId].allLoginHistory = userLogs;
//       const rangeLogs = userLogs.filter(log => {
//         if (!log?.login) return false;
//         const loginDate = new Date(log.login);
//         return loginDate >= rangeStartDate && loginDate <= rangeEndDate;
//       });
//       const dailySessionsMap = new Map();
//       rangeLogs.forEach(log => {
//         const loginDate = new Date(log.login);
//         const dayKey = loginDate.toDateString();
//         if (!dailySessionsMap.has(dayKey)) {
//           dailySessionsMap.set(dayKey, {
//             login: log.login,
//             logout: log.logout || null
//           });
//         } else {
//           const session = dailySessionsMap.get(dayKey);
//           if (loginDate < new Date(session.login)) {
//             session.login = log.login;
//           }
//           if (log.logout) {
//             const logoutDate = new Date(log.logout);
//             if (!session.logout || logoutDate > new Date(session.logout)) {
//               session.logout = log.logout;
//             }
//           }
//         }
//       });

//       performanceData[userId].dailySessions = Array.from(dailySessionsMap.values());
//       performanceData[userId].productiveDays = dailySessionsMap.size;
//       performanceData[userId].streak = calculateStreak(
//         performanceData[userId].allLoginHistory,
//         performanceData[userId].productiveDays
//       );
//     });
//     // ===== STEP 5: BUILD LEADERBOARD WITH VOLUME-FIRST SORTING =====
//     const leaderboard = Object.values(performanceData)
//       .filter(person => person.rangeTotalLeads > 0 || person.cumulativeTotalLeads > 0)
//       .map(person => {
//         let status = 'new';
//         let statusIcon = '🆕';
//         let statusColor = 'bg-gray-100 text-gray-800 border-gray-200';

//         if (person.rangeConversionRate >= 70) {
//           status = 'star';
//           statusIcon = '⭐';
//           statusColor = 'bg-yellow-100 text-yellow-800 border-yellow-200';
//         } else if (person.rangeConversionRate >= 50) {
//           status = 'active';
//           statusIcon = '🔥';
//           statusColor = 'bg-green-100 text-green-800 border-green-200';
//         } else if (person.rangeConversionRate >= 30) {
//           status = 'rising';
//           statusIcon = '🚀';
//           statusColor = 'bg-blue-100 text-blue-800 border-blue-200';
//         } else if (person.rangeConversionRate > 0) {
//           status = 'new';
//           statusIcon = '🆕';
//           statusColor = 'bg-gray-100 text-gray-800 border-gray-200';
//         } else {
//           status = 'inactive';
//           statusIcon = '💤';
//           statusColor = 'bg-gray-100 text-gray-500 border-gray-200';
//         }

//         return {
//           id: person.id,
//           Name: person.name,
//           email: person.email,
//           role: person.role,
//           team: person.team,
//           avatar: person.avatar,
//           'Range Raw Leads': person.rangeRawLeads,
//           'Range Qualification Deals': person.rangeQualificationDeals,
//           'Range Converted Leads': person.rangeConvertedLeads,
//           'Range Total Leads': person.rangeTotalLeads,
//           'Range Performance %': `${person.rangeConversionRate.toFixed(1)}%`,
//           rangeConversionRate: person.rangeConversionRate,
//           'Cumulative Raw Leads': person.cumulativeRawLeads,
//           'Cumulative Qualification Deals': person.cumulativeQualificationDeals,
//           'Cumulative Converted Leads': person.cumulativeConvertedLeads,
//           'Cumulative Total Leads': person.cumulativeTotalLeads,
//           'Cumulative Performance %': `${person.cumulativeConversionRate.toFixed(1)}%`,
//           cumulativeConversionRate: person.cumulativeConversionRate,
//           // ✅ DISPLAY METRICS
//           'Total Leads': person.rangeTotalLeads,
//           'Qualification Deals': person.rangeQualificationDeals,
//           'Converted Leads': person.rangeConvertedLeads,
//           'Performance %': `${person.rangeConversionRate.toFixed(1)}%`,
//           conversionRate: person.rangeConversionRate,
//           'Streak': person.streak,
//           'Active Days': person.productiveDays,
//           'Work Hours': formatWorkHours(person.dailySessions),
//           performanceScore: Math.min(Math.round(person.rangeConversionRate), 100),
//           status: status,
//           statusIcon: statusIcon,
//           statusColor: statusColor,
//           lastActive: person.allLoginHistory[0]?.login || null
//         };
//       })
//       // ✅ VOLUME-FIRST SORTING
//       .sort((a, b) => {
//         // First sort by converted leads volume (higher is better)
//         if (b['Converted Leads'] !== a['Converted Leads']) {
//           return b['Converted Leads'] - a['Converted Leads'];
//         }
//         // If equal, sort by conversion rate (higher is better)
//         return b.conversionRate - a.conversionRate;
//       });

//     return leaderboard;
//   };
//   // API CALLS
//   const fetchUserLoginHistory = async (userId) => {
//     try {
//       const { data } = await axios.get(`${API_URL}/streak/login-history/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       return data.loginHistory || [];
//     } catch (error) {
//       console.error(`Error fetching login history for user ${userId}:`, error);
//       return [];
//     }
//   };
//   // CALCULATE SUMMARY STATS
//   const calculateStats = (leaderboardData) => {
//     const totalSalespeople = leaderboardData.length;
//     const activeSalespeople = leaderboardData.filter(p => p.conversionRate > 0).length;
//     const avgConversionRate = totalSalespeople > 0
//       ? leaderboardData.reduce((acc, p) => acc + p.conversionRate, 0) / totalSalespeople
//       : 0;
//     const totalLeads = leaderboardData.reduce((acc, p) => acc + p['Total Leads'], 0);
//     const totalQualificationDeals = leaderboardData.reduce((acc, p) => acc + p['Qualification Deals'], 0);
//     const totalConvertedLeads = leaderboardData.reduce((acc, p) => acc + p['Converted Leads'], 0);
//     const cumulativeTotalLeads = leaderboardData.reduce((acc, p) => acc + (p['Cumulative Total Leads'] || 0), 0);
//     const cumulativeAvgConversionRate = totalSalespeople > 0
//       ? leaderboardData.reduce((acc, p) => acc + (p.cumulativeConversionRate || 0), 0) / totalSalespeople
//       : 0;
//     setStats({
//       totalSalespeople,
//       activeSalespeople,
//       avgConversionRate,
//       totalLeads,
//       totalQualificationDeals,
//       totalConvertedLeads,
//       cumulativeTotalLeads,
//       cumulativeAvgConversionRate
//     });
//   };
//   // MAIN FETCH FUNCTION
//   const fetchStreakData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const startDateObj = new Date(startDate);
//       const endDateObj = new Date(endDate);
//       // Set time to beginning and end of day
//       startDateObj.setHours(0, 0, 0, 0);
//       endDateObj.setHours(23, 59, 59, 999);
//       let allLeads = [];
//       try {
//         const { data } = await axios.get(`${API_URL}/leads/getAllLead`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         allLeads = data || [];
//         console.log(`✅ LEADS: Fetched ${allLeads.length} total leads`);
//       } catch (error) {
//         console.error("Error fetching leads:", error);
//         throw new Error("Failed to fetch leads");
//       }
//       let allDeals = [];
//       try {
//         const { data } = await axios.get(`${API_URL}/deals/getAll`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         allDeals = data || [];
//         console.log(`✅ DEALS: Fetched ${allDeals.length} deals`);
//       } catch (error) {
//         console.error("Error fetching deals:", error);
//         throw new Error("Failed to fetch deals");
//       }
//       const allSalespeople = extractAllSalespeople(allLeads, allDeals);
//       console.log(`👥 SALESPEOPLE: Found ${allSalespeople.length} unique`);
//       const userLogsMap = {};
//       for (const user of allSalespeople) {
//         const history = await fetchUserLoginHistory(user._id);
//         userLogsMap[user._id.toString()] = history.map(log => ({
//           ...log,
//           userId: user._id.toString()
//         }));
//       }
//       console.log(`📅 LOGIN HISTORY: Fetched for ${Object.keys(userLogsMap).length} users`);
//       const leaderboardData = calculateMonthlyLeaderboard(
//         allDeals,
//         allLeads,
//         userLogsMap,
//         allSalespeople
//       );
//       console.log(`📊 LEADERBOARD: Generated ${leaderboardData.length} performers`);
//       calculateStats(leaderboardData);
//       let displayData = [];
//       if (isAdmin) {
//         displayData = leaderboardData;
//         console.log(`👑 ADMIN: Viewing ALL ${displayData.length} salespeople`);
//       } else {
//         const currentUserId = currentUser?._id?.toString();
//         displayData = leaderboardData.filter(p => p.id === currentUserId);
//         console.log(`👤 SALES: Viewing only own performance (${displayData.length} record)`);
//       }
//       setPerformers(displayData);
//       setFilteredPerformers(displayData);
//     } catch (error) {
//       console.error("Error in fetchStreakData:", error);
//       setError(error.message || "Failed to load leaderboard data");
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     if (currentUser) {
//       fetchStreakData();
//     }
//   }, [startDate, endDate, currentUser]);
//   // FILTERING & SORTING
//   useEffect(() => {
//     let result = [...performers];
//     if (isAdmin && searchTerm.trim() !== "") {
//       const term = searchTerm.toLowerCase();
//       result = result.filter(p =>
//         p.Name.toLowerCase().includes(term) ||
//         p.email.toLowerCase().includes(term) ||
//         p.role.toLowerCase().includes(term)
//       );
//     }
//     result.sort((a, b) => {
//       let aVal = a[sortBy] !== undefined ? a[sortBy] : 0;
//       let bVal = b[sortBy] !== undefined ? b[sortBy] : 0;
//       if (typeof aVal === 'string' && typeof bVal === 'string') {
//         return sortOrder === 'desc'
//           ? bVal.localeCompare(aVal)
//           : aVal.localeCompare(bVal);
//       }
//       return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
//     });
//     setFilteredPerformers(result);
//     setCurrentPage(1);
//   }, [searchTerm, sortBy, sortOrder, performers, isAdmin]);
//   // PAGINATION CALCULATIONS
//   const indexOfLastUser = currentPage * itemsPerPage;
//   const indexOfFirstUser = indexOfLastUser - itemsPerPage;
//   const currentUsers = filteredPerformers.slice(indexOfFirstUser, indexOfLastUser);
//   const totalPages = Math.ceil(filteredPerformers.length / itemsPerPage);
//   useEffect(() => {
//     setTotalCount(filteredPerformers.length);
//   }, [filteredPerformers]);
//   // HANDLERS
//   const handleSort = (field) => {
//     if (sortBy === field) {
//       setSortOrder(sortOrder === "desc" ? "asc" : "desc");
//     } else {
//       setSortBy(field);
//       setSortOrder("desc");
//     }
//   };

//   const handleItemsPerPageChange = (e) => {
//     setItemsPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const SortIcon = ({ field }) => (
//     sortBy === field ? (
//       sortOrder === "desc" ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
//     ) : null
//   );
//   const CustomHeader = ({ date, decreaseMonth, increaseMonth }) => (
//     <div className="flex items-center justify-between px-3 py-2 bg-white">
//       <span className="text-sm font-bold text-gray-800">
//         {date.toLocaleString("default", { month: "long" })} {date.getFullYear()}
//       </span>
//       <div className="flex flex-col -space-y-1">
//         <button onClick={increaseMonth} type="button" className="text-gray-400 hover:text-orange-500">
//           <FiChevronUp size={16} />
//         </button>
//         <button onClick={decreaseMonth} type="button" className="text-gray-400 hover:text-orange-500">
//           <FiChevronDown size={16} />
//         </button>
//       </div>
//     </div>
//   );
//   // RENDER UI
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
//             <div className="animate-pulse space-y-6">
//               <div className="h-10 bg-gray-200 rounded-lg w-64"></div>
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 {[1, 2, 3, 4].map(i => (
//                   <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
//                 ))}
//               </div>
//               <div className="h-14 bg-gray-200 rounded-lg w-full"></div>
//               <div className="space-y-4">
//                 {[1, 2, 3, 4, 5].map(i => (
//                   <div key={i} className="h-20 bg-gray-100 rounded-lg"></div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-12 text-center">
//             <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Activity className="w-10 h-10 text-red-500" />
//             </div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-3">Failed to Load Data</h2>
//             <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
//             <button
//               onClick={fetchStreakData}
//               className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }
//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* HEADER WITH ROLE BADGE */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="p-4 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-2xl shadow-lg shadow-orange-200">
//                 <Trophy className="w-8 h-8 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
//                   Lead Conversion Leaderboard
//                 </h1>
//                 <div className="flex items-center gap-3 mt-2">
//                   <span className="px-4 py-1.5 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm border border-gray-200">
//                     {months[selectedMonth]} {selectedYear}
//                   </span>

//                   {isAdmin ? (
//                     <span className="px-4 py-1.5 bg-purple-100 rounded-full text-sm font-medium text-purple-700 border border-purple-200 flex items-center gap-1.5">
//                       <Eye className="w-4 h-4" />
//                       Admin View - All Salespeople
//                     </span>
//                   ) : (
//                     <span className="px-4 py-1.5 bg-blue-100 rounded-full text-sm font-medium text-blue-700 border border-blue-200 flex items-center gap-1.5">
//                       <EyeOff className="w-4 h-4" />
//                       My Performance Only
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
//               <div className="flex items-center gap-2">
//                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold">
//                   {currentUser?.firstName?.charAt(0) || 'U'}
//                 </div>
//                 <div className="text-sm">
//                   <p className="font-medium text-gray-900">{currentUser?.firstName} {currentUser?.lastName}</p>
//                   <p className="text-xs text-gray-500">{userRole}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* SUMMARY STATS CARDS */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-sm font-medium text-gray-600">
//                 {isAdmin ? 'Active Salespeople' : 'Your Status'}
//               </span>
//               <Users className="w-5 h-5 text-orange-500" />
//             </div>
//             <div className="text-2xl font-bold text-gray-900">
//               {isAdmin ? stats.activeSalespeople : (performers[0]?.status || 'Active')}
//             </div>
//             <div className="text-xs text-gray-500 mt-1">
//               {isAdmin
//                 ? `Out of ${stats.totalSalespeople} total`
//                 : `${performers[0]?.performanceScore || 0}% conversion`
//               }
//             </div>
//           </div>

//           <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-sm font-medium text-gray-600">
//                 {isAdmin ? 'Avg Conversion Rate' : 'Your Conversion Rate'}
//               </span>
//               <Target className="w-5 h-5 text-green-500" />
//             </div>
//             <div className="text-2xl font-bold text-gray-900">
//               {isAdmin
//                 ? `${stats.avgConversionRate.toFixed(1)}%`
//                 : `${performers[0]?.conversionRate.toFixed(1) || '0'}%`
//               }
//             </div>
//             <div className="text-xs text-gray-500 mt-1">
//               {formatDateRange()}
//             </div>
//           </div>

//           <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-sm font-medium text-gray-600">
//                 {isAdmin ? 'Total Leads' : 'Your Leads'}
//               </span>
//               <Target className="w-5 h-5 text-blue-500" />
//             </div>
//             <div className="text-2xl font-bold text-gray-900">
//               {isAdmin
//                 ? stats.totalLeads.toLocaleString()
//                 : performers[0]?.['Total Leads']?.toLocaleString() || '0'
//               }
//             </div>
//             <div className="text-xs text-gray-500 mt-1">
//               {formatDateRange()}
//             </div>
//           </div>

//           <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-sm font-medium text-gray-600">
//                 {isAdmin ? 'Converted Leads' : 'Your Conversions'}
//               </span>
//               <TrendingUp className="w-5 h-5 text-purple-500" />
//             </div>
//             <div className="text-2xl font-bold text-gray-900">
//               {isAdmin
//                 ? stats.totalConvertedLeads.toLocaleString()
//                 : performers[0]?.['Converted Leads']?.toLocaleString() || '0'
//               }
//             </div>
//             <div className="text-xs text-gray-500 mt-1">
//               Deals with Lead ID
//             </div>
//           </div>
//         </div>
//         {/* LEADERBOARD TABLE */}
//         <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
//         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5">

//   {/* Date Range Section */}
//   <div className="flex items-center gap-3 flex-wrap">

//     <div className="flex items-center gap-2">
//       <Calendar className="w-5 h-5 text-gray-500" />
//       <span className="text-sm font-medium text-gray-700">Date Range:</span>
//     </div>

//     {/* Start Date */}
//     <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 hover:border-orange-400 transition-colors w-[150px]">
//       <FiCalendar className="text-gray-400 w-4 h-4" />
//       <input
//         type="date"
//         value={startDate}
//         onChange={(e) => setStartDate(e.target.value)}
//         className="bg-transparent border-none focus:outline-none text-gray-700 text-sm w-full"
//       />
//     </div>

//     <span className="text-gray-400">—</span>

//     {/* End Date */}
//     <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 hover:border-orange-400 transition-colors w-[150px]">
//       <FiCalendar className="text-gray-400 w-4 h-4" />
//       <input
//         type="date"
//         value={endDate}
//         onChange={(e) => setEndDate(e.target.value)}
//         className="bg-transparent border-none focus:outline-none text-gray-700 text-sm w-full"
//       />
//     </div>

//   </div>

//   {/* Right Section */}
//   <div className="flex flex-wrap items-center gap-2">

//     <button
//       onClick={handleThisMonth}
//       className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
//     >
//       This Month
//     </button>

//     <button
//       onClick={handleLastMonth}
//       className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
//     >
//       Last Month
//     </button>

//     <button
//       onClick={handleLast7Days}
//       className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
//     >
//       7 Days
//     </button>

//     <button
//       onClick={handleLast30Days}
//       className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
//     >
//       30 Days
//     </button>

//     {/* Search */}
//     {isAdmin && (
//       <div className="relative ml-2 w-[160px]">
//         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//         <input
//           type="text"
//           placeholder="Search"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="pl-9 pr-2 py-2 border border-gray-200 rounded-lg w-full focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
//         />
//       </div>
//     )}

//     {/* Refresh */}
//     <button
//       onClick={fetchStreakData}
//       className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//       title="Refresh"
//     >
//       <RefreshCw className="w-5 h-5" />
//     </button>

//   </div>

// </div>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="bg-gray-50 border-b border-gray-100">
//                   <th className="py-5 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rank</th>
//                   <th className="py-5 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sales Person</th>
//                   <th className="py-5 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
//                   <th
//                     onClick={() => handleSort("conversionRate")}
//                     className="py-5 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-gray-900"
//                   >
//                     <div className="flex items-center gap-1">
//                       Conversion % <SortIcon field="conversionRate" />
//                     </div>
//                   </th>
//                   <th
//                     onClick={() => handleSort("Total Leads")}
//                     className="py-5 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-gray-900"
//                   >
//                     <div className="flex items-center gap-1">
//                       Total Leads <SortIcon field="Total Leads" />
//                     </div>
//                   </th>
//                   {/* Converted Leads - Primary sort */}
//                   <th
//                     onClick={() => handleSort("Converted Leads")}
//                     className="py-5 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-gray-900"
//                   >
//                     <div className="flex items-center gap-1">
//                       Converted <SortIcon field="Converted Leads" />
//                     </div>
//                   </th>
//                   <th className="py-5 px-7 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Work Hours</th>
//                   <th
//                     onClick={() => handleSort("Active Days")}
//                     className="py-5 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-gray-900"
//                   >
//                     <div className="flex items-center gap-1">
//                       Active Days <SortIcon field="Active Days" />
//                     </div>
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentUsers.map((performer, index) => {
//                   const rank = index + indexOfFirstUser + 1;
//                   let rankClass = "bg-gray-100 text-gray-700";
//                   if (rank === 1) rankClass = "bg-gradient-to-br from-yellow-400 to-amber-500 text-white";
//                   else if (rank === 2) rankClass = "bg-gradient-to-br from-gray-300 to-gray-400 text-white";
//                   else if (rank === 3) rankClass = "bg-gradient-to-br from-amber-700 to-amber-800 text-white";
//                   const isCurrentUser = performer.id === currentUser?._id?.toString();
//                   return (
//                     <tr key={performer.id} className={`border-b border-gray-50 transition-colors ${isCurrentUser && !isAdmin ? 'bg-blue-50/50 hover:bg-blue-100/50' : 'hover:bg-orange-50/30'}`}>
//                       <td className="py-5 px-6"><div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${rankClass}`}>{rank}</div></td>
//                       <td className="py-5 px-6">
//                         <div>
//                           <div className="font-semibold text-gray-900">{performer.Name} {isCurrentUser && <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full ml-2">You</span>}</div>
//                           <div className="text-xs text-gray-500">{performer.email}</div>
//                           <div className="text-[10px] text-purple-500">All time: {performer['Cumulative Total Leads']} leads • {performer['Cumulative Performance %']}</div>
//                         </div>
//                       </td>
//                       <td className="py-5 px-6"><div className={`px-3 py-1.5 rounded-xl text-xs font-medium inline-flex items-center gap-1.5 ${performer.statusColor}`}><span>{performer.statusIcon}</span><span className="capitalize">{performer.status}</span></div></td>
//                       <td className="py-5 px-6">
//                         <div className="space-y-2">
//                           <div className="flex items-center gap-2">
//                             <span className="text-2xl font-bold text-gray-900">{performer['Performance %']}</span>
//                           </div>
//                           <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
//                             <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500" style={{ width: `${Math.min(performer.conversionRate, 100)}%` }} />
//                           </div>
//                         </div>
//                       </td>
//                       <td className="py-5 px-6"><div className="text-lg font-bold text-gray-900">{performer['Total Leads']}</div></td>
//                       {/* Converted Leads - Highlighted */}
//                       <td className="py-5 px-6">
//                         <div className="text-lg font-bold text-green-600">
//                           {performer['Converted Leads']}
//                         </div>
//                       </td>
//                       <td className="py-10 px-2"><span className="text-sm font-medium text-gray-700">{performer['Work Hours']}</span></td>
//                       <td className="py-5 px-6">
//                         <div className="flex items-center gap-2">
//                           <Calendar className="w-4 h-4 text-gray-400" />
//                           <span className="font-medium">{performer['Active Days']}</span>
//                           <span className="text-xs text-gray-500">days</span>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//           {/* PAGINATION */}
//           <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-t border-gray-100 gap-4">
//             <div className="flex items-center gap-3 text-sm text-gray-600">
//               <span>Show</span>
//               <select value={itemsPerPage} onChange={handleItemsPerPageChange} className="border border-gray-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-orange-500">
//                 <option value={5}>5</option>
//                 <option value={10}>10</option>
//                 <option value={20}>20</option>
//                 <option value={50}>50</option>
//               </select>
//               <span>entries</span>
//             </div>
//             <div className="text-sm text-gray-500">
//               Showing <span className="font-medium text-gray-900">{totalCount === 0 ? 0 : indexOfFirstUser + 1}</span> to <span className="font-medium text-gray-900">{Math.min(indexOfLastUser, totalCount)}</span> of <span className="font-medium text-gray-900">{totalCount}</span> entries
//             </div>
//             <div className="flex items-center gap-2">
//               <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={`p-2 rounded-lg border ${currentPage === 1 ? "text-gray-300 border-gray-200 cursor-not-allowed" : "text-gray-600 border-gray-200 hover:bg-gray-100"}`}>
//                 <ChevronLeft className="w-4 h-4" />
//               </button>
//               {Array.from({ length: totalPages }, (_, i) => (
//                 <button key={i} onClick={() => handlePageChange(i + 1)} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${currentPage === i + 1 ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
//                   {i + 1}
//                 </button>
//               ))}
//               <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className={`p-2 rounded-lg border ${currentPage === totalPages ? "text-gray-300 border-gray-200 cursor-not-allowed" : "text-gray-600 border-gray-200 hover:bg-gray-100"}`}>
//                 <ChevronRight className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AllStreakLeaderboard;
import React, { useState, useEffect, useCallback } from "react";
import {
  Trophy, Filter, RefreshCw, ChevronLeft, ChevronRight,
  Calendar, Activity, Clock, Search, ChevronDown, ChevronUp,
  Mail, Users, Briefcase, Flame, Target, Zap, TrendingUp,
  Eye, EyeOff
} from "lucide-react";
import axios from "axios";
import { FiCalendar } from "react-icons/fi";

const AllStreakLeaderboard = () => {
  const [performers, setPerformers]                 = useState([]);
  const [filteredPerformers, setFilteredPerformers] = useState([]);
  const [loading, setLoading]                       = useState(true);
  const [error, setError]                           = useState(null);
  const [searchTerm, setSearchTerm]                 = useState("");
  const [sortBy, setSortBy]                         = useState("convertedLeads");
  const [sortOrder, setSortOrder]                   = useState("desc");
  const [currentPage, setCurrentPage]               = useState(1);
  const [itemsPerPage, setItemsPerPage]             = useState(10);
  const [currentUser, setCurrentUser]               = useState(null);
  const [userRole, setUserRole]                     = useState(null);
  const [isAdmin, setIsAdmin]                       = useState(false);
  const [dateRange, setDateRange]                   = useState("");
  const [stats, setStats] = useState({
    totalSalespeople:   0,
    activeSalespeople:  0,
    avgConversionRate:  0,
    totalLeads:         0,
    totalConvertedLeads: 0,
    cumulativeTotalLeads: 0,
  });

  // ── Date range state ───────────────────────────────────────────────────────
  const todayStr       = () => new Date().toISOString().split("T")[0];
  const firstOfMonthStr = () => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), 1).toISOString().split("T")[0];
  };
  const [startDate, setStartDate] = useState(firstOfMonthStr);
  const [endDate, setEndDate]     = useState(todayStr);

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const [selectedMonth] = useState(new Date().getMonth());
  const [selectedYear]  = useState(new Date().getFullYear());

  const API_URL = import.meta.env.VITE_API_URL;
  const token   = localStorage.getItem("token");

  // ── Quick-select helpers ───────────────────────────────────────────────────
  const formatDateRange = () => {
    if (!startDate || !endDate) return "";
    const s = new Date(startDate);
    const e = new Date(endDate);
    return `${s.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} - ${e.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  };

  const handleThisMonth = () => {
    const t = new Date();
    setStartDate(new Date(t.getFullYear(), t.getMonth(), 1).toISOString().split("T")[0]);
    setEndDate(t.toISOString().split("T")[0]);
  };

  const handleLastMonth = () => {
    const t = new Date();
    const first = new Date(t.getFullYear(), t.getMonth() - 1, 1);
    const last  = new Date(t.getFullYear(), t.getMonth(), 0);
    setStartDate(first.toISOString().split("T")[0]);
    setEndDate(last.toISOString().split("T")[0]);
  };

  const handleLast7Days = () => {
    const t = new Date();
    const s = new Date(t); s.setDate(s.getDate() - 7);
    setStartDate(s.toISOString().split("T")[0]);
    setEndDate(t.toISOString().split("T")[0]);
  };

  const handleLast30Days = () => {
    const t = new Date();
    const s = new Date(t); s.setDate(s.getDate() - 30);
    setStartDate(s.toISOString().split("T")[0]);
    setEndDate(t.toISOString().split("T")[0]);
  };

  // ── Bootstrap current user ─────────────────────────────────────────────────
  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      setCurrentUser(userData);
      const role = userData?.role?.name || userData?.role || "User";
      setUserRole(role);
      setIsAdmin(role === "Admin");
    } catch (e) {
      console.error("Error reading user:", e);
    }
  }, []);

  // ── SINGLE API CALL — all computation on the backend ──────────────────────
  const fetchStreakData = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.get(`${API_URL}/streak/leaderboard`, {
        headers: { Authorization: `Bearer ${token}` },
        params:  { startDate, endDate },
      });

      if (!data.success) throw new Error(data.error || "Server error");

      setPerformers(data.data || []);
      setFilteredPerformers(data.data || []);
      setStats(data.stats || {});
      setDateRange(data.dateRange?.formatted || formatDateRange());
    } catch (err) {
      console.error("fetchStreakData error:", err);
      setError(err.response?.data?.error || err.message || "Failed to load leaderboard data");
    } finally {
      setLoading(false);
    }
  }, [API_URL, token, startDate, endDate]);

  useEffect(() => {
    if (currentUser) fetchStreakData();
  }, [startDate, endDate, currentUser]);

  // ── Client-side search + sort (instant, no re-fetch) ──────────────────────
  useEffect(() => {
    let result = [...performers];

    if (isAdmin && searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.name?.toLowerCase().includes(term)  ||
        p.email?.toLowerCase().includes(term) ||
        p.role?.toLowerCase().includes(term)
      );
    }

    // Map old camelCase/space-key names to API response fields
    const fieldMap = {
      convertedLeads:  "convertedLeads",
      conversionRate:  "conversionRate",
      "Total Leads":   "totalLeads",
      "Active Days":   "productiveDays",
      Streak:          "streak",
    };

    result.sort((a, b) => {
      const key  = fieldMap[sortBy] || sortBy;
      const aVal = a[key] ?? 0;
      const bVal = b[key] ?? 0;
      if (typeof aVal === "string") {
        return sortOrder === "desc" ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
      }
      return sortOrder === "desc" ? bVal - aVal : aVal - bVal;
    });

    setFilteredPerformers(result);
    setCurrentPage(1);
  }, [searchTerm, sortBy, sortOrder, performers, isAdmin]);

  // ── Pagination ─────────────────────────────────────────────────────────────
  const totalCount   = filteredPerformers.length;
  const indexOfFirst = (currentPage - 1) * itemsPerPage;
  const indexOfLast  = indexOfFirst + itemsPerPage;
  const currentUsers = filteredPerformers.slice(indexOfFirst, indexOfLast);
  const totalPages   = Math.ceil(totalCount / itemsPerPage);

  const handleSort = (field) => {
    if (sortBy === field) setSortOrder(o => o === "desc" ? "asc" : "desc");
    else { setSortBy(field); setSortOrder("desc"); }
  };

  const SortIcon = ({ field }) =>
    sortBy === field
      ? (sortOrder === "desc" ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />)
      : null;

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="animate-pulse space-y-6">
              <div className="h-10 bg-gray-200 rounded-lg w-64"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>)}
              </div>
              <div className="h-14 bg-gray-200 rounded-lg w-full"></div>
              <div className="space-y-4">
                {[1,2,3,4,5].map(i => <div key={i} className="h-20 bg-gray-100 rounded-lg"></div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-12 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Activity className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Failed to Load Data</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
            <button
              onClick={fetchStreakData}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-2xl shadow-lg shadow-orange-200">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Lead Conversion Leaderboard
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className="px-4 py-1.5 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm border border-gray-200">
                    {months[selectedMonth]} {selectedYear}
                  </span>
                  {isAdmin ? (
                    <span className="px-4 py-1.5 bg-purple-100 rounded-full text-sm font-medium text-purple-700 border border-purple-200 flex items-center gap-1.5">
                      <Eye className="w-4 h-4" /> Admin View - All Salespeople
                    </span>
                  ) : (
                    <span className="px-4 py-1.5 bg-blue-100 rounded-full text-sm font-medium text-blue-700 border border-blue-200 flex items-center gap-1.5">
                      <EyeOff className="w-4 h-4" /> My Performance Only
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold">
                  {currentUser?.firstName?.charAt(0) || "U"}
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{currentUser?.firstName} {currentUser?.lastName}</p>
                  <p className="text-xs text-gray-500">{userRole}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                {isAdmin ? "Active Salespeople" : "Your Status"}
              </span>
              <Users className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {isAdmin ? stats.activeSalespeople : (performers[0]?.status || "—")}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {isAdmin
                ? `Out of ${stats.totalSalespeople} total`
                : `${performers[0]?.performanceScore || 0}% conversion`}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                {isAdmin ? "Avg Conversion Rate" : "Your Conversion Rate"}
              </span>
              <Target className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {isAdmin
                ? `${stats.avgConversionRate ?? 0}%`
                : `${performers[0]?.conversionRate ?? 0}%`}
            </div>
            <div className="text-xs text-gray-500 mt-1">{dateRange || formatDateRange()}</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                {isAdmin ? "Total Leads" : "Your Leads"}
              </span>
              <Target className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {isAdmin
                ? stats.totalLeads?.toLocaleString()
                : performers[0]?.totalLeads?.toLocaleString() || "0"}
            </div>
            <div className="text-xs text-gray-500 mt-1">{dateRange || formatDateRange()}</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                {isAdmin ? "Converted Leads" : "Your Conversions"}
              </span>
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {isAdmin
                ? stats.totalConvertedLeads?.toLocaleString()
                : performers[0]?.convertedLeads?.toLocaleString() || "0"}
            </div>
            <div className="text-xs text-gray-500 mt-1">Deals with Lead ID</div>
          </div>
        </div>

        {/* TABLE CARD */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">

          {/* Toolbar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5">

            {/* Date Range */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Date Range:</span>
              </div>

              <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 hover:border-orange-400 transition-colors w-[150px]">
                <FiCalendar className="text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="bg-transparent border-none focus:outline-none text-gray-700 text-sm w-full"
                />
              </div>

              <span className="text-gray-400">—</span>

              <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 hover:border-orange-400 transition-colors w-[150px]">
                <FiCalendar className="text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="bg-transparent border-none focus:outline-none text-gray-700 text-sm w-full"
                />
              </div>
            </div>

            {/* Quick selects + search + refresh */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                ["This Month", handleThisMonth],
                ["Last Month", handleLastMonth],
                ["7 Days",     handleLast7Days],
                ["30 Days",    handleLast30Days],
              ].map(([label, fn]) => (
                <button key={label} onClick={fn}
                  className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  {label}
                </button>
              ))}

              {isAdmin && (
                <div className="relative ml-2 w-[160px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-9 pr-2 py-2 border border-gray-200 rounded-lg w-full focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  />
                </div>
              )}

              <button
                onClick={fetchStreakData}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-5 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rank</th>
                  <th className="py-5 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sales Person</th>
                  <th className="py-5 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th
                    onClick={() => handleSort("conversionRate")}
                    className="py-5 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-gray-900"
                  >
                    <div className="flex items-center gap-1">Conversion % <SortIcon field="conversionRate" /></div>
                  </th>
                  <th
                    onClick={() => handleSort("Total Leads")}
                    className="py-5 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-gray-900"
                  >
                    <div className="flex items-center gap-1">Total Leads <SortIcon field="Total Leads" /></div>
                  </th>
                  <th
                    onClick={() => handleSort("convertedLeads")}
                    className="py-5 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-gray-900"
                  >
                    <div className="flex items-center gap-1">Converted <SortIcon field="convertedLeads" /></div>
                  </th>
                  <th className="py-5 px-7 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Work Hours</th>
                  <th
                    onClick={() => handleSort("Active Days")}
                    className="py-5 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-gray-900"
                  >
                    <div className="flex items-center gap-1">Active Days <SortIcon field="Active Days" /></div>
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-gray-400 text-sm">
                      No data found for the selected period.
                    </td>
                  </tr>
                ) : currentUsers.map((performer, index) => {
                  const rank = index + indexOfFirst + 1;
                  const rankClass =
                    rank === 1 ? "bg-gradient-to-br from-yellow-400 to-amber-500 text-white" :
                    rank === 2 ? "bg-gradient-to-br from-gray-300 to-gray-400 text-white"   :
                    rank === 3 ? "bg-gradient-to-br from-amber-700 to-amber-800 text-white"  :
                    "bg-gray-100 text-gray-700";

                  const isCurrentUser = performer.id === currentUser?._id?.toString();

                  return (
                    <tr
                      key={performer.id}
                      className={`border-b border-gray-50 transition-colors ${
                        isCurrentUser && !isAdmin
                          ? "bg-blue-50/50 hover:bg-blue-100/50"
                          : "hover:bg-orange-50/30"
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-5 px-6">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${rankClass}`}>
                          {rank}
                        </div>
                      </td>

                      {/* Salesperson */}
                      <td className="py-5 px-6">
                        <div>
                          <div className="font-semibold text-gray-900">
                            {performer.name}
                            {isCurrentUser && (
                              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full ml-2">You</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">{performer.email}</div>
                          <div className="text-[10px] text-purple-500">
                            All time: {performer.cumulativeTotalLeads} leads · {performer.cumulativeDisplay}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-5 px-6">
                        <div className={`px-3 py-1.5 rounded-xl text-xs font-medium inline-flex items-center gap-1.5 ${performer.statusColor}`}>
                          <span>{performer.statusIcon}</span>
                          <span className="capitalize">{performer.status}</span>
                        </div>
                      </td>

                      {/* Conversion % */}
                      <td className="py-5 px-6">
                        <div className="space-y-2">
                          <div className="text-2xl font-bold text-gray-900">{performer.conversionDisplay}</div>
                          <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
                              style={{ width: `${Math.min(performer.conversionRate, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Total Leads */}
                      <td className="py-5 px-6">
                        <div className="text-lg font-bold text-gray-900">{performer.totalLeads}</div>
                      </td>

                      {/* Converted Leads */}
                      <td className="py-5 px-6">
                        <div className="text-lg font-bold text-green-600">{performer.convertedLeads}</div>
                      </td>

                      {/* Work Hours */}
                      <td className="py-10 px-2">
                        <span className="text-sm font-medium text-gray-700">{performer.workHours}</span>
                      </td>

                      {/* Active Days */}
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{performer.productiveDays}</span>
                          <span className="text-xs text-gray-500">days</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-t border-gray-100 gap-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span>Show</span>
              <select
                value={itemsPerPage}
                onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="border border-gray-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-orange-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span>entries</span>
            </div>

            <div className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium text-gray-900">{totalCount === 0 ? 0 : indexOfFirst + 1}</span>{" "}
              to{" "}
              <span className="font-medium text-gray-900">{Math.min(indexOfLast, totalCount)}</span>{" "}
              of{" "}
              <span className="font-medium text-gray-900">{totalCount}</span> entries
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => p - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg border ${currentPage === 1 ? "text-gray-300 border-gray-200 cursor-not-allowed" : "text-gray-600 border-gray-200 hover:bg-gray-100"}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    currentPage === page ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`p-2 rounded-lg border ${
                  currentPage === totalPages || totalPages === 0
                    ? "text-gray-300 border-gray-200 cursor-not-allowed"
                    : "text-gray-600 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllStreakLeaderboard;