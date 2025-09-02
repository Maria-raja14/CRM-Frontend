import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Pipeline_view = () => {
  const [leads, setLeads] = useState([]);
  const [deals, setDeals] = useState([]);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("leads"); // "leads" or "deals"

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      
    //   // Fetch leads
    //   const leadsResponse = await axios.get("http://localhost:5000/api/leads/getAll", {
    //     headers: { Authorization: `Bearer ${token}` }
    //   });
    //   setLeads(leadsResponse.data);
      
      // Fetch deals
      const dealsResponse = await axios.get("http://localhost:5000/api/deals/getAll", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeals(dealsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDealDetails = async (dealId) => {
    try {
      setDetailLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.get(`http://localhost:5000/api/deals/getAll/${dealId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSelectedDeal(response.data);
    } catch (error) {
      console.error("Error fetching deal details:", error);
      toast.error("Failed to fetch deal details");
    } finally {
      setDetailLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(date);
  };

  const formatNumber = (n) => {
    return new Intl.NumberFormat("en-IN").format(n);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 md:p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Pipeline Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Comprehensive view of all leads and deals</p>
        </div>
        
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("leads")}
              className={`py-4 px-1 text-sm font-medium border-b-2 ${
                activeTab === "leads"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Leads ({leads.length})
            </button>
            <button
              onClick={() => setActiveTab("deals")}
              className={`py-4 px-1 text-sm font-medium border-b-2 ${
                activeTab === "deals"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Deals ({deals.length})
            </button>
          </nav>
        </div>
        
        {/* Leads Table */}
        {activeTab === "leads" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact Person
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leads.length > 0 ? (
                    leads.map((lead) => (
                      <tr key={lead._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {lead.companyName || "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lead.contactPerson || "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lead.email || "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lead.phone || "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${lead.status === "New" ? "bg-blue-100 text-blue-800" : 
                              lead.status === "Contacted" ? "bg-yellow-100 text-yellow-800" : 
                              lead.status === "Qualified" ? "bg-green-100 text-green-800" : 
                              "bg-gray-100 text-gray-800"}`}>
                            {lead.status || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(lead.createdAt)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        No leads found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Deals Table */}
        {activeTab === "deals" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Deal Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stage
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assigned To
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {deals.length > 0 ? (
                      deals.map((deal) => (
                        <tr key={deal._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {deal.dealName || "—"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ₹{formatNumber(deal.value || 0)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${deal.stage === "Qualification" ? "bg-blue-100 text-blue-800" : 
                                deal.stage === "Negotiation" ? "bg-yellow-100 text-yellow-800" : 
                                deal.stage === "Proposal Sent" ? "bg-cyan-100 text-cyan-800" : 
                                deal.stage === "Closed Won" ? "bg-green-100 text-green-800" : 
                                deal.stage === "Closed Lost" ? "bg-red-100 text-red-800" : 
                                "bg-gray-100 text-gray-800"}`}>
                              {deal.stage || "—"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {deal.assignedTo ? `${deal.assignedTo.firstName || ''} ${deal.assignedTo.lastName || ''}`.trim() : "—"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(deal.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => fetchDealDetails(deal._id)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                          No deals found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Deal Details Panel */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Deal Details</h2>
              
              {detailLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : selectedDeal ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Deal Name</h3>
                    <p className="mt-1 text-sm text-gray-900">{selectedDeal.dealName}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Deal Title</h3>
                    <p className="mt-1 text-sm text-gray-900">{selectedDeal.dealTitle || "—"}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Value</h3>
                    <p className="mt-1 text-sm text-gray-900">₹{formatNumber(selectedDeal.value || 0)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Stage</h3>
                    <p className="mt-1 text-sm text-gray-900">{selectedDeal.stage}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Assigned To</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedDeal.assignedTo ? 
                        `${selectedDeal.assignedTo.firstName || ''} ${selectedDeal.assignedTo.lastName || ''}`.trim() : 
                        "—"}
                    </p>
                  </div>
                  
                  {selectedDeal.lead && (
                    <>
                      <div className="pt-4 border-t border-gray-200">
                        <h3 className="text-md font-medium text-gray-900">Lead Information</h3>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Lead Name</h3>
                        <p className="mt-1 text-sm text-gray-900">{selectedDeal.lead.leadName || "—"}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Company Name</h3>
                        <p className="mt-1 text-sm text-gray-900">{selectedDeal.lead.companyName || "—"}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Contact Person</h3>
                        <p className="mt-1 text-sm text-gray-900">{selectedDeal.lead.contactPerson || "—"}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Email</h3>
                        <p className="mt-1 text-sm text-gray-900">{selectedDeal.lead.email || "—"}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                        <p className="mt-1 text-sm text-gray-900">{selectedDeal.lead.phone || "—"}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Status</h3>
                        <p className="mt-1 text-sm text-gray-900">{selectedDeal.lead.status || "—"}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Source</h3>
                        <p className="mt-1 text-sm text-gray-900">{selectedDeal.lead.source || "—"}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Country</h3>
                        <p className="mt-1 text-sm text-gray-900">{selectedDeal.lead.country || "—"}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Lead Assigned To</h3>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedDeal.lead.assignTo ? 
                            `${selectedDeal.lead.assignTo.firstName || ''} ${selectedDeal.lead.assignTo.lastName || ''}`.trim() : 
                            "—"}
                        </p>
                      </div>
                    </>
                  )}
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                    <p className="mt-1 text-sm text-gray-900">{selectedDeal.notes || "No notes available"}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Created Date</h3>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(selectedDeal.createdAt)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(selectedDeal.updatedAt)}</p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center h-64">
                  <p className="text-sm text-gray-500">Select a deal to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pipeline_view;//leads and deals data come perfectly...