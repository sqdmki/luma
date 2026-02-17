"use client";

import { motion } from "framer-motion";

const AVATAR_COLORS = [
  "bg-[#B38DFF]/10",
  "bg-[#8DB8FF]/10",
  "bg-[#FF8DB3]/10",
  "bg-[#8DFFB3]/10",
  "bg-[#FFD18D]/10",
  "bg-[#8DD6FF]/10",
];

type ArtistCardProps = {
  name: string;
  avatar?: string;
};

export default function ArtistCard({ name }: ArtistCardProps) {
  const colorIndex = name.charCodeAt(0) % AVATAR_COLORS.length;
  const bgColor = AVATAR_COLORS[colorIndex];

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      className="flex flex-col items-center gap-3 cursor-pointer group"
    >
      <div className={`w-full aspect-square rounded-full overflow-hidden ${bgColor} flex items-center justify-center ring-1 ring-white/4 group-hover:ring-white/8 transition-all`}>
        <span className="text-[28px] font-bold text-white/20">{name[0]}</span>
      </div>
      <div className="text-center w-full">
        <p className="text-[15px] font-medium text-white truncate group-hover:text-[#B38DFF] transition-colors">{name}</p>
        <p className="text-[13px] text-white/25 mt-0.5">Исполнитель</p>
      </div>
    </motion.div>
  );
}
