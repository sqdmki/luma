"use client";

import { motion } from "framer-motion";
import { Play, ChevronRight, Sparkles } from "lucide-react";
import Header from "./components/Header";
import ArtistCard from "./components/ArtistCard";
import AlbumCard from "./components/AlbumCard";
import MixCard from "./components/MixCard";
import TrackItem from "./components/TrackItem";

const POPULAR_ARTISTS = [
  { id: 1, name: "The Weeknd" },
  { id: 2, name: "Taylor Swift" },
  { id: 3, name: "Drake" },
  { id: 4, name: "Ariana Grande" },
  { id: 5, name: "Post Malone" },
  { id: 6, name: "Billie Eilish" },
];

const NEW_RELEASES = [
  { id: 1, title: "Hit Me Hard and Soft", year: "2024", artist: "Billie Eilish" },
  { id: 2, title: "The Tortured Poets Department", year: "2024", artist: "Taylor Swift" },
  { id: 3, title: "Eternal Sunshine", year: "2024", artist: "Ariana Grande" },
  { id: 4, title: "Cowboy Carter", year: "2024", artist: "Beyoncé" },
  { id: 5, title: "Fireworks & Rollerblades", year: "2024", artist: "Benson Boone" },
];

const MIXES = [
  { id: 1, title: "Для бодрого утра", description: "Зарядитесь энергией с первых минут дня" },
  { id: 2, title: "Вечерний вайб", description: "Расслабляющая музыка для завершения дня" },
  { id: 3, title: "В дорогу", description: "Лучшие треки для вашего путешествия" },
  { id: 4, title: "Фокус", description: "Музыка, которая поможет сосредоточиться" },
];

const TRENDING_TRACKS = [
  { id: 1, title: "Blinding Lights", album: "After Hours", duration: "3:20", plays: "2.5B", isExplicit: false },
  { id: 2, title: "Cruel Summer", album: "Lover", duration: "2:58", plays: "1.8B", isExplicit: false },
  { id: 3, title: "God's Plan", album: "Scorpion", duration: "3:18", plays: "2.1B", isExplicit: true },
  { id: 4, title: "thank u, next", album: "thank u, next", duration: "3:27", plays: "1.5B", isExplicit: true },
  { id: 5, title: "Circles", album: "Hollywood's Bleeding", duration: "3:35", plays: "2.2B", isExplicit: false },
];

const MY_WAVE_GRADIENT = "bg-linear-to-br from-[#B38DFF] via-[#8D9DFF] to-[#8DB8FF]";

export default function Home() {
  return (
    <div className="min-h-full pb-20 relative">
      <Header />
      
      <div className="pt-[80px] px-8 space-y-10">
        {/* My Wave Section */}
        <section>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`relative w-full h-[280px] rounded-[32px] overflow-hidden ${MY_WAVE_GRADIENT} p-10 flex flex-col justify-between group cursor-pointer`}
          >
            <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-white/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-white/80 font-medium mb-2">
                <Sparkles size={18} />
                <span>Персональная подборка</span>
              </div>
              <h1 className="text-5xl font-bold text-white mb-2">Моя волна</h1>
              <p className="text-white/70 text-lg max-w-md">Бесконечный поток музыки, подобранный специально для вас на основе ваших предпочтений.</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative z-10 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg shadow-black/10 text-[#B38DFF]"
            >
              <Play size={24} fill="currentColor" className="ml-1" />
            </motion.button>
          </motion.div>
        </section>

        {/* Popular Artists */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Популярные артисты</h2>
            <button className="text-white/40 hover:text-white transition-colors flex items-center gap-1 text-sm font-medium">
              Все <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {POPULAR_ARTISTS.map((artist) => (
              <ArtistCard key={artist.id} name={artist.name} />
            ))}
          </div>
        </section>

        {/* Mixes for you */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Миксы для вас</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {MIXES.map((mix, index) => (
              <MixCard 
                key={mix.id} 
                title={mix.title} 
                description={mix.description} 
                index={index} 
              />
            ))}
          </div>
        </section>

        {/* New Releases */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Новые релизы</h2>
            <button className="text-white/40 hover:text-white transition-colors flex items-center gap-1 text-sm font-medium">
              Все <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {NEW_RELEASES.map((album, index) => (
              <AlbumCard 
                key={album.id} 
                title={album.title} 
                year={album.year} 
                index={index}
              />
            ))}
          </div>
        </section>

        {/* Trending Tracks */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Тренды недели</h2>
            <button className="text-white/40 hover:text-white transition-colors flex items-center gap-1 text-sm font-medium">
              Все <ChevronRight size={16} />
            </button>
          </div>
          <div className="bg-white/2 rounded-[24px] p-4">
            {TRENDING_TRACKS.map((track, index) => (
              <TrackItem 
                key={track.id}
                index={index + 1}
                title={track.title}
                album={track.album}
                duration={track.duration}
                plays={track.plays}
                isExplicit={track.isExplicit}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
