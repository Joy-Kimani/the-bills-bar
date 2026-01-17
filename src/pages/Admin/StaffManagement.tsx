import React, { useEffect, useMemo, useState } from "react";
import AdminDashboardLayout from "../../dashboard/AdminDashboardLayout";
import { Trash2, Activity, Circle } from "lucide-react";

interface Staff {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "STAFF";
  created_at: string;

  is_online: boolean;
  last_active: string;
  current_action: string;
}

const MOCK_STAFF: Staff[] = [
  {
    id: 1,
    name: "Super Admin",
    email: "admin@billslounge.com",
    role: "ADMIN",
    created_at: "2026-01-01",
    is_online: true,
    last_active: "Just now",
    current_action: "Viewing dashboard",
  },
  {
    id: 2,
    name: "Jane Waitress",
    email: "jane@billslounge.com",
    role: "STAFF",
    created_at: "2026-01-03",
    is_online: true,
    last_active: "2 min ago",
    current_action: "Taking orders",
  },
  {
    id: 3,
    name: "Mark Bartender",
    email: "mark@billslounge.com",
    role: "STAFF",
    created_at: "2026-01-05",
    is_online: false,
    last_active: "35 min ago",
    current_action: "Offline",
  },
];

const PAGE_SIZE = 2;

const StaffManagement: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStaff(MOCK_STAFF);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const paginatedStaff = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return staff.slice(start, start + PAGE_SIZE);
  }, [staff, page]);

  const totalPages = Math.ceil(staff.length / PAGE_SIZE);

  const updateRole = (id: number, role: "ADMIN" | "STAFF") => {
    setStaff(prev => prev.map(s => (s.id === id ? { ...s, role } : s)));
  };

  const deleteStaff = (id: number) => {
    if (!confirm("Remove this staff member?")) return;
    setStaff(prev => prev.filter(s => s.id !== id));
  };

  return (
    <AdminDashboardLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Staff Management</h1>
            <p className="text-gray-400">
              Access control & activity monitoring
            </p>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg">
            + Add Member
          </button>
        </header>

        {/* TABLE */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">

          {loading ? (
            <div className="py-20 text-center text-gray-400">
              Loading staff data…
            </div>
          ) : (
            <>
              <table className="w-full text-left">
                <thead className="bg-gray-800/50 text-gray-400 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-4">Staff</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Activity</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-800">
                  {paginatedStaff.map(s => (
                    <tr key={s.id} className="hover:bg-gray-800/30">
                      {/* STAFF */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                            {s.name[0]}
                          </div>
                          <div>
                            <div className="text-white font-medium">{s.name}</div>
                            <div className="text-xs text-gray-500">{s.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* ROLE */}
                      <td className="px-6 py-4">
                        <select
                          value={s.role}
                          onChange={(e) => updateRole(s.id, e.target.value as any)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-full border ${
                            s.role === "ADMIN"
                              ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/40"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/40"
                          }`}
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="STAFF">STAFF</option>
                        </select>
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Circle
                            size={10}
                            className={s.is_online ? "text-emerald-400" : "text-gray-500"}
                            fill="currentColor"
                          />
                          <span className={s.is_online ? "text-emerald-400" : "text-gray-500"}>
                            {s.is_online ? "Online" : "Offline"}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {s.last_active}
                        </div>
                      </td>

                      {/* ACTIVITY */}
                      <td className="px-6 py-4 text-sm text-gray-300">
                        <div className="flex items-center gap-2">
                          <Activity size={14} className="text-indigo-400" />
                          {s.current_action}
                        </div>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4 text-right">
                        {s.role !== "ADMIN" ? (
                          <button
                            onClick={() => deleteStaff(s.id)}
                            className="p-2 hover:text-red-400"
                          >
                            <Trash2 size={18} />
                          </button>
                        ) : (
                          <span className="text-xs text-gray-600 italic">
                            Protected
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* PAGINATION */}
              <div className="flex justify-between items-center px-6 py-4 border-t border-gray-800">
                <span className="text-sm text-gray-400">
                  Page {page} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="px-3 py-1 rounded bg-gray-800 disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="px-3 py-1 rounded bg-gray-800 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default StaffManagement;
