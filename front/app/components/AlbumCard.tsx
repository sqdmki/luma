"use client";

import { motion } from "framer-motion";
import { Play, Music2 } from "lucide-react";

const ACCENT_TINTS = [
  "from-[#B38DFF]/10 to-transparent",
  "from-[#8DB8FF]/10 to-transparent",
  "from-[#FF8DB3]/10 to-transparent",
  "from-[#8DFFB3]/10 to-transparent",
  "from-[#FFD18D]/10 to-transparent",
  "from-[#8DD6FF]/10 to-transparent",
  "from-[#D18DFF]/10 to-transparent",
  "from-[#FF8D8D]/10 to-transparent",
  "from-[#8DFFD1]/10 to-transparent",
];

type AlbumCardProps = {
  title: string;
  year: string;
  cover?: string;
  index?: number;
};

export default function AlbumCard({ title, year, index = 0 }: AlbumCardProps) {
  const tint = ACCENT_TINTS[index % ACCENT_TINTS.length];

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      className="flex flex-col gap-3 cursor-pointer group"
    >
      <div className="relative aspect-square rounded-[14px] overflow-hidden bg-white/4">
        <div className={`absolute inset-0 bg-linear-to-br ${tint}`} />
        <div className="w-full h-full flex items-center justify-center relative">
          <Music2 size={32} className="text-white/[0.07]" />
        </div>
        <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <motion.div
            initial={{ y: 6, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full bg-[#B38DFF] flex items-center justify-center ml-auto shadow-lg shadow-[#B38DFF]/20"
          >
            <Play size={18} fill="white" className="text-white ml-0.5" />
          </motion.div>
        </div>
      </div>
      <div>
        <p className="text-[15px] font-medium text-white truncate group-hover:text-white/90 transition-colors">{title}</p>
        <p className="text-[14px] text-white/30">{year}</p>
      </div>
    </motion.div>
  );
}
