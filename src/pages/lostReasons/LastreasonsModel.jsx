import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "../../components/ui/dialog";
  import { useModal } from "../../context/ModalContext";
  import { useState } from "react";
  import axios from "axios";
  
  const LastreasonsModel = () => {
    const { isOpen, closeModal } = useModal();
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const handleSave = async () => {
      if (!name) {
        setError("Name is required");
        return;
      }
      
      setLoading(true);
      setError(null);
  
      try {
        const response = await axios.post("http://localhost:5000/api/auth/lastname/create", {
          name,
        });
        console.log("Last Reason saved:", response.data);
        closeModal(); // Close modal after successful save
      } catch (err) {
        console.error("Error saving invoice:", err);
        setError("Failed to save invoice. Try again.");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Dialog open={isOpen} onOpenChange={closeModal}>
        <DialogContent className="min-w-[700px] w-full max-h-screen min-h-[400px] overflow-y-auto">
          <DialogHeader className="p-5 border-b">
            <DialogTitle className="text-xl">Add Invoice</DialogTitle>
          </DialogHeader>
  
          <div className="flex items-center justify-between pt-16 px-10">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              className="border w-[400px] p-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
  
          {error && <p className="text-red-500 text-center">{error}</p>}
  
          <div className="border-t px-9 py-5 flex gap-5 items-end justify-end">
            <button className="bg-[#9397a0] p-2 text-white rounded-md px-5" onClick={closeModal}>
              Cancel
            </button>
            <button
              className="bg-[#4466f2] text-white p-2 rounded-md px-7"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default LastreasonsModel;
  