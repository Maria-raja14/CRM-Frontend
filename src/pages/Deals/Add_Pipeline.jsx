// import { useState } from "react";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
// import { Trash2 } from "lucide-react";

// function SortableItem({ stage, index, onDelete, onNameChange }) {
//   return (
//     <Draggable draggableId={stage.id} index={index}>
//       {(provided) => (
//         <div
//           ref={provided.innerRef}
//           {...provided.draggableProps}
//           {...provided.dragHandleProps}
//           className="bg-white p-6 m-2 flex flex-col w-64 h-64 rounded-lg shadow-lg border space-y-2"
//         >
//           <label className="text-sm text-gray-600">Name</label>
//           <input
//             type="text"
//             value={stage.name}
//             onChange={(e) => onNameChange(stage.id, e.target.value)}
//             className="border p-2 rounded w-full mt-1"
//             placeholder="Type pipeline name"
//           />

//           <label className="text-sm text-gray-600">Probability</label>
//           <input
//             type="text"
//             value={stage.probability}
//             disabled
//             className="border p-2 rounded w-full mt-1 bg-gray-100"
//           />

//           <button
//             onClick={() => onDelete(stage.id)}
//             className="bg-white flex items-center justify-center gap-2 text-black-500 px-4 py-2 mt-3 rounded text-sm border hover:bg-blue-500 hover:text-white transition shadow-sm"
//           >
//             <Trash2 size={16} /> Delete stage
//           </button>
//         </div>
//       )}
//     </Draggable>
//   );
// }

// export default function PipelineBuilder() {
//   const [stages, setStages] = useState([]);

//   const handleDragEnd = (result) => {
//     if (!result.destination) return;
//     const items = Array.from(stages);
//     const [reorderedItem] = items.splice(result.source.index, 1);
//     items.splice(result.destination.index, 0, reorderedItem);
//     setStages(items);
//   };

//   const addStage = () => {
//     setStages((prevStages) => [
//       ...prevStages,
//       { id: Date.now().toString(), name: "", probability: "" },
//     ]);
//   };

//   const handleDelete = (id) => {
//     setStages((prevStages) => prevStages.filter((stage) => stage.id !== id));
//   };

//   const handleNameChange = (id, newName) => {
//     setStages((prevStages) =>
//       prevStages.map((stage) =>
//         stage.id === id ? { ...stage, name: newName } : stage
//       )
//     );
//   };

//   return (
//     <div className="min-h-screen w-full">
//       <div className="bg-white p-6 w-full">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Add Pipeline</h2>
//           <div className="space-x-2">
//             <button className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
//             {/* <button className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button> */}
//             <button
//               className="bg-gray-500 text-white px-4 py-2 rounded"
//               onClick={() => window.history.back()} // Navigates to the previous page
//             >
//               Cancel
//             </button>

//           </div>
//         </div>

//         <input
//           type="text"
//           placeholder="Type pipeline name"
//           className="w-full border p-2 rounded mb-4"
//         />

//         <div className="overflow-x-auto">
//           <DragDropContext onDragEnd={handleDragEnd}>
//             <Droppable droppableId="stages" direction="horizontal">
//               {(provided) => (
//                 <div
//                   ref={provided.innerRef}
//                   {...provided.droppableProps}
//                   className="flex space-x-4 items-center"
//                 >
//                   {stages.map((stage, index) => (
//                     <SortableItem
//                       key={stage.id}
//                       stage={stage}
//                       index={index}
//                       onDelete={handleDelete}
//                       onNameChange={handleNameChange}
//                     />
//                   ))}
//                   {provided.placeholder}
//                   <div className="bg-gray-100 p-6 rounded-lg flex flex-col items-center w-64 h-64 justify-center shadow-md space-y-2">
//                     <p className="text-gray-600">Add new stage</p>
//                     <p className="text-gray-400 text-sm text-center">
//                       Pipeline stage is helpful to manage your sales process
//                     </p>
//                     <button
//                       onClick={addStage}
//                       className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
//                     >
//                       Add stage
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </Droppable>
//           </DragDropContext>
//         </div>
//       </div>
//     </div>
//   );
// }


