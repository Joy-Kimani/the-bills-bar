import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Menu', to: '/menu' },
    { name: 'Events', to: '/events' },
    { name: 'Reserve Table', to: '/reserve' },
  ];

  return (
    <nav className="relative z-30 flex justify-between items-center px-6 md:px-10 py-8 bg-transparent">
      {/* Desktop Links */}
      <div className="hidden md:flex space-x-8 text-sm uppercase tracking-widest font-sans opacity-80">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.to}
            className="hover:text-gold transition-colors duration-300"
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-white focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="space-y-2">
          <span
            className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${
              isOpen ? 'rotate-45 translate-y-2.5' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-opacity duration-300 ${
              isOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-3 bg-white ml-auto transition-transform duration-300 ${
              isOpen ? '-rotate-45 -translate-y-2.5 w-6' : ''
            }`}
          />
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
              <Link
                key={link.name}
                to={link.to}
                className="text-lg uppercase tracking-widest font-sans hover:text-gold transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
