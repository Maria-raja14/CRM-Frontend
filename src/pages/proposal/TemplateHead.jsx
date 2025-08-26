// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { Search, Eye, Pencil, Trash2, X } from "lucide-react";
// import { Editor } from "@tinymce/tinymce-react";
// import { Link } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const TemplateHead = () => {
//   const [templates, setTemplates] = useState([]);
//   const [selectedTemplate, setSelectedTemplate] = useState(null);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [previewModalOpen, setPreviewModalOpen] = useState(false);
//   const [filteredTemplates, setFilteredTemplates] = useState([]);
  
//   const [filters, setFilters] = useState({
//     createdDate: "",
//     owner: "",
//   });
  
//   const [editData, setEditData] = useState({
//     title: "",
//     content: "",
//     image: "",
//   });
//   const [createdDateModal, setCreatedDateModal] = useState(false);
//   const [ownerModal, setOwnerModal] = useState(false);

//   const editorRef = useRef(null);

//   // Fetch templates from API
//   // useEffect(() => {
//   //   axios
//   //     .get("http://localhost:5000/api/auth/template/readTemp")
//   //     .then((response) => setTemplates(response.data))
//   //     .catch((error) => console.error("Error fetching templates:", error));
//   // }, []);

//   // Delete template
//   const handleDelete = async (_id) => {
//     try {
//       await axios.delete(
//         `http://localhost:5000/api/template/deleteTemp/${_id}`
//       );
//       setTemplates(templates.filter((template) => template._id !== _id));
//       toast.success(" Template Deleted successfully!");
//     } catch (error) {
//       console.error("Error deleting template:", error);
//       toast.error(" Template Deleted faild!");
//     }
//   };

//   // Open Edit Modal
//   const openEditModal = (template) => {
//     setSelectedTemplate(template);
//     setEditData({
//       title: template.title,
//       content: template.content,
//       image: template.image,
//     });
//     setEditModalOpen(true);
//   };

//   // Open Preview Modal
//   const openPreviewModal = (template) => {
//     setSelectedTemplate(template);
//     setPreviewModalOpen(true);
//   };

//   // Handle Edit Save
//   const handleEditSave = async () => {
//     if (!selectedTemplate) return;

//     try {
//       const updatedContent = editorRef.current
//         ? editorRef.current.getContent()
//         : editData.content;
//       const response = await axios.put(
//         `http://localhost:5000/api/template/updateTemp/${selectedTemplate._id}`,
//         { ...editData, content: updatedContent }
//       );

//       setTemplates(
//         templates.map((template) =>
//           template._id === selectedTemplate._id
//             ? { ...template, ...response.data }
//             : template
//         )
//       );

//       setEditModalOpen(false);
//     } catch (error) {
//       console.error("Error updating template:", error);
//     }
//   };

//   return (
//     <div>
//       {/* Header Section */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl">Templates</h1>
//         <Link to="/template/addtemp">
//           <button className="bg-[#4466f2] text-white shadow-2xl p-2 px-3 rounded-sm cursor-pointer">
//             Add Template
//           </button>
//         </Link>
//       </div>

//       {/* Filter and Search Section */}
//       <div className="flex justify-between items-center mt-8">
//         <div className="flex gap-3 mt-5">
//           <button
//             className="px-6 py-2 shadow-2xl text-gray-400 bg-white rounded-3xl"
//             onClick={() => setCreatedDateModal(true)}
//           >
//             Created Date
//           </button>
//           <button
//             className="px-6 py-2 shadow-2xl text-gray-400 bg-white rounded-3xl"
//             onClick={() => setOwnerModal(true)}
//           >
//             Owner
//           </button>
//         </div>

//         <div className="flex items-center border rounded-3xl w-[170px] bg-white px-2">
//           <Search className="w-5 h-5 text-gray-500" />
//           <input
//             type="text"
//             placeholder="Search"
//             className="p-1.5 outline-none w-full bg-transparent"
//           />
//         </div>
//       </div>

