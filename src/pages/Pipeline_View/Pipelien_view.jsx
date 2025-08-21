

// import React, { useMemo, useState, useEffect, useRef } from "react";
// import { DndProvider, useDrag, useDrop } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";
// import axios from "axios";

// // ----- Stages (match backend exactly) -----
// const STAGES = [
//   { id: "Qualification", title: "Qualification", color: "text-blue-600" },
//   { id: "Negotiation", title: "Negotiation", color: "text-amber-600" },
//   { id: "Proposal Sent", title: "Proposal Sent", color: "text-cyan-600" },
//   { id: "Closed Won", title: "Closed Won", color: "text-emerald-600" },
//   { id: "Closed Lost", title: "Closed Lost", color: "text-rose-600" },
// ];

// // ----- Drag types -----
// const ItemTypes = {
//   DEAL: "DEAL"
// };

// function formatNumber(n) {
//   return new Intl.NumberFormat("en-IN").format(n);
// }

// // ----- Main Pipeline Board -----
// function SalesPipelineBoardPure() {
//   const [columns, setColumns] = useState({});
//   const [query, setQuery] = useState("");
//   const [isLoading, setIsLoading] = useState(true);

//   const scrollRef = useRef(null);

//   // 🔹 Fetch Deals on mount
//   useEffect(() => {
//     fetchDeals();
//   }, []);

//   const fetchDeals = async () => {
//     try {
//       setIsLoading(true);
//       const res = await axios.get("http://localhost:5000/api/deals/getAll");
//       const grouped = {};
//       STAGES.forEach((s) => (grouped[s.id] = []));
//       res.data.forEach((deal) => {
//         if (!grouped[deal.stage]) grouped[deal.stage] = [];
//         grouped[deal.stage].push(deal);
//       });
//       setColumns(grouped);
//     } catch (err) {
//       console.error(err);
//       // Fallback to empty columns if API fails
//       const emptyColumns = {};
//       STAGES.forEach((s) => (emptyColumns[s.id] = []));
//       setColumns(emptyColumns);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const allItems = useMemo(() => Object.values(columns).flat(), [columns]);

//   async function addDeal(stageId) {
//     const title = prompt("Deal title");
//     if (!title) return;
//     const valueStr = prompt("Value (₹)");
//     const value = Number(valueStr || 0) || 0;
//     const assignedTo = prompt("Assigned User ID"); // must be userId from DB

//     try {
//       await axios.post("http://localhost:5000/api/deals/createManual", {
//         dealName: title,
//         value,
//         assignedTo,
//         stage: stageId,
//       });
//       fetchDeals();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to create deal. Please try again.");
//     }
//   }

//   // Simplified moveDeal - local update + API call
//   async function moveDeal(dealId, fromStage, toStage) {
//     if (fromStage === toStage) return;

//     // 🔹 Local state update for instant UI
//     setColumns(prev => {
//       let deal;
//       const next = { ...prev };
//       next[fromStage] = prev[fromStage].filter(d => {
//         if (d._id === dealId) {
//           deal = d;
//           return false;
//         }
//         return true;
//       });
//       if (deal) {
//         next[toStage] = [...prev[toStage], { ...deal, stage: toStage }];
//       }
//       return next;
//     });

//     // 🔹 API call to persist change
//     try {
//       await axios.patch(`http://localhost:5000/api/deals/${dealId}`, {
//         stage: toStage,
//       });
//     } catch (err) {
//       console.error("Failed to update deal stage:", err);
//       alert("Failed to save stage change! Please refresh.");
//       // optional: rollback by re-fetching deals
//       fetchDeals();
//     }
//   }

