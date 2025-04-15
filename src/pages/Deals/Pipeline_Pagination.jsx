import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa"; // Importing React Icons for edit and delete icons

const PipelineTable = () => {
  const data = [
    { name: "Deal 1", totalDealValue: "$5000", numOfDeals: 10, numOfStages: 3, createdDate: "2025-03-20" },
    { name: "Deal 2", totalDealValue: "$10000", numOfDeals: 5, numOfStages: 4, createdDate: "2025-03-21" },
    // Add more rows as needed
  ];

  return (
    <div className="overflow-x-auto bg-white shadow-md ">
      <table className="min-w-full table-auto">
        {/* Table Header */}
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left font-semibold text-gray-800">Name</th>
            <th className="px-6 py-3 text-left font-semibold text-gray-800">Total Deal Value</th>
            <th className="px-6 py-3 text-left font-semibold text-gray-800">No. of Deals</th>
            <th className="px-6 py-3 text-left font-semibold text-gray-800">No. of Stages</th>
            <th className="px-6 py-3 text-left font-semibold text-gray-800">Created Date</th>
            <th className="px-6 py-3 text-left font-semibold text-gray-800">Action</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4 text-gray-700">{item.name}</td>
              <td className="px-6 py-4 text-gray-700">{item.totalDealValue}</td>
              <td className="px-6 py-4 text-gray-700">{item.numOfDeals}</td>
              <td className="px-6 py-4 text-gray-700">{item.numOfStages}</td>
              <td className="px-6 py-4 text-gray-700">{item.createdDate}</td>
              <td className="px-6 py-4 text-gray-700">
                {/* Edit and Delete Icons */}
                <div className="flex space-x-4">
                  <button className="text-gray-600 hover:text-black">
                    <FaEdit />
                  </button>
                  <button className="text-gray-600 hover:text-black">
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PipelineTable;