//       {/* Templates List */}
//       <div className="grid grid-cols-3 gap-5 mt-8">
//         {templates.map((template) => (
//           <div
//             key={template._id}
//             className="relative bg-white rounded-lg shadow-lg  h-[400px] cursor-pointer transition hover:shadow-xl flex flex-col justify-between overflow-hidden " // Ensure full size
//           >
//             {/* Cover Image */}
//             <div className="relative w-full h-full overflow-hidden">
//               <img
//                 src="data:image/jpeg;base64,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"
//                 alt=""
//                 className="w-full h-full object-cover"
//               />

//               {/* Hover Overlay with Icons */}
//               <div className="absolute inset-0  bg-opacity-40 flex flex-col justify-center items-center gap-3 opacity-0 hover:opacity-100 transition">
//                 <button
//                   className="text-black  p-2 rounded-full"
//                   onClick={() => openPreviewModal(template)}
//                 >
//                   <Eye size={20} />
//                 </button>
//                 <button
//                   className="text-black  p-2 rounded-full"
//                   onClick={() => openEditModal(template)}
//                 >
//                   <Pencil size={20} />
//                 </button>
//                 <button
//                   className="text-black  p-2 rounded-full"
//                   onClick={() => handleDelete(template._id)}
//                 >
//                   <Trash2 size={20} />
//                 </button>
//               </div>
//             </div>
//             <h2 className="text-lg font-semibold text-gray-400 text-center p-3">
//               {template.title}
//             </h2>
//             {/* Template Title */}
//           </div>
//         ))}
//       </div>

//       {previewModalOpen && selectedTemplate && (
//         <div className="fixed inset-0 flex items-center justify-center bg-background bg-opacity-50">
//           <div className="bg-white p-6 rounded-lg shadow-xl w-[800px] h-[600px] flex flex-col">
//             {/* Modal Header */}
//             <div className="flex  items-center  justify-between">
//               <h3 className="text-lg font-bold mt-4">
//                 {selectedTemplate.title}
//               </h3>
//               <X
//                 className="cursor-pointer"
//                 onClick={() => setPreviewModalOpen(false)}
//               />
//             </div>

//             {/* Template Title */}

//             {/* Template Content */}
//             <div className="mt-4 border p-4 rounded bg-gray-100 min-h-[300px] overflow-auto">
//               <div
//                 dangerouslySetInnerHTML={{ __html: selectedTemplate.content }}
//               />
//             </div>

