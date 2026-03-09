import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Eye,
  Clock,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  RefreshCw,
  ExternalLink,
  User,
  Building,
  Info,
  Filter,
  CheckSquare,
  XSquare
} from "lucide-react";
import PricingSuggestionCard from "./PricingSuggestioncard";

const API_URL = import.meta.env.VITE_API_URL;

const ClientReviewTable = () => {
  const navigate = useNavigate();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPricingCard, setShowPricingCard] = useState(false);
  const [pricingDeal, setPricingDeal] = useState(null);
  const [selectedClassification, setSelectedClassification] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 1,
    limit: 5
  });

  const [reviewForm, setReviewForm] = useState({
    supportTickets: 0,
    progress: "Average",
    reviewNotes: "",
    clientHealthScore: 50,
    delivered: false
  });

  // Updated classifications to match backend exactly
  const classifications = [
    { value: "all", label: "All Clients", color: "bg-gray-100 text-gray-700" },
    { value: "Upsell", label: "Upsell", color: "bg-purple-100 text-purple-700" },
    { value: "Top Value", label: "Top Value", color: "bg-green-100 text-green-700" },
    { value: "At Risk", label: "At Risk", color: "bg-red-100 text-red-700" },
    { value: "Dormant", label: "Dormant", color: "bg-gray-100 text-gray-700" }
  ];

  // Get user info from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUserRole(userData.role?.name || "");
      setUserId(userData._id || "");
    }
  }, []);

  // Listen for CLV updates from pipeline
  useEffect(() => {
    const handleCLVUpdate = (event) => {
      console.log("🔄 CLV updated, refreshing table...", event.detail);
      fetchWonDeals();
      toast.info("Client data updated");
    };
    
    window.addEventListener('clv-updated', handleCLVUpdate);
    
    return () => {
      window.removeEventListener('clv-updated', handleCLVUpdate);
    };
  }, []); // Empty dependency array

  useEffect(() => {
    fetchWonDeals();
  }, [pagination.page, selectedClassification, userRole, userId]);

  const fetchWonDeals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Authentication required");
        navigate("/login");
        return;
      }

      console.log("🔍 Fetching deals with params:", {
        page: pagination.page,
        limit: pagination.limit,
        classification: selectedClassification
      });

      const response = await axios.get(
        `${API_URL}/cltv/won-deals?page=${pagination.page}&limit=${pagination.limit}&classification=${selectedClassification}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000
        }
      );

      if (response.data.success) {
        let fetchedDeals = response.data.data || [];
        
        // Filter for salesperson - only show their assigned deals
        if (userRole !== "Admin" && userId) {
          fetchedDeals = fetchedDeals.filter(deal => 
            deal.salespersonId === userId
          );
        }
        
        console.log("📊 Fetched deals:", fetchedDeals.map(d => ({
          company: d.companyName,
          daysInactive: d.daysSinceFollowUp
        })));
        
        setDeals(fetchedDeals);
        
        if (response.data.pagination) {
          setPagination({
            page: pagination.page,
            total: response.data.pagination.total,
            pages: response.data.pagination.pages,
            limit: pagination.limit
          });
        }
      }
    } catch (error) {
      console.error("Error fetching won deals:", error);
      toast.error(error.response?.data?.message || "Failed to load client reviews");
      setDeals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Reset to page 1
    setPagination(prev => ({ ...prev, page: 1 }));
    
    // Small delay to ensure state updates
    setTimeout(async () => {
      await fetchWonDeals();
      setRefreshing(false);
      toast.success("Data refreshed!");
    }, 100);
  };

  const handleRowClick = (deal, e) => {
    if (e.target.closest('button')) return;
    navigate(`/Pipelineview/${deal._id}`);
  };

  const handleViewClientDetails = (deal, e) => {
    e.stopPropagation();
    const encodedCompanyName = encodeURIComponent(deal.companyName);
    navigate(`/cltv/client/${encodedCompanyName}`);
  };

  const handleOpenReview = async (deal, e) => {
    e.stopPropagation();
    setSelectedDeal(deal);
    
    // If deal has a review, fetch the existing review data
    if (deal.hasReview) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_URL}/cltv/client/${encodeURIComponent(deal.companyName)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (response.data.success && response.data.data.reviews?.length > 0) {
          const latestReview = response.data.data.reviews[0];
          setReviewForm({
            supportTickets: latestReview.supportTickets || 0,
            progress: latestReview.progress || "Average",
            reviewNotes: latestReview.reviewNotes || "",
            clientHealthScore: latestReview.clientHealthScore || 50,
            delivered: latestReview.delivered || false
          });
        } else {
          // Fallback to deal data if review fetch fails
          setReviewForm({
            supportTickets: deal.supportTicketCount || 0,
            progress: deal.reviewProgress || "Average",
            reviewNotes: "",
            clientHealthScore: deal.clientHealthScore || 50,
            delivered: deal.delivered || false
          });
        }
      } catch (error) {
        console.error("Error fetching review data:", error);
        // Fallback to deal data
        setReviewForm({
          supportTickets: deal.supportTicketCount || 0,
          progress: deal.reviewProgress || "Average",
          reviewNotes: "",
          clientHealthScore: deal.clientHealthScore || 50,
          delivered: deal.delivered || false
        });
      }
    } else {
      // New review - populate with deal data
      setReviewForm({
        supportTickets: deal.supportTicketCount || 0,
        progress: deal.reviewProgress || "Average",
        reviewNotes: "",
        clientHealthScore: deal.clientHealthScore || 50,
        delivered: deal.delivered || false
      });
    }
    
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedDeal) return;

    // Validate required fields
    if (!selectedDeal._id || !selectedDeal.companyName || !selectedDeal.clientName) {
      toast.error("Missing deal information. Please refresh and try again.");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");

      // Prepare review data with proper validation
      const reviewData = {
        companyId: selectedDeal._id,
        companyName: selectedDeal.companyName || "",
        clientName: selectedDeal.clientName || selectedDeal.companyName || "Unknown",
        dealId: selectedDeal._id,
        dealValue: selectedDeal.dealValue || "0",
        delivered: reviewForm.delivered || false,
        salespersonId: selectedDeal.salespersonId || null,
        salespersonName: selectedDeal.assignedTo || "",
        supportTickets: parseInt(reviewForm.supportTickets) || 0,
        progress: reviewForm.progress || "Average",
        reviewNotes: reviewForm.reviewNotes || "",
        clientHealthScore: parseInt(reviewForm.clientHealthScore) || 50
      };

      console.log("Submitting review:", reviewData);

      const response = await axios.post(
        `${API_URL}/cltv/client-review`,
        reviewData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      if (response.data.success) {
        toast.success("Review saved successfully. CLV recalculated.");
        setShowReviewModal(false);
        setPricingDeal(selectedDeal);
        setShowPricingCard(true);
        
        // Dispatch event to notify other components
        window.dispatchEvent(new CustomEvent('clv-updated', { 
          detail: { companyName: selectedDeal.companyName } 
        }));
        
        await fetchWonDeals(); // Refresh the table to show updated data
      } else {
        toast.error(response.data.message || "Failed to save review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      
      // Show more detailed error message
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        
        if (error.response.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error(`Error ${error.response.status}: Failed to save review`);
        }
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.");
      } else {
        toast.error("Error: " + error.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  const getClassificationBadge = (classification) => {
    const cls = classifications.find(c => c.value === classification);
    if (!cls) return null;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${cls.color}`}>
        {cls.label}
      </span>
    );
  };

  const getProgressBadge = (progress) => {
    const colors = {
      "Excellent": "bg-green-100 text-green-700",
      "Good": "bg-blue-100 text-blue-700",
      "Average": "bg-yellow-100 text-yellow-700",
      "Poor": "bg-red-100 text-red-700"
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${colors[progress] || "bg-gray-100 text-gray-700"}`}>
        {progress}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid Date";
    }
  };

  const formatCurrency = (value) => {
    if (!value) return "₹0";
    try {
      // Handle string values like "₹7,50,000"
      const numericValue = parseFloat(value.toString().replace(/[₹,\s]/g, ''));
      return `₹${numericValue.toLocaleString()}`;
    } catch {
      return "₹0";
    }
  };

  if (loading && deals.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Client Review Table</h2>
            <p className="text-sm text-gray-500 mt-1">
              {userRole === "Admin" 
                ? "All clients with Closed Won deals requiring health review"
                : "Your assigned clients with Closed Won deals"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50"
              >
                <Filter size={16} />
                {classifications.find(c => c.value === selectedClassification)?.label || "Filter"}
              </button>
              
              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  {classifications.map((cls) => (
                    <button
                      key={cls.value}
                      onClick={() => {
                        setSelectedClassification(cls.value);
                        setPagination(prev => ({ ...prev, page: 1 }));
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                        selectedClassification === cls.value ? 'bg-blue-50 text-blue-600' : ''
                      }`}
                    >
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${cls.color}`}>
                        {cls.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`p-2 rounded-lg transition ${
                refreshing 
                  ? 'bg-blue-100 text-blue-600 cursor-not-allowed' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Refresh data"
            >
              <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {showPricingCard && pricingDeal && (
          <div className="m-4">
            <PricingSuggestionCard
              companyId={pricingDeal._id}
              dealValue={pricingDeal.dealValue}
              onClose={() => setShowPricingCard(false)}
            />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client Name (Deal)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deal Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivered
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Support Tickets
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days Inactive
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Classification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {deals.length > 0 ? (
                deals.map((deal, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={(e) => handleRowClick(deal, e)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2">
                          <User size={14} />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {deal.clientName}
                          </div>
                          {deal.hasReview && (
                            <span className="text-xs text-green-600 flex items-center gap-1">
                              <CheckCircle size={10} />
                              Reviewed
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building size={14} className="text-gray-400 mr-1" />
                        <span className="text-sm text-gray-700">{deal.companyName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(deal.dealValue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {deal.delivered ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckSquare size={16} />
                          Yes
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-400">
                          <XSquare size={16} />
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {deal.assignedTo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MessageSquare size={14} className="text-gray-400" />
                        {deal.supportTicketCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {deal.daysSinceFollowUp || 0} days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getProgressBadge(deal.reviewProgress || deal.progress)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getClassificationBadge(deal.classification)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {deal.reviewStatus === "Submitted" ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle size={16} />
                          Submitted
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-yellow-600">
                          <AlertTriangle size={16} />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleOpenReview(deal, e)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors text-xs bg-blue-50 px-2 py-1 rounded"
                          title={deal.hasReview ? "Edit Review" : "Add Review"}
                        >
                          <Eye size={14} />
                          {deal.hasReview ? "Edit" : "Review"}
                        </button>
                        
                        <button
                          onClick={(e) => handleViewClientDetails(deal, e)}
                          className="text-purple-600 hover:text-purple-800 flex items-center gap-1 transition-colors text-xs bg-purple-50 px-2 py-1 rounded"
                          title="View Client Details"
                        >
                          <ExternalLink size={14} />
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="px-6 py-8 text-center text-gray-500">
                    {userRole === "Admin" 
                      ? "No closed won deals found"
                      : "No deals assigned to you"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing page {pagination.page} of {pagination.pages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedDeal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-lg flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {selectedDeal.hasReview ? "Edit Client Review" : "New Client Review"}
              </h3>

              {/* Auto-filled Info */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-1">
                  <Info size={14} />
                  Client Information (Read Only)
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-blue-600">Client Name (Deal):</p>
                    <p className="font-medium">{selectedDeal.clientName}</p>
                  </div>
                  <div>
                    <p className="text-blue-600">Company Name:</p>
                    <p className="font-medium">{selectedDeal.companyName}</p>
                  </div>
                  <div>
                    <p className="text-blue-600">Deal Value:</p>
                    <p className="font-medium">{formatCurrency(selectedDeal.dealValue)}</p>
                  </div>
                  <div>
                    <p className="text-blue-600">Assigned Sales Person:</p>
                    <p className="font-medium">{selectedDeal.assignedTo}</p>
                  </div>
                  <div>
                    <p className="text-blue-600">Support Ticket Count:</p>
                    <p className="font-medium">{selectedDeal.supportTicketCount}</p>
                  </div>
                  <div>
                    <p className="text-blue-600">Days Inactive:</p>
                    <p className="font-medium">{selectedDeal.daysSinceFollowUp || 0} days</p>
                  </div>
                  {selectedDeal.hasReview && (
                    <div className="col-span-2 mt-2 p-2 bg-green-50 rounded-lg">
                      <p className="text-xs text-green-700">
                        <span className="font-medium">Note:</span> Editing this review will recalculate the client's classification and CLV.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <form onSubmit={handleSubmitReview}>
                <div className="space-y-4">
                  {/* Progress Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Progress
                    </label>
                    <select
                      value={reviewForm.progress}
                      onChange={(e) => setReviewForm({ ...reviewForm, progress: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Average">Average</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>

                  {/* Review Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Review Notes
                    </label>
                    <textarea
                      rows={3}
                      value={reviewForm.reviewNotes}
                      onChange={(e) => setReviewForm({ ...reviewForm, reviewNotes: e.target.value })}
                      placeholder="Enter your review notes..."
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Support Tickets (Manual Override) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Support Tickets (Manual Override)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={reviewForm.supportTickets}
                      onChange={(e) => setReviewForm({ ...reviewForm, supportTickets: parseInt(e.target.value) || 0 })}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Client Health Score */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Health Score (0-100)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={reviewForm.clientHealthScore}
                      onChange={(e) => setReviewForm({ ...reviewForm, clientHealthScore: parseInt(e.target.value) || 50 })}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      {reviewForm.clientHealthScore >= 75 ? "Excellent" : 
                       reviewForm.clientHealthScore >= 50 ? "Good" : 
                       reviewForm.clientHealthScore >= 25 ? "Fair" : "Poor"}
                    </p>
                  </div>

                  {/* Delivered Toggle */}
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={reviewForm.delivered}
                        onChange={(e) => setReviewForm({ ...reviewForm, delivered: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">Delivered</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      selectedDeal.hasReview ? "Update Review" : "Save Review"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClientReviewTable;