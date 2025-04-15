import React from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline"; // Notepad-like icon

const Proposaldetails = () => {
  const data = []; // your data array (currently empty)

  return (
    <div className="overflow-x-auto bg-white rounded-md shadow p-4">
    
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-500 py-16">
        
         <PencilSquareIcon className="h-16 w-16 mb-4 text-gray-300" />
          <p className="text-lg font-semibold">Nothing to show here</p>
          <p className="text-sm mt-1">
            Please add a new entity or manage the data table to see the content here
          </p>
       
        </div>
      ) : (
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-gray-400 border-b">
              <th className="px-4 py-2">Owner Name</th>
              <th className="px-4 py-2">Proposal Sent</th>
              <th className="px-4 py-2">Start Date</th>
              <th className="px-4 py-2">End Date</th>
              <th className="px-4 py-2">Age of Activity</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2">{item.owner}</td>
                <td className="px-4 py-2">{item.proposalSent}</td>
                <td className="px-4 py-2">{item.startDate}</td>
                <td className="px-4 py-2">{item.endDate}</td>
                <td className="px-4 py-2">{item.age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Proposaldetails;



// import React from "react";

// const Proposaldetails = () => {
//   return (
//     <div>
//       <table>
//         <thead className="text-gray-400 flex justify-between items-center">
//           <th>Owner Name</th>
//           <th> Proposal sent</th>
//           <th> Start date</th>
//           <th>End date</th>
//           <th> Age of activity</th>
//         </thead>
//       </table>
//     </div>
//   );
// };

// export default Proposaldetails;