//             {/* Close Button */}
//             <button
//               className="mt-4 bg-gray-500 text-white w-fit items-end px-4 py-2 rounded"
//               onClick={() => setPreviewModalOpen(false)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {createdDateModal && (
//         <div className="fixed inset-0 bg-transparent bg-opacity-40 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg w-[400px] shadow-xl">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-semibold">Filter by Created Date</h2>
//               <X
//                 className="cursor-pointer"
//                 onClick={() => setCreatedDateModal(false)}
//               />
//             </div>
//             <input
//               type="text"
//               placeholder="MM/DD/YYYY"
//               value={filters.createdDate}
//               onChange={(e) =>
//                 setFilters({ ...filters, createdDate: e.target.value })
//               }
//               className="border rounded px-4 py-2 w-full mb-4"
//             />
//             <div className="flex justify-end gap-3">
//               <button
//                 className="bg-gray-300 px-4 py-2 rounded"
//                 onClick={() => {
//                   setFilters({ ...filters, createdDate: "" });
//                   setFilteredTemplates(templates);
//                   setCreatedDateModal(false);
//                 }}
//               >
//                 Clear
//               </button>
//               <button
//                 className="bg-blue-500 text-white px-4 py-2 rounded"
//                 onClick={() => {
//                   const filtered = templates.filter((t) =>
//                     new Date(t.createdAt)
//                       .toLocaleDateString()
//                       .includes(filters.createdDate)
//                   );
//                   setFilteredTemplates(filtered);
//                   setCreatedDateModal(false);
//                 }}
//               >
//                 Apply
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {ownerModal && (
//         <div className="fixed inset-0 bg-transparent bg-opacity-40 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg w-[400px] shadow-xl">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-semibold">Filter by Owner</h2>
//               <X
//                 className="cursor-pointer"
//                 onClick={() => setOwnerModal(false)}
//               />
//             </div>
//             <input
//               type="text"
//               placeholder="Owner Name"
//               value={filters.owner}
//               onChange={(e) =>
//                 setFilters({ ...filters, owner: e.target.value })
//               }
//               className="border rounded px-4 py-2 w-full mb-4"
//             />
//             <div className="flex justify-end gap-3">
//               <button
//                 className="bg-gray-300 px-4 py-2 rounded"
//                 onClick={() => {
//                   setFilters({ ...filters, owner: "" });
//                   setFilteredTemplates(templates);
//                   setOwnerModal(false);
//                 }}
//               >
//                 Clear
//               </button>
//               <button
//                 className="bg-blue-500 text-white px-4 py-2 rounded"
//                 onClick={() => {
//                   const filtered = templates.filter((t) =>
//                     t.owner?.toLowerCase().includes(filters.owner.toLowerCase())
//                   );
//                   setFilteredTemplates(filtered);
//                   setOwnerModal(false);
//                 }}
//               >
//                 Apply
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Modal */}
//       {editModalOpen && (
//         <div className="fixed inset-0 flex  items-center  justify-center bg-background bg-opacity-50">
//           <div className="bg-white p-7 rounded-lg shadow-xl w-[1000px] h-screen gap-5 flex flex-col">
//             <div className="flex items-center justify-between">
//               <h2 className="text-xl font-semibold">{editData.title}</h2>
//               <X
//                 className="cursor-pointer"
//                 onClick={() => setEditModalOpen(false)}
//               />
//             </div>
//             <input
//               type="text"
//               className="mt-4 w-full p-2 border rounded"
//               value={editData.title}
//               onChange={(e) =>
//                 setEditData({ ...editData, title: e.target.value })
//               }
//               placeholder="Title"
//             />
//             <div className="mt-4">
//               <Editor
//                 apiKey="a413g7ope5qfyodp0u0e5d042r8jwy9vf6b162kjnnmgj5us"
//                 onInit={(evt, editor) => (editorRef.current = editor)}
//                 initialValue={editData.content}
//                 init={{
//                   height: 300,
//                   menubar: true,
//                   plugins: "lists link image code media table",
//                   toolbar:
//                     "undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | image media table code",
//                   images_upload_url: "/upload-image",
//                   automatic_uploads: true,
//                 }}
//               />
//             </div>
//             <button
//               className="mt-24 bg-blue-500 text-white px-4 py-2 rounded"
//               onClick={handleEditSave}
//             >
//               Save Changes
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TemplateHead;//original

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Search, Eye, Pencil, Trash2, X, MoreVertical } from "lucide-react";
import { Editor } from "@tinymce/tinymce-react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

