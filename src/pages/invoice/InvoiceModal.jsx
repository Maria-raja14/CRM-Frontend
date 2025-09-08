// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "../../components/ui/dialog";
// import { useModal } from "../../context/ModalContext";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const InvoiceModal = ({ onInvoiceSaved, editingInvoice }) => {
//   const API_URL = import.meta.env.VITE_API_URL;

//   const { isOpen, closeModal } = useModal();
//   const [salesUsers, setSalesUsers] = useState([]);
//   const [deals, setDeals] = useState([]);
//   const [invoiceData, setInvoiceData] = useState({
//     assignTo: "",
//     issueDate: "",
//     dueDate: "",
//     status: "unpaid",
//     deal: "",

//     price: 0,
//     tax: "5",
//     discountType: "none",
//     discountValue: 0,
//     note: "",
//   });
//   const [note, setNote] = useState("");
//   const [isNoteVisible, setIsNoteVisible] = useState(false);
//   const [validationErrors, setValidationErrors] = useState({});

//   // --- Load editing invoice if any ---
//   useEffect(() => {
//     if (editingInvoice) {
//       setInvoiceData({
//         assignTo: editingInvoice.assignTo?._id || "",
//         issueDate: editingInvoice.issueDate
//           ? new Date(editingInvoice.issueDate).toISOString().split("T")[0]
//           : "",
//         dueDate: editingInvoice.dueDate
//           ? new Date(editingInvoice.dueDate).toISOString().split("T")[0]
//           : "",
//         status: editingInvoice.status || "unpaid",
//         deal: editingInvoice.items?.[0]?.deal?._id || "",

//         price: editingInvoice.items?.[0]?.price || 0,
//         tax: editingInvoice.tax?.toString() || "5",
//         discountType: editingInvoice.discountType || "none",
//         discountValue: editingInvoice.discountValue || 0,
//         note: editingInvoice.note || "",
//       });
//       setNote(editingInvoice.note || "");
//       setIsNoteVisible(!!editingInvoice.note);
//     } else {
//       setInvoiceData({
//         assignTo: "",
//         issueDate: "",
//         dueDate: "",
//         status: "unpaid",
//         deal: "",

//         price: 0,
//         tax: "5",
//         discountType: "none",
//         discountValue: 0,
//         note: "",
//       });
//       setNote("");
//       setIsNoteVisible(false);
//     }
//     setValidationErrors({});
//   }, [editingInvoice, isOpen]);

//   // --- Fetch sales users ---
//   useEffect(() => {
//     const fetchSalesUsers = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(`${API_URL}/users`, {
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
//         toast.error("Failed to fetch sales users");
//       }
//     };
//     fetchSalesUsers();
//   }, []);

//   // --- Fetch deals ---
//   useEffect(() => {
//     const fetchDeals = async () => {
//       const token = localStorage.getItem("token");
//       try {
//         const response = await axios.get(`${API_URL}/deals/getAll`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (response.data) {
//           setDeals(response.data);
//         }
//       } catch (err) {
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

//   // --- Validate inputs ---
//   const validateInputs = () => {
//     const errors = {};
//     const { assignTo, issueDate, dueDate, deal, price } = invoiceData;

//     if (!assignTo) errors.assignTo = "Sales user is required.";
//     if (!issueDate) errors.issueDate = "Issue Date is required.";
//     if (!dueDate) errors.dueDate = "Due Date is required.";
//     if (!deal) errors.deal = "Deal is required.";
//     if (price <= 0) errors.price = "Price must be greater than 0.";

//     if (issueDate && dueDate) {
//       const issue = new Date(issueDate);
//       const due = new Date(dueDate);
//       if (due <= issue) {
//         errors.dueDate = "Due Date must be after Issue Date.";
//       }
//     }

//     setValidationErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   // --- Calculate total ---
//   const calculateTotal = (items) => {
//     const { tax, discountType, discountValue } = invoiceData;

//     // subtotal = sum of all item prices
//     let subtotal = items.reduce(
//       (sum, item) => sum + Number(item.price || 0),
//       0
//     );

//     const discountVal = Number(discountValue) || 0;

