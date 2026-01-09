import React from 'react'

const Footer: React.FC = () => {
    return (
      <footer className="absolute bottom-10 left-0 w-full z-20 px-10 flex justify-between items-end">
        <div className="text-[10px] uppercase tracking-widest opacity-50 font-sans">
          <p>General Kago • Thika</p>
        </div>
        <div className="h-[1px] w-24 bg-white/20 hidden md:block" />
      </footer>
    )
}

export default Footer