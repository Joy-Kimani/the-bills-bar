import React, { useMemo, useState, useEffect } from "react";
/* ---------------- TYPES ---------------- */

type Category =
  | "Breakfast"
  | "Soups"
  | "Meat"
  | "Chicken"
  | "Platters"
  | "Fish & Steak";

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: Category;
  image: string;
}

interface OrderItem extends MenuItem {
  quantity: number;
}

/* ---------------- DATA ---------------- */

const MENU_ITEMS: MenuItem[] = [
  {
    id: "bf1",
    name: "English Breakfast (Full)",
    description: "Bacon, eggs, sausage, baked beans, juice",
    price: 1200,
    category: "Breakfast",
    image: "https://images.unsplash.com/photo-1588625436591-c6d853288b60?q=80&w=729&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "bf2",
    name: "Bills Breakfast",
    description: "Bacon, boiled eggs, sausage, fresh salad",
    price: 1000,
    category: "Breakfast",
    image: "/images/bills-breakfast.jpg",
  },
  {
    id: "sp1",
    name: "Ossobucco Soup",
    price: 500,
    category: "Soups",
    image: "/images/soup.jpg",
  },
  {
    id: "mt1",
    name: "Goat Meat (½ KG)",
    price: 700,
    category: "Meat",
    image: "/images/goat.jpg",
  },
  {
    id: "ch1",
    name: "Chicken Kienyeji (Half)",
    price: 800,
    category: "Chicken",
    image: "/images/kienyeji.jpg",
  },
  {
    id: "pl1",
    name: "BBQ Platter (Serves 3)",
    price: 2700,
    category: "Platters",
    image: "/images/bbq-platter.jpg",
  },
  {
    id: "fs1",
    name: "Fish Fillet",
    description: "Wet fry with greens & ugali",
    price: 1500,
    category: "Fish & Steak",
    image: "/images/fish.jpg",
  },
];

/* ---------------- COMPONENT ---------------- */

const MenuPage: React.FC = () => {
  const [activeCategory, setActiveCategory] =
    useState<Category>("Breakfast");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const categories: Category[] = [
    "Breakfast",
    "Soups",
    "Meat",
    "Chicken",
    "Platters",
    "Fish & Steak",
  ];

  const filteredItems = useMemo(
    () => MENU_ITEMS.filter((i) => i.category === activeCategory),
    [activeCategory]
  );

  const addItem = (item: MenuItem) => {
    setOrderItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const total = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  /* ---------------- ACTIONS ---------------- */

  const handlePayAtCounter = () => {
    console.log("ORDER:", orderItems);
    alert("Order created. Please pay at the counter.");
    setOrderItems([]);
  };

  const handlePayNow = () => {
    console.log("PAYMENT INITIATED:", orderItems);
    alert("Mobile money payment initiated.");
    setOrderItems([]);
  };

  useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeCategory]);
  

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-black text-white pb-28">
      {/* HEADER */}
      <header className="px-6 py-6 text-center border-b border-white/10">
        <h1 className="text-2xl uppercase tracking-widest">
          Bills Lounge & Grill
        </h1>
        <p className="text-xs opacity-60 mt-1">Food Menu • Thika</p>
      </header>

      {/* CATEGORY FILTER */}
      <div className="sticky top-0 z-10 bg-black px-4 py-3 flex gap-3 overflow-x-auto border-b border-white/10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-xs px-4 py-2 rounded-full border whitespace-nowrap ${
              activeCategory === cat
                ? "border-white text-white"
                : "border-white/30 text-white/60"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* MENU LIST */}
      <main className="px-6 py-4 max-w-3xl mx-auto">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 py-4 border-b border-white/10"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover rounded"
            />

            <div className="flex-1">
              <p className="text-sm font-medium">{item.name}</p>
              {item.description && (
                <p className="text-xs opacity-60">
                  {item.description}
                </p>
              )}
              <p className="text-xs mt-1 opacity-80">
                KES {item.price}
              </p>
            </div>

            <button
              onClick={() => addItem(item)}
              className="border border-white/30 px-3 h-9 text-sm"
            >
              +
            </button>
          </div>
        ))}
      </main>

      {/* STICKY ORDER BAR */}
      {orderItems.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-black border-t border-white/20 p-4 flex justify-between items-center">
          <span className="text-sm">
            {orderItems.reduce((n, i) => n + i.quantity, 0)} item(s)
            • KES {total}
          </span>

          <div className="flex gap-3">
            <button
              onClick={handlePayAtCounter}
              className="border border-white/30 px-4 py-2 text-xs"
            >
              Pay at Counter
            </button>
            <button
              onClick={handlePayNow}
              className="bg-white text-black px-4 py-2 text-xs"
            >
              Pay Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
