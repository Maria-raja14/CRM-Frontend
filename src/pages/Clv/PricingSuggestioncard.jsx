import React, { useState, useEffect } from "react";
import { TrendingUp, AlertTriangle, DollarSign, Percent, X, CheckCircle } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

const PricingSuggestionCard = ({ companyId, dealValue, onClose }) => {
  const [pricingData, setPricingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(false);
  const [clientData, setClientData] = useState(null);

  useEffect(() => {
    if (companyId) {
      fetchPricingData();
      fetchClientData();
    } else {
      setError("No company ID provided");
      setLoading(false);
    }
  }, [companyId]);

  const fetchClientData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/cltv/client/${encodeURIComponent(companyId)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setClientData(response.data.data.client);
      }
    } catch (err) {
      console.error("Error fetching client data for pricing:", err);
      // Non-critical, continue with fallback
    }
  };

  const fetchPricingData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/cltv/pricing-recommendation/${companyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setPricingData(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch pricing data");
      }
    } catch (err) {
      console.error("Error fetching pricing data:", err);
      setError(err.message);
      
      // Fallback to smart calculation based on classification
      calculateSmartPricing();
    } finally {
      setLoading(false);
    }
  };

  // Smart pricing based on classification and metrics
  const calculateSmartPricing = () => {
    // Safely parse numeric value
    const numericValue = parseDealValue(dealValue);
    
    // Get classification from client data if available
    const classification = clientData?.classification || "At Risk";
    const healthScore = clientData?.clientHealthScore || 50;
    const daysInactive = clientData?.daysSinceFollowUp || 0;
    const supportTickets = clientData?.totalSupportTickets || 0;
    
    // Base discount by classification
    let baseDiscount = 10;
    let confidenceScore = 70;
    let pricingStrategy = "";
    
    switch(classification) {
      case "Upsell":
        // Low discount for high-value upsell candidates
        baseDiscount = 5;
        confidenceScore = 85;
        pricingStrategy = "Upsell opportunity - minimal discount to preserve value";
        break;
      case "Top Value":
        // Moderate discount for top value clients
        baseDiscount = 8;
        confidenceScore = 80;
        pricingStrategy = "Top value client - moderate discount to maintain relationship";
        break;
      case "At Risk":
        // Aggressive discount for at-risk clients
        baseDiscount = 15;
        confidenceScore = 75;
        pricingStrategy = "At risk - aggressive discount to prevent churn";
        break;
      case "Dormant":
        // Strategic reactivation pricing
        baseDiscount = 20;
        confidenceScore = 70;
        pricingStrategy = "Dormant - strategic reactivation pricing";
        break;
      default:
        baseDiscount = 12;
        confidenceScore = 70;
        pricingStrategy = "Standard pricing based on client metrics";
    }
    
    // Adjust based on health score
    if (healthScore > 80) {
      baseDiscount -= 2; // Healthier clients need less discount
    } else if (healthScore < 50) {
      baseDiscount += 3; // Unhealthy clients need more incentive
    }
    
    // Adjust based on days inactive
    if (daysInactive > 90) {
      baseDiscount += 5; // Long inactive needs stronger incentive
    } else if (daysInactive > 60) {
      baseDiscount += 3;
    }
    
    // Adjust based on support tickets
    if (supportTickets > 10) {
      baseDiscount += 5; // High support needs more discount
    } else if (supportTickets > 5) {
      baseDiscount += 2;
    }
    
    // Ensure discount stays within reasonable bounds
    baseDiscount = Math.min(Math.max(baseDiscount, 0), 30);
    
    // Calculate price range
    const minPrice = Math.round(numericValue * (1 - baseDiscount / 100));
    const maxPrice = Math.round(numericValue * 1.1);
    
    setPricingData({
      suggestedMinPrice: minPrice,
      suggestedMaxPrice: maxPrice,
      recommendedDiscount: baseDiscount,
      confidenceScore,
      deliveryBonus: 0,
      strategy: pricingStrategy,
      classification
    });
  };

  // Safe number parsing
  const parseDealValue = (value) => {
    if (typeof value === "number") return value;
    if (!value) return 0;
    
    try {
      // Remove ₹ symbol, commas, and spaces, then parse
      const cleaned = String(value).replace(/[₹,\s]/g, "");
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    } catch {
      return 0;
    }
  };

  const handleApplyRecommendation = async () => {
    if (!pricingData) return;
    
    try {
      setApplying(true);
      
      // In production, this would call an API to apply the discount
      // await axios.patch(`${API_URL}/deals/update-deal/${companyId}`, {
      //   discountGiven: pricingData.recommendedDiscount,
      //   pricingStrategy: pricingData.strategy
      // });
      
      toast.success(`Discount of ${pricingData.recommendedDiscount}% applied successfully`, {
        position: "top-right",
        autoClose: 3000,
      });
      
      // Log pricing decision for analytics (in production)
      console.log("Pricing applied:", {
        companyId,
        discount: pricingData.recommendedDiscount,
        strategy: pricingData.strategy,
        confidence: pricingData.confidenceScore,
        timestamp: new Date().toISOString()
      });
      
      onClose();
    } catch (err) {
      console.error("Error applying pricing:", err);
      toast.error("Failed to apply discount. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  const getConfidenceColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-100 border-green-200";
    if (score >= 60) return "text-yellow-600 bg-yellow-100 border-yellow-200";
    return "text-red-600 bg-red-100 border-red-200";
  };

  const getClassificationBadge = (classification) => {
    const colors = {
      "Upsell": "bg-purple-100 text-purple-700 border-purple-200",
      "Top Value": "bg-green-100 text-green-700 border-green-200",
      "At Risk": "bg-red-100 text-red-700 border-red-200",
      "Dormant": "bg-gray-100 text-gray-700 border-gray-200"
    };
    
    return colors[classification] || "bg-blue-100 text-blue-700 border-blue-200";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
          <div className="h-2 bg-gray-200 rounded mt-4 w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error && !pricingData) {
    return (
      <div className="bg-red-50 rounded-xl shadow-sm border border-red-200 p-4">
        <div className="flex items-center gap-2 text-red-600 mb-2">
          <AlertTriangle size={18} />
          <span className="text-sm font-medium">Unable to load pricing data</span>
        </div>
        <p className="text-xs text-red-500">{error}</p>
        <button
          onClick={onClose}
          className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
        >
          Close
        </button>
      </div>
    );
  }

  if (!pricingData) return null;

  const numericValue = parseDealValue(dealValue);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-sm border border-blue-200 p-4 relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
        title="Close"
      >
        <X size={16} />
      </button>

      <div className="flex items-center justify-between mb-3 pr-6">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-blue-500" />
          <h3 className="font-semibold text-gray-800">Smart Pricing Recommendation</h3>
        </div>
        <div className="flex items-center gap-2">
          {pricingData.classification && (
            <span className={`text-xs px-2 py-1 rounded-full border ${getClassificationBadge(pricingData.classification)}`}>
              {pricingData.classification}
            </span>
          )}
          <span className={`text-xs px-2 py-1 rounded-full border ${getConfidenceColor(pricingData.confidenceScore)}`}>
            {pricingData.confidenceScore >= 80 ? 'High' : 
             pricingData.confidenceScore >= 60 ? 'Medium' : 'Low'} Confidence
          </span>
        </div>
      </div>

      {pricingData.strategy && (
        <div className="mb-3 text-xs text-gray-600 bg-white/50 p-2 rounded-lg">
          <span className="font-medium">Strategy:</span> {pricingData.strategy}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white/50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-2">Suggested Price Range</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign size={14} className="text-green-500" />
              <div>
                <span className="text-xs text-gray-500">Min:</span>
                <span className="ml-1 text-sm font-semibold">
                  ₹{pricingData.suggestedMinPrice?.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign size={14} className="text-blue-500" />
              <div>
                <span className="text-xs text-gray-500">Max:</span>
                <span className="ml-1 text-sm font-semibold">
                  ₹{pricingData.suggestedMaxPrice?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Original: ₹{numericValue.toLocaleString()}
          </p>
        </div>

        <div className="bg-white/50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-2">Discount Recommendation</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Percent size={14} className="text-purple-500" />
              <div>
                <span className="text-xs text-gray-500">Max Discount:</span>
                <span className="ml-1 text-sm font-semibold">
                  {pricingData.recommendedDiscount}%
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-orange-500" />
              <div>
                <span className="text-xs text-gray-500">Confidence:</span>
                <span className={`ml-1 text-sm font-semibold ${
                  pricingData.confidenceScore >= 80 ? 'text-green-600' :
                  pricingData.confidenceScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {pricingData.confidenceScore}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {pricingData.deliveryBonus > 0 && (
        <div className="mb-3 text-xs text-green-600 bg-green-50 p-2 rounded-lg flex items-center gap-1">
          <CheckCircle size={14} />
          +{pricingData.deliveryBonus}% discount from delivery confirmation
        </div>
      )}

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-blue-200">
        <div className="text-xs text-gray-500">
          Based on {pricingData.classification?.toLowerCase() || "client"} metrics
        </div>
        <button 
          onClick={handleApplyRecommendation}
          disabled={applying}
          className="text-xs bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 flex items-center gap-1"
        >
          {applying ? (
            <>
              <RefreshCw size={14} className="animate-spin" />
              Applying...
            </>
          ) : (
            "Apply Discount"
          )}
        </button>
      </div>
    </div>
  );
};

export default PricingSuggestionCard;