//   // Filter deals for search query
//   const filtered = useMemo(() => {
//     if (!query.trim()) return columns;
//     const q = query.toLowerCase();
//     const obj = {};
//     for (const key of Object.keys(columns)) {
//       obj[key] = columns[key].filter(
//         (d) =>
//           d.dealName.toLowerCase().includes(q) ||
//           (d.assignedTo?.firstName || "")
//             .toLowerCase()
//             .includes(q) ||
//           (d.assignedTo?.lastName || "")
//             .toLowerCase()
//             .includes(q)
//       );
//     }
//     return obj;
//   }, [columns, query]);

//   // Calculate total values per column
//   const totals = useMemo(() => {
//     const t = {};
//     for (const key of Object.keys(columns)) {
//       t[key] = columns[key].reduce((sum, d) => sum + (d.value || 0), 0);
//     }
//     return t;
//   }, [columns]);

//   // Auto horizontal scroll while dragging (optional)
//   useEffect(() => {
//     function handleDrag(e) {
//       const container = scrollRef.current;
//       if (!container) return;

//       const { clientX } = e;
//       const { left, right } = container.getBoundingClientRect();
//       const scrollAmount = 40; // speed

//       if (clientX - left < 80) {
//         container.scrollLeft -= scrollAmount;
//       } else if (right - clientX < 80) {
//         container.scrollLeft += scrollAmount;
//       }
//     }

//     window.addEventListener("dragover", handleDrag);
//     return () => window.removeEventListener("dragover", handleDrag);
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen w-full bg-neutral-50 p-4 md:p-6 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
//           <p className="mt-4 text-neutral-600">Loading deals...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen w-full bg-neutral-50 p-4 md:p-6 ">
//       {/* Toolbar */}
//       <div className="mx-auto mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between max-w-[1600px]">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Sales Pipeline</h1>
//           <p className="text-sm text-neutral-500">Drag and drop deals across the stages. Search by title or owner.</p>
//         </div>
//         <div className="flex gap-2 items-center">
//           <input
//             className="w-72 border border-neutral-200 bg-white px-4 py-2 shadow-sm outline-none focus:ring-2 focus:ring-indigo-200"
//             placeholder="Search deals…"
//             value={query}
//             onChange={e => setQuery(e.target.value)}
//           />
//           <button
//             onClick={fetchDeals}
//             className="border border-neutral-200 bg-white px-4 py-2 shadow-sm hover:shadow transition"
//             title="Refresh data"
//           >
//             Refresh
//           </button>
//         </div>
//       </div>

//       {/* Board */}
//       <div ref={scrollRef} className="mx-auto flex gap-4 overflow-x-auto pb-4 max-w-[1600px]">
//         {STAGES.map(stage => (
//           <Column
//             key={stage.id}
//             id={stage.id}
//             title={stage.title}
//             titleColor={stage.color}
//             deals={filtered[stage.id] || []}
//             totalValue={totals[stage.id] || 0}
//             moveDeal={moveDeal}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// // ----- Column component -----
// function Column({ id, title, titleColor, deals, totalValue, moveDeal }) {
//   const [, dropRef] = useDrop({
//     accept: ItemTypes.DEAL,
//     drop: (item) => {
//       if (item.from !== id) {
//         moveDeal(item.id, item.from, id);
//       }
//     }
//   });

//   return (
//     <div
//       ref={dropRef}
//       className="min-w-[340px] w-[360px] flex min-h-[65vh] flex-col border border-neutral-200 bg-white p-3 shadow-sm"
//     >
//       <div className="mb-3 flex items-center justify-between">
//         <div>
//           <h2 className={`text-base font-semibold flex items-center gap-2 ${titleColor}`}>
//             {title}
//             <span className="inline-flex items-center border px-2 py-0.5 text-xs text-neutral-600">
//               {deals.length}
//             </span>
//           </h2>
//           <div className="text-xs text-neutral-500">₹{formatNumber(totalValue)} total</div>
//         </div>
//       </div>
//       <div className="flex flex-1 flex-col gap-3">
//         {deals.map((deal) => (
//           <DealCard
//             key={deal._id}
//             deal={deal}
//             stageId={id}
//             moveDeal={moveDeal}
//           />
//         ))}
//         {deals.length === 0 && (
//           <div className="mt-6 border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-500">
//             Drop deals here
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ----- Deal Card -----
// function DealCard({ deal, stageId, moveDeal }) {
//   const [{ isDragging }, dragRef] = useDrag({
//     type: ItemTypes.DEAL,
//     item: { id: deal._id, from: stageId },
//     collect: monitor => ({ isDragging: monitor.isDragging() })
//   });

