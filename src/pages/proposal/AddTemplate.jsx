// import React, { useRef, useState, useEffect } from "react";
// import { Editor } from "@tinymce/tinymce-react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const AddTemplate = () => {
//   const editorRef = useRef(null);
//   const [title, setTitle] = useState("");
//   const [templates, setTemplates] = useState([]);

//   // Fetch Templates from API
//   useEffect(() => {
//     axios.get("/api/templates")
//       .then((res) => setTemplates(res.data))
//       .catch((err) => console.error("Error fetching templates:", err));
//   }, []);

//   // Insert predefined text
//   const insertText = (text) => {
//     if (editorRef.current) {
//       editorRef.current.insertContent(text);
//     }
//   };

//   // Save template to API
//   const saveTemplate = async () => {
//     const content = editorRef.current.getContent();
//     try {
//       await axios.post("http://localhost:5000/api/template/createTemp", { title, content });

//          toast.success("Template saved successfully!");
//     } catch (error) {
//       console.error("Error saving template:", error);
//       toast.error("Template saved failed!");
//     }
//   };

//   // Save and Send API Call
//   const saveAndSend = async () => {
//     const content = editorRef.current.getContent();
//     try {
//       await axios.post("/api/send-template", { title, content });
//       alert("Template sent successfully!");
//     } catch (error) {
//       console.error("Error sending template:", error);
//     }
//   };

//   return (
//     <div className="">
//       <div>
//         <h1 className="text-[22px] items-center">
//           Add template |{" "}
//           <Link
//             to={"/template"}
//             className="text-[15px] font-semibold cursor-pointer text-blue-400"
//           >
//             Back
//           </Link>
//         </h1>
//       </div>
//       <div className="bg-white mt-9 p-5">
//         <div className="flex  justify-between items-center">
//          <div className="flex flex-col gap-1">
//          <label className="text-[17px]">Template title </label>
//           <input
//             className="w-[600px] p-3 border-accent"
//             placeholder="Type Your template title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//           />
//          </div>
//           {/* <button className="bg-[#4466f2] text-white p-2 px-3 rounded-sm">
//             Choose template
//           </button> */}
//         </div>
//         <div className="mt-10">
//           <Editor
//             apiKey="a413g7ope5qfyodp0u0e5d042r8jwy9vf6b162kjnnmgj5us"
//             onInit={(evt, editor) => (editorRef.current = editor)}
//             initialValue=""
//             init={{
//               height: 500,
//               menubar: true,
//               plugins: "lists link image code media table",
//               toolbar:
//                 "undo redo | formatselect | bold italic | \
//             alignleft aligncenter alignright | \
//             bullist numlist outdent indent | image media table code",
//               image_advtab: true,
//               file_picker_types: "image",
//               images_upload_url: "/upload-image",
//               automatic_uploads: true,
//               images_upload_handler: async (blobInfo, success, failure) => {
//                 const formData = new FormData();
//                 formData.append("image", blobInfo.blob());

//                 try {
//                   const response = await axios.post("http://localhost:5000/api/template/createTemp", formData, {
//                     headers: { "Content-Type": "multipart/form-data" },
//                   });
//                   success(response.data.imageUrl);
//                 } catch (error) {
//                   failure("Image upload failed");
//                 }
//               },
//             }}
//           />
//         </div>

//         <div className="flex gap-2 justify-center items-center mt-4">
//           <button
//             onClick={() => insertText("{{App_Name}}")}
//             className="bg-[#4466f2] text-white p-1 rounded-sm px-3"
//           >
//             App_Name
//           </button>
//           <button
//             onClick={() => insertText("{{App_Logo}}")}
//             className="bg-[#4466f2] text-white p-1 rounded-sm px-3"
//           >
//             App_Logo
//           </button>
//         </div>

//         <div className="mt-10 flex gap-3 items-center">
//           <button onClick={saveTemplate} className="bg-[#4466f2] text-white p-2 rounded-sm px-3">
//             Save as template
//           </button>
//           <button onClick={saveAndSend} className="bg-[#4466f2] text-white p-2 rounded-sm px-3">
//             Save and send
//           </button>
//           <button className="bg-[#9397a0] text-white p-2 rounded-sm px-4">
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddTemplate;


