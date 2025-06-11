import React from "react";
import { Bar } from "react-chartjs-2";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const lineData = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Open",
        data: [1, 0, 1, 0, 0, 5, 0],
        borderColor: "blue",
        backgroundColor: "blue",
      },
      {
        label: "Won",
        data: [0, 0, 0.5, 0, 0, 0, 0],
        borderColor: "green",
        backgroundColor: "green",
      },
      {
        label: "Lost",
        data: [0, 0, 0, 0, 0, 0.5, 1],
        borderColor: "orange",
        backgroundColor: "orange",
      },
      {
        label: "Total",
        data: [1, 0, 2, 0, 0, 5, 1],
        borderColor: "purple",
        backgroundColor: "purple",
      },
    ],
  };

  const pipelineData = {
    labels: [
      "Lead Conversion", "Advertising", "Sales", "Average", "veronika", "текущие объекты",
      "ARAFAT PIPELINE", "Ejemplo", "closed deal", "test", "aaaa", "ki", "ai",
      "Houses", "teste", "development", "ptest", "ABC", "dharma"
    ],
    datasets: [
      {
        label: "Deals",
        data: [18, 17, 13, 4, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        backgroundColor: (ctx) =>
          ctx.raw === 4 ? "#22c55e" : "#3b82f6", // Green for value 4, blue for others
      },
    ],
  };
  const pipelineOptions = {
    indexAxis: "y", // Horizontal bar chart
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { beginAtZero: true },
      y: {
        ticks: {
          autoSkip: false,
          font: {
            size: 10,
          },
        },
      },
    },
  };

  const topOwnersData = {
  labels: ["Admin 1", "General Manager", "Rosey Martin"],
  datasets: [
    {
      label: "Deals",
      data: [46, 27, 23],
      backgroundColor: "#3b82f6",
    },
  ],
};
const topOwnersOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};  

  const doughnutData = {
    labels: ["Open", "Won", "Lost"],
    datasets: [
      {
        data: [59, 23, 14],
        backgroundColor: ["blue", "green", "orange"],
      },
    ],
  };

  // Keep everything as-is above until return (
return (
  <div className="h-screen p-6 space-y-6">
       <h2 className="text-lg font-semibold">Dashboard</h2>
    {/* Top Graph Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Deals Overview */}
      <div className="bg-white p-6 rounded-xl shadow-2xl">
        <h2 className="text-xl font-semibold mb-4">Deals Overview</h2>
        <div className="flex flex-wrap gap-3 mb-4 text-sm text-blue-600 font-medium">
          {["Last Seven Days", "This Week", "Last Week", "This Month", "Last Month", "This Year"].map((label) => (
            <span key={label} className="cursor-pointer">{label}</span>
          ))}
        </div>
        <Line data={lineData} />
        <div className="flex justify-around mt-4 text-sm">
          <span className="text-blue-600">Open 7</span>
          <span className="text-green-600">Won 1</span>
          <span className="text-orange-500">Lost 1</span>
          <span className="text-purple-600">Total 9</span>
        </div>
      </div>

      {/* Total Deals */}
      <div className="bg-white p-6 rounded-xl shadow-2xl flex flex-col items-center">
        <h2 className="text-xl font-semibold mb-4">Total Deals</h2>
        <div className="text-2xl bg-blue-100 text-blue-800 px-6 py-2 rounded-full mb-4">96</div>
        <div>
        <Doughnut data={doughnutData} />
        </div>
        
        <div className="flex justify-around w-full mt-4 text-sm">
          
          <span className="text-blue-600">Open 59</span>
          <span className="text-green-600">Won 23</span>
          <span className="text-orange-500">Lost 14</span>
        </div>
      </div>
    </div>

    {/* Summary Cards */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Total Leads</h2>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">110</span>
        </div>
        <div className="space-y-4">
          <SummaryItem icon="📁" label="Total organizations" value="13" />
          <SummaryItem icon="👤" label="People" value="97" />
          <SummaryItem icon="🙋‍♂️" label="Total participants" value="14" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Total Employees</h2>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">4</span>
        </div>
        <div className="space-y-4">
          <SummaryItem icon="👔" label="Work as owner" value="3" />
          <SummaryItem icon="🤝" label="Work as collaborator" value="3" />
          <SummaryItem icon="🔁" label="Work as both" value="3" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-2xl p-6 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-lg font-bold">5</div>
            <div className="text-sm text-gray-500">Total sent proposal</div>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-lg font-bold">5</div>
            <div className="text-sm text-gray-500">Total accepted proposal</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <DoughnutChart percent={10} label="Sending rate" color="#3b82f6" />
          <DoughnutChart percent={100} label="Acceptance rate" color="#10b981" />
        </div>
      </div>
    </div>

    {/* Charts Section: Pipeline and Top Owners */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-2xl lg:col-span-2">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Pipeline Conversion</h2>
        <Bar data={pipelineData} options={pipelineOptions} />
      </div>
      <div className="bg-white p-6 rounded-xl shadow-2xl">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Top 5 Owners</h2>
        <Bar data={topOwnersData} options={topOwnersOptions} />
      </div>
    </div>
  </div>
);

};

// Helper: Summary Item Card
const SummaryItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-4">
    <div className="bg-blue-100 text-blue-600 p-3 rounded-full text-xl">
      {icon}
    </div>
    <div>
      <div className="text-lg font-bold">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  </div>
);

// Helper: Donut Chart Card
const DoughnutChart = ({ percent, label, color }) => {
  const data = {
    labels: [],
    datasets: [{
      data: [percent, 100 - percent],
      backgroundColor: [color, "#e5e7eb"],
      borderWidth: 0,
      cutout: "70%",
    }],
  };

  return (
    <div className="bg-gray-50 p-4 rounded text-center">
      <Doughnut data={data} />
      <div className="mt-2 text-sm font-medium">{label}</div>

    </div>
  );
};

export default Dashboard;
