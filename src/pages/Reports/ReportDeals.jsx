
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  XAxis,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import { ChevronDown } from 'lucide-react';


const dummyData = Array.from({ length: 11 }, (_, i) => ({ x: i / 10 }));

const ReportDeals = () => {
  const [deals, setDeals] = useState([]);
  const [selectedStage, setSelectedStage] = useState("Visit Completed"); // won by default
  const [title, setTitle] = useState("How many deals were won?");
  const [dropdownOpen, setDropdownOpen] = useState(false); // for dropdown modal

  useEffect(() => {
    fetchDeals();
  }, [selectedStage]); // re-fetch on filter change

  const fetchDeals = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/alldeals");
      const filteredDeals = res.data.filter(deal => deal.stage === selectedStage);

      const grouped = filteredDeals.reduce((acc, deal) => {
        const owner = deal.owner;
        const created = new Date(deal.createdAt);
        const closed = new Date(deal.expectingClosingDate);
        const ageInMinutes = (closed - created) / (1000 * 60); 

        if (!acc[owner]) {
          acc[owner] = {
            owner,
            count: 0,
            totalValue: 0,
            totalAgeMinutes: 0
          };
        }

        acc[owner].count += 1;
        acc[owner].totalValue += deal.dealsValue;
        acc[owner].totalAgeMinutes += ageInMinutes;

        return acc;
      }, {});

      const finalData = Object.values(grouped).map(item => {
        const avgValue = item.totalValue / item.count;
        const avgAgeMinutes = item.totalAgeMinutes / item.count;
        const days = Math.floor(avgAgeMinutes / 1440);
        const hours = Math.floor((avgAgeMinutes % 1440) / 60);
        const minutes = Math.floor(avgAgeMinutes % 60);

        return {
          owner: item.owner,
          stage: item.count,
          dealsValue: `$ ${item.totalValue}`,
          avgValue: `$ ${avgValue.toFixed(2)}`,
          expectingClosingDate: `${days} days ${hours} hours ${minutes} minutes`
        };
      });

      setDeals(finalData);
    } catch (error) {
      console.error("Error fetching deals:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative">
          <button className="bg-white border border-gray-50 text-sm px-4 py-2 rounded shadow-sm hover:bg-gray-50">
            Lead Conversion
          </button>
        </div>

        {/* ✅ Dropdown Toggle */}
        <div className="relative">
        <button
  onClick={() => setDropdownOpen(!dropdownOpen)}
  className="bg-white border border-gray-50 text-sm px-4 py-2 rounded shadow-sm hover:bg-gray-50 flex items-center gap-2"
>
  {title}
  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
</button>


          {dropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-white border rounded-md shadow-lg z-10">
              <div className="py-2">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    setSelectedStage("Deal Lost");
                    setTitle("How many deals were lost?");
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                >
                  <span className="mr-2">😞</span> How many deals were lost?
                </button>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    setSelectedStage("Visit Completed");
                    setTitle("How many deals were won?");
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                >
                  <span className="mr-2">🏅</span> How many deals were won?
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          <button className="bg-white border border-gray-50 shadow-sm text-sm px-4 py-2 rounded-full">
            Created date
          </button>
        </div>
      </div>

      <div className='bg-white shadow-xl p-6'>
        {/* Chart Area */}
        <div className="h-72 bg-white rounded px-2 py-2 mb-12 ">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dummyData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} />
              <XAxis
                dataKey="x"
                type="number"
                domain={[0, 1]}
                ticks={[0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Table Area */}
        <div className="bg-white rounded-md overflow-x-auto p-4 mb-8">
          <table className="min-w-full text-sm text-left">
            <thead className="text-gray-500 font-semibold">
              <tr>
                <th className="px-6 py-3">Owner Name</th>
                <th className="px-6 py-3">Deals {selectedStage === "Visit Completed" ? "won" : "lost"}</th>
                <th className="px-6 py-3">Total deals value</th>
                <th className="px-6 py-3">Avg deals value</th>
                <th className="px-6 py-3">Avg. age of deal (days)</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {deals.map((deal, index) => (
                <tr key={index} className="border-t border-gray-100">
                  <td className="px-6 py-3 text-blue-600 font-medium">{deal.owner}</td>
                  <td className="px-6 py-3">{deal.stage}</td>
                  <td className="px-6 py-3">{deal.dealsValue}</td>
                  <td className="px-6 py-3">{deal.avgValue}</td>
                  <td className="px-6 py-3">{deal.expectingClosingDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportDeals;
