import { useEffect, useRef, useState } from "react";
import { X, File, FileText, FileImage, FileArchive, FileVideo } from "lucide-react";

export default function ExpenseModal({ open, onClose, onSave, editData }) {
  const modalRef = useRef(null);

  // Form states
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [desc, setDesc] = useState("");
  const [files, setFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [filesToRemove, setFilesToRemove] = useState([]);

  useEffect(() => {
    if (editData) {
      setName(editData.name || "");
      setArea(editData.areaOfExpense || "");
      setAmount(editData.amount || "");
      setDate(editData.expenseDate?.slice(0, 10) || "");
      setDesc(editData.description || "");
      setExistingFiles(editData.attachments || []);
    } else {
      setName("");
      setArea("");
      setAmount("");
      setDate("");
      setDesc("");
      setExistingFiles([]);
    }
    setFiles([]);
    setFilesToRemove([]);
  }, [editData, open]);

  useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [open]);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleRemoveExistingFile = (index) => {
    const fileToRemove = existingFiles[index];
    setFilesToRemove([...filesToRemove, fileToRemove]);
    setExistingFiles(existingFiles.filter((_, i) => i !== index));
  };

  const handleRemoveNewFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
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

  const handleSubmit = () => {
    const form = new FormData();
    form.append("name", name);
    form.append("areaOfExpense", area);
    form.append("amount", amount);
    form.append("expenseDate", date);
    form.append("description", desc);
    form.append("createdBy", "Admin");
    
    // Append new files
    for (let file of files) {
      form.append("attachments", file);
    }

    // Include existing files and files to remove if editing
    if (editData) {
      form.append("existingFiles", JSON.stringify(existingFiles));
      form.append("filesToRemove", JSON.stringify(filesToRemove));
    }

    onSave(form, !!editData);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50"
      onClick={handleClickOutside}
    >
      <div ref={modalRef} className="bg-white max-w-2xl w-full p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">
          {editData ? "Edit Expense" : "Add Expense"}
        </h2>
        <hr className="h-px my-4 bg-gray-200 border-0" />

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full mt-1 p-2 border rounded"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Expense area</label>
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="Choose an expense area"
              className="w-full mt-1 p-2 border rounded"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="w-full mt-1 p-2 border rounded"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Expense date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full mt-1 p-2 border rounded"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Description</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Description"
              className="w-full mt-1 p-2 border rounded"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Attachments</label>
            <div className="border-dashed border-2 border-blue-500 rounded-lg p-6 flex flex-col items-center justify-center mt-1">
              <input
                type="file"
                id="fileUpload"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="fileUpload" className="text-gray-600 cursor-pointer">
                Upload Files
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-start">
              Allowed file types: jpeg, jpg, gif, png, pdf, zip. (Max file size is 2MB)
            </p>

            {(files.length > 0 || existingFiles.length > 0) && (
              <div className="mt-4 border rounded-lg p-3 max-h-40 overflow-y-auto">
                <div className="grid grid-cols-1 gap-2">
                  {/* Existing files */}
                  {existingFiles.map((file, index) => {
                    const fileName = file.split('/').pop();
                    return (
                      <div key={`existing-${index}`} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          {getFileIcon(fileName)}
                          <a 
                            href={`http://localhost:5000/${file}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm truncate max-w-[200px]"
                          >
                            {fileName}
                          </a>
                        </div>
                        <button 
                          onClick={() => handleRemoveExistingFile(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Remove"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    );
                  })}
                  
                  {/* New files */}
                  {Array.from(files).map((file, index) => (
                    <div key={`new-${index}`} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        {getFileIcon(file.name)}
                        <span className="text-sm truncate max-w-[200px]">
                          {file.name} <span className="text-green-600 text-xs">(new)</span>
                        </span>
                      </div>
                      <button 
                        onClick={() => handleRemoveNewFile(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Remove"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button onClick={onClose} className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            {editData ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}