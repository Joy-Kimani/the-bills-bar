import React, { useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster, toast } from "sonner";
import { ChevronRight, Utensils, Crown } from "lucide-react";

/* ----------------------------------
   TYPES
---------------------------------- */
type BookingMode = "LOUNGE" | "EVENT";

interface Table {
  id: string;
  name: string;
  price: number; // base minimum spend
  section: "LOUNGE" | "GRILL";
}

interface Drink {
  id: number;
  name: string;
  price: number;
}

/* ----------------------------------
   DATA
---------------------------------- */
const TABLES: Table[] = [
  { id: "presidential-booth", name: "Presidential Booth", price: 20000, section: "LOUNGE" },
  { id: "executive-lounge", name: "Executive Lounge Table", price: 10000, section: "LOUNGE" },
  { id: "grill-dining", name: "Grill Dining (Walk-In Friendly)", price: 0, section: "GRILL" },
];

const DRINKS: Drink[] = [
  { id: 1, name: "Ace of Spades Gold", price: 6500 },
  { id: 2, name: "Don Julio 1942", price: 4500 },
  { id: 3, name: "Bill’s Signature Platter & Pitcher", price: 1500 },
];

const EVENT = {
  name: "Golden Saturday",
  schedule: "Saturday • From 8:00 PM",
  tableMultiplier: 1.5,
};

