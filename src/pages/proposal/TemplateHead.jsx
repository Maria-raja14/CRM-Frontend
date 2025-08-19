import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Search, Eye, Pencil, Trash2, X } from "lucide-react";
import { Editor } from "@tinymce/tinymce-react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TemplateHead = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  
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
  // useEffect(() => {
  //   axios
  //     .get("http://localhost:5000/api/auth/template/readTemp")
  //     .then((response) => setTemplates(response.data))
  //     .catch((error) => console.error("Error fetching templates:", error));
  // }, []);

  // Delete template
  const handleDelete = async (_id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/auth/template/deleteTemp/${_id}`
      );
      setTemplates(templates.filter((template) => template._id !== _id));
      toast.success(" Template Deleted successfully!");
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error(" Template Deleted faild!");
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

  // Handle Edit Save
  const handleEditSave = async () => {
    if (!selectedTemplate) return;

    try {
      const updatedContent = editorRef.current
        ? editorRef.current.getContent()
        : editData.content;
      const response = await axios.put(
        `http://localhost:5000/api/auth/template/updateTemp/${selectedTemplate._id}`,
        { ...editData, content: updatedContent }
      );

      setTemplates(
        templates.map((template) =>
          template._id === selectedTemplate._id
            ? { ...template, ...response.data }
            : template
        )
      );

      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating template:", error);
    }
  };

  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl">Templates</h1>
        <Link to="/template/addtemp">
          <button className="bg-[#4466f2] text-white shadow-2xl p-2 px-3 rounded-sm cursor-pointer">
            Add Template
          </button>
        </Link>
      </div>

      {/* Filter and Search Section */}
      <div className="flex justify-between items-center mt-8">
        <div className="flex gap-3 mt-5">
          <button
            className="px-6 py-2 shadow-2xl text-gray-400 bg-white rounded-3xl"
            onClick={() => setCreatedDateModal(true)}
          >
            Created Date
          </button>
          <button
            className="px-6 py-2 shadow-2xl text-gray-400 bg-white rounded-3xl"
            onClick={() => setOwnerModal(true)}
          >
            Owner
          </button>
        </div>

        <div className="flex items-center border rounded-3xl w-[170px] bg-white px-2">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            className="p-1.5 outline-none w-full bg-transparent"
          />
        </div>
      </div>

      {/* Templates List */}
      <div className="grid grid-cols-3 gap-5 mt-8">
        {templates.map((template) => (
          <div
            key={template._id}
            className="relative bg-white rounded-lg shadow-lg  h-[400px] cursor-pointer transition hover:shadow-xl flex flex-col justify-between overflow-hidden " // Ensure full size
          >
            {/* Cover Image */}
            <div className="relative w-full h-full overflow-hidden">
              <img
                src="data:image/jpeg;base64,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"
                alt=""
                className="w-full h-full object-cover"
              />

              {/* Hover Overlay with Icons */}
              <div className="absolute inset-0  bg-opacity-40 flex flex-col justify-center items-center gap-3 opacity-0 hover:opacity-100 transition">
                <button
                  className="text-black  p-2 rounded-full"
                  onClick={() => openPreviewModal(template)}
                >
                  <Eye size={20} />
                </button>
                <button
                  className="text-black  p-2 rounded-full"
                  onClick={() => openEditModal(template)}
                >
                  <Pencil size={20} />
                </button>
                <button
                  className="text-black  p-2 rounded-full"
                  onClick={() => handleDelete(template._id)}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <h2 className="text-lg font-semibold text-gray-400 text-center p-3">
              {template.title}
            </h2>
            {/* Template Title */}
          </div>
        ))}
      </div>

      {previewModalOpen && selectedTemplate && (
        <div className="fixed inset-0 flex items-center justify-center bg-background bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[800px] h-[600px] flex flex-col">
            {/* Modal Header */}
            <div className="flex  items-center  justify-between">
              <h3 className="text-lg font-bold mt-4">
                {selectedTemplate.title}
              </h3>
              <X
                className="cursor-pointer"
                onClick={() => setPreviewModalOpen(false)}
              />
            </div>

            {/* Template Title */}

            {/* Template Content */}
            <div className="mt-4 border p-4 rounded bg-gray-100 min-h-[300px] overflow-auto">
              <div
                dangerouslySetInnerHTML={{ __html: selectedTemplate.content }}
              />
            </div>

            {/* Close Button */}
            <button
              className="mt-4 bg-gray-500 text-white w-fit items-end px-4 py-2 rounded"
              onClick={() => setPreviewModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {createdDateModal && (
        <div className="fixed inset-0 bg-transparent bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px] shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filter by Created Date</h2>
              <X
                className="cursor-pointer"
                onClick={() => setCreatedDateModal(false)}
              />
            </div>
            <input
              type="text"
              placeholder="MM/DD/YYYY"
              value={filters.createdDate}
              onChange={(e) =>
                setFilters({ ...filters, createdDate: e.target.value })
              }
              className="border rounded px-4 py-2 w-full mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => {
                  setFilters({ ...filters, createdDate: "" });
                  setFilteredTemplates(templates);
                  setCreatedDateModal(false);
                }}
              >
                Clear
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  const filtered = templates.filter((t) =>
                    new Date(t.createdAt)
                      .toLocaleDateString()
                      .includes(filters.createdDate)
                  );
                  setFilteredTemplates(filtered);
                  setCreatedDateModal(false);
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {ownerModal && (
        <div className="fixed inset-0 bg-transparent bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px] shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filter by Owner</h2>
              <X
                className="cursor-pointer"
                onClick={() => setOwnerModal(false)}
              />
            </div>
            <input
              type="text"
              placeholder="Owner Name"
              value={filters.owner}
              onChange={(e) =>
                setFilters({ ...filters, owner: e.target.value })
              }
              className="border rounded px-4 py-2 w-full mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => {
                  setFilters({ ...filters, owner: "" });
                  setFilteredTemplates(templates);
                  setOwnerModal(false);
                }}
              >
                Clear
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  const filtered = templates.filter((t) =>
                    t.owner?.toLowerCase().includes(filters.owner.toLowerCase())
                  );
                  setFilteredTemplates(filtered);
                  setOwnerModal(false);
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 flex  items-center  justify-center bg-background bg-opacity-50">
          <div className="bg-white p-7 rounded-lg shadow-xl w-[1000px] h-screen gap-5 flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{editData.title}</h2>
              <X
                className="cursor-pointer"
                onClick={() => setEditModalOpen(false)}
              />
            </div>
            <input
              type="text"
              className="mt-4 w-full p-2 border rounded"
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
              placeholder="Title"
            />
            <div className="mt-4">
              <Editor
                apiKey="a413g7ope5qfyodp0u0e5d042r8jwy9vf6b162kjnnmgj5us"
                onInit={(evt, editor) => (editorRef.current = editor)}
                initialValue={editData.content}
                init={{
                  height: 300,
                  menubar: true,
                  plugins: "lists link image code media table",
                  toolbar:
                    "undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | image media table code",
                  images_upload_url: "/upload-image",
                  automatic_uploads: true,
                }}
              />
            </div>
            <button
              className="mt-24 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleEditSave}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateHead;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Search, Eye, Pencil, Trash2 } from "lucide-react";

// const TemplateHead = () => {
//   const [selectedCard, setSelectedCard] = useState(null);
//   const [templates, setTemplates] = useState([]);

//   // Fetch templates from API
//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/api/auth/template/readTemp") // Change to your backend URL
//       .then((response) => {
//         setTemplates(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching templates:", error);
//       });
//   }, []);

//   // Delete template
//   const handleDelete = async (_id) => {
//     console.log("Deleting template with ID:", _id); // Debugging
//     if (!_id) {
//       console.error("Template ID is undefined!");
//       return;
//     }

//     try {
//       await axios.delete(
//         `http://localhost:5000/api/auth/template/deleteTemp/${_id}`
//       );
//       setTemplates(templates.filter((template) => template._id !== _id));
//     } catch (error) {
//       console.error("Error deleting template:", error);
//     }
//   };

//   // Update template (example: editing title)
//   const handleEdit = async (id, newTitle) => {
//     try {
//       const response = await axios.put(
//         `http://localhost:5000/api/auth/template//updateTemp/${id}`,
//         {
//           title: newTitle,
//         }
//       );

//       setTemplates(
//         templates.map((template) =>
//           template.id === id
//             ? { ...template, title: response.data.title }
//             : template
//         )
//       );
//     } catch (error) {
//       console.error("Error updating template:", error);
//     }
//   };

//   return (
//     <div>
//       {/* Header Section */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl">Templates</h1>
//         <button className="bg-[#4466f2] text-white shadow-2xl p-2 px-3 rounded-sm cursor-pointer">
//           Add template
//         </button>
//       </div>

//       {/* Filter and Search Section */}
//       <div className="flex justify-between items-center mt-8">
//         <div className="flex gap-3">
//           <button className="px-6 py-2 shadow-2xl text-gray-400 bg-white rounded-3xl">
//             Created date
//           </button>
//           <button className="px-6 py-2 shadow-2xl text-gray-400 bg-white rounded-3xl">
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

//       {/* Templates List with Image Cover */}
//       <div className="grid grid-cols-3 h-[400px] gap-5 mt-8">
//         {templates.map((template) => (
//           <div
//             key={template._id} // FIXED: Use `_id`
//             className="relative bg-white rounded-lg shadow-lg cursor-pointer transition hover:shadow-xl min-h-[400px]"
//             onClick={() =>
//               setSelectedCard(
//                 selectedCard === template._id ? null : template._id
//               )
//             }
//           >
//             <h2 className="text-lg font-semibold">{template.title}</h2>
//             {selectedCard === template._id && (
//               <div className="absolute top-2 right-2 flex gap-2 bg-gray-100 p-2 rounded-md shadow-md">
//                 <button
//                   className="text-red-500"
//                   onClick={() => handleDelete(template._id)}
//                 >
//                   <Trash2 size={20} />
//                 </button>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TemplateHead;

// import React from "react";
// import { Search } from "lucide-react";
// import { Editor } from "@tinymce/tinymce-react";

// const TemplateHead = () => {
//   return (
//     <div>
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl">Templates</h1>
//         <button className="bg-[#4466f2] text-white shadow-2xl p-2 px-3 rounded-sm cursor-pointer">
//           Add template
//         </button>
//       </div>
//       <div className="flex justify-between  items-center mt-8">
//         <div className="flex gap-3">
//           <button className="px-6 py-2 shadow-2xl text-gray-400 bg-white rounded-3xl">
//             Created date
//           </button>
//           <button className="px-6 py-2 shadow-2xl text-gray-400 bg-white rounded-3xl">
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
//     </div>
//   );
// };

// export default TemplateHead;
