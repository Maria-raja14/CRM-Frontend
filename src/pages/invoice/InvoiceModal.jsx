
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "../../components/ui/dialog";
// import { useModal } from "../../context/ModalContext";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// const InvoiceModal = () => {
//   const { isOpen, closeModal } = useModal();
//   const [salesUsers, setSalesUsers] = useState([]);
//   const [deals, setDeals] = useState([]);   // ✅ store deals
//   const [invoiceData, setInvoiceData] = useState({
//     assignTo: "",
//     issueDate: "",
//     dueDate: "",
//     status: "unpaid",
//     deal: "",   // will hold deal _id
//     quantity: 1,
//     price: 0,
//     tax: "5",
//     discountType: "none",
//     discountValue: 0,
//     note: "",
//   });
//   const [note, setNote] = useState("");
//   const [isNoteVisible, setIsNoteVisible] = useState(false);

//   const [validationErrors, setValidationErrors] = useState({});

//   // ✅ Fetch only Sales Users
//   useEffect(() => {
//     const fetchSalesUsers = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get("http://localhost:5000/api/users", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const filteredSales = (response.data.users || []).filter(
//           (user) =>
//             user.role &&
//             user.role.name &&
//             user.role.name.toLowerCase() === "sales"
//         );

//         setSalesUsers(filteredSales);
//       } catch (error) {
//         console.error(error);
//         toast.error("Failed to fetch sales users");
//       }
//     };

//     fetchSalesUsers();
//   }, []);

//   // ✅ Fetch Deals
//   useEffect(() => {
//     const fetchDeals = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/deals/getAll");
//         if (response.data) {
//           setDeals(response.data);
//         }
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to fetch deals");
//       }
//     };
//     fetchDeals();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setInvoiceData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddNoteClick = () => setIsNoteVisible(true);

//   const handleNoteChange = (e) => {
//     setNote(e.target.value);
//     setInvoiceData((prev) => ({ ...prev, note: e.target.value }));
//   };

//   const handleRemoveNoteClick = () => {
//     setIsNoteVisible(false);
//     setNote("");
//     setInvoiceData((prev) => ({ ...prev, note: "" }));
//   };

//   // ✅ Validation
//   const validateInputs = () => {
//     const errors = {};
//     const { assignTo, issueDate, dueDate, deal, quantity, price } = invoiceData;

//     if (!assignTo) errors.assignTo = "Sales user is required.";
//     if (!issueDate) errors.issueDate = "Issue Date is required.";
//     if (!dueDate) errors.dueDate = "Due Date is required.";
//     if (!deal) errors.deal = "Deal is required.";
//     if (quantity <= 0) errors.quantity = "Quantity must be greater than 0.";
//     if (price <= 0) errors.price = "Price must be greater than 0.";

//     setValidationErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   // ✅ Save Invoice
//   const handleSaveInvoice = async () => {
//     if (!validateInputs()) return;

//     const items = [
//       {
//         deal: invoiceData.deal, // this will be deal _id
//         quantity: invoiceData.quantity,
//         price: invoiceData.price,
//         amount: invoiceData.quantity * invoiceData.price,
//       },
//     ];

//     const total = calculateTotal();

//     const invoiceToSave = { ...invoiceData, items, total };

//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.post(
//         "http://localhost:5000/api/invoice/createinvoice",
//         invoiceToSave,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (response.status === 201) {
//         toast.success("Invoice saved successfully!");
//         closeModal();
//       } else {
//         toast.error("Failed to save invoice.");
//       }
//     } catch (error) {
//       console.error("Error saving invoice:", error);
//       toast.error("Failed to save invoice.");
//     }
//   };

//   const calculateTotal = () => {
//     const { quantity, price, tax, discountType, discountValue } = invoiceData;

//     let total = quantity * price;

//     if (discountType === "percentage" && discountValue > 0) {
//       total -= (total * discountValue) / 100;
//     } else if (discountType === "fixed" && discountValue > 0) {
//       total -= discountValue;
//     }

//     total += (total * parseFloat(tax)) / 100;

