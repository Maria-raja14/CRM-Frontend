// export default ProposalHead;
import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

// Status styles
const STATUS_STYLES = {
  draft: "bg-orange-50 text-orange-700 border-orange-200",
  sent: "bg-blue-50 text-blue-700 border-blue-200",
  "no reply": "bg-gray-50 text-gray-500 border-gray-200",
  rejection: "bg-red-50 text-red-600 border-red-200",
  success: "bg-green-50 text-green-700 border-green-200",
};

const PAGE_SIZE = 5;

const ProposalHead = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openActionId, setOpenActionId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCreatedDate, setFilterCreatedDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [draftCount, setDraftCount] = useState(0);
  const [followUpDialogOpen, setFollowUpDialogOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [followUpDate, setFollowUpDate] = useState(null);
  const [followUpComment, setFollowUpComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Fetch proposals
  useEffect(() => {
    const fetchProposals = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/proposal/getall"
        );
        setProposals(response.data);
        setDraftCount(response.data.filter((p) => p.status === "draft").length);
        setError("");
      } catch {
        setError("Failed to load proposals.");
        toast.error("Failed to load proposals.");
      }
      setLoading(false);
    };
    fetchProposals();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenActionId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/proposal/updatestatus/${id}`, {
        status: newStatus,
      });
      setProposals((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: newStatus } : p))
      );
      toast.success(`Status updated to ${newStatus}`);
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/proposal/delete/${id}`);
      setProposals((prev) => prev.filter((p) => p._id !== id));
      toast.success("Proposal deleted successfully.");
    } catch {
      toast.error("Failed to delete proposal.");
    }
  };

  const openFollowUpDialog = (proposal) => {
    setSelectedProposal(proposal);
    setFollowUpDate(
      proposal.followUpDate ? new Date(proposal.followUpDate) : null
    );
    setFollowUpComment(proposal.followUpComment || "");
    setIsEditing(false);
    setFollowUpDialogOpen(true);
  };

  const saveFollowUp = async () => {
    if (!selectedProposal) return;
    try {
      const res = await axios.put(
        `http://localhost:5000/api/proposal/followup/${selectedProposal._id}`,
        { followUpDate, followUpComment }
      );
      setProposals((prev) =>
        prev.map((p) =>
          p._id === selectedProposal._id ? res.data.proposal : p
        )
      );
      toast.success("Follow-up updated!");
      setFollowUpDialogOpen(false);
    } catch {
      toast.error("Failed to update follow-up.");
    }
  };

  // Filter proposals
  const filteredProposals = proposals.filter((proposal) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      proposal.title?.toLowerCase().includes(search) ||
      proposal.email?.toLowerCase().includes(search) ||
      proposal.dealTitle?.toLowerCase().includes(search);

    const matchesFilters =
      (filterStatus === "" || proposal.status === filterStatus) &&
      (filterCreatedDate === null ||
        (proposal.createdAt &&
          new Date(proposal.createdAt).toLocaleDateString() ===
            new Date(filterCreatedDate).toLocaleDateString()));

    return matchesSearch && matchesFilters;
  });

  const totalPages = Math.ceil(filteredProposals.length / PAGE_SIZE);
  const currentPageProposals = filteredProposals.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const openDropdown = (id, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setOpenActionId(openActionId === id ? null : id);
  };

  return (
    <div className="min-h-screen py-8 px-4 md:px-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Proposal List</h1>
        <Link to="/proposal/sendproposal">
          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition">
            + New Proposal
          </button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-8 mb-6 items-center">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded px-4 py-2 bg-white shadow-sm focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="no reply">No Reply</option>
          <option value="rejection">Rejection</option>
          <option value="success">Success</option>
        </select>

        <div className="relative">
          <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
          <DatePicker
            selected={filterCreatedDate}
            onChange={(date) => setFilterCreatedDate(date)}
            placeholderText="Created Date"
            className="border rounded-md bg-white px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title, email, or deal"
          className="border rounded-full px-4 py-2 bg-white shadow-sm focus:ring-2 focus:ring-blue-400 w-full md:w-1/3"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-700">
                Title
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">
                Deal Title
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">
                Email
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">
                Status
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">
                Follow-up Date
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentPageProposals.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-400">
                  No proposals found
                </td>
              </tr>
            ) : (
              currentPageProposals.map((proposal) => (
                <tr
                  key={proposal._id}
                  className="border-b hover:bg-gray-50 transition relative"
                >
                  <td className="px-4 py-3">{proposal.title}</td>
                  <td className="px-4 py-3 text-blue-600 hover:underline cursor-pointer">
                    <Link to={`/proposal/view/${proposal._id}`}>
                      {proposal.dealTitle || "No Deal"}
                    </Link>
                  </td>

                  <td className="px-4 py-3">{proposal.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={proposal.status}
                      onChange={(e) =>
                        handleStatusChange(proposal._id, e.target.value)
                      }
                      className={`border px-2 py-1 rounded ${
                        STATUS_STYLES[proposal.status]
                      }`}
                    >
                      <option value="draft">Draft</option>
                      <option value="sent">Sent</option>
                      <option value="no reply">No Reply</option>
                      <option value="rejection">Rejection</option>
                      <option value="success">Success</option>
                    </select>
                  </td>
                  <td
                    className="px-4 py-3 cursor-pointer text-blue-600 hover:underline"
                    onClick={() => openFollowUpDialog(proposal)}
                  >
                    {proposal.followUpDate
                      ? new Date(proposal.followUpDate).toLocaleDateString()
                      : new Date(proposal.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 relative">
                    <button
                      onClick={(e) => openDropdown(proposal._id, e)}
                      className="p-1"
                    >
                      <BsThreeDotsVertical />
                    </button>

                    {openActionId === proposal._id &&
                      ReactDOM.createPortal(
                        <div
                          ref={dropdownRef}
                          className="absolute bg-white shadow-md rounded border z-50"
                          style={{
                            top: dropdownPosition.top,
                            left: dropdownPosition.left,
                          }}
                        >
                          <button
                            onClick={() =>
                              navigate(`/proposal/view/${proposal._id}`)
                            }
                            className="block px-4 py-2 w-full text-left hover:bg-gray-100"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDelete(proposal._id)}
                            className="block px-4 py-2 w-full text-left text-red-600 hover:bg-gray-100"
                          >
                            Delete
                          </button>
                        </div>,
                        document.body
                      )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition"
          >
            Next
          </button>
        </div>
      )}

      {/* Follow-up Dialog */}
      <Dialog open={followUpDialogOpen} onOpenChange={setFollowUpDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Follow-up Details
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            {!isEditing ? (
              <>
                <div>
                  <p className="text-sm text-gray-500">Follow-up Date</p>
                  <p className="font-medium">
                    {followUpDate
                      ? new Date(followUpDate).toLocaleString()
                      : "No date set"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Comment</p>
                  <p className="font-medium">
                    {followUpComment || "No comment added"}
                  </p>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                  <DatePicker
                    selected={followUpDate}
                    onChange={(date) => setFollowUpDate(date)}
                    showTimeSelect
                    dateFormat="Pp"
                    placeholderText="Select follow-up date"
                    className="w-full border px-10 py-2 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <textarea
                  value={followUpComment}
                  onChange={(e) => setFollowUpComment(e.target.value)}
                  className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Add a follow-up comment"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveFollowUp}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Save
                  </button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ProposalHead;
