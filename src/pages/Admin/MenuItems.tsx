import React, { useEffect, useMemo, useState } from "react";
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
  FileDown,
  Star,
  Search,
  Plus,
  Utensils,
  CheckCircle,
  XCircle,
  Flame,
  List,
} from "lucide-react";
import { toast } from "sonner";

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  popular: boolean;
  is_available: boolean;
}

const MOCK_MENU: MenuItem[] = [
  { id: 1, name: "Bills Breakfast", category: "Breakfast", price: 1000, popular: true, is_available: true },
  { id: 2, name: "Chicken Kienyeji", category: "Chicken", price: 800, popular: true, is_available: true },
  { id: 3, name: "Fish Fillet", category: "Fish & Steak", price: 1500, popular: false, is_available: false },
];

const MenuItems: React.FC = () => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setMenu(MOCK_MENU), 600);
    return () => clearTimeout(timer);
  }, []);

  /* -----------------------------
     DERIVED DATA (POWER BI STYLE)
  ------------------------------*/
  const stats = useMemo(() => {
    const available = menu.filter(i => i.is_available).length;
    const popular = menu.filter(i => i.popular).length;

    return {
      total: menu.length,
      available,
      unavailable: menu.length - available,
      popular,
    };
  }, [menu]);

  const filteredMenu = useMemo(() => {
    return menu.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [menu, search]);

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    menu.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return Object.entries(counts).map(([category, count]) => ({ category, count }));
  }, [menu]);

  /* -----------------------------
     ACTIONS
  ------------------------------*/
  const toggleAvailability = (id: number) => {
    setMenu(prev =>
      prev.map(item =>
        item.id === id ? { ...item, is_available: !item.is_available } : item
      )
    );
    toast.success("Availability updated");
  };

  const togglePopular = (id: number) => {
    setMenu(prev =>
      prev.map(item =>
        item.id === id ? { ...item, popular: !item.popular } : item
      )
    );
    toast.info("Popularity updated");
  };

  return (
    <AdminDashboardLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-8">

        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Menu Management
            </h1>
            <p className="text-gray-400 mt-1">
              Control pricing, availability, and performance
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => toast("Export coming soon")}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white hover:bg-zinc-700"
            >
              <FileDown size={18} />
              Export
            </button>

            <button className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-semibold">
              <Plus size={18} />
              Add Item
            </button>
          </div>
        </header>

        {/* KPI ROW */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Items", value: stats.total, icon: <List /> },
            { label: "Available", value: stats.available, icon: <CheckCircle /> },
            { label: "Unavailable", value: stats.unavailable, icon: <XCircle /> },
            { label: "Popular", value: stats.popular, icon: <Flame /> },
          ].map(kpi => (
            <div
              key={kpi.label}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
            >
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">{kpi.label}</span>
                <span className="text-indigo-400">{kpi.icon}</span>
              </div>
              <div className="text-2xl font-bold text-white mt-2">
                {kpi.value}
              </div>
            </div>
          ))}
        </section>

        {/* ANALYTICS */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">
                Items by Category
              </h2>
              <Utensils className="text-gray-500" />
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                  <XAxis dataKey="category" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AVAILABILITY RATIO */}
          <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-6">
            <p className="text-indigo-400 font-medium">Availability Ratio</p>
            <h3 className="text-4xl font-bold text-white mt-2">
              {stats.total === 0
                ? "0%"
                : `${Math.round((stats.available / stats.total) * 100)}%`}
            </h3>

            <div className="mt-4 h-2 bg-zinc-800 rounded-full">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{
                  width: `${stats.total === 0 ? 0 : (stats.available / stats.total) * 100}%`,
                }}
              />
            </div>
          </div>
        </section>

        {/* SEARCH */}
        <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            placeholder="Search menu items..."
            className="w-full bg-transparent text-white pl-12 pr-4 py-3 focus:outline-none"
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-zinc-800 text-gray-400 text-xs uppercase">
              <tr>
                <th className="px-6 py-4 text-left">Item</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-center">Popular</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredMenu.map(item => (
                <tr key={item.id} className="hover:bg-black/30">
                  <td className="px-6 py-4 font-semibold text-white">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 text-gray-400">{item.category}</td>
                  <td className="px-6 py-4 text-indigo-300">
                    KES {item.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => togglePopular(item.id)}>
                      <Star
                        className={item.popular ? "text-yellow-400" : "text-gray-600"}
                        fill={item.popular ? "currentColor" : "none"}
                      />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => toggleAvailability(item.id)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold ${
                        item.is_available
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-rose-500/10 text-rose-400"
                      }`}
                    >
                      {item.is_available ? "In Stock" : "Out of Stock"}
                    </button>
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

export default MenuItems;
