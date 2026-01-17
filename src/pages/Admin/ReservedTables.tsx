import React, { useEffect, useMemo, useState } from "react";
import AdminDashboardLayout from "../../dashboard/AdminDashboardLayout";
import {
  Calendar,
  Clock,
  Phone,
  User,
  Search,
  CheckCircle2,
  XCircle,
} from "lucide-react";

/* ----------------------------------
 TYPES
---------------------------------- */
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

/* ----------------------------------
 MOCK DATA
---------------------------------- */
const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: 1,
    table_name: "VIP Table I",
    customer_name: "John Doe",
    phone: "+254712345678",
    reservation_date: "2026-01-12",
    time_slot: "20:00 – 23:00",
    status: "PENDING",
  },
  {
    id: 2,
    table_name: "Standard IV",
    customer_name: "Sarah W.",
    phone: "+254798654321",
    reservation_date: "2026-01-12",
    time_slot: "19:00 – 22:00",
    status: "CONFIRMED",
  },
];

/* ----------------------------------
 STYLES
---------------------------------- */
const STATUS_STYLES: Record<Status, string> = {
  PENDING: "border-[#d4af37]/40 text-[#d4af37] bg-[#d4af37]/5",
  CONFIRMED: "border-emerald-500/40 text-emerald-400 bg-emerald-500/5",
  EXPIRED: "border-rose-500/40 text-rose-400 bg-rose-500/5",
};

const KPI_CARD =
  "rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur";

/* ----------------------------------
 COMPONENT
---------------------------------- */
const ReservedTables: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | Status>("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 6;

  /* Load data */
  useEffect(() => {
    const t = setTimeout(() => {
      setReservations(MOCK_RESERVATIONS);
      setLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  /* Stats */
  const stats = useMemo(() => {
    return {
      total: reservations.length,
      pending: reservations.filter(r => r.status === "PENDING").length,
      confirmed: reservations.filter(r => r.status === "CONFIRMED").length,
      expired: reservations.filter(r => r.status === "EXPIRED").length,
    };
  }, [reservations]);

  /* Filters */
  const filtered = useMemo(() => {
    return reservations.filter(r => {
      const statusOk = filter === "ALL" || r.status === filter;
      const searchOk =
        r.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        r.phone.includes(search) ||
        r.table_name.toLowerCase().includes(search.toLowerCase());
      return statusOk && searchOk;
    });
  }, [reservations, filter, search]);

  /* Pagination */
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const updateStatus = (id: number, status: Status) => {
    setReservations(prev =>
      prev.map(r => (r.id === id ? { ...r, status } : r))
    );
  };

  return (
    <AdminDashboardLayout>
      <div className="max-w-7xl mx-auto px-8 py-10 text-white space-y-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <p className="text-[#d4af37] tracking-[0.35em] text-xs uppercase mb-2">
              Admin Dashboard
            </p>
            <h1 className="text-4xl font-light italic">
              Reserved <span className="text-[#d4af37] font-bold">Tables</span>
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              Occupancy health & reservation control
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d4af37]/70"
              size={16}
            />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search guest, table, phone"
              className="w-full bg-black/40 border border-white/10 rounded-full pl-11 pr-4 py-2 text-sm focus:outline-none focus:border-[#d4af37]/60"
            />
          </div>
        </div>

        {/* KPI ROW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className={KPI_CARD}>
            <p className="text-xs text-gray-400 uppercase">Total</p>
            <p className="text-3xl font-bold mt-2">{stats.total}</p>
          </div>
          <div className={KPI_CARD}>
            <p className="text-xs text-gray-400 uppercase">Confirmed</p>
            <p className="text-3xl font-bold text-emerald-400 mt-2">
              {stats.confirmed}
            </p>
          </div>
          <div className={KPI_CARD}>
            <p className="text-xs text-gray-400 uppercase">Pending</p>
            <p className="text-3xl font-bold text-[#d4af37] mt-2">
              {stats.pending}
            </p>
          </div>
          <div className={KPI_CARD}>
            <p className="text-xs text-gray-400 uppercase">Expired</p>
            <p className="text-3xl font-bold text-rose-400 mt-2">
              {stats.expired}
            </p>
          </div>
        </div>

        {/* TREND (placeholder – Power BI style) */}
        <div className="rounded-3xl border border-white/10 bg-black/40 p-10 text-center text-gray-500">
          Reservations Over Time (Line Chart Placeholder)
        </div>

        {/* FILTERS */}
        <div className="flex gap-3">
          {(["ALL", "PENDING", "CONFIRMED"] as const).map(f => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setPage(1);
              }}
              className={`px-6 py-2 rounded-full text-xs tracking-widest uppercase transition
                ${
                  filter === f
                    ? "bg-[#d4af37] text-black font-bold"
                    : "border border-white/10 text-gray-400 hover:text-white"
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-white/5 rounded-3xl" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-8">
              {paginated.map(r => (
                <div
                  key={r.id}
                  className={`p-8 rounded-3xl border-l-4 bg-gradient-to-br from-black via-[#0f0f0f] to-black ${STATUS_STYLES[r.status]}`}
                >
                  <div className="flex justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold uppercase">
                        {r.table_name}
                      </h3>
                      <p className="flex items-center gap-2 text-gray-400 mt-2">
                        <User size={14} /> {r.customer_name}
                      </p>
                    </div>

                    <select
                      value={r.status}
                      onChange={e =>
                        updateStatus(r.id, e.target.value as Status)
                      }
                      className="bg-black border border-white/20 rounded-full px-4 py-1 text-xs"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="EXPIRED">EXPIRED</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-y-4 text-sm text-gray-400 border-t border-white/10 pt-6">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} /> {r.reservation_date}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} /> {r.time_slot}
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <Phone size={14} />
                      {r.phone}
                    </div>
                  </div>

                  {r.status === "PENDING" && (
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => updateStatus(r.id, "CONFIRMED")}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-xs border border-emerald-500/40 text-emerald-400"
                      >
                        <CheckCircle2 size={14} /> Confirm
                      </button>
                      <button
                        onClick={() => updateStatus(r.id, "EXPIRED")}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-xs border border-rose-500/40 text-rose-400"
                      >
                        <XCircle size={14} /> Expire
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center items-center gap-4 pt-8 text-sm">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 border border-white/10 rounded disabled:opacity-30"
              >
                Prev
              </button>
              <span className="text-gray-400">
                Page {page} of {totalPages || 1}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 border border-white/10 rounded disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </AdminDashboardLayout>
  );
};

export default ReservedTables;
