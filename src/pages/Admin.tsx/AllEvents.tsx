import React, { useMemo, useState } from "react";
import AdminDashboardLayout from "../../dashboard/AdminDashboardLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  CalendarDays,
  Users,
  DollarSign,
  TrendingUp,
} from "lucide-react";

/* ----------------------------------
   TYPES
---------------------------------- */
interface EventAnalytics {
  id: number;
  name: string;
  date: string;
  capacity: number;
  tickets_sold: number;
  revenue: number;
}

/* ----------------------------------
   MOCK DATA
---------------------------------- */
const MOCK_EVENTS: EventAnalytics[] = [
  {
    id: 1,
    name: "Ladies Night",
    date: "2026-01-10",
    capacity: 120,
    tickets_sold: 110,
    revenue: 165000,
  },
  {
    id: 2,
    name: "DJ Night",
    date: "2026-01-12",
    capacity: 150,
    tickets_sold: 90,
    revenue: 135000,
  },
  {
    id: 3,
    name: "Live Band Friday",
    date: "2026-01-14",
    capacity: 180,
    tickets_sold: 70,
    revenue: 98000,
  },
];

/* ----------------------------------
   HELPERS
---------------------------------- */
const percentDiff = (value: number, peak: number) => {
  if (!peak) return 0;
  return Math.round(((value - peak) / peak) * 100);
};

/* ----------------------------------
   COMPONENT
---------------------------------- */
const AllEvents: React.FC = () => {
  const [events] = useState<EventAnalytics[]>(MOCK_EVENTS);

  const totals = useMemo(() => {
    return {
      events: events.length,
      tickets: events.reduce((a, b) => a + b.tickets_sold, 0),
      revenue: events.reduce((a, b) => a + b.revenue, 0),
      attendance: Math.round(
        (events.reduce((a, b) => a + b.tickets_sold, 0) /
          events.reduce((a, b) => a + b.capacity, 0)) *
          100
      ),
    };
  }, [events]);

  const peakRevenue = Math.max(...events.map(e => e.revenue));
  const peakTickets = Math.max(...events.map(e => e.tickets_sold));

  return (
    <AdminDashboardLayout>
      <div className="max-w-7xl mx-auto px-8 py-10 text-white space-y-10">

        {/* Header */}
        <div>
          <p className="text-[#d4af37] uppercase tracking-[0.4em] text-xs mb-2">
            Events Intelligence
          </p>
          <h1 className="text-4xl font-light italic">
            Events <span className="text-[#d4af37] font-bold">Analytics</span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Revenue, attendance & performance insights
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {[
            { label: "Total Events", value: totals.events, icon: <CalendarDays /> },
            { label: "Tickets Sold", value: totals.tickets, icon: <Users /> },
            { label: "Total Revenue", value: `KES ${totals.revenue.toLocaleString()}`, icon: <DollarSign /> },
            { label: "Avg Attendance", value: `${totals.attendance}%`, icon: <TrendingUp /> },
          ].map((kpi, i) => (
            <div
              key={i}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex justify-between"
            >
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-widest">
                  {kpi.label}
                </p>
                <h3 className="text-2xl font-bold mt-2">{kpi.value}</h3>
              </div>
              <div className="p-3 bg-black rounded-lg text-[#d4af37]">
                {kpi.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">
            Revenue by Event
          </h2>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={events}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <Tooltip
                  content={({ payload }) => {
                    if (!payload || !payload[0]) return null;
                    const e = payload[0].payload;
                    const diff = percentDiff(e.revenue, peakRevenue);

                    return (
                      <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 text-sm">
                        <p className="font-semibold text-white">{e.name}</p>
                        <p className="text-emerald-400">
                          Revenue: KES {e.revenue.toLocaleString()}
                        </p>
                        <p
                          className={`mt-1 ${
                            diff === 0
                              ? "text-yellow-400"
                              : diff < 0
                              ? "text-rose-400"
                              : "text-emerald-400"
                          }`}
                        >
                          {diff === 0
                            ? "Top Revenue Event"
                            : `${Math.abs(diff)}% ${
                                diff < 0 ? "below" : "above"
                              } top`}
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar
                  dataKey="revenue"
                  fill="#6366f1"
                  radius={[6, 6, 0, 0]}
                  opacity={0.85}
                  activeBar={{ opacity: 1 }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Event Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {events.map(ev => {
            const attendance = Math.round(
              (ev.tickets_sold / ev.capacity) * 100
            );

            const insights: string[] = [];
            if (ev.revenue === peakRevenue) insights.push("Top Revenue");
            if (ev.tickets_sold === peakTickets) insights.push("Most Tickets");
            if (attendance >= 85) insights.push("High Attendance");
            if (attendance < 60) insights.push("Low Conversion");

            return (
              <div
                key={ev.id}
                className="bg-gradient-to-br from-black via-zinc-900 to-black border border-zinc-800 rounded-2xl p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{ev.name}</h3>
                    <p className="text-gray-500 text-sm mt-1">{ev.date}</p>
                  </div>
                  <span className="text-[#d4af37] font-bold text-sm">
                    {attendance}%
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm text-gray-400 mt-6">
                  <div>
                    <p className="uppercase text-xs">Tickets</p>
                    <p className="text-white font-semibold">
                      {ev.tickets_sold}/{ev.capacity}
                    </p>
                  </div>
                  <div>
                    <p className="uppercase text-xs">Revenue</p>
                    <p className="text-emerald-400 font-semibold">
                      KES {ev.revenue.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="uppercase text-xs">Conversion</p>
                    <p className="text-white font-semibold">{attendance}%</p>
                  </div>
                </div>

                {/* Insight Tags */}
                <div className="flex flex-wrap gap-2 mt-5">
                  {insights.map(tag => (
                    <span
                      key={tag}
                      className="text-[10px] px-3 py-1 rounded-full uppercase tracking-widest
                        bg-black/40 border border-white/10 text-[#d4af37]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AllEvents;

