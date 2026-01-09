import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


const LandingScreen: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-black text-white font-serif flex flex-col">
      {/* Background Section */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black z-10" />
        <motion.img 
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1574094433880-11e8f7ba0171?auto=format&fit=crop&q=80" 
          alt="Luxury Nightclub Interior"
          className="w-full h-full object-cover opacity-60"
        />
      </div>

      <Navbar />
      
      <main className="relative z-20 flex-grow flex flex-col items-center justify-center text-center px-6 py-20">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-gold uppercase tracking-[0.4em] text-xs md:text-sm mb-4 font-sans"
        >
          Bills Lounge & Grill - Thika
        </motion.span>
      
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-4xl md:text-7xl font-light mb-6 tracking-tight leading-tight"
        >
          Drinks & Grill <br className="md:hidden" /> Menu
        </motion.h1>
      
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="max-w-md text-xs md:text-base opacity-70 mb-10 font-sans leading-relaxed"
        >
          Scan the menu, place your order and enjoy. <br className="hidden md:block"/>
          Pay at the counter or via mobile money.
        </motion.p>
      
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex flex-col md:flex-row gap-4 w-full md:w-auto"
        >
          <a href='/menu' className="px-10 py-4 bg-white text-black hover:bg-amber-500 hover:text-white transition-all duration-300 uppercase tracking-widest text-xs font-bold font-sans text-center">
            View Menu
          </a>
          <a href='/reserve' className="px-10 py-4 border border-white/30 hover:border-white transition-all duration-300 uppercase tracking-widest text-xs font-bold font-sans text-center">
            Reserve Table
          </a>
        </motion.div>
      </main>
      
      <Footer />

      <style>{`
        .text-gold { color: #D4AF37; }
        .bg-gold { background-color: #D4AF37; }
      `}</style>
    </div>
  );
};

export default LandingScreen;