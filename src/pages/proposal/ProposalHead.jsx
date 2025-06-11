import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios"; // ✅ Import Axios
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProposalHead = () => {
  const [startDate, setStartDate] = useState(null);
  const [proposals, setProposals] = useState([]); // ✅ State for proposals
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openActionId, setOpenActionId] = useState(null); // For action dropdown 

    
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const proposalsPerPage = 10; // You can change this
  const [filterEmail, setFilterEmail] = useState("");
const [filterStatus, setFilterStatus] = useState("");
const [filterCreatedDate, setFilterCreatedDate] = useState("");
const [filterTitle, setFilterTitle] = useState("");
const [filterDealTitle, setFilterDealTitle] = useState("");


const filteredProposals = proposals.filter((proposal) => {
  const search = searchTerm.toLowerCase();

  const matchesSearch =
    proposal.title?.toLowerCase().includes(search) ||
    proposal.email?.toLowerCase().includes(search) ||
    proposal.dealTitle?.toLowerCase().includes(search);

  const matchesFilters =
    (filterEmail === "" || proposal.email?.includes(filterEmail)) &&
    (filterStatus === "" || proposal.status === filterStatus) &&
    (filterCreatedDate === "" ||
      new Date(proposal.createdAt).toLocaleDateString() ===
        new Date(filterCreatedDate).toLocaleDateString()) &&
    (filterTitle === "" || proposal.title?.includes(filterTitle)) &&
    (filterDealTitle === "" || proposal.dealTitle?.includes(filterDealTitle));

  return matchesSearch && matchesFilters;
});
  


  // ✅ Fetch Proposals from API
  const navigate = useNavigate();

  const handleEdit = (proposalId) => {
    const selectedProposal = proposals.find((p) => p._id === proposalId);
    navigate("/proposal/sendproposal", {
      state: { proposal: selectedProposal },
    });
  };
  const location = useLocation(); // You forgot this line
  const proposalData = location.state?.proposal || null;

  useEffect(() => {
    const fetchProposals = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/proposal/getall"
        ); // 🔥 Replace with your API
        setProposals(response.data);
      } catch (err) {
        setError("Failed to load proposals.");
      }
      setLoading(false);
    };
    fetchProposals();
  }, []);
  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/auth/proposal/proposal/updatestatus/${id}`,
        { status: newStatus }
      );

      // ✅ Update local state after successful DB update
      setProposals((prevProposals) =>
        prevProposals.map((proposal) =>
          proposal._id === id ? { ...proposal, status: newStatus } : proposal
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update status.");
    }
  };

  useEffect(() => {
    const fetchProposals = async () => {
      const res = await axios.get(
        "http://localhost:5000/api/auth/proposal/getall"
      );
      setProposals(res.data);
    };
    fetchProposals();
  }, []);

  // ❌ Delete Proposal
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this proposal?"))
      return;
    try {
      await axios.delete(
        `http://localhost:5000/api/auth/proposal/proposal/delete/${id}`
      );
      setProposals((prev) => prev.filter((p) => p._id !== id));
      // alert("✅ Proposal deleted.");
      toast.success(" Proposal deleted.");
    } catch (error) {
      console.error("Delete error:", error);

      // alert("❌ Failed to delete.");
      toast.error(" Failed to delete.");
    }
  };
  // const filteredProposals = proposals.filter((proposal) => {
  //   const search = searchTerm.toLowerCase();
  //   return (
  //     proposal.title?.toLowerCase().includes(search) ||
  //     proposal.email?.toLowerCase().includes(search) ||
  //     proposal.dealTitle?.toLowerCase().includes(search)
  //   );
  // });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex justify-between items-center gap-3">
          <h1 className="text-2xl">Proposal list</h1>
        </div>
        <div className="flex justify-between items-center gap-2">
          <Link to="/proposal">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#1f1f1f"
              className=" h-7 bg-white w-7 text-black"
            >
              <path d="M219-144q-29 0-52-23t-23-52v-525q0-29.7 21.5-50.85Q187-816 216-816h528q29.7 0 50.85 21.15Q816-773.7 816-744v528q0 29-21.15 50.5T744-144H219Zm-3-72h228v-528H216v528Zm300 0h228v-264H516v264Zm0-336h228v-192H516v192Z" />
            </svg>
          </Link>
          <Link to="/stage">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#1f1f1f"
              className=" h-7 bg-gray-300 w-7 text-black"
            >
              <path d="M600-144q-29.7 0-50.85-21.15Q528-186.3 528-216v-528q0-29 21.15-50.5T600-816h144q29 0 50.5 21.5T816-744v528q0 29.7-21.5 50.85Q773-144 744-144H600Zm-384 0q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29 21.15-50.5T216-816h144q29 0 50.5 21.5T432-744v528q0 29.7-21.5 50.85Q389-144 360-144H216Zm0-600v528h144v-528H216Z" />
            </svg>
          </Link>
          <Link to="/proposal/sendproposal">
            <button className="bg-[#4466f2] p-2 px-4 text-white rounded-sm">
              New Proposal
            </button>
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mt-10">
        <div className="flex items-center gap-2">
          <div className="relative"></div>
          {/* Email Filter */}
