// ─────────────────────────────────────────────────────────────────────────────
// FILE 1:  src/services/call.service.js
// ─────────────────────────────────────────────────────────────────────────────

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const headers = () => ({
  "Content-Type": "application/json",
  ...(localStorage.getItem("token")
    ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
    : {}),
});

// Get all calls with optional filters
export const fetchCalls = async ({ page = 1, limit = 20, status = "", direction = "", search = "" } = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (status)    params.append("status",    status);
  if (direction) params.append("direction", direction);
  if (search)    params.append("search",    search);

  const res = await fetch(`${BASE}/call/all?${params.toString()}`, { headers: headers() });
  if (!res.ok) throw new Error("Failed to fetch calls");
  return res.json();
};

// Get call stats (totals)
export const fetchCallStats = async () => {
  const res = await fetch(`${BASE}/call/stats`, { headers: headers() });
  if (!res.ok) throw new Error("Failed to fetch call stats");
  return res.json();
};

// Make an outbound call
export const makeCall = async (to) => {
  const res = await fetch(`${BASE}/call/outbound`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ to }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to make call");
  }
  return res.json();
};

// Update call (add notes etc.)
export const updateCall = async (id, data) => {
  const res = await fetch(`${BASE}/call/${id}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update call");
  return res.json();
};

// Delete call
export const deleteCall = async (id) => {
  const res = await fetch(`${BASE}/call/${id}`, {
    method: "DELETE",
    headers: headers(),
  });
  if (!res.ok) throw new Error("Failed to delete call");
  return res.json();
};