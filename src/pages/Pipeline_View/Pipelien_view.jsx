// import React, { useMemo, useState, useEffect } from "react";
// import {
//   DndContext,
//   closestCenter,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragOverlay,
// } from "@dnd-kit/core";
// import {
//   SortableContext,
//   useSortable,
//   arrayMove,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";

// // ----- Types -----
// const STAGES = [
//   { id: "qualification", title: "Qualification" },
//   { id: "negotiation", title: "Negotiation" },
//   { id: "proposal", title: "Proposal Sent" },
//   { id: "won", title: "Closed Won" },
//   { id: "lost", title: "Closed Lost" },
// ];

// function uid() {
//   return Math.random().toString(36).slice(2, 9);
// }

// // ----- Demo seed data -----
// const SEED = {
//   qualification: [
//     { id: "d-1", title: "Acme Corp", owner: "Riya", value: 55000, tags: ["B2B", "High"] },
//     { id: "d-2", title: "Blue Pine Pvt.", owner: "Arun", value: 18000, tags: ["B2B"] },
//   ],
//   negotiation: [
//     { id: "d-3", title: "Citrus Labs", owner: "Neha", value: 32000, tags: ["Demo done"] },
//   ],
//   proposal: [
//     { id: "d-4", title: "Delta Textiles", owner: "Sunil", value: 24000, tags: ["Discount req."] },
//     { id: "d-5", title: "Everest Foods", owner: "Maya", value: 41000, tags: ["Priority"] },
//   ],
//   won: [
//     { id: "d-6", title: "Futura Tech", owner: "Kiran", value: 90000, tags: ["Annual"] },
//   ],
//   lost: [
//     { id: "d-7", title: "Gem Logistics", owner: "Aisha", value: 12000, tags: ["Budget"] },
//   ],
// };

// const STORAGE_KEY = "sales-pipeline-board";

// export default function SalesPipelineBoard() {
//   const [columns, setColumns] = useState(() => {
//     const saved = localStorage.getItem(STORAGE_KEY);
//     if (saved) return JSON.parse(saved);
//     return SEED;
//   });
//   const [activeId, setActiveId] = useState(null);
//   const [query, setQuery] = useState("");

//   useEffect(() => {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(columns));
//   }, [columns]);

//   const sensors = useSensors(
//     useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
//   );

//   const allItems = useMemo(
//     () => Object.values(columns).flat(),
//     [columns]
//   );

//   const activeDeal = activeId ? allItems.find((d) => d.id === activeId) : null;

//   function findContainerByItemId(id) {
//     for (const key of Object.keys(columns)) {
//       if (columns[key].some((d) => d.id === id)) return key;
//     }
//     return null;
//   }

//   function handleDragStart(e) {
//     setActiveId(e.active.id);
//   }

//   function handleDragEnd(e) {
//     const { active, over } = e;
//     setActiveId(null);
//     if (!over) return;

//     const activeContainer = findContainerByItemId(active.id);
//     let overContainer = over.id;

//     if (typeof over.id === "string" && over.id.startsWith("d-")) {
//       overContainer = findContainerByItemId(over.id);
//     }

//     if (!activeContainer || !overContainer) return;

//     if (activeContainer === overContainer) {
//       const oldIndex = columns[activeContainer].findIndex((d) => d.id === active.id);
//       const overIndex = columns[overContainer].findIndex((d) => d.id === (over.id.startsWith("d-") ? over.id : active.id));

//       if (oldIndex !== overIndex) {
//         setColumns((prev) => ({
//           ...prev,
//           [activeContainer]: arrayMove(prev[activeContainer], oldIndex, overIndex),
//         }));
//       }
//       return;
//     }

//     const sourceIdx = columns[activeContainer].findIndex((d) => d.id === active.id);
//     const moving = columns[activeContainer][sourceIdx];

//     setColumns((prev) => {
//       const next = { ...prev };
//       next[activeContainer] = [...prev[activeContainer]];
//       next[overContainer] = [...prev[overContainer]];
//       next[activeContainer].splice(sourceIdx, 1);

//       if (typeof over.id === "string" && over.id.startsWith("d-")) {
//         const insertIndex = next[overContainer].findIndex((d) => d.id === over.id);
//         next[overContainer].splice(insertIndex, 0, moving);
//       } else {
//         next[overContainer].push(moving);
//       }
//       return next;
//     });
//   }

