// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "axios";

// const ViewProposal = () => {
//   const { id } = useParams();
//   const [proposal, setProposal] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProposal = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/api/proposal/${id}`);
//         setProposal(res.data);
//       } catch (err) {
//         console.error("Failed to fetch proposal:", err);
//       }
//       setLoading(false);
//     };
//     fetchProposal();
//   }, [id]);

//   if (loading) return <div className="p-6">Loading...</div>;
//   if (!proposal) return <div className="p-6 text-red-500">Proposal not found</div>;

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <div className="flex justify-between mb-4">
//         <h1 className="text-2xl font-bold">{proposal.title}</h1>
//         <Link to="/proposal" className="text-blue-600 underline">← Back</Link>
//       </div>

//       <div className="space-y-3 bg-white p-4 rounded shadow">
//         <p><strong>Deal Title:</strong> {proposal.dealTitle}</p>
//         <p><strong>Email:</strong> {proposal.email}</p>
//         <p><strong>Status:</strong> {proposal.status}</p>
//         <p><strong>Created At:</strong> {new Date(proposal.createdAt).toLocaleString()}</p>
//         <p><strong>Follow Up Date:</strong> 
//           {proposal.followUpDate ? new Date(proposal.followUpDate).toLocaleString() : "N/A"}
//         </p>
//         <div>
//           <strong>Content:</strong>
//           <div
//             className="border p-3 mt-2 rounded"
//             dangerouslySetInnerHTML={{ __html: proposal.content }}
//           />
//         </div>
//         {proposal.image && (
//           <div className="mt-4">
//             <strong>Attachment:</strong>
//             <div className="mt-2">
//               <a
//                 href={`http://localhost:5000/${proposal.image}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-600 underline"
//               >
//                 View File
//               </a>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ViewProposal;


import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const ViewProposal = () => {
  const { id } = useParams();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/proposal/${id}`);
        setProposal(res.data);
      } catch (err) {
        console.error("Failed to fetch proposal:", err);
      }
      setLoading(false);
    };
    fetchProposal();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!proposal) return <div className="p-6 text-red-500">Proposal not found</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{proposal.title}</h1>
        <Link to="/proposal" className="text-blue-600 hover:underline">
          ← Back
        </Link>
      </div>

      {/* Card */}
      <div className="space-y-4 bg-white p-6 rounded-2xl shadow">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
          <p><span className="font-semibold">Deal Title:</span> {proposal.dealTitle}</p>
          <p><span className="font-semibold">Email:</span> {proposal.email}</p>
          <p><span className="font-semibold">Status:</span> 
            <span className={`ml-2 px-2 py-1 rounded text-xs ${
              proposal.status === "success" ? "bg-green-100 text-green-700" :
              proposal.status === "rejection" ? "bg-red-100 text-red-700" :
              "bg-yellow-100 text-yellow-700"
            }`}>
              {proposal.status}
            </span>
          </p>
          <p><span className="font-semibold">Created At:</span> {new Date(proposal.createdAt).toLocaleString()}</p>
          <p><span className="font-semibold">Follow Up Date:</span> 
            {proposal.followUpDate ? new Date(proposal.followUpDate).toLocaleString() : "N/A"}
          </p>
        </div>

        {/* Content */}
        <div>
          <h2 className="font-semibold text-gray-800 mb-2">Content</h2>
          <div
            className="border border-gray-200 p-3 rounded bg-gray-50 text-sm text-gray-700"
            dangerouslySetInnerHTML={{ __html: proposal.content }}
          />
        </div>

        {/* Attachments */}
        {proposal.attachments && proposal.attachments.length > 0 && (
          <div>
            <h2 className="font-semibold text-gray-800 mb-2">Attachments</h2>
            <ul className="space-y-2">
              {proposal.attachments.map((file, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded border border-gray-200"
                >
                  <span className="text-sm text-gray-700 truncate">{file.filename}</span>
                  <a
                    href={`http://localhost:5000/${file.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm font-medium hover:underline"
                  >
                    View
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewProposal;
