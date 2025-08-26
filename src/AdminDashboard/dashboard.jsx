import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';

const AdminDashboard = () => {
  const summary = [
    { title: "Total Leads", value: 120, change: "+3.5%", color: "text-blue-500" },
    { title: "Deals Won", value: 35, change: "+2.7%", color: "text-green-500" },
    { title: "Revenue", value: "₹1,25,000", change: "+1.5%", color: "text-purple-500" },
  ];

  const pipeline = [
    { stage: "Qualification", leads: 5 },
    { stage: "Negotiation", leads: 8 },
    { stage: "Proposal Sent", leads: 3 },
    { stage: "Closed Won", leads: 2 },
  ];

  const recentLeads = [
    { name: "John", status: "New", assigned: "Alice" },
    { name: "Mike", status: "Contacted", assigned: "Bob" },
    { name: "Sara", status: "Qualified", assigned: "Alice" },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {summary.map((item, idx) => (
          <Card key={idx} className="shadow-lg">
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <p className="text-3xl font-bold">{item.value}</p>
              <p className={`${item.color} font-medium`}>{item.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts + Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Bar Chart */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Pipeline Board</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipeline} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
                <XAxis dataKey="stage" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="leads" fill="#3B82F6" barSize={30} radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Circular Progress Example */}
        <Card className="shadow-lg flex justify-center items-center p-6">
          <div style={{ width: 120, height: 120 }}>
            <CircularProgressbar
              value={62}
              text={`1,860 / 3k`}
              styles={buildStyles({
                pathColor: "#3B82F6",
                textColor: "#111827",
                trailColor: "#E5E7EB",
              })}
            />
          </div>
        </Card>
      </div>

      {/* Recent Leads Table */}
      <Card className="shadow-lg overflow-x-auto">
        <CardHeader>
          <CardTitle>Recent Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Lead</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Assigned</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map((lead, idx) => (
                <tr key={idx} className="border-b">
                  <td className="px-4 py-2">{lead.name}</td>
                  <td className="px-4 py-2">{lead.status}</td>
                  <td className="px-4 py-2">{lead.assigned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
