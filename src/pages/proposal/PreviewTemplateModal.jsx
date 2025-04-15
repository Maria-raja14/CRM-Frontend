import React from "react";
import { Dialog } from "../../components/ui/dialog";
import { X } from "lucide-react";

const PreviewTemplateModal = ({ template, onClose }) => {
  if (!template) return null;

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl w-[400px]">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold">{template.title}</h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>
        <p className="mt-2 text-gray-600">{template.content}</p>
        {template.image && (
          <img src={`http://localhost:5000${template.image}`} alt="Template Preview" className="mt-4 w-full h-40 object-cover rounded-lg" />
        )}
      </Dialog.Panel>
    </Dialog>
  );
};

export default PreviewTemplateModal;