const TemplateHead = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  
  const [filters, setFilters] = useState({
    createdDate: "",
    owner: "",
  });
  
  const [editData, setEditData] = useState({
    title: "",
    content: "",
    image: "",
  });
  const [createdDateModal, setCreatedDateModal] = useState(false);
  const [ownerModal, setOwnerModal] = useState(false);

  const editorRef = useRef(null);

  // Fetch templates from API
  useEffect(() => {
    fetchTemplates();
  }, [activeTab]);

  const fetchTemplates = async () => {
    try {
      let url = "http://localhost:5000/api/template/readTemp";
      if (activeTab !== "all") {
        url += `?type=${activeTab}`;
      }
      
      const response = await axios.get(url);
      setTemplates(response.data);
      setFilteredTemplates(response.data);
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast.error("Error fetching templates!");
    }
  };

  // Delete template
  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/template/deleteTemp/${selectedTemplate._id}`
      );
      setTemplates(templates.filter((template) => template._id !== selectedTemplate._id));
      setDeleteModalOpen(false);
      toast.success("Template deleted successfully!");
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error("Failed to delete template!");
    }
  };

  // Open Edit Modal
  const openEditModal = (template) => {
    setSelectedTemplate(template);
    setEditData({
      title: template.title,
      content: template.content,
      image: template.image,
    });
    setEditModalOpen(true);
  };

  // Open Preview Modal
  const openPreviewModal = (template) => {
    setSelectedTemplate(template);
    setPreviewModalOpen(true);
  };

  // Open Delete Confirmation Modal
  const openDeleteModal = (template) => {
    setSelectedTemplate(template);
    setDeleteModalOpen(true);
  };

  // Handle Edit Save
  const handleEditSave = async () => {
    if (!selectedTemplate) return;

    try {
      const updatedContent = editorRef.current
        ? editorRef.current.getContent()
        : editData.content;
        
      const formData = new FormData();
      formData.append("title", editData.title);
      formData.append("content", updatedContent);
      
      const response = await axios.put(
        `http://localhost:5000/api/template/updateTemp/${selectedTemplate._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setTemplates(
        templates.map((template) =>
          template._id === selectedTemplate._id
            ? { ...template, ...response.data.template }
            : template
        )
      );

      setEditModalOpen(false);
      toast.success("Template updated successfully!");
    } catch (error) {
      console.error("Error updating template:", error);
      toast.error("Failed to update template!");
    }
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = templates;
    
    if (filters.createdDate) {
      filtered = filtered.filter((t) =>
        new Date(t.createdAt)
          .toLocaleDateString()
          .includes(filters.createdDate)
      );
    }
    
    if (filters.owner) {
      filtered = filtered.filter((t) =>
        t.owner?.toLowerCase().includes(filters.owner.toLowerCase())
      );
    }
    
    setFilteredTemplates(filtered);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      createdDate: "",
      owner: "",
    });
    setFilteredTemplates(templates);
  };

  return (
    <div>
      <ToastContainer />
      
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Templates</h1>
        <Link to="/template/addtemp">
          <button className="bg-[#4466f2] text-white shadow-lg p-2 px-4 rounded-md cursor-pointer hover:bg-blue-600 transition">
            Create Template
          </button>
        </Link>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b mt-8">
        <button
          className={`px-4 py-2 font-medium ${activeTab === "all" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("all")}
        >
          All Templates
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === "custom" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("custom")}
        >
          My Templates
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === "predefined" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("predefined")}
        >
          Predefined Templates
        </button>
      </div>

      {/* Filter and Search Section */}
      <div className="flex justify-between items-center mt-8">
        <div className="flex gap-3">
          <button
            className="px-4 py-2 shadow-md text-gray-600 bg-white rounded-md border text-sm"
            onClick={() => setCreatedDateModal(true)}
          >
            Created Date {filters.createdDate && `: ${filters.createdDate}`}
          </button>
          <button
            className="px-4 py-2 shadow-md text-gray-600 bg-white rounded-md border text-sm"
            onClick={() => setOwnerModal(true)}
          >
            Owner {filters.owner && `: ${filters.owner}`}
          </button>
          {(filters.createdDate || filters.owner) && (
            <button
              className="px-4 py-2 text-blue-600 bg-white rounded-md border text-sm"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          )}
        </div>

        <div className="flex items-center border rounded-md w-64 bg-white px-3 py-2">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search templates..."
            className="outline-none w-full bg-transparent text-sm"
            onChange={(e) => {
              const searchTerm = e.target.value.toLowerCase();
              setFilteredTemplates(
                templates.filter(
                  (t) =>
                    t.title.toLowerCase().includes(searchTerm) ||
                    t.content.toLowerCase().includes(searchTerm)
                )
              );
            }}
          />
        </div>
      </div>

      {/* Templates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map((template) => (
            <div
              key={template._id}
              className="relative bg-white rounded-lg shadow-md h-80 cursor-pointer transition hover:shadow-lg flex flex-col overflow-hidden"
            >
              {/* Cover Image */}
              <div className="relative w-full h-48 overflow-hidden">
                {template.image ? (
                  <img
                    src={`http://localhost:5000${template.image}`}
                    alt={template.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}

                {/* Hover Overlay with Icons */}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center gap-3 opacity-0 hover:opacity-100 transition">
                  <button
                    className="text-white bg-blue-500 p-2 rounded-full hover:bg-blue-600"
                    onClick={() => openPreviewModal(template)}
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    className="text-white bg-green-500 p-2 rounded-full hover:bg-green-600"
                    onClick={() => openEditModal(template)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="text-white bg-red-500 p-2 rounded-full hover:bg-red-600"
                    onClick={() => openDeleteModal(template)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                {/* Three-dot menu */}
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="text-white bg-black bg-opacity-50 p-1 rounded-full">
                      <MoreVertical size={16} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => openPreviewModal(template)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Preview</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditModal(template)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => openDeleteModal(template)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              {/* Template Info */}
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                  {template.title}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Created by: {template.owner}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(template.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No templates found. Create your first template!</p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <Dialog open={previewModalOpen} onOpenChange={setPreviewModalOpen}>
        <DialogContent className="max-w-3xl h-5/6 flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.title}</DialogTitle>
          </DialogHeader>
          <div className="flex-grow overflow-auto border p-4 rounded bg-gray-50">
            {selectedTemplate && (
              <div dangerouslySetInnerHTML={{ __html: selectedTemplate.content }} />
            )}
          </div>
          <div className="flex justify-end mt-4">
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              onClick={() => setPreviewModalOpen(false)}
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Are you sure you want to delete the template "{selectedTemplate?.title}"? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <button
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-4xl h-5/6 flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 flex-grow overflow-hidden">
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
              placeholder="Template Title"
            />
            <div className="flex-grow overflow-hidden">
              <Editor
                apiKey="a413g7ope5qfyodp0u0e5d042r8jwy9vf6b162kjnnmgj5us"
                onInit={(evt, editor) => (editorRef.current = editor)}
                initialValue={editData.content}
                init={{
                  height: '100%',
                  menubar: true,
                  plugins: "lists link image code media table",
                  toolbar:
                    "undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | image media table code",
                  images_upload_url: "/upload-image",
                  automatic_uploads: true,
                }}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              onClick={() => setEditModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={handleEditSave}
            >
              Save Changes
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Filter Modals */}
      <Dialog open={createdDateModal} onOpenChange={setCreatedDateModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Filter by Created Date</DialogTitle>
          </DialogHeader>
          <input
            type="date"
            value={filters.createdDate}
            onChange={(e) =>
              setFilters({ ...filters, createdDate: e.target.value })
            }
            className="border rounded-md px-4 py-2 w-full mb-4"
          />
          <div className="flex justify-end gap-3">
            <button
              className="bg-gray-300 px-4 py-2 rounded-md"
              onClick={() => {
                setFilters({ ...filters, createdDate: "" });
                setCreatedDateModal(false);
              }}
            >
              Clear
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={() => {
                applyFilters();
                setCreatedDateModal(false);
              }}
            >
              Apply
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={ownerModal} onOpenChange={setOwnerModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Filter by Owner</DialogTitle>
          </DialogHeader>
          <input
            type="text"
            placeholder="Owner Name"
            value={filters.owner}
            onChange={(e) =>
              setFilters({ ...filters, owner: e.target.value })
            }
            className="border rounded-md px-4 py-2 w-full mb-4"
          />
          <div className="flex justify-end gap-3">
            <button
              className="bg-gray-300 px-4 py-2 rounded-md"
              onClick={() => {
                setFilters({ ...filters, owner: "" });
                setOwnerModal(false);
              }}
            >
              Clear
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={() => {
                applyFilters();
                setOwnerModal(false);
              }}
            >
              Apply
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplateHead;