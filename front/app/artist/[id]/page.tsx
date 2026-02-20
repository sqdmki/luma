"use client";

import { motion } from "framer-motion";
import { Play, Heart, Shuffle, ChevronRight, Music2 } from "lucide-react";
import TrackItem from "@/app/components/TrackItem";
import AlbumCard from "@/app/components/AlbumCard";
import ArtistCard from "@/app/components/ArtistCard";
import VideoClipCard from "@/app/components/VideoClipCard";
import AmbientLights from "@/app/components/AmbientLights";
import Image from "next/image";
import { useImageColor } from "@/app/lib/useImageColor";

const ARTIST = {
  name: "M83",
  listeners: "12 481 320",
  followers: "3.2M",
  bio: "Французский электронный музыкальный проект, основанный в 2001 году в Антибе. Проект возглавляет мультиинструменталист Энтони Гонсалес.",
  image: "https://i.scdn.co/image/ab67616d0000b27362100064780b1d919a95fcf4",
};

const LATEST_RELEASE = {
  title: "Fantasy",
  type: "Альбом",
  year: "2023",
  trackCount: 14,
};

const TOP_TRACKS = [
  { title: "Midnight City", album: "Hurry Up, We're Dreaming", duration: "4:03", plays: "1.2B", isExplicit: false },
  { title: "Wait", album: "Hurry Up, We're Dreaming", duration: "5:34", plays: "312M", isExplicit: false },
  { title: "Outro", album: "Hurry Up, We're Dreaming", duration: "5:22", plays: "298M", isExplicit: false },
  { title: "Solitude", album: "Junk", duration: "3:48", plays: "186M", isExplicit: false },
  { title: "Do It, Try It", album: "Junk", duration: "3:56", plays: "142M", isExplicit: true },
];

const ALBUMS = [
  { title: "Hurry Up, We're Dreaming", year: "2011" },
  { title: "Junk", year: "2016" },
  { title: "DSVII", year: "2019" },
  { title: "Fantasy", year: "2023" },
  { title: "Saturdays = Youth", year: "2008" },
];

const PLAYLISTS = [
  { title: "M83 Essentials", year: "Playlist" },
  { title: "This Is M83", year: "Playlist" },
  { title: "M83 Radio", year: "Playlist" },
  { title: "Chill Synthwave", year: "Playlist" },
];

const SIMILAR_ARTISTS = [
  { name: "Washed Out" },
  { name: "Tycho" },
  { name: "CHVRCHES" },
  { name: "Tame Impala" },
  { name: "Glass Animals" },
  { name: "Neon Indian" },
];

const VIDEO_CLIPS = [
  { title: "Midnight City (Official Video)", youtubeUrl: "https://youtube.com/watch?v=dX3k_QDnzHE", duration: "4:03" },
  { title: "Wait (Official Video)", youtubeUrl: "https://youtube.com/watch?v=lAwYodrBr2Q", duration: "5:34" },
  { title: "Do It, Try It (Official Video)", youtubeUrl: "https://youtube.com/watch?v=Gu5RnHyUv4g", duration: "3:56" },
  { title: "Solitude (Official Video)", youtubeUrl: "https://youtube.com/watch?v=6p6PcFFUm5I", duration: "3:48" },
];

function SectionHeader({ title, showAll }: { title: string; showAll?: boolean }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-[24px] font-bold text-white tracking-tight">{title}</h2>
      {showAll && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1 text-[14px] text-white/40 hover:text-white transition-colors font-medium"
        >
          Показать все
          <ChevronRight size={16} />
        </motion.button>
      )}
    </div>
  );
}

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function ArtistPage() {
  const accentColor = useImageColor(ARTIST.image);

  return (
    <div className="flex-1 bg-(--bg-accent) rounded-[20px] relative flex flex-col overflow-hidden">
      <div className="relative flex-1">
        <div className="absolute top-0 left-0 right-0 h-[700px] pointer-events-none overflow-hidden rounded-t-[20px]">
          <AmbientLights color={accentColor} />
          <div className="absolute bottom-0 left-0 right-0 h-[400px] bg-linear-to-t from-(--bg-accent) via-(--bg-accent)/60 to-transparent" />
        </div>

        <div className="relative p-9 pb-20">

        {/* Hero */}
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="flex items-center gap-10 mb-12"
        >
          <motion.div variants={fadeUp} className="relative shrink-0">
            <div className="size-[240px] rounded-full bg-white/5 flex items-center justify-center overflow-hidden relative">
              <Image src={ARTIST.image} alt={ARTIST.name} quality={100} fetchPriority="high" fill className="object-cover" />
              <span className="text-7xl font-bold text-white/10 absolute inset-0 flex items-center justify-center -z-10">{ARTIST.name[0]}</span>
            </div>
            <div className="absolute -inset-4 blur-3xl rounded-full -z-10" style={{ backgroundColor: `${accentColor}1A` }} />
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col gap-7">
            <h1 className="text-[92px] font-bold text-white leading-[0.85] tracking-[-0.05em]">{ARTIST.name}</h1>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-4 text-[17px] font-medium text-white/50 tracking-tight">
                <span>{ARTIST.listeners} слушателей</span>
                <div className="w-1 h-1 rounded-full bg-white/20" />
                <span>{ARTIST.followers} подписчиков</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex items-center gap-4 mb-12"
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2.5 text-white px-8 py-3.5 rounded-full text-[15px] font-semibold transition-colors"
            style={{ backgroundColor: accentColor }}
          >
            <Play size={20} fill="white" />
            Слушать
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2.5 bg-white/5 text-white px-7 py-3.5 rounded-full text-[15px] font-medium hover:bg-white/10 transition-colors"
          >
            <Shuffle size={18} />
            Перемешать
          </motion.button>

          {/* Trailer - vertical rectangle like iPhone mockup */}
          <div className="w-[38px] h-[52px] rounded-[8px] bg-white/5 overflow-hidden border border-white/10 shrink-0 cursor-pointer hover:border-white/20 transition-all relative group">
            <Image 
              src={ARTIST.image} 
              alt="Trailer" 
              fill 
              className="object-cover opacity-40 group-hover:opacity-60 transition-opacity" 
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Play size={12} fill="white" className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors"
          >
            <Heart size={22} className="text-white/50" />
          </motion.button>
        </motion.div>

        {/* Latest Release Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="mb-12"
        >
          <motion.div
            whileTap={{ scale: 0.995 }}
            className="flex items-center gap-6 p-5 rounded-[18px] bg-white/3 hover:bg-white/5 transition-colors cursor-pointer group"
          >
            <div className="w-[80px] h-[80px] rounded-[12px] bg-white/6 flex items-center justify-center shrink-0">
              <Music2 size={28} className="text-white/15" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[14px] font-semibold" style={{ color: accentColor }}>Новый релиз</span>
              <p className="text-[24px] font-bold text-white mt-0.5 tracking-tight">{LATEST_RELEASE.title}</p>
              <p className="text-[15px] text-white/30 mt-1">{LATEST_RELEASE.type} &middot; {LATEST_RELEASE.year} &middot; {LATEST_RELEASE.trackCount} треков</p>
            </div>
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: accentColor }}
            >
              <Play size={20} fill="white" className="text-white ml-0.5" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Top Tracks */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.3 }}
          className="mb-12"
        >
          <SectionHeader title="Топ треков" />
          <div className="flex flex-col gap-1">
            {TOP_TRACKS.map((track, i) => (
              <TrackItem
                key={track.title}
                index={i + 1}
                title={track.title}
                album={track.album}
                duration={track.duration}
                plays={track.plays}
                isExplicit={track.isExplicit}
              />
            ))}
          </div>
        </motion.section>

        {/* Popular Albums */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.35 }}
          className="mb-12"
        >
          <SectionHeader title="Популярные альбомы" showAll />
          <div className="grid grid-cols-5 gap-5">
            {ALBUMS.map((album, i) => (
              <AlbumCard key={album.title} title={album.title} year={album.year} index={i} />
            ))}
          </div>
        </motion.section>

        {/* Playlists */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.4 }}
          className="mb-12"
        >
          <SectionHeader title="Плейлисты" showAll />
          <div className="grid grid-cols-5 gap-5">
            {PLAYLISTS.map((pl, i) => (
              <AlbumCard key={pl.title} title={pl.title} year={pl.year} index={i + 5} />
            ))}
          </div>
        </motion.section>

        {/* Similar Artists */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.45 }}
          className="mb-12"
        >
          <SectionHeader title="Похожие исполнители" showAll />
          <div className="grid grid-cols-6 gap-5">
            {SIMILAR_ARTISTS.map((artist) => (
              <ArtistCard key={artist.name} name={artist.name} />
            ))}
          </div>
        </motion.section>

        {/* Video Clips */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.5 }}
          className="mb-12"
        >
          <SectionHeader title="Видеоклипы" showAll />
          <div className="grid grid-cols-4 gap-5">
            {VIDEO_CLIPS.map((clip) => (
              <VideoClipCard key={clip.title} title={clip.title} youtubeUrl={clip.youtubeUrl} duration={clip.duration} />
            ))}
          </div>
        </motion.section>

        </div>
      </div>
    </div>
  );
}
