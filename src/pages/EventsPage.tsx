import React, { useState } from "react";
import { Link, useNavigate } from "react-router"; // Assuming React Router is used
import { toast, Toaster } from "sonner"; // Modern, clean toast library
import Navbar from "../components/Navbar";

const UPCOMING_EVENTS = [
  {
    id: 1,
    title: "Midnight Midas",
    date: "FRIDAY • JAN 16",
    time: "10:00 PM",
    description: "A golden-themed evening with international DJs, signature cocktails, and exclusive vibes.",
    image: "https://images.unsplash.com/photo-1514525253361-bee8a48790c3?auto=format&fit=crop&q=80&w=800",
    tag: "Signature Night"
  },
  {
    id: 2,
    title: "Velvet Lounge Jazz",
    date: "SATURDAY • JAN 17",
    time: "08:00 PM",
    description: "Smooth jazz paired with premium malts and Bills signature bites. Dress to impress.",
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=800",
    tag: "Exclusive"
  },
  {
    id: 3,
    title: "Noir & Gold Masquerade",
    date: "FRIDAY • JAN 23",
    time: "09:00 PM",
    description: "Experience Bills Lounge’s masquerade ball with gourmet platters and immersive music.",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800",
    tag: "VIP Event"
  }
];

const RESIDENCIES = [
  { day: "Tue", event: "Tequila & Tacos", detail: "Ladies pairing" },
  { day: "Wed", event: "Vinyl Nights", detail: "Analog soul" },
  { day: "Thu", event: "Afrobeat Fusion", detail: "Global rhythms" }
];

