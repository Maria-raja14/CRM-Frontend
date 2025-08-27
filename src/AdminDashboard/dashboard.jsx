import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
// or if AdminDashboard is in src/AdminDashboard/

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const AdminDashboard = () => {
  const summary = [
    { title: "Total Leads", value: 120, color: "bg-blue-500" },
    { title: "Deals Won", value: 35, color: "bg-green-500" },
    { title: "Revenue", value: "₹1,25,000", color: "bg-purple-500" },
    { title: "Pending Invoices", value: 12, color: "bg-orange-500" },
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

  const pendingDeals = [
    { deal: "A1", value: "50k", stage: "Qualification" },
    { deal: "B2", value: "25k", stage: "Negotiation" },
  ];

  const recentInvoices = [
    { invoice: "INV-101", total: "12,500", status: "Paid" },
    { invoice: "INV-102", total: "5,000", status: "Unpaid" },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summary.map((card, idx) => (
          <Card key={idx} className={`${card.color} text-white`}>
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pipeline + Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Board</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipeline} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <XAxis dataKey="stage" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="leads" fill="#008ECC" barSize={30} radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Leads Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLeads.map((lead, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{lead.name}</TableCell>
                    <TableCell>{lead.status}</TableCell>
                    <TableCell>{lead.assigned}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Pending Deals & Recent Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pending Deals</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Deal</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Stage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingDeals.map((deal, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{deal.deal}</TableCell>
                    <TableCell>{deal.value}</TableCell>
                    <TableCell>{deal.stage}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice#</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentInvoices.map((inv, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{inv.invoice}</TableCell>
                    <TableCell>{inv.total}</TableCell>
                    <TableCell>{inv.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
