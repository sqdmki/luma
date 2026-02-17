"use client";

import { motion } from "framer-motion";
import { Play, MoreHorizontal, Music } from "lucide-react";

type TrackItemProps = {
  index: number;
  title: string;
  album: string;
  duration: string;
  plays: string;
  isExplicit?: boolean;
};

export default function TrackItem({ index, title, album, duration, plays, isExplicit }: TrackItemProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.998 }}
      className="group flex items-center gap-4 px-4 py-2.5 rounded-[14px] hover:bg-white/5 transition-colors cursor-pointer"
    >
      <div className="w-7 flex items-center justify-center shrink-0">
        <span className="text-[15px] text-white/30 font-medium group-hover:hidden">{index}</span>
        <Play size={14} fill="white" className="text-white hidden group-hover:block" />
      </div>

      <div className="w-10 h-10 rounded-[8px] bg-white/4 flex items-center justify-center shrink-0">
        <Music size={16} className="text-white/15" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[15px] text-white font-medium truncate">{title}</p>
        <div className="flex items-center gap-2">
          {isExplicit && (
            <span className="text-[11px] bg-white/10 text-white/50 px-1.5 py-px rounded font-semibold leading-none">E</span>
          )}
          <p className="text-[14px] text-white/30 truncate">{album}</p>
        </div>
      </div>

      <span className="text-[14px] text-white/25 shrink-0 min-w-[60px] text-right">{plays}</span>
      <span className="text-[14px] text-white/25 shrink-0 min-w-[44px] text-right">{duration}</span>

      <MoreHorizontal size={18} className="text-white/20 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
    </motion.div>
  );
}