//     return total;
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={closeModal}>
//       <DialogContent className="min-w-[1200px] p-5 w-full max-h-screen min-h-[700px] overflow-y-auto">
//         <DialogHeader className="p-6 border-b">
//           <DialogTitle className="text-xl">Add Invoice</DialogTitle>
//         </DialogHeader>

//         <div className="px-3">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//             {/* AssignTo Dropdown (Sales Users) */}
//             <div className="flex flex-col">
//               <label className="font-medium pb-1.5">Assign To (Sales User)</label>
//               <select
//                 name="assignTo"
//                 value={invoiceData.assignTo}
//                 onChange={handleChange}
//                 className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="">-- Select Sales User --</option>
//                 {salesUsers.map((user) => (
//                   <option key={user._id} value={user._id}>
//                     {user.firstName} {user.lastName} ({user.email})
//                   </option>
//                 ))}
//               </select>
//               {validationErrors.assignTo && (
//                 <span className="text-red-500 text-sm">
//                   {validationErrors.assignTo}
//                 </span>
//               )}
//             </div>

//             {/* Issue Date */}
//             <div className="flex flex-col">
//               <label className="font-medium pb-1.5">Issue Date</label>
//               <input
//                 type="date"
//                 name="issueDate"
//                 className="p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
//                 value={invoiceData.issueDate}
//                 onChange={handleChange}
//               />
//               {validationErrors.issueDate && (
//                 <span className="text-red-500 text-sm">
//                   {validationErrors.issueDate}
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Due Date + Status */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
//             <div className="flex flex-col">
//               <label className="font-medium pb-1.5">Due Date</label>
//               <input
//                 type="date"
//                 name="dueDate"
//                 className="p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
//                 value={invoiceData.dueDate}
//                 onChange={handleChange}
//               />
//               {validationErrors.dueDate && (
//                 <span className="text-red-500 text-sm">
//                   {validationErrors.dueDate}
//                 </span>
//               )}
//             </div>

//             <div className="flex flex-col">
//               <label className="font-medium pb-1.5">Status</label>
//               <select
//                 name="status"
//                 className="p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
//                 value={invoiceData.status}
//                 onChange={handleChange}
//               >
//                 <option value="paid">Paid</option>
//                 <option value="unpaid">Unpaid</option>
//               </select>
//             </div>
//           </div>

//           {/* Deal Dropdown */}
//           <div className="flex justify-between items-center mt-5 bg-[#343a40] p-3 text-white rounded-t-lg">
//             <p>Deal</p>
//             <p>Quantity</p>
//             <p>Price</p>
//             <p>Amount</p>
//           </div>
//           <div className="bg-[#f9f9f9] flex justify-between p-5 items-center gap-5">
//             <select
//               name="deal"
//               value={invoiceData.deal}
//               onChange={handleChange}
//               className="border p-3 rounded-sm w-[350px]"
//             >
//               <option value="">-- Select Deal --</option>
//               {deals.map((deal) => (
//                 <option key={deal._id} value={deal._id}>
//                   {deal.dealName} {/* (Value: {deal.value}) */}
//                 </option>
//               ))}
//             </select>
//             {validationErrors.deal && (
//               <span className="text-red-500 text-sm">{validationErrors.deal}</span>
//             )}
//             <input
//               type="number"
//               name="quantity"
//               className="border rounded-sm p-3"
//               min="1"
//               value={invoiceData.quantity}
//               onChange={handleChange}
//             />
//             <input
//               type="number"
//               name="price"
//               className="border rounded-sm p-3"
//               min="0"
//               step="1"
//               value={invoiceData.price}
//               onChange={handleChange}
//             />
//             <span className="bg-[#bfc1c4] rounded-sm w-[250px] p-3">
//               Rs: {invoiceData.quantity * invoiceData.price}
//             </span>
//           </div>

//           {/* Tax, Discount, Total */}
//           <div className="flex flex-col p-3">
//             <div className="flex justify-between gap-5 border-b pb-5 items-center mt-5">
//               <label className="text-gray-400 text-xl">Tax</label>
//               <select
//                 name="tax"
//                 className="p-3 border rounded-sm w-[250px] focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={invoiceData.tax}
//                 onChange={handleChange}
//               >
//                 <option value="5">5% Tax</option>
//                 <option value="10">10% Tax</option>
//                 <option value="15">15% Tax</option>
//               </select>
//             </div>

