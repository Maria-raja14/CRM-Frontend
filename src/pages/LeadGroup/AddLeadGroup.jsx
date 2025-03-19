import React, { useState,useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddLeadGroup = ({ onClose, onAdd,leadGroupToEdit  }) => {
  const [name, setName] = useState("");
  const [selectedClass, setSelectedClass] = useState("primary");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (leadGroupToEdit) {
      setName(leadGroupToEdit.name);
      setSelectedClass(leadGroupToEdit.leadClass);
    }
  }, [leadGroupToEdit]);




  const classColors = {
    primary: "bg-blue-500",
    success: "bg-green-500",
    secondary: "bg-gray-500",
    danger: "bg-red-500",
    purple: "bg-purple-500",
    warning: "bg-yellow-500",
    info: "bg-cyan-500",
    light: "bg-gray-200 text-black",
    dark: "bg-black text-white",
    link: "bg-blue-300",
  };

  
  const handleSubmit = async () => {
    if (!name) {
      alert("Please enter a name!");
      return;
    }

    setLoading(true);

    try {
      let response;
      if (leadGroupToEdit) {
        response = await axios.put(`http://localhost:5000/api/leadGroup/${leadGroupToEdit._id}`, {
          name,
          leadClass: selectedClass,
        });
        toast.success("Leads update successfully");
      } else {
        response = await axios.post("http://localhost:5000/api/leadGroup/add", {
          name,
          leadClass: selectedClass,
        });
        toast.success("Leads Added successfully");
      }

      // alert(leadGroupToEdit ? "Lead Group Updated Successfully!" : "Lead Group Added Successfully!");
      onAdd(response.data.data);
      onClose();
    } catch (error) {
      toast.error("Error saving lead group");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center mb-[300px] bg-opacity-40">
      <div className="bg-white mt-16 p-6 rounded-lg w-[580px] h-[350px] shadow-lg">
        <div className="flex justify-between items-center pb-3">
          <h2 className="text-xl font-semibold">Add Lead Group</h2>
          <button className="text-black font-bold hover:text-gray-600" onClick={onClose}>
            X
          </button>
        </div>

        {/* Input Fields */}
        <div className="mt-8 space-y-4">
          <div className="flex flex-row justify-between gap-8 items-center">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-[450px] mr-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-row justify-between items-center mr-[45px]">
            <label className="block text-sm font-medium text-gray-700">Class</label>
            <div className="flex flex-row justify-evenly items-center gap-[50px]">
              <select
                className="mt-1 w-[250px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                {Object.keys(classColors).map((cls) => (
                  <option key={cls} value={cls}>
                    {cls.charAt(0).toUpperCase() + cls.slice(1)}
                  </option>
                ))}
              </select>

              <p className={`p-2 px-7 rounded-sm w-fit font-semibold text-white ${classColors[selectedClass]}`}>
                {selectedClass.charAt(0).toUpperCase() + selectedClass.slice(1)}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-2 mt-12 mr-2">
          <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400" onClick={onClose}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 rounded-md text-white shadow-lg ${loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddLeadGroup;
