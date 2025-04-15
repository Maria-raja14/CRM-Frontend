
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit, Trash2, Plus, ChevronLeft, ChevronRight, File, FileText, FileImage, FileArchive, FileVideo } from "lucide-react";
import ExpenseModal from "./Expenses_Modal_popup";
import toast, { Toaster } from "react-hot-toast";
import DeleteConfirmationModal from "../Area_Expenses/DeleteConfirmationModal"; // Import the delete modal

const ExpensesTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  // Add state for delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/expenses?page=${page}&limit=5`);
      setExpenses(res.data.expenses);
      setTotal(res.data.total);
    } catch (err) {
      toast.error("Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [page]);

  const handleSave = async (formData, isEdit) => {
    try {
      if (isEdit) {
        await axios.put(`http://localhost:5000/api/expenses/${editData._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Expense updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/expenses", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Expense saved successfully!");
      }

      setIsModalOpen(false);
      setEditData(null);
      fetchExpenses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save expense.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`);
      toast.success("Expense deleted!");
      fetchExpenses();
    } catch (err) {
      toast.error("Failed to delete.");
    } finally {
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  // New function to handle delete button click
  const handleDeleteClick = (item) => {
    setItemToDelete(item._id);
    setDeleteModalOpen(true);
  };

  const handleEditClick = (item) => {
    setEditData(item);
    setIsModalOpen(true);
  };

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    switch(ext) {
      case 'pdf':
        return <FileText className="text-red-500" size={16} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileImage className="text-blue-500" size={16} />;
      case 'zip':
      case 'rar':
        return <FileArchive className="text-yellow-500" size={16} />;
      case 'mp4':
      case 'mov':
      case 'avi':
        return <FileVideo className="text-purple-500" size={16} />;
      default:
        return <File className="text-gray-500" size={16} />;
    }
  };

  return (
    <div className="p-4">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Expense Management</h2>
        <button
          onClick={() => {
            setEditData(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={16} /> Add Expense
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses of Area</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attachments</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                </td>
              </tr>
            ) : expenses.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                  No expenses found
                </td>
              </tr>
            ) : (
              expenses.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.areaOfExpense}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      ${item.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.expenseDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{item.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-2">
                      {item.attachments?.map((file, j) => {
                        const fileName = file.split('/').pop();
                        return (
                          <a
                            key={j}
                            href={`http://localhost:5000/${file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs hover:bg-gray-200 transition-colors"
                            title={fileName}
                          >
                            {getFileIcon(fileName)}
                            <span className="max-w-[80px] truncate">{fileName}</span>
                          </a>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.createdBy}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditClick(item)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(item)} // Changed to use handleDeleteClick
                        className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 px-2">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{(page - 1) * 5 + 1}</span> to{' '}
          <span className="font-medium">{Math.min(page * 5, total)}</span> of{' '}
          <span className="font-medium">{total}</span> results
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            className={`flex items-center px-3 py-1 rounded-md ${page <= 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            <ChevronLeft size={16} className="mr-1" />
            Previous
          </button>
          <div className="flex space-x-1">
            {[...Array(Math.ceil(total / 5)).keys()].slice(0, 5).map(num => (
              <button
                key={num}
                onClick={() => setPage(num + 1)}
                className={`px-3 py-1 rounded-md ${page === num + 1 ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                {num + 1}
              </button>
            ))}
            {Math.ceil(total / 5) > 5 && (
              <span className="px-3 py-1">...</span>
            )}
          </div>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page * 5 >= total}
            className={`flex items-center px-3 py-1 rounded-md ${page * 5 >= total ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            Next
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      </div>

      <ExpenseModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditData(null);
        }}
        onSave={handleSave}
        editData={editData}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={() => handleDelete(itemToDelete)}
        itemName="this expense"
      />
    </div>
  );
};

export default ExpensesTable;