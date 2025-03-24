
import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { Search } from "lucide-react";
import { BsBox } from "react-icons/bs";
import ModalDeals from "./ModalDeals";
import CardDeals from "./CardDeals";
import axios from "axios";

const AddDeals = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deals, setDeals] = useState([]);
  const [dealToEdit, setDealToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/alldeals");
      setDeals(res.data);
    } catch (error) {
      console.error("Error fetching deals:", error);
    }
  };

  const addNewDeal = (newDeal) => {
    setDeals((prevDeals) => [...prevDeals, newDeal]);
  };

  const openAddModal = () => {
    setDealToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (deal) => {
    setDealToEdit(deal);
    setIsModalOpen(true);
  };

  const deleteDeal = async (dealId) => {
    if (!dealId) {
      console.error("Error: dealId is undefined");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/alldeals/delete/${dealId}`);
      setDeals(deals.filter((deal) => deal._id !== dealId));
    } catch (error) {
      console.error("Error deleting deal:", error);
    }
  };

  const filteredDeals = deals.filter((deal) =>
    deal.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-lg font-semibold">All Pipeline</h2>
        <div className="flex flex-wrap gap-4">
          <button className="bg-green-500 text-white px-6 py-2 rounded">
            Actions <span className="text-xs">▼</span>
          </button>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded"
            onClick={() => setIsModalOpen(true)}
          >
            Add Deal
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
        <div className="flex flex-wrap items-center gap-4">
          <button className="p-2.5 bg-white rounded shadow">
            <FaBars size={16} />
          </button>
          <button className="p-2.5 bg-white rounded shadow">
            <BsBox size={16} />
          </button>
          <select className="p-2 shadow rounded-md text-blue-600 bg-white">
            <option>All Pipeline</option>
          </select>
          <div className="flex flex-wrap gap-4">
            {["Owner", "Lead Group", "Created Date", "Deals with Proposals"].map(
              (item, index) => (
                <span
                  key={index}
                  className="bg-white shadow text-gray-700 px-4 py-2 rounded-full text-sm"
                >
                  {item}
                </span>
              )
            )}
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search"
            className="pl-10 py-2 w-56 border border-gray-300 bg-white shadow-md rounded-4xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-4">
        {["Status", "Tags", "Deal Value"].map((filter, index) => (
          <span
            key={index}
            className="bg-white shadow text-gray-700 px-4 py-2 rounded-full text-sm"
          >
            {filter}
          </span>
        ))}
      </div>

      {isModalOpen && (
        <ModalDeals
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onDealAdded={addNewDeal}
          onEdit={(updatedDeal) => {
            setDeals((prevDeals) =>
              prevDeals.map((deal) => (deal._id === updatedDeal._id ? updatedDeal : deal))
            );
          }}
          dealToEdit={dealToEdit}
        />
      )}

      <div className="mt-6 grid grid-cols-4 gap-4">
        {filteredDeals.map((deal) => (
          <CardDeals key={deal._id} deal={deal} onEdit={openEditModal} onDelete={deleteDeal} />
        ))}
      </div>
    </div>
  );
};

export default AddDeals;
