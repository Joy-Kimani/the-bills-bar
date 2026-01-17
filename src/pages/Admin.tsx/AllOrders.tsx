import React, { useEffect, useMemo, useState } from "react";
import AdminDashboardLayout from "../../dashboard/AdminDashboardLayout";
import {
  FileText,
  CheckCircle,
  ShoppingCart,
  CreditCard,
  Check,
  DollarSign,
} from "lucide-react";
import { toast, Toaster } from "sonner";

interface Order {
  id: number;
  table: string;
  total: number;
  payment: "CASH" | "MOBILE";
  status: "PAID" | "COMPLETED";
}

const MOCK_ORDERS: Order[] = [
  { id: 1, table: "VIP Table", total: 3200, payment: "MOBILE", status: "PAID" },
  { id: 2, table: "Standard Table", total: 1500, payment: "CASH", status: "COMPLETED" },
];

const AllOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PAID" | "COMPLETED">("ALL");

  useEffect(() => {
    setTimeout(() => setOrders(MOCK_ORDERS), 500);
  }, []);

  const stats = useMemo(() => {
    const paid = orders.filter(o => o.status === "PAID");
    const completed = orders.filter(o => o.status === "COMPLETED");

    return {
      totalOrders: orders.length,
      paidOrders: paid.length,
      completedOrders: completed.length,
      revenue: orders.reduce((sum, o) => sum + o.total, 0),
    };
  }, [orders]);

  const filteredOrders = orders.filter(o =>
    statusFilter === "ALL" ? true : o.status === statusFilter
  );

  const markComplete = (id: number) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === id ? { ...o, status: "COMPLETED" } : o
      )
    );
    toast.success("Order marked as completed");
  };

  return (
    <AdminDashboardLayout>
      <Toaster />

      <div className="max-w-7xl mx-auto p-6 space-y-8">

        {/* HEADER */}
        <header>
          <h1 className="text-3xl font-bold text-white">All Orders</h1>
          <p className="text-gray-400">
            Monitor and manage all customer orders
          </p>
        </header>

        {/* KPI ROW */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: "Total Orders", value: stats.totalOrders, icon: <ShoppingCart /> },
            { label: "Paid Orders", value: stats.paidOrders, icon: <CreditCard /> },
            { label: "Completed", value: stats.completedOrders, icon: <Check /> },
            { label: "Revenue", value: `KES ${stats.revenue}`, icon: <DollarSign /> },
          ].map(kpi => (
            <div
              key={kpi.label}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="text-gray-400 text-sm">{kpi.label}</div>
                <div className="text-emerald-400">{kpi.icon}</div>
              </div>
              <div className="text-2xl font-bold text-white mt-2">
                {kpi.value}
              </div>
            </div>
          ))}
        </section>

        {/* FILTERS */}
        <section className="flex gap-3">
          {["ALL", "PAID", "COMPLETED"].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as any)}
              className={`px-4 py-2 rounded-lg text-sm border ${
                statusFilter === status
                  ? "bg-emerald-600/20 text-emerald-400 border-emerald-600/40"
                  : "bg-black border-zinc-700 text-gray-400"
              }`}
            >
              {status}
            </button>
          ))}
        </section>

        {/* TABLE */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-800 text-gray-400">
              <tr>
                <th className="p-3 text-left">Order</th>
                <th>Table</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr
                  key={order.id}
                  className="border-t border-zinc-800 text-gray-300 hover:bg-black/40"
                >
                  <td className="p-3 font-medium">#{order.id}</td>
                  <td>{order.table}</td>
                  <td className="text-emerald-400">KES {order.total}</td>
                  <td>{order.payment}</td>
                  <td>
                    <span className={`px-2 py-1 rounded text-xs ${
                      order.status === "PAID"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-emerald-500/20 text-emerald-400"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="flex gap-3 p-2">
                    <button title="Download receipt">
                      <FileText size={16} />
                    </button>
                    {order.status === "PAID" && (
                      <button
                        title="Mark completed"
                        onClick={() => markComplete(order.id)}
                      >
                        <CheckCircle size={16} className="text-emerald-400" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </AdminDashboardLayout>
  );
};

export default AllOrders;
