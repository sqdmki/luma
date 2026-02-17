"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Search, Bell, User } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  // Change background on scroll
  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  return (
    <motion.header
      animate={{ 
        backgroundColor: isScrolled ? "rgba(8, 8, 9, 0.8)" : "rgba(8, 8, 9, 0)",
        backdropFilter: isScrolled ? "blur(20px)" : "blur(0px)",
        borderBottomColor: isScrolled ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0)",
      }}
      className="fixed top-0 right-0 left-[338px] h-[74px] z-50 flex items-center justify-between px-8 border-b transition-colors duration-300 pointer-events-none"
    >
      <div className="flex items-center gap-4 pointer-events-auto">
        <div className="relative group">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#B38DFF] transition-colors" />
          <input 
            type="text" 
            placeholder="Поиск музыки, артистов..." 
            className="bg-white/5 border-none rounded-full py-2.5 pl-10 pr-6 text-[15px] text-white placeholder:text-white/20 focus:ring-1 focus:ring-[#B38DFF]/30 w-[300px] transition-all focus:w-[360px] outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-5 pointer-events-auto">
        <button className="text-white/40 hover:text-white transition-colors relative">
          <Bell size={22} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-[#B38DFF] rounded-full border-2 border-[#080809]"></span>
        </button>
        
        <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors border border-white/5">
          <User size={18} className="text-white/60" />
        </div>
      </div>
    </motion.header>
  );
}