// import { useState } from "react";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
// import { Trash2 } from "lucide-react";
// import PipelineTable from "./Pipeline_Pagination"; // Import the table component

// function SortableItem({ stage, index, onDelete, onNameChange }) {
//   return (
//     <Draggable draggableId={stage.id} index={index}>
//       {(provided) => (
//         <div
//           ref={provided.innerRef}
//           {...provided.draggableProps}
//           {...provided.dragHandleProps}
//           className="bg-white p-6 m-2 flex flex-col w-64 h-64 rounded-lg shadow-lg border space-y-2"
//         >
//           <label className="text-sm text-gray-600">Name</label>
//           <input
//             type="text"
//             value={stage.name}
//             onChange={(e) => onNameChange(stage.id, e.target.value)}
//             className="border p-2 rounded w-full mt-1"
//             placeholder="Type pipeline name"
//           />

//           <label className="text-sm text-gray-600">Probability</label>
//           <input
//             type="text"
//             value={stage.probability}
//             disabled
//             className="border p-2 rounded w-full mt-1 bg-gray-100"
//           />

//           <button
//             onClick={() => onDelete(stage.id)}
//             className="bg-white flex items-center justify-center gap-2 text-black-500 px-4 py-2 mt-3 rounded text-sm border hover:bg-blue-500 hover:text-white transition shadow-sm"
//           >
//             <Trash2 size={16} /> Delete stage
//           </button>
//         </div>
//       )}
//     </Draggable>
//   );
// }

// export default function PipelineBuilder() {
//   const [pipelineName, setPipelineName] = useState("");
//   const [stages, setStages] = useState([]);
//   const [savedPipelines, setSavedPipelines] = useState([]);
//   const [showTable, setShowTable] = useState(false);

//   const handleDragEnd = (result) => {
//     if (!result.destination) return;
//     const items = Array.from(stages);
//     const [reorderedItem] = items.splice(result.source.index, 1);
//     items.splice(result.destination.index, 0, reorderedItem);
//     setStages(items);
//   };

//   const addStage = () => {
//     setStages((prevStages) => [
//       ...prevStages,
//       { id: Date.now().toString(), name: "", probability: "" },
//     ]);
//   };

//   const handleDelete = (id) => {
//     setStages((prevStages) => prevStages.filter((stage) => stage.id !== id));
//   };

//   const handleNameChange = (id, newName) => {
//     setStages((prevStages) =>
//       prevStages.map((stage) =>
//         stage.id === id ? { ...stage, name: newName } : stage
//       )
//     );
//   };

//   const handleSave = () => {
//     if (!pipelineName.trim()) {
//       alert("Please enter a pipeline name");
//       return;
//     }

//     const newPipeline = {
//       id: Date.now().toString(),
//       name: pipelineName,
//       stages: [...stages],
//       totalDealValue: "$0", // You can calculate this based on your logic
//       numOfDeals: 0, // You can calculate this based on your logic
//       numOfStages: stages.length,
//       createdDate: new Date().toISOString().split('T')[0]
//     };

//     setSavedPipelines([...savedPipelines, newPipeline]);
//     setShowTable(true);
//     setPipelineName("");
//     setStages([]);
//   };

//   return (
//     <div className="min-h-screen w-full">
//       {showTable ? (
//         <div className="p-6">
//           <button 
//             onClick={() => setShowTable(false)}
//             className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
//           >
//             Create New Pipeline
//           </button>
//           <PipelineTable pipelines={savedPipelines} />
//         </div>
//       ) : (
//         <div className="bg-white p-6 w-full">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold">Add Pipeline</h2>
//             <div className="space-x-2">
//               <button 
//                 className="bg-blue-500 text-white px-4 py-2 rounded"
//                 onClick={handleSave}
//               >
//                 Save
//               </button>
//               <button
//                 className="bg-gray-500 text-white px-4 py-2 rounded"
//                 onClick={() => window.history.back()}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>

