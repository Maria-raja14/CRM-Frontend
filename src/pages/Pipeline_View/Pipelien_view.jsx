import React, { useMemo, useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/**
 * Sales Pipeline Board
 * - 5 columns: Qualification, Negotiation, Proposal Sent, Closed Won, Closed Lost
 * - Drag & drop deals across columns, with smooth reordering
 * - Clean Tailwind styling, counters, search, and simple localStorage persistence
 * - Single-file component, just drop into your app and render <SalesPipelineBoard />
 */

// ----- Types -----
const STAGES = [
  { id: "qualification", title: "Qualification" },
  { id: "negotiation", title: "Negotiation" },
  { id: "proposal", title: "Proposal Sent" },
  { id: "won", title: "Closed Won" },
  { id: "lost", title: "Closed Lost" },
];

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

// ----- Demo seed data -----
const SEED = {
  qualification: [
    { id: "d-1", title: "Acme Corp", owner: "Riya", value: 55000, tags: ["B2B", "High"] },
    { id: "d-2", title: "Blue Pine Pvt.", owner: "Arun", value: 18000, tags: ["B2B"] },
  ],
  negotiation: [
    { id: "d-3", title: "Citrus Labs", owner: "Neha", value: 32000, tags: ["Demo done"] },
  ],
  proposal: [
    { id: "d-4", title: "Delta Textiles", owner: "Sunil", value: 24000, tags: ["Discount req."] },
    { id: "d-5", title: "Everest Foods", owner: "Maya", value: 41000, tags: ["Priority"] },
  ],
  won: [
    { id: "d-6", title: "Futura Tech", owner: "Kiran", value: 90000, tags: ["Annual"] },
  ],
  lost: [
    { id: "d-7", title: "Gem Logistics", owner: "Aisha", value: 12000, tags: ["Budget"] },
  ],
};

const STORAGE_KEY = "sales-pipeline-board";

export default function SalesPipelineBoard() {
  const [columns, setColumns] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return SEED;
  });
  const [activeId, setActiveId] = useState(null); // dragging deal id
  const [query, setQuery] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(columns));
  }, [columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const allItems = useMemo(
    () => Object.values(columns).flat(),
    [columns]
  );

  const activeDeal = activeId ? allItems.find((d) => d.id === activeId) : null;

  function findContainerByItemId(id) {
    for (const key of Object.keys(columns)) {
      if (columns[key].some((d) => d.id === id)) return key;
    }
    return null;
  }

  function handleDragStart(e) {
    setActiveId(e.active.id);
  }

  function handleDragEnd(e) {
    const { active, over } = e;
    setActiveId(null);
    if (!over) return;

    const activeContainer = findContainerByItemId(active.id);
    let overContainer = over.id;

    // If over is an item, map to its container id
    if (typeof over.id === "string" && over.id.startsWith("d-")) {
      overContainer = findContainerByItemId(over.id);
    }

    if (!activeContainer || !overContainer) return;

    if (activeContainer === overContainer) {
      // Reorder within the same column
      const oldIndex = columns[activeContainer].findIndex((d) => d.id === active.id);
      const overIndex = columns[overContainer].findIndex((d) => d.id === (over.id.startsWith("d-") ? over.id : active.id));

      if (oldIndex !== overIndex) {
        setColumns((prev) => ({
          ...prev,
          [activeContainer]: arrayMove(prev[activeContainer], oldIndex, overIndex),
        }));
      }
      return;
    }

    // Move across columns
    const sourceIdx = columns[activeContainer].findIndex((d) => d.id === active.id);
    const moving = columns[activeContainer][sourceIdx];

    setColumns((prev) => {
      const next = { ...prev };
      next[activeContainer] = [...prev[activeContainer]];
      next[overContainer] = [...prev[overContainer]];

      next[activeContainer].splice(sourceIdx, 1);

      if (typeof over.id === "string" && over.id.startsWith("d-")) {
        const insertIndex = next[overContainer].findIndex((d) => d.id === over.id);
        next[overContainer].splice(insertIndex, 0, moving);
      } else {
        next[overContainer].push(moving);
      }
      return next;
    });
  }

  function addDeal(stageId) {
    const title = prompt("Deal title");
    if (!title) return;
    const valueStr = prompt("Value (₹)");
    const value = Number(valueStr || 0) || 0;
    const owner = prompt("Owner");
    const deal = { id: `d-${uid()}` , title, value, owner: owner || "—", tags: [] };
    setColumns((prev) => ({ ...prev, [stageId]: [deal, ...prev[stageId]] }));
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

  return (
    <div className="min-h-screen w-full bg-neutral-50 p-4 md:p-6">
      {/* Toolbar */}
      <div className="mx-auto max-w-[1400px] mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Sales Pipeline</h1>
          <p className="text-sm text-neutral-500">Drag and drop deals across the 5 stages. Search by title, owner, or tag.</p>
        </div>
        <div className="flex gap-2 items-center">
          <input
            className="w-72 rounded-2xl border border-neutral-200 bg-white px-4 py-2 shadow-sm outline-none focus:ring-2 focus:ring-indigo-200"
            placeholder="Search deals…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="mx-auto max-w-[1400px] grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {STAGES.map((stage) => (
            <Column
              key={stage.id}
              id={stage.id}
              title={stage.title}
              items={filtered[stage.id] || []}
              totalValue={totals[stage.id] || 0}
              onAdd={() => addDeal(stage.id)}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={{ duration: 150 }}>
          {activeDeal ? (
            <DealCard deal={activeDeal} overlay />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

// ----- Column (droppable list) -----
function Column({ id, title, items, onAdd, totalValue }) {
  return (
    <div className="flex min-h-[60vh] flex-col rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold flex items-center gap-2">
            {title}
            <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-neutral-600">
              {items.length}
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

      <div className="h-2 rounded-xl bg-neutral-100 mb-3 overflow-hidden">
        <div className={`h-full rounded-xl ${progressBarColor(id)}`} style={{ width: progressWidth(items.length) }} />
      </div>

      <SortableContext items={items.map((d) => d.id)} strategy={verticalListSortingStrategy}>
        <div id={id} className="flex flex-1 flex-col gap-3">
          {items.map((deal) => (
            <SortableDeal key={deal.id} id={deal.id} deal={deal} />
          ))}
          {items.length === 0 && (
            <div className="mt-6 rounded-xl border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-500">
              Drop deals here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

// ----- Deal card (sortable) -----
function SortableDeal({ id, deal }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <DealCard deal={deal} dragging={isDragging} />
    </div>
  );
}

function DealCard({ deal, dragging = false, overlay = false }) {
  return (
    <div className={`rounded-2xl border ${dragging || overlay ? "border-indigo-300 ring-2 ring-indigo-200" : "border-neutral-200"} bg-white p-4 shadow-sm hover:shadow transition`}>
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
            <span key={i} className="rounded-lg bg-indigo-50 px-2 py-0.5 text-[11px] text-indigo-700">
              {t}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

// ----- Utilities -----
function progressWidth(count) {
  const pct = Math.min(100, 12 + count * 8);
  return pct + "%";
}
function progressBarColor(id) {
  switch (id) {
    case "qualification":
      return "bg-blue-300";
    case "negotiation":
      return "bg-amber-300";
    case "proposal":
      return "bg-cyan-300";
    case "won":
      return "bg-emerald-300";
    case "lost":
      return "bg-rose-300";
    default:
      return "bg-neutral-200";
  }
}
function formatNumber(n) {
  return new Intl.NumberFormat("en-IN").format(n);
}//Original




