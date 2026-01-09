import React, { useEffect, useState } from "react";
import AdminDashboardLayout from "../../dashboard/AdminDashboardLayout";
import { FileText, CheckCircle } from "lucide-react";
import {toast, Toaster} from "sonner";

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

  useEffect(() => {
    setTimeout(() => setOrders(MOCK_ORDERS), 500);
  }, []);

  const markComplete = (id: number) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === id ? { ...o, status: "COMPLETED" } : o
      )
    );
    toast.success("Order marked as completed");
  };

  const downloadReceipt = () => {
    toast("Receipt downloaded");
  };

  return (
    <AdminDashboardLayout>
      <Toaster />
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">
          All Orders
        </h1>

        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-gray-400">
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
              {orders.map(order => (
                <tr key={order.id} className="border-t border-gray-800 text-gray-300">
                  <td className="p-3 font-medium">#{order.id}</td>
                  <td>{order.table}</td>
                  <td>KES {order.total}</td>
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
                  <td className="flex gap-2 p-2">
                    <button onClick={downloadReceipt}>
                      <FileText size={16} />
                    </button>
                    {order.status === "PAID" && (
                      <button onClick={() => markComplete(order.id)}>
                        <CheckCircle size={16} className="text-emerald-400" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AllOrders;

