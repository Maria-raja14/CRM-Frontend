import { useEffect, useState } from "react";

import axios from "axios";
import { toast } from "react-toastify";
import { MoreVertical, Edit, Trash2, Eye, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import { TourProvider, useTour } from "@reactour/tour";

const API_URL = import.meta.env.VITE_API_URL;

// Tour steps configuration for deals
const dealTourSteps = [
  {
    selector: ".tour-deals-header",
    content:
      "Welcome to the Deals Management page! Here you can view, edit, and manage all your deals.",
  },
  {
    selector: ".tour-create-deal",
    content:
      "Click here to create a new deal and add important details like value, stage, and assigned user.",
  },
  {
    selector: ".tour-filters",
    content:
      "Use these filters to narrow down deals by stage, assigned user, or name.",
  },
  {
    selector: ".tour-deals-table",
    content:
      "This is your deals table. It shows all your deals with their details such as stage, value, and assignee.",
  },
  {
    selector: ".tour-deal-name",
    content: "Click a Deal Name to view its detailed information.",
  },
  // {
  //   selector: ".tour-checkbox",
  //   content: "Admins can select deals here to bulk delete them all at once.",
  // },
  {
    selector: ".tour-deal-actions",
    content:
      "Click the three-dot menu to edit or delete a deal quickly.",
  },
  // {
  //   selector: ".tour-pagination",
  //   content:
  //     "Use these controls to navigate between pages of deals.",
  // },
  {
    selector: ".tour-finish",
    content:
      "That's the end of the tour! Click the button below to finish it anytime.",
  },
];

function AllDealsComponent() {
  const navigate = useNavigate();
  const { setIsOpen, setSteps, setCurrentStep, close } = useTour();

  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [selectedDeals, setSelectedDeals] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteDeal, setDeleteDeal] = useState(null);
  const [users, setUsers] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [filters, setFilters] = useState({ stage: "", assignedTo: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownCoords, setDropdownCoords] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const itemsPerPage = 10;

  // Tour setup on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    let role = "";
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        role = payload.role || "";
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }
    setUserRole(role);

    const hasTakenTour = localStorage.getItem("dealsTourCompleted");
    if (!hasTakenTour && role === "Sales") {
      setSteps(dealTourSteps);
      setTimeout(() => setIsOpen(true), 1000);
    }
  }, [setIsOpen, setSteps]);

  const startTour = () => {
    setSteps(dealTourSteps);
    setCurrentStep(0);
    setIsOpen(true);
    localStorage.setItem("dealsTourCompleted", "true");
  };

  const finishTour = () => {
    close();
    localStorage.setItem("dealsTourCompleted", "true");
    toast.success(
      "Tour completed! You can always restart it using the 'Take Tour' button."
    );
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openDropdownId && !e.target.closest(".dropdown-menu")) {
        setOpenDropdownId(null);
        setDropdownCoords(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdownId]);

  const toggleDropdown = (id, event) => {
    if (openDropdownId === id) {
      setOpenDropdownId(null);
      setDropdownCoords(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      setDropdownCoords({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
      });
      setOpenDropdownId(id);
    }
  };

  const formatCurrencyValue = (val) => {
    if (!val) return "-";
    const match = val.match(/^([\d,]+)\s*([A-Z]+)$/i);
    if (!match) return val;
    const number = match[1].replace(/,/g, "");
    const currency = match[2].toUpperCase();
    const formattedNumber = Number(number).toLocaleString("en-IN");
    return `${formattedNumber} ${currency}`;
  };

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/deals/getAll`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeals(res.data || []);
      setTotalPages(Math.ceil((res.data?.length || 0) / itemsPerPage));
    } catch (err) {
      console.error("Fetch deals error:", err);
      toast.error("Failed to fetch deals");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filteredSales = (res.data.users || []).filter(
        (u) => u.role?.name?.toLowerCase() === "sales"
      );
      setUsers(filteredSales);
    } catch (err) {
      console.error("Fetch users error:", err);
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchDeals();
    fetchUsers();
  }, []);

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "-";

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const paginatedDeals = deals
    .filter((d) => d.dealName?.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((d) => (filters.stage ? d.stage === filters.stage : true))
    .filter((d) =>
      filters.assignedTo ? d.assignedTo?._id === filters.assignedTo : true
    )
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleCheckboxChange = (id) => {
    setSelectedDeals((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const ids = paginatedDeals.map((d) => d._id);
      setSelectedDeals((prev) => Array.from(new Set([...prev, ...ids])));
    } else {
      const ids = paginatedDeals.map((d) => d._id);
      setSelectedDeals((prev) => prev.filter((d) => !ids.includes(d)));
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedDeals.length) return toast.info("Select deals to delete");
    if (!window.confirm(`Delete ${selectedDeals.length} deals?`)) return;

    try {
      setIsBulkDeleting(true);
      const token = localStorage.getItem("token");
      const deletePromises = selectedDeals.map((id) =>
        axios.delete(`${API_URL}/deals/delete-deal/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );
      await Promise.all(deletePromises);
      toast.success(`Successfully deleted ${selectedDeals.length} deals`);
      setSelectedDeals([]);
      await fetchDeals();
    } catch (err) {
      console.error("Bulk delete error:", err);
      toast.error("Failed to delete some deals");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleEdit = (deal) => {
    navigate("/createDeal", { state: { deal } });
    setOpenDropdownId(null);
  };

  const handleDeleteClick = (deal) => {
    setDeleteDeal(deal);
    setIsDeleteModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/deals/delete-deal/${deleteDeal._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deal deleted successfully");
      setIsDeleteModalOpen(false);
      await fetchDeals();
      setSelectedDeals((prev) => prev.filter((d) => d !== deleteDeal._id));
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.response?.data?.message || "Failed to delete deal");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDealNameClick = (dealId) => {
    navigate(`/Pipelineview/${dealId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header with flex and aligned buttons */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3 tour-deals-header">
        <h2 className="text-xl font-semibold text-gray-800">All Deals</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={startTour}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 tour-finish"
          >
            <Eye className="w-4 h-4" /> Take Tour
          </button>
          <button
            onClick={() => navigate("/createDeal")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 tour-create-deal"
          >
            <Plus className="w-4 h-4" /> Create Deal
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3 tour-filters">
        <div className="flex flex-wrap gap-6 items-center">
          <select
            value={filters.stage}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, stage: e.target.value }))
            }
            className="border rounded-md px-4 py-2 bg-white text-sm"
          >
            <option value="">All Stages</option>
            <option value="Qualification">Qualification</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Closed Won">Closed Won</option>
            <option value="Closed Lost">Closed Lost</option>
          </select>

          <select
            value={filters.assignedTo}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, assignedTo: e.target.value }))
            }
            className="border rounded-md bg-white px-4 py-2 text-sm"
          >
            <option value="">All Assigned</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.firstName} {u.lastName}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Deal Name..."
            className="border rounded-full px-4 py-2 bg-white text-sm"
          />
        </div>
      </div>

      {/* Bulk delete */}
      {selectedDeals.length > 0 && userRole === "Admin" && (
        <div className="mb-2 flex items-center space-x-2">
          <button
            onClick={handleBulkDelete}
            disabled={isBulkDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed tour-checkbox"
          >
            {isBulkDeleting
              ? "Deleting..."
              : `Delete Selected (${selectedDeals.length})`}
          </button>
        </div>
      )}

      {/* Deals Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm tour-deals-table">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              {userRole === "Admin" && (
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      paginatedDeals.length > 0 &&
                      paginatedDeals.every((d) => selectedDeals.includes(d._id))
                    }
                  />
                </th>
              )}
              <th className="px-6 py-3 text-left">Deal Name</th>
              <th className="px-6 py-3 text-left">Assigned To</th>
              <th className="px-6 py-3 text-left">Stage</th>
              <th className="px-6 py-3 text-left">Value</th>
              <th className="px-6 py-3 text-left">Created At</th>
              <th className="px-6 py-3 text-left tour-deal-actions">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedDeals.length > 0 ? (
              paginatedDeals.map((deal, idx) => (
                <tr
                  key={deal._id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  {userRole === "Admin" && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        onChange={() => handleCheckboxChange(deal._id)}
                        checked={selectedDeals.includes(deal._id)}
                      />
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDealNameClick(deal._id)}
                      className="text-blue-600 hover:text-blue-800 hover:underline font-medium tour-deal-name"
                    >
                      {deal.dealName || "-"}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    {deal.assignedTo
                      ? `${deal.assignedTo.firstName} ${deal.assignedTo.lastName}`
                      : "-"}
                  </td>
                  <td className="px-6 py-4">{deal.stage || "-"}</td>
                  <td className="px-6 py-4">
                    {formatCurrencyValue(deal.value)}
                  </td>
                  <td className="px-6 py-4">{formatDate(deal.createdAt)}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={(e) => toggleDropdown(deal._id, e)}
                      className="p-2 rounded hover:bg-gray-200"
                    >
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={userRole === "Admin" ? "7" : "6"}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No deals found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 tour-pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Dropdown Actions */}
      {openDropdownId &&
        dropdownCoords &&
        ReactDOM.createPortal(
          <div
            className="dropdown-menu absolute z-50 bg-white border rounded-md shadow-lg w-40"
            style={{
              top: dropdownCoords.top,
              left: dropdownCoords.left,
            }}
          >
            <button
              onClick={() =>
                handleEdit(deals.find((d) => d._id === openDropdownId))
              }
              className="flex items-center px-3 py-2 hover:bg-gray-100 w-full text-left"
            >
              <Edit size={16} className="mr-2" /> Edit
            </button>
            <button
              onClick={() =>
                handleDeleteClick(deals.find((d) => d._id === openDropdownId))
              }
              className="flex items-center px-3 py-2 hover:bg-gray-100 w-full text-left text-red-600"
            >
              <Trash2 size={16} className="mr-2" /> Delete
            </button>
          </div>,
          document.body
        )}

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-sm p-6">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete{" "}
            <strong>{deleteDeal?.dealName}</strong>?
          </p>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Wrap component with TourProvider like in LeadTable
export const AllDeals = () => {
  return (
    <TourProvider
      steps={dealTourSteps}
      afterOpen={() => (document.body.style.overflow = "hidden")}
      beforeClose={() => (document.body.style.overflow = "unset")}
      showNumber={false}
      styles={{
        popover: (base) => ({
          ...base,
          backgroundColor: "#fff",
          color: "#1f1f1f",
        }),
        maskArea: (base) => ({ ...base, rx: 8 }),
        badge: (base) => ({
          ...base,
          display: "none", // Hide the default number badge
        }),
        close: (base) => ({
          ...base,
          right: "auto",
          left: 8,
          top: 8,
        }),
        footer: (base) => ({
          ...base,
          justifyContent: "space-between",
        }),
        buttonClose: (base) => ({
          ...base,
          display: "none",
        }),
      }}
      footer={({ close }) => (
        <div className="flex justify-between items-center w-full px-4 py-2 border-t border-gray-200">
          <button
            onClick={close}
            className="text-gray-700 hover:text-gray-900 font-semibold"
          >
            Finish Tour
          </button>
          <div />
        </div>
      )}
    >
      <AllDealsComponent />
    </TourProvider>
  );
};//original
