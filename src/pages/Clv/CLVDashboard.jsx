import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import ClientReviewTable from "./ClientReviewTable";
import ClassificationModal from "./ClassificationModal";
import {
  TrendingUp,
  AlertTriangle,
  Users,
  DollarSign,
  Clock,
  Activity,
  Shield,
  Star,
  Download,
  RefreshCw,
  Eye,
  Zap,
  Info,
  X
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import "react-toastify/dist/ReactToastify.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const API_URL = import.meta.env.VITE_API_URL;

const CLVDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  
  // Modal states for showing client lists
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const [showTopValueModal, setShowTopValueModal] = useState(false);
  const [showAtRiskModal, setShowAtRiskModal] = useState(false);
  const [showDormantModal, setShowDormantModal] = useState(false);
  const [showTotalCLVModal, setShowTotalCLVModal] = useState(false);
  
  // Modal states for showing criteria
  const [showUpsellCriteriaModal, setShowUpsellCriteriaModal] = useState(false);
  const [showTopValueCriteriaModal, setShowTopValueCriteriaModal] = useState(false);
  const [showAtRiskCriteriaModal, setShowAtRiskCriteriaModal] = useState(false);
  const [showDormantCriteriaModal, setShowDormantCriteriaModal] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Get user info from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUserRole(userData.role?.name || "");
      setUserId(userData._id || "");
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    
    // Refresh data when window gains focus
    const handleFocus = () => {
      console.log("Window focused - refreshing dashboard data");
      fetchDashboardData();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [userRole, userId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Authentication required");
        navigate("/login");
        return;
      }

      console.log("Fetching dashboard data...");

      const response = await axios.get(`${API_URL}/cltv/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });

      console.log("Dashboard response:", response.data);

      if (response.data.success) {
        setDashboardData(response.data.data);
        setLastUpdated(new Date());
      } else {
        throw new Error(response.data.message || "Failed to load dashboard");
      }
    } catch (error) {
      console.error("Error fetching CLV dashboard:", error);
      setError(error.message);

      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else if (error.code === "ERR_NETWORK") {
        toast.error("Cannot connect to server. Please check if backend is running.");
      } else {
        toast.error(error.response?.data?.message || "Failed to load CLV dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateCLV = async () => {
    try {
      setCalculating(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required");
        navigate("/login");
        return;
      }

      toast.info("Calculating CLV for all clients... This may take a moment.");
      const response = await axios.post(
        `${API_URL}/cltv/calculate-all`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 60000,
        }
      );

      if (response.data.success) {
        toast.success(`Successfully calculated CLV for ${response.data.count || 0} clients`);
        fetchDashboardData();
      }
    } catch (error) {
      console.error("Error calculating CLV:", error);
      toast.error(error.response?.data?.message || "Failed to calculate CLV");
    } finally {
      setCalculating(false);
    }
  };

  const handleExportReport = () => {
    if (!dashboardData) {
      toast.error("No data to export");
      return;
    }
    try {
      let csvContent = "Company Name,Classification,CLV,Support Tickets,Health Score,Days Inactive,Delivered\n";
      
      // Add all clients
      const allClients = [
        ...(dashboardData.topClients || []),
        ...(dashboardData.riskyClients || []),
        ...(dashboardData.dormantClients || []),
        ...(dashboardData.upsellClients || []),
        ...(dashboardData.allClientsList || [])
      ];
      
      // Remove duplicates by company name
      const uniqueClients = Array.from(new Map(allClients.map(c => [c.companyName, c])).values());
      
      uniqueClients.forEach((client) => {
        csvContent += `${client.companyName},${client.classification || "N/A"},${client.clv || client.dealValue || 0},${client.supportTickets || 0},${client.clientHealthScore || 50},${client.daysSinceFollowUp || 0},${client.delivered ? 'Yes' : 'No'}\n`;
      });
      
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `clv-report-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Report exported successfully");
    } catch (error) {
      console.error("Error exporting report:", error);
      toast.error("Failed to export report");
    }
  };

  const getClassificationColor = (classification) => {
    switch (classification) {
      case "Top Value":
        return "text-green-600 bg-green-100";
      case "Upsell":
        return "text-purple-600 bg-purple-100";
      case "At Risk":
        return "text-red-600 bg-red-100";
      case "Dormant":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-blue-600 bg-blue-100";
    }
  };

  const formatCurrency = (value) => {
    if (!value && value !== 0) return "₹0";
    return `₹${value.toLocaleString()}`;
  };

  const formatNumber = (value, decimals = 1) => {
    const num = Number(value);
    return isNaN(num) ? "0" : num.toFixed(decimals);
  };

  if (loading && !dashboardData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertTriangle size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Failed to load dashboard</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const data = dashboardData || {
    summary: {
      totalClients: 0,
      totalCLV: 0,
      avgCLV: 0,
      avgRiskScore: 0,
      upsellCount: 0,
      topValueCount: 0,
      dormantCount: 0,
      atRiskCount: 0,
    },
    valueCategories: {
      "High Value": 0,
      "Medium Value": 0,
      "Low Value": 0,
    },
    classificationDistribution: {},
    topClients: [],
    riskyClients: [],
    dormantClients: [],
    upsellClients: [],
    allClientsList: [],
    recentReviews: [],
    revenueTrends: [],
  };

  const classificationData = {
    labels: Object.keys(data.classificationDistribution),
    datasets: [
      {
        data: Object.values(data.classificationDistribution),
        backgroundColor: [
          "rgba(168, 85, 247, 0.8)", // Upsell - Purple
          "rgba(34, 197, 94, 0.8)",  // Top Value - Green
          "rgba(239, 68, 68, 0.8)",  // At Risk - Red
          "rgba(156, 163, 175, 0.8)", // Dormant - Gray
        ],
        borderWidth: 1,
      },
    ],
  };

  const revenueData = {
    labels: data.revenueTrends?.map((item) => item.month) || [],
    datasets: [
      {
        label: "Revenue",
        data: data.revenueTrends?.map((item) => item.revenue) || [],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const revenueOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => formatCurrency(context.raw),
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => formatCurrency(value),
        },
      },
    },
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={5000} />

      {/* Classification Modals for showing client lists */}
      <ClassificationModal
        isOpen={showUpsellModal}
        onClose={() => setShowUpsellModal(false)}
        title="Upsell Clients"
        data={data.upsellClients}
        type="Upsell"
      />
      
      <ClassificationModal
        isOpen={showTopValueModal}
        onClose={() => setShowTopValueModal(false)}
        title="Top Value Clients"
        data={data.topClients}
        type="Top Value"
      />
      
      <ClassificationModal
        isOpen={showAtRiskModal}
        onClose={() => setShowAtRiskModal(false)}
        title="At Risk Clients"
        data={data.riskyClients}
        type="At Risk"
      />
      
      <ClassificationModal
        isOpen={showDormantModal}
        onClose={() => setShowDormantModal(false)}
        title="Dormant Clients"
        data={data.dormantClients}
        type="Dormant"
      />

      {/* Criteria Modals */}
      {showUpsellCriteriaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Upsell Criteria</h2>
                <button onClick={() => setShowUpsellCriteriaModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="font-medium text-purple-800 mb-3 flex items-center gap-2">
                  <Zap size={16} />
                  Upsell Qualification Rules
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span className="text-gray-700">Support tickets <span className="font-bold text-purple-600">&lt; 3</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span className="text-gray-700">Deal value <span className="font-bold text-purple-600">&gt; ₹500,000</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span className="text-gray-700">Health score <span className="font-bold text-purple-600">&gt; 80</span></span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-purple-600 mt-2">
                    <span>ⓘ No follow-up needed</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTopValueCriteriaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Top Value Criteria</h2>
                <button onClick={() => setShowTopValueCriteriaModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                  <Star size={16} />
                  Top Value Qualification Rules
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span className="text-gray-700">Support tickets <span className="font-bold text-green-600">&lt; 5</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span className="text-gray-700">Deal value <span className="font-bold text-green-600">&gt; ₹500,000</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span className="text-gray-700">Health score <span className="font-bold text-green-600">&gt; 70</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span className="text-gray-700">Follow-up days <span className="font-bold text-green-600">&lt; 15</span></span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAtRiskCriteriaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">At Risk Criteria</h2>
                <button onClick={() => setShowAtRiskCriteriaModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 className="font-medium text-red-800 mb-3 flex items-center gap-2">
                  <AlertTriangle size={16} />
                  At Risk Qualification Rules
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span className="text-gray-700">Support tickets <span className="font-bold text-red-600">&gt; 5</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span className="text-gray-700">Deal value <span className="font-bold text-red-600">&lt; ₹500,000</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span className="text-gray-700">Follow-up days <span className="font-bold text-red-600">&gt; 30</span></span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDormantCriteriaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Dormant Criteria</h2>
                <button onClick={() => setShowDormantCriteriaModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                  <Clock size={16} />
                  Dormant Qualification Rules
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-600 font-bold">•</span>
                    <span className="text-gray-700">Support tickets <span className="font-bold text-gray-600">&gt; 5</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-600 font-bold">•</span>
                    <span className="text-gray-700">Deal value <span className="font-bold text-gray-600">&lt; ₹500,000</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-600 font-bold">•</span>
                    <span className="text-gray-700">Follow-up days <span className="font-bold text-gray-600">&gt; 60</span></span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Client Lifetime Value (CLV) Dashboard</h1>
          <p className="text-gray-600 mt-1">
            {userRole === "Admin" 
              ? "Monitor all client profitability and identify retention opportunities"
              : "Monitor your assigned clients' profitability"}
          </p>
          {lastUpdated && (
            <p className="text-xs text-gray-400 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <button
            onClick={fetchDashboardData}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition"
            title="Refresh data"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={handleCalculateCLV}
            disabled={calculating}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition disabled:bg-indigo-400"
          >
            <RefreshCw size={18} className={calculating ? "animate-spin" : ""} />
            {calculating ? "Calculating..." : "Recalculate CLV"}
          </button>
          <button
            onClick={handleExportReport}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <Download size={18} />
            Export Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Upsell Card */}
        <div 
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md transition relative group"
          onClick={() => setShowUpsellModal(true)}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500 mb-1">Upsell</p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUpsellCriteriaModal(true);
                  }}
                  className="text-gray-400 hover:text-purple-600 transition-colors"
                  title="View Criteria"
                >
                  <Info size={14} />
                </button>
              </div>
              <p className="text-2xl font-bold text-purple-600">{data.summary.upsellCount || 0}</p>
              <p className="text-xs text-gray-400 mt-1">Click card to view clients</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Top Value Card */}
        <div 
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md transition relative group"
          onClick={() => setShowTopValueModal(true)}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500 mb-1">Top Value</p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTopValueCriteriaModal(true);
                  }}
                  className="text-gray-400 hover:text-green-600 transition-colors"
                  title="View Criteria"
                >
                  <Info size={14} />
                </button>
              </div>
              <p className="text-2xl font-bold text-green-600">{data.summary.topValueCount || 0}</p>
              <p className="text-xs text-gray-400 mt-1">Click card to view clients</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Star className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* At Risk Card */}
        <div 
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md transition relative group"
          onClick={() => setShowAtRiskModal(true)}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500 mb-1">At Risk</p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAtRiskCriteriaModal(true);
                  }}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                  title="View Criteria"
                >
                  <Info size={14} />
                </button>
              </div>
              <p className="text-2xl font-bold text-red-600">{data.summary.atRiskCount || 0}</p>
              <p className="text-xs text-gray-400 mt-1">Click card to view clients</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        {/* Dormant Card */}
        <div 
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md transition relative group"
          onClick={() => setShowDormantModal(true)}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500 mb-1">Dormant</p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDormantCriteriaModal(true);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="View Criteria"
                >
                  <Info size={14} />
                </button>
              </div>
              <p className="text-2xl font-bold text-gray-600">{data.summary.dormantCount || 0}</p>
              <p className="text-xs text-gray-400 mt-1">Click card to view clients</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <Clock className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Second Row Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total CLV Card */}
        <div 
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md transition"
          onClick={() => setShowTotalCLVModal(true)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total CLV</p>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(data.summary.totalCLV)}</p>
              <p className="text-xs text-gray-400 mt-1">Avg: {formatCurrency(data.summary.avgCLV)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Avg Risk Score Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Avg Risk Score</p>
              <p className="text-2xl font-bold text-gray-800">{formatNumber(data.summary.avgRiskScore)}%</p>
              <p className="text-xs text-gray-400 mt-1">
                ({(data.summary.atRiskCount || 0) + (data.summary.dormantCount || 0)} / {data.summary.totalClients || 1}) at risk
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Shield className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Total Clients Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Clients</p>
              <p className="text-2xl font-bold text-gray-800">{data.summary.totalClients || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Client Review Table */}
      <div className="mb-8">
        <ClientReviewTable />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Trend */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Revenue Trend</h2>
          </div>
          <div className="h-64">
            {data.revenueTrends?.length > 0 ? (
              <Line data={revenueData} options={revenueOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No revenue data available. Complete reviews to see trends.
              </div>
            )}
          </div>
        </div>

        {/* Client Classification */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Client Classification</h2>
          <div className="h-64">
            {Object.keys(data.classificationDistribution).length > 0 ? (
              <Doughnut
                data={classificationData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "bottom" },
                  },
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No classification data. Submit reviews to classify clients.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Client Classification Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Value Clients */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Star size={18} className="text-yellow-500" />
              Top Value Clients
            </h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowTopValueCriteriaModal(true)}
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                title="View Criteria"
              >
                <Info size={12} /> Criteria
              </button>
              <button 
                onClick={() => setShowTopValueModal(true)}
                className="text-xs text-blue-600 hover:underline"
              >
                View All ({data.topClients?.length || 0})
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {data.topClients?.length > 0 ? (
              data.topClients.slice(0, 5).map((client, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                  onClick={() => navigate(`/cltv/client/${encodeURIComponent(client.companyName)}`)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full ${getClassificationColor(
                        client.classification
                      )} flex items-center justify-center font-medium`}
                    >
                      {client.companyName?.charAt(0) || "?"}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{client.companyName}</p>
                      <p className="text-xs text-gray-500">CLV: {formatCurrency(client.clv)}</p>
                      {client.delivered && (
                        <span className="text-xs text-green-600">✓ Delivered</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{client.supportTickets || 0} tickets</span>
                    <Eye size={16} className="text-gray-400" />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No top value clients found.</p>
            )}
          </div>
        </div>

        {/* Upsell Clients */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Zap size={18} className="text-purple-500" />
              Upsell Clients
            </h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowUpsellCriteriaModal(true)}
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                title="View Criteria"
              >
                <Info size={12} /> Criteria
              </button>
              <button 
                onClick={() => setShowUpsellModal(true)}
                className="text-xs text-blue-600 hover:underline"
              >
                View All ({data.upsellClients?.length || 0})
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {data.upsellClients?.length > 0 ? (
              data.upsellClients.slice(0, 5).map((client, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                  onClick={() => navigate(`/cltv/client/${encodeURIComponent(client.companyName)}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-medium">
                      {client.companyName?.charAt(0) || "?"}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{client.companyName}</p>
                      <p className="text-xs text-gray-500">
                        CLV: {formatCurrency(client.clv)} • Health: {client.clientHealthScore}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                    Ready
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No upsell clients found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* At Risk Clients */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <AlertTriangle size={18} className="text-red-500" />
              At Risk Clients
            </h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowAtRiskCriteriaModal(true)}
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                title="View Criteria"
              >
                <Info size={12} /> Criteria
              </button>
              <button 
                onClick={() => setShowAtRiskModal(true)}
                className="text-xs text-blue-600 hover:underline"
              >
                View All ({data.riskyClients?.length || 0})
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {data.riskyClients?.length > 0 ? (
              data.riskyClients.slice(0, 5).map((client, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                  onClick={() => navigate(`/cltv/client/${encodeURIComponent(client.companyName)}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-medium">
                      {client.companyName?.charAt(0) || "?"}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{client.companyName}</p>
                      <p className="text-xs text-gray-500">
                        {client.daysSinceFollowUp || 0} days • {client.supportTickets || 0} tickets
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-red-600 font-medium">
                    At Risk
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No at-risk clients found.</p>
            )}
          </div>
        </div>

        {/* Dormant Clients */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Clock size={18} className="text-gray-500" />
              Dormant Clients
            </h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowDormantCriteriaModal(true)}
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                title="View Criteria"
              >
                <Info size={12} /> Criteria
              </button>
              <button 
                onClick={() => setShowDormantModal(true)}
                className="text-xs text-blue-600 hover:underline"
              >
                View All ({data.dormantClients?.length || 0})
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {data.dormantClients?.length > 0 ? (
              data.dormantClients.slice(0, 5).map((client, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                  onClick={() => navigate(`/cltv/client/${encodeURIComponent(client.companyName)}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-medium">
                      {client.companyName?.charAt(0) || "?"}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{client.companyName}</p>
                      <p className="text-xs text-gray-500">
                        {client.daysSinceFollowUp || 0} days • {client.supportTickets || 0} tickets
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/cltv/client/${encodeURIComponent(client.companyName)}`);
                    }}
                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                  >
                    Re-engage
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No dormant clients found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Reviews Section */}
      {data.recentReviews?.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Reviews</h2>
          <div className="space-y-3">
            {data.recentReviews.map((review, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    {review.companyName?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{review.companyName}</p>
                    <p className="text-xs text-gray-500">
                      Reviewed by {review.reviewedBy?.firstName} {review.reviewedBy?.lastName} • {new Date(review.reviewedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    review.progress === "Excellent" ? "bg-green-100 text-green-700" :
                    review.progress === "Good" ? "bg-blue-100 text-blue-700" :
                    review.progress === "Average" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {review.progress}
                  </span>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    Score: {review.clientHealthScore}/100
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Total CLV Modal */}
      {showTotalCLVModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Total CLV Breakdown</h2>
                <button onClick={() => setShowTotalCLVModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600">High Value Clients</p>
                  <p className="text-2xl font-bold">{data.valueCategories?.["High Value"] || 0}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-600">Medium Value Clients</p>
                  <p className="text-2xl font-bold">{data.valueCategories?.["Medium Value"] || 0}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Low Value Clients</p>
                  <p className="text-2xl font-bold">{data.valueCategories?.["Low Value"] || 0}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600">Upsell</p>
                  <p className="text-2xl font-bold">{data.summary.upsellCount || 0}</p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg">
                  <p className="text-sm text-green-700">Top Value</p>
                  <p className="text-2xl font-bold">{data.summary.topValueCount || 0}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-600">At Risk</p>
                  <p className="text-2xl font-bold">{data.summary.atRiskCount || 0}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Dormant</p>
                  <p className="text-2xl font-bold">{data.summary.dormantCount || 0}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Discount Impact</h3>
                <p className="text-sm text-gray-600">Average discount impact on CLV: 15%</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CLVDashboard;