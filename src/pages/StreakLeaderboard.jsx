import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Activity, Calendar, RefreshCw, Crown, Flame } from "lucide-react";
import axios from "axios";

const StreakLeaderboard = () => {
  const [topPerformer, setTopPerformer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showFilters, setShowFilters] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = [2024, 2025, 2026];
  // NAVIGATION TO FULL LEADERBOARD
  const handleCardClick = () => {
    navigate("/streak-leaderboard");
  };

  // EXTRACT ID HELPERS
  const extractLeadAssigneeId = (lead) => {
    if (!lead?.assignTo) return null;
    if (typeof lead.assignTo === 'string') return lead.assignTo;
    if (lead.assignTo._id) return lead.assignTo._id.toString();
    return null;
  };
  // GET CURRENT USER & ROLE
  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      setCurrentUser(userData);

      const role = userData?.role?.name || userData?.role || 'User';
      setIsAdmin(role === 'Admin');

    } catch (error) {
      console.error("Error getting user data:", error);
    }
  }, []);
  const extractDealAssigneeId = (deal) => {
    if (!deal?.assignedTo) return null;
    if (typeof deal.assignedTo === 'string') return deal.assignedTo;
    if (deal.assignedTo._id) return deal.assignedTo._id.toString();
    return null;
  };
  // DEAL STATUS HELPERS
  const isDealQualification = (deal) => {
    return deal?.stage?.toLowerCase() === 'qualification';
  };
  // FORMATTING HELPERS
  const formatTime = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };
  const formatWorkHours = (dailySessions) => {
    if (!dailySessions || dailySessions.length === 0) return '—';
  const earliestLogin = dailySessions.reduce((earliest, session) => {
      return new Date(session.login) < new Date(earliest) ? session.login : earliest;
    }, dailySessions[0].login);
  const validLogouts = dailySessions.filter(s => s.logout);
    if (validLogouts.length === 0) {
      return `${formatTime(earliestLogin)} - Ongoing`;
    }
   const latestLogout = validLogouts.reduce((latest, session) => {
      return new Date(session.logout) > new Date(latest) ? session.logout : latest;
    }, validLogouts[0].logout);
    return `${formatTime(earliestLogin)} - ${formatTime(latestLogout)}`;
  };
  // STREAK CALCULATION
  const calculateHourStreak = (loginHistory) => {
    if (!loginHistory || loginHistory.length === 0) return 0;
    const logins = loginHistory
      .filter(log => log?.login)
      .map(log => new Date(log.login))
      .sort((a, b) => b - a);
  if (logins.length === 0) return 0;
    const now = new Date();
    const latestLogin = logins[0];
    const hoursSinceLastLogin = (now - latestLogin) / (1000 * 60 * 60);
    if (hoursSinceLastLogin > 24) {
      return 0;
    }
    let streak = 1;
    for (let i = 1; i < logins.length; i++) {
      const currentLogin = logins[i - 1];
      const previousLogin = logins[i];
      const hoursBetween = (currentLogin - previousLogin) / (1000 * 60 * 60);
      if (hoursBetween <= 24) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };
  // GET ALL SALESPEOPLE
  const getSalespersonDetails = (item, type) => {
    if (!item) return null;
    if (type === 'lead' && item.assignTo) {
      return {
        id: item.assignTo._id?.toString() || item.assignTo.toString(),
        firstName: item.assignTo.firstName || '',
        lastName: item.assignTo.lastName || '',
        email: item.assignTo.email || '',
        role: item.assignTo.role?.name || 'Sales'
      };
    }
    if (type === 'deal' && item.assignedTo) {
      return {
        id: item.assignedTo._id?.toString() || item.assignedTo.toString(),
        firstName: item.assignedTo.firstName || '',
        lastName: item.assignedTo.lastName || '',
        email: item.assignedTo.email || '',
        role: item.assignedTo.role?.name || 'Sales'
      };
    }
    return null;
  };
  const extractAllSalespeople = (leads, deals) => {
    const salespeopleMap = new Map();
    leads.forEach(lead => {
      const details = getSalespersonDetails(lead, 'lead');
      if (details?.id) {
        if (!salespeopleMap.has(details.id)) {
          salespeopleMap.set(details.id, {
            _id: details.id,
            firstName: details.firstName || '',
            lastName: details.lastName || '',
            email: details.email || '',
            role: details.role || 'Sales',
            avatar: (details.firstName?.charAt(0) || 'U').toUpperCase()
          });
        }
      }
    });
    deals.forEach(deal => {
      const details = getSalespersonDetails(deal, 'deal');
      if (details?.id) {
        if (!salespeopleMap.has(details.id)) {
          salespeopleMap.set(details.id, {
            _id: details.id,
            firstName: details.firstName || '',
            lastName: details.lastName || '',
            email: details.email || '',
            role: details.role || 'Sales',
            avatar: (details.firstName?.charAt(0) || 'U').toUpperCase()
          });
        }
      }
    });
    return Array.from(salespeopleMap.values());
  };
  // MAIN CALCULATION - TOP 1 PERFORMER
  const calculateTopPerformer = (deals, leads, userLogsMap) => {
    const startDate = new Date(selectedYear, selectedMonth, 1);
    const endDate = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59, 999);
    const allSalespeople = extractAllSalespeople(leads, deals);
    const performanceData = {};
    allSalespeople.forEach(user => {
      if (user._id) {
        performanceData[user._id.toString()] = {
          id: user._id.toString(),
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Unknown',
          email: user.email || '',
          rawLeads: 0,
          qualificationDeals: 0,
          convertedLeads: 0,
          streak: 0,
          activeDays: 0,
          dailySessions: [],
          allLoginHistory: []
        };
      }
    });
    // Count RAW LEADS
    leads.forEach(lead => {
      const salespersonId = extractLeadAssigneeId(lead);
      if (!salespersonId || !performanceData[salespersonId]) return;
      performanceData[salespersonId].rawLeads += 1;
    });
    // Count QUALIFICATION DEALS and CONVERTED LEADS
    deals.forEach(deal => {
      const salespersonId = extractDealAssigneeId(deal);
      if (!salespersonId || !performanceData[salespersonId]) return;
      const isQualification = isDealQualification(deal);
      if (isQualification) {
        performanceData[salespersonId].qualificationDeals += 1;
        if (deal.leadId) {
          performanceData[salespersonId].convertedLeads += 1;
        }
      }
    });
    // Calculate TOTAL LEADS and CONVERSION RATE
    Object.keys(performanceData).forEach(userId => {
      const person = performanceData[userId];
      person.totalLeads = person.rawLeads + person.qualificationDeals;
      person.conversionRate = person.totalLeads > 0
        ? (person.convertedLeads / person.totalLeads) * 100
        : 0;
    });
    // Process LOGIN HISTORY
    Object.keys(performanceData).forEach(userId => {
      const userLogs = userLogsMap[userId] || [];
      performanceData[userId].allLoginHistory = userLogs;
      const monthLogs = userLogs.filter(log => {
        if (!log?.login) return false;
        const loginDate = new Date(log.login);
        return loginDate >= startDate && loginDate <= endDate;
      });
      const dailySessionsMap = new Map();
      monthLogs.forEach(log => {
        const loginDate = new Date(log.login);
        const dayKey = loginDate.toDateString();
        if (!dailySessionsMap.has(dayKey)) {
          dailySessionsMap.set(dayKey, {
            login: log.login,
            logout: log.logout || null
          });
        } else {
          const session = dailySessionsMap.get(dayKey);
          if (loginDate < new Date(session.login)) {
            session.login = log.login;
          }
          if (log.logout) {
            const logoutDate = new Date(log.logout);
            if (!session.logout || logoutDate > new Date(session.logout)) {
              session.logout = log.logout;
            }
          }
        }
      });
      performanceData[userId].dailySessions = Array.from(dailySessionsMap.values());
      performanceData[userId].activeDays = dailySessionsMap.size;
      performanceData[userId].streak = calculateHourStreak(performanceData[userId].allLoginHistory);
    });
    // Build leaderboard and return TOP 1
    const leaderboard = Object.values(performanceData)
      .filter(person => person.totalLeads > 0)
      .map(person => ({
        id: person.id,
        Name: person.name,
        email: person.email,
        'Performance %': `${person.conversionRate.toFixed(1)}%`,
        'Total Leads': person.totalLeads,
        'Work Hours': formatWorkHours(person.dailySessions),
        convertedLeads: person.convertedLeads,
        rawLeads: person.rawLeads,
        qualificationDeals: person.qualificationDeals,
        conversionRate: person.conversionRate,
        streak: person.streak,
        activeDays: person.activeDays || 0
      }))
      .sort((a, b) => {
        if (b.convertedLeads !== a.convertedLeads) {
          return b.convertedLeads - a.convertedLeads;
        }

        return b.conversionRate - a.conversionRate;
      });
    // ✅ DEBUG: Check sorting order
    console.log("🏆 SORTED LEADERBOARD:");
    leaderboard.forEach((p, i) => {
      console.log(`${i + 1}. ${p.Name}: ${p.convertedLeads} converted (${p.conversionRate.toFixed(1)}%)`);
    });
    return leaderboard.length > 0 ? leaderboard[0] : null;
  };
  // API CALLS
  const fetchUserLoginHistory = async (userId) => {
    try {
      const { data } = await axios.get(`${API_URL}/streak/login-history/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data.loginHistory || [];
    } catch (error) {
      console.error(`Error fetching login history for user ${userId}:`, error);
      return [];
    }
  };
  // MAIN FETCH
  const fetchTopPerformer = async () => {
    try {
      setLoading(true);
      setError(null);
      let allLeads = [];
      try {
        const { data } = await axios.get(`${API_URL}/leads/getAllLead`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        allLeads = data || [];
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
      let allDeals = [];
      try {
        const { data } = await axios.get(`${API_URL}/deals/getAll`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        allDeals = data || [];
      } catch (error) {
        console.error("Error fetching deals:", error);
      }
      const allSalespeople = extractAllSalespeople(allLeads, allDeals);
      const userLogsMap = {};
      for (const user of allSalespeople) {
        const history = await fetchUserLoginHistory(user._id);
        userLogsMap[user._id.toString()] = history.map(log => ({
          ...log,
          userId: user._id.toString()
        }));
      }
      const topPerformerData = calculateTopPerformer(
        allDeals,
        allLeads,
        userLogsMap
      );
      setTopPerformer(topPerformerData);
    } catch (error) {
      console.error("Error in fetchTopPerformer:", error);
      setError(error.message || "Failed to load top performer data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTopPerformer();
  }, [selectedMonth, selectedYear]);
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm h-full">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (error && !topPerformer) {
    return (
      <div className="bg-white rounded-xl border border-red-100 p-5 shadow-sm h-full">
        <div className="text-center py-2">
          <Activity className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-red-600 mb-2">{error}</p>
          <button
            onClick={fetchTopPerformer}
            className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={handleCardClick}
      className="h-full cursor-pointer transition-all duration-300"
    >
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm h-full relative overflow-hidden hover:shadow-lg transition-shadow">
        {/* Background gradient for champion */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 via-amber-50/30 to-transparent pointer-events-none"></div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center shadow-md">
              <Crown className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-800">
              {isAdmin ? '🏆 Top Performer' : '📊 My Performance'}
            </span>
          </div>
          {/* Month filter button - Stop propagation to prevent card click */}
          <button
            onClick={(e) => { e.stopPropagation(); setShowFilters(!showFilters); }}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 bg-white/80 px-2 py-1 rounded-lg border border-gray-200"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{months[selectedMonth].slice(0, 3)} {selectedYear}</span>
          </button>
        </div>
        {/* Filters dropdown - Stop propagation */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200 relative z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1.5 focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              >
                {months.map((month, index) => (
                  <option key={month} value={index}>{month.slice(0, 3)}</option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1.5 focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <button
                onClick={(e) => { e.stopPropagation(); fetchTopPerformer(); }}
                className="p-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                title="Refresh"
              >
                <RefreshCw className="w-3.5 h-3.5 text-gray-600" />
              </button>
            </div>
          </motion.div>
        )}
        {/* Top Performer Content */}
        {topPerformer ? (
          <div className="relative z-10">
            {/* Champion Crown Animation */}
            <div className="absolute -top-2 -right-2">
              <div className="relative">
                <div className="absolute inset-0 animate-ping">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full opacity-30"></div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  <span className="text-xl">👑</span>
                </div>
              </div>
            </div>
            {/* Performer Info */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform">
                  <span className="text-2xl font-bold text-white">#1</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-gray-900 truncate">
                    {topPerformer.Name}
                  </h3>
                </div>
                <p className="text-xs text-gray-500 truncate">{topPerformer.email}</p>
                <div className="flex items-center gap-3 mt-1 text-xs">
                  <div className="flex items-center gap-1 text-yellow-600 font-semibold">
                    <Zap className="w-3.5 h-3.5" />
                    {topPerformer.conversionRate.toFixed(1)}%
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Flame className="w-3.5 h-3.5" />
                    {topPerformer.streak} days
                  </div>
                </div>
              </div>
            </div>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-3 border border-orange-100">
                <p className="text-xs text-gray-600 mb-1">Conversion Rate</p>
                <p className="text-2xl font-bold text-orange-600">
                  {topPerformer['Performance %']}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {topPerformer.convertedLeads}/{topPerformer['Total Leads']} leads
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
                <p className="text-xs text-gray-600 mb-1">Active Days</p>
                <p className="text-2xl font-bold text-blue-600">
                  {topPerformer.activeDays}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  ⏰ {topPerformer['Work Hours'] !== '—' ? topPerformer['Work Hours'].split(' - ')[0] : '—'}
                </p>
              </div>
            </div>
            {/* Performance Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span className="font-medium">Performance</span>
                <span className="font-bold text-orange-600">
                  {topPerformer.conversionRate.toFixed(1)}%
                </span>
              </div>
              <div className="h-2.5 bg-orange-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-amber-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(topPerformer.conversionRate, 100)}%` }}
                />
              </div>
            </div>
            </div>
          ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Crown className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">No Top Performer</p>

            <button
              onClick={(e) => { e.stopPropagation(); fetchTopPerformer(); }}
              className="mt-3 px-4 py-1.5 text-xs bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StreakLeaderboard;