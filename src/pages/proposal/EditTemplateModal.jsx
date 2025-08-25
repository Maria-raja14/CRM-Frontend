import React, { useState } from "react";
import axios from "axios";
import { Dialog } from "../../components/ui/dialog";
import { X } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditTemplateModal = ({ template, onClose, onUpdate }) => {
  const [editData, setEditData] = useState({ title: template?.title || "", content: template?.content || "" });

  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/template/updateTemp/${template._id}`, editData);
      onUpdate(response.data);
      onClose();
         toast.success(" Template Updated successfully!");
    } catch (error) {
      console.error("Error updating template:", error);
      toast.error(" Template Updated failed!");

    }
  };

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl w-[400px]">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold">Edit Template</h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>
        <input 
          type="text" 
          className="mt-4 w-full p-2 border rounded" 
          value={editData.title} 
          onChange={(e) => setEditData({ ...editData, title: e.target.value })} 
          placeholder="Title"
        />
        <textarea 
          className="mt-2 w-full p-2 border rounded" 
          value={editData.content} 
          onChange={(e) => setEditData({ ...editData, content: e.target.value })} 
          placeholder="Content"
        ></textarea>
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSave}>
          Save Changes
        </button>
      </Dialog.Panel>
    </Dialog>
  );
};

export default EditTemplateModal;
