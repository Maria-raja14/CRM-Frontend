import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { useModal } from "../../context/ModalContext";
import { useState, useEffect } from "react";
import axios from "axios";

const InvoiceModal = () => {
  const { isOpen, closeModal } = useModal();
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [owners, setOwners] = useState([]);
  const [invoiceData, setInvoiceData] = useState({
    owner: "",
    issueDate: "",
    dueDate: "",
    status: "unpaid",
    deal: "",
    quantity: 1,
    price: 0,
    tax: "5",
    discountType: "none",
    discountValue: 0,
    note: "",
  });
  const [note, setNote] = useState("");
  const [isNoteVisible, setIsNoteVisible] = useState(false);

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/owners/getOwner")
      .then((response) => {
        setOwners(response.data);
      });
  }, []);

  const ownerOptions = owners.map((owner) => ({
    value: owner.id,
    label: owner.name,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOwnerChange = (selected) => {
    setSelectedOwner(selected);
    setInvoiceData((prev) => ({ ...prev, owner: selected?.value || "" }));
  };

  const handleAddNoteClick = () => {
    setIsNoteVisible(true);
  };

  const handleNoteChange = (e) => {
    setNote(e.target.value);
    setInvoiceData((prev) => ({ ...prev, note: e.target.value }));
  };

  const handleRemoveNoteClick = () => {
    setIsNoteVisible(false);
    setNote("");
    setInvoiceData((prev) => ({ ...prev, note: "" }));
  };

  // Add validation function
  const validateInputs = () => {
    const errors = {};
    const { owner, issueDate, dueDate, quantity, price } = invoiceData;

    if (!owner) errors.owner = "Owner is required.";
    if (!issueDate) errors.issueDate = "Issue Date is required.";
    if (!dueDate) errors.dueDate = "Due Date is required.";
    if (quantity <= 0) errors.quantity = "Quantity must be greater than 0.";
    if (price <= 0) errors.price = "Price must be greater than 0.";

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSaveInvoice = async () => {
    if (!validateInputs()) return; // Only proceed if validation passes

    const items = [
      {
        deal: invoiceData.deal,
        quantity: invoiceData.quantity,
        price: invoiceData.price,
        amount: invoiceData.quantity * invoiceData.price,
      },
    ];

    const total = calculateTotal();

    const invoiceToSave = { ...invoiceData, items, total };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/invoice/createinvoice",
        invoiceToSave
      );

      if (response.status === 201) {
        alert("Invoice saved successfully!");
        closeModal();
      } else {
        alert("Failed to save invoice.");
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
      alert("Failed to save invoice.");
    }
  };

  const calculateTotal = () => {
    const { quantity, price, tax, discountType, discountValue } = invoiceData;

    let total = quantity * price;

    if (discountType === "percentage" && discountValue > 0) {
      total -= (total * discountValue) / 100;
    } else if (discountType === "fixed" && discountValue > 0) {
      total -= discountValue;
    }

    total += (total * parseFloat(tax)) / 100;

    return total;
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="min-w-[1300px] p-5 w-full max-h-screen min-h-[700px] overflow-y-auto">
        <DialogHeader className="p-5 border-b">
          <DialogTitle className="text-xl">Add Invoice</DialogTitle>
        </DialogHeader>

        <div className="px-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Owner Input */}
            <div className="flex flex-col">
              <label className="font-medium pb-1.5">Owner</label>
              <input
                type="text"
                name="owner"
                value={invoiceData.owner}
                onChange={handleChange}
                placeholder="Enter Owner Name"
                className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {validationErrors.owner && (
                <span className="text-red-500 text-sm">
                  {validationErrors.owner}
                </span>
              )}
            </div>

            {/* Issue Date */}
            <div className="flex flex-col">
              <label className="font-medium pb-1.5">Issue Date</label>
              <input
                type="date"
                name="issueDate"
                className="p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                value={invoiceData.issueDate}
                onChange={handleChange}
                required
              />
              {validationErrors.issueDate && (
                <span className="text-red-500 text-sm">
                  {validationErrors.issueDate}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
            {/* Due Date */}
            <div className="flex flex-col">
              <label className="font-medium pb-1.5">Due Date</label>
              <input
                type="date"
                name="dueDate"
                className="p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                value={invoiceData.dueDate}
                onChange={handleChange}
                required
              />
              {validationErrors.dueDate && (
                <span className="text-red-500 text-sm">
                  {validationErrors.dueDate}
                </span>
              )}
            </div>

            {/* Status Dropdown */}
            <div className="flex flex-col">
              <label className="font-medium pb-1.5">Status</label>
              <select
                name="status"
                className="p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                value={invoiceData.status}
                onChange={handleChange}
                required
              >
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>
          </div>

          {/* Quantity and Price */}
          <div className="flex justify-between items-center mt-5 bg-[#343a40] p-3 text-white rounded-t-lg">
            <p>Deal</p>
            <p>Quantity</p>
            <p>Price</p>
            <p>Amount</p>
          </div>
          <div className="bg-[#f9f9f9] flex justify-between p-5 items-center gap-5">
            <input
              type="text"
              name="deal"
              className="border p-3 rounded-sm w-[350px]"
              placeholder="Choose a deal"
              value={invoiceData.deal}
              onChange={handleChange}
            />
            <input
              type="number"
              name="quantity"
              className="border rounded-sm p-3"
              placeholder="Enter quantity"
              min="1"
              value={invoiceData.quantity}
              onChange={handleChange}
            />
            {validationErrors.quantity && (
              <span className="text-red-500 text-sm">
                {validationErrors.quantity}
              </span>
            )}
            <input
              type="number"
              name="price"
              className="border rounded-sm p-3"
              placeholder="Price"
              min="0"
              step="1"
              value={invoiceData.price}
              onChange={handleChange}
            />
            {validationErrors.price && (
              <span className="text-red-500 text-sm">
                {validationErrors.price}
              </span>
            )}
            <span className="bg-[#bfc1c4] rounded-sm w-[250px] p-3">
              Rs: {invoiceData.quantity * invoiceData.price}
            </span>
          </div>

          {/* Tax, Discount, Total */}
          <div className="flex flex-col p-3">
            <div className="flex justify-between gap-5 border-b pb-5 items-center mt-5">
              <label className="text-gray-400 text-xl">Tax</label>
              <select
                name="tax"
                className="p-3 border rounded-sm w-[250px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={invoiceData.tax}
                onChange={handleChange}
              >
                <option value="5">5% Tax</option>
                <option value="10">10% Tax</option>
                <option value="15">15% Tax</option>
              </select>
            </div>

            <div className="flex justify-between gap-5 border-b pb-5 items-center mt-5">
              <label className="text-gray-400 text-xl">Discount</label>
              <select
                name="discountType"
                className="p-3 border rounded-sm w-[250px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={invoiceData.discountType}
                onChange={handleChange}
              >
                <option value="none">No Discount</option>
                <option value="fixed">Fixed</option>
                <option value="percentage">Percentage</option>
              </select>
            </div>

            <div className="flex justify-between gap-5 mt-5">
              <label className="text-gray-400 text-xl">Total</label>
              <span className="text-xl">Rs: {calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          {/* Add Note Button */}
          <button
            className="bg-[#4466f2] p-3 rounded-md text-white mt-4"
            onClick={handleAddNoteClick}
          >
            + Add Note
          </button>

          {/* Add Note Section */}
          {isNoteVisible && (
            <div className="mt-4">
              <textarea
                value={note}
                onChange={handleNoteChange}
                className="border h-40 p-3 w-full rounded-md"
                rows="4"
              />

              <button
                className="bg-[#fc6510] p-3 rounded-md text-white mt-2"
                onClick={handleRemoveNoteClick}
              >
                - Remove Note
              </button>
            </div>
          )}

          {/* Save & Cancel Buttons */}
          <div className="border-t mt-5 py-5 flex gap-5 items-center justify-end">
            <button
              className="bg-[#9397a0] p-3 text-white rounded-md px-7"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              className="bg-[#4466f2] text-white p-3 rounded-md px-7"
              onClick={handleSaveInvoice}
            >
              Save
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceModal;
