import React, { useEffect, useMemo, useState } from "react";
import AdminDashboardLayout from "../../dashboard/AdminDashboardLayout";
import {
  Calendar,
  Clock,
  Phone,
  User,
  Clock3,
  Search,
  CheckCircle2,
  XCircle,
} from "lucide-react";

type Status = "PENDING" | "CONFIRMED" | "EXPIRED";

interface Reservation {
  id: number;
  table_name: string;
  customer_name: string;
  phone: string;
  reservation_date: string;
  time_slot: string;
  status: Status;
}

const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: 1,
    table_name: "VIP Table 01",
    customer_name: "John Doe",
    phone: "+254712345678",
    reservation_date: "2026-01-12",
    time_slot: "20:00 - 23:00",
    status: "PENDING",
  },
  {
    id: 2,
    table_name: "Standard Table 04",
    customer_name: "Sarah W.",
    phone: "+254798654321",
    reservation_date: "2026-01-12",
    time_slot: "19:00 - 22:00",
    status: "CONFIRMED",
  },
];

const statusStyles: Record<Status, string> = {
  PENDING: "border-amber-500/50 text-amber-500 bg-amber-500/5",
  CONFIRMED: "border-emerald-500/50 text-emerald-500 bg-emerald-500/5",
  EXPIRED: "border-rose-500/50 text-rose-500 bg-rose-500/5",
};

const ReservedTables: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | Status>("ALL");
  const [search, setSearch] = useState("");

  /* ------------------ Load (mock API) ------------------ */
  useEffect(() => {
    const timer = setTimeout(() => {
      setReservations(MOCK_RESERVATIONS);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  /* ------------------ Auto-expire simulation ------------------ */
  useEffect(() => {
    const interval = setInterval(() => {
      setReservations((prev) =>
        prev.map((r) =>
          r.status === "PENDING" ? { ...r, status: "EXPIRED" } : r
        )
      );
    }, 1000 * 60 * 10); // every 10 minutes (demo-safe)

    return () => clearInterval(interval);
  }, []);

  /* ------------------ Actions ------------------ */
  const updateStatus = (id: number, status: Status) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  /* ------------------ Filter + Search ------------------ */
  const filteredReservations = useMemo(() => {
    return reservations.filter((r) => {
      const matchesFilter = filter === "ALL" || r.status === filter;
      const matchesSearch =
        r.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        r.phone.includes(search) ||
        r.table_name.toLowerCase().includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [reservations, filter, search]);

  /* ------------------ Stats ------------------ */
  const stats = {
    ALL: reservations.length,
    PENDING: reservations.filter((r) => r.status === "PENDING").length,
    CONFIRMED: reservations.filter((r) => r.status === "CONFIRMED").length,
  };

  return (
    <AdminDashboardLayout>
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Reserved Tables
            </h1>
            <p className="text-gray-400 mt-1">
              Live reservation monitoring & control
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, phone, table"
              className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(["ALL", "PENDING", "CONFIRMED"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition
                ${
                  filter === f
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-900 text-gray-400 hover:text-white border border-gray-800"
                }`}
            >
              {f} ({stats[f]})
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
            {[1, 2].map((i) => (
              <div key={i} className="h-44 bg-gray-900/50 rounded-xl border border-gray-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReservations.map((r) => (
              <div
                key={r.id}
                className={`relative bg-gray-900 border-l-4 rounded-xl p-6 transition hover:shadow-xl ${statusStyles[r.status]}`}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white uppercase">
                      {r.table_name}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-300 mt-1">
                      <User size={14} className="text-indigo-400" />
                      {r.customer_name}
                    </div>
                  </div>

                  <select
                    value={r.status}
                    onChange={(e) =>
                      updateStatus(r.id, e.target.value as Status)
                    }
                    className="bg-gray-800 border border-gray-700 text-xs rounded-md px-3 py-1 font-bold"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="EXPIRED">EXPIRED</option>
                  </select>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-y-3 pt-4 border-t border-gray-800/50 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} /> {r.reservation_date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} /> {r.time_slot}
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <Phone size={14} />
                    <a href={`tel:${r.phone}`} className="hover:text-indigo-400">
                      {r.phone}
                    </a>
                  </div>
                </div>

                {/* Quick actions */}
                {r.status === "PENDING" && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => updateStatus(r.id, "CONFIRMED")}
                      className="flex items-center gap-1 px-3 py-1 text-xs rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    >
                      <CheckCircle2 size={14} /> Confirm
                    </button>
                    <button
                      onClick={() => updateStatus(r.id, "EXPIRED")}
                      className="flex items-center gap-1 px-3 py-1 text-xs rounded bg-rose-500/10 text-rose-400 border border-rose-500/30"
                    >
                      <XCircle size={14} /> Expire
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
};

export default ReservedTables;