//   function addDeal(stageId) {
//     const title = prompt("Deal title");
//     if (!title) return;
//     const valueStr = prompt("Value (₹)");
//     const value = Number(valueStr || 0) || 0;
//     const owner = prompt("Owner");
//     const deal = { id: `d-${uid()}`, title, value, owner: owner || "—", tags: [] };
//     setColumns((prev) => ({ ...prev, [stageId]: [deal, ...prev[stageId]] }));
//   }

//   const filtered = useMemo(() => {
//     if (!query.trim()) return columns;
//     const q = query.toLowerCase();
//     const obj = {};
//     for (const key of Object.keys(columns)) {
//       obj[key] = columns[key].filter(
//         (d) =>
//           d.title.toLowerCase().includes(q) ||
//           (d.owner && d.owner.toLowerCase().includes(q)) ||
//           (d.tags || []).some((t) => t.toLowerCase().includes(q))
//       );
//     }
//     return obj;
//   }, [columns, query]);

//   const totals = useMemo(() => {
//     const t = {};
//     for (const key of Object.keys(columns)) {
//       t[key] = columns[key].reduce((sum, d) => sum + (d.value || 0), 0);
//     }
//     return t;
//   }, [columns]);

//   return (
//     <div className="min-h-screen w-full bg-neutral-50 p-4 md:p-6">
//       {/* Toolbar */}
//       <div className="mx-auto max-w-[1600px] mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Sales Pipeline</h1>
//           <p className="text-sm text-neutral-500">Drag and drop deals across the stages. Search by title, owner, or tag.</p>
//         </div>
//         <div className="flex gap-2 items-center">
//           <input
//             className="w-72 rounded-2xl border border-neutral-200 bg-white px-4 py-2 shadow-sm outline-none focus:ring-2 focus:ring-indigo-200"
//             placeholder="Search deals…"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//           />
//           <button
//             onClick={() => setColumns(SEED)}
//             className="rounded-2xl border border-neutral-200 bg-white px-4 py-2 shadow-sm hover:shadow transition"
//             title="Reset demo data"
//           >
//             Reset
//           </button>
//         </div>
//       </div>

//       {/* Board */}
//       <DndContext
//         sensors={sensors}
//         collisionDetection={closestCenter}
//         onDragStart={handleDragStart}
//         onDragEnd={handleDragEnd}
//       >
//         <div className="mx-auto flex gap-4 overflow-x-auto pb-4">
//           {STAGES.map((stage) => (
//             <div key={stage.id} className="min-w-[300px] w-[320px]">
//               <Column
//                 id={stage.id}
//                 title={stage.title}
//                 items={filtered[stage.id] || []}
//                 totalValue={totals[stage.id] || 0}
//                 onAdd={() => addDeal(stage.id)}
//               />
//             </div>
//           ))}
//         </div>

//         <DragOverlay dropAnimation={{ duration: 150 }}>
//           {activeDeal ? (
//             <DealCard deal={activeDeal} overlay />
//           ) : null}
//         </DragOverlay>
//       </DndContext>
//     </div>
//   );
// }

// // Column
// function Column({ id, title, items, onAdd, totalValue }) {
//   return (
//     <div className="flex min-h-[60vh] flex-col rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
//       <div className="mb-3 flex items-center justify-between">
//         <div>
//           <h2 className="text-base font-semibold flex items-center gap-2">
//             {title}
//             <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-neutral-600">
//               {items.length}
//             </span>
//           </h2>
//           <div className="text-xs text-neutral-500">₹{formatNumber(totalValue)} total</div>
//         </div>
//         <button
//           onClick={onAdd}
//           className="rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-indigo-700"
//         >
//           + Add
//         </button>
//       </div>

//       <SortableContext items={items.map((d) => d.id)} strategy={verticalListSortingStrategy}>
//         <div id={id} className="flex flex-1 flex-col gap-3">
//           {items.map((deal) => (
//             <SortableDeal key={deal.id} id={deal.id} deal={deal} />
//           ))}
//           {items.length === 0 && (
//             <div className="mt-6 rounded-xl border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-500">
//               Drop deals here
//             </div>
//           )}
//         </div>
//       </SortableContext>
//     </div>
//   );
// }

// // Sortable
// function SortableDeal({ id, deal }) {
//   const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };
//   return (
//     <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
//       <DealCard deal={deal} dragging={isDragging} />
//     </div>
//   );
// }

