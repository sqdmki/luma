import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { audioService } from '../services/audioService';

export interface Track {
  id: string;
  title: string;
  artists: string[];
  album: string;
  cover: string;
  durationStr: string;
  plays: string;
  isExplicit: boolean;
  src: string;
}

// Заглушки для треков
export const DEMO_TRACKS: Track[] = [
  {
    id: "1",
    title: "Три Дня Любви",
    artists: ["Zivert"],
    album: "Vinyl #2",
    cover: "https://avatars.yandex.net/get-music-content/5559490/fb9fe9f6.a.18410644-1/m1000x1000", // Замените на реальный путь
    durationStr: "3:45",
    plays: "100,000",
    isExplicit: false,
    src: "/demo_tracks/zivert-AYxvHWfvr8cP97wGa83J.mp3", // Замените на реальный путь
  },
  {
    id: "2",
    title: "back to friends",
    artists: ["sombr"],
    album: "I Barely Know Her",
    cover: "https://avatars.yandex.net/get-music-content/16334817/ced1eb2b.a.37889037-1/m1000x1000", // Замените на реальный путь
    durationStr: "3:00",
    plays: "50,000",
    isExplicit: false,
    src: "/demo_tracks/sombr-oOdQdgWQ9PCYmlnlskIP.mp3", // Замените на реальный путь
  },
  {
    id: "3",
    title: "Зацепила",
    artists: ["Артур Пирожков"],
    album: "I Barely Know Her",
    cover: "https://avatars.yandex.net/get-music-content/118603/209936f8.a.7045776-2/m1000x1000", // Замените на реальный путь
    durationStr: "15:00",
    plays: "50,000",
    isExplicit: false,
    src: "/demo_tracks/artur-pir-647ks0y6Tji6IU0rXui1.mp3", // Замените на реальный путь
  }
];

interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  volume: number; // 0.0 to 1.0
  isMuted: boolean;
  progress: number;
  duration: number;
  repeatMode: 'none' | 'all' | 'one';
  
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  toggleRepeat: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setTrack: (track: Track) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  seek: (progress: number) => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      currentTrack: DEMO_TRACKS[0],
      queue: DEMO_TRACKS,
      isPlaying: false,
      volume: 0.5,
      isMuted: false,
      progress: 0,
      duration: 0,
      repeatMode: 'none',

      play: () => {
        const { currentTrack } = get();
        if (currentTrack) {
          audioService.play(currentTrack.src);
          set({ isPlaying: true });
        }
      },
      pause: () => {
        audioService.pause();
        set({ isPlaying: false });
      },
      togglePlay: () => {
        const { isPlaying, play, pause } = get();
        if (isPlaying) pause();
        else play();
      },
      toggleRepeat: () => {
        const modes: ('none' | 'all' | 'one')[] = ['none', 'all', 'one'];
        const currentIndex = modes.indexOf(get().repeatMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        set({ repeatMode: modes[nextIndex] });
      },
      setVolume: (volume) => {
        const { isMuted } = get();
        set({ volume });
        if (!isMuted) {
          audioService.setVolume(volume);
        }
      },
      toggleMute: () => {
        const { isMuted, volume } = get();
        const newMuted = !isMuted;
        set({ isMuted: newMuted });
        audioService.setVolume(newMuted ? 0 : volume);
      },
      setTrack: (track) => {
        set({ currentTrack: track, progress: 0 });
        audioService.play(track.src);
        set({ isPlaying: true });
      },
      nextTrack: () => {
        const { currentTrack, queue, setTrack } = get();
        if (!currentTrack) return;
        const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
        const nextIndex = (currentIndex + 1) % queue.length;
        setTrack(queue[nextIndex]);
      },
      prevTrack: () => {
        const { currentTrack, queue, setTrack } = get();
        if (!currentTrack) return;
        const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
        const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
        setTrack(queue[prevIndex]);
      },
      setProgress: (progress) => set({ progress }),
      setDuration: (duration) => set({ duration }),
      seek: (progress) => {
        audioService.seek(progress);
        set({ progress });
      }
    }),
    {
      name: 'luma-player-storage', // имя ключа в localStorage
      partialize: (state) => ({ 
        volume: state.volume,
        isMuted: state.isMuted,
        repeatMode: state.repeatMode,
        currentTrack: state.currentTrack,
        progress: state.progress
      }), // сохраняем настройки, текущий трек и его прогресс
    }
  )
);