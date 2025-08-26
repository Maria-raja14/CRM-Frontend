
import { io } from "socket.io-client";
import { toast } from "react-toastify";

let socket;

export const initSocket = () => {
  if (socket && socket.connected) return socket;

  const userStr = localStorage.getItem("user");
  if (!userStr) {
    console.warn("⚠️ No user found in localStorage!");
    return;
  }

  let user;
  try {
    user = JSON.parse(userStr);
  } catch (err) {
    console.error("❌ Invalid user JSON in localStorage", err);
    return;
  }

  if (!user || !user._id) {
    console.warn("⚠️ User _id not found in localStorage user object");
    return;
  }

  //  Connect with auth
  socket = io("http://localhost:5000", {
    auth: { userId: user._id },
    transports: ["websocket"],
  });

  //  On connect
  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id, "UserId:", user._id);
  });

  socket.on("disconnect", (reason) => {
    console.log("⚠️ Socket disconnected:", reason);
  });

  //  Listen once only
//  if (!socket.hasListeners) {
//   // Lead reminders
//   socket.on("followup_reminder", (data) => {
//     console.log("🔔 followup_reminder received:", data);
//     toast.info(data.message || "Follow-up reminder", { autoClose: 5000 });
//   });

//   socket.on("missed_followup", (data) => {
//     console.log("⚠️ missed_followup received:", data);
//     toast.error(data.message || "Missed follow-up!", { autoClose: 5000 });
//   });

//   socket.on("missed_followup_admin", (data) => {
//     console.log("⚠️ missed_followup_admin received:", data);
//     toast.warning(data.message || "Salesman missed follow-up!", { autoClose: 5000 });
//   });

//   //  Activity reminders
//   socket.on("activity_reminder", (data) => {
//     console.log("🔔 activity_reminder received:", data);
//     toast.info(
//       data.message || `Reminder: ${data.title || "Activity due"}`,
//       { autoClose: 6000 }
//     );
//   });

//   socket.on("activity_reminder_admin", (data) => {
//     console.log("👑 activity_reminder_admin received:", data);
//     toast.warning(
//       data.message || `Salesman has activity: ${data.title || ""}`,
//       { autoClose: 6000 }
//     );
//   });

//   socket.hasListeners = true; // prevent duplicate listeners
// }
// ✅ correct way
if (!socket._listenersRegistered) {
  socket.on("followup_reminder", (data) => {
    console.log("🔔 followup_reminder received:", data);
    toast.info(data.message || "Follow-up reminder", { autoClose: 5000 });
  });

  socket.on("missed_followup", (data) => {
    console.log("⚠️ missed_followup received:", data);
    toast.error(data.message || "Missed follow-up!", { autoClose: 5000 });
  });

  socket.on("missed_followup_admin", (data) => {
    console.log("⚠️ missed_followup_admin received:", data);
    toast.warning(data.message || "Salesman missed follow-up!", { autoClose: 5000 });
  });

  socket.on("activity_reminder", (data) => {
    console.log("🔔 activity_reminder received:", data);
    toast.info(data.message || "Activity reminder", { autoClose: 6000 });
  });

  socket.on("activity_reminder_admin", (data) => {
    console.log("👑 activity_reminder_admin received:", data);
    toast.warning(data.message || "Salesman activity reminder", { autoClose: 6000 });
  });

  socket._listenersRegistered = true; // 🔑 mark as registered
}



  return socket;
};

export const disconnectSocket = (userId) => {
  if (socket) {
    if (userId) {
      socket.emit("user_logout", userId);
    }
    socket.io.opts.reconnection = false;
    socket.disconnect();
    console.log("🔌 Socket disconnected manually:", socket.id);
    socket = null;
  }
};

export const getSocket = () => socket;






  