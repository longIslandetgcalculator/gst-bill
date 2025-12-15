import React, { useEffect, useState } from 'react';
import { StorageService } from '../services/storageService';
import { Invoice } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, FileText, ShoppingCart, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
    <div className={`p-3 rounded-full ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
      <Icon size={24} className={color.replace('bg-', 'text-')} />
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
    </div>
  </div>
);

export default function Dashboard() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalGst: 0,
    pendingInvoices: 0,
    totalInvoices: 0
  });

  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const allInvoices = StorageService.getInvoices();
    setInvoices(allInvoices);

    const totalSales = allInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalGst = allInvoices.reduce((sum, inv) => sum + inv.totalTax, 0);
    const pendingInvoices = allInvoices.filter(inv => inv.status === 'Unpaid').length;
    
    setStats({
      totalSales,
      totalGst,
      pendingInvoices,
      totalInvoices: allInvoices.length
    });

    // Prepare chart data (Last 6 months simplified for demo, normally would use date-fns)
    const data = allInvoices.reduce((acc: any, inv) => {
      const month = new Date(inv.date).toLocaleString('default', { month: 'short' });
      const existing = acc.find((d: any) => d.name === month);
      if (existing) {
        existing.sales += inv.totalAmount;
      } else {
        acc.push({ name: month, sales: inv.totalAmount });
      }
      return acc;
    }, []);
    setChartData(data);
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500">Welcome back, here is your business overview.</p>
        </div>
        <div className="text-sm text-slate-400">
          Powered by https://calculatordekho.com
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Sales" 
          value={`₹${stats.totalSales.toLocaleString()}`} 
          icon={DollarSign} 
          color="bg-green-500" 
        />
        <StatCard 
          title="GST Collected" 
          value={`₹${stats.totalGst.toLocaleString()}`} 
          icon={TrendingUp} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Total Invoices" 
          value={stats.totalInvoices} 
          icon={FileText} 
          color="bg-purple-500" 
        />
        <StatCard 
          title="Pending Invoices" 
          value={stats.pendingInvoices} 
          icon={ShoppingCart} 
          color="bg-orange-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Monthly Earnings</h2>
          <div className="h-64">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="sales" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                No data available yet
              </div>
            )}
          </div>
        </div>

        {/* Top Products (Placeholder logic for demo) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Invoices</h2>
          <div className="space-y-4">
            {invoices.slice(0, 5).map(inv => (
              <div key={inv.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer border border-slate-100">
                <div>
                  <p className="font-medium text-slate-800">{inv.buyer.name}</p>
                  <p className="text-xs text-slate-500">{inv.invoiceNumber}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-700">₹{inv.totalAmount.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
            {invoices.length === 0 && <p className="text-slate-400 text-sm">No recent invoices.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
