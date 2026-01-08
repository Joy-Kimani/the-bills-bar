import React from "react";

const EVENTS = [
  {
    id: 1,
    title: "Friday Night Vibes",
    date: "Every Friday",
    description: "Live DJ • Drinks • Good Energy",
    image: "/images/event1.jpg",
  },
  {
    id: 2,
    title: "Saturday Live Band",
    date: "Every Saturday",
    description: "Live performances & BBQ",
    image: "/images/event2.jpg",
  },
];

const EventsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-2xl uppercase tracking-widest mb-8">
        Upcoming Events
      </h1>

      <div className="grid gap-6 max-w-3xl mx-auto">
        {EVENTS.map(event => (
          <div
            key={event.id}
            className="border border-white/10 rounded overflow-hidden"
          >
            <img
              src={event.image}
              alt={event.title}
              className="h-48 w-full object-cover"
            />

            <div className="p-4">
              <h2 className="text-lg">{event.title}</h2>
              <p className="text-xs opacity-60">{event.date}</p>
              <p className="text-sm mt-2 opacity-80">
                {event.description}
              </p>

              <a
                href="/reserve"
                className="inline-block mt-4 text-xs border px-4 py-2"
              >
                Reserve a Table
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
