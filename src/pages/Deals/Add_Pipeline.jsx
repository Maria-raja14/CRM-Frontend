import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Trash2 } from "lucide-react";

function SortableItem({ stage, index, onDelete, onNameChange }) {
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
            placeholder="Type pipeline name"
          />

          <label className="text-sm text-gray-600">Probability</label>
          <input
            type="text"
            value={stage.probability}
            disabled
            className="border p-2 rounded w-full mt-1 bg-gray-100"
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
  const [stages, setStages] = useState([]);

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

  return (
    <div className="min-h-screen w-full">
      <div className="bg-white p-6 w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Pipeline</h2>
          <div className="space-x-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
            {/* <button className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button> */}
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => window.history.back()} // Navigates to the previous page
            >
              Cancel
            </button>

          </div>
        </div>

        <input
          type="text"
          placeholder="Type pipeline name"
          className="w-full border p-2 rounded mb-4"
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
    </div>
  );
}
