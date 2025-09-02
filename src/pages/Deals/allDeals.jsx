import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export const AllDeals = () => {
  const navigate = useNavigate();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [selectedDeals, setSelectedDeals] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editDeal, setEditDeal] = useState(null);
  const [deleteDeal, setDeleteDeal] = useState(null);
  const [users, setUsers] = useState([]);
  const [userRole, setUserRole] = useState("");
  const itemsPerPage = 10;

  // Decode token to get user role
  const getUserRole = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.role || "";
      } catch (err) {
        console.error("Error decoding token:", err);
        return "";
      }
    }
    return "";
  };

  // Fetch deals
  const fetchDeals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/deals/getAll", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeals(res.data || []);
      setTotalPages(Math.ceil((res.data?.length || 0) / itemsPerPage));
    } catch (err) {
      toast.error("Failed to fetch deals");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Sales users (only for Admin)
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filteredSales = (res.data.users || []).filter(
        (u) => u.role?.name?.toLowerCase() === "sales"
      );
      setUsers(filteredSales);
    } catch (err) {
      toast.error("Failed to fetch users");
      console.error(err);
    }
  };

  useEffect(() => {
    const role = getUserRole();
    setUserRole(role);
    fetchDeals();
    if (role === "Admin") {
      fetchUsers();
    }
  }, []);

  // Format functions
  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "-";
 

  // Pagination
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) setCurrentPage(newPage);
  };
  const paginatedDeals = deals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Bulk select
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
      const token = localStorage.getItem("token");
      await Promise.all(
        selectedDeals.map((id) =>
          axios.delete(`http://localhost:5000/api/deals/delete-deal/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      toast.success("Deleted successfully");
      setSelectedDeals([]);
      fetchDeals();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  // Actions
  const toggleDropdown = (id) =>
    setOpenDropdownId(openDropdownId === id ? null : id);
  const handleEdit = (deal) => {
    setEditDeal({
      ...deal,
      assignedTo: deal.assignedTo?._id || "",
    });
    setIsEditModalOpen(true);
    setOpenDropdownId(null);
  };
  const handleDeleteClick = (deal) => {
    setDeleteDeal(deal);
    setIsDeleteModalOpen(true);
    setOpenDropdownId(null);
  };
  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/deals/delete-deal/${deleteDeal._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Deleted successfully");
      setIsDeleteModalOpen(false);
      fetchDeals();
      setSelectedDeals((prev) => prev.filter((d) => d !== deleteDeal._id));
    } catch (err) {
      toast.error("Failed to delete");
    }
  };
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/deals/update-deal/${editDeal._id}`,
        editDeal,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Updated successfully");
      setIsEditModalOpen(false);
      fetchDeals();
    } catch (err) {
      toast.error("Failed to update");
    }
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
      <h2 className="text-xl font-semibold text-gray-800 mb-4">All Deals</h2>

      {/* Create Deal - only Admin */}
      {userRole !== "Admin" && (
        <div className="mb-4">
          <button
            onClick={() => navigate("/createDeal")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            + Create Deal
          </button>
        </div>
      )}

     

      {/* Bulk delete for Admin */}
      {selectedDeals.length > 0 && userRole === "Admin" && (
        <div className="mb-2 flex items-center space-x-2">
          <button
            onClick={handleBulkDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete Selected ({selectedDeals.length})
          </button>
        </div>
      )}

      {/* Deals Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
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
             
              <th className="px-6 py-3 text-left">Actions</th>
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
                  <td className="px-6 py-4">{deal.dealName || "-"}</td>
                  <td className="px-6 py-4">
                    {deal.assignedTo
                      ? `${deal.assignedTo.firstName} ${deal.assignedTo.lastName}`
                      : "-"}
                  </td>
                  <td className="px-6 py-4">{deal.stage || "-"}</td>
                  <td className="px-6 py-4">{deal.value || "-"}</td>
                  <td className="px-6 py-4">{formatDate(deal.createdAt)}</td>
                  
                  <td className="px-6 py-4 relative">
                    <button
                      onClick={() => toggleDropdown(deal._id)}
                      className="p-2 rounded hover:bg-gray-200"
                    >
                      <MoreVertical size={18} />
                    </button>
                    {openDropdownId === deal._id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md z-10">
                        <button
                          onClick={() => handleEdit(deal)}
                          className="flex items-center px-3 py-2 hover:bg-gray-100 w-full text-left"
                        >
                          <Edit size={16} className="mr-2" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(deal)}
                          className="flex items-center px-3 py-2 hover:bg-gray-100 w-full text-left text-red-600"
                        >
                          <Trash2 size={16} className="mr-2" /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={userRole === "Admin" ? "8" : "7"}
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
        <div className="flex justify-between items-center mt-4">
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

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <DialogTitle>Edit Deal</DialogTitle>
          </DialogHeader>
          {editDeal && (
            <div className="space-y-4">
              {/* Admin can change assign to */}
              {userRole === "Admin" && (
                <select
                  value={editDeal.assignedTo}
                  onChange={(e) =>
                    setEditDeal({ ...editDeal, assignedTo: e.target.value })
                  }
                  className="w-full border rounded p-2"
                >
                  <option value="">-- Select Salesman --</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.firstName} {u.lastName}
                    </option>
                  ))}
                </select>
              )}
              <input
                type="text"
                value={editDeal.dealName || ""}
                onChange={(e) =>
                  setEditDeal({ ...editDeal, dealName: e.target.value })
                }
                className="w-full border rounded p-2"
                placeholder="Deal Name"
              />
              <select
                value={editDeal.stage || ""}
                onChange={(e) =>
                  setEditDeal({ ...editDeal, stage: e.target.value })
                }
                className="w-full border rounded p-2"
              >
                <option value="">-- Select Stage --</option>
                <option>Qualification</option>
                <option>Negotiation</option>
                <option>Proposal Sent</option>
                <option>Closed Won</option>
                <option>Closed Lost</option>
              </select>
              <input
                type="number"
                value={editDeal.value || ""}
                onChange={(e) =>
                  setEditDeal({ ...editDeal, value: e.target.value })
                }
                className="w-full border rounded p-2"
                placeholder="Value"
              />
              <textarea
                value={editDeal.notes || ""}
                onChange={(e) =>
                  setEditDeal({ ...editDeal, notes: e.target.value })
                }
                className="w-full border rounded p-2"
                placeholder="Notes"
              />
           
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};
