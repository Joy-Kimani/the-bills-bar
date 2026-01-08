import React, { useState } from "react";

const TABLES = [
  { id: "vip", name: "VIP Table", price: 10000 },
  { id: "standard", name: "Standard Table", price: 5000 },
];

const ReserveTablePage: React.FC = () => {
  const [selected, setSelected] = useState<typeof TABLES[0] | null>(null);

  const deposit = selected ? selected.price / 2 : 0;

  const handleReserve = () => {
    alert(
      `Deposit of KES ${deposit} initiated. Balance payable at venue.`
    );
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-2xl uppercase tracking-widest mb-6">
        Reserve a Table
      </h1>

      <div className="max-w-md mx-auto space-y-4">
        {TABLES.map(table => (
          <button
            key={table.id}
            onClick={() => setSelected(table)}
            className={`w-full border p-4 text-left ${
              selected?.id === table.id
                ? "border-white"
                : "border-white/30"
            }`}
          >
            <p className="font-medium">{table.name}</p>
            <p className="text-xs opacity-60">
              Full Price: KES {table.price}
            </p>
          </button>
        ))}

        {selected && (
          <div className="mt-6 border-t border-white/20 pt-4">
            <p className="text-sm">
              Deposit Required:{" "}
              <strong>KES {deposit}</strong>
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
    </div>
  );
};

export default ReserveTablePage;
