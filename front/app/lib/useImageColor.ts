"use client";

import { useEffect, useState } from "react";
import ColorThief from "colorthief";

/**
 * Хук для извлечения доминирующего цвета из изображения.
 * Использует библиотеку colorthief для точного анализа палитры.
 * Включает алгоритм нормализации яркости и насыщенности для музыкального интерфейса.
 */
export function useImageColor(imageUrl: string | null) {
  const [color, setColor] = useState<string>("#B38DFF"); // Дефолтный фиолетовый Luma

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const palette = colorThief.getPalette(img, 10); // Увеличиваем палитру до 10 цветов
        
        if (palette && palette.length > 0) {
          // Ищем самый "сочный" цвет в палитре
          let bestColor = palette[0];
          let maxScore = -1;
          
          for (const rgb of palette) {
            const [r, g, b] = rgb;
            
            // Стандартная яркость
            const brightness = (r * 0.2126 + g * 0.7152 + b * 0.0722);
            
            // Насыщенность
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const saturation = max === 0 ? 0 : (max - min) / max;

            // Игнорируем слишком темные или почти белые цвета для основы скоринга
            if (brightness < 30 || brightness > 230) continue;

            // Скоринг: приоритет высокой насыщенности и средней яркости
            // Мы ищем именно "цвет", а не просто светлое/темное пятно
            const score = saturation * 1.5 + (1 - Math.abs(128 - brightness) / 128);

            if (score > maxScore) {
              maxScore = score;
              bestColor = rgb;
            }
          }

          let [r, g, b] = bestColor;
          
          // Финальная нормализация для интерфейса
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const saturation = max === 0 ? 0 : (max - min) / max;

          // Если цвет всё еще недостаточно насыщенный, "вытягиваем" его
          if (saturation < 0.4) {
            const boost = 0.4 / (saturation || 0.1);
            const avg = (r + g + b) / 3;
            r = Math.round(avg + (r - avg) * boost);
            g = Math.round(avg + (g - avg) * boost);
            b = Math.round(avg + (b - avg) * boost);
          }

          // Гарантируем минимальную яркость для читаемости
          const finalBrightness = (r * 0.2126 + g * 0.7152 + b * 0.0722);
          if (finalBrightness < 100) {
            const factor = 100 / finalBrightness;
            r = Math.min(255, r * factor);
            g = Math.min(255, g * factor);
            b = Math.min(255, b * factor);
          }

          setColor(`rgb(${Math.round(Math.min(255, r))}, ${Math.round(Math.min(255, g))}, ${Math.round(Math.min(255, b))})`);
        }
      } catch (error) {
        console.error("Error extracting color:", error);
        setColor("#B38DFF");
      }
    };

    img.onerror = () => {
      console.error("Failed to load image for color extraction");
      setColor("#B38DFF");
    };
  }, [imageUrl]);

  return color;
}