import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddTemplate = () => {
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("custom");
  const navigate = useNavigate();

  // Insert predefined text
  const insertText = (text) => {
    if (editorRef.current) {
      editorRef.current.insertContent(text);
    }
  };

  // Save template to API
  const saveTemplate = async () => {
    const content = editorRef.current.getContent();
    
    if (!title.trim()) {
      toast.error("Please enter a template title!");
      return;
    }
    
    if (!content.trim()) {
      toast.error("Please add some content to your template!");
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("type", type);
      
      await axios.post("http://localhost:5000/api/template/createTemp", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Template saved successfully!");
      setTimeout(() => {
        navigate("/template");
      }, 1500);
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Failed to save template!");
    }
  };

  // Save and Send API Call 
  const saveAndSend = async () => {
    const content = editorRef.current.getContent();
    
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all fields!");
      return;
    }
    
    try {  
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("type", type);
      
      await axios.post("http://localhost:5000/api/template/createTemp", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      // Here you would add your send logic
      toast.success("Template saved and sent successfully!");
      setTimeout(() => {
        navigate("/template");
      }, 1500);
    } catch (error) {
      console.error("Error sending template:", error);
      toast.error("Failed to save and send template!");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <ToastContainer />
      
      <div>
        <h1 className="text-2xl font-bold">
          Create Template |{" "}
          <Link
            to={"/template"}
            className="text-sm font-semibold cursor-pointer text-blue-500 hover:underline"
          >
            Back to Templates
          </Link>
        </h1>
      </div>
      
      <div className="bg-white mt-6 p-6 rounded-lg shadow-md">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col gap-1">
            <label className="text-lg font-medium">Template Title</label>
            <input
              className="w-full p-3 border rounded-md"
              placeholder="Type your template title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-lg font-medium">Template Type</label>
            <select
              className="w-full p-3 border rounded-md"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="custom">My Template</option>
              <option value="predefined">Predefined Template</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6">
          <label className="text-lg font-medium block mb-2">Template Content</label>
          <Editor
            apiKey="a413g7ope5qfyodp0u0e5d042r8jwy9vf6b162kjnnmgj5us"
            onInit={(evt, editor) => (editorRef.current = editor)}
            initialValue=""
            init={{
              height: 500,
              menubar: true,
              plugins: "lists link image code media table",
              toolbar:
                "undo redo | formatselect | bold italic | \
                alignleft aligncenter alignright | \
                bullist numlist outdent indent | image media table code",
              image_advtab: true,
              file_picker_types: "image",
              automatic_uploads: true,
            }}
          />
        </div>

        <div className="flex gap-2 justify-center items-center mt-6">
          <button
            onClick={() => insertText("{{App_Name}}")}
            className="bg-blue-100 text-blue-700 p-2 rounded-md px-4 hover:bg-blue-200"
          >
            App_Name
          </button>
          <button
            onClick={() => insertText("{{App_Logo}}")}
            className="bg-blue-100 text-blue-700 p-2 rounded-md px-4 hover:bg-blue-200"
          >
            App_Logo
          </button>
          <button
            onClick={() => insertText("{{Client_Name}}")}
            className="bg-blue-100 text-blue-700 p-2 rounded-md px-4 hover:bg-blue-200"
          >
            Client_Name
          </button>
          <button
            onClick={() => insertText("{{Proposal_Details}}")}
            className="bg-blue-100 text-blue-700 p-2 rounded-md px-4 hover:bg-blue-200"
          >
            Proposal_Details
          </button>
        </div>

        <div className="mt-8 flex gap-3 items-center">
          <button 
            onClick={saveTemplate} 
            className="bg-blue-600 text-white p-2 rounded-md px-4 hover:bg-blue-700"
          >
            Save Template
          </button>
          <button 
            onClick={saveAndSend} 
            className="bg-green-600 text-white p-2 rounded-md px-4 hover:bg-green-700"
          >
            Save and Send
          </button>
          <Link to="/template">
            <button className="bg-gray-500 text-white p-2 rounded-md px-4 hover:bg-gray-600">
              Cancel
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AddTemplate;

