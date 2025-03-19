// import React, { useState } from "react";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import { FaFileExcel, FaCloudUploadAlt } from "react-icons/fa";
// import axios from "axios";
// import { toast } from "react-toastify";

// const DragDropUpload = ({ setShowImportPersons }) => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [uploadSuccess, setUploadSuccess] = useState(null);
//   const [includeCustomFields, setIncludeCustomFields] = useState(false);
//   const [dataSaved, setDataSaved] = useState(false);
//   const [parsedData, setParsedData] = useState([]); // Store parsed data but don't upload yet

//   const downloadSampleFile = () => {
//     const sampleData = [
//       [
//         "Organization Name",
//         "LeadGroup ID",
//         "Owner",
//         "Created By Email",
//         "Owner Email",
//         "Country",
//         "City",
//         "State",
//         "Zip Code",
//       ],
//       [
//         "Tech Corp",
//         "605b0d1e5f1b2c6f7c2d1234",
//         "hello",
//         "admin@techcorp.com",
//         "john.doe@techcorp.com",
//         "USA",
//         "New York",
//         "NY",
//         "10001",
//       ],
//       [
//         "InnoSoft",
//         "605b0d1e5f1b2c6f7c2d5678",
//         "hello",
//         "admin@innosoft.com",
//         "jane.smith@innosoft.com",
//         "UK",
//         "London",
//         "LDN",
//         "SW1A 1AA",
//       ],
//     ];
//     const worksheet = XLSX.utils.aoa_to_sheet(sampleData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Organizations");
//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });
//     const data = new Blob([excelBuffer], { type: "application/octet-stream" });
//     saveAs(data, "Sample_Organizations.xlsx");
//   };

//   // 🟢 Handle File Upload (Parse only, do not upload)
//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     setSelectedFile(file);
//     setLoading(true);

//     const reader = new FileReader();
//     reader.readAsBinaryString(file);

//     reader.onload = (e) => {
//       const binaryData = e.target.result;
//       const workbook = XLSX.read(binaryData, { type: "binary" });
//       const sheetName = workbook.SheetNames[0];
//       const sheet = workbook.Sheets[sheetName];
//       const jsonData = XLSX.utils.sheet_to_json(sheet);

//       const formattedData = jsonData.map((row) => ({
//         organizationName: row["Organization Name"]?.trim() || "",
//         leadGroup: row["LeadGroup ID"]?.trim() || "",
//         owner: row["Owner Email"]?.trim() || "",
//         created_by_email: row["Created By Email"]?.trim() || "",
//         owner_email: row["Owner Email"]?.trim() || "",
//         addressDetails: {
//           country: row["Country"]?.trim() || "",
//           city: row["City"]?.trim() || "",
//           state: row["State"]?.trim() || "",
//           zipCode: row["Zip Code"]?.trim() || "",
//         },
//       }));

//       setParsedData(formattedData); 
//       setUploadSuccess(null); 
//       setLoading(false);
//     };
//   };


//   const handleSave = async () => {
//     if (parsedData.length === 0) {
//       alert("Please upload a file first before saving.");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/organization/bulk-upload",
//         { organizations: parsedData }
//       );
//       setUploadSuccess(true);
//       setDataSaved(true);
//       toast.success("File uploaded successfully and data saved!");
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       setUploadSuccess(false);
//       alert("Error uploading file. Please check the format.");
//     }
//   };

//   const removeFile = () => {
//     setSelectedFile(null);
//     setParsedData([]); 
//   };
//   const handleCancel = () => {
//     setSelectedFile(null); 
//     setParsedData([]); 
//     setUploadSuccess(null);
//     setDataSaved(false); 
//     setShowImportPersons(false); 
//   };

//   return (
//     <div className="bg-white p-6 shadow-md rounded-md">
//       <div className="flex items-center gap-4 mb-4">
//         <label className="text-gray-700">
//           We would like to provide you a sample .CSV file:
//         </label>
//         <div className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             id="customFields"
//             checked={includeCustomFields}
//             onChange={() => setIncludeCustomFields(!includeCustomFields)}
//           />
//           <label
//             htmlFor="customFields"
//             className="text-gray-600 cursor-pointer"
//           >
//             Include custom fields
//           </label>
//           <button
//             onClick={downloadSampleFile}
//             className="text-blue-500 underline"
//           >
//             Download Update File
//           </button>
//         </div>
//       </div>

//       <div className="border-dashed border-1 border-blue-500 p-8 text-center rounded-md h-[200px] flex flex-col items-center justify-center relative">
//         {selectedFile ? (
//           <div className="absolute left-4 flex flex-col items-center justify-center bg-gray-100 p-4 rounded-md w-[150px] h-[150px]">
//             <FaFileExcel className="text-green-500 text-5xl mb-2" />
//             <span className="text-gray-700 text-sm truncate w-full text-center">
//               {selectedFile.name}
//             </span>
//             <button
//               onClick={removeFile}
//               className="text-red-500 underline text-sm mt-1"
//             >
//               Remove file
//             </button>
//           </div>
//         ) : (
//           <>
//             <FaCloudUploadAlt className="text-blue-500 text-6xl mb-2" />
//             <p className="text-gray-500 text-lg font-medium">Drag and drop</p>
//             <p className="text-gray-400">or</p>
//             <label className="text-blue-500 underline cursor-pointer font-medium">
//               Browse
//               <input
//                 type="file"
//                 className="hidden"
//                 onChange={handleFileUpload}
//                 accept=".xlsx,.csv"
//               />
//             </label>
//           </>
//         )}
//       </div>

//       {uploadSuccess !== null && (
//         <p
//           className={`mt-4 ${
//             uploadSuccess ? "text-green-600" : "text-red-600"
//           }`}
//         >
//           {uploadSuccess
//             ? "Upload successful!"
//             : "Upload failed. Please try again."}
//         </p>
//       )}

