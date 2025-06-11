import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import { useModal } from "../../context/ModalContext.jsx"; // ✅ Correct import
import InvoiceModal from "./InvoiceModal.jsx";
import axios from "axios";
import { FaEllipsisV } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ Correct import

const InvoiceHead = () => {
  const { openModal } = useModal(); // ✅ Get function to open modal
  const [startDate, setStartDate] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalDue, setTotalDue] = useState(0);
  const [filterOwner, setFilterOwner] = useState("");
const [filterStatus, setFilterStatus] = useState("");
const [filterMethod, setFilterMethod] = useState("");
const [searchTerm, setSearchTerm] = useState("");


  const [totals, setTotals] = useState({ totalAmount: 0, totalPaid: 0, totalDue: 0 });
  const [openIndex, setOpenIndex] = useState(null);


  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/auth/invoice/getInvoice");
      setInvoices(response.data);
      calculateTotals(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  const calculateTotals = (invoices) => {
    let totalAmount = 0, totalPaid = 1000, totalDue = 0;
    invoices.forEach((invoice) => {
      totalAmount += invoice.total;
      totalPaid -= invoice.total;
      totalDue = invoice.total;
    });
    setTotals({ totalAmount, totalPaid, totalDue });
  };

  const createInvoice = async (invoiceData) => {
    try {
      const response = await axios.post("http://localhost:5000/api/invoices", invoiceData);
      setInvoices([...invoices, response.data]);
      calculateTotals([...invoices, response.data]);
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };

  const handleDelete = async (invoiceId) => {
    try {
      await axios.delete(`http://localhost:5000/api/auth/invoice/delete/${invoiceId}`);
      setInvoices(invoices.filter((invoice) => invoice._id !== invoiceId));
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };



  
  const generatePDF = (invoice) => {
    const doc = new jsPDF();
  
    // Header Section (Logo, Title, Border)
    // Optional Logo
    // doc.addImage('logo.png', 'PNG', 14, 10, 30, 20);
  
    // Title Section
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0); // Black color for text
    doc.text("Invoice", 105, 20, { align: "center" });
  
    // Header Border
    doc.setLineWidth(0.5);
    doc.rect(10, 10, 190, 30); // Border around the title section
  
    // Invoice Details Section
    doc.setFontSize(12);
    const details = [
      ["Invoice #", invoice.invoicenumber || "N/A"],
      ["Owner", invoice.owner || "N/A"],

      ["Status", invoice.status || "N/A"],
      ["Payment Method", invoice.paymentMethod || "N/A"],
    ];
  
    let yPosition = 50;
    details.forEach((detail) => {
      doc.text(`${detail[0]}: ${detail[1]}`, 14, yPosition);
      yPosition += 10;
    });
  
    // Table for Items
    autoTable(doc, {
      startY: yPosition + 10,
      head: [["Deal Name", "Amount (Rs.)"]],
      body: invoice.items.map((item) => [item.deal || "N/A", item.amount || "0"]),
      theme: "grid",
      styles: {
        halign: "center",
        fontSize: 10,
      },
      headStyles: {
        fontSize: 12,
        fontStyle: 'bold',
        fillColor: [40, 116, 166], // Blue header background
        textColor: [255, 255, 255], // White text for headers
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240], // Light gray for alternating rows
      },
    });
  
    // Total & Tax Section
    let finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 116, 166); // Blue color for Total Amount
    doc.text(`Total Amount: Rs. ${invoice.total || 0}`, 14, finalY);
  
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0); // Black color for Tax
    doc.text(`Tax: Rs. ${invoice.tax || 0}`, 14, finalY + 10);
  
    // Footer Section (Company Info)
    const footerY = finalY + 25;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0); // Black color for footer
    doc.text("Company Name | Address | Phone Number | Email", 105, footerY, { align: "center" });
  
    // Optional footer with terms or additional info
    doc.setFontSize(8);
    doc.setTextColor(169, 169, 169); // Grey color for terms text
    doc.text("Terms & Conditions: Payment due within 30 days.", 105, footerY + 10, { align: "center" });
  
    // Save the document
    doc.save(`Invoice_${invoice.invoicenumber}.pdf`);
  };
  




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
          `http://localhost:5000/api/auth/invoice/getInvoice`
        );
        setInvoices(response.data);
        calculateTotals(response.data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchInvoices();
  }, []);



  return (
    <div className="">
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl">Invoices</h1>
          <button
            onClick={openModal}
            className="bg-[#4466f2] p-2 px-4 text-white rounded-sm"
          >
            Create invoices
          </button>
        </div>
      </div>
      <InvoiceModal onSubmit={createInvoice} />{" "}
      {/* Pass createInvoice to the modal */}
      <div className="flex justify-between gap-4 items-center mt-10">
        {/* Total Amount */}
        <div className="bg-[#4466f2]  py-5 pl-5 pr-[150px] text-white rounded-sm">
          <h3 className="text-xl">Total Amount</h3>
          <p className="text-sm">Rs.{totalAmount.toFixed(2)}</p>
        </div>

        {/* Total Paid */}
        <div className="bg-[#46c35f]  py-5 pl-5 pr-[250px] text-white rounded-sm">
          <h3 className="text-xl">Total Paid</h3>
          <p className="text-sm">Rs.1586952.00</p>
        </div>

        {/* Total Due */}
        <div className="bg-[#fc6510]  py-5 pl-5 pr-[250px] text-white rounded-sm">
          <h3 className="text-xl">Total Due</h3>
          <p className="text-sm">Rs.18596952.00</p>
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
              className="hidden" //Hide the default input field
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
                  Invoice Number
                </td>
                <td className="text-left pb-5 font-semibold text-gray-400">
                  Deal Name
                </td>
                {/* <td className="text-left pb-5 font-semibold text-gray-400">
                  Leads
                </td> */}
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
              <tr key={invoice._id} className="border-t hover:bg-gray-100">
                <td className="p-2">{invoice.invoicenumber}</td>
                <td className="p-2">{invoice.items[0]?.deal || "N/A"}</td>
                {/* <td className="p-2">{invoice.leads}</td> */}
                <td className={`p-2 text-center text-white rounded ${invoice.status === "paid" ? "bg-green-500" : "bg-red-500"}`}>{invoice.status}</td>
                <td className="p-2">{invoice.paymentMethod}</td>
                <td className="p-2">Rs.{invoice.total}</td>
                <td className="p-2">{invoice.owner}</td>
                <td className="p-2">Rs.{invoice.tax}</td>
                <td className="p-2 relative">
                  <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="text-gray-600">
                    <FaEllipsisV />
                  </button>
                  {openIndex === index && (
                    <div className="absolute right-0 bg-white shadow-md rounded border mt-2 z-10">
                      <button className="block w-full text-left px-4 py-2 hover:bg-gray-200" onClick={() => generatePDF(invoice)}>Download </button>
                      <button className="block w-full text-left px-4 py-2 hover:bg-gray-200" onClick={() => handleDelete(invoice._id)}>Delete</button>
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

// import React, { useState, useEffect } from "react";
// import DatePicker from "react-datepicker";
// import { FaCalendarAlt, FaEllipsisV } from "react-icons/fa";
// import { useModal } from "../../context/ModalContext.jsx";
// import InvoiceModal from "./InvoiceModal.jsx";
// import axios from "axios";
// import jsPDF from "jspdf";

// const InvoiceHead = () => {
//   const { openModal } = useModal();
//   const [startDate, setStartDate] = useState(null);
//   const [invoices, setInvoices] = useState([]);
//   const [totals, setTotals] = useState({ totalAmount: 0, totalPaid: 0, totalDue: 0 });
//   const [openIndex, setOpenIndex] = useState(null);

//   useEffect(() => {
//     fetchInvoices();
//   }, []);

//   const fetchInvoices = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/api/auth/invoice/getInvoice");
//       setInvoices(response.data);
//       calculateTotals(response.data);
//     } catch (error) {
//       console.error("Error fetching invoices:", error);
//     }
//   };

//   const calculateTotals = (invoices) => {
//     let totalAmount = 0, totalPaid = 1000, totalDue = 0;
//     invoices.forEach((invoice) => {
//       totalAmount += invoice.total;
//       totalPaid -= invoice.total;
//       totalDue = invoice.total;
//     });
//     setTotals({ totalAmount, totalPaid, totalDue });
//   };

//   const createInvoice = async (invoiceData) => {
//     try {
//       const response = await axios.post("http://localhost:5000/api/invoices", invoiceData);
//       setInvoices([...invoices, response.data]);
//       calculateTotals([...invoices, response.data]);
//     } catch (error) {
//       console.error("Error creating invoice:", error);
//     }
//   };

//   const handleDelete = async (invoiceId) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/auth/invoice/delete/${invoiceId}`);
//       setInvoices(invoices.filter((invoice) => invoice._id !== invoiceId));
//     } catch (error) {
//       console.error("Error deleting invoice:", error);
//     }
//   };

//   const generatePDF = (invoice) => {
//     const doc = new jsPDF();
//     doc.text(`Invoice #${invoice.invoicenumber}`, 14, 10);
//     doc.text(`Deal Name: ${invoice.items[0]?.deal || "N/A"}`, 14, 20);
//     doc.text(`Leads: ${invoice.leads || "N/A"}`, 14, 30);
//     doc.text(`Status: ${invoice.status || "N/A"}`, 14, 40);
//     doc.text(`Payment Method: ${invoice.paymentMethod || "N/A"}`, 14, 50);
//     doc.text(`Amount: Rs. ${invoice.total || 0}`, 14, 60);
//     doc.text(`Owner: ${invoice.owner || "N/A"}`, 14, 70);
//     doc.text(`Tax: Rs. ${invoice.tax || 0}`, 14, 80);
//     doc.save(`Invoice_${invoice.invoicenumber}.pdf`);
//   };

//   return (
//     <div className="bg-[#f9f9f9] p-5">
//       <div className="flex justify-between items-center mb-5">
//         <h1 className="text-2xl">Invoices</h1>
//         <button onClick={openModal} className="bg-blue-600 p-2 px-4 text-white rounded">Create Invoice</button>
//       </div>
//       <InvoiceModal onSubmit={createInvoice} />

//       <div className="flex justify-between gap-5 items-center mt-5">
//         {Object.entries(totals).map(([key, value]) => (
//           <div key={key} className="bg-blue-600 p-5 text-white rounded">
//             <h3 className="text-xl capitalize">{key.replace("total", "Total ")}</h3>
//             <p className="text-sm">Rs.{value.toFixed(2)}</p>
//           </div>
//         ))}
//       </div>

//       <div className="bg-white p-5 mt-5">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="border-b">
//               {['Invoice #', 'Deal Name', 'Leads', 'Status', 'Payment Method', 'Amount', 'Owner', 'Tax', 'Action'].map((header) => (
//                 <th key={header} className="text-left p-2 font-semibold text-gray-500">{header}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {invoices.map((invoice, index) => (
//               <tr key={invoice._id} className="border-t hover:bg-gray-100">
//                 <td className="p-2">{invoice.invoicenumber}</td>
//                 <td className="p-2">{invoice.items[0]?.deal || "N/A"}</td>
//                 <td className="p-2">{invoice.leads}</td>
//                 <td className={`p-2 text-center text-white rounded ${invoice.status === "paid" ? "bg-green-500" : "bg-red-500"}`}>{invoice.status}</td>
//                 <td className="p-2">{invoice.paymentMethod}</td>
//                 <td className="p-2">Rs.{invoice.total}</td>
//                 <td className="p-2">{invoice.owner}</td>
//                 <td className="p-2">Rs.{invoice.tax}</td>
//                 <td className="p-2 relative">
//                   <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="text-gray-600">
//                     <FaEllipsisV />
//                   </button>
//                   {openIndex === index && (
//                     <div className="absolute right-0 bg-white shadow-md rounded border mt-2 z-10">
//                       <button className="block w-full text-left px-4 py-2 hover:bg-gray-200" onClick={() => generatePDF(invoice)}>Download PDF</button>
//                       <button className="block w-full text-left px-4 py-2 hover:bg-gray-200" onClick={() => handleDelete(invoice._id)}>Delete</button>
//                     </div>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default InvoiceHead;


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
