import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import { useModal } from "../../context/ModalContext.jsx"; // ✅ Correct import
import InvoiceModal from "./InvoiceModal.jsx";
import axios from "axios";
import { FaEllipsisV } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";

const InvoiceHead = () => {
  const { openModal } = useModal(); // ✅ Get function to open modal
  const [startDate, setStartDate] = useState(null);
  const [invoices, setInvoices] = useState([]); // To store fetched invoices
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalDue, setTotalDue] = useState(0);

  // Function to generate and download PDF ......
  const generatePDF = (invoice) => {
    const doc = new jsPDF();

    // Ensure items array exists and has at least one element
    const dealName =
      invoice.items && invoice.items.length > 0 ? invoice.items[0].deal : "N/A";

    doc.text(`Invoice #${invoice.invoicenumber}`, 14, 10);
    doc.text(`Deal Name: ${invoice.dealName}`, 14, 20);0
    doc.text(`Leads: ${invoice.leads || "N/A"}`, 14, 30);
    doc.text(`Status: ${invoice.status || "N/A"}`, 14, 40);
    doc.text(`Payment Method: ${invoice.paymentMethod || "N/A"}`, 14, 50);
    doc.text(`Amount: Rs. ${invoice.total || 0}`, 14, 60);
    doc.text(`Owner: ${invoice.owner || "N/A"}`, 14, 70);
    doc.text(`Tax: Rs. ${invoice.tax || 0}`, 14, 80);

    doc.save(`Invoice_${invoice.invoicenumber}.pdf`);

    console.log(generatePDF);
  };

  // Track which row's dropdown is open
  const [openIndex, setOpenIndex] = useState(null);

  const handleMenuToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index); 
  };

  // Action handlers
  const handleSendEmail = (invoice) => {
    console.log(`Sending email for invoice ${invoice.invoicenumber}`);
  
  };

 
  const handleChangeEdit = (invoices) => {
    console.log(`Changing invoice ${invoices}`);
  };


  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/invoice/getInvoice"
        ); 
        setInvoices(response.data); 
        calculateTotals(response.data); 
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchInvoices();
  }, []);

  // Calculate the totals (Amount, Paid, Due)
  const calculateTotals = (invoices) => {
    let totalAmount = 0;
    let totalPaid = 1000;
    let totalDue = 0;

    invoices.forEach((invoice) => {
      totalAmount += invoice.total;
      totalPaid -= invoice.total; // Assuming you have `paidAmount` field
      totalDue = invoice.total; // Assuming you have `dueAmount` field
    });

    setTotalAmount(totalAmount);
    setTotalPaid(totalPaid);
    setTotalDue(totalDue);
  };

  // Handle form submission for creating new invoice
  const createInvoice = async (invoiceData) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/invoices",
        invoiceData
      );
      setInvoices([...invoices, response.data]); // Add new invoice to the state
      calculateTotals([...invoices, response.data]); // Recalculate totals
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };
  // delete API calling
  const handleDelete = async (invoiceId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/auth/invoice/delete/${invoiceId}`
      );
      setInvoices(invoices.filter((invoice) => invoice._id !== invoiceId)); // Remove deleted invoice from state
      console.log(`Deleted invoice ${invoiceId}`);
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  return (
    <div className="bg-[#f9f9f9]">
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl">Invoices</h1>
          <button
            onClick={openModal} // ✅ Open modal on button click
            className="bg-[#4466f2] p-2 px-4 text-white rounded-sm"
          >
            Create invoices
          </button>
        </div>
      </div>
      <InvoiceModal onSubmit={createInvoice} />{" "}
      {/* Pass createInvoice to the modal */}
      <div className="flex justify-between gap-5 items-center mt-10">
        {/* Total Amount */}
        <div className="bg-[#4466f2] p-6 py-5 pl-9 pr-[250px] text-white rounded-sm">
          <h3 className="text-xl">Total Amount</h3>
          <p className="text-sm">Rs.{totalAmount.toFixed(2)}</p>
        </div>

        {/* Total Paid */}
        <div className="bg-[#46c35f] p-5 py-5 pl-9 pr-[250px] text-white rounded-sm">
          <h3 className="text-xl">Total Paid</h3>
          <p className="text-sm">Rs.1586952.000</p>
        </div>

        {/* Total Due */}
        <div className="bg-[#fc6510] p-5 py-5 pl-9 pr-[250px] text-white rounded-sm">
          <h3 className="text-xl">Total Due</h3>
          <p className="text-sm">Rs.1586952.000</p>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mt-10">
        {/* Filter Buttons Section */}
        <div className="flex items-center gap-2">
          {/* Date Picker Button */}
          <div className="relative">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy/MM/dd"
              className="hidden" // Hide the default input field
              isOpen={false}
            />
            <button
              className="px-3 py-2 text-gray-400 shadow-2xl bg-white rounded-lg"
              onClick={() => setStartDate(null)} // Reset date
            >
              <FaCalendarAlt className="text-xl" /> {/* Calendar Icon */}
            </button>
          </div>

          {/* Filter Buttons */}
          <button className="px-7 py-2 shadow-2xl text-gray-400 bg-white rounded-3xl">
            Created Date
          </button>
          <button className="px-7 py-2 shadow-2xl text-gray-400 bg-white rounded-3xl">
            Owner
          </button>
          <button className="px-7 py-2 shadow-2xl text-gray-400 bg-white rounded-3xl">
            Payment Status
          </button>
          <button className="px-7 py-2 shadow-2xl text-gray-400 bg-white rounded-3xl">
            Payment Methods
          </button>
        </div>

        {/* Search Input Section */}
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search"
            className="p-1.5 border rounded-3xl w-[250px] bg-white"
          />
        </div>
      </div>
      <p className=" mt-4 text-gray-400">Showing 0 To 0 items of 0</p>
      <div className="bg-white p-5 w-full h-screen mt-3">
        <div className="pt-5 px-5">
          <table className="w-full p-10">
            <thead className="py-10">
              <tr>
                <td className="text-left pb-5 font-semibold text-gray-400">
                  Invoice number
                </td>
                <td className="text-left pb-5 font-semibold text-gray-400">
                  Deal name
                </td>
                <td className="text-left pb-5 font-semibold text-gray-400">
                  Leads
                </td>
                <td className="text-left pb-5 font-semibold text-gray-400">
                  Status
                </td>
                <td className="text-left  pb-5 font-semibold text-gray-400">
                  Payment Method
                </td>
                <td className="text-left pb-5 font-semibold text-gray-400">
                  Amount
                </td>
                <td className="text-left pb-5 font-semibold text-gray-400">
                  Owner
                </td>
                <td className="text-left pb-5 font-semibold text-gray-400">
                  Tax
                </td>
                <td className="text-left pb-5 font-semibold text-gray-400">
                  Action
  
                </td>
              </tr>
            </thead>
            <tbody className="">
              {invoices.map((invoice, index) => (
                <tr key={invoice._id} className="border-t">
                  <td className="text-left  ">{invoice.invoicenumber}</td>
 
                  <td className="text-left h-2">{invoice.items[0].deal}</td>
                  <td className="text-left">{invoice.leads}</td>
                  <td
                    className={`text-center py-3 rounded-sm ${  
                      invoice.status === "paid"
                        ? "bg-green-500 h-5 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {invoice.status}
                  </td> 

                  <td className="text-left ">{invoice.paymentMethod}</td>
                  <td className="text-left">{invoice.total}</td>
                  <td className="text-left">{invoice.owner}</td>
                  <td className="text-left">{invoice.tax}</td>
                  <td className="text-left relative">      
                    <button
                      className="px-4 py-2 text-gray-600"
                      onClick={() => handleMenuToggle(index)}
                    >
                      <FaEllipsisV className="text-lg" />
                    </button>

                    {openIndex === index && (
                      <div className="absolute right-0 bg-white shadow-md rounded-sm mt-2 w-48 border z-10">
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-200"
                          onClick={() => {
                            handleSendEmail(invoice);
                            setOpenIndex(null);
                          }}
                        >
                          Send to Mail
                        </button>
                        <button
                          className=" text-black text-right px-4 py-2 rounded-md"
                          onClick={generatePDF}
                        >
                          Download
                        </button>

                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-200"
                          onClick={() => {
                            handleDelete(invoice._id);
                            setOpenIndex(null);
                          }}
                        >
                          Delete
                        </button>

                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-200"
                          onClick={() => {
                            handleChangeEdit({
                              ...invoice,
                              status:
                                invoice.status === "paid" ? "unpaid" : "paid",
                            });
                            setOpenIndex(null);
                          }}
                        >
                          Change to{" "}
                          {invoice.status === "paid" ? "unpaid" : "paid"}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoiceHead;

// import React, { useState } from "react";
// import DatePicker from "react-datepicker";
// import { FaCalendarAlt } from "react-icons/fa";
// import { useModal } from "../../context/ModalContext.jsx"; // ✅ Correct import
// import InvoiceModal from "./InvoiceModal.jsx";

// const InvoiceHead = () => {
//   const { openModal } = useModal(); // ✅ Get function to open modal
//   const [startDate, setStartDate] = useState(null);

//   return (
//     <div className="bg-[#f9f9f9]">
//       <div className="flex flex-col gap-5">
//         <div className="flex justify-between items-center">
//           <h1 className="text-2xl">Invoices</h1>
//           <button
//             onClick={openModal} // ✅ Open modal on button click
//             className="bg-[#4466f2] p-2 px-4 text-white rounded-sm"
//           >
//             Create invoices
//           </button>
//         </div>
//       </div>
//       <InvoiceModal />

//       <div className="flex justify-between gap-5 items-center mt-10">
//         {/* Total Amount */}
//         <div className="bg-[#4466f2] p-6 py-5 pl-9 pr-[250px] text-white rounded-sm">
//           <h3 className="text-xl">Total Amount</h3>
//           <p className="text-sm">Rs.1,581,764,393.07</p>
//         </div>

//         {/* Total Paid */}
//         <div className="bg-[#46c35f] p-5 py-5 pl-9 pr-[250px] text-white rounded-sm">
//           <h3 className="text-xl">Total Paid</h3>
//           <p className="text-sm">Rs.1,561,599,035.37</p>
//         </div>

//         {/* Total Due */}
//         <div className="bg-[#fc6510] p-5 py-5 pl-9 pr-[250px] text-white rounded-sm">
//           <h3 className="text-xl">Total Due</h3>
//           <p className="text-sm">Rs.20,165,357.70</p>
//         </div>
//       </div>

//       <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mt-10">
//         {/* Filter Buttons Section */}
//         <div className="flex items-center gap-2">
//           {/* Date Picker Button */}
//           <div className="relative">
//             <DatePicker
//               selected={startDate}
//               onChange={(date) => setStartDate(date)}
//               dateFormat="yyyy/MM/dd"
//               className="hidden" // Hide the default input field
//               isOpen={false}
//             />
//             <button
//               className="px-3 py-2 text-gray-400 shadow-2xl bg-white rounded-lg"
//               onClick={() => setStartDate(null)} // Reset date
//             >
//               <FaCalendarAlt className="text-xl" /> {/* Calendar Icon */}
//             </button>
//           </div>

//           {/* Filter Buttons */}
//           <button className="px-7 py-2 shadow-2xl text-gray-400 bg-white rounded-3xl">
//             Created Date
//           </button>
//           <button className="px-7 py-2 shadow-2xl text-gray-400 bg-white rounded-3xl">
//             Owner
//           </button>
//           <button className="px-7 py-2 shadow-2xl text-gray-400 bg-white rounded-3xl">
//             Payment Status
//           </button>
//           <button className="px-7 py-2 shadow-2xl text-gray-400 bg-white rounded-3xl">
//             Payment Methods
//           </button>
//         </div>

//         {/* Search Input Section */}
//         <div className="flex items-center">
//           <input
//             type="text"
//             placeholder="Search"
//             className="p-1.5 border rounded-3xl w-[250px] bg-white"
//           />
//         </div>
//       </div>

//       <p className=" mt-4 text-gray-400">Showing 0 To 0 items of 0</p>

//       <div className="bg-white w-full h-screen mt-3">
// <div className="pt-5 px-5">
// <table className="w-full p-5">
//           <thead className="p-10">
//             <tr className="     ">
//               <td className="text-left pb-5 font-semibold text-gray-400">Invoice number</td>
//               <td className="text-left pb-5 font-semibold text-gray-400">Deal name</td>
//               <td className="text-left pb-5 font-semibold text-gray-400">Leads</td>
//               <td className="text-left pb-5 font-semibold text-gray-400"> Status</td>
//               <td className="text-left pb-5 font-semibold text-gray-400">Payment Method</td>
//               <td className="text-left pb-5 font-semibold text-gray-400">Amount</td>
//               <td className="text-left pb-5 font-semibold text-gray-400">Owner</td>
//               <td className="text-left pb-5 font-semibold text-gray-400">Tax</td>
//               <td className="text-left pb-5 font-semibold text-gray-400">Action</td>
//             </tr>
//           </thead>
//         </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InvoiceHead;

// import React, { useState } from "react";
// import DatePicker from "react-datepicker";
// import { FaCalendarAlt } from "react-icons/fa";

// const invoiceHead = () => {
//   const [startDate, setStartDate] = useState(null);
//   return (
//     <div className="bg-[#f9f9f9] ">
//       <div className="flex flex-col gap-5">
//         <div className="flex justify-between items-center">
//           <h1 className="text-2xl">Invoices </h1>
//           <button className="bg-[#4466f2] p-2 px-4 text-white rounded-sm">
//             Create invoices
//           </button>
//         </div>

//         <div className="flex justify-between gap-4 items-center ">
//           <div className="bg-[#4466f2] p-5 py-5 pl-9 pr-[240px] text-white   rounded-sm   ">
//             <h3 className="text-xl ">Total amount</h3>
//             <p className="text-sm">Rs.1,581,764,393.07</p>
//           </div>
//           <div className="bg-[#46c35f] p-5 py-5 pl-9 pr-[240px]  text-white  rounded-sm">
//             <h3 className="text-xl ">Total paid</h3>
//             <p className="text-sm">Rs.1,561,599,035.37</p>
//           </div>
//           <div className="bg-[#fc6510] p-5 py-5 pl-9 pr-[240px]  text-white rounded-sm">
//             <h3 className="text-xl ">Total due</h3>
//             <p className="text-sm">Rs.20,165,357.70</p>
//           </div>
//         </div>

//         <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mt-10">
//           <div className="flex items-center gap-2">
//             <div className="relative">
//               <DatePicker
//                 selected={startDate}
//                 onChange={(date) => setStartDate(date)}
//                 dateFormat="yyyy/MM/dd"
//                 className="hidden" // Hide the default input field
//                 isOpen={false}
//               />
//               <button
//                 className="px-3 py-2  text-gray-400 shadow-2xl   bg-white rounded-3xl "
//                 onClick={() => setStartDate(null)}
//               >
//                 <FaCalendarAlt className="text-xl\" /> {/* Calendar Icon */}
//               </button>
//             </div>
//             <button className="px-7 py-2 shadow-2xl   text-gray-400 bg-white rounded-3xl ">
//               Created date
//             </button>
//             <button className="px-7 py-2 shadow-2xl  text-gray-400 bg-white rounded-3xl">
//               Owner
//             </button>
//             <button className="px-7 py-2 shadow-2xl  text-gray-400 bg-white rounded-3xl">
//               Payment Status
//             </button>
//             <button className="px-7 py-2 shadow-2xl   text-gray-400 bg-white rounded-3xl">
//               Payment Methods
//             </button>
//           </div>
//           <div className="flex items-center">
//             <input
//               type="text"
//               placeholder="Search"
//               className="p-1.5 border  rounded-3xl w-[250px] bg-white "
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default invoiceHead;
