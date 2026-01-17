import React from "react";
import AdminDashboardLayout from "../../dashboard/AdminDashboardLayout";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import {
  CreditCard,
  ShoppingBag,
  TrendingUp,
  Users,
  CalendarDays,
  ArrowUpRight,
} from "lucide-react";

/* -----------------------------
   MOCK DATA (Replace with API)
------------------------------ */

const revenueTrend = [
  { label: "Mon", revenue: 12000 },
  { label: "Tue", revenue: 18000 },
  { label: "Wed", revenue: 9000 },
  { label: "Thu", revenue: 22000 },
  { label: "Fri", revenue: 30000 },
];

const ordersByCategory = [
  { category: "Kitchen", orders: 58 },
  { category: "Bar", orders: 92 },
];

const kpis = [
  {
    label: "Today’s Revenue",
    value: "KES 145,000",
    trend: "+12.5%",
    icon: <CreditCard />,
    accent: "emerald",
  },
  {
    label: "Total Orders Today",
    value: "150",
    trend: "+8.2%",
    icon: <ShoppingBag />,
    accent: "indigo",
  },
  {
    label: "Avg Order Value",
    value: "KES 3,800",
    trend: "-2.1%",
    icon: <TrendingUp />,
    accent: "amber",
  },
  {
    label: "Active Tables",
    value: "18 / 24",
    trend: "+3",
    icon: <Users />,
    accent: "sky",
  },
  {
    label: "Event Revenue",
    value: "KES 42,000",
    trend: "+18%",
    icon: <CalendarDays />,
    accent: "purple",
  },
];

/* -----------------------------
   COMPONENT
------------------------------ */

const Analytics: React.FC = () => {
  return (
    <AdminDashboardLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-10">

        {/* Header */}
        <header>
          <h1 className="text-3xl font-bold text-white">Admin Overview</h1>
          <p className="text-gray-400 mt-1">
            Executive snapshot of today’s business performance
          </p>
        </header>

        {/* KPIs */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="relative bg-gray-900 border border-gray-800 rounded-2xl p-5 overflow-hidden"
            >
              <div
                className={`absolute -top-6 -right-6 w-24 h-24 bg-${kpi.accent}-500/10 blur-3xl`}
              />

              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-xl bg-${kpi.accent}-500/10 text-${kpi.accent}-400`}>
                  {kpi.icon}
                </div>
                <span
                  className={`flex items-center text-xs font-medium ${
                    kpi.trend.startsWith("+")
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }`}
                >
                  {kpi.trend}
                  <ArrowUpRight size={14} className="ml-1" />
                </span>
              </div>

              <p className="text-gray-400 text-sm mt-4">{kpi.label}</p>
              <p className="text-2xl font-bold text-white mt-1">{kpi.value}</p>
            </div>
          ))}
        </section>

        {/* Charts + Insights */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Revenue Trend */}
          <div className="xl:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-1">
              Revenue Over Time
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Daily revenue performance
            </p>

            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: "#94a3b8" }} />
                  <YAxis
                    tick={{ fill: "#94a3b8" }}
                    tickFormatter={(v) => `KES ${v / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#020617",
                      border: "1px solid #1f2937",
                      borderRadius: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    fill="url(#rev)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Insights Panel */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">Insights</h2>

            <div className="bg-gray-800/50 rounded-xl p-4 text-sm text-gray-300">
              🔥 Peak hours today: <strong>8:00 PM – 10:00 PM</strong>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-4 text-sm text-gray-300">
              🍸 Bar revenue exceeds kitchen by <strong>22%</strong>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-4 text-sm text-gray-300">
              🎉 Event nights increase AOV by <strong>45%</strong>
            </div>
          </div>
        </section>

        {/* Orders by Category */}
        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">
            Orders by Category
          </h2>

          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersByCategory}>
                <CartesianGrid stroke="#1f2937" vertical={false} />
                <XAxis dataKey="category" tick={{ fill: "#94a3b8" }} />
                <YAxis tick={{ fill: "#94a3b8" }} />
                <Tooltip />
                <Bar dataKey="orders" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

      </div>
    </AdminDashboardLayout>
  );
};

export default Analytics;
