"use client";

import { motion } from "framer-motion";
import { Play, Music2 } from "lucide-react";

const MIX_COLORS = [
  "from-[#B38DFF] to-[#6F42A6]",
  "from-[#8DB8FF] to-[#4D6BB3]",
  "from-[#FF8DB3] to-[#A6426F]",
  "from-[#8DFFB3] to-[#42A66F]",
];

type MixCardProps = {
  title: string;
  description: string;
  index: number;
};

export default function MixCard({ title, description, index }: MixCardProps) {
  const gradient = MIX_COLORS[index % MIX_COLORS.length];

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      className="flex flex-col gap-3 cursor-pointer group"
    >
      <div className={`relative aspect-square rounded-[24px] overflow-hidden bg-linear-to-br ${gradient} p-6 flex flex-col justify-between`}>
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative z-10 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
          <Music2 size={24} className="text-white" />
        </div>

        <div className="relative z-10">
          <h3 className="text-xl font-bold text-white leading-tight">{title}</h3>
        </div>

        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg">
            <Play size={18} fill="black" className="text-black ml-0.5" />
          </div>
        </div>
      </div>
      <div>
        <p className="text-[14px] text-white/40 line-clamp-2">{description}</p>
      </div>
    </motion.div>
  );
}
