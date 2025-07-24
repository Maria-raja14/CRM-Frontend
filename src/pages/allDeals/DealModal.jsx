// import React from "react";
// import { FaExternalLinkAlt } from "react-icons/fa";

// import { Editor } from "@tinymce/tinymce-react";

// const DealModal = ({ deal, onClose }) => {
//   if (!deal) return null;
  
//   const fetchPersons = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/person");
//         console.log("Persons Response:", res.data);
//         setPersons(res.data);
//       } catch (error) {
//         console.error("Error fetching persons:", error);
//       }
//     };

//   return (
//     <>
//       {/* Background Overlay */}
//       <div
//         className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
//         onClick={onClose}
//       ></div>
//       <div
//         className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
//         onClick={onClose}
//       ></div>

//       {/* Modal Container */}
//       <div className="fixed inset-0 flex justify-center items-center z-50">
//         <div className="bg-gray-50 w-[1100px] h-[610px] rounded-lg shadow-lg relative flex flex-col">
//           {/* Header (Fixed) */}
//           <div className="flex justify-between items-center bg-white p-2 w-full h-[100px] sticky top-0 z-10">
//             <div className="flex items-center gap-2">
//               <img
//                 src="https://pipex.gainhq.com/storage/avatar/67d55042862a3.jpg"
//                 alt="Not found"
//                 className="w-10 h-10 rounded-full"
//               />
//               <div>
//                 <h2 className="font-semibold">{deal.owner || "Unknown"}</h2>
//                 <p className="text-sm text-gray-500">
//                 Deal Owner - 2025-03-20 - Age - 0 days 1 hour 43 minutes
//                 </p>
//               </div>
//             </div>
//             <button className="flex items-center bg-blue-500 text-white px-2 shadow-lg py-1.5 rounded ml-[450px]">
//               <FaExternalLinkAlt className="mr-2" /> View details
//             </button>
//             <button
//               onClick={onClose}
//               className="text-gray-500 hover:text-black text-lg"
//             >
//               ✖
//             </button>
//           </div>

//           {/* Scrollable Content (Left Content + Sidebar Scrolls Together) */}
//           <div
//             className="flex flex-grow  overflow-y-auto"
//             style={{ maxHeight: "510px" }}
//           >
//             {/* Left Side - Main Content */}
//             <div className="p-6 w-[850px] ">
//               <h1 className="text-xl font-bold mb-4">
//                 #124 {deal.title}
//                 <span className="bg-blue-500 text-white text-sm px-2 py-1 rounded-4xl ml-2">
//                   Open
//                 </span>
//               </h1>
//               <h6 className="font-semibold mb-6">Description</h6>
//               {/* Description Section */}
//               <div className="bg-white p-10 rounded mb-8">
//                 <p className="text-gray-600">
//                   {deal.description}
//                 </p>
//               </div>

//               {/* Status Update */}
//               <p className="text-gray-500 text-sm mb-4">
//                 <strong className="text-black">Rosey Martin</strong> changed
//                 stage from <strong>Visit Scheduled</strong> to{" "}
//                 <strong>Visit Completed</strong> 25 minutes ago
//               </p>
//               <p className="text-gray-500 text-sm mb-4">
//                 <strong className="text-black">Rosey Martin</strong> changed
//                 stage from <strong>Visit Scheduled</strong> to{" "}
//                 <strong>Visit Completed</strong> 25 minutes ago
//               </p>
//               <p className="text-gray-500 text-sm mb-4">
//                 <strong className="text-black">Rosey Martin</strong> changed
//                 stage from <strong>Visit Scheduled</strong> to{" "}
//                 <strong>Visit Completed</strong> 25 minutes ago
//               </p>

//               {/* Comments Section */}
//               <div className="bg-white p-6 rounded mb-4">
//                 <div className="flex mb-4 items-center gap-3">
//                   <img
//                     src="https://pipex.gainhq.com/storage/avatar/67d55042862a3.jpg"
//                     alt="Not found"
//                     className="w-10 h-10 rounded-full"
//                   />