const PAST_EVENTS = [
  { id: 101, image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=400", label: "NYE Gala 2025" },
  { id: 102, image: "https://images.unsplash.com/photo-1566737236580-c8d48ff934fe?auto=format&fit=crop&q=80&w=400", label: "Champagne Showers" },
  { id: 103, image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=400", label: "Secret Sessions" },
  { id: 104, image: "https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?auto=format&fit=crop&q=80&w=400", label: "Urban Heat" },
];

const EventsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState<number | null>(null);

  // Error Handling & Redirection Logic
  const handleReservation = async (eventId: number, eventTitle: string) => {
    setIsProcessing(eventId);
    
    // Simulate API Call
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // 10% chance to simulate a server error
          Math.random() > 0.1 ? resolve(true) : reject(new Error("Service unavailable"));
        }, 1200);
      });

      toast.success(`Access Granted: ${eventTitle}`, {
        description: "Redirecting you to the concierge...",
      });
      
      // Redirect after success toast
      setTimeout(() => navigate(`/booking/${eventId}`), 1500);
    } catch (error) {
      toast.error("Reservation Failed", {
        description: "Our systems are currently at capacity. Please call our host directly.",
      });
    } finally {
      setIsProcessing(null);
    }
  };

  const handleVIPRedirect = () => {
    toast.info("Opening VIP Application Portal");
    navigate("/reserve");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-serif selection:bg-[#d4af37]/30">
      {/* Toast Provider */}
      <Toaster theme="dark" position="top-center" expand={false} richColors />
      <Navbar />

      {/* Hero Header */}
      <header className="relative h-[50vh] md:h-[70vh] flex items-center justify-center overflow-hidden border-b border-[#d4af37]/20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1529253355930-3b0d50c6c09d?auto=format&fit=crop&q=80&w=1600" 
            className="w-full h-full object-cover opacity-40"
            alt="Bills Lounge Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#0a0a0a]"></div>
        </div>
        <div className="relative z-10 text-center px-6">
          <span className="text-[#d4af37] tracking-[0.4em] text-[10px] md:text-xs uppercase mb-3 block">Since 2022</span>
          <h1 className="text-5xl md:text-8xl font-light italic mb-3 tracking-tight leading-tight">
            Bills <span className="font-bold text-[#d4af37]">Lounge</span>
          </h1>
          <p className="text-gray-400 font-sans tracking-[0.2em] text-[10px] md:text-xs uppercase">Where dining meets exclusivity</p>
        </div>
      </header>

      {/* Weekly Residencies Bar */}
      <div className="bg-gradient-to-r from-[#d4af37]/10 via-[#d4af37]/20 to-[#d4af37]/10 text-[#d4af37] py-4 border-y border-[#d4af37]/20 overflow-x-auto no-scrollbar">
        <div className="flex justify-around items-center min-w-max px-6 gap-8 md:gap-12">
          {RESIDENCIES.map((res, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="font-bold text-lg">{res.day}</span>
              <div className="h-6 w-[1px] bg-[#d4af37]/30"></div>
              <div className="text-xs">
                <p className="font-bold uppercase leading-none text-white/90">{res.event}</p>
                <p className="text-[9px] opacity-70 mt-1 uppercase tracking-tighter">{res.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-[#d4af37] text-[10px] font-bold tracking-[0.4em] uppercase mb-2">Events Calendar</h2>
            <h3 className="text-3xl md:text-5xl font-light leading-tight">Upcoming <span className="font-bold">Nights</span></h3>
          </div>
          <p className="text-gray-500 max-w-xs text-xs md:text-sm font-sans italic leading-relaxed">
            Join us for curated sensory experiences. Secure your attendance in advance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {UPCOMING_EVENTS.map((event) => (
            <div key={event.id} className="group flex flex-col bg-[#111] border border-white/5 hover:border-[#d4af37]/30 transition-all duration-500 rounded-2xl overflow-hidden">
              <div className="relative aspect-[16/10] md:aspect-[4/5] overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-5">
                  <p className="text-[#d4af37] text-[10px] font-bold mb-1 tracking-widest uppercase">{event.tag}</p>
                  <h4 className="text-xl md:text-2xl font-bold">{event.title}</h4>
                </div>
              </div>
              
              <div className="p-5 flex-grow flex flex-col">
                <div className="flex justify-between items-center mb-4 text-[#d4af37] font-sans text-[10px] font-bold tracking-widest border-b border-white/5 pb-3">
                  <span>{event.date}</span>
                  <span>{event.time}</span>
                </div>
                <p className="text-gray-400 text-xs md:text-sm font-sans leading-relaxed mb-6">
                  {event.description}
                </p>
                <button 
                  disabled={isProcessing !== null}
                  onClick={() => handleReservation(event.id, event.title)}
                  className="mt-auto w-full py-3 md:py-4 border border-[#d4af37]/40 text-[#d4af37] font-sans font-bold uppercase text-[9px] tracking-[0.2em] transition-all duration-300 rounded-xl hover:bg-[#d4af37] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing === event.id ? "Processing..." : "Reserve Your Table"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The Vault Gallery */}
      <section className="bg-black py-16 md:py-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light italic mb-3">The <span className="text-[#d4af37]">Vault</span></h2>
            <div className="h-[1px] w-12 bg-[#d4af37] mx-auto"></div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {PAST_EVENTS.map((item) => (
              <div 
                key={item.id} 
                onClick={() => navigate('/gallery')}
                className="relative aspect-square overflow-hidden group rounded-xl cursor-pointer"
              >
                <img 
                  src={item.image} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  alt={item.label} 
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                  <span className="text-[#d4af37] text-[10px] font-bold uppercase tracking-widest text-center">
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="py-16 md:py-24 text-center px-6">
        <h3 className="text-xl md:text-2xl font-light italic mb-8 max-w-md mx-auto leading-relaxed text-gray-300">
          Experience the Exclusive Side of Bills Lounge
        </h3>
        <button 
          onClick={handleVIPRedirect}
          className="inline-block bg-transparent border border-[#d4af37] text-[#d4af37] px-8 md:px-12 py-3 md:py-4 rounded-full font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-[#d4af37] hover:text-black transition-all"
        >
          Reserve for VIP Table
          <Link to="/reserve" />
        </button>
      </footer>
    </div>
  );
};

export default EventsPage;