// import { createContext, useContext, useState, useEffect } from "react";
// import { initSocket } from "../utils/socket";
// import { toast } from "react-toastify";

// const NotificationContext = createContext();

// export const NotificationProvider = ({ children }) => {
// const API_URL = import.meta.env.VITE_API_URL;

//   const [notifications, setNotifications] = useState([]);
//   const user = JSON.parse(localStorage.getItem("user"));

//   useEffect(() => {
//     if (!user?._id) return;

//     // fetch existing notifications
//     fetch(`${API_URL}/notification/${user._id}`)
//       .then((res) => res.json())
//       .then((data) => setNotifications(data))
//       .catch((err) => console.error(err));

//     // init socket
//     const socket = initSocket();
//     if (!socket) return;

//     const handleFollowup = (data) => {
//       const notif = { id: Date.now(), text: data.message };
//       setNotifications((prev) => [notif, ...prev]);
//       toast.info(data.message, { autoClose: 5000 });
//     };

//     const handleActivity = (data) => {
//       // data should be the full notification object from backend
//       setNotifications((prev) => [data, ...prev]);
//       toast.info(data.text, { autoClose: 5000 });
//     };

//     socket.on("followup_reminder", handleFollowup);
//     socket.on("activity_reminder", handleActivity);

//     return () => {
//       socket.off("followup_reminder", handleFollowup);
//       socket.off("activity_reminder", handleActivity);
//     };
//   }, [user]);

//   return (
//     <NotificationContext.Provider value={{ notifications, setNotifications }}>
//       {children}
//     </NotificationContext.Provider>
//   );
// };

// export const useNotifications = () => useContext(NotificationContext);



import { createContext, useContext, useState, useEffect } from "react";
import { initSocket, disconnectSocket } from "../utils/socket";
import { toast } from "react-toastify";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user?._id) return;

    // ✅ Fetch existing notifications once
  fetch(`${API_URL}/notification/${user._id}`)
    .then((res) => res.json())
    .then((data) => {
      console.log("Fetched notifications:", data);
      data.forEach((n) => {
        console.log("Notification profileImage:", n?.profileImage || "❌ Not available");
      });
      setNotifications(data);
    })
    .catch((err) => console.error(err));

    // ✅ Initialize socket only once with userId
    const socket = initSocket(user._id);
    if (!socket) return;

    const handleFollowup = (data) => {
      const notif = { id: Date.now(), text: data.message };
      setNotifications((prev) => [notif, ...prev]);
      toast.info(data.message, { autoClose: 5000 });
    };

    const handleActivity = (data) => {
      setNotifications((prev) => [data, ...prev]);
      toast.info(data.text, { autoClose: 5000 });
    };

    socket.on("followup_reminder", handleFollowup);
    socket.on("activity_reminder", handleActivity);

    return () => {
      socket.off("followup_reminder", handleFollowup);
      socket.off("activity_reminder", handleActivity);
      // optional: fully disconnect when provider unmounts
      // disconnectSocket();
    };
  }, [user?._id]); // depend only on userId

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