//           <input
//             type="text"
//             placeholder="Type pipeline name"
//             className="w-full border p-2 rounded mb-4"
//             value={pipelineName}
//             onChange={(e) => setPipelineName(e.target.value)}
//           />

//           <div className="overflow-x-auto">
//             <DragDropContext onDragEnd={handleDragEnd}>
//               <Droppable droppableId="stages" direction="horizontal">
//                 {(provided) => (
//                   <div
//                     ref={provided.innerRef}
//                     {...provided.droppableProps}
//                     className="flex space-x-4 items-center"
//                   >
//                     {stages.map((stage, index) => (
//                       <SortableItem
//                         key={stage.id}
//                         stage={stage}
//                         index={index}
//                         onDelete={handleDelete}
//                         onNameChange={handleNameChange}
//                       />
//                     ))}
//                     {provided.placeholder}
//                     <div className="bg-gray-100 p-6 rounded-lg flex flex-col items-center w-64 h-64 justify-center shadow-md space-y-2">
//                       <p className="text-gray-600">Add new stage</p>
//                       <p className="text-gray-400 text-sm text-center">
//                         Pipeline stage is helpful to manage your sales process
//                       </p>
//                       <button
//                         onClick={addStage}
//                         className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
//                       >
//                         Add stage
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </Droppable>
//             </DragDropContext>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }//it is work..



import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Trash2 } from "lucide-react";
import PipelineTable from "./Pipeline_Pagination";

function SortableItem({ stage, index, onDelete, onNameChange, onProbabilityChange }) {
  return (
    <Draggable draggableId={stage.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-6 m-2 flex flex-col w-64 h-64 rounded-lg shadow-lg border space-y-2"
        >
          <label className="text-sm text-gray-600">Name</label>
          <input
            type="text"
            value={stage.name}
            onChange={(e) => onNameChange(stage.id, e.target.value)}
            className="border p-2 rounded w-full mt-1"
            placeholder="Type stage name"
          />

          <label className="text-sm text-gray-600">Probability</label>
          <input
            type="text"
            value={stage.probability}
            onChange={(e) => onProbabilityChange(stage.id, e.target.value)}
            className="border p-2 rounded w-full mt-1"
            placeholder="Enter probability"
          />

          <button
            onClick={() => onDelete(stage.id)}
            className="bg-white flex items-center justify-center gap-2 text-black-500 px-4 py-2 mt-3 rounded text-sm border hover:bg-blue-500 hover:text-white transition shadow-sm"
          >
            <Trash2 size={16} /> Delete stage
          </button>
        </div>
      )}
    </Draggable>
  );
}

