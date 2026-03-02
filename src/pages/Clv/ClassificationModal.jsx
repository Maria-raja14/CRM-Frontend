import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  X, 
  Star, 
  AlertTriangle, 
  Clock, 
  Zap, 
  Users, 
  Eye,
  DollarSign,
  TrendingUp,
  Shield,
  Calendar,
  MessageSquare,
  Activity,
  Info
} from "lucide-react";

const ClassificationModal = ({ isOpen, onClose, title, data, type }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "topValue":
      case "Top Value":
        return <Star className="text-yellow-500" size={24} />;
      case "atRisk":
      case "At Risk":
        return <AlertTriangle className="text-red-500" size={24} />;
      case "dormant":
      case "Dormant":
        return <Clock className="text-gray-500" size={24} />;
      case "upsell":
      case "Upsell":
        return <Zap className="text-purple-500" size={24} />;
      case "totalCLV":
        return <DollarSign className="text-green-500" size={24} />;
      case "revenue":
        return <TrendingUp className="text-indigo-500" size={24} />;
      default:
        return <Users className="text-blue-500" size={24} />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "topValue":
      case "Top Value":
        return "bg-gradient-to-r from-yellow-50 to-amber-50";
      case "atRisk":
      case "At Risk":
        return "bg-gradient-to-r from-red-50 to-rose-50";
      case "dormant":
      case "Dormant":
        return "bg-gradient-to-r from-gray-50 to-slate-50";
      case "upsell":
      case "Upsell":
        return "bg-gradient-to-r from-purple-50 to-violet-50";
      case "totalCLV":
        return "bg-gradient-to-r from-green-50 to-emerald-50";
      default:
        return "bg-gradient-to-r from-blue-50 to-indigo-50";
    }
  };

  const getClassificationColor = (classification) => {
    switch (classification) {
      case "Top Value":
        return "text-emerald-700 bg-emerald-100 border-emerald-200";
      case "Upsell":
        return "text-purple-700 bg-purple-100 border-purple-200";
      case "At Risk":
        return "text-red-700 bg-red-100 border-red-200";
      case "Dormant":
        return "text-gray-700 bg-gray-100 border-gray-200";
      case "High Value":
        return "text-green-700 bg-green-100 border-green-200";
      case "Medium Value":
        return "text-yellow-700 bg-yellow-100 border-yellow-200";
      case "Low Value":
        return "text-gray-700 bg-gray-100 border-gray-200";
      default:
        return "text-indigo-700 bg-indigo-100 border-indigo-200";
    }
  };

  const getRiskLevelBadge = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case "high":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium border border-red-200">
            ⚠ High Risk
          </span>
        );
      case "medium":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium border border-yellow-200">
            ⚡ Medium Risk
          </span>
        );
      case "low":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium border border-green-200">
            ✅ Low Risk
          </span>
        );
      case "dormant":
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium border border-gray-200">
            💤 Dormant
          </span>
        );
      default:
        return null;
    }
  };

  const getProgressBadge = (progress) => {
    switch (progress) {
      case "Excellent":
        return <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">🌟 Excellent</span>;
      case "Good":
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">👍 Good</span>;
      case "Average":
        return <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs">📊 Average</span>;
      case "Poor":
        return <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">⚠ Poor</span>;
      default:
        return null;
    }
  };

  const handleRowClick = (companyName) => {
    if (companyName) {
      navigate(`/cltv/client/${encodeURIComponent(companyName)}`);
      onClose();
    }
  };

  const formatCurrency = (value) => {
    if (!value && value !== 0) return "₹0";
    return `₹${Number(value).toLocaleString()}`;
  };

  const formatNumber = (value, decimals = 1) => {
    const num = Number(value);
    return isNaN(num) ? "0" : num.toFixed(decimals);
  };

  // Render different layouts based on data type
  const renderContent = () => {
    if (!data || data.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Users size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">No clients in this category</p>
          <p className="text-sm text-gray-400 mt-1">Clients will appear here once classified</p>
        </div>
      );
    }

    // Special layout for Total CLV breakdown
    if (type === "totalCLV") {
      return (
        <div className="grid grid-cols-2 gap-4">
          {data.map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg p-4 shadow-sm border">
              <h3 className="font-medium text-gray-800 mb-2">{item.label || "Category"}</h3>
              <p className="text-2xl font-bold text-gray-900">{item.count}</p>
              {item.color && (
                <div className={`w-full h-1 mt-2 rounded-full bg-${item.color}-500`} />
              )}
            </div>
          ))}
        </div>
      );
    }

    // Default client list layout
    return (
      <div className="space-y-4">
        {data.map((item, idx) => (
          <div 
            key={idx} 
            className="bg-white rounded-lg border hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden"
            onClick={() => handleRowClick(item.companyName)}
          >
            {/* Header with classification */}
            <div className="p-4 border-b bg-gray-50/50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-lg">{item.companyName || "Unknown"}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${getClassificationColor(item.classification)}`}>
                      {item.classification || "Unclassified"}
                    </span>
                    {item.riskLevel && getRiskLevelBadge(item.riskLevel)}
                    {item.progress && getProgressBadge(item.progress)}
                  </div>
                </div>
                {item._id && (
                  <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded">
                    ID: {item._id.slice(-8)}
                  </span>
                )}
              </div>
            </div>

            {/* Metrics grid */}
            <div className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {item.clv !== undefined && (
                  <div className="bg-blue-50/50 rounded-lg p-2">
                    <p className="text-xs text-blue-600 mb-1">CLV</p>
                    <p className="text-sm font-semibold text-gray-800">{formatCurrency(item.clv)}</p>
                  </div>
                )}
                
                {item.dealValue !== undefined && (
                  <div className="bg-green-50/50 rounded-lg p-2">
                    <p className="text-xs text-green-600 mb-1">Deal Value</p>
                    <p className="text-sm font-semibold text-gray-800">{formatCurrency(item.dealValue)}</p>
                  </div>
                )}
                
                {item.riskScore !== undefined && (
                  <div className={`bg-opacity-50 rounded-lg p-2 ${
                    item.riskScore > 60 ? 'bg-red-50' : 
                    item.riskScore > 30 ? 'bg-yellow-50' : 'bg-green-50'
                  }`}>
                    <p className="text-xs text-gray-600 mb-1">Risk Score</p>
                    <p className={`text-sm font-semibold ${
                      item.riskScore > 60 ? 'text-red-600' : 
                      item.riskScore > 30 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {item.riskScore}%
                    </p>
                  </div>
                )}
                
                {item.daysSinceFollowUp !== undefined && (
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-600 mb-1">Days Inactive</p>
                    <p className="text-sm font-semibold text-gray-800">{item.daysSinceFollowUp}</p>
                  </div>
                )}
                
                {item.supportTickets !== undefined && (
                  <div className="bg-orange-50 rounded-lg p-2">
                    <p className="text-xs text-orange-600 mb-1">Support Tickets</p>
                    <p className="text-sm font-semibold text-gray-800">{item.supportTickets}</p>
                  </div>
                )}
                
                {item.clientHealthScore !== undefined && (
                  <div className="bg-purple-50 rounded-lg p-2">
                    <p className="text-xs text-purple-600 mb-1">Health Score</p>
                    <p className="text-sm font-semibold text-gray-800">{item.clientHealthScore}</p>
                  </div>
                )}
                
                {item.delivered !== undefined && (
                  <div className={`rounded-lg p-2 ${item.delivered ? 'bg-green-50' : 'bg-gray-50'}`}>
                    <p className="text-xs text-gray-600 mb-1">Delivered</p>
                    <p className="text-sm font-semibold text-gray-800">{item.delivered ? 'Yes' : 'No'}</p>
                  </div>
                )}
                
                {item.progress && (
                  <div className="bg-indigo-50 rounded-lg p-2">
                    <p className="text-xs text-indigo-600 mb-1">Progress</p>
                    <p className="text-sm font-semibold text-gray-800">{item.progress}</p>
                  </div>
                )}
              </div>

              {/* Classification reason */}
              {item.classificationReason && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-600">
                    <span className="font-medium text-gray-700">Reason:</span> {item.classificationReason}
                  </p>
                </div>
              )}
            </div>

            {/* Footer with view action */}
            <div className="px-4 py-2 bg-gray-50 border-t flex justify-end items-center">
              <span className="text-xs text-blue-600 flex items-center gap-1 hover:text-blue-800 transition-colors">
                <Eye size={14} />
                Click to view full details
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className={`p-6 ${getBgColor()} border-b flex justify-between items-center sticky top-0 z-10`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
              {getIcon()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{title}</h2>
              <p className="text-sm text-gray-600 mt-0.5">
                {data?.length || 0} client{data?.length !== 1 ? 's' : ''} in this category
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-gray-600 hover:text-gray-900 flex items-center justify-center transition-all duration-200 shadow-sm"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-100px)]">
          {renderContent()}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t text-xs text-gray-500 flex justify-between items-center">
          <span>Data refreshed in real-time</span>
          <span className="text-blue-600">• {data?.length || 0} records</span>
        </div>
      </div>
    </div>
  );
};

export default ClassificationModal;