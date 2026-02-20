import { Howl, Howler } from 'howler';
import { usePlayerStore } from '../store/playerStore';

if (typeof window !== 'undefined') {
  Howler.unload();
}

class AudioService {
  private howl: Howl | null = null;
  private progressInterval: NodeJS.Timeout | null = null;
  private currentSrc: string | null = null;

  initialize(src: string) {
    // Синхронизируем глобальную громкость с состоянием стора при инициализации
    const storeState = usePlayerStore.getState();
    Howler.volume(storeState.isMuted ? 0 : Math.pow(storeState.volume, 2));

    if (this.currentSrc !== src) {
      if (this.howl) {
        this.howl.stop();
        this.howl.unload();
      }
      this.currentSrc = src;
      
      // Запоминаем стартовый прогресс (если он был восстановлен из localStorage)
      const startProgress = storeState.progress;

      this.howl = new Howl({
        src: [src],
        html5: true, // Используем HTML5 Audio для больших файлов (стриминг)
        volume: 1, // Локальная громкость всегда 1 (управляем через глобальный Howler.volume)
        onplay: () => this.startProgressTracking(),
        onpause: () => this.stopProgressTracking(),
        onstop: () => this.stopProgressTracking(),
        onend: () => {
          this.stopProgressTracking();
          const state = usePlayerStore.getState();
          if (state.repeatMode === 'one') {
            this.seek(0);
            this.howl?.play();
          } else {
            state.nextTrack();
          }
        },
        onload: () => {
          usePlayerStore.getState().setDuration(this.howl?.duration() || 0);
          
          // Как только файл загрузился, перематываем на сохраненный прогресс
          if (startProgress > 0) {
            this.howl?.seek(startProgress);
          }
        }
      });
    }
  }

  play(src: string) {
    this.initialize(src);
    this.howl?.play();
  }

  pause() {
    if (this.howl) {
      this.howl.pause();
      usePlayerStore.getState().setProgress(this.howl.seek() as number);
    }
  }

  setVolume(volume: number) {
    // Преобразуем линейное значение ползунка в экспоненциальное для естественного слуха
    Howler.volume(Math.pow(volume, 2));
  }

  seek(seconds: number) {
    if (this.howl) {
      const isPlaying = this.howl.playing();

      if (isPlaying) {
        // Микро-fade для плавного старта после перемотки
        this.howl.volume(0); // Сбрасываем локальную громкость трека в 0
        this.howl.seek(seconds); // Перематываем
        this.howl.fade(0, 1, 300); // Плавно повышаем локальную громкость до 1 за 300мс
      } else {
        this.howl.seek(seconds);
      }
    }
  }

  getCurrentProgress(): number {
    if (this.howl && this.howl.playing()) {
      return this.howl.seek() as number;
    }
    return usePlayerStore.getState().progress;
  }

  private startProgressTracking() {
    if (this.progressInterval) clearInterval(this.progressInterval);
    this.progressInterval = setInterval(() => {
      if (this.howl && this.howl.playing()) {
        usePlayerStore.getState().setProgress(this.howl.seek() as number);
      }
    }, 1000);
  }

  private stopProgressTracking() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }
}

export const audioService = new AudioService();