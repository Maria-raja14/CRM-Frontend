import React from 'react';
import {
  BarChart,
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
  Bar
} from 'recharts';

const dummyData = [
  { x: 0.1, value: 5 },
  { x: 0.2, value: 8 },
  { x: 0.3, value: 4 },
  { x: 0.4, value: 7 },     
  { x: 0.5, value: 6 },
  { x: 0.6, value: 3 },
  { x: 0.7, value: 9 },
  { x: 0.8, value: 4 },
  { x: 0.9, value: 5 },
  { x: 1.0, value: 7 }
];

const ProposalGraf = () => {
  return (
    <div className="h-[600px] bg-white rounded px-5 py-5 mb-12">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
        
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} />  
          <XAxis
            dataKey="x"
            type="number"
            domain={[0, 1]}
            ticks={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]}
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
          />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProposalGraf;



//  import React from 'react'
//  import {
//   BarChart,
//   XAxis,
//   CartesianGrid,
//   ResponsiveContainer
// } from 'recharts';
 
//  const proposalGraf = () => {
//    return (
//      <div>
//      <div className="h-72 bg-white rounded px-2 py-2 mb-12 ">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart
//               data={dummyData}
//               margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
//             >
//               <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} />
//               <XAxis
//                 dataKey="x"
//                 type="number"
//                 domain={[0, 1]}
//                 ticks={[0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]}
//                 tick={{ fill: '#9CA3AF', fontSize: 12 }}
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//      </div>
//    )
//  }
 
//  export default proposalGraf
 