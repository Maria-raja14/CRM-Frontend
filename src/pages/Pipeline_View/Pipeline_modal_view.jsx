


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
      console.log("getAll",response);
      
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

      // Create a blob from the response
      const blob = new Blob([response.data]);
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element
      const a = document.createElement("a");
      a.href = url;
      a.download = filePath.split("/").pop() || "download";
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Failed to download file");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
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
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
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
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Pipeline
            </button>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">{deal.dealName}</h1>
            <p className="text-gray-600 mt-1">{deal.companyName}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              deal.stage === "Closed Won" ? "bg-green-100 text-green-800" :
              deal.stage === "Closed Lost" ? "bg-red-100 text-red-800" :
              "bg-blue-100 text-blue-800"
            }`}>
              {deal.stage}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm p-4 md:p-6">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("details")}
              className={`py-2 px-1 font-medium text-sm border-b-2 ${
                activeTab === "details"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("attachments")}
              className={`py-2 px-1 font-medium text-sm border-b-2 ${
                activeTab === "attachments"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Attachments ({deal.attachments?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`py-2 px-1 font-medium text-sm border-b-2 ${
                activeTab === "activity"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Activity
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "details" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Deal Information */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Deal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Deal Name</label>
                  <p className="mt-1 text-sm text-gray-900">{deal.dealName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Value</label>
                  <p className="mt-1 text-sm text-gray-900">₹{new Intl.NumberFormat("en-IN").format(deal.value || 0)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Stage</label>
                  <p className="mt-1 text-sm text-gray-900">{deal.stage}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Notes</label>
                  <p className="mt-1 text-sm text-gray-900">{deal.notes || "No notes"}</p>
                </div>
                {deal.followUpDate && (
                  <div>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Follow-up Status</label>
                    <p className="mt-1 text-sm text-gray-900">{deal.followUpStatus}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Company & Contact Information */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Company & Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Company Name</label>
                  <p className="mt-1 text-sm text-gray-900">{deal.companyName || "Not specified"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Industry</label>
                  <p className="mt-1 text-sm text-gray-900">{deal.industry || "Not specified"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{deal.email || "Not specified"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                  <p className="mt-1 text-sm text-gray-900">{deal.phoneNumber || "Not specified"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Source</label>
                  <p className="mt-1 text-sm text-gray-900">{deal.source || "Not specified"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Requirement</label>
                  <p className="mt-1 text-sm text-gray-900">{deal.requirement || "Not specified"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Address</label>
                  <p className="mt-1 text-sm text-gray-900">{deal.address || "Not specified"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Country</label>
                  <p className="mt-1 text-sm text-gray-900">{deal.country || "Not specified"}</p>
                </div>
              </div>
            </div>

            {/* Assignment Information */}
            <div className="md:col-span-2 mt-6 pt-6 border-t border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Assignment Information</h2>
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
                    className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-gray-100 rounded-md mr-3">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{attachment.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{attachment.type}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => downloadFile(attachment.path)}
                      className="p-2 text-indigo-600 hover:text-indigo-800"
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
                <div className="absolute -left-2.5 mt-1.5 h-4 w-4 rounded-full bg-indigo-600"></div>
                <div className="bg-gray-50 rounded-lg p-4">
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

              {/* Last Update Activity */}
              <div className="relative mb-6 pl-6">
                <div className="absolute -left-2.5 mt-1.5 h-4 w-4 rounded-full bg-blue-600"></div>
                <div className="bg-gray-50 rounded-lg p-4">
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

              {/* Stage Change Activity - if available */}
              {deal.stageHistory && deal.stageHistory.length > 0 ? (
                deal.stageHistory.map((history, index) => (
                  <div key={index} className="relative mb-6 pl-6">
                    <div className="absolute -left-2.5 mt-1.5 h-4 w-4 rounded-full bg-green-600"></div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-900">
                        Stage changed to {history.stage}
                      </p>
                      <p className="text-xs text-gray-500">
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
              ) : (
                <div className="relative mb-6 pl-6">
                  <div className="absolute -left-2.5 mt-1.5 h-4 w-4 rounded-full bg-gray-400"></div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-900">No stage changes recorded</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Pipeline_modal_view;




