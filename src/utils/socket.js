import { io } from "socket.io-client";
import { toast } from "react-toastify";

let socket; // single socket instance

export const initSocket = () => {
  if (socket) return socket; // if already initialized, return it

  const userStr = localStorage.getItem("user");
  if (!userStr) {
    console.log("No user in localStorage!");
    return;
  }

  const user = JSON.parse(userStr);
  if (!user._id) {
    console.log("User _id missing!");
    return;
  }

  socket = io("http://localhost:5000", {
    query: { userId: user._id }, // send userId to backend
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id, "UserId:", user._id);
    socket.emit("user_connected", user._id); // notify backend
  });

  // Example: follow-up notification listener
 socket.on("followup:due", (data) => {
  console.log("Follow-up due notification received:", data);

  const followUpTime = new Date(data.when); // parse string to Date
  const timeStr = followUpTime.toLocaleString(); // or toLocaleTimeString()

  toast.info(
    `${data.leadName} - Follow-up at ${timeStr}`,
    {
      position: "top-right",
      autoClose: 5000,
    }
  );
});


  return socket;
};

export const getSocket = () => socket;