<input
  type="text"
  placeholder="Filter by Email"
  value={filterEmail}
  onChange={(e) => setFilterEmail(e.target.value)}
  className="px-2 py-2 shadow bg-white rounded-2xl text-sm text-gray-600"
/>

{/* Status Filter */}
<select
  value={filterStatus}
  onChange={(e) => setFilterStatus(e.target.value)}
  className="px-2 py-2 shadow rounded-2xl bg-white text-sm text-gray-600"
>
  <option value="">All Status</option>
  <option value="draft">Draft</option>
  <option value="send">Sent</option>
  <option value="no reply">No Reply</option>
  <option value="rejection">Rejection</option>
  <option value="success">Success</option>
</select>

{/* Created Date Filter */}
<DatePicker
  selected={filterCreatedDate ? new Date(filterCreatedDate) : null}
  onChange={(date) => setFilterCreatedDate(date)}
  dateFormat="yyyy/MM/dd"
  placeholderText="Created Date"
  className="px-2 py-2 shadow bg-white rounded-2xl text-sm text-gray-600"
/>

{/* Title Filter */}
<input
  type="text"
  placeholder="Filter by Title"
  value={filterTitle}
  onChange={(e) => setFilterTitle(e.target.value)}
  className="px-2 py-2 shadow rounded-2xl bg-white text-sm text-gray-600"
/>

{/* Deal Title Filter */}
<input
  type="text"
  placeholder="Filter by Deal Title"
  value={filterDealTitle}
  onChange={(e) => setFilterDealTitle(e.target.value)}
  className="px-2 py-2 shadow bg-white rounded-2xl text-sm text-gray-600"
