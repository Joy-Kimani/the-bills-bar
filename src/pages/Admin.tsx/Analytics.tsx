import React from "react";
import AdminDashboardLayout from "../../dashboard/AdminDashboardLayout";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp, ShoppingBag, CreditCard, ArrowUpRight } from "lucide-react";

const DATA = [
  { day: "Mon", revenue: 12000 },
  { day: "Tue", revenue: 18000 },
  { day: "Wed", revenue: 9000 },
  { day: "Thu", revenue: 22000 },
  { day: "Fri", revenue: 30000 },
];

const STATS = [
  { 
    label: "Total Revenue", 
    value: "KES 145,000", 
    icon: <CreditCard className="text-emerald-400" size={20} />,
    trend: "+12.5%",
    color: "bg-emerald-500/10"
  },
  { 
    label: "Orders Today", 
    value: "38", 
    icon: <ShoppingBag className="text-indigo-400" size={20} />,
    trend: "+5.2%",
    color: "bg-indigo-500/10"
  },
  { 
    label: "Avg Order Value", 
    value: "KES 3,800", 
    icon: <TrendingUp className="text-amber-400" size={20} />,
    trend: "-2.1%",
    color: "bg-amber-500/10"
  },
];

const Analytics: React.FC = () => {
  return (
    <AdminDashboardLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <header>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Business Analytics
          </h1>
          <p className="text-gray-400 mt-1">Real-time performance tracking for your restaurant.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="group relative bg-gray-900 border border-gray-800 hover:border-gray-700 transition-all duration-300 rounded-2xl p-6 overflow-hidden"
            >
              {/* Decorative background glow */}
              <div className={`absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-20 rounded-full ${stat.color}`} />
              
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  {stat.icon}
                </div>
                <span className={`flex items-center text-xs font-medium ${stat.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {stat.trend} <ArrowUpRight size={14} className="ml-1" />
                </span>
              </div>

              <div className="mt-4">
                <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Chart Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Weekly Revenue Trend</h2>
              <p className="text-gray-400 text-sm">Revenue distribution over the last 5 days</p>
            </div>
            <div className="flex gap-2 bg-gray-800 p-1 rounded-lg">
              <button className="px-3 py-1 text-xs font-medium bg-gray-700 text-white rounded-md shadow-sm">Revenue</button>
              <button className="px-3 py-1 text-xs font-medium text-gray-400 hover:text-white transition-colors">Orders</button>
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(val) => `KSh ${val / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#111827', 
                    border: '1px solid #374151', 
                    borderRadius: '12px',
                    color: '#fff' 
                  }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default Analytics;


// 🔔 Toasts (“Reservation Confirmed”)

// 🕒 Real countdown timers to expiry

// 📊 Admin dashboard KPIs

// 🔐 Role-based visibility (Admin vs Staff)

// 🔄 WebSocket real-time updates