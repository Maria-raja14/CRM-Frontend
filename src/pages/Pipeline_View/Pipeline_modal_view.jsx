import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Pipeline_modal_view() {
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
      const response = await axios.get(
        `http://localhost:5000/api/deals/getAll/${dealId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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
        `http://localhost:5000/api/files/download?filePath=${encodeURIComponent(filePath)}`,
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

  const getStageBadgeClass = (stage) => {
    switch (stage) {
      case "Closed Won":
        return "bg-green-100 text-green-800 border border-green-200";
      case "Closed Lost":
        return "bg-red-100 text-red-800 border border-red-200";
      case "Qualification":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "Negotiation":
        return "bg-amber-100 text-amber-800 border border-amber-200";
      case "Proposal Sent":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading deal details...</p>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Deal not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 md:p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Pipeline
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">{deal.dealName}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStageBadgeClass(deal.stage)}`}>
                {deal.stage}
              </span>
            </div>
            <p className="text-gray-600 mt-1">{deal.companyName}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm p-4 md:p-6">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex flex-wrap space-x-8">
            <button
              onClick={() => setActiveTab("details")}
              className={`py-2 px-1 font-medium text-sm border-b-2 ${
                activeTab === "details"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("attachments")}
              className={`py-2 px-1 font-medium text-sm border-b-2 ${
                activeTab === "attachments"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Attachments ({deal.attachments?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`py-2 px-1 font-medium text-sm border-b-2 ${
                activeTab === "activity"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Activity
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "details" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Deal Information */}
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Deal Information
              </h2>
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <label className="block text-sm font-medium text-gray-500">Deal Name</label>
                  <p className="mt-1 text-sm text-gray-900 font-medium">{deal.dealName}</p>
                </div>
                <div className="border-b border-gray-100 pb-3">
                  <label className="block text-sm font-medium text-gray-500">Value</label>
                  <p className="mt-1 text-sm text-gray-900 font-medium">₹{new Intl.NumberFormat("en-IN").format(deal.value || 0)}</p>
                </div>
                <div className="border-b border-gray-100 pb-3">
                  <label className="block text-sm font-medium text-gray-500">Stage</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageBadgeClass(deal.stage)}`}>
                      {deal.stage}
                    </span>
                  </div>
                </div>
                <div className="border-b border-gray-100 pb-3">
                  <label className="block text-sm font-medium text-gray-500">Notes</label>
                  <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{deal.notes || "No notes"}</p>
                </div>
                {deal.followUpDate && (
                  <div className="border-b border-gray-100 pb-3">
                    <label className="block text-sm font-medium text-gray-500">Follow-up Date</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(deal.followUpDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                )}
                {deal.followUpStatus && (
                  <div className="border-b border-gray-100 pb-3">
                    <label className="block text-sm font-medium text-gray-500">Follow-up Status</label>
                    <p className="mt-1 text-sm text-gray-900">{deal.followUpStatus}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Company & Contact Information */}
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Company & Contact Information
              </h2>
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <label className="block text-sm font-medium text-gray-500">Company Name</label>
                  <p className="mt-1 text-sm text-gray-900">{deal.companyName || "Not specified"}</p>
                </div>
                <div className="border-b border-gray-100 pb-3">
                  <label className="block text-sm font-medium text-gray-500">Industry</label>
                  <p className="mt-1 text-sm text-gray-900">{deal.industry || "Not specified"}</p>
                </div>
                <div className="border-b border-gray-100 pb-3">
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{deal.email || "Not specified"}</p>
                </div>
                <div className="border-b border-gray-100 pb-3">
                  <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                  <p className="mt-1 text-sm text-gray-900">{deal.phoneNumber || "Not specified"}</p>
                </div>
                <div className="border-b border-gray-100 pb-3">
                  <label className="block text-sm font-medium text-gray-500">Source</label>
                  <p className="mt-1 text-sm text-gray-900">{deal.source || "Not specified"}</p>
                </div>
                <div className="border-b border-gray-100 pb-3">
                  <label className="block text-sm font-medium text-gray-500">Requirement</label>
                  <p className="mt-1 text-sm text-gray-900">{deal.requirement || "Not specified"}</p>
                </div>
                <div className="border-b border-gray-100 pb-3">
                  <label className="block text-sm font-medium text-gray-500">Address</label>
                  <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{deal.address || "Not specified"}</p>
                </div>
                <div className="border-b border-gray-100 pb-3">
                  <label className="block text-sm font-medium text-gray-500">Country</label>
                  <p className="mt-1 text-sm text-gray-900">{deal.country || "Not specified"}</p>
                </div>
              </div>
            </div>

            {/* Assignment Information */}
            <div className="md:col-span-2 mt-4 bg-gray-50 p-5 rounded-lg border border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Assignment Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Assigned To</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {deal.assignedTo
                      ? `${deal.assignedTo.firstName} ${deal.assignedTo.lastName}`
                      : "Not assigned"}
                  </p>
                  {deal.assignedTo && (
                    <p className="mt-1 text-sm text-gray-500">{deal.assignedTo.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Created Date</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(deal.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "attachments" && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Attachments</h2>
            {deal.attachments && deal.attachments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {deal.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center min-w-0">
                      <div className="p-2 bg-gray-100 rounded-md mr-3 flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{attachment.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{attachment.type}</p>
                        {attachment.uploadedAt && (
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(attachment.uploadedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => downloadFile(attachment.path)}
                      className="p-2 text-blue-600 hover:text-blue-800 flex-shrink-0 transition-colors"
                      title="Download"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="mt-4 text-gray-500">No attachments found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "activity" && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Activity History</h2>
            <div className="border-l-2 border-gray-200 ml-4 pb-10">
              {/* Creation Activity */}
              <div className="relative mb-6 pl-6">
                <div className="absolute -left-2.5 mt-1.5 h-4 w-4 rounded-full bg-blue-600"></div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <p className="text-sm font-medium text-gray-900">Deal Created</p>
                  <p className="text-xs text-gray-500">
                    {new Date(deal.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {/* Stage History */}
              {deal.stageHistory && deal.stageHistory.length > 0 ? (
                deal.stageHistory.map((history, index) => (
                  <div key={index} className="relative mb-6 pl-6">
                    <div className={`absolute -left-2.5 mt-1.5 h-4 w-4 rounded-full ${
                      history.stage === "Closed Won" ? "bg-green-600" :
                      history.stage === "Closed Lost" ? "bg-red-600" :
                      history.stage === "Qualification" ? "bg-blue-600" :
                      history.stage === "Negotiation" ? "bg-amber-600" :
                      history.stage === "Proposal Sent" ? "bg-purple-600" : "bg-gray-600"
                    }`}></div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        Stage changed to <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStageBadgeClass(history.stage)}`}>
                          {history.stage}
                        </span>
                      </p>
                      {history.changedBy && (
                        <p className="text-xs text-gray-600 mt-1">
                          By: {history.changedBy.firstName} {history.changedBy.lastName}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(history.date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : null}

              {/* Last Update Activity */}
              <div className="relative mb-6 pl-6">
                <div className="absolute -left-2.5 mt-1.5 h-4 w-4 rounded-full bg-gray-600"></div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <p className="text-sm font-medium text-gray-900">Deal Updated</p>
                  <p className="text-xs text-gray-500">
                    {new Date(deal.updatedAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Pipeline_modal_view;