// // Card
// function DealCard({ deal, dragging = false, overlay = false }) {
//   return (
//     <div className={`rounded-2xl border ${dragging || overlay ? "border-indigo-300 ring-2 ring-indigo-200" : "border-neutral-200"} bg-white p-4 shadow-sm hover:shadow transition`}>
//       <div className="flex items-start justify-between gap-3">
//         <div>
//           <div className="text-sm font-semibold leading-5">{deal.title}</div>
//           <div className="mt-1 text-xs text-neutral-500">Owner: {deal.owner || "—"}</div>
//         </div>
//         <div className="rounded-xl bg-neutral-100 px-2 py-1 text-xs">₹{formatNumber(deal.value || 0)}</div>
//       </div>
//       {deal.tags?.length ? (
//         <div className="mt-3 flex flex-wrap gap-2">
//           {deal.tags.map((t, i) => (
//             <span key={i} className="rounded-lg bg-indigo-50 px-2 py-0.5 text-[11px] text-indigo-700">{t}</span>
//           ))}
//         </div>
//       ) : null}
//     </div>
//   );
// }

// function formatNumber(n) {
//   return new Intl.NumberFormat("en-IN").format(n);
// }//oringinal


import React, { useMemo, useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// ----- Types -----
const STAGES = [
  { id: "qualification", title: "Qualification" },
  { id: "negotiation", title: "Negotiation" },
  { id: "proposal", title: "Proposal Sent" },
  { id: "won", title: "Closed Won" },
  { id: "lost", title: "Closed Lost" }
];

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

// ----- Demo seed data -----
const SEED = {
  qualification: [
    { id: "d-1", title: "Acme Corp", owner: "Riya", value: 55000, tags: ["B2B", "High"] },
    { id: "d-2", title: "Blue Pine Pvt.", owner: "Arun", value: 18000, tags: ["B2B"] }
  ],
  negotiation: [
    { id: "d-3", title: "Citrus Labs", owner: "Neha", value: 32000, tags: ["Demo done"] }
  ],
  proposal: [
    { id: "d-4", title: "Delta Textiles", owner: "Sunil", value: 24000, tags: ["Discount req."] },
    { id: "d-5", title: "Everest Foods", owner: "Maya", value: 41000, tags: ["Priority"] }
  ],
  won: [
    { id: "d-6", title: "Futura Tech", owner: "Kiran", value: 90000, tags: ["Annual"] }
  ],
  lost: [
    { id: "d-7", title: "Gem Logistics", owner: "Aisha", value: 12000, tags: ["Budget"] }
  ]
};

const STORAGE_KEY = "sales-pipeline-board";

// ----- Drag types -----
const ItemTypes = {
  DEAL: "DEAL"
};

// ----- Main Pipeline Board -----
function SalesPipelineBoardPure() {
  const [columns, setColumns] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return SEED;
  });
  const [query, setQuery] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(columns));
  }, [columns]);

  const allItems = useMemo(
    () => Object.values(columns).flat(),
    [columns]
  );

  function addDeal(stageId) {
    const title = prompt("Deal title");
    if (!title) return;
    const valueStr = prompt("Value (₹)");
    const value = Number(valueStr || 0) || 0;
    const owner = prompt("Owner");
    const deal = { id: `d-${uid()}`, title, value, owner: owner || "—", tags: [] };
    setColumns(prev => ({ ...prev, [stageId]: [deal, ...prev[stageId]] }));
  }

  const filtered = useMemo(() => {
    if (!query.trim()) return columns;
    const q = query.toLowerCase();
    const obj = {};
    for (const key of Object.keys(columns)) {
      obj[key] = columns[key].filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          (d.owner && d.owner.toLowerCase().includes(q)) ||
          (d.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }
    return obj;
  }, [columns, query]);

  const totals = useMemo(() => {
    const t = {};
    for (const key of Object.keys(columns)) {
      t[key] = columns[key].reduce((sum, d) => sum + (d.value || 0), 0);
    }
    return t;
  }, [columns]);

  // Drag logic for dropping a deal to another stage
  function moveDeal(dealId, fromStage, toStage, atIndex = null) {
    setColumns(prev => {
      // Remove deal from previous
      let deal;
      const next = { ...prev };
      next[fromStage] = prev[fromStage].filter(d => {
        if (d.id === dealId) {
          deal = d;
          return false;
        }
        return true;
      });
      // Add to target
      if (deal) {
        if (atIndex === null) {
          next[toStage] = [...prev[toStage], deal];
        } else {
          next[toStage] = [
            ...prev[toStage].slice(0, atIndex),
            deal,
            ...prev[toStage].slice(atIndex)
          ];
        }
      }
      return next;
    });
  }

  return (
    <div className="min-h-screen w-full bg-neutral-50 p-4 md:p-6 ">
      {/* Toolbar */}
      <div className="mx-auto mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between max-w-[1600px]">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Sales Pipeline</h1>
          <p className="text-sm text-neutral-500">Drag and drop deals across the stages. Search by title, owner, or tag.</p>
        </div>
        <div className="flex gap-2 items-center">
          <input
            className="w-72 rounded-2xl border border-neutral-200 bg-white px-4 py-2 shadow-sm outline-none focus:ring-2 focus:ring-indigo-200"
            placeholder="Search deals…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button
            onClick={() => setColumns(SEED)}
            className="rounded-2xl border border-neutral-200 bg-white px-4 py-2 shadow-sm hover:shadow transition"
            title="Reset demo data"
          >
            Reset
          </button>
        </div>
      </div>
      {/* Board */}
      <div className="mx-auto flex gap-4 overflow-x-auto pb-4 max-w-[1600px]">
        {STAGES.map(stage => (
          <Column
            key={stage.id}
            id={stage.id}
            title={stage.title}
            deals={filtered[stage.id] || []}
            totalValue={totals[stage.id] || 0}
            onAdd={() => addDeal(stage.id)}
            moveDeal={moveDeal}
            columns={columns}
          />
        ))}
      </div>
    </div>
  );
}

