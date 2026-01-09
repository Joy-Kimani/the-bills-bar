import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full z-20 px-6 md:px-10 py-10 flex flex-col md:flex-row justify-between items-center md:items-end gap-4">
      <div className="text-[10px] uppercase tracking-widest opacity-50 font-sans text-center md:text-left">
        <p>General Kago • Thika</p>
        <p className="mt-1 md:hidden">© 2026 Bills Lounge & Grill</p>
      </div>
      
      <div className="h-[1px] w-24 bg-white/20 hidden md:block mb-1" />
      
      <div className="text-[10px] uppercase tracking-widest opacity-50 font-sans hidden md:block">
        <p>© 2026 All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;