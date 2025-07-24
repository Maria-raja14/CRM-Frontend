import React, { useEffect, useState } from "react";
import axios from "axios";
import AreaExpensesTable from "./Area_Expenses_Pagination";
import AreaModal from "./Area_Expenses_Modal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import DatePicker from "react-datepicker";
import { Search } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import "react-datepicker/dist/react-datepicker.css";

const AreaExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/area-expenses");
      setExpenses(res.data);
    } catch (error) {
      toast.error("Failed to fetch expenses");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSave = async (data) => {
    try {
      if (editingExpense) {
        await axios.put(
          `http://localhost:5000/api/area-expenses/${editingExpense._id}`,
          data
        );
        toast.success("Expense updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/area-expenses", data);
        toast.success("Expense added successfully");
      }
      fetchExpenses();
      setEditingExpense(null);
    } catch (error) {
      toast.error("Failed to save expense");
    }
  };

  const handleDeleteClick = (item) => {
    setExpenseToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/area-expenses/${expenseToDelete._id}`
      );
      toast.success("Expense deleted successfully");
      fetchExpenses();
      setDeleteModalOpen(false);
      setExpenseToDelete(null);
    } catch (error) {
      toast.error("Failed to delete expense");
    }
  };

  const filteredData = expenses.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Area Expenses</h1>
        <button
          onClick={() => {
            setEditingExpense(null);
            setModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Add Expense
        </button>
      </div>

      {/* Filter and Search Section */}
      <div className="flex gap-2 flex-wrap mb-8 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {/* Date Filter */}
          <div className="relative">
            <button
              className="border border-gray-200 bg-white shadow px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gray-50 transition-colors"
            
            >
              Date
            </button>
            
          </div>

          <button className="border border-gray-200 bg-white shadow px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gray-50 transition-colors">
            Expense Date
          </button>

          <button className="border border-gray-200 bg-white shadow px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gray-50 transition-colors">
            Expense Area
          </button>

          <button className="border border-gray-200 bg-white shadow px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gray-50 transition-colors">
            Created By
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-56">
          <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search"
            className="pl-8 py-2 w-full border border-gray-200 bg-white shadow rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-gray-300 transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table Section */}
      <AreaExpensesTable
        data={currentItems}
        onEdit={(item) => {
          setEditingExpense(item);
          setModalOpen(true);
        }}
        onDelete={handleDeleteClick}
      />

      {/* Pagination Controls */}
      {filteredData.length > itemsPerPage && (
        <div className="flex justify-center mt-6">
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${
                currentPage === 1
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <button
                  key={number}
                  onClick={() => setCurrentPage(number)}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === number
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {number}
                </button>
              )
            )}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AreaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        expenseToEdit={editingExpense}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setExpenseToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemName={expenseToDelete?.name || "this expense"}
      />
    </div>
  );
};

export default AreaExpenses;//fc