/* ----------------------------------
   PAGE
---------------------------------- */
const ReserveTablePage: React.FC = () => {
  const [mode, setMode] = useState<BookingMode | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [selectedDrinks, setSelectedDrinks] = useState<number[]>([]);
  const [processing, setProcessing] = useState(false);

  // total cost of selected drinks
  const drinkTotal = useMemo(
    () =>
      selectedDrinks.reduce(
        (sum, id) => sum + (DRINKS.find(d => d.id === id)?.price ?? 0),
        0
      ),
    [selectedDrinks]
  );

  // table cost (for events or lounge minimum spend)
  const tableCost =
    mode === "EVENT"
      ? Math.round((selectedTable?.price ?? 0) * EVENT.tableMultiplier)
      : selectedTable?.price ?? 0;

  // total amount due upfront = table cost + any pre-orders
  const amountDue =
    selectedTable?.section === "GRILL"
      ? 0
      : tableCost + drinkTotal;

  // user can proceed if table selected and for lounge/event min spend is met
  const canProceed = selectedTable !== null && 
    (selectedTable.section === "GRILL" || amountDue > 0);

  const toggleDrink = (id: number) => {
    setSelectedDrinks(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    setProcessing(true);
    await new Promise(res => setTimeout(res, 1500));
    toast.success("Reservation confirmed", {
      description: "Our team will contact you shortly to confirm your table.",
    });
    setProcessing(false);
  };

  return (
    <div className="bg-black text-zinc-100 min-h-screen">
      <Toaster position="top-center" richColors theme="dark" />
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-12 gap-16">

          {/* LEFT FLOW */}
          <div className="lg:col-span-7 space-y-20">

            {/* HEADER */}
            <header className="space-y-6">
              <h1 className="text-6xl md:text-7xl font-serif italic">
                Bill’s <span className="text-[#D4AF37]">Lounge & Grill</span>
              </h1>
              <p className="uppercase tracking-[0.3em] text-xs text-zinc-500">
                Thika • Dining • Lounge • Signature Nights
              </p>
            </header>

            {/* STEP 1: Choose Experience */}
            <section className="space-y-8">
              <h2 className="uppercase tracking-widest text-sm font-bold text-[#D4AF37]">
                Choose Your Experience
              </h2>

              <div className="grid sm:grid-cols-2 gap-6">
                <button
                  onClick={() => setMode("LOUNGE")}
                  className={`p-8 border text-left transition ${
                    mode === "LOUNGE"
                      ? "border-[#D4AF37] bg-[#D4AF37]/5"
                      : "border-zinc-800 hover:border-zinc-600"
                  }`}
                >
                  <Utensils className="text-[#D4AF37] mb-4" />
                  <p className="uppercase font-bold tracking-widest text-sm">
                    Lounge & Grill
                  </p>
                  <p className="text-xs text-zinc-500 mt-2">
                    Dining, drinks & relaxed seating
                  </p>
                </button>

                <button
                  onClick={() => setMode("EVENT")}
                  className={`p-8 border text-left transition ${
                    mode === "EVENT"
                      ? "border-[#D4AF37] bg-[#D4AF37]/5"
                      : "border-zinc-800 hover:border-zinc-600"
                  }`}
                >
                  <Crown className="text-[#D4AF37] mb-4" />
                  <p className="uppercase font-bold tracking-widest text-sm">
                    Signature Event Night
                  </p>
                  <p className="text-xs text-zinc-500 mt-2">
                    {EVENT.name} • DJs • Premium tables
                  </p>
                </button>
              </div>
            </section>

            {/* STEP 2: Select Table */}
            {mode && (
              <section className="space-y-6">
                <h2 className="uppercase tracking-widest text-sm font-bold text-[#D4AF37]">
                  Select Your Table
                </h2>

                {TABLES.map(table => (
                  <button
                    key={table.id}
                    disabled={table.section === "GRILL" && mode === "EVENT"}
                    onClick={() => setSelectedTable(table)}
                    className={`w-full p-6 border flex justify-between items-center transition ${
                      selectedTable?.id === table.id
                        ? "border-[#D4AF37] bg-[#D4AF37]/5"
                        : "border-zinc-800 hover:border-zinc-600"
                    } ${
                      table.section === "GRILL" && mode === "EVENT"
                        ? "opacity-30 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <div>
                      <p className="uppercase font-bold text-sm tracking-wide">
                        {table.name}
                      </p>
                      <p className="text-[10px] text-zinc-500 uppercase mt-1">
                        {table.section}
                      </p>
                    </div>
                    <span className="font-mono text-[#D4AF37]">
                      {table.price === 0
                        ? "No Charge"
                        : `KES ${table.price.toLocaleString()}`}
                    </span>
                  </button>
                ))}
              </section>
            )}

            {/* STEP 3: Optional Pre-Orders */}
            {selectedTable?.section === "LOUNGE" && (
              <section className="space-y-6">
                <h2 className="uppercase tracking-widest text-sm font-bold text-[#D4AF37]">
                  Optional Pre-Orders
                </h2>

                <div className="border border-zinc-800 divide-y divide-zinc-800">
                  {DRINKS.map(drink => (
                    <label
                      key={drink.id}
                      className="flex justify-between p-5 cursor-pointer hover:bg-zinc-900"
                    >
                      <span className="uppercase text-xs tracking-wide">
                        {drink.name}
                      </span>
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-[#D4AF37] text-xs">
                          KES {drink.price.toLocaleString()}
                        </span>
                        <input
                          type="checkbox"
                          checked={selectedDrinks.includes(drink.id)}
                          onChange={() => toggleDrink(drink.id)}
                          className="accent-[#D4AF37]"
                        />
                      </div>
                    </label>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* SUMMARY */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 border border-zinc-800 p-10 bg-zinc-950 space-y-8">
              <h3 className="font-serif italic text-3xl">
                Booking Summary
              </h3>

              <div className="text-xs uppercase tracking-widest space-y-3">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Venue</span>
                  <span>Bill’s Lounge & Grill — Thika</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Experience</span>
                  <span>{mode ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Table</span>
                  <span>{selectedTable?.name ?? "—"}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-[#D4AF37]/30">
                <span className="block text-[10px] uppercase text-zinc-500">
                  Amount Due Now
                </span>
                <span className="text-4xl font-mono text-[#D4AF37]">
                  KES {amountDue.toLocaleString()}
                </span>
              </div>

              <button
                disabled={!canProceed || processing}
                onClick={handleSubmit}
                className="w-full py-5 bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-xs disabled:opacity-30 flex items-center justify-center gap-3"
              >
                {processing ? "Confirming..." : "Confirm Reservation"}
                <ChevronRight size={14} />
              </button>

              <p className="text-[9px] text-center text-zinc-600 uppercase">
                Smart Casual • 21+ Only • Tables held for 20 minutes
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReserveTablePage;
