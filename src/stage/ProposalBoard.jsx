import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const ProposalBoard = () => {
  const [startDate, setStartDate] = useState(null);
  const [groupedStages, setGroupedStages] = useState({});

  const fetchProposals = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/auth/proposal/getall"
      );
      const proposals = res.data;

      // Group by status
      const grouped = proposals.reduce((acc, proposal) => {
        const key = proposal.status || "Uncategorized";
        if (!acc[key]) acc[key] = [];
        acc[key].push(proposal);
        return acc;
      }, {});

      setGroupedStages(grouped);
    } catch (err) {
      console.error("Error fetching proposals:", err);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const handleOnDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    const sourceItems = Array.from(groupedStages[sourceCol]);
    const [movedItem] = sourceItems.splice(source.index, 1);

    if (sourceCol === destCol) {
      // Move within same column
      sourceItems.splice(destination.index, 0, movedItem);
      setGroupedStages((prev) => ({
        ...prev,
        [sourceCol]: sourceItems,
      }));
    } else {
      // Move to another column
      const destItems = Array.from(groupedStages[destCol] || []);
      movedItem.status = destCol;
      destItems.splice(destination.index, 0, movedItem);

      setGroupedStages((prev) => ({
        ...prev,
        [sourceCol]: sourceItems,
        [destCol]: destItems,
      }));

      // Optionally save updated proposal status to backend
      axios.put(
        `http://localhost:5000/api/auth/proposal/proposal/updatestatus/${movedItem._id}`,
        {
          status: destCol,
        }
      );
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Proposal Board</h1>
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

      {/* Filters */}
      <div className="flex flex-wrap justify-between items-center gap-4 mt-6">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy/MM/dd"
              className="hidden"
              isOpen={false}
            />
            <button
              className="px-3 py-2 text-gray-400 bg-white shadow rounded"
              onClick={() => setStartDate(null)}
            >
              <FaCalendarAlt className="text-xl" />
            </button>
          </div>
          <button className="px-6 py-2 bg-white shadow rounded-3xl text-gray-500">
            Owner
          </button>
          <button className="px-6 py-2 bg-white shadow rounded-3xl text-gray-500">
            Status
          </button>
          <button className="px-6 py-2 bg-white shadow rounded-3xl text-gray-500">
            Has Deal
          </button>
          <button className="px-6 py-2 bg-white shadow rounded-3xl text-gray-500">
            Tags
          </button>
        </div>

        <input
          type="text"
          placeholder="Search"
          className="p-2 border rounded-3xl w-[250px] bg-white"
        />
      </div>

      {/* Columns */}
      <div className="mt-8">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3  lg:grid-cols-5 gap-6">
            {Object.entries(groupedStages).map(([status, proposals]) => (
              <Droppable droppableId={status} key={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-white border border-gray-200 rounded-2xl w-[250px] shadow p-4 flex flex-col max-h-[600px]"
                  >
                    {/* Header */}
                    <div className="flex gap-5 justify-between items-center mb-4 border-b pb-2">
                      <h2 className="text-lg font-semibold text-gray-800">
                        {status}
                      </h2>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {proposals.length}
                      </span>
                    </div>

                    {/* Draggable items list */}
                    <div className="space-y-4 overflow-y-auto">
                      {proposals.map((proposal, index) => (
                        <Draggable
                          key={proposal._id}
                          draggableId={proposal._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-gray-50 hover:bg-gray-100 p-4 rounded-xl border border-gray-200 shadow-sm transition-all"
                            >
                              <h3 className="font-semibold text-gray-800">
                                {proposal.title}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {proposal.dealTitle}
                              </p>
                              <p className="text-sm text-gray-400">
                                {proposal.email}
                              </p>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default ProposalBoard;

// import React, { useState, useEffect } from "react";
// import DatePicker from "react-datepicker";
// import { FaCalendarAlt } from "react-icons/fa";
// import { Link } from "react-router-dom";
// import axios from "axios"; // ✅ Import Axios
// import { BsThreeDotsVertical } from "react-icons/bs";
// import { useNavigate } from "react-router-dom";
// import { useLocation } from "react-router-dom";
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// const ProposalBoard = () => {
//   const [startDate, setStartDate] = useState(null);
//   const [stages, setStages] = useState([
//     { id: '1', title: 'Draft' },
//     { id: '2', title: 'Sent' },
//     { id: '3', title: 'Accept' },
//     { id: '4', title: 'Reject' },
//     { id: '5', title: 'No reply' },
//   ]);

//   const handleOnDragEnd = (result) => {
//     if (!result.destination) return;

//     const items = Array.from(stages);
//     const [reorderedItem] = items.splice(result.source.index, 1);
//     items.splice(result.destination.index, 0, reorderedItem);

//     setStages(items);
//   };
//   return (
//     <div>
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl">Proposal list</h1>
//         <div className="items-center flex gap-1">
//           <Link to={"/proposal/sendproposal"}>
//             <button className="bg-[#4466f2] p-2 px-4 text-white cursor-pointer rounded-sm">
//               New Proposal
//             </button>
//           </Link>
//         </div>
//       </div>

//       <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mt-10">
//         <div className="flex items-center gap-2">
//           <div className="relative">
//             <DatePicker
//               selected={startDate}
//               onChange={(date) => setStartDate(date)}
//               dateFormat="yyyy/MM/dd"
//               className="hidden"
//               isOpen={false}
//             />
//             <button
//               className="px-3 py-2 text-gray-400 shadow-2xl bg-white rounded-lg"
//               onClick={() => setStartDate(null)}
//             >
//               <FaCalendarAlt className="text-xl" />
//             </button>
//           </div>
//           <button className="px-7 py-2 shadow-2xl text-gray-400 bg-white rounded-3xl">
//             Owner
//           </button>
//           <button className="px-7 py-2 shadow-2xl text-gray-400 bg-white rounded-3xl">
//             Status
//           </button>
//           <button className="px-7 py-2 shadow-2xl text-gray-400 bg-white rounded-3xl">
//             Proposal have deal
//           </button>
//           <button className="px-7 py-2 shadow-2xl text-gray-400 bg-white rounded-3xl">
//             Tages
//           </button>
//         </div>

//         {/* Search Input */}
//         <div className="flex items-center">
//           <input
//             type="text"
//             placeholder="Search"
//             className="p-1.5 border rounded-3xl w-[250px] bg-white"
//           />
//         </div>
//       </div>
//       <div className="bg-white mt-6 w-fit p-4">
//   {/* Horizontal Scrollable Wrapper */}
//   <div className="overflow-x-auto">
//     <DragDropContext onDragEnd={handleOnDragEnd}>
//       <Droppable droppableId="stages" direction="">
//         {(provided) => (
//           <div
//             className="flex flex-row w-fit whitespace-nowrap space-x-4"
//             {...provided.droppableProps}
//             ref={provided.innerRef}
//           >
//             {stages.map((stage, index) => (
//               <Draggable key={stage.id} draggableId={stage.id} index={index}>
//                 {(provided) => (
//                   <div
//                     className="min-w-[300px] bg-gray-100 p-4 rounded shadow"
//                     ref={provided.innerRef}
//                     {...provided.draggableProps}
//                     {...provided.dragHandleProps}
//                   >
//                     <h1>{stage.title}</h1>
//                   </div>
//                 )}
//               </Draggable>
//             ))}
//             {provided.placeholder}
//           </div>
//         )}
//       </Droppable>
//     </DragDropContext>
//   </div>
// </div>

//     </div>
//   );
// };

// export default ProposalBoard;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// const ProposalBoard = () => {
//   const [stages, setStages] = useState([]);

//   useEffect(() => {
//     fetchStages();
//   }, []);

//   const fetchStages = async () => {
//     try {
//       const res = await axios.get(`http://localhost:5000/api/auth/stage`);
//       setStages(res.data);
//     } catch (error) {
//       console.error("Failed to fetch stages", error);
//     }
//   };

//   const handleDragEnd = async (result) => {
//     const { source, destination, draggableId } = result;
//     if (!destination) return;

//     if (source.droppableId !== destination.droppableId) {
//       try {
//         await axios.put(`http://localhost:5000/api/auth/stage/move`, {
//           proposalId: draggableId,
//           fromStageId: source.droppableId,
//           toStageId: destination.droppableId,
//         });
//         fetchStages();
//       } catch (error) {
//         console.error("Failed to move proposal", error);
//       }
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
//         Proposal Management Board
//       </h1>
//       <DragDropContext onDragEnd={handleDragEnd}>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {stages.map((stage) => (
//             <Droppable droppableId={stage._id.toString()} key={stage._id}>
//               {(provided) => (
//                 <div
//                   className="bg-white rounded-xl shadow-md p-4"
//                   ref={provided.innerRef}
//                   {...provided.droppableProps}
//                 >
//                   <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">
//                     {stage.name}
//                   </h2>
//                   {stage.proposals?.map((proposal, index) => (
//                     <Draggable
//                       key={proposal._id}
//                       draggableId={proposal._id.toString()}
//                       index={index}
//                     >
//                       {(provided) => (
//                         <div
//                           className="bg-blue-50 border border-blue-300 p-3 rounded-md mb-3 shadow-sm hover:bg-blue-100 transition"
//                           ref={provided.innerRef}
//                           {...provided.draggableProps}
//                           {...provided.dragHandleProps}
//                         >
//                           <div className="font-medium text-blue-900">
//                             {proposal.title}
//                           </div>
//                           <div className="text-sm text-gray-600">
//                             {proposal.dealTitle}
//                           </div>
//                         </div>
//                       )}
//                     </Draggable>
//                   ))}
//                   {provided.placeholder}
//                 </div>
//               )}
//             </Droppable>
//           ))}
//         </div>
//       </DragDropContext>
//     </div>
//   );
// };

// export default ProposalBoard;

// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// // const ProposalBoard = () => {
// //   const [stages, setStages] = useState([]);

// //   useEffect(() => {
// //     fetchStages();
// //   }, []);

// //   const fetchStages = async () => {
// //     try {
// //       const res = await axios.get(
// //         `http://localhost:5000/api/auth/proposal/getall`
// //       );
// //       setStages(res.data);
// //     } catch (error) {
// //       console.error("Failed to fetch stages", error);
// //     }
// //   };

// //   const handleDragEnd = async (result) => {
// //     const { source, destination, draggableId } = result;
// //     if (!destination) return;

// //     if (source.droppableId !== destination.droppableId) {
// //       try {
// //         await axios.put(`zhttp://localhost:5000/api/auth/stage/move`, {
// //           proposalId: draggableId,
// //           fromStageId: source.droppableId,
// //           toStageId: destination.droppableId,
// //         });
// //         fetchStages();
// //       } catch (error) {
// //         console.error("Failed to move proposal", error);
// //       }
// //     }
// //   };

// //   return (
// //     <div className="p-6 bg-gray-100 min-h-screen">
// //       <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
// //         Proposal Management Board
// //       </h1>
// //       <DragDropContext onDragEnd={handleDragEnd}>
// //         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
// //           {stages.map((stage) => (
// //             <Droppable droppableId={stage._id} key={stage._id}>
// //               {(provided) => (
// //                 <div
// //                   className="bg-white rounded-xl shadow-md p-4"
// //                   ref={provided.innerRef}
// //                   {...provided.droppableProps}
// //                 >
// //                   <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">
// //                     {stage.name}
// //                   </h2>
// //                   {Array.isArray(stage.proposals) &&
// //                     stage.proposals.map((proposal, index) => (
// //                       <Draggable
// //                         key={proposal._id}
// //                         draggableId={proposal._id}
// //                         index={index}
// //                       >
// //                         {(provided) => (
// //                           <div
// //                             className="bg-blue-50 border border-blue-300 p-3 rounded-md mb-3 shadow-sm hover:bg-blue-100 transition"
// //                             ref={provided.innerRef}
// //                             {...provided.draggableProps}
// //                             {...provided.dragHandleProps}
// //                           >
// //                             <div className="font-medium text-blue-900">
// //                               {proposal.title}
// //                             </div>
// //                             <div className="text-sm text-gray-600">
// //                               {proposal.dealTitle}
// //                             </div>
// //                           </div>
// //                         )}
// //                       </Draggable>
// //                     ))}
// //                   {provided.placeholder}
// //                 </div>
// //               )}
// //             </Droppable>
// //           ))}
// //         </div>
// //       </DragDropContext>
// //     </div>
// //   );
// // };

// // export default ProposalBoard;

// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// // const ProposalBoard = () => {
// //     const [stages, setStages] = useState([]);

// //     useEffect(() => {
// //       fetchStages();
// //     }, []);

// //     const fetchStages = async () => {
// //       try {
// //         const res = await axios.get(`http://localhost:5000/api/auth/stage`);
// //         setStages(res.data);
// //       } catch (error) {
// //         console.error("Failed to fetch stages", error);
// //       }
// //     };

// //     const handleDragEnd = async (result) => {
// //       const { source, destination, draggableId } = result;
// //       if (!destination) return;

// //       if (source.droppableId === destination.droppableId && source.index === destination.index) {
// //         return; // No movement
// //       }

// //       const sourceStageIndex = stages.findIndex((stage) => stage._id === source.droppableId);
// //       const destStageIndex = stages.findIndex((stage) => stage._id === destination.droppableId);

// //       const sourceStage = stages[sourceStageIndex];
// //       const destStage = stages[destStageIndex];

// //       const draggedProposal = sourceStage.proposals[source.index];

// //       // Remove from source
// //       const updatedSourceProposals = [...sourceStage.proposals];
// //       updatedSourceProposals.splice(source.index, 1);

// //       // Add to destination
// //       const updatedDestProposals = [...destStage.proposals];
// //       updatedDestProposals.splice(destination.index, 0, draggedProposal);

// //       // Create new stages array
// //       const updatedStages = [...stages];
// //       updatedStages[sourceStageIndex] = { ...sourceStage, proposals: updatedSourceProposals };
// //       updatedStages[destStageIndex] = { ...destStage, proposals: updatedDestProposals };

// //       // Optimistically update UI
// //       setStages(updatedStages);

// //       try {
// //         await axios.put(`http://localhost:5000/api/auth/stage/move`, {
// //           proposalId: draggableId,
// //           fromStageId: source.droppableId,
// //           toStageId: destination.droppableId,
// //         });
// //       } catch (error) {
// //         console.error("Failed to move proposal", error);
// //         fetchStages(); // Rollback if error occurs
// //       }
// //     };

// //     return (
// //       <div className="p-6 bg-gray-100 min-h-screen">
// //         <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
// //           Proposal Management Board
// //         </h1>
// //         <DragDropContext onDragEnd={handleDragEnd}>
// //           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
// //             {stages.map((stage) => (
// //               <Droppable droppableId={stage._id} key={stage._id}>
// //                 {(provided) => (
// //                   <div
// //                     className="bg-white rounded-xl shadow-md p-4"
// //                     ref={provided.innerRef}
// //                     {...provided.droppableProps}
// //                   >
// //                     <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">
// //                       {stage.name}
// //                     </h2>
// //                     {stage.proposals.map((proposal, index) => (
// //                       <Draggable
// //                         key={proposal._id}
// //                         draggableId={proposal._id}
// //                         index={index}
// //                       >
// //                         {(provided) => (
// //                           <div
// //                             className="bg-blue-50 border border-blue-300 p-3 rounded-md mb-3 shadow-sm hover:bg-blue-100 transition"
// //                             ref={provided.innerRef}
// //                             {...provided.draggableProps}
// //                             {...provided.dragHandleProps}
// //                           >
// //                             <div className="font-medium text-blue-900">
// //                               {proposal.title}
// //                             </div>
// //                             <div className="text-sm text-gray-600">
// //                               {proposal.dealTitle}
// //                             </div>
// //                           </div>
// //                         )}
// //                       </Draggable>
// //                     ))}
// //                     {provided.placeholder}
// //                   </div>
// //                 )}
// //               </Droppable>
// //             ))}
// //           </div>
// //         </DragDropContext>
// //       </div>
// //     );
// //   };

// //   export default ProposalBoard;
