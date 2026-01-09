import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router";
// 1. Fix: qrcode.react exports QRCodeCanvas or QRCodeSVG, not a default QRCode
import { QRCodeCanvas } from "qrcode.react"; 
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster, toast } from "sonner";
import { Clock, X } from "lucide-react"; // Removed unused Utensils, Crown

/* ================= TYPES ================= */
type BookingMode = "LOUNGE" | "EVENT";
type ReservationStatus = "CONFIRMED" | "WAITLISTED";

interface Table {
  id: string;
  name: string;
  baseMinimum: number;
  section: "LOUNGE" | "GRILL";
}

interface Drink {
  id: number;
  name: string;
  price: number;
}

interface Event {
  id: string;
  name: string;
  schedule: string;
  date: string;
  tableMultiplier: number;
  totalTables: number;
  reservedTables: number;
}

/* ================= MOCK DATA ================= */
const EVENTS: Event[] = [
  {
    id: "golden-saturday",
    name: "Golden Saturday",
    schedule: "Saturday • From 8:00 PM",
    date: "2026-01-13T20:00:00",
    tableMultiplier: 1.5,
    totalTables: 12,
    reservedTables: 10,
  },
];

const TABLES: Table[] = [
  { id: "presidential", name: "Presidential Booth", baseMinimum: 20000, section: "LOUNGE" },
  { id: "executive", name: "Executive Lounge Table", baseMinimum: 10000, section: "LOUNGE" },
];

const DRINKS: Drink[] = [
  { id: 1, name: "Ace of Spades Gold", price: 6500 },
  { id: 2, name: "Don Julio 1942", price: 4500 },
  { id: 3, name: "Signature Platter & Pitcher", price: 1500 },
];

