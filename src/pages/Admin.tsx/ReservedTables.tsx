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

const STATUS_STYLES: Record<Status, string> = {
  PENDING: "border-[#d4af37]/40 text-[#d4af37] bg-[#d4af37]/5",
  CONFIRMED: "border-emerald-500/40 text-emerald-400 bg-emerald-500/5",
  EXPIRED: "border-rose-500/40 text-rose-400 bg-rose-500/5",
};

const ReservedTables: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | Status>("ALL");
  const [search, setSearch] = useState("");

  /* Load mock data */
  useEffect(() => {
    const t = setTimeout(() => {
      setReservations(MOCK_RESERVATIONS);
      setLoading(false);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  /* Auto-expire simulation */
  useEffect(() => {
    const i = setInterval(() => {
      setReservations(prev =>
        prev.map(r =>
          r.status === "PENDING" ? { ...r, status: "EXPIRED" } : r
        )
      );
    }, 1000 * 60 * 10);
    return () => clearInterval(i);
  }, []);

  const updateStatus = (id: number, status: Status) => {
    setReservations(prev =>
      prev.map(r => (r.id === id ? { ...r, status } : r))
    );
  };

  const filtered = useMemo(() => {
    return reservations.filter(r => {
      const f = filter === "ALL" || r.status === filter;
      const s =
        r.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        r.phone.includes(search) ||
        r.table_name.toLowerCase().includes(search.toLowerCase());
      return f && s;
    });
  }, [reservations, filter, search]);

  const stats = {
    ALL: reservations.length,
    PENDING: reservations.filter(r => r.status === "PENDING").length,
    CONFIRMED: reservations.filter(r => r.status === "CONFIRMED").length,
  };

  return (
    <AdminDashboardLayout>
      <div className="max-w-7xl mx-auto px-8 py-10 text-white">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
          <div>
            <p className="text-[#d4af37] tracking-[0.4em] text-xs uppercase mb-2">
              Bills Lounge & Grill
            </p>
            <h1 className="text-4xl font-light italic">
              Reserved <span className="text-[#d4af37] font-bold">Tables</span>
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              Live VIP & Standard table oversight
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d4af37]/70" size={16} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search guest, table, phone"
              className="w-full bg-black/40 border border-white/10 rounded-full pl-11 pr-4 py-2 text-sm focus:outline-none focus:border-[#d4af37]/60"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-10">
          {(["ALL", "PENDING", "CONFIRMED"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-full text-xs tracking-widest uppercase transition
                ${
                  filter === f
                    ? "bg-[#d4af37] text-black font-bold"
                    : "border border-white/10 text-gray-400 hover:text-white"
                }`}
            >
              {f} · {stats[f]}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-6 animate-pulse">
            {[1, 2].map(i => (
              <div key={i} className="h-48 bg-white/5 rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {filtered.map(r => (
              <div
                key={r.id}
                className={`relative p-8 rounded-3xl border-l-4 bg-gradient-to-br from-black via-[#0f0f0f] to-black ${STATUS_STYLES[r.status]}`}
              >
                {/* Top */}
                <div className="flex justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-wide">
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
                    className="bg-black border border-white/20 rounded-full px-4 py-1 text-xs tracking-widest"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="EXPIRED">EXPIRED</option>
                  </select>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-y-4 text-sm text-gray-400 border-t border-white/10 pt-6">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} /> {r.reservation_date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} /> {r.time_slot}
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <Phone size={14} />
                    <a href={`tel:${r.phone}`} className="hover:text-[#d4af37]">
                      {r.phone}
                    </a>
                  </div>
                </div>

                {/* Actions */}
                {r.status === "PENDING" && (
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => updateStatus(r.id, "CONFIRMED")}
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-xs tracking-widest uppercase border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
                    >
                      <CheckCircle2 size={14} /> Confirm
                    </button>
                    <button
                      onClick={() => updateStatus(r.id, "EXPIRED")}
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-xs tracking-widest uppercase border border-rose-500/40 text-rose-400 hover:bg-rose-500/10"
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
