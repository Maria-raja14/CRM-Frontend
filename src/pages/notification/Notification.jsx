// // Notification.jsx
// import React, { useState, useEffect } from "react";
// import { getSocket } from "../../utils/socket";

// export default function Notification() {
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     const socket = getSocket();
//     if (!socket) return;

//     socket.on("followup:due", (data) => {
//       setNotifications((prev) => [...prev, data]);
//     });

//     return () => {
//       socket.off("followup:due");
//     };
//   }, []);

//   return (
//     <div className="fixed top-5 right-5 flex flex-col space-y-2 z-50">
//       {notifications.map((n, i) => (
//         <div
//           key={i}
//           className="bg-white shadow-md border-l-4 border-blue-500 p-4 rounded-md animate-slide-in"
//         >
//           <p className="font-bold text-blue-700">Follow-up Alert!</p>
//           <p>{n.leadName} - {new Date(n.when).toLocaleTimeString()}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { getSocket } from "../../utils/socket";

export default function Notification() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on("followup_reminder", (data) => {
      setNotifications((prev) => [...prev, data]);
    });

    return () => socket.off("followup_reminder");
  }, []);

  return (
    <div className="fixed top-5 right-5 flex flex-col space-y-2 z-50">
      {notifications.map((n, i) => (
        <div
          key={i}
          className="bg-white shadow-md border-l-4 border-blue-500 p-4 rounded-md animate-slide-in"
        >
          <p className="font-bold text-blue-700">Follow-up Alert!</p>
          <p>{n.message}</p>
        </div>
      ))}
    </div>
  );
}