//   function getColor() {
//     switch (stageId) {
//       case "Qualification": return "border-blue-200";
//       case "Negotiation": return "border-amber-200";
//       case "Proposal Sent": return "border-cyan-200";
//       case "Closed Won": return "border-emerald-200";
//       case "Closed Lost": return "border-rose-200";
//       default: return "border-neutral-200";
//     }
//   }

//   const ownerName = deal.assignedTo
//     ? `${deal.assignedTo.firstName || ''} ${deal.assignedTo.lastName || ''}`.trim()
//     : "—";

//   return (
//     <div
//       ref={dragRef}
//       className={`border ${getColor()} bg-white p-4 shadow-sm hover:shadow transition cursor-move`}
//       style={{ opacity: isDragging ? 0.5 : 1, borderWidth: isDragging ? 2 : 1 }}
//     >
//       <div className="flex items-start justify-between gap-3">
//         <div>
//           <div className="text-sm font-semibold leading-5">{deal.dealName}</div>
//           <div className="mt-1 text-xs text-neutral-500">Owner: {ownerName}</div>
//         </div>
//         <div className="bg-neutral-100 px-2 py-1 text-xs">₹{formatNumber(deal.value || 0)}</div>
//       </div>
//       {deal.tags?.length ? (
//         <div className="mt-3 flex flex-wrap gap-2">
//           {deal.tags.map((t, i) => (
//             <span key={i} className="bg-indigo-50 px-2 py-0.5 text-[11px] text-indigo-700">{t}</span>
//           ))}
//         </div>
//       ) : null}
//     </div>
//   );
// }

// // ----- DndProvider wrapper -----
// export default function SalesPipelineBoard() {
//   return (
//     <DndProvider backend={HTML5Backend}>
//       <SalesPipelineBoardPure />
//     </DndProvider>
//   );
// }//ok

