import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create Context
const TemplateContext = createContext();

// Hook to use the context
export const useTemplateContext = () => {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error("useTemplateContext must be used within a TemplateProvider");
  }
  return context;
};

// Provider Component
export const TemplateProvider = ({ children }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:5000/api/auth/template/readTemp")
  //     .then((response) => setTemplates(response.data))
  //     .catch((error) => console.error("Error fetching templates:", error));
  // }, []);

  return (
    <TemplateContext.Provider
      value={{
        templates,
        setTemplates,
        selectedTemplate,
        setSelectedTemplate,
        isPreviewOpen,
        setIsPreviewOpen,
        isEditOpen,
        setIsEditOpen,
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
};
