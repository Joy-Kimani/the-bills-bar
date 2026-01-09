import React from "react";
import {
  DollarSign,
  ShoppingCart,
  ClipboardList,
  CalendarDays,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/query";
import type { RootState } from "../../store/store";
import { AdminApi } from "../../features/api/AdminApi";
import AdminDashboardLayout from "../../dashboard/AdminDashboardLayout";

const Overview: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.authSlice);

  const {
    data: stats,
    isLoading,
    error,
  } = AdminApi.useGetAdminDashboardDataQuery(
    isAuthenticated ? undefined : skipToken
  );

  const statsCards = [
    {
      title: "Today's Revenue",
      value: `KES ${stats?.totalRevenue?.toLocaleString() || 0}`,
      icon: <DollarSign className="text-green-400" />,
      trend: "+12% today",
    },
    {
      title: "Orders Today",
      value: stats?.totalOrders || 0,
      icon: <ShoppingCart className="text-blue-400" />,
      trend: "Live orders",
    },
    {
      title: "Active Reservations",
      value: stats?.totalReservations || 0,
      icon: <CalendarDays className="text-purple-400" />,
      trend: "Tonight",
    },
    {
      title: "Menu Items",
      value: stats?.totalMenuItems || 0,
      icon: <ClipboardList className="text-orange-400" />,
      trend: "Available",
    },
  ];

  return (
    <AdminDashboardLayout>
      {/* Header - Adjusted padding and text size for mobile */}
      <div className="mb-6 md:mb-8 bg-black rounded-xl p-4 md:p-6 border border-gray-800">
        <h1 className="text-xl md:text-3xl font-bold text-white">
          Bills Lounge - Admin Overview
        </h1>
        <p className="text-gray-400 mt-1 text-sm md:text-base">
          Real-time performance & operations snapshot
        </p>
      </div>

      {/* Stats - Changed grid-cols to 1 by default, 2 on small, 4 on XL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-10">
        {isLoading ? (
          <div className="col-span-full text-center py-20 text-gray-400">
            Loading dashboard...
          </div>
        ) : error ? (
          <div className="col-span-full flex items-center justify-center py-20 bg-red-900/20 rounded-xl">
            <AlertCircle className="text-red-500 mr-2" />
            Failed to load dashboard data
          </div>
        ) : (
          statsCards.map((card, i) => (
            <div
              key={i}
              className="bg-zinc-900 rounded-xl p-5 md:p-6 border border-zinc-800 hover:border-green-700 transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs md:text-sm uppercase tracking-wide">
                    {card.title}
                  </p>
                  <h3 className="text-xl md:text-2xl font-bold text-white mt-1 md:mt-2">
                    {card.value}
                  </h3>
                </div>
                <div className="p-2 md:p-3 bg-black rounded-lg">
                  {card.icon}
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-green-400">
                <TrendingUp size={14} className="mr-1" />
                {card.trend}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Section - Stacked by default, side-by-side on XL screens */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-zinc-900 rounded-xl p-4 md:p-6 border border-zinc-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-white">
              Recent Orders
            </h2>
            <button className="text-sm text-green-400 hover:underline">
              View all
            </button>
          </div>

          {/* Table Container - Added horizontal scrolling for small screens */}
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <div className="inline-block min-w-full align-middle px-4 md:px-0">
              <table className="min-w-[500px] w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-zinc-800">
                    <th className="text-left py-3">Order</th>
                    <th className="text-left">Amount</th>
                    <th>Status</th>
                    <th className="text-right">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentOrders?.map((order: any) => (
                    <tr
                      key={order.id}
                      className="border-b border-zinc-800 hover:bg-black/40"
                    >
                      <td className="py-4 text-white">#{order.id}</td>
                      <td className="text-green-400 font-semibold">
                        KES {order.total}
                      </td>
                      <td className="text-center">
                        <span
                          className={`px-2 py-1 rounded text-[10px] md:text-xs font-medium ${
                            order.status === "PAID"
                              ? "bg-green-600/20 text-green-400 border border-green-600/50"
                              : "bg-yellow-600/20 text-yellow-400 border border-yellow-600/50"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="text-right text-gray-400">{order.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-zinc-900 rounded-xl p-4 md:p-6 border border-zinc-800">
          <h2 className="text-lg md:text-xl font-semibold text-white mb-6">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {[
              "New Order",
              "Add Menu Item",
              "View Reports",
              "Settings",
            ].map((action) => (
              <button
                key={action}
                className="bg-black border border-zinc-700 rounded-lg p-3 md:p-4 text-sm md:text-base text-white hover:border-green-500 transition active:scale-95"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default Overview;