//                   <p className="text-gray-600">Zehrila aadmi</p>
//                 </div>
//                 <div className="mb-4">
//                   <Editor
//                     apiKey="f4387hl2q3tdy6tmqpbcd0petpv1auib0u15bczuzdp9wvvp"
//                     init={{
//                       height: 200,
//                       menubar: false,
//                       plugins: [
//                         "advlist autolink lists link charmap preview anchor",
//                         "searchreplace visualblocks code fullscreen",
//                         "insertdatetime media table code help wordcount",
//                       ],
//                       toolbar:
//                         "undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | outdent indent | bullist numlist",
//                     }}
//                     onEditorChange={(content) =>
//                       setFormData({ ...formData, description: content })
//                     }
//                   />
//                 </div>
//                 <div className="text-end">
//                   <button className="bg-blue-400 text-white px-4 py-1.5 rounded mt-2 shadow-lg">
//                     Comment
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Right Sidebar (Now Scrolls with Main Content) */}
//             <div
//               className="w-[280px] p-4 overflow-y-auto"
//               style={{ maxHeight: "510px" }}
//             >
//               <div className="mb-8">
//                 <h4 className="font-semibold">Stage</h4>
//                 <p className="text-gray-600">{deal.stage}</p>
//               </div>
//               <div className="mb-8">
//                 <h4 className="font-semibold">Deal Value</h4>
//                 <p className="text-blue-500">${deal.dealsValue}</p>
//               </div>
//               <div className="mb-8">
//                 <h4 className="font-semibold">Lead Type: {deal.leadType}</h4>
//                 <p className="text-gray-600">{deal.personName}</p>
//               </div>
//               <div className="mb-8">
//                 <h4 className="font-semibold">Proposal (0)</h4>
//               </div>
//               <div className="mb-8">
//                 <h4 className="font-semibold">Tags</h4>
//                 <button className="text-blue-500">+ Add</button>
//               </div>
//               <div className="mb-8">
//                 <h4 className="font-semibold">Expected closing date</h4>
//                 <p>{deal.expectingClosingDate}</p>
//               </div>
//               <div className="mb-4">
//                 <h4 className="font-semibold">Followers (0)</h4>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default DealModal;



import React from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { Editor } from "@tinymce/tinymce-react";


const DealModal = ({ deal, onClose }) => {
  if (!deal) return null;

 
  const calculateAge = (createdAt) => {
    if (!createdAt) return "Unknown";

    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffMs = now - createdDate; 

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${days} days ${hours} hours ${minutes} minutes`;
  };

  return (
    <>
      
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div className="bg-gray-50 w-[1100px] h-[610px] rounded-lg shadow-lg relative flex flex-col">
          
          {/* Header */}
          <div className="flex justify-between items-center bg-white p-2 w-full h-[100px] sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <img
                src="https://pipex.gainhq.com/storage/avatar/67d55042862a3.jpg"
                alt="Not found"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h2 className="font-semibold">{deal.owner || "Unknown"}</h2>
                <p className="text-sm text-gray-500">
                  Deal Owner - {deal.createdAt ? new Date(deal.createdAt).toLocaleDateString() : "Unknown"} - Age - {calculateAge(deal.createdAt)}
                </p>
              </div>
            </div>
            <button className="flex items-center bg-blue-500 text-white px-2 shadow-lg py-1.5 rounded ml-[450px]">
              <FaExternalLinkAlt className="mr-2" /> View details
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-black text-lg">
              ✖
            </button>
          </div>

          {/* Modal Content */}
          <div className="flex flex-grow overflow-y-auto" style={{ maxHeight: "510px" }}>
            
            {/* Left Content */}
            <div className="p-6 w-[850px]">
              <h1 className="text-xl font-bold mb-4">
                #124 {deal.title}
                <span className="bg-blue-500 text-white text-sm px-2 py-1 rounded-4xl ml-2">
                  Open
                </span>
              </h1>

              {/* Description */}
              <h6 className="font-semibold mb-6">Description</h6>
              <div className="bg-white p-10 rounded mb-8">
                <p className="text-gray-600">{deal.description}</p>
              </div>

              {/* Comments */}
              <div className="bg-white p-6 rounded mb-4">
                <div className="flex mb-4 items-center gap-3">
                  <img
                    src="https://pipex.gainhq.com/storage/avatar/67d55042862a3.jpg"
                    alt="Not found"
                    className="w-10 h-10 rounded-full"
                  />
                  <p className="text-gray-600">Zehrila aadmi</p>
                </div>
                <div className="mb-4">
                  <Editor
                    apiKey="f4387hl2q3tdy6tmqpbcd0petpv1auib0u15bczuzdp9wvvp"
                    init={{
                      height: 200,
                      menubar: false,
                      plugins: ["advlist autolink lists link charmap preview anchor", "searchreplace visualblocks code fullscreen", "insertdatetime media table code help wordcount"],
                      toolbar: "undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | outdent indent | bullist numlist",
                    }}
                    onEditorChange={(content) => setFormData({ ...formData, description: content })}
                  />
                </div>
                <div className="text-end">
                  <button className="bg-blue-400 text-white px-4 py-1.5 rounded mt-2 shadow-lg">Comment</button>
                </div>
              </div>
            </div> 

            {/* Right Sidebar */}
            <div className="w-[280px] p-4 overflow-y-auto" style={{ maxHeight: "510px" }}>
              <div className="mb-8">
                <h4 className="font-semibold">Stage</h4>
                <p className="text-gray-600">{deal.stage}</p>
              </div>
              <div className="mb-8">
                <h4 className="font-semibold">Deal Value</h4>
                <p className="text-blue-500">${deal.dealsValue}</p>
              </div>
              <div className="mb-8">
                <h4 className="font-semibold">Lead Type:{deal.leadType} </h4>
                <p className="text-gray-600">{deal.leadType}</p>
                
              </div>
              <div className="mb-8">
                <h4 className="font-semibold">Expected Closing Date</h4>
                <p>{deal.expectingClosingDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DealModal;




