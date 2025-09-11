import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Mail,
  Paperclip,
  Tag,
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
  Phone,
  MapPin,
  Globe,
  Briefcase,
  BookOpen,
} from "lucide-react";

function Pipeline_modal_view() {
  const API_URL = import.meta.env.VITE_API_URL;

  const { dealId } = useParams();
  const navigate = useNavigate();
  const [deal, setDeal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (dealId) {
      fetchDealDetails();
    }
  }, [dealId]);

  const fetchDealDetails = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/deals/getAll/${dealId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeal(response.data);
    } catch (err) {
      console.error("Failed to fetch deal details:", err);
      toast.error("Failed to load deal details");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadFile = async (filePath) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/files/download?filePath=${encodeURIComponent(filePath)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filePath.split("/").pop() || "download";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Failed to download file");
    }
  };

const formatCurrencyValue = (val) => {
  if (!val) return "-";

  // Expect format like "12,554,755 INR" or "12554755 INR"
  const match = val.match(/^([\d,]+)\s*([A-Za-z]+)$/);
  if (!match) return val;

  const number = match[1].replace(/,/g, ""); // remove commas
  const currency = match[2].toUpperCase();

  // Format number in Indian numbering system
  const formattedNumber = Number(number).toLocaleString("en-IN");

  return `${formattedNumber} ${currency}`; // e.g. "1,25,54,755 INR"
};



  const getStageBadgeClass = (stage) => {
    switch (stage) {
      case "Closed Won":
        return {
          icon: CheckCircle,
          color: "text-emerald-700",
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-200",
          label: "Closed Won",
        };
      case "Closed Lost":
        return {
          icon: XCircle,
          color: "text-rose-700",
          bgColor: "bg-rose-50",
          borderColor: "border-rose-200",
          label: "Closed Lost",
        };
      case "Qualification":
        return {
          icon: AlertCircle,
          color: "text-blue-700",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          label: "Qualification",
        };
      case "Negotiation":
        return {
          icon: Clock,
          color: "text-amber-700",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          label: "Negotiation",
        };
      case "Proposal Sent":
        return {
          icon: Mail,
          color: "text-purple-700",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200",
          label: "Proposal Sent",
        };
      default:
        return {
          icon: AlertCircle,
          color: "text-slate-700",
          bgColor: "bg-slate-100",
          borderColor: "border-slate-200",
          label: stage || "Unknown",
        };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-slate-600">Loading deal details...</p>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md w-full">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="text-rose-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">
            Deal Not Found
          </h2>
          <p className="text-slate-600 mb-6">
            The deal you're looking for doesn't exist or may have been removed.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Pipeline
          </button>
        </div>
      </div>
    );
  }

  const stageConfig = getStageBadgeClass(deal.stage);
  const StageIcon = stageConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center text-slate-600 mb-3">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back to Pipeline
              </button>
              <ChevronRight size={16} className="mx-2" />
              <span className="text-slate-500">View Deal</span>
            </div>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                {deal.dealName}
              </h1>
              <div
                className={`inline-flex items-center px-4 py-2 rounded-full ${stageConfig.bgColor} ${stageConfig.color} border ${stageConfig.borderColor}`}
              >
                <StageIcon size={16} className="mr-2" />
                <span className="capitalize font-medium text-sm">
                  {stageConfig.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mb-6">
          <button
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "details"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "attachments"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
            onClick={() => setActiveTab("attachments")}
          >
            Attachments{" "}
            {deal.attachments &&
              deal.attachments.length > 0 &&
              `(${deal.attachments.length})`}
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "activity"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
            onClick={() => setActiveTab("activity")}
          >
            Activity
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column */}
          <div className="lg:col-span-2">
            {/* Details Card (Default Tab) */}
            {activeTab === "details" && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Deal Details
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Comprehensive information about this deal
                  </p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Deal Information */}
                    <div className="space-y-5">
                      <div>
                        <h3 className="text-sm font-medium text-slate-700 mb-3 uppercase tracking-wide">
                          Deal Information
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center text-slate-700">
                            <Tag size={18} className="mr-3 text-slate-500" />
                            <div>
                              <p className="text-sm font-medium">Deal Name</p>
                              <p className="text-slate-900">{deal.dealName}</p>
                            </div>
                          </div>
                          <div className="flex items-center text-slate-700">
                            <DollarSign
                              size={18}
                              className="mr-3 text-slate-500"
                            />
                            <div>
                              <p className="text-sm font-medium">Value</p>
                              <p className="text-slate-900">
                                {formatCurrencyValue(deal.value)}
                                
                              </p>
                            </div>
                          </div>
                          {deal.notes && (
                            <div className="flex items-center text-slate-700">
                              <BookOpen
                                size={18}
                                className="mr-3 text-slate-500"
                              />
                              <div>
                                <p className="text-sm font-medium">Notes</p>
                                <p className="text-slate-900">{deal.notes}</p>
                              </div>
                            </div>
                          )}
                          {deal.followUpDate && (
                            <div className="flex items-center text-slate-700">
                              <Clock
                                size={18}
                                className="mr-3 text-slate-500"
                              />
                              <div>
                                <p className="text-sm font-medium">
                                  Follow-up Date
                                </p>
                                <p className="text-slate-900">
                                  {new Date(
                                    deal.followUpDate
                                  ).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>
                            </div>
                          )}
                          {deal.followUpStatus && (
                            <div className="flex items-center text-slate-700">
                              <AlertCircle
                                size={18}
                                className="mr-3 text-slate-500"
                              />
                              <div>
                                <p className="text-sm font-medium">
                                  Follow-up Status
                                </p>
                                <p className="text-slate-900">
                                  {deal.followUpStatus}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Company Information */}
                    <div className="space-y-5">
                      <div>
                        <h3 className="text-sm font-medium text-slate-700 mb-3 uppercase tracking-wide">
                          Company Information
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center text-slate-700">
                            <Building
                              size={18}
                              className="mr-3 text-slate-500"
                            />
                            <div>
                              <p className="text-sm font-medium">
                                Company Name
                              </p>
                              <p className="text-slate-900">
                                {deal.companyName || "Not specified"}
                              </p>
                            </div>
                          </div>
                          {deal.industry && (
                            <div className="flex items-center text-slate-700">
                              <Briefcase
                                size={18}
                                className="mr-3 text-slate-500"
                              />
                              <div>
                                <p className="text-sm font-medium">Industry</p>
                                <p className="text-slate-900">
                                  {deal.industry}
                                </p>
                              </div>
                            </div>
                          )}
                          {deal.email && (
                            <div className="flex items-center text-slate-700">
                              <Mail size={18} className="mr-3 text-slate-500" />
                              <div>
                                <p className="text-sm font-medium">Email</p>
                                <a
                                  href={`mailto:${deal.email}`}
                                  className="text-blue-600 hover:underline text-slate-900"
                                >
                                  {deal.email}
                                </a>
                              </div>
                            </div>
                          )}
                          {deal.phoneNumber && (
                            <div className="flex items-center text-slate-700">
                              <Phone
                                size={18}
                                className="mr-3 text-slate-500"
                              />
                              <div>
                                <p className="text-sm font-medium">
                                  Phone Number
                                </p>
                                <p className="text-slate-900">
                                  {deal.phoneNumber}
                                </p>
                              </div>
                            </div>
                          )}
                          {deal.source && (
                            <div className="flex items-center text-slate-700">
                              <Globe
                                size={18}
                                className="mr-3 text-slate-500"
                              />
                              <div>
                                <p className="text-sm font-medium">Source</p>
                                <p className="text-slate-900">{deal.source}</p>
                              </div>
                            </div>
                          )}
                          {deal.requirement && (
                            <div className="flex items-center text-slate-700">
                              <FileText
                                size={18}
                                className="mr-3 text-slate-500"
                              />
                              <div>
                                <p className="text-sm font-medium">
                                  Requirement
                                </p>
                                <p className="text-slate-900">
                                  {deal.requirement}
                                </p>
                              </div>
                            </div>
                          )}
                          {deal.address && (
                            <div className="flex items-center text-slate-700">
                              <MapPin
                                size={18}
                                className="mr-3 text-slate-500"
                              />
                              <div>
                                <p className="text-sm font-medium">Address</p>
                                <p className="text-slate-900 whitespace-pre-wrap">
                                  {deal.address}
                                </p>
                              </div>
                            </div>
                          )}
                          {deal.country && (
                            <div className="flex items-center text-slate-700">
                              <Globe
                                size={18}
                                className="mr-3 text-slate-500"
                              />
                              <div>
                                <p className="text-sm font-medium">Country</p>
                                <p className="text-slate-900">{deal.country}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Attachments Card */}
            {activeTab === "attachments" && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Attachments
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Files and documents related to this deal
                  </p>
                </div>
                <div className="p-6">
                  {deal.attachments && deal.attachments.length > 0 ? (
                    <ul className="space-y-3">
                      {deal.attachments.map((file, idx) => (
                        <li
                          key={idx}
                          className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors group"
                        >
                          <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg mr-4">
                              <FileText size={20} className="text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-900">
                                {file.name}
                              </p>
                              <p className="text-xs text-slate-500 mt-1 capitalize">
                                {file.type}
                                {file.uploadedAt && (
                                  <span>
                                    {" "}
                                    • Uploaded{" "}
                                    {new Date(
                                      file.uploadedAt
                                    ).toLocaleDateString()}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => downloadFile(file.path)}
                              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Download"
                            >
                              <Download size={18} />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Paperclip size={24} className="text-slate-400" />
                      </div>
                      <p className="text-slate-500">No attachments found</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Activity Card */}
            {activeTab === "activity" && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Activity Timeline
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Recent activities and updates for this deal
                  </p>
                </div>
                <div className="p-6">
                  <div className="relative">
                    {/* Creation Activity */}
                    <div className="flex items-start mb-8">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FileText size={16} className="text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-slate-900">
                          Deal created
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          {new Date(deal.createdAt).toLocaleString("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Stage History */}
                    {deal.stageHistory &&
                      deal.stageHistory.length > 0 &&
                      deal.stageHistory.map((history, index) => {
                        const historyStageConfig = getStageBadgeClass(
                          history.stage
                        );
                        const HistoryStageIcon = historyStageConfig.icon;

                        return (
                          <div key={index} className="flex items-start mb-8">
                            <div className="flex-shrink-0">
                              <div
                                className={`w-10 h-10 ${historyStageConfig.bgColor} rounded-full flex items-center justify-center`}
                              >
                                <HistoryStageIcon
                                  size={16}
                                  className={historyStageConfig.color}
                                />
                              </div>
                            </div>
                            <div className="ml-4">
                              <h3 className="text-sm font-medium text-slate-900">
                                Stage changed to {historyStageConfig.label}
                              </h3>
                              {history.changedBy && (
                                <p className="text-xs text-slate-600 mt-1">
                                  By: {history.changedBy.firstName}{" "}
                                  {history.changedBy.lastName}
                                </p>
                              )}
                              <p className="text-sm text-slate-500 mt-1">
                                {new Date(history.date).toLocaleString(
                                  "en-US",
                                  {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                        );
                      })}

                    {/* Last Update Activity */}
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                          <Clock size={16} className="text-slate-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-slate-900">
                          Deal updated
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          {new Date(deal.updatedAt).toLocaleString("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 p-5">
              <h3 className="text-sm font-medium text-slate-700 mb-3 uppercase tracking-wide">
                Deal Status
              </h3>
              <div
                className={`inline-flex items-center px-4 py-2 rounded-full ${stageConfig.bgColor} ${stageConfig.color} border ${stageConfig.borderColor} mb-4`}
              >
                <StageIcon size={16} className="mr-2" />
                <span className="capitalize font-medium text-sm">
                  {stageConfig.label}
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-2">
                Last updated {new Date(deal.updatedAt).toLocaleDateString()}
              </p>
            </div>

            {/* Company Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 p-5">
              <h3 className="text-sm font-medium text-slate-700 mb-4 uppercase tracking-wide">
                Company
              </h3>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mr-3">
                  <Building size={20} className="text-slate-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">
                    {deal.companyName || "Unknown Company"}
                  </h4>
                  {deal.industry && (
                    <p className="text-sm text-slate-600">{deal.industry}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                {deal.email && (
                  <a
                    href={`mailto:${deal.email}`}
                    className="flex items-center text-sm text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    <Mail size={14} className="mr-2" />
                    {deal.email}
                  </a>
                )}
                {deal.phoneNumber && (
                  <div className="flex items-center text-sm text-slate-600">
                    <Phone size={14} className="mr-2" />
                    {deal.phoneNumber}
                  </div>
                )}
              </div>
            </div>

            {/* Assigned To Card */}
            {deal.assignedTo && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 p-5">
                <h3 className="text-sm font-medium text-slate-700 mb-4 uppercase tracking-wide">
                  Assigned To
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center text-slate-700">
                    <User size={18} className="mr-3 text-slate-500" />
                    <div>
                      <p className="text-sm font-medium">Assigned To</p>
                      <p className="text-slate-900">
                        {deal.assignedTo
                          ? `${deal.assignedTo.firstName} ${deal.assignedTo.lastName}`
                          : "Not assigned"}
                      </p>
                      {deal.assignedTo && (
                        <p className="text-sm text-slate-500 mt-1">
                          {deal.assignedTo.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center text-slate-700">
                    <Calendar size={18} className="mr-3 text-slate-500" />
                    <div>
                      <p className="text-sm font-medium">Created Date</p>
                      <p className="text-slate-900">
                        {new Date(deal.createdAt).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pipeline_modal_view;
