import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import { Wine, Loader2, X, Trash2, ChevronRight, Plus } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* ---------- TYPES & CONSTANTS ---------- */
type Category = "Breakfast" | "Soups" | "Meat" | "Chicken" | "Platters" | "Fish & Steak" | "Beers" | "Cocktails" | "Soft Drinks" | "Wines";
type OrderMode = "KITCHEN" | "BAR";
type ItemType = "FOOD" | "DRINK";
type TableType = "STANDARD" | "VIP";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: Category;
  type: ItemType;
  image: string;
}

interface OrderItem extends MenuItem {
  quantity: number;
}

interface Table {
  id: string;
  type: TableType;
  reservations: string[]; 
}

const MENU_ITEMS: MenuItem[] = [
  { id: "bf1", name: "English Breakfast", price: 1200, category: "Breakfast", type: "FOOD", image: "https://images.unsplash.com/photo-1588625436591-c6d853288b60?q=80&w=800" },
  { id: "bf2", name: "Full English", price: 1400, category: "Breakfast", type: "FOOD", image: "https://images.unsplash.com/photo-1588625436591-c6d853288b60?q=80&w=800" },
  { id: "mt1", name: "Goat Meat (½ KG)", price: 700, category: "Meat", type: "FOOD", image: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?q=80&w=800" },
  { id: "pl1", name: "BBQ Platter", price: 2700, category: "Platters", type: "FOOD", image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=800" },
  { id: "dr1", name: "Tusker Lager", price: 400, category: "Beers", type: "DRINK", image: "https://images.unsplash.com/photo-1618885472179-5e474019f2a9?q=80&w=800" },
  { id: "dr2", name: "Classic Mojito", price: 850, category: "Cocktails", type: "DRINK", image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800" },
];

// Defined outside to persist "data" for the demo session
const INITIAL_TABLES: Table[] = [
  { id: "S1", type: "STANDARD", reservations: [] },
  { id: "S2", type: "STANDARD", reservations: [] },
  { id: "V1", type: "VIP", reservations: [] },
];

const MenuPage: React.FC = () => {
  /* ---------- STATE ---------- */
  const [mode, setMode] = useState<OrderMode>("KITCHEN");
  const [activeCategory, setActiveCategory] = useState<Category>("Breakfast");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showReserve, setShowReserve] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tableType, setTableType] = useState<TableType>("STANDARD");
  const [reservedTime, setReservedTime] = useState<string>("");
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);

  /* ---------- LOGIC ---------- */
  useEffect(() => { 
    const timer = setTimeout(() => setLoading(false), 800); 
    return () => clearTimeout(timer); 
  }, []);

  const categories = useMemo<Category[]>(() =>
    mode === "KITCHEN"
      ? ["Breakfast", "Soups", "Meat", "Chicken", "Platters", "Fish & Steak"]
      : ["Beers", "Cocktails", "Soft Drinks", "Wines"], [mode]
  );

  useEffect(() => { setActiveCategory(categories[0]); }, [categories]);

  const items = useMemo(() =>
    MENU_ITEMS.filter(i => i.category === activeCategory && i.type === (mode === "BAR" ? "DRINK" : "FOOD")),
    [activeCategory, mode]
  );

  const addItem = (item: MenuItem) => {
    setOrderItems(prev => {
      const found = prev.find(i => i.id === item.id);
      return found ? prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i) : [...prev, { ...item, quantity: 1 }];
    });
    toast.success(`Added ${item.name}`, { duration: 1000 });
  };

  const total = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);

  const proceedCheckout = () => {
    if (mode === "BAR" && total < 2500) {
      toast.info("Spend KES 2,500+ in BAR mode to unlock Table Reservations.");
    }
    setShowCheckout(true);
  };

  const confirmOrder = async () => {
    try {
      setProcessing(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Order Successful!");
      setOrderItems([]);
      setShowCheckout(false);
    } catch (err: any) {
      toast.error("Order Failed");
    } finally {
      setProcessing(false);
    }
  };

  const confirmReservation = async () => {
    try {
      if (!reservedTime) throw new Error("Please select a time slot");

      const availableTable = tables.find(t => t.type === tableType && !t.reservations.includes(reservedTime));
      if (!availableTable) throw new Error(`No ${tableType} tables available at ${reservedTime}`);

      setProcessing(true);
      await new Promise(resolve => setTimeout(resolve, 1500));

      setTables(prev => prev.map(t => 
        t.id === availableTable.id ? { ...t, reservations: [...t.reservations, reservedTime] } : t
      ));

      toast.success(`Table ${availableTable.id} reserved at ${reservedTime}`);
      setOrderItems([]);
      setShowReserve(false);
      setShowCheckout(false);
    } catch (err: any) {
      toast.error(err.message || "Reservation Failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>

      <Toaster richColors position="top-center" theme="dark" />
      <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] pb-32 md:pb-40 font-sans selection:bg-[#d4af37]/30">
      <Navbar />

        {/* HEADER */}
        <header className="pt-10 md:pt-16 pb-6 px-4 text-center">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-[#d4af37] text-[9px] md:text-[11px] uppercase tracking-[0.4em] mb-2 block">Premium Experience</motion.span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif uppercase tracking-widest font-bold">Bills Lounge</h1>
        </header>

        {/* MODE SWITCHER */}
        <div className="flex justify-center mb-6 md:mb-10 px-4">
          <div className="flex w-full max-w-xs bg-white/5 border border-white/10 rounded-full p-1 backdrop-blur-sm">
            {(["KITCHEN", "BAR"] as OrderMode[]).map(m => (
              <button key={m} onClick={() => { setMode(m); setOrderItems([]); }}
                className={`flex-1 py-2.5 text-[10px] md:text-[11px] uppercase tracking-widest rounded-full transition-all duration-300 ${mode === m ? "bg-[#D4AF37] text-black font-bold shadow-lg shadow-[#D4AF37]/20" : "opacity-40 hover:opacity-100"}`}>
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* CATEGORY NAV */}
        <div className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-md py-4 mb-6 border-b border-white/5">
          <div className="flex gap-3 px-4 overflow-x-auto no-scrollbar sm:justify-center">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-[9px] md:text-[10px] uppercase tracking-widest border transition-all duration-300 ${activeCategory === cat ? "border-[#d4af37] text-[#d4af37] bg-[#d4af37]/10" : "border-white/10 opacity-40 hover:opacity-70"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN FEED */}
        <motion.main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 opacity-20">
              <Loader2 className="animate-spin mb-4" size={32} />
              <p className="uppercase text-[10px] tracking-widest">Refreshing Menu...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
              <Wine className="mx-auto text-[#d4af37]/20 mb-4" size={40} />
              <h3 className="text-[#D4AF37] font-serif italic text-lg">Not available</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <AnimatePresence mode="popLayout">
                {items.map(item => (
                  <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-4 p-3 md:p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#d4af37]/30 transition-all group">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl">
                      <img src={item.image} className="h-full w-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500" alt={item.name} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold uppercase tracking-wide truncate">{item.name}</h4>
                      <p className="text-[#D4AF37] text-xs mt-1 font-mono">KES {item.price.toLocaleString()}</p>
                    </div>
                    <button onClick={() => addItem(item)}
                      className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#d4af37] hover:text-black transition-all">
                      <Plus size={18} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.main>

        {/* FLOATING ACTION BAR */}
        <AnimatePresence>
          {orderItems.length > 0 && (
            <motion.div initial={{ y: 100, x: "-50%" }} animate={{ y: 0, x: "-50%" }} exit={{ y: 100, x: "-50%" }}
              className="fixed bottom-6 left-1/2 z-50 w-[92%] max-w-lg bg-[#161616]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center justify-between">
              <div>
                <p className="text-[9px] uppercase opacity-40 tracking-widest">Total Order</p>
                <p className="text-lg font-serif text-[#D4AF37] font-bold">KES {total.toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setOrderItems([])} className="p-3 rounded-xl bg-red-500/10 text-red-500"><Trash2 size={18} /></button>
                <button onClick={proceedCheckout} className="bg-[#D4AF37] text-black px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  Review <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CHECKOUT MODAL */}
        <AnimatePresence>
          {showCheckout && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCheckout(false)} className="absolute inset-0 bg-black/90" />
              <motion.div className="relative bg-[#1a1a1a] w-full max-w-md rounded-[2rem] p-8 border border-white/10 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-serif italic text-[#d4af37]">Checkout</h2>
                  <button onClick={() => setShowCheckout(false)}><X size={20} /></button>
                </div>
                
                <div className="space-y-4 max-h-[30vh] overflow-y-auto mb-6 custom-scrollbar">
                  {orderItems.map(item => (
                    <div key={item.id} className="flex justify-between text-sm border-b border-white/5 pb-2">
                      <span>{item.quantity}x {item.name}</span>
                      <span>KES {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  {mode === "BAR" && total >= 2500 && (
                    <button onClick={() => { setShowReserve(true); setShowCheckout(false); }}
                      className="w-full bg-[#D4AF37] text-black py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest">
                      Reserve Table
                    </button>
                  )}
                  <button onClick={confirmOrder} disabled={processing}
                    className="w-full bg-white/10 text-[#D4AF37] py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest flex justify-center">
                    {processing ? <Loader2 className="animate-spin" size={16} /> : (mode === "BAR" ? "Buy Drinks Only" : "Confirm Order")}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* RESERVE TABLE MODAL */}
        <AnimatePresence>
          {showReserve && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowReserve(false)} className="absolute inset-0 bg-black/90" />
              <motion.div className="relative bg-[#1a1a1a] w-full max-w-md rounded-[2rem] p-8 border border-white/10 shadow-2xl">
                <h2 className="text-xl font-serif italic text-[#d4af37] mb-6">Reserve Table</h2>
                <div className="space-y-4 mb-6">
                  <select value={tableType} onChange={e => setTableType(e.target.value as TableType)} className="w-full py-3 px-4 rounded-xl bg-black border border-white/20 text-sm">
                    <option value="STANDARD">Standard Table</option>
                    <option value="VIP">VIP Table</option>
                  </select>
                  <input type="time" value={reservedTime} onChange={e => setReservedTime(e.target.value)} className="w-full py-3 px-4 rounded-xl bg-black border border-white/20 text-sm" />
                </div>
                <button onClick={confirmReservation} disabled={processing} className="w-full bg-[#D4AF37] text-black py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest flex justify-center">
                  {processing ? <Loader2 className="animate-spin" size={16} /> : "Finalize Reservation"}
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Replace the old style tag with this */}
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(212, 175, 55, 0.2); 
          border-radius: 10px; 
        }
      `}} />
      <Footer />
    </>
  );
};

export default MenuPage;