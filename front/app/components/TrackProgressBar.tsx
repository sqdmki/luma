import { useRef, useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { usePlayerStore } from "../store/playerStore";
import { audioService } from "../services/audioService";

interface TrackProgressBarProps {
  lineContainerRef: React.RefObject<HTMLDivElement | null>;
}

export function TrackProgressBar({ lineContainerRef }: TrackProgressBarProps) {
  const duration = usePlayerStore(state => state.duration);
  const isPlaying = usePlayerStore(state => state.isPlaying);
  const storeProgress = usePlayerStore(state => state.progress);
  const seek = usePlayerStore(state => state.seek);

  const [isDragging, setIsDragging] = useState(false);
  const [lineContainerEl, setLineContainerEl] = useState<HTMLDivElement | null>(null);
  const dragProgressRef = useRef(0);
  
  const overlayRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const updateDOM = useCallback((progressToSet: number) => {
    if (duration > 0 && fillRef.current && thumbRef.current) {
      const percent = (progressToSet / duration) * 100;
      fillRef.current.style.width = `${percent}%`;
      thumbRef.current.style.left = `clamp(5px, ${percent}%, calc(100% - 5px))`;
    } else if (fillRef.current && thumbRef.current) {
      fillRef.current.style.width = `0%`;
      thumbRef.current.style.left = `5px`;
    }
  }, [duration]);

  // Sync loop for smooth 60fps updates directly to DOM
  useEffect(() => {
    let rafId: number;
    const loop = () => {
      if (!isDragging && isPlaying) {
        updateDOM(audioService.getCurrentProgress());
      }
      rafId = requestAnimationFrame(loop);
    };

    if (isPlaying && !isDragging) {
      rafId = requestAnimationFrame(loop);
    } else if (!isDragging) {
      updateDOM(storeProgress);
    }

    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, isDragging, storeProgress, updateDOM]);

  const updateProgress = useCallback((clientX: number) => {
    if (!overlayRef.current || duration === 0) return;
    const rect = overlayRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const newPercent = x / rect.width;
    dragProgressRef.current = newPercent * duration;
    updateDOM(dragProgressRef.current);
  }, [duration, updateDOM]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!overlayRef.current || duration === 0) return;
    overlayRef.current.setPointerCapture(e.pointerId);
    setIsDragging(true);
    updateProgress(e.clientX);
    e.preventDefault();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateProgress(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !overlayRef.current) return;
    overlayRef.current.releasePointerCapture(e.pointerId);
    setIsDragging(false);
    seek(dragProgressRef.current);
  };

  useEffect(() => {
    return () => {
      setIsDragging(false);
    };
  }, []);

  useEffect(() => {
    setLineContainerEl(lineContainerRef.current);
  }, [lineContainerRef]);

  return (
    <>
      {lineContainerEl &&
        createPortal(
          <div className="w-full h-[3px] bg-white/20 rounded-full relative">
            <div
              ref={fillRef}
              className="absolute top-0 left-0 bottom-0 bg-white/80 rounded-full will-change-[width]"
              style={{ width: "0%" }}
            />
          </div>,
          lineContainerEl
        )}
      <div
        ref={overlayRef}
        className="absolute left-[4px] right-[4px] h-[20px] cursor-pointer group/progress z-20"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ top: "-8.5px", touchAction: "none" }}
      >
        <div
          ref={thumbRef}
          className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px] bg-white rounded-full will-change-[left]
            ${isDragging ? "opacity-100 scale-100" : "opacity-0 scale-50 group-hover/progress:opacity-100 group-hover/progress:scale-100"}
            transition-[opacity,transform] duration-150 ease-out`}
          style={{ left: "5px" }}
        />
      </div>
    </>
  );
}