import React, { useMemo, useState, useEffect, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";

// ----- Stages (match backend exactly) -----
const STAGES = [
  { 
    id: "Qualification", 
    title: "Qualification", 
    color: "text-blue-800",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-300"
  },
  { 
    id: "Negotiation", 
    title: "Negotiation", 
    color: "text-amber-800",
    bgColor: "bg-amber-100",
    borderColor: "border-amber-300"
  },
  { 
    id: "Proposal Sent", 
    title: "Proposal Sent", 
    color: "text-cyan-800",
    bgColor: "bg-cyan-100",
    borderColor: "border-cyan-300"
  },
  { 
    id: "Closed Won", 
    title: "Closed Won", 
    color: "text-emerald-800",
    bgColor: "bg-emerald-100",
    borderColor: "border-emerald-300"
  },
  { 
    id: "Closed Lost", 
    title: "Closed Lost", 
    color: "text-rose-800",
    bgColor: "bg-rose-100",
    borderColor: "border-rose-300"
  },
];

// ----- Drag types -----
const ItemTypes = {
  DEAL: "DEAL"
};

function formatNumber(n) {
  return new Intl.NumberFormat("en-IN").format(n);
}

// ----- Main Pipeline Board -----
function SalesPipelineBoardPure() {
  const [columns, setColumns] = useState({});
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const scrollRef = useRef(null);

  // 🔹 Fetch Deals on mount
  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("http://localhost:5000/api/deals/getAll");
      const grouped = {};
      STAGES.forEach((s) => (grouped[s.id] = []));
      res.data.forEach((deal) => {
        if (!grouped[deal.stage]) grouped[deal.stage] = [];
        grouped[deal.stage].push(deal);
      });
      setColumns(grouped);
    } catch (err) {
      console.error(err);
      // Fallback to empty columns if API fails
      const emptyColumns = {};
      STAGES.forEach((s) => (emptyColumns[s.id] = []));
      setColumns(emptyColumns);
    } finally {
      setIsLoading(false);
    }
  };

  const allItems = useMemo(() => Object.values(columns).flat(), [columns]);

  async function addDeal(stageId) {
    const title = prompt("Deal title");
    if (!title) return;
    const valueStr = prompt("Value (₹)");
    const value = Number(valueStr || 0) || 0;
    const assignedTo = prompt("Assigned User ID"); // must be userId from DB

    try {
      await axios.post("http://localhost:5000/api/deals/createManual", {
        dealName: title,
        value,
        assignedTo,
        stage: stageId,
      });
      fetchDeals();
    } catch (err) {
      console.error(err);
      alert("Failed to create deal. Please try again.");
    }
  }

  // Simplified moveDeal - local update + API call
  async function moveDeal(dealId, fromStage, toStage) {
    if (fromStage === toStage) return;

    // 🔹 Local state update for instant UI
    setColumns(prev => {
      let deal;
      const next = { ...prev };
      next[fromStage] = prev[fromStage].filter(d => {
        if (d._id === dealId) {
          deal = d;
          return false;
        }
        return true;
      });
      if (deal) {
        next[toStage] = [...prev[toStage], { ...deal, stage: toStage }];
      }
      return next;
    });

    // 🔹 API call to persist change
    try {
      await axios.patch(`http://localhost:5000/api/deals/${dealId}`, {
        stage: toStage,
      });
    } catch (err) {
      console.error("Failed to update deal stage:", err);
      alert("Failed to save stage change! Please refresh.");
      // optional: rollback by re-fetching deals
      fetchDeals();
    }
  }

  // Filter deals for search query
  const filtered = useMemo(() => {
    if (!query.trim()) return columns;
    const q = query.toLowerCase();
    const obj = {};
    for (const key of Object.keys(columns)) {
      obj[key] = columns[key].filter(
        (d) =>
          d.dealName.toLowerCase().includes(q) ||
          (d.assignedTo?.firstName || "")
            .toLowerCase()
            .includes(q) ||
          (d.assignedTo?.lastName || "")
            .toLowerCase()
            .includes(q)
      );
    }
    return obj;
  }, [columns, query]);

  // Calculate total values per column
  const totals = useMemo(() => {
    const t = {};
    for (const key of Object.keys(columns)) {
      t[key] = columns[key].reduce((sum, d) => sum + (d.value || 0), 0);
    }
    return t;
  }, [columns]);

  // Auto horizontal scroll while dragging (optional)
  useEffect(() => {
    function handleDrag(e) {
      const container = scrollRef.current;
      if (!container) return;

      const { clientX } = e;
      const { left, right } = container.getBoundingClientRect();
      const scrollAmount = 40; // speed

      if (clientX - left < 80) {
        container.scrollLeft -= scrollAmount;
      } else if (right - clientX < 80) {
        container.scrollLeft += scrollAmount;
      }
    }

    window.addEventListener("dragover", handleDrag);
    return () => window.removeEventListener("dragover", handleDrag);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-neutral-50 p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading deals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-neutral-50 p-4 md:p-6 ">
      {/* Toolbar */}
      <div className="mx-auto mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between max-w-[1600px]">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Sales Pipeline</h1>
          <p className="text-sm text-neutral-500">Drag and drop deals across the stages. Search by title or owner.</p>
        </div>
        <div className="flex gap-2 items-center">
          <input
            className="w-72 border border-neutral-200 bg-white px-4 py-2 shadow-sm outline-none focus:ring-2 focus:ring-indigo-200"
            placeholder="Search deals…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button
            onClick={fetchDeals}
            className="border border-neutral-200 bg-white px-4 py-2 shadow-sm hover:shadow transition"
            title="Refresh data"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Board */}
      <div ref={scrollRef} className="mx-auto flex gap-4 overflow-x-auto pb-4 max-w-[1600px]">
        {STAGES.map(stage => (
          <Column
            key={stage.id}
            id={stage.id}
            title={stage.title}
            titleColor={stage.color}
            bgColor={stage.bgColor}
            borderColor={stage.borderColor}
            deals={filtered[stage.id] || []}
            moveDeal={moveDeal}
          />
        ))}
      </div>
    </div>
  );
}