//     // Apply discount
//     if (discountType === "percentage") {
//       subtotal -= (subtotal * discountVal) / 100;
//     } else if (discountType === "fixed") {
//       subtotal -= discountVal;
//     }

//     subtotal = Math.max(0, subtotal);

//     // Apply tax
//     const taxVal = Number(tax) || 0;
//     const taxAmount = (subtotal * taxVal) / 100;

//     const total = subtotal + taxAmount;
//     return Number(total.toFixed(2));
//   };

//   const calculateAmount = () => {
//     const price = Number(invoiceData.price) || 0;
//     return price.toFixed(2);
//   };

//   // --- Save invoice ---
//   const handleSaveInvoice = async () => {
//     if (!validateInputs()) {
//       toast.error("Please correct the errors in the form.");
//       return;
//     }

//     const items = [
//       {
//         deal: invoiceData.deal,
//         price: Number(invoiceData.price) || 0,
//         amount: Number(invoiceData.price).toFixed(2),
//       },
//     ];

//     const total = calculateTotal(items);

//     const invoiceToSave = {
//       ...invoiceData,
//       items,
//       total,
//       price: Number(invoiceData.price),
//       tax: Number(invoiceData.tax),
//       discountValue: Number(invoiceData.discountValue),
//     };

//     try {
//       const token = localStorage.getItem("token");
//       let response;

//       if (editingInvoice) {
//         response = await axios.put(
//           `${API_URL}/invoice/updateInvoice/${editingInvoice._id}`,
//           invoiceToSave,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         toast.success("Invoice updated successfully!");
//       } else {
//         response = await axios.post(
//           `${API_URL}/invoice/createinvoice`,
//           invoiceToSave,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         toast.success("Invoice created successfully!");
//       }

//       if (response.status === 200 || response.status === 201) {
//         closeModal();
//         if (onInvoiceSaved) onInvoiceSaved();
//       } else {
//         toast.error("Failed to save invoice.");
//       }
//     } catch (error) {
//       toast.error("Failed to save invoice.");
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={closeModal}>
//       <DialogContent className="min-w-[1200px] p-5 w-full max-h-screen min-h-[700px] overflow-y-auto">
//         <DialogHeader className="p-6 border-b">
//           <DialogTitle className="text-xl">
//             {editingInvoice ? "Edit Invoice" : "Add Invoice"}
//           </DialogTitle>
//         </DialogHeader>

//         <div className="px-3">
//           {/* --- Assign & Issue Date --- */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//             <div className="flex flex-col">
//               <label className="font-medium pb-1.5">
//                 Assign To (Sales User)
//               </label>
//               <select
//                 name="assignTo"
//                 value={invoiceData.assignTo}
//                 onChange={handleChange}
//                 className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="">-- Select Sales User --</option>
//                 {salesUsers.map((user) => (
//                   <option key={user._id} value={user._id}>
//                     {user.firstName} {user.lastName}
//                   </option>
//                 ))}
//               </select>
//               {validationErrors.assignTo && (
//                 <span className="text-red-500 text-sm">
//                   {validationErrors.assignTo}
//                 </span>
//               )}
//             </div>

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

//           {/* --- Due Date & Status --- */}
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

//           {/* --- Deal, Price, Amount --- */}
//           <div className="flex justify-between items-center mt-5 bg-[#343a40] p-3 text-white rounded-t-lg">
//             <p>Deal</p>
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
//                   {deal.dealName}
//                 </option>
//               ))}
//             </select>

//             <input
//               type="number"
//               name="price"
//               className="border rounded-sm p-3"
//               min="0"
//               step="0.01"
//               value={invoiceData.price}
//               onChange={handleChange}
//             />
//             {validationErrors.price && (
//               <span className="text-red-500 text-sm">
//                 {validationErrors.price}
//               </span>
//             )}
//             <span className="bg-[#bfc1c4] rounded-sm w-[250px] p-3">
//               Rs: {calculateAmount()}
//             </span>
//           </div>

