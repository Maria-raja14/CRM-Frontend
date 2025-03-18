import React from "react";

const ModalOrganization = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // Hide modal when not open

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-[500px] rounded-lg shadow-lg p-6">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-lg font-semibold">Add Organization</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">✖</button>
        </div>

        {/* Form Fields */}
        <form>
          <div className="mb-4">
            <label className="block text-gray-600">Name</label>
            <input type="text" placeholder="Organization name" className="w-full p-2 border rounded-md" />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600">Lead group</label>
            <select className="w-full p-2 border rounded-md">
              <option>Choose a lead group</option>
              <option>Sales</option>
              <option>Marketing</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-600">Owner</label>
            <select className="w-full p-2 border rounded-md">
              <option>zebra forest</option>
            </select>
          </div>

          <div className="mb-4">
            <button className="text-blue-500">+ Add address</button>
          </div>

          {/* Custom Fields */}
          <h3 className="text-md font-semibold">Custom fields</h3>
          <div className="mb-4">
            <label className="block text-gray-600">Loan</label>
            <input type="text" className="w-full p-2 border rounded-md" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600">AAs</label>
            <input type="text" className="w-full p-2 border rounded-md" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600">Sites</label>
            <input type="text" className="w-full p-2 border rounded-md" />
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalOrganization;
