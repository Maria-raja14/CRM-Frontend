import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

const data = [
  { name: "Qualified", value: 2 },
  { name: "Negotiation", value: 2.5 },
  { name: "Prospects", value: 1 },
  { name: "Proposal", value: 1.5 },
  { name: "Average", value: 2, isAverage: true },
  { name: "Won", value: 3.5 },
  { name: "Lost", value: 4 },
];

export default function ByStageChart() {
  return (
    <div className="p-4  ">
      {/* Sort By */}
      <div className="flex justify-end items-center mb-4">
        <span className="mr-2 text-sm text-gray-700">Order report by:</span>
        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm mr-2">Count</button>
        <button className="px-3 py-1 border border-gray-300 text-sm rounded text-gray-700">Value</button>
      </div>

      {/* Chart */}
      <div className="h-[480px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
            barCategoryGap={5}
          >
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
            <XAxis
              type="number"
              domain={[0, 5]}
              tickCount={11}
              tickFormatter={(tick) => tick}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: "#6b7280", fontSize: 14 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip />
            <Bar
              dataKey="value"
              barSize={26}
              label={{ position: "right", fill: "#4B5563", fontSize: 12 }}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isAverage ? "#46cc97" : "#2e69ff"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table Section */}
      {/* <div className="mt-20">
        <OwnerTable />
      </div> */}
    </div>
  );
}
