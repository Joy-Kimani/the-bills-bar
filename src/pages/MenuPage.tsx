import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import { Wine, Loader2, X, AlertCircle, Trash2, ChevronRight } from "lucide-react";

/* ---------- TYPES ---------- */
type Category = "Breakfast" | "Soups" | "Meat" | "Chicken" | "Platters" | "Fish & Steak" | "Beers" | "Cocktails" | "Soft Drinks" | "Wines";
type OrderMode = "KITCHEN" | "BAR";
type ItemType = "FOOD" | "DRINK";

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

/* ---------- DATA ---------- */
const MENU_ITEMS: MenuItem[] = [
  { id: "bf1", name: "English Breakfast", price: 1200, category: "Breakfast", type: "FOOD", image: "https://images.unsplash.com/photo-1588625436591-c6d853288b60?q=80&w=800" },
  { id: "mt1", name: "Goat Meat (½ KG)", price: 700, category: "Meat", type: "FOOD", image: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?q=80&w=800" },
  { id: "pl1", name: "BBQ Platter", price: 2700, category: "Platters", type: "FOOD", image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=800" },
  { id: "dr1", name: "Tusker Lager", price: 400, category: "Beers", type: "DRINK", image: "https://images.unsplash.com/photo-1618885472179-5e474019f2a9?q=80&w=800" },
  { id: "dr2", name: "Classic Mojito", price: 850, category: "Cocktails", type: "DRINK", image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800" },
];

const MenuPage: React.FC = () => {
  const [mode, setMode] = useState<OrderMode>("KITCHEN");
  const [activeCategory, setActiveCategory] = useState<Category>("Breakfast");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. FIXED LOADING: Ensure loading state clears correctly
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  /* ---------- CATEGORIES LOGIC ---------- */
  const categories = useMemo<Category[]>(
    () => (mode === "KITCHEN"
      ? ["Breakfast", "Soups", "Meat", "Chicken", "Platters", "Fish & Steak"]
      : ["Beers", "Cocktails", "Soft Drinks", "Wines"]),
    [mode]
  );

  useEffect(() => { 
    setActiveCategory(categories[0]); 
  }, [categories]);

  const items = useMemo(
    () => MENU_ITEMS.filter(
      i => i.category === activeCategory && i.type === (mode === "BAR" ? "DRINK" : "FOOD")
    ),
    [activeCategory, mode]
  );

  // 2. ITEM NOT FOUND NOTIFICATION: Triggered when a category is empty
  useEffect(() => {
    if (!loading && items.length === 0) {
      toast.error(`Category Unavailable`, {
        description: `${activeCategory} is not available at the moment.`,
        icon: <AlertCircle className="text-red-500" size={20} />,
        duration: 3000,
      });
    }
  }, [activeCategory, items.length, loading]);

  /* ---------- ORDER LOGIC ---------- */
  const addItem = (item: MenuItem) => {
    setOrderItems(prev => {
      const found = prev.find(i => i.id === item.id);
      return found 
        ? prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { ...item, quantity: 1 }];
    });
    toast.success(`Added ${item.name}`);
  };

  const removeItem = (id: string) => {
    setOrderItems(prev => prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0));
  };

  const total = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);

  // 3. ENHANCED ERROR HANDLING: Added try/catch for the payment process
  const confirmOrder = async () => {
    try {
      if (mode === "BAR" && total < 2500) {
        throw new Error("Minimum bar spend is KES 2,500");
      }
      
      setProcessing(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      toast.success("Order Successful!", { description: "Your items are being prepared." });
      setOrderItems([]);
      setShowReceipt(false);
    } catch (err: any) {
      toast.error("Order Failed", { description: err.message });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <Toaster richColors position="top-center" theme="dark" />
      <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] pb-40 font-sans">

        {/* HEADER */}
        <header className="pt-12 pb-6 px-6 text-center">
          <span className="text-[#c6a96a] text-[10px] uppercase tracking-[0.4em] mb-2 block">Premium Experience</span>
          <h1 className="text-4xl md:text-5xl font-serif uppercase tracking-widest font-bold">Bills Lounge</h1>
        </header>

        {/* MODE SWITCHER */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white/5 border border-white/10 rounded-full p-1 backdrop-blur-sm">
            {(["KITCHEN", "BAR"] as OrderMode[]).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`px-8 py-2 text-[11px] uppercase tracking-widest rounded-full transition-all ${
                  mode === m ? "bg-[#D4AF37] text-black font-bold" : "opacity-40 hover:opacity-100"
                }`}
              >{m}</button>
            ))}
          </div>
        </div>

        {/* CATEGORY NAV */}
        <div className="flex gap-4 px-6 mb-10 overflow-x-auto no-scrollbar justify-start md:justify-center">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-6 py-2 rounded-full text-[10px] uppercase tracking-widest border transition-all ${
                activeCategory === cat ? "border-[#c6a96a] text-[#c6a96a] bg-[]/10" : "border-white/5 opacity-40"
              }`}
            >{cat}</button>
          ))}
        </div>

        {/* MAIN FEED */}
        <motion.main className="max-w-4xl mx-auto px-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-20">
              <Loader2 className="animate-spin mb-4" size={32} />
              <p className="uppercase text-[10px] tracking-widest">Refreshing Menu...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
              <Wine className="mx-auto text-[#c6a96a]/20 mb-4" size={48} />
              <h3 className="text-[#D4AF37] font-serif italic text-xl">Not available at the moment</h3>
              <p className="text-[10px] uppercase tracking-widest opacity-40 mt-2">Please check back later</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              <AnimatePresence mode="popLayout">
                {items.map(item => (
                  <motion.div key={item.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#c6a96a]/30 transition-all group">
                    <img src={item.image} className="w-20 h-20 rounded-xl object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all" />
                    <div className="flex-1">
                      <h4 className="text-sm font-bold uppercase tracking-wide">{item.name}</h4>
                      <p className="text-[#D4AF37] text-xs mt-1 font-mono">KES {item.price.toLocaleString()}</p>
                    </div>
                    <button onClick={() => addItem(item)}
                      className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#c6a96a] hover:text-black transition-all font-bold">
                      +
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
              className="fixed bottom-8 left-1/2 z-50 w-[90%] max-w-md bg-[#161616] border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase opacity-40 tracking-widest">Total Order</p>
                <p className="text-xl font-serif text-[#D4AF37] font-bold">KES {total.toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setOrderItems([])} className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                  <Trash2 size={18} />
                </button>
                <button onClick={() => setShowReceipt(true)}
                  className="bg-[#D4AF37] text-black px-6 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center gap-2">
                  Review Order <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* REVIEW MODAL */}
        {showReceipt && (
          <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-[#1a1a1a] w-full max-w-sm rounded-3xl p-8 border border-white/10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-serif italic text-[#c6a96a]">Your Order</h2>
                <button onClick={() => setShowReceipt(false)} className="opacity-50 hover:opacity-100"><X /></button>
              </div>
              <div className="space-y-4 max-h-60 overflow-y-auto mb-8 pr-2">
                {orderItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                    <span className="opacity-80">{item.quantity}x {item.name}</span>
                    <span className="font-mono">{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mb-8 pt-4 border-t border-white/10">
                <span className="uppercase text-xs tracking-widest opacity-50">Grand Total</span>
                <span className="text-xl font-serif font-bold text-[#D4AF37]">KES {total.toLocaleString()}</span>
              </div>
              <button disabled={processing} onClick={confirmOrder}
                className="w-full bg-[#D4AF37] text-black py-4 rounded-xl text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3">
                {processing ? <Loader2 className="animate-spin" size={18} /> : "Confirm & Send"}
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
};

export default MenuPage;