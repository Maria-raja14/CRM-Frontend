// import React from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.jsx";
// import { ModalProvider } from "./context/ModalContext.jsx";
// import { TemplateProvider } from "./context/TemplateContext"; // Ensure correct path

// <<<<<<< HEAD
// createRoot(document.getElementById('root')).render(
  
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
// =======
// createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <ModalProvider>
//       <TemplateProvider> {/* Wrap the entire App */}
//         <App />
//       </TemplateProvider>
//     </ModalProvider>
//   </React.StrictMode>
// );
// >>>>>>> 3da078d1cd8286b6ab0ac9b84d6974d900bbc886


// import React, { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.jsx";
// import { ModalProvider } from "./context/ModalContext.jsx";
// import { TemplateProvider } from "./context/TemplateContext"; // Ensure correct path

// <<<<<<< HEAD
// createRoot(document.getElementById('root')).render(
  
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
// =======
// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <ModalProvider>
//       <TemplateProvider> 
//         <App />
//       </TemplateProvider>
//     </ModalProvider>
//   </StrictMode>
// );
// >>>>>>> 3da078d1cd8286b6ab0ac9b84d6974d900bbc886


import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Context Providers
import { ModalProvider } from "./context/ModalContext.jsx";
import { TemplateProvider } from "./context/TemplateContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ModalProvider>
      <TemplateProvider>
        <App />
      </TemplateProvider>
    </ModalProvider>
  </StrictMode>
);