// ----- Column component -----
function Column({ id, title, titleColor, bgColor, borderColor, deals, moveDeal }) {
  const [, dropRef] = useDrop({
    accept: ItemTypes.DEAL,
    drop: (item) => {
      if (item.from !== id) {
        moveDeal(item.id, item.from, id);
      }
    }
  });

  return (
    <div 
      ref={dropRef} 
      className={`min-w-[340px] w-[360px] flex min-h-[65vh] flex-col border-2 ${borderColor} bg-white p-3 shadow-sm`}
    >
      <div className="mb-3">
        <h2 className={`text-base font-semibold flex items-center gap-2 ${titleColor} ${bgColor} p-3`}>
          {title}
          <span className="inline-flex items-center border px-2 py-0.5 text-xs text-neutral-600 bg-white">
            {deals.length}
          </span>
        </h2>
      </div>
      <div className="flex flex-1 flex-col gap-3">
        {deals.map((deal) => (
          <DealCard
            key={deal._id}
            deal={deal}
            stageId={id}
            moveDeal={moveDeal}
          />
        ))}
        {deals.length === 0 && (
          <div className="mt-6 border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-500">
            Drop deals here
          </div>
        )}
      </div>
    </div>
  );
}

// ----- Deal Card -----
function DealCard({ deal, stageId, moveDeal }) {
  const [{ isDragging }, dragRef] = useDrag({
    type: ItemTypes.DEAL,
    item: { id: deal._id, from: stageId },
    collect: monitor => ({ isDragging: monitor.isDragging() })
  });

  function getColor() {
    switch (stageId) {
      case "Qualification": return "border-blue-200";
      case "Negotiation": return "border-amber-200";
      case "Proposal Sent": return "border-cyan-200";
      case "Closed Won": return "border-emerald-200";
      case "Closed Lost": return "border-rose-200";
      default: return "border-neutral-200";
    }
  }

  const ownerName = deal.assignedTo 
    ? `${deal.assignedTo.firstName || ''} ${deal.assignedTo.lastName || ''}`.trim() 
    : "—";

  return (
    <div
      ref={dragRef}
      className={`border ${getColor()} bg-white p-4 shadow-sm hover:shadow transition cursor-move min-h-[120px] flex flex-col justify-between`}
      style={{ opacity: isDragging ? 0.5 : 1, borderWidth: isDragging ? 2 : 1 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="text-sm font-semibold leading-5 mb-2">{deal.dealName}</div>
          <div className="text-xs text-neutral-500">Owner: {ownerName}</div>
        </div>
        <div className="bg-neutral-100 px-2 py-1 text-xs whitespace-nowrap">₹{formatNumber(deal.value || 0)}</div>
      </div>
      {deal.tags?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {deal.tags.map((t, i) => (
            <span key={i} className="bg-indigo-50 px-2 py-0.5 text-[11px] text-indigo-700">{t}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

// ----- DndProvider wrapper -----
export default function SalesPipelineBoard() {
  return (
    <DndProvider backend={HTML5Backend}>
      <SalesPipelineBoardPure />
    </DndProvider>
  );
}