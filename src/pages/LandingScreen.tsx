import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';

const LandingScreen:React.FC = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black text-white font-serif">
      {/* Background Overlay with Gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black z-10" />
        <motion.img 
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1574094433880-11e8f7ba0171?auto=format&fit=crop&q=80" 
          alt="Luxury Nightclub Interior"
          className="w-full h-full object-cover opacity-60"
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 flex justify-between items-center px-10 py-8">
        <h2 className="text-2xl font-bold tracking-[0.3em] uppercase">Bills Lounge & Grill</h2>
        <div className="hidden md:flex space-x-8 text-sm uppercase tracking-widest font-sans opacity-80">
          <a href="/menu" className="hover:text-gold transition">Menu</a>
          <a href="/events" className="hover:text-gold transition">Events</a>
          <a href="/reserve" className="hover:text-gold transition">Reserve Table</a>
        </div>
      </nav>
      
      <main className="relative z-20 flex flex-col items-center justify-center h-[70vh] text-center px-4">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-gold uppercase tracking-[0.4em] text-sm mb-4 font-sans"
        >
          Bills Lounge & Grill - Thika
        </motion.span>
      
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-5xl md:text-7xl font-light mb-6 tracking-tight"
        >
          Drinks & Grill Menu
        </motion.h1>
      
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-sm md:text-base opacity-70 mb-10 font-sans"
        >
          Scan the menu, place your order and enjoy. Pay at the counter or via mobile money.
        </motion.p>
      
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex flex-col md:flex-row gap-6"
        >
          <button className="px-10 py-4 bg-white text-black hover:bg-amber-500 hover:text-white transition-all duration-300 uppercase tracking-widest text-xs font-bold font-sans">
            
            <a href='/menu'>View Menu</a>
          </button>
          <button className="px-10 py-4 border border-white/30 hover:border-white transition-all duration-300 uppercase tracking-widest text-xs font-bold font-sans">
            <a href='/reserve'>Reserve Table</a>
          </button>
        </motion.div>
      </main>
      
      <footer className="absolute bottom-10 left-0 w-full z-20 px-10 flex justify-between items-end">
        <div className="text-[10px] uppercase tracking-widest opacity-50 font-sans">
          <p>General Kago • Thika</p>
        </div>
        <div className="h-[1px] w-24 bg-white/20 hidden md:block" />
      </footer>
      


      {/* Custom Styles for "Gold" accent */}
      <style>{`
        .text-gold { color: #D4AF37; }
        .bg-gold { background-color: #D4AF37; }
      `}</style>
    </div>
  );
};

export default LandingScreen;