export default function PipelineBuilder() {
  const [pipelineName, setPipelineName] = useState("");
  const [stages, setStages] = useState([]);
  const [savedPipelines, setSavedPipelines] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(stages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setStages(items);
  };

  const addStage = () => {
    setStages((prevStages) => [
      ...prevStages,
      { id: Date.now().toString(), name: "", probability: "" },
    ]);
  };

  const handleDelete = (id) => {
    setStages((prevStages) => prevStages.filter((stage) => stage.id !== id));
  };

  const handleNameChange = (id, newName) => {
    setStages((prevStages) =>
      prevStages.map((stage) =>
        stage.id === id ? { ...stage, name: newName } : stage
      )
    );
  };

  const handleProbabilityChange = (id, newProbability) => {
    setStages((prevStages) =>
      prevStages.map((stage) =>
        stage.id === id ? { ...stage, probability: newProbability } : stage
      )
    );
  };

  const handleSave = () => {
    if (!pipelineName.trim()) {
      alert("Please enter a pipeline name");
      return;
    }

    const newPipeline = {
      id: Date.now().toString(),
      name: pipelineName,
      stages: [...stages],
      totalDealValue: "$0", // Can be calculated based on your logic
      numOfDeals: 0, // Can be calculated based on your logic
      numOfStages: stages.length,
      createdDate: new Date().toISOString().split('T')[0]
    };

    setSavedPipelines([...savedPipelines, newPipeline]);
    setShowTable(true);
  };

  return (
    <div className="min-h-screen w-full">
      {showTable ? (
        <div className="p-6">
          <button 
            onClick={() => setShowTable(false)}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          >
            Create New Pipeline
          </button>
          <PipelineTable pipelines={savedPipelines} />
        </div>
      ) : (
        <div className="bg-white p-6 w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Add Pipeline</h2>
            <div className="space-x-2">
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => window.history.back()}
              >
                Cancel
              </button>
            </div>
          </div>

          <input
            type="text"
            placeholder="Type pipeline name"
            className="w-full border p-2 rounded mb-4"
            value={pipelineName}
            onChange={(e) => setPipelineName(e.target.value)}
          />

          <div className="overflow-x-auto">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="stages" direction="horizontal">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex space-x-4 items-center"
                  >
                    {stages.map((stage, index) => (
                      <SortableItem
                        key={stage.id}
                        stage={stage}
                        index={index}
                        onDelete={handleDelete}
                        onNameChange={handleNameChange}
                        onProbabilityChange={handleProbabilityChange}
                      />
                    ))}
                    {provided.placeholder}
                    <div className="bg-gray-100 p-6 rounded-lg flex flex-col items-center w-64 h-64 justify-center shadow-md space-y-2">
                      <p className="text-gray-600">Add new stage</p>
                      <p className="text-gray-400 text-sm text-center">
                        Pipeline stage is helpful to manage your sales process
                      </p>
                      <button
                        onClick={addStage}
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                      >
                        Add stage
                      </button>
                    </div>
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      )}
    </div>
  );
}//correct..


// import { useState } from "react";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
// import { Trash2 } from "lucide-react";
// import PipelineTable from "./Pipeline_Pagination";

// function SortableItem({ stage, index, onDelete, onNameChange, onProbabilityChange }) {
//   return (
//     <Draggable draggableId={stage.id} index={index}>
//       {(provided) => (
//         <div
//           ref={provided.innerRef}
//           {...provided.draggableProps}
//           {...provided.dragHandleProps}
//           className="bg-white p-6 m-2 flex flex-col w-64 h-64 rounded-lg shadow-lg border space-y-2"
//         >
//           <label className="text-sm text-gray-600">Name</label>
//           <input
//             type="text"
//             value={stage.name}
//             onChange={(e) => onNameChange(stage.id, e.target.value)}
//             className="border p-2 rounded w-full mt-1"
//             placeholder="Type stage name"
//           />

//           <label className="text-sm text-gray-600">Probability</label>
//           <input
//             type="text"
//             value={stage.probability}
//             onChange={(e) => onProbabilityChange(stage.id, e.target.value)}
//             className="border p-2 rounded w-full mt-1"
//             placeholder="Enter probability"
//           />

//           <button
//             onClick={() => onDelete(stage.id)}
//             className="bg-white flex items-center justify-center gap-2 text-black-500 px-4 py-2 mt-3 rounded text-sm border hover:bg-blue-500 hover:text-white transition shadow-sm"
//           >
//             <Trash2 size={16} /> Delete stage
//           </button>
//         </div>
//       )}
//     </Draggable>
//   );
// }

// export default function PipelineBuilder() {
//   const [pipelineName, setPipelineName] = useState("");
//   const [stages, setStages] = useState([]);
//   const [savedPipelines, setSavedPipelines] = useState([]);
//   const [showTable, setShowTable] = useState(true); // Start with table visible

