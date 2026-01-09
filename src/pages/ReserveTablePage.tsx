import React, { useState } from "react";
import Footer from "../components/Footer";

const TABLES = [
  { id: "vip-bar", name: "VIP Bar Table", price: 10000, section: "BAR" },
  { id: "standard-bar", name: "Standard Bar Table", price: 5000, section: "BAR" },
  { id: "dining", name: "Dining Area (Walk-in Only)", price: 0, section: "KITCHEN" },
];

const DRINKS = [
  { id: 1, name: "Whiskey Bottle", price: 4500 },
  { id: 2, name: "Wine Bottle", price: 3000 },
  { id: 3, name: "Cocktail Jug", price: 2500 },
];

const MIN_BAR_SPEND = 2500;

const ReserveTablePage: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [selectedDrinks, setSelectedDrinks] = useState<number[]>([]);

  const drinkTotal = selectedDrinks.reduce(
    (sum, id) => sum + DRINKS.find(d => d.id === id)!.price,
    0
  );

  const deposit = selectedTable ? selectedTable.price / 2 : 0;

  const toggleDrink = (id: number) => {
    setSelectedDrinks(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const canReserve =
    selectedTable?.section === "BAR" && drinkTotal >= MIN_BAR_SPEND;

  const handleReserve = () => {
    alert(
      `Reservation successful!\n\n` +
      `Drinks Total: KES ${drinkTotal}\n` +
      `Deposit Paid: KES ${deposit}\n` +
      `Balance payable at venue`
    );
  };

  return (
    <>
      <div className="min-h-screen bg-black text-white px-6 py-10">
        <h1 className="text-2xl uppercase tracking-widest mb-6">
          Reserve a Bar Table
        </h1>

        {/* TABLE SELECTION */}
        <div className="max-w-md mx-auto space-y-4">
          {TABLES.map(table => (
            <button
              key={table.id}
              onClick={() => setSelectedTable(table)}
              disabled={table.section === "KITCHEN"}
              className={`w-full border p-4 text-left transition ${
                table.section === "KITCHEN"
                  ? "border-white/10 opacity-40 cursor-not-allowed"
                  : selectedTable?.id === table.id
                  ? "border-white"
                  : "border-white/30"
              }`}
            >
              <p className="font-medium">{table.name}</p>
              {table.section === "BAR" ? (
                <p className="text-xs opacity-60">
                  Deposit from drinks • Table value KES {table.price}
                </p>
              ) : (
                <p className="text-xs text-red-400">
                  Kitchen orders are walk-in only
                </p>
              )}
            </button>
          ))}
        </div>

        {/* DRINK SELECTION */}
        {selectedTable?.section === "BAR" && (
          <div className="max-w-md mx-auto mt-8">
            <h2 className="text-sm uppercase opacity-60 mb-3">
              Select Drinks (Min KES 2,500)
            </h2>

            <div className="space-y-2">
              {DRINKS.map(drink => (
                <label
                  key={drink.id}
                  className="flex justify-between border border-white/20 p-3 cursor-pointer"
                >
                  <span>{drink.name}</span>
                  <span>KES {drink.price}</span>
                  <input
                    type="checkbox"
                    checked={selectedDrinks.includes(drink.id)}
                    onChange={() => toggleDrink(drink.id)}
                    className="ml-3"
                  />
                </label>
              ))}
            </div>

            <p className="mt-4 text-sm">
              Drinks Total:{" "}
              <strong
                className={drinkTotal >= MIN_BAR_SPEND ? "text-green-400" : "text-red-400"}
              >
                KES {drinkTotal}
              </strong>
            </p>
          </div>
        )}

        {/* CONFIRMATION */}
        {canReserve && (
          <div className="max-w-md mx-auto mt-6 border-t border-white/20 pt-4">
            <p className="text-sm">
              Deposit Required: <strong>KES {deposit}</strong>
            </p>

            <button
              onClick={handleReserve}
              className="mt-4 w-full bg-white text-black py-3 text-sm"
            >
              Pay Deposit & Reserve
            </button>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default ReserveTablePage;