// ----- Column -----
function Column({ id, title, deals, onAdd, totalValue, moveDeal, columns }) {
  const [, dropRef] = useDrop({
    accept: ItemTypes.DEAL,
    drop: (item, monitor) => {
      if (item.from !== id) {
        moveDeal(item.id, item.from, id);
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver()
    })
  });

  return (
    <div ref={dropRef} className="min-w-[340px] w-[360px] flex min-h-[65vh] flex-col rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold flex items-center gap-2">
            {title}
            <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-neutral-600">
              {deals.length}
            </span>
          </h2>
          <div className="text-xs text-neutral-500">₹{formatNumber(totalValue)} total</div>
        </div>
        <button
          onClick={onAdd}
          className="rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-indigo-700"
        >
          + Add
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-3">
        {deals.map((deal, idx) => (
          <DealCard
            key={deal.id}
            deal={deal}
            index={idx}
            stageId={id}
            moveDeal={moveDeal}
            columns={columns}
          />
        ))}
        {deals.length === 0 && (
          <div className="mt-6 rounded-xl border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-500">
            Drop deals here
          </div>
        )}
      </div>
    </div>
  );
}

// ----- Deal Card -----
function DealCard({ deal, index, stageId, moveDeal, columns }) {
  const [{ isDragging }, dragRef] = useDrag({
    type: ItemTypes.DEAL,
    item: { id: deal.id, from: stageId, index },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });

  const [, dropRef] = useDrop({
    accept: ItemTypes.DEAL,
    hover: (item, monitor) => {
      if (item.id !== deal.id && item.from === stageId) {
        // Reorder within same column
        moveDeal(item.id, stageId, stageId, index);
        item.index = index;
      }
    }
  });

  // Card color (optional improved visual)
  function getColor() {
    switch (stageId) {
      case "qualification": return "border-blue-200";
      case "negotiation": return "border-amber-200";
      case "proposal": return "border-cyan-200";
      case "won": return "border-emerald-200";
      case "lost": return "border-rose-200";
      default: return "border-neutral-200";
    }
  }

  return (
    <div
      ref={node => dragRef(dropRef(node))}
      className={`rounded-2xl border ${getColor()} bg-white p-4 shadow-sm hover:shadow transition cursor-move`}
      style={{
        opacity: isDragging ? 0.5 : 1,
        borderWidth: isDragging ? 2 : 1
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold leading-5">{deal.title}</div>
          <div className="mt-1 text-xs text-neutral-500">Owner: {deal.owner || "—"}</div>
        </div>
        <div className="rounded-xl bg-neutral-100 px-2 py-1 text-xs">₹{formatNumber(deal.value || 0)}</div>
      </div>
      {deal.tags?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {deal.tags.map((t, i) => (
            <span key={i}
              className="rounded-lg bg-indigo-50 px-2 py-0.5 text-[11px] text-indigo-700"
            >{t}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function formatNumber(n) {
  return new Intl.NumberFormat("en-IN").format(n);
}

// ----- DndProvider wrapper -----
export default function SalesPipelineBoard() {
  return (
    <DndProvider backend={HTML5Backend}>
      <SalesPipelineBoardPure />
    </DndProvider>
  );
}//dnd work correctly..


