import React from "react";
import {
  DollarSign,
  ShoppingCart,
  CalendarDays,
  ClipboardList,
  TrendingUp,
  Users,
  AlertCircle,
} from "lucide-react";
import { useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/query";
import type { RootState } from "../../store/store";
import { AdminApi } from "../../features/api/AdminApi";
import AdminDashboardLayout from "../../dashboard/AdminDashboardLayout";

/* -----------------------------
   KPI CONFIG
------------------------------ */
const kpiConfig = (stats: any) => [
  {
    label: "Today’s Revenue",
    value: `KES ${stats?.totalRevenue?.toLocaleString() ?? 0}`,
    icon: <DollarSign />,
    trend: "+12% vs yesterday",
    accent: "emerald",
  },
  {
    label: "Orders Today",
    value: stats?.totalOrders ?? 0,
    icon: <ShoppingCart />,
    trend: "Live orders",
    accent: "indigo",
  },
  {
    label: "Active Tables",
    value: `${stats?.activeTables ?? 0} / ${stats?.totalTables ?? 24}`,
    icon: <Users />,
    trend: "Currently seated",
    accent: "sky",
  },
  {
    label: "Event Reservations",
    value: stats?.totalReservations ?? 0,
    icon: <CalendarDays />,
    trend: "Tonight",
    accent: "purple",
  },
  {
    label: "Menu Items",
    value: stats?.totalMenuItems ?? 0,
    icon: <ClipboardList />,
    trend: "Available",
    accent: "amber",
  },
];

const Overview: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.authSlice);

  const { data: stats, isLoading, error } =
    AdminApi.useGetAdminDashboardDataQuery(
      isAuthenticated ? undefined : skipToken
    );

  return (
    <AdminDashboardLayout>
      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER */}
        <header className="bg-black border border-zinc-800 rounded-xl p-5 md:p-7">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Admin Overview
          </h1>
          <p className="text-gray-400 mt-1">
            30-second snapshot of business performance
          </p>
        </header>

        {/* KPI SECTION */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
          {isLoading ? (
            <div className="col-span-full py-20 text-center text-gray-400">
              Loading dashboard…
            </div>
          ) : error ? (
            <div className="col-span-full flex justify-center items-center py-20 bg-red-900/20 rounded-xl">
              <AlertCircle className="text-red-500 mr-2" />
              Failed to load dashboard data
            </div>
          ) : (
            kpiConfig(stats).map((kpi) => (
              <div
                key={kpi.label}
                className="relative bg-zinc-900 border border-zinc-800 rounded-xl p-5 overflow-hidden"
              >
                <div
                  className={`absolute -top-6 -right-6 w-24 h-24 bg-${kpi.accent}-500/10 blur-3xl`}
                />

                <div className="flex justify-between items-start">
                  <div
                    className={`p-3 rounded-lg bg-${kpi.accent}-500/10 text-${kpi.accent}-400`}
                  >
                    {kpi.icon}
                  </div>
                  <span className="text-xs text-emerald-400 flex items-center">
                    <TrendingUp size={14} className="mr-1" />
                    {kpi.trend}
                  </span>
                </div>

                <p className="mt-4 text-sm text-gray-400">{kpi.label}</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {kpi.value}
                </p>
              </div>
            ))
          )}
        </section>

        {/* MAIN CONTENT */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* RECENT ORDERS */}
          <div className="xl:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">
                Recent Orders
              </h2>
              <button className="text-sm text-emerald-400 hover:underline">
                View all
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[520px] w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-gray-400">
                    <th className="py-3 text-left">Order</th>
                    <th className="text-left">Amount</th>
                    <th className="text-center">Status</th>
                    <th className="text-right">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.todaysOrders?.map((order: any) => (
                    <tr
                      key={order.id}
                      className="border-b border-zinc-800 hover:bg-black/40"
                    >
                      <td className="py-4 text-white">#{order.id}</td>
                      <td className="text-emerald-400 font-semibold">
                        KES {order.total}
                      </td>
                      <td className="text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            order.status === "PAID"
                              ? "bg-emerald-600/20 text-emerald-400 border border-emerald-600/40"
                              : "bg-yellow-600/20 text-yellow-400 border border-yellow-600/40"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="text-right text-gray-400">
                        {order.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* INSIGHTS PANEL */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
            <h2 className="text-lg font-semibold text-white">Insights</h2>

            <div className="bg-black/40 rounded-lg p-4 text-sm text-gray-300">
              🔥 Peak hour today: <strong>8:00 – 10:00 PM</strong>
            </div>

            <div className="bg-black/40 rounded-lg p-4 text-sm text-gray-300">
              🍸 Bar revenue exceeds kitchen by <strong>22%</strong>
            </div>

            <div className="bg-black/40 rounded-lg p-4 text-sm text-gray-300">
              🎉 Event nights increase AOV by <strong>45%</strong>
            </div>
          </div>
        </section>
      </div>
    </AdminDashboardLayout>
  );
};

export default Overview;
