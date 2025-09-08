

// socket.js (frontend)
import { io } from "socket.io-client";

let socket;

export const initSocket = (userId) => {
  const API_URL = import.meta.env.VITE_SI_URI;

  if (!socket) {
    socket = io(`${API_URL}`, {
      auth: { userId },
      reconnectionAttempts: 3,
    });

    socket.on("connect", () => {
      console.log("Connected to socket:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
    });
  }
  return socket;
};



export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("🔌 Socket disconnected manually");
  }
};
