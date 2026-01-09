import React, { useEffect, useState, useMemo } from "react";
import AdminDashboardLayout from "../../dashboard/AdminDashboardLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { FileDown, Star, Search, Plus, Utensils } from "lucide-react";
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

  const toggleAvailability = (id: number) => {
    setMenu(prev => prev.map(item =>
      item.id === id ? { ...item, is_available: !item.is_available } : item
    ));
    toast.success("Availability updated");
  };

  const togglePopular = (id: number) => {
    setMenu(prev => prev.map(item =>
      item.id === id ? { ...item, popular: !item.popular } : item
    ));
    toast.info("Popularity status changed");
  };

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    menu.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return Object.entries(counts).map(([category, count]) => ({ category, count }));
  }, [menu]);

  return (
    <AdminDashboardLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Menu Items</h1>
            <p className="text-gray-400 mt-2">Manage your restaurant offerings and stock availability.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => toast.success("Feature coming soon")}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-white transition-all shadow-sm"
            >
              <FileDown size={18} />
              Export PDF
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-semibold transition-all shadow-lg shadow-indigo-500/20">
              <Plus size={18} />
              Add Item
            </button>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-gray-900/50 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Inventory by Category</h2>
              <Utensils className="text-gray-500" size={20} />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                  <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Quick Stats Sidebar */}
          <div className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-2xl flex flex-col justify-center">
             <p className="text-indigo-400 font-medium">Total Menu Items</p>
             <h3 className="text-5xl font-bold text-white mt-1">{menu.length}</h3>
             <div className="mt-6 pt-6 border-t border-indigo-500/10">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Available</span>
                  <span className="text-emerald-400 font-bold">{menu.filter(i => i.is_available).length}</span>
                </div>
                <div className="w-full bg-gray-800 h-1.5 rounded-full mt-2">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${(menu.filter(i => i.is_available).length / menu.length) * 100}%` }}
                  />
                </div>
             </div>
          </div>
        </div>

        {/* Table Controls */}
        <div className="flex items-center gap-4 bg-gray-900 border border-gray-800 p-2 rounded-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search dishes..." 
              className="w-full bg-transparent border-none focus:ring-0 text-white pl-12 pr-4 py-2"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800/50 text-gray-400 text-xs uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Dish Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-center">Popular</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {menu.filter(i => i.name.toLowerCase().includes(search.toLowerCase())).map(item => (
                <tr key={item.id} className="group hover:bg-white/5 transition-all">
                  <td className="px-6 py-4">
                    <span className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                      {item.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-gray-800 text-gray-300 rounded-md text-xs border border-gray-700">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-indigo-300">
                    KES {item.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => togglePopular(item.id)}
                      className={`mx-auto flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                        item.popular ? "bg-yellow-400/10 text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.2)]" : "text-gray-600 hover:text-gray-400"
                      }`}
                    >
                      <Star size={20} fill={item.popular ? "currentColor" : "none"} />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => toggleAvailability(item.id)}
                      className={`inline-flex items-center px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        item.is_available 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20" 
                        : "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20"
                      }`}
                    >
                      {item.is_available ? "In Stock" : "Out of Stock"}
                    </button>
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

export default MenuItems;