//           {/* --- Tax, Discount, Total --- */}
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
//               {invoiceData.discountType !== "none" && (
//                 <input
//                   type="number"
//                   name="discountValue"
//                   className="p-3 border rounded-sm w-[250px]"
//                   min="0"
//                   value={invoiceData.discountValue}
//                   onChange={handleChange}
//                 />
//               )}
//             </div>

//             <div className="flex justify-between gap-5 mt-5">
//               <label className="text-gray-400 text-xl">Total</label>
//               <span className="text-xl">
//                 Rs: {calculateTotal([{ price: invoiceData.price }])}
//               </span>
//             </div>
//           </div>

//           {/* --- Notes --- */}
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
//                 type="button"
//               >
//                 - Remove Note
//               </button>
//             </div>
//           )}

//           {/* --- Actions --- */}
//           <div className="border-t py-3 flex gap-5 items-center justify-end">
//             <button
//               className="bg-[#9397a0] p-2 text-white rounded-md px-7"
//               type="button"
//               onClick={closeModal}
//             >
//               Cancel
//             </button>
//             <button
//               className="bg-[#4466f2] text-white p-2 rounded-md px-7"
//               type="button"
//               onClick={handleSaveInvoice}
//             >
//               {editingInvoice ? "Update" : "Save"}
//             </button>
//           </div>