/* ================= PAGE ================= */
const ReserveTablePage: React.FC = () => {
  const [params] = useSearchParams();
  const activeEvent = EVENTS.find(e => e.id === params.get("event")) ?? null;

  const [mode, setMode] = useState<BookingMode | null>(null);
  const [modeLocked, setModeLocked] = useState(false);

  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [selectedDrinks, setSelectedDrinks] = useState<number[]>([]);
  const [status, setStatus] = useState<ReservationStatus>("CONFIRMED");
  const [processing, setProcessing] = useState(false);

  const [reservationId, setReservationId] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);

  /* ---------- AUTO EVENT MODE ---------- */
  useEffect(() => {
    if (!activeEvent || modeLocked) return;

    if (activeEvent.reservedTables >= activeEvent.totalTables) {
      setStatus("WAITLISTED");
    }

    setMode("EVENT");
    setModeLocked(true);
  }, [activeEvent, modeLocked]);

  /* ---------- CALCULATIONS ---------- */
  const drinkTotal = useMemo(
    () => selectedDrinks.reduce(
      (sum, id) => sum + (DRINKS.find(d => d.id === id)?.price ?? 0),
      0
    ),
    [selectedDrinks]
  );

  const minimumSpend = useMemo(() => {
    if (!selectedTable) return 0;
    if (mode === "EVENT" && activeEvent)
      return Math.round(selectedTable.baseMinimum * activeEvent.tableMultiplier);
    return selectedTable.baseMinimum;
  }, [selectedTable, mode, activeEvent]);

  const remainingCredit = Math.max(minimumSpend - drinkTotal, 0);
  const amountDueNow = Math.max(drinkTotal - minimumSpend, 0);

  const toggleDrink = (id: number) => {
    setSelectedDrinks(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  /* ---------- CONFIRM ---------- */
  const handleSubmit = async () => {
    setProcessing(true);
    await new Promise(res => setTimeout(res, 1200));

    if (status === "CONFIRMED") {
      const generatedId = `BILLS-${Date.now()}`;
      setReservationId(generatedId);
      setShowQR(true);
      toast.success("Reservation Confirmed");
    } else {
      toast.success("Added to waitlist");
    }
    setProcessing(false);
  };

  return (
    <div className="bg-black text-zinc-300 min-h-screen">
      <Toaster richColors theme="dark" />
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-12 gap-14">
        {/* LEFT */}
        <div className="lg:col-span-7 space-y-10">
          <h1 className="text-5xl italic text-white">
            Bill’s <span className="text-[#D4AF37]">Lounge & Grill</span>
          </h1>

          {activeEvent && (
            <p className="uppercase text-xs tracking-widest text-[#D4AF37]">
              {activeEvent.name} • {activeEvent.schedule}
            </p>
          )}

          {status !== "WAITLISTED" && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-widest">1. Select Table</h2>
              {TABLES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTable(t)}
                  className={`w-full border p-5 flex justify-between transition-all ${
                    selectedTable?.id === t.id ? "border-[#D4AF37] bg-zinc-900" : "border-zinc-800"
                  }`}
                >
                  <span>{t.name}</span>
                  <span>KES {t.baseMinimum.toLocaleString()}</span>
                </button>
              ))}

              <h2 className="text-sm font-bold uppercase tracking-widest pt-6">2. Pre-order Drinks</h2>
              <div className="grid grid-cols-1 gap-3">
                {DRINKS.map(drink => (
                   <button
                    key={drink.id}
                    onClick={() => toggleDrink(drink.id)}
                    className={`text-left p-4 border transition-all ${
                        selectedDrinks.includes(drink.id) ? "border-[#D4AF37] bg-zinc-900" : "border-zinc-800"
                    }`}
                   >
                    <div className="flex justify-between">
                        <span>{drink.name}</span>
                        <span className="text-white">KES {drink.price.toLocaleString()}</span>
                    </div>
                   </button>
                ))}
              </div>
            </div>
          )}

          {status === "WAITLISTED" && (
            <div className="border border-zinc-800 p-6 text-sm flex items-center">
              <Clock size={16} className="mr-3 text-[#D4AF37]" />
              Event sold out — join the priority waitlist.
            </div>
          )}
        </div>

        {/* SUMMARY */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 border border-zinc-800 p-8 space-y-6 bg-zinc-950">
            <h3 className="italic text-xl text-white underline decoration-[#D4AF37]">Booking Summary</h3>

            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span>Minimum Spend</span>
                    <span>KES {minimumSpend.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                    <span>Pre-ordered Drinks</span>
                    <span>KES {drinkTotal.toLocaleString()}</span>
                </div>
                <hr className="border-zinc-800" />
                <div className="flex justify-between text-[#D4AF37] font-bold">
                    <span>Remaining Credit</span>
                    <span>KES {remainingCredit.toLocaleString()}</span>
                </div>
                {amountDueNow > 0 && (
                    <div className="flex justify-between text-white">
                        <span>Extra Amount Due</span>
                        <span>KES {amountDueNow.toLocaleString()}</span>
                    </div>
                )}
            </div>

            <button
              disabled={processing || (status === "CONFIRMED" && !selectedTable)}
              onClick={handleSubmit}
              className="w-full py-4 bg-[#D4AF37] text-black font-bold uppercase text-xs tracking-widest hover:bg-[#b8962f] disabled:opacity-50 transition-colors"
            >
              {processing ? "Processing..." : status === "WAITLISTED" ? "Join Waitlist" : "Confirm Reservation"}
            </button>
          </div>
        </div>
      </main>

      {/* QR MODAL */}
      {showQR && reservationId && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-zinc-950 p-10 border border-[#D4AF37] text-center relative max-w-sm w-full">
            <button 
                onClick={() => setShowQR(false)} 
                className="absolute top-4 right-4 text-zinc-500 hover:text-white"
            >
              <X size={24} />
            </button>
            <h3 className="text-xl text-white italic mb-6">Entrance QR Code</h3>
            <div className="bg-white p-4 inline-block rounded-sm">
                {/* 2. Using the correct component from qrcode.react */}
                <QRCodeCanvas value={reservationId} size={200} />
            </div>
            <p className="mt-6 text-xs text-zinc-500 font-mono">
              ID: {reservationId}
            </p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ReserveTablePage;