//       {/* Save & Cancel Buttons */}
//       <div className="flex gap-4 mt-6">
//         <button
//           className="bg-blue-500 text-white px-6 py-2 rounded"
//           onClick={handleSave}
//           disabled={parsedData.length === 0} // Disable until file is uploaded
//         >
//           {dataSaved ? "Saved " : "Save"}
//         </button>

//         <button
//           className="bg-gray-500 text-white px-6 py-2 rounded"
//           onClick={handleCancel}
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// };

// export default DragDropUpload;



import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaFileExcel, FaCloudUploadAlt } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const DragDropUpload = ({ setShowImportPersons }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [dataSaved, setDataSaved] = useState(false);
  const [parsedData, setParsedData] = useState([]);

  // 🟢 Download Sample File
  const downloadSampleFile = () => {
    const sampleData = [
      ["Organization Name", "LeadGroup ID", "Owner", /* "Created By Email", */ /* "Owner Email", */ "Country", "City", "State", "Zip Code"],
      ["Tech Corp", "605b0d1e5f1b2c6f7c2d1234", "zebra forest", /* "admin@techcorp.com", *//*  "john.doe@techcorp.com", */ "USA", "New York", "NY", "10001"],
      ["InnoSoft", "605b0d1e5f1b2c6f7c2d5678", "zebra forest", /* "admin@innosoft.com", */ /* "jane.smith@innosoft.com", */ "UK", "London", "LDN", "SW1A 1AA"],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Organizations");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, "Sample_Organizations.xlsx");
  };

  // 🟢 Process File (Works for File Input & Drag-Drop)
  const processFile = (file) => {
    if (!file) return;
    setSelectedFile(file);
    setLoading(true);

    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = (e) => {
      const binaryData = e.target.result;
      const workbook = XLSX.read(binaryData, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const formattedData = jsonData.map((row) => ({
        organizationName: row["Organization Name"]?.trim() || "",
        leadGroup: row["LeadGroup ID"]?.trim() || "",
        owner: row["Owner Email"]?.trim() || "",
       /*  created_by_email: row["Created By Email"]?.trim() || "", */
        /* owner_email: row["Owner Email"]?.trim() || "", */
        addressDetails: {
          country: row["Country"]?.trim() || "",
          city: row["City"]?.trim() || "",
          state: row["State"]?.trim() || "",
          zipCode: row["Zip Code"]?.trim() || "",
        },
      }));

      setParsedData(formattedData);
      setUploadSuccess(null);
      setLoading(false);
    };
  };

  // 🟢 Handle Drag & Drop
  const handleFileDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    processFile(file);
  };

  // 🟢 Prevent Default Drag-Over Behavior
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // 🟢 Save Data to Backend
  const handleSave = async () => {
    if (parsedData.length === 0) {
      alert("Please upload a file first before saving.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/organization/bulk-upload",
        { organizations: parsedData }
      );
      setUploadSuccess(true);
      setDataSaved(true);
      toast.success("File uploaded successfully and data saved!");
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadSuccess(false);
      alert("Error uploading file. Please check the format.");
    }
  };

  // 🟢 Remove Selected File
  const removeFile = () => {
    setSelectedFile(null);
    setParsedData([]);
  };

  // 🟢 Cancel Upload Process
  const handleCancel = () => {
    setSelectedFile(null);
    setParsedData([]);
    setUploadSuccess(null);
    setDataSaved(false);
    setShowImportPersons(false);
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-md">
      <div className="flex items-center gap-4 mb-4">
        <label className="text-gray-700">We would like to provide you a sample .CSV file:</label>
        <button onClick={downloadSampleFile} className="text-blue-500 underline">
          Download Update File
        </button>
      </div>

      {/* 🟢 Drag & Drop Area */}
      <div
        className="border-dashed border-2 border-blue-500 p-8 text-center rounded-md h-[200px] flex flex-col items-center justify-center relative"
        onDrop={handleFileDrop}
        onDragOver={handleDragOver}
      >
        {selectedFile ? (
          <div className="absolute left-4 flex flex-col items-center justify-center bg-gray-100 p-4 rounded-md w-[150px] h-[150px]">
            <FaFileExcel className="text-green-500 text-5xl mb-2" />
            <span className="text-gray-700 text-sm truncate w-full text-center">
              {selectedFile.name}
            </span>
            <button onClick={removeFile} className="text-red-500 underline text-sm mt-1">
              Remove file
            </button>
          </div>
        ) : (
          <>
            <FaCloudUploadAlt className="text-blue-500 text-6xl mb-2" />
            <p className="text-gray-500 text-lg font-medium">Drag and drop</p>
            <p className="text-gray-400">or</p>
            <label className="text-blue-500 underline cursor-pointer font-medium">
              Browse
              <input type="file" className="hidden" onChange={(e) => processFile(e.target.files[0])} accept=".xlsx,.csv" />
            </label>
          </>
        )}
      </div>

      {/* 🟢 Upload Status */}
      {uploadSuccess !== null && (
        <p className={`mt-4 ${uploadSuccess ? "text-green-600" : "text-red-600"}`}>
          {uploadSuccess ? "Upload successful!" : "Upload failed. Please try again."}
        </p>
      )}

      {/* 🟢 Save & Cancel Buttons */}
      <div className="flex gap-4 mt-6">
        <button className="bg-blue-500 text-white px-6 py-2 rounded" onClick={handleSave} disabled={parsedData.length === 0}>
          {dataSaved ? "Saved" : "Save"}
        </button>
        <button className="bg-gray-500 text-white px-6 py-2 rounded" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DragDropUpload;
