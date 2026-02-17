"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, SlidersHorizontal, Plus, MoreHorizontal } from "lucide-react";
import { NAV_ITEMS, LIBRARY_ITEMS, MOCK_ARTISTS } from "@/app/lib/constants";

export default function Sidebar() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const filteredArtists = MOCK_ARTISTS.filter((artist) =>
    artist.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <aside className="w-[410px] h-full flex flex-col gap-4 p-4 relative">
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#B38DFF] transition-colors duration-200">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Поиск..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 bg-white/4 hover:bg-white/7 focus:bg-white/7 rounded-2xl pl-12 pr-4 text-base text-white placeholder:text-white/30 outline-none transition-colors duration-200"
        />
      </div>

      <nav className="flex flex-col gap-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-colors duration-200 ${
                  isActive
                    ? "bg-[#B38DFF]/12 text-[#B38DFF]"
                    : "text-white/70 hover:text-white hover:bg-white/4"
                }`}
              >
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-lg font-medium ${isActive ? "font-semibold" : ""}`}>
                  {item.name}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="flex-1 flex flex-col bg-white/2 rounded-3xl overflow-hidden">
        <div className="px-3 pt-3 pb-2">
          <div className="rounded-2xl bg-black/30 px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-white text-xl font-semibold leading-6">Моя медиатека</h2>
                <p className="mt-1 text-sm text-white/45">Треки, артисты и история</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-white/55 hover:text-white hover:bg-white/4 rounded-full transition-colors duration-200">
                  <Plus size={18} />
                </button>
                <button className="p-2 text-white/55 hover:text-white hover:bg-white/4 rounded-full transition-colors duration-200">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-2 pb-2">
          {LIBRARY_ITEMS.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="flex items-center gap-3 px-4 py-2.5 text-white/70 hover:text-white transition-colors rounded-xl hover:bg-white/5">
                <item.icon size={20} />
                <span className="text-base font-medium">{item.name}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="px-5 pt-2 pb-3 flex items-end justify-between">
            <span className="text-3xl leading-none text-white font-bold tracking-tight">Артисты</span>
            <button className="flex items-center gap-2 text-sm text-white/55 hover:text-white transition-colors duration-200">
              <span>Недавно добавленные</span>
              <SlidersHorizontal size={14} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-2 pb-5">
            <div className="space-y-1.5">
              {filteredArtists.map((artist) => (
                <div
                  key={artist.id}
                  className="group flex items-center gap-3 px-3 py-3 rounded-2xl cursor-pointer hover:bg-white/4 transition-colors duration-200"
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white/10">
                    <Image
                      src={artist.avatar}
                      alt={artist.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white text-[18px] leading-6 font-medium truncate group-hover:text-[#B38DFF] transition-colors duration-200">
                      {artist.name}
                    </h3>
                    <p className="text-base text-white/50 truncate">Артист</p>
                  </div>
                </div>
              ))}
              {filteredArtists.length === 0 && (
                <div className="px-3 py-8 text-center text-base text-white/45">
                  Ничего не найдено
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