/>

        </div>

        {/* Search Input */}
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-1.5 pl-10 border rounded-3xl w-[150px] bg-white"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-3 h-3 text-gray-400 absolute left-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
            />
          </svg>
        </div>
      </div>

      {/* Proposals Table */}
      <div className="bg-white p-5 w-full h-screen mt-10">
        <div className="pt-5 px-5">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left pb-5 font-semibold text-gray-400">
                  Title
                </th>
                <th className="text-left pb-5 font-semibold text-gray-400">
                  Deal Title
                </th>
                <th className="text-left pb-5 font-semibold text-gray-400">
                  Email
                </th>
                <th className="text-left pb-5 font-semibold text-gray-400">
                  Status{" "}
                </th>
                <th className="text-left pb-5 font-semibold text-gray-400">
                  Created At
                </th>
                <th className="text-left pb-5 font-semibold text-gray-400">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : proposals.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    No proposals found
                  </td>
                </tr>
              ) : (
                filteredProposals.map((proposal) => (
                  <tr key={proposal._id} className="border-b">
                    <td className="py-2">{proposal.title}</td>
                    <td className="py-2">{proposal.dealTitle}</td>
                    <td className="py-2">{proposal.email}</td>

                    {/* ✅ Added Status */}
                    <td className="py-2">
                      <select
                        value={proposal.status}
                        onChange={(e) =>
                          handleStatusChange(proposal._id, e.target.value)
                        }
                        className={` rounded px-2 py-1
      ${
        proposal.status === "draft"
          ? "bg-orange-100 text-orange-600 border-orange-400"
          : proposal.status === "rejection"
          ? "bg-red-100 text-red-600 border-red-400"
          : proposal.status === "success"
          ? "bg-green-100 text-green-600 border-green-400"
          : proposal.status === "no reply"
          ? "bg-gray-100 text-gray-600 border-gray-400"
          : "bg-blue-100 text-blue-600 border-blue-400"
      }`}
                      >
                        <option value="draft">Draft</option>
                        <option value="send">Sent</option>
                        <option value="no reply">No Reply</option>
                        <option value="rejection">Rejection</option>
                        <option value="success">Success</option>
                      </select>
                    </td>

                    <td className="py-2">
                      {new Date(proposal.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 relative">
                      <button
                        onClick={() =>
                          setOpenActionId(
                            openActionId === proposal._id ? null : proposal._id
                          )
                        }
                        className="text-gray-500"
                      >
                        <BsThreeDotsVertical />
                      </button>

                      {openActionId === proposal._id && (
                        <div className="absolute right-0 mt-2 bg-white border rounded shadow z-10 w-28 text-sm">
                          <div
                            onClick={() => handleEdit(proposal._id)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-blue-600"
                          >
                            Edit
                          </div>
                          <div
                            onClick={() => handleDelete(proposal._id)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
                          >
                            Delete
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProposalHead;

// import React from "react";
// import DatePicker from "react-datepicker";
// import { useState } from "react";
// import { FaCalendarAlt } from "react-icons/fa";
// import { Link } from "react-router-dom";

// const ProposalHead = () => {
//   const [startDate, setStartDate] = useState(null);

//   return (
//     <div>
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl">Proposal list</h1>

//         <div className="items-center flex gap-1 ">
//           <button className=" border p-2 cursor-pointer bg-gray-300">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               height="20px"
//               viewBox="0 -960 960 960"
//               width="20px"
//               fill="#1f1f1f"
//             >
//               <path d="M211-144q-27.64 0-47.32-19.68T144-211v-538q0-27.64 19.68-47.32T211-816h538q27.64 0 47.32 19.68T816-749v538q0 27.64-19.68 47.32T749-144H211Zm413-72h120v-528H624v528Zm-72 0v-528H216v528h336Zm72 0h120-120Z" />
//             </svg>
//           </button>
//           <button className=" border cursor-pointer p-2 bg-white">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               height="20px"
//               viewBox="0 -960 960 960"
//               width="20px"
//               fill="#1f1f1f"
//             >
//               <path d="M600-144q-29.7 0-50.85-21.15Q528-186.3 528-216v-528q0-29 21.15-50.5T600-816h144q29 0 50.5 21.5T816-744v528q0 29.7-21.5 50.85Q773-144 744-144H600Zm-384 0q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29 21.15-50.5T216-816h144q29 0 50.5 21.5T432-744v528q0 29.7-21.5 50.85Q389-144 360-144H216Zm0-600v528h144v-528H216Z" />
//             </svg>
//           </button>
//           <Link to={"/proposal/sendproposal"}>
//             <button className=" bg-[#4466f2] p-2 px-4 text-white cursor-pointer rounded-sm">
//               New Proposal{" "}
//             </button>
//           </Link>{" "}
//         </div>
//       </div>
//       <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mt-10">
//         {/* Filter Buttons Section */}
//         <div className="flex items-center gap-2">
//           {/* Date Picker Button */}
//           <div className="relative">
//             <DatePicker
//               selected={startDate}
//               onChange={(date) => setStartDate(date)}
//               dateFormat="yyyy/MM/dd"
//               className="hidden" //Hide the default input field
//               isOpen={false}
//             />
//             <button
//               className="px-3 py-2 text-gray-400 shadow-2xl bg-white rounded-lg"
//               onClick={() => setStartDate(null)} // Reset date
//             >
//               <FaCalendarAlt className="text-xl" /> {/* Calendar Icon */}
//             </button>
//           </div>
//           {/* Filter Buttons */}
//           <button className="px-7 py-2 shadow-2xl text-gray-400 bg-white rounded-3xl">
//             Owner
//           </button>
//           <button className="px-7 py-2 shadow-2xl text-gray-400 bg-white rounded-3xl">
//             Status
//           </button>
//           <button className="px-7 py-2 shadow-2xl text-gray-400 bg-white rounded-3xl">
//             Created date
//           </button>
//           <button className="px-7 py-2 shadow-2xl text-gray-400 bg-white rounded-3xl">
//             Proposal have deal
//           </button>
//           <button className="px-7 py-2 shadow-2xl text-gray-400 bg-white rounded-3xl">
//             Tags
//           </button>
//           <button className="px-7 py-2 shadow-2xl text-gray-400 bg-white rounded-3xl">
//             Deal value
//           </button>
//         </div>
//         {/* Search Input Section */}
//         <div className="flex items-center">
//           <input
//             type="text"
//             placeholder="Search"
//             className="p-1.5 border rounded-3xl w-[250px] bg-white"
//           />
//         </div>
//       </div>

//         <div className="bg-white p-5 w-full h-screen mt-3">
//              <div className="pt-5 px-5">
//                <table className="w-full p-10">
//                  <thead className="py-10">
//                    <tr>
//                      <td className="text-left pb-5 font-semibold text-gray-400">
//                      title
//                      </td>
//                      <td className="text-left pb-5 font-semibold text-gray-400">
//                      dealTitle
//                      </td>
//                      {/* <td className="text-left pb-5 font-semibold text-gray-400">
//                        Leads
//                      </td> */}
//                      <td className="text-left pb-5 font-semibold text-gray-400">
//                      email
//                      </td>
//                      <td className="text-left  pb-5 font-semibold text-gray-400">
//                      content
//                      </td>
//                      <td className="text-left pb-5 font-semibold text-gray-400">
//                      createdAt
//                      </td>

//                      <td className="text-left pb-5 font-semibold text-gray-400">
//                        Action
//                      </td>
//                    </tr>
//                  </thead>

//                </table>
//              </div>
//            </div>

//     </div>
//   );
// };

// export default ProposalHead;
