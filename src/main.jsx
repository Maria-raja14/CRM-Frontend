import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ModalProvider } from "./context/ModalContext.jsx";
import { TemplateProvider } from "./context/TemplateContext"; // Ensure correct path


createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ModalProvider>
      <TemplateProvider> 
        <App />
      </TemplateProvider>
    </ModalProvider>
  </React.StrictMode>
);

