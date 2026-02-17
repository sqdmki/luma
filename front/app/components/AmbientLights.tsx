"use client";

import { motion } from "framer-motion";

/**
 * Анимированный фон с "гуляющими огнями" на основе переданного цвета.
 * Цвет приводится к нужной яркости и прозрачности через CSS фильтры и opacity.
 */
export default function AmbientLights({ color = "#B38DFF" }: { color?: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 mix-blend-screen">
      {/* Основное пятно */}
      <motion.div
        animate={{
          x: ["-30%", "10%", "-30%"],
          y: ["-20%", "5%", "-20%"],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-[-25%] left-[-15%] w-[70%] h-[90%] rounded-full blur-[140px]"
        style={{ backgroundColor: color }}
      />
      
      {/* Второе пятно */}
      <motion.div
        animate={{
          x: ["40%", "-10%", "40%"],
          y: ["10%", "-20%", "10%"],
          scale: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-[5%] right-[-20%] w-[50%] h-[70%] rounded-full blur-[120px]"
        style={{ backgroundColor: color }}
      />

      {/* Третье пятно */}
      <motion.div
        animate={{
          x: ["-10%", "40%", "-10%"],
          y: ["40%", "10%", "40%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-[-15%] left-[20%] w-[35%] h-[35%] rounded-full blur-[100px]"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}
