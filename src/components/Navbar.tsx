import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Menu', href: '/menu' },
    { name: 'Events', href: '/events' },
    { name: 'Reserve Table', href: '/reserve' },
  ];

  return (
    <nav className="relative z-30 flex justify-between items-center px-6 md:px-10 py-8 bg-transparent">
      {/* <h2 className="text-xl md:text-2xl font-bold tracking-[0.3em] uppercase">
        Bills Lounge & Grill
      </h2> */}

      {/* Desktop Links */}
      <div className="hidden md:flex space-x-8 text-sm uppercase tracking-widest font-sans opacity-80">
        {navLinks.map((link) => (
          <a key={link.name} href={link.href} className="hover:text-gold transition">
            {link.name}
          </a>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden text-white focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="space-y-2">
          <span className={`block h-0.5 w-6 bg-white transition-transform ${isOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
          <span className={`block h-0.5 w-6 bg-white transition-opacity ${isOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-3 bg-white ml-auto transition-transform ${isOpen ? '-rotate-45 -translate-y-2.5 w-6' : ''}`} />
        </div>
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-black/95 border-b border-white/10 flex flex-col items-center py-10 space-y-6 md:hidden"
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-lg uppercase tracking-widest font-sans"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
