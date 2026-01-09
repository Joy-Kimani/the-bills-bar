import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import { Menu, X, ShoppingBag, AlertCircle, Loader2 } from "lucide-react";

/* ---------- TYPES ---------- */

type Category =
  | "Breakfast" | "Soups" | "Meat" | "Chicken" | "Platters"
  | "Fish & Steak" | "Beers" | "Cocktails" | "Soft Drinks" | "Wines";

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
  { id: "bf1", name: "English Breakfast", price: 1200, category: "Breakfast", type: "FOOD", image: "https://images.unsplash.com/photo-1588625436591-c6d853288b60?q=80&w=729&auto=format&fit=crop" },
  { id: "mt1", name: "Goat Meat (½ KG)", price: 700, category: "Meat", type: "FOOD", image: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?q=80&w=500&auto=format&fit=crop" },
  { id: "pl1", name: "BBQ Platter", price: 2700, category: "Platters", type: "FOOD", image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=500&auto=format&fit=crop" },
  { id: "dr1", name: "Tusker Lager", price: 400, category: "Beers", type: "DRINK", image: "https://images.unsplash.com/photo-1618885472179-5e474019f2a9?q=80&w=500&auto=format&fit=crop" },
  { id: "dr2", name: "Classic Mojito", price: 850, category: "Cocktails", type: "DRINK", image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=500&auto=format&fit=crop" },
  { id: "dr3", name: "Red Wine (Glass)", price: 600, category: "Wines", type: "DRINK", image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=500&auto=format&fit=crop" },
];

/* ---------- COMPONENT ---------- */

const MenuPage: React.FC = () => {
  const [mode, setMode] = useState<OrderMode>("KITCHEN");
  const [activeCategory, setActiveCategory] = useState<Category>("Breakfast");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [goldTheme, setGoldTheme] = useState(true);
  const [isNavOpen, setIsNavOpen] = useState(false);

  // States for Loading and Errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  /* ---------- INITIAL FETCH SIMULATION ---------- */
  useEffect(() => {
    const loadMenu = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        // Randomly simulate an error for demo purposes (comment out to test success)
        // if (Math.random() > 0.9) throw new Error("Failed to load menu items.");
        setError(null);
      } catch (err) {
        setError("Unable to load the menu. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };
    loadMenu();
  }, []);

  const categories = useMemo(
    () => (mode === "KITCHEN"
        ? ["Breakfast", "Soups", "Meat", "Chicken", "Platters", "Fish & Steak"]
        : ["Beers", "Cocktails", "Soft Drinks", "Wines"]) as Category[],
    [mode]
  );

  useEffect(() => {
    setActiveCategory(categories[0]);
  }, [categories]);

  const items = useMemo(
    () => MENU_ITEMS.filter((i) => i.category === activeCategory && (mode === "BAR" ? i.type === "DRINK" : i.type === "FOOD")),
    [activeCategory, mode]
  );

  /* ---------- LOGIC ---------- */

  const addItem = (item: MenuItem) => {
    setOrderItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      return existing ? prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i) : [...prev, { ...item, quantity: 1 }];
    });
    toast.success(`Added ${item.name}`);
  };

  const removeItem = (id: string) => {
    setOrderItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity: i.quantity - 1 } : i).filter((i) => i.quantity > 0));
  };

  const total = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const drinkTotal = orderItems.filter((i) => i.type === "DRINK").reduce((s, i) => s + i.price * i.quantity, 0);

  const confirmOrder = async () => {
    if (mode === "BAR" && drinkTotal > 0 && drinkTotal < 2500) {
      toast.error("Minimum bar spend is KES 2,500");
      return;
    }
    setProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 2000));
      toast.success("Order confirmed successfully!");
      setOrderItems([]);
      setShowReceipt(false);
    } catch (e) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  /* ---------- SUB-COMPONENTS ---------- */

  const SkeletonItem = () => (
    <div className="flex items-center gap-4 border-b border-white/5 pb-4 animate-pulse">
      <div className="w-20 h-20 md:w-24 md:h-24 bg-white/10 rounded-xl" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-white/10 rounded w-3/4" />
        <div className="h-3 bg-white/10 rounded w-1/4" />
      </div>
      <div className="w-10 h-10 rounded-full bg-white/10" />
    </div>
  );

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className={`min-h-screen transition-colors duration-500 ${goldTheme ? "bg-black text-white" : "bg-zinc-900 text-white"} pb-32`}>
        
        {/* NAVBAR */}
        <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <h1 className="uppercase tracking-[0.3em] font-bold text-lg">Bills Lounge</h1>
            
            <div className="hidden md:flex items-center gap-8 text-[10px] uppercase tracking-[0.2em]">
              <a href="#" className="hover:text-amber-400 transition">Menu</a>
              <a href="#" className="hover:text-amber-400 transition">Reservations</a>
              <a href="#" className="hover:text-amber-400 transition">Events</a>
              <button onClick={() => setGoldTheme(!goldTheme)} className="border border-white/20 px-3 py-1 rounded">
                {goldTheme ? "Gold" : "Classic"}
              </button>
            </div>

            <div className="flex items-center gap-4 md:hidden">
                <button onClick={() => setIsNavOpen(!isNavOpen)}>
                    {isNavOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
          </div>

          {/* MOBILE NAV */}
          <AnimatePresence>
            {isNavOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }} 
                animate={{ height: "auto", opacity: 1 }} 
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden border-t border-white/10 bg-black overflow-hidden"
              >
                <div className="flex flex-col p-6 gap-4 text-xs uppercase tracking-widest">
                    <a href="#" onClick={() => setIsNavOpen(false)}>Menu</a>
                    <a href="#" onClick={() => setIsNavOpen(false)}>Reservations</a>
                    <button onClick={() => {setGoldTheme(!goldTheme); setIsNavOpen(false)}} className="text-left">
                        Theme: {goldTheme ? "Gold" : "Classic"}
                    </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* MODE SWITCH */}
        <div className="mt-8 flex justify-center px-4">
          <div className="flex w-full max-w-xs bg-white/5 border border-white/10 rounded-xl p-1">
            {(["KITCHEN", "BAR"] as OrderMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-3 text-[10px] md:text-xs uppercase tracking-widest rounded-lg transition-all ${
                  mode === m ? "bg-amber-400 text-black font-bold" : "opacity-40 hover:opacity-100"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* CATEGORIES - HORIZONTAL SCROLL */}
        <div className="flex gap-3 px-4 py-8 overflow-x-auto no-scrollbar scroll-smooth">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-6 py-2 rounded-full text-[10px] uppercase tracking-widest border transition-all ${
                activeCategory === cat ? "border-amber-400 text-amber-400 bg-amber-400/10" : "border-white/20 opacity-40 hover:opacity-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* MAIN CONTENT AREA */}
        <main className="max-w-5xl mx-auto px-4">
          {loading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => <SkeletonItem key={i} />)}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
              <p className="text-sm opacity-70 mb-6">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-8 py-3 border border-amber-400 text-amber-400 text-xs uppercase"
              >
                Retry Loading
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-4 border-b border-white/5 pb-6 group"
                  >
                    <div className="relative overflow-hidden rounded-xl">
                        <img src={item.image} className="w-20 h-20 md:w-28 md:h-28 object-cover transition-transform duration-500 group-hover:scale-110" alt={item.name} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm md:text-base">{item.name}</p>
                      <p className="text-xs text-amber-400/80 mt-1">
                        KES {item.price.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => addItem(item)}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black transition-all flex items-center justify-center"
                    >
                      +
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </main>

        {/* CHECKOUT BAR */}
        <AnimatePresence>
            {orderItems.length > 0 && (
            <motion.div 
                initial={{ y: 100 }} 
                animate={{ y: 0 }} 
                exit={{ y: 100 }}
                className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-900 text-amber-400 px-6 py-4 md:py-6 flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
            >
                <div className="flex items-center gap-3">
                    <div className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold">
                        {orderItems.reduce((a, b) => a + b.quantity, 0)}
                    </div>
                    <p className="font-black text-lg">KES {total.toLocaleString()}</p>
                </div>
                <button
                onClick={() => setShowReceipt(true)}
                className="bg-black text-white px-6 py-3 rounded-lg uppercase tracking-widest text-[10px] font-bold flex items-center gap-2"
                >
                <ShoppingBag size={14} /> Review Order
                </button>
            </motion.div>
            )}
        </AnimatePresence>

        {/* RECEIPT MODAL */}
        <AnimatePresence>
          {showReceipt && (
            <motion.div
              className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white text-black w-full max-w-md rounded-2xl p-8 font-mono shadow-2xl"
              >
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-xl font-bold uppercase tracking-tighter">Your Order</h2>
                        <p className="text-[10px] opacity-50 uppercase mt-1">Table Service • Bills Lounge</p>
                    </div>
                    <button onClick={() => setShowReceipt(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4 max-h-[40vh] overflow-y-auto mb-6 pr-2">
                    {orderItems.map((i) => (
                    <div key={i.id} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                        <div className="flex-1">
                            <span className="font-bold">{i.quantity}x</span> {i.name}
                        </div>
                        <div className="flex items-center gap-4">
                        <span className="font-bold">{(i.price * i.quantity).toLocaleString()}</span>
                        <button onClick={() => removeItem(i.id)} className="w-6 h-6 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition">
                            −
                        </button>
                        </div>
                    </div>
                    ))}
                </div>

                <div className="border-t-2 border-dashed border-gray-200 pt-4 flex justify-between items-end">
                  <span className="text-xs uppercase">Total Amount</span>
                  <span className="text-2xl font-black">KES {total.toLocaleString()}</span>
                </div>

                <button
                  disabled={processing}
                  onClick={confirmOrder}
                  className="w-full mt-8 bg-black text-white py-4 rounded-xl uppercase tracking-widest text-xs font-bold flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {processing ? (
                    <><Loader2 className="animate-spin" size={16} /> Securely Processing...</>
                  ) : "Confirm & Pay Now"}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default MenuPage;