import { useRef, useState, useCallback, useEffect } from "react";

interface VolumeSliderProps {
  volume: number;
  isMuted: boolean;
  setVolume: (volume: number) => void;
}

export function VolumeSlider({ volume, isMuted, setVolume }: VolumeSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const displayVolume = isMuted ? 0 : volume;

  const updateVolume = useCallback((clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const newVolume = x / rect.width;
    setVolume(newVolume);
  }, [setVolume]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    trackRef.current.setPointerCapture(e.pointerId);
    setIsDragging(true);
    updateVolume(e.clientX);
    // Предотвращаем стандартное поведение (например, выделение текста при перетаскивании)
    e.preventDefault();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateVolume(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !trackRef.current) return;
    trackRef.current.releasePointerCapture(e.pointerId);
    setIsDragging(false);
  };

  // На случай если компонент размонтируется во время drag
  useEffect(() => {
    return () => {
      setIsDragging(false);
    };
  }, []);

  return (
    <div 
      className="flex items-center w-[80px] h-[24px] cursor-pointer group/slider"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ touchAction: 'none' }} // Отключаем скролл на мобилках при свайпе по ползунку
    >
      <div 
        ref={trackRef}
        className="w-full h-[4px] bg-white/20 rounded-full relative"
      >
        {/* Заполненная часть */}
        <div 
          className="absolute top-0 left-0 bottom-0 bg-white rounded-full transition-all"
          style={{ width: `${displayVolume * 100}%`, transitionDuration: isDragging ? '0ms' : '150ms' }}
        />
        {/* Шарик (Thumb) */}
        <div 
          className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-[12px] h-[12px] bg-white rounded-full
            ${isDragging ? 'opacity-100 scale-100' : 'opacity-0 scale-50 group-hover/slider:opacity-100 group-hover/slider:scale-100'} 
            transition-all`}
          style={{ 
            left: `clamp(6px, ${displayVolume * 100}%, calc(100% - 6px))`, 
            transitionDuration: isDragging ? '0ms' : '150ms'
          }}
        />
      </div>
    </div>
  );
}