//             <div className="flex justify-between gap-5 border-b pb-5 items-center mt-5">
//               <label className="text-gray-400 text-xl">Discount</label>
//               <select
//                 name="discountType"
//                 className="p-3 border rounded-sm w-[250px]"
//                 value={invoiceData.discountType}
//                 onChange={handleChange}
//               >
//                 <option value="none">No Discount</option>
//                 <option value="fixed">Fixed</option>
//                 <option value="percentage">Percentage</option>
//               </select>
//             </div>

//             <div className="flex justify-between gap-5 mt-5">
//               <label className="text-gray-400 text-xl">Total</label>
//               <span className="text-xl">Rs: {calculateTotal().toFixed(2)}</span>
//             </div>
//           </div>

//           {/* Notes */}
//           <button
//             className="bg-[#4466f2] p-2 rounded-md text-white mt-4"
//             onClick={handleAddNoteClick}
//           >
//             + Add Note
//           </button>

//           {isNoteVisible && (
//             <div className="mt-4">
//               <textarea
//                 value={note}
//                 onChange={handleNoteChange}
//                 className="border h-40 p-3 w-full rounded-md"
//                 rows="4"
//               />
//               <button
//                 className="bg-[#fc6510] p-3 rounded-md text-white mt-2"
//                 onClick={handleRemoveNoteClick}
//               >
//                 - Remove Note
//               </button>
//             </div>
//           )}

//           {/* Actions */}
//           <div className="border-t py-3 flex gap-5 items-center justify-end">
//             <button
//               className="bg-[#9397a0] p-2 text-white rounded-md px-7"
//               onClick={closeModal}
//             >
//               Cancel
//             </button>
//             <button
//               className="bg-[#4466f2] text-white p-2 rounded-md px-7"
//               onClick={handleSaveInvoice}
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default InvoiceModal;//original