//   const handleDragEnd = (result) => {
//     if (!result.destination) return;
//     const items = Array.from(stages);
//     const [reorderedItem] = items.splice(result.source.index, 1);
//     items.splice(result.destination.index, 0, reorderedItem);
//     setStages(items);
//   };

//   const addStage = () => {
//     setStages((prevStages) => [
//       ...prevStages,
//       { id: Date.now().toString(), name: "", probability: "" },
//     ]);
//   };

//   const handleDelete = (id) => {
//     setStages((prevStages) => prevStages.filter((stage) => stage.id !== id));
//   };

//   const handleNameChange = (id, newName) => {
//     setStages((prevStages) =>
//       prevStages.map((stage) =>
//         stage.id === id ? { ...stage, name: newName } : stage
//       )
//     );
//   };

//   const handleProbabilityChange = (id, newProbability) => {
//     setStages((prevStages) =>
//       prevStages.map((stage) =>
//         stage.id === id ? { ...stage, probability: newProbability } : stage
//       )
//     );
//   };

//   const handleSave = () => {
//     if (!pipelineName.trim()) {
//       alert("Please enter a pipeline name");
//       return;
//     }

//     const newPipeline = {
//       id: Date.now().toString(),
//       name: pipelineName,
//       stages: [...stages],
//       totalDealValue: "$0",
//       numOfDeals: 0,
//       numOfStages: stages.length,
//       createdDate: new Date().toISOString().split('T')[0]
//     };

//     setSavedPipelines([...savedPipelines, newPipeline]);
//     setPipelineName("");
//     setStages([]);
//     setShowTable(true);
//   };

//   const handleCreateNew = () => {
//     setShowTable(false);
//   };

//   return (
//     <div className="min-h-screen w-full">
//       {showTable ? (
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold">Pipelines</h2>
//             <button 
//               onClick={handleCreateNew}
//               className="bg-blue-500 text-white px-4 py-2 rounded"
//             >
//               Add Pipeline
//             </button>
//           </div>
//           <PipelineTable pipelines={savedPipelines} />
//         </div>
//       ) : (
//         <div className="bg-white p-6 w-full">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold">Add Pipeline</h2>
//             <div className="space-x-2">
//               <button 
//                 className="bg-blue-500 text-white px-4 py-2 rounded"
//                 onClick={handleSave}
//               >
//                 Save
//               </button>
//               <button
//                 className="bg-gray-500 text-white px-4 py-2 rounded"
//                 onClick={() => setShowTable(true)}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>

//           <input
//             type="text"
//             placeholder="Type pipeline name"
//             className="w-full border p-2 rounded mb-4"
//             value={pipelineName}
//             onChange={(e) => setPipelineName(e.target.value)}
//           />

//           <div className="overflow-x-auto">
//             <DragDropContext onDragEnd={handleDragEnd}>
//               <Droppable droppableId="stages" direction="horizontal">
//                 {(provided) => (
//                   <div
//                     ref={provided.innerRef}
//                     {...provided.droppableProps}
//                     className="flex space-x-4 items-center"
//                   >
//                     {stages.map((stage, index) => (
//                       <SortableItem
//                         key={stage.id}
//                         stage={stage}
//                         index={index}
//                         onDelete={handleDelete}
//                         onNameChange={handleNameChange}
//                         onProbabilityChange={handleProbabilityChange}
//                       />
//                     ))}
//                     {provided.placeholder}
//                     <div className="bg-gray-100 p-6 rounded-lg flex flex-col items-center w-64 h-64 justify-center shadow-md space-y-2">
//                       <p className="text-gray-600">Add new stage</p>
//                       <p className="text-gray-400 text-sm text-center">
//                         Pipeline stage is helpful to manage your sales process
//                       </p>
//                       <button
//                         onClick={addStage}
//                         className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
//                       >
//                         Add stage
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </Droppable>
//             </DragDropContext>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }