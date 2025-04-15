import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { useState } from "react";
import axios from "axios";

const EditLostReasonModal = ({ isOpen, closeModal, reason, fetchLostReasons }) => {
  const [editName, setEditName] = useState(reason?.name || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpdate = async () => {
    if (!editName) {
      setError("Name is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.put(`http://localhost:5000/api/auth/lastname/updateName/${reason._id}`, {
        name: editName,
      });

      closeModal();
      fetchLostReasons(); // Refresh the list after updating
    } catch (err) {
      console.error("Error updating lost reason:", err);
      setError("Failed to update. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="min-w-[700px] w-full max-h-screen min-h-[400px] overflow-y-auto">
        <DialogHeader className="p-5 border-b">
          <DialogTitle className="text-xl">Edit Lost Reason</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between pt-16 px-10">
          <label htmlFor="editName">Name</label>
          <input
            type="text"
            className="border w-[400px] p-3"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="border-t px-9 py-5 flex gap-5 items-end justify-end">
          <button className="bg-gray-500 p-2 text-white rounded-md px-5" onClick={closeModal}>
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white p-2 rounded-md px-7"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditLostReasonModal;
