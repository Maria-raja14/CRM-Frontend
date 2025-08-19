// // import { io } from "socket.io-client";
// // import { toast } from "react-toastify";

// // let socket; // single socket instance

// // export const initSocket = () => {
// //   if (socket) return socket; // if already initialized, return it

// //   const userStr = localStorage.getItem("user");
// //   if (!userStr) {
// //     console.log("No user in localStorage!");
// //     return;
// //   }

// //   const user = JSON.parse(userStr);
// //   if (!user._id) {
// //     console.log("User _id missing!");
// //     return;
// //   }

// //   socket = io("http://localhost:5000", {
// //     query: { userId: user._id }, // send userId to backend
// //   });

// //   socket.on("connect", () => {
// //     console.log("Socket connected:", socket.id, "UserId:", user._id);
// //     socket.emit("user_connected", user._id); // notify backend
// //   });

// //   // Example: follow-up notification listener
// // //  socket.on("followup:due", (data) => {
// // //   console.log("Follow-up due notification received:", data);

// // //   const followUpTime = new Date(data.when); // parse string to Date
// // //   const timeStr = followUpTime.toLocaleString(); // or toLocaleTimeString()

// // //   toast.info(
// // //     `${data.leadName} - Follow-up at ${timeStr}`,
// // //     {
// // //       position: "top-right",
// // //       autoClose: 5000,
// // //     }
// // //   );
// // // });

// // socket.on("followup:due", (data) => {
// //   const { leadName, followUpAt } = data;
// //   const formattedDate = followUpAt
// //     ? new Date(followUpAt).toLocaleString()
// //     : "No Date";
// //   toast.info(
// //     `${leadName} - Follow-up Alert!\n\n- ${formattedDate}`
// //   );
// // });

// //   return socket;
// // };

// // export const getSocket = () => socket;

// import { io } from "socket.io-client";
// import { toast } from "react-toastify";

// let socket;

// export const initSocket = () => {
//   if (socket) return socket;

//   // LocalStorage la irukka user data eduthukkaraen
//   const userStr = localStorage.getItem("user");
//   if (!userStr) {
//     console.log("⚠️ No user found in localStorage!");
//     return;
//   }

//   let user;
//   try {
//     user = JSON.parse(userStr);
//   } catch (err) {
//     console.log("❌ Invalid user JSON in localStorage", err);
//     return;
//   }

//   if (!user || !user._id) {
//     console.log("⚠️ User _id not found in localStorage user object");
//     return;
//   }

//   // Correct userId pass panna
//   socket = io("http://localhost:5000", {
//     auth: { userId: user._id },
//   });

//   socket.on("connect", () => {
//     console.log("✅ Socket connected:", socket.id, "UserId:", user._id);
//     socket.emit("user_connected", user._id);
//   });

//   // Followup reminder from backend
//   socket.on("followup_reminder", (data) => {
//     toast.info(data.message);
//     if (Notification.permission === "granted") {
//       new Notification(data.title || "CRM Alert", { body: data.message });
//     }
//   });

//   // Follow-up due notification
//   socket.on("followup:due", (data) => {
//     console.log("📩 Follow-up notification received:", data);
//     const { leadName, followUpAt } = data;
//     const formattedDate = followUpAt
//       ? new Date(followUpAt).toLocaleString()
//       : "No Date";

//     toast.info(`${leadName} - Follow-up Alert!\n📅 ${formattedDate}`, {
//       position: "top-right",
//       autoClose: 6000,
//       closeOnClick: true,
//       pauseOnHover: true,
//     });
//   });

//   return socket;
// };

// export const getSocket = () => socket;

// export async function requestNotificationPermission() {
//   if (!("Notification" in window)) return;

//   let permission = Notification.permission;
//   if (permission === "default") {
//     permission = await Notification.requestPermission();
//   }

//   if (permission === "granted") {
//     console.log("✅ Notification permission granted");
//   } else {
//     console.log("❌ Notification blocked");
//   }
// }


import { io } from "socket.io-client";
import { toast } from "react-toastify";

let socket;

export const initSocket = () => {
  if (socket) return socket;

  const userStr = localStorage.getItem("user");
  if (!userStr) {
    console.log("⚠️ No user found in localStorage!");
    return;
  }

  let user;
  try {
    user = JSON.parse(userStr);
  } catch (err) {
    console.log("❌ Invalid user JSON in localStorage", err);
    return;
  }

  if (!user || !user._id) {
    console.log("⚠️ User _id not found in localStorage user object");
    return;
  }

  socket = io("http://localhost:5000", {
    auth: { userId: user._id },
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id, "UserId:", user._id);
    socket.emit("user_connected", user._id);
  });

  // ONLY toaster notification
  socket.on("followup_reminder", (data) => {
    console.log("🔔 followup_reminder received:", data);
    toast.info(data.message, { autoClose: 5000 });
  });

  return socket;
};

export const getSocket = () => socket;
