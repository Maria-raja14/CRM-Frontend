
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MoreVertical, Edit, Trash2, X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

export const AllDeals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editDeal, setEditDeal] = useState(null);
  const [deleteDeal, setDeleteDeal] = useState(null);
  const [users, setUsers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const itemsPerPage = 10;

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/deals/getAll`
      );
      if (response.data) {
        setDeals(response.data);
        setTotalPages(Math.ceil(response.data.length / itemsPerPage));
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch deals");
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filteredSales = (res.data.users || []).filter(
        (user) =>
          user.role &&
          user.role.name &&
          user.role.name.toLowerCase() === "sales"
      );

      setUsers(filteredSales);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchDeals();
    fetchUsers();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatFollowUpDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const paginatedDeals = deals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Actions
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
      setDeleting(true);
      await axios.delete(`http://localhost:5000/api/deals/delete-deal/${deleteDeal._id}`);
      toast.success("Deal deleted successfully");
      fetchDeals();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete deal");
    } finally {
      setDeleting(false);
      setIsDeleteModalOpen(false);
      setDeleteDeal(null);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.patch(`http://localhost:5000/api/deals/${editDeal._id}`, {
        assignedTo: editDeal.assignedTo,
        stage: editDeal.stage,
        value: editDeal.value,
        notes: editDeal.notes,
        followUpDate: editDeal.followUpDate, 
      });
      toast.success("Deal updated successfully");
      fetchDeals();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update deal");
    } finally {
      setSaving(false);
      setIsEditModalOpen(false);
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

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Deal Name</th>
              <th className="px-6 py-3 text-left">Assigned To</th>
              <th className="px-6 py-3 text-left">Stage</th>
              <th className="px-6 py-3 text-left">Value</th>
              <th className="px-6 py-3 text-left">Notes</th>
              <th className="px-6 py-3 text-left">Created At</th>
              <th className="px-6 py-3 text-left">Follow-Up Date</th>
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
                  <td className="px-6 py-4 font-medium">
                    {deal.dealName || "-"}
                  </td>
                  <td className="px-6 py-4">
                    {deal.assignedTo
                      ? `${deal.assignedTo.firstName} ${deal.assignedTo.lastName}`
                      : "-"}
                  </td>
                  <td className="px-6 py-4">{deal.stage || "-"}</td>
                  <td className="px-6 py-4">{deal.value || "-"}</td>
                  <td className="px-6 py-4">{deal.notes || "-"}</td>
                  <td className="px-6 py-4">{formatDate(deal.createdAt)}</td>
                  <td className="px-6 py-4">
                    {formatFollowUpDate(deal.followUpDate)}
                  </td>
                  <td className="px-6 py-4 relative">
                    <button
                      onClick={() =>
                        setOpenDropdownId(
                          openDropdownId === deal._id ? null : deal._id
                        )
                      }
                      className="p-2 rounded hover:bg-gray-200"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {/* Dropdown Menu */}
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
                <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Deal</DialogTitle>
          </DialogHeader>
          {editDeal && (
            <div className="space-y-3 mt-4">
              {/* AssignTo */}
              <div>
                <label className="block text-sm font-medium">Assigned To</label>
                <select
                  value={editDeal.assignedTo}
                  onChange={(e) =>
                    setEditDeal({ ...editDeal, assignedTo: e.target.value })
                  }
                  className="mt-1 w-full border rounded p-2"
                  disabled={saving}
                >
                  <option value="">-- Select Salesman --</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.firstName} {u.lastName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stage */}
              <div>
                <label className="block text-sm font-medium">Stage</label>
                <select
                  value={editDeal.stage}
                  onChange={(e) =>
                    setEditDeal({ ...editDeal, stage: e.target.value })
                  }
                  className="mt-1 w-full border rounded p-2"
                  disabled={saving}
                >
                  <option>Qualification</option>
                  <option>Negotiation</option>
                  <option>Proposal Sent</option>
                  <option>Closed Won</option>
                  <option>Closed Lost</option>
                </select>
              </div>

              {/* Value */}
              <div>
                <label className="block text-sm font-medium">Value</label>
                <input
                  type="number"
                  value={editDeal.value}
                  onChange={(e) =>
                    setEditDeal({ ...editDeal, value: e.target.value })
                  }
                  className="mt-1 w-full border rounded p-2"
                  disabled={saving}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium">Notes</label>
                <textarea
                  value={editDeal.notes}
                  onChange={(e) =>
                    setEditDeal({ ...editDeal, notes: e.target.value })
                  }
                  className="mt-1 w-full border rounded p-2"
                  disabled={saving}
                />
              </div>

              {/* Follow-Up Date */}
              <div>
                <label className="block text-sm font-medium">Follow-Up Date</label>
                <input
                  type="datetime-local"
                  value={
                    editDeal.followUpDate
                      ? new Date(editDeal.followUpDate).toISOString().slice(0, 16)
                      : ""
                  }
                  onChange={(e) =>
                    setEditDeal({ ...editDeal, followUpDate: e.target.value })
                  }
                  className="mt-1 w-full border rounded p-2"
                  disabled={saving}
                />
              </div>

              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center"
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p>
              Are you sure you want to delete the deal "
              {deleteDeal?.dealName || 'this deal'}"? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 flex items-center justify-center"
              >
                {deleting ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};