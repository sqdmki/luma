"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

type VideoClipCardProps = {
  title: string;
  thumbnail?: string;
  youtubeUrl: string;
  duration?: string;
};

export default function VideoClipCard({ title, youtubeUrl, duration }: VideoClipCardProps) {
  return (
    <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
      <motion.div
        whileTap={{ scale: 0.97 }}
        className="flex flex-col gap-3 cursor-pointer group"
      >
        <div className="relative aspect-video rounded-[14px] overflow-hidden bg-white/4">
          <div className="w-full h-full flex items-center justify-center">
            <Play size={28} className="text-white/[0.07]" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 bg-black/20">
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/20"
            >
              <Play size={20} fill="white" className="text-white ml-0.5" />
            </motion.div>
          </div>
          {duration && (
            <span className="absolute bottom-2 right-2 text-[13px] font-medium text-white/70 bg-black/60 px-2 py-0.5 rounded-md">{duration}</span>
          )}
        </div>
        <p className="text-[15px] font-medium text-white truncate group-hover:text-white/80 transition-colors">{title}</p>
      </motion.div>
    </a>
  );
}
