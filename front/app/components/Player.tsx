"use client";

import Image from "next/image";
import { 
  ExplicitIcon, HeartInactiveIcon, LyricsIcon, MixTracksIcon, NextIcon, 
  PlayIcon, PauseIcon, PreviousIcon, RepeatIcon, RepeatOneIcon, TracksQueueIcon, 
  VolumeFullIcon, VolumeMediumIcon, VolumeLowIcon, VolumeOffIcon 
} from "../lib/icons";
import { usePlayerStore } from "../store/playerStore";
import { useRef, useEffect } from "react";
import { audioService } from "../services/audioService";
import { VolumeSlider } from "./VolumeSlider";
import { TrackProgressBar } from "./TrackProgressBar";

export default function Player() {
  const { 
    currentTrack, 
    isPlaying, 
    volume, 
    isMuted,
    duration,
    repeatMode,
    togglePlay,
    toggleRepeat,
    nextTrack, 
    prevTrack,
    setVolume,
    toggleMute,
    seek
  } = usePlayerStore();
  const progressLineContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentTrack) {
      audioService.initialize(currentTrack.src);
    }
  }, [currentTrack]);

  if (!currentTrack) return null;

  const formattedArtists = currentTrack.artists.join(", ");

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeOffIcon className="w-[23px] h-auto max-md:w-[21px] text-current" />;
    if (volume < 0.3) return <VolumeLowIcon className="w-[23px] h-auto max-md:w-[21px] text-current" />;
    if (volume < 0.7) return <VolumeMediumIcon className="w-[23px] h-auto max-md:w-[21px] text-current" />;
    return <VolumeFullIcon className="w-[23px] h-auto max-md:w-[21px] text-current" />;
  };

  const changeVolumeByStep = (direction: 1 | -1) => {
    const step = 0.05;
    const currentVolume = isMuted ? 0 : volume;
    const newVolume = Math.max(0, Math.min(1, currentVolume + direction * step));
    
    if (isMuted && newVolume > 0) {
      toggleMute();
    } else if (!isMuted && newVolume === 0) {
      toggleMute();
    }
    
    setVolume(newVolume);
  };

  const handleVolumeWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    changeVolumeByStep(e.deltaY < 0 ? 1 : -1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Не перехватываем события, если пользователь печатает в инпут (например поиск)
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault(); // Предотвращаем скролл страницы
        changeVolumeByStep(1);
        break;
      case 'ArrowDown':
        e.preventDefault(); // Предотвращаем скролл страницы
        changeVolumeByStep(-1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        seek(Math.min(duration, audioService.getCurrentProgress() + 5)); // Перемотка на 5 секунд вперед
        break;
      case 'ArrowLeft':
        e.preventDefault();
        seek(Math.max(0, audioService.getCurrentProgress() - 5)); // Перемотка на 5 секунд назад
        break;
      case ' ':
        e.preventDefault(); // Предотвращаем скролл страницы от пробела
        togglePlay();
        break;
    }
  };

  const handleMouseEnter = () => {
    if (document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement) return;
    
    playerRef.current?.focus({ preventScroll: true });
  };

  return (
    <div 
      ref={playerRef}
      className="absolute bottom-0 left-0 right-0 p-[4px] pt-0 w-full z-50 focus:outline-none" 
      aria-label={`Сейчас играет: ${currentTrack.title} - ${formattedArtists}`} 
      data-luma-player="true"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
    >
      <div className="relative w-full h-[72px] rounded-[22px] bg-[#6499C2]/90 backdrop-blur-[34px] flex items-center overflow-hidden">
        <div ref={progressLineContainerRef} className="absolute top-0 left-0 right-0 z-10 pointer-events-none" />

        <div className="relative overflow-hidden w-full h-full grid grid-cols-[1fr_auto_1fr] gap-[30px] items-stretch py-[7px] px-[8px]">
          {/* Левая часть: Инфо о треке */}
          <div className="flex gap-[22px] items-center justify-start min-w-0 max-w-[350px] w-full">
            <div className="h-full flex items-center gap-[10px] max-w-full min-w-0" aria-label="Track Info">
              <div className="relative shrink-0 overflow-hidden rounded-[10px] flex items-center justify-center h-full w-auto aspect-square bg-white/10">
                <Image src={currentTrack.cover} alt={`Обложка трека: ${currentTrack.title}`} fill quality={95} className="object-cover" />
              </div>
              <div className="flex flex-col justify-center items-start gap-[3px] min-w-0 w-full max-w-full">
                <div className="flex items-center gap-[6px] max-w-full">
                  <span className="text-[15px] text-white font-medium truncate w-full max-w-full">{currentTrack.title}</span>
                  {currentTrack.isExplicit && (
                    <span className="flex items-center">
                      <ExplicitIcon className="w-[17px] h-auto max-md:w-[15px]" />
                    </span>
                  )}
                </div>
                <span className="text-[15px] text-white/65 font-medium truncate w-full max-w-full">{formattedArtists}</span>
              </div>
            </div>
            <div className="flex items-center gap-[14px] shrink-0" aria-label="Controls">
              <button aria-label="Добавить в мою коллекцию" className="transition-colors text-white/40 hover:text-white/60 flex items-center justify-center">
                <HeartInactiveIcon className="w-[21px] h-auto max-md:w-[18px] text-current" />
              </button>
            </div>
          </div>

          {/* Центральная часть: Основные контролы */}
          <div className="flex items-center justify-center gap-[30px]">
            <button aria-label="Перемешать" className="transition-colors text-white/45 hover:text-white/90 flex items-center justify-center">
              <MixTracksIcon className="h-[23px] w-auto max-md:h-[20px] text-current" />
            </button>
            <div className="flex items-center justify-center gap-[22px]">
              <button onClick={prevTrack} aria-label="Предыдущий трек" className="transition-colors text-white/40 hover:text-white/90 flex items-center justify-center">
                <PreviousIcon className="w-[23px] h-auto max-md:w-[21px] text-current" />
              </button>
              <button 
                onClick={togglePlay}
                className="size-[46px] will-change-transform active:scale-95 rounded-full bg-white/25 hover:bg-white/35 text-white/75 hover:text-white transition-all flex items-center justify-center relative overflow-hidden"
              >
                {isPlaying ? (
                  <PauseIcon className="h-[17px] w-auto max-md:h-[15px] text-current" />
                ) : (
                  <PlayIcon className="h-[17px] w-auto max-md:h-[15px] text-current" />
                )}
              </button>
              <button onClick={nextTrack} aria-label="Следующий трек" className="transition-colors text-white/40 hover:text-white/90 flex items-center justify-center">
                <NextIcon className="w-[23px] h-auto max-md:w-[21px] text-current" />
              </button>
            </div>
            <button 
              onClick={toggleRepeat}
              aria-label="Повторять" 
              className={`transition-colors flex items-center justify-center ${repeatMode !== 'none' ? 'text-white/90' : 'text-white/45'}`}
            >
              {repeatMode === 'one' ? (
                <RepeatOneIcon className="h-[23px] w-auto max-md:h-[20px] text-current" />
              ) : (
                <RepeatIcon className="h-[23px] w-auto max-md:h-[20px] text-current" />
              )}
            </button>
          </div>

          {/* Правая часть: Громкость и доп. функции */}
          <div className="flex items-center justify-end gap-[22px] mr-[calc(24px-8px)]">
            <button aria-label="Текст трека" className="transition-colors text-white/45 hover:text-white/90 flex items-center justify-center">
              <LyricsIcon className="w-[24px] h-auto max-md:w-[22px] text-current" />
            </button>
            <button aria-label="Очередь из треков" className="transition-colors text-white/45 hover:text-white/90 flex items-center justify-center">
              <TracksQueueIcon className="w-[21px] h-auto max-md:w-[20px] text-current" />
            </button>
            <div 
              className="flex items-center gap-[10px] relative"
              onWheel={handleVolumeWheel}
            >
              <button onClick={toggleMute} aria-label="Громкость" className="transition-colors text-white/45 hover:text-white/90 flex items-center justify-center shrink-0">
                {getVolumeIcon()}
              </button>
              <VolumeSlider volume={volume} isMuted={isMuted} setVolume={setVolume} />
            </div>
          </div>
        </div>
      </div>
      <TrackProgressBar lineContainerRef={progressLineContainerRef} />
    </div>
  );
}
