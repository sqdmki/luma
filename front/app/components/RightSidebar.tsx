"use client";

import { motion } from "framer-motion";
import { MoreHorizontal, Heart, ListMusic, ChevronRight } from "lucide-react";

const CURRENT_TRACK = {
  title: "Midnight City",
  artist: "M83",
  album: "Hurry Up, We're Dreaming",
  cover: "/album-placeholder.jpg",
  isLiked: true,
};

const NEXT_UP = [
  { title: "Wait", artist: "M83" },
  { title: "Intro", artist: "M83" },
];

export default function RightSidebar() {
  return (
    <aside className="w-[355px] bg-(--bg-accent) rounded-[20px] p-[24px] flex flex-col h-full shrink-0 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-medium text-white">Сейчас играет</h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-white/60 hover:text-white transition-colors"
        >
          <MoreHorizontal size={20} />
        </motion.button>
      </div>

      <div className="w-full aspect-square rounded-[16px] overflow-hidden mb-6 shadow-2xl bg-(--bg-color) relative group">
        <div className="w-full h-full bg-linear-to-br from-[#2a2a2a] to-[#121214] flex items-center justify-center text-white/20">
          <span className="text-4xl font-bold opacity-20">LUMA</span>
        </div>
      </div>

      <div className="flex flex-col gap-1 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="overflow-hidden">
            <motion.h1
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-white truncate hover:text-clip hover:whitespace-normal cursor-pointer"
            >
              {CURRENT_TRACK.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base text-white/60 hover:text-white transition-colors cursor-pointer truncate"
            >
              {CURRENT_TRACK.artist}
            </motion.p>
          </div>

          <motion.button
            whileTap={{ scale: 0.8 }}
            className="mt-1 text-[#B38DFF]"
          >
            <Heart
              size={24}
              fill={CURRENT_TRACK.isLiked ? "#B38DFF" : "transparent"}
            />
          </motion.button>
        </div>
      </div>

      <div className="bg-(--bg-color) rounded-[16px] p-4 mb-6 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-[#B38DFF] to-transparent opacity-50"></div>
        <h3 className="text-sm font-medium text-white mb-2">Об исполнителе</h3>
        <p className="text-xs text-white/50 line-clamp-3 leading-relaxed">
          Французский электронный музыкальный проект, основанный в 2001 году в
          Антибе. Проект возглавляет мультиинструменталист Энтони Гонсалес.
        </p>
        <motion.button
          whileHover={{ x: 5 }}
          className="text-xs text-white font-medium mt-3 flex items-center gap-1"
        >
          Подробнее
          <ChevronRight size={16} />
        </motion.button>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-white/80">Далее в очереди</h3>
          <button className="text-xs text-[#B38DFF] hover:underline">
            Открыть очередь
          </button>
        </div>

        <div className="flex flex-col gap-2 overflow-y-auto pr-1 custom-scrollbar">
          {NEXT_UP.map((track, i) => (
            <motion.div
              key={i}
              whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              className="flex items-center gap-3 p-2 rounded-[10px] cursor-pointer transition-colors"
            >
              <div className="w-8 h-8 bg-white/10 rounded-[6px] flex items-center justify-center shrink-0">
                <ListMusic size={14} className="text-white/40" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm text-white truncate">
                  {track.title}
                </span>
                <span className="text-xs text-white/40 truncate">
                  {track.artist}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </aside>
  );
}
