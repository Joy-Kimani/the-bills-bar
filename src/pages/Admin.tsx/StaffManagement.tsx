import React, { useEffect, useState } from "react";
import AdminDashboardLayout from "../../dashboard/AdminDashboardLayout";
import { Trash2, Shield, User, MoreVertical } from "lucide-react"; // Optional icons

interface Staff {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "STAFF";
  created_at: string;
}

const MOCK_STAFF: Staff[] = [
  { id: 1, name: "Super Admin", email: "admin@billslounge.com", role: "ADMIN", created_at: "2026-01-01" },
  { id: 2, name: "Jane Waitress", email: "jane@billslounge.com", role: "STAFF", created_at: "2026-01-03" },
  { id: 3, name: "Mark Bartender", email: "mark@billslounge.com", role: "STAFF", created_at: "2026-01-05" },
];

const StaffManagement: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStaff(MOCK_STAFF);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const updateRole = (id: number, role: "ADMIN" | "STAFF") => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, role } : s)));
  };

  const deleteStaff = (id: number) => {
    if (!confirm("Are you sure you want to remove this staff member?")) return;
    setStaff((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <AdminDashboardLayout>
      <div className="p-8 max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Staff Management</h1>
            <p className="text-gray-400 mt-1">Manage permissions and team access.</p>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            + Add Member
          </button>
        </header>

        <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden backdrop-blur-sm">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mb-4"></div>
              <p className="text-gray-400 animate-pulse">Fetching team roster...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-800/50 text-gray-400 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Staff Member</th>
                    <th className="px-6 py-4 font-semibold">Role</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {staff.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-800/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                            {s.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">{s.name}</div>
                            <div className="text-xs text-gray-500">{s.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative inline-block w-32">
                          <select
                            value={s.role}
                            onChange={(e) => updateRole(s.id, e.target.value as any)}
                            className={`appearance-none w-full px-3 py-1.5 text-xs font-bold rounded-full border transition-all cursor-pointer
                              ${s.role === 'ADMIN' 
                                ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' 
                                : 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'}`}
                          >
                            <option value="ADMIN">ADMIN</option>
                            <option value="STAFF">STAFF</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {s.role !== "ADMIN" ? (
                          <button
                            onClick={() => deleteStaff(s.id)}
                            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                            title="Remove Member"
                          >
                            <Trash2 size={18} />
                          </button>
                        ) : (
                          <span className="text-gray-600 px-2 italic text-xs">Protected</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {!loading && staff.length === 0 && (
                <div className="py-12 text-center text-gray-500">
                  No staff members found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default StaffManagement;