//           <ToastContainer
//             position="top-right"
//             autoClose={3000}
//             hideProgressBar={false}
//           />
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default InvoiceModal;

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { useModal } from "../../context/ModalContext";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InvoiceModal = ({ onInvoiceSaved, editingInvoice }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { isOpen, closeModal } = useModal();

  const [salesUsers, setSalesUsers] = useState([]);
  const [deals, setDeals] = useState([]);
  const [selectedDealRequirement, setSelectedDealRequirement] = useState("");
  const [invoiceData, setInvoiceData] = useState({
    assignTo: "",
    issueDate: "",
    dueDate: "",
    status: "unpaid",
    deal: "",
    price: 0,
    tax: "0",
    discountType: "none",
    discountValue: 0,
    note: "",
  });
  const [note, setNote] = useState("");
  const [isNoteVisible, setIsNoteVisible] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Load editing invoice if any
  useEffect(() => {
    if (editingInvoice) {
      setInvoiceData({
        assignTo: editingInvoice.assignTo?._id || "",
        issueDate: editingInvoice.issueDate
          ? new Date(editingInvoice.issueDate).toISOString().split("T")[0]
          : "",
        dueDate: editingInvoice.dueDate
          ? new Date(editingInvoice.dueDate).toISOString().split("T")[0]
          : "",
        status: editingInvoice.status || "unpaid",
        deal: editingInvoice.items?.[0]?.deal?._id || "",
        price: editingInvoice.items?.[0]?.price || 0,
        tax: editingInvoice.tax?.toString() || "0",
        discountType: editingInvoice.discountType || "none",
        discountValue: editingInvoice.discountValue || 0,
        note: editingInvoice.note || "",
      });
      setNote(editingInvoice.note || "");
      setIsNoteVisible(!!editingInvoice.note);

      const selectedDeal = deals.find(
        (d) => d._id === editingInvoice.items?.[0]?.deal?._id
      );
      setSelectedDealRequirement(selectedDeal?.requirement || "");
    } else {
      setInvoiceData({
        assignTo: "",
        issueDate: "",
        dueDate: "",
        status: "unpaid",
        deal: "",
        price: 0,
        tax: "0",
        discountType: "none",
        discountValue: 0,
        note: "",
      });
      setNote("");
      setIsNoteVisible(false);
      setSelectedDealRequirement("");
    }
    setValidationErrors({});
  }, [editingInvoice, isOpen, deals]);

  // Fetch sales users
  useEffect(() => {
    const fetchSalesUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const filteredSales = (response.data.users || []).filter(
          (user) =>
            user.role &&
            user.role.name &&
            user.role.name.toLowerCase() === "sales"
        );
        setSalesUsers(filteredSales);
      } catch (error) {
        toast.error("Failed to fetch sales users");
      }
    };
    fetchSalesUsers();
  }, []);

  // Fetch deals
  useEffect(() => {
    const fetchDeals = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${API_URL}/deals/getAll`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data) setDeals(response.data);
      } catch (err) {
        toast.error("Failed to fetch deals");
      }
    };
    fetchDeals();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData((prev) => ({ ...prev, [name]: value }));

    if (name === "deal") {
      const selectedDeal = deals.find((d) => d._id === value);
      setSelectedDealRequirement(selectedDeal?.requirement || "");
      if (selectedDeal?.amount) {
        setInvoiceData((prev) => ({ ...prev, price: selectedDeal.amount }));
      }
    }
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

  // Validation
  const validateInputs = () => {
    const errors = {};
    const { assignTo, issueDate, dueDate, deal, price } = invoiceData;

    if (!assignTo) errors.assignTo = "Sales user is required.";
    if (!issueDate) errors.issueDate = "Issue Date is required.";
    if (!dueDate) errors.dueDate = "Due Date is required.";
    if (!deal) errors.deal = "Deal is required.";
    if (price <= 0) errors.price = "Price must be greater than 0.";

    if (issueDate && dueDate) {
      const issue = new Date(issueDate);
      const due = new Date(dueDate);
      if (due <= issue) errors.dueDate = "Due Date must be after Issue Date.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Calculate amount and total
  const calculateAmount = () => {
    return (Number(invoiceData.price) || 0).toFixed(2);
  };

  const calculateTotal = () => {
    let subtotal = Number(invoiceData.price) || 0;

    // Apply discount
    const discountVal = Number(invoiceData.discountValue) || 0;
    if (invoiceData.discountType === "fixed") {
      subtotal -= discountVal;
    } else if (invoiceData.discountType === "percentage") {
      subtotal -= (subtotal * discountVal) / 100;
    }

    subtotal = Math.max(0, subtotal);

    // Apply tax
    const taxVal = Number(invoiceData.tax) || 0;
    let taxAmount = 0;

    if (invoiceData.taxType === "fixed") {
      taxAmount = taxVal;
    } else if (invoiceData.taxType === "percentage") {
      taxAmount = (subtotal * taxVal) / 100;
    }

    const total = subtotal + taxAmount;
    return total.toFixed(2);
  };

  // Save invoice
  const handleSaveInvoice = async () => {
    if (!validateInputs()) {
      toast.error("Please correct the errors in the form.");
      return;
    }

    const items = [
      {
        deal: invoiceData.deal,
        price: Number(invoiceData.price),
        amount: Number(invoiceData.price).toFixed(2),
      },
    ];

    const total = calculateTotal();

    const invoiceToSave = {
      ...invoiceData,
      items,
      total: Number(total),
      price: Number(invoiceData.price),
      tax: Number(invoiceData.tax),
      discountValue: Number(invoiceData.discountValue),
    };

    try {
      const token = localStorage.getItem("token");
      let response;
      if (editingInvoice) {
        response = await axios.put(
          `${API_URL}/invoice/updateInvoice/${editingInvoice._id}`,
          invoiceToSave,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Invoice updated successfully!");
      } else {
        response = await axios.post(
          `${API_URL}/invoice/createinvoice`,
          invoiceToSave,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Invoice created successfully!");
      }

      if (response.status === 200 || response.status === 201) {
        closeModal();
        if (onInvoiceSaved) onInvoiceSaved();
      } else {
        toast.error("Failed to save invoice.");
      }
    } catch (error) {
      toast.error("Failed to save invoice.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="min-w-[1000px] max-w-4xl p-0 overflow-hidden rounded-lg shadow-xl">
        <DialogHeader className="bg-gray-50  text-black p-6">
          <DialogTitle className="text-xl font-semibold">
            {editingInvoice ? "Edit Invoice" : "Create New Invoice"}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 max-h-[80vh] overflow-y-auto ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                  Basic Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assign To (Sales User) *
                    </label>
                    <select
                      name="assignTo"
                      value={invoiceData.assignTo}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                        validationErrors.assignTo
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Sales User</option>
                      {salesUsers.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.firstName} {user.lastName}
                        </option>
                      ))}
                    </select>
                    {validationErrors.assignTo && (
                      <p className="mt-1 text-sm text-red-600">
                        {validationErrors.assignTo}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Issue Date *
                      </label>
                      <input
                        type="date"
                        name="issueDate"
                        value={invoiceData.issueDate}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                          validationErrors.issueDate
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {validationErrors.issueDate && (
                        <p className="mt-1 text-sm text-red-600">
                          {validationErrors.issueDate}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Due Date *
                      </label>
                      <input
                        type="date"
                        name="dueDate"
                        value={invoiceData.dueDate}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                          validationErrors.dueDate
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {validationErrors.dueDate && (
                        <p className="mt-1 text-sm text-red-600">
                          {validationErrors.dueDate}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={invoiceData.status}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    >
                      <option value="unpaid">Unpaid</option>
                      <option value="paid">Paid</option>
                      <option value="send">Send</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    ></path>
                  </svg>
                  Deal Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Deal *
                    </label>
                    <select
                      name="deal"
                      value={invoiceData.deal}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                        validationErrors.deal
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Select a Deal</option>
                      {deals.map((deal) => (
                        <option key={deal._id} value={deal._id}>
                          {deal.dealName}
                        </option>
                      ))}
                    </select>
                    {validationErrors.deal && (
                      <p className="mt-1 text-sm text-red-600">
                        {validationErrors.deal}
                      </p>
                    )}
                  </div>

                  {selectedDealRequirement && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                        Deal Requirements:
                      </p>
                      <p className="text-sm text-blue-700 bg-white p-3 rounded-md border border-blue-100">
                        {selectedDealRequirement}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price *
                      </label>
                      <input
                        type="number"
                        name="price"
                        min="0"
                        step="0.01"
                        value={invoiceData.price}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                          validationErrors.price
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {validationErrors.price && (
                        <p className="mt-1 text-sm text-red-600">
                          {validationErrors.price}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount
                      </label>
                      <div className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg font-medium">
                        Rs: {calculateAmount()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Details */}
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              Financial Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax Type
                </label>
                <select
                  name="taxType"
                  value={invoiceData.taxType || "none"}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="none">Zero Tax</option>
                  <option value="fixed">Fixed Amount</option>
                  <option value="percentage">Percentage</option>
                </select>
              </div>

              {invoiceData.taxType === "fixed" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax Amount
                  </label>
                  <input
                    type="number"
                    name="tax"
                    min="0"
                    step="0.01"
                    value={invoiceData.tax}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="Enter fixed tax amount"
                  />
                </div>
              )}

              {invoiceData.taxType === "percentage" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax Percentage
                  </label>
                  <input
                    type="number"
                    name="tax"
                    min="0"
                    max="100"
                    step="0.01"
                    value={invoiceData.tax}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="Enter tax %"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Type
                </label>
                <select
                  name="discountType"
                  value={invoiceData.discountType}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="none">No Discount</option>
                  <option value="fixed">Fixed Amount</option>
                  <option value="percentage">Percentage</option>
                </select>
              </div>

              {invoiceData.discountType !== "none" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    name="discountValue"
                    min="0"
                    step="0.01"
                    value={invoiceData.discountValue}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-800">
                Total Amount:
              </span>
              <span className="text-xl font-bold text-blue-600">
                Rs: {calculateTotal()}
              </span>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            {!isNoteVisible ? (
              <button
                className="flex items-center text-blue-600 hover:text-blue-800 transition"
                onClick={handleAddNoteClick}
              >
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                Add Note
              </button>
            ) : (
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      ></path>
                    </svg>
                    Notes
                  </label>
                  <button
                    className="text-red-500 hover:text-red-700 text-sm flex items-center transition"
                    onClick={handleRemoveNoteClick}
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                    Remove
                  </button>
                </div>
                <textarea
                  rows="3"
                  value={note}
                  onChange={handleNoteChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Add additional notes..."
                ></textarea>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              className="px-5 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              type="button"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              className="px-5 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition flex items-center"
              type="button"
              onClick={handleSaveInvoice}
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              {editingInvoice ? "Update Invoice" : "Create Invoice"}
            </button>
          </div>
        </div>

        <ToastContainer />
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceModal;