import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { useModal } from "../../context/ModalContext";
import { useState, useEffect } from "react";
import axios from "axios";
//import { toast } from "react-toastify";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InvoiceModal = ({ onInvoiceSaved, editingInvoice }) => {
  const { isOpen, closeModal } = useModal();
  const [salesUsers, setSalesUsers] = useState([]);
  const [deals, setDeals] = useState([]);
  const [invoiceData, setInvoiceData] = useState({
    assignTo: "",
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
    if (editingInvoice) {
      setInvoiceData({
        assignTo: editingInvoice.assignTo?._id || "",
        issueDate: editingInvoice.issueDate ? new Date(editingInvoice.issueDate).toISOString().split('T')[0] : "",
        dueDate: editingInvoice.dueDate ? new Date(editingInvoice.dueDate).toISOString().split('T')[0] : "",
        status: editingInvoice.status || "unpaid",
        deal: editingInvoice.items?.[0]?.deal?._id || "",
        quantity: editingInvoice.items?.[0]?.quantity || 1,
        price: editingInvoice.items?.[0]?.price || 0,
        tax: editingInvoice.tax?.toString() || "5",
        discountType: editingInvoice.discountType || "none",
        discountValue: editingInvoice.discountValue || 0,
        note: editingInvoice.note || "",
      });
      setNote(editingInvoice.note || "");
      setIsNoteVisible(!!editingInvoice.note);
    } else {
      setInvoiceData({
        assignTo: "",
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
      setNote("");
      setIsNoteVisible(false);
    }
    setValidationErrors({});
  }, [editingInvoice, isOpen]);

  useEffect(() => {
    const fetchSalesUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const filteredSales = (response.data.users || []).filter(
          (user) =>
            user.role && user.role.name && user.role.name.toLowerCase() === "sales"
        );
        setSalesUsers(filteredSales);
      } catch (error) {
        toast.error("Failed to fetch sales users");
      }
    };

    fetchSalesUsers();
  }, []);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/deals/getAll");
        if (response.data) {
          setDeals(response.data);
        }
      } catch (err) {
        toast.error("Failed to fetch deals");
      }
    };
    fetchDeals();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNoteClick = () => setIsNoteVisible(true);

  const handleNoteChange = (e) => {
    setNote(e.target.value);
    setInvoiceData((prev) => ({ ...prev, note: e.target.value }));
  };

  const handleRemoveNoteClick = () => {
    setIsNoteVisible(false);
    setNote("");
    setInvoiceData((prev) => ({ ...prev, note: "" }));
  };

  const validateInputs = () => {
    const errors = {};
    const { assignTo, issueDate, dueDate, deal, quantity, price } = invoiceData;

    if (!assignTo) errors.assignTo = "Sales user is required.";
    if (!issueDate) errors.issueDate = "Issue Date is required.";
    if (!dueDate) errors.dueDate = "Due Date is required.";
    if (!deal) errors.deal = "Deal is required.";
    if (quantity <= 0) errors.quantity = "Quantity must be greater than 0.";
    if (price <= 0) errors.price = "Price must be greater than 0.";

    // New: Prevent dueDate before or equal to issueDate
    if (issueDate && dueDate) {
      const issue = new Date(issueDate);
      const due = new Date(dueDate);
      if (due < issue) {
        errors.dueDate = "Due Date must be after Issue Date.";
      } else if (due.getTime() === issue.getTime()) {
        errors.dueDate = "Due Date must be after Issue Date.";
      }
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculateTotal = () => {
    const { quantity, price, tax, discountType, discountValue } = invoiceData;

    // Calculation:
    // subtotal = quantity * price
    // apply discount
    // subtotal = subtotal - discount (percentage/fixed)
    // total = subtotal + tax

    let subtotal = quantity * price;
    if (discountType === "percentage" && discountValue > 0) {
      subtotal -= (subtotal * discountValue) / 100;
    } else if (discountType === "fixed" && discountValue > 0) {
      subtotal -= discountValue;
    }
    subtotal = Math.max(0, subtotal); // Prevent negative subtotal

    // Calculate tax on (discounted) subtotal
    let total = subtotal + (subtotal * parseFloat(tax || "0")) / 100;

    // Round to 2 decimals always
    return Number(total.toFixed(2));
  };

  const calculateAmount = () => {
    // For showing item amount = price * quantity (before discount/tax)
    const { quantity, price } = invoiceData;
    return Number((quantity * price).toFixed(2));
  };

  const handleSaveInvoice = async () => {
    if (!validateInputs()) {
      toast.error("Please correct the errors in the form.");
      return;
    }

    const items = [
      {
        deal: invoiceData.deal,
        quantity: Number(invoiceData.quantity),
        price: Number(invoiceData.price),
        amount: Number((invoiceData.quantity * invoiceData.price).toFixed(2)),
      },
    ];

    const total = calculateTotal();

    const invoiceToSave = {
      ...invoiceData,
      items,
      total,
      quantity: Number(invoiceData.quantity),
      price: Number(invoiceData.price),
      tax: Number(invoiceData.tax),
      discountValue: Number(invoiceData.discountValue),
    };

    try {
      const token = localStorage.getItem("token");
      let response;

      if (editingInvoice) {
        response = await axios.put(
          `http://localhost:5000/api/invoice/updateInvoice/${editingInvoice._id}`,
          invoiceToSave,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Invoice updated successfully!");
      } else {
        response = await axios.post(
          "http://localhost:5000/api/invoice/createinvoice",
          invoiceToSave,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Invoice created successfully!");
      }

      if (response.status === 200 || response.status === 201) {
        closeModal();
        if (onInvoiceSaved) {
          onInvoiceSaved();
        }
      } else {
        toast.error("Failed to save invoice.");
      }
    } catch (error) {
      toast.error("Failed to save invoice.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="min-w-[1200px] p-5 w-full max-h-screen min-h-[700px] overflow-y-auto">
        <DialogHeader className="p-6 border-b">
          <DialogTitle className="text-xl">
            {editingInvoice ? "Edit Invoice" : "Add Invoice"}
          </DialogTitle>
        </DialogHeader>

        <div className="px-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* AssignTo Dropdown (Sales Users) */}
            <div className="flex flex-col">
              <label className="font-medium pb-1.5">Assign To (Sales User)</label>
              <select
                name="assignTo"
                value={invoiceData.assignTo}
                onChange={handleChange}
                className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select Sales User --</option>
                {salesUsers.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.firstName} {user.lastName} ({user.email})
                  </option>
                ))}
              </select>
              {validationErrors.assignTo && (
                <span className="text-red-500 text-sm">
                  {validationErrors.assignTo}
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
              />
              {validationErrors.issueDate && (
                <span className="text-red-500 text-sm">
                  {validationErrors.issueDate}
                </span>
              )}
            </div>
          </div>

          {/* Due Date + Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
            <div className="flex flex-col">
              <label className="font-medium pb-1.5">Due Date</label>
              <input
                type="date"
                name="dueDate"
                className="p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                value={invoiceData.dueDate}
                onChange={handleChange}
              />
              {validationErrors.dueDate && (
                <span className="text-red-500 text-sm">
                  {validationErrors.dueDate}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <label className="font-medium pb-1.5">Status</label>
              <select
                name="status"
                className="p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                value={invoiceData.status}
                onChange={handleChange}
              >
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>
          </div>

          {/* Deal Dropdown, Qty, Price, Amount */}
          <div className="flex justify-between items-center mt-5 bg-[#343a40] p-3 text-white rounded-t-lg">
            <p>Deal</p>
            <p>Quantity</p>
            <p>Price</p>
            <p>Amount</p>
          </div>
          <div className="bg-[#f9f9f9] flex justify-between p-5 items-center gap-5">
            <select
              name="deal"
              value={invoiceData.deal}
              onChange={handleChange}
              className="border p-3 rounded-sm w-[350px]"
            >
              <option value="">-- Select Deal --</option>
              {deals.map((deal) => (
                <option key={deal._id} value={deal._id}>
                  {deal.dealName}
                </option>
              ))}
            </select>
            {validationErrors.deal && (
              <span className="text-red-500 text-sm">{validationErrors.deal}</span>
            )}
            <input
              type="number"
              name="quantity"
              className="border rounded-sm p-3"
              min="1"
              value={invoiceData.quantity}
              onChange={handleChange}
            />
            {validationErrors.quantity && (
              <span className="text-red-500 text-sm">{validationErrors.quantity}</span>
            )}
            <input
              type="number"
              name="price"
              className="border rounded-sm p-3"
              min="0"
              step="0.01"
              value={invoiceData.price}
              onChange={handleChange}
            />
            {validationErrors.price && (
              <span className="text-red-500 text-sm">{validationErrors.price}</span>
            )}
            <span className="bg-[#bfc1c4] rounded-sm w-[250px] p-3">
              Rs: {calculateAmount().toFixed(2)}
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
                className="p-3 border rounded-sm w-[250px]"
                value={invoiceData.discountType}
                onChange={handleChange}
              >
                <option value="none">No Discount</option>
                <option value="fixed">Fixed</option>
                <option value="percentage">Percentage</option>
              </select>
              {invoiceData.discountType !== "none" && (
                <input
                  type="number"
                  name="discountValue"
                  className="p-3 border rounded-sm w-[250px]"
                  min="0"
                  value={invoiceData.discountValue}
                  onChange={handleChange}
                />
              )}
            </div>

            <div className="flex justify-between gap-5 mt-5">
              <label className="text-gray-400 text-xl">Total</label>
              <span className="text-xl">Rs: {calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          {/* Notes */}
          <button
            className="bg-[#4466f2] p-2 rounded-md text-white mt-4"
            onClick={handleAddNoteClick}
          >
            + Add Note
          </button>

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
                type="button"
              >
                - Remove Note
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="border-t py-3 flex gap-5 items-center justify-end">
            <button
              className="bg-[#9397a0] p-2 text-white rounded-md px-7"
              type="button"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              className="bg-[#4466f2] text-white p-2 rounded-md px-7"
              type="button"
              onClick={handleSaveInvoice}
            >
              {editingInvoice ? "Update" : "Save"}
            </button>
          </div>
           <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceModal;
