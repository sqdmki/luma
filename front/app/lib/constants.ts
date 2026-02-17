export const SITE_URL = "https://luma.qodedigital.com";
export const SITE_NAME = "Luma";
export const SITE_DESCRIPTION = "Слушайте музыку удобно и без границ в любой точке мира. Уже сегодня.";
export const SITE_KEYWORDS = ["музыка", "стриминг", "онлайн", "слушать", "бесплатно", "плейлисты", "артисты", "luma", "qodedigital"];
export const SITE_CREATOR = "QodeDigital";
export const SITE_PUBLISHER = "QodeDigital";
export const SITE_AUTHOR = "QodeDigital";
export const SITE_AUTHOR_URL = "https://qodedigital.com";
export const SITE_TWITTER_HANDLE = "@qodedigital";
export const SITE_OG_IMAGE = "/og-image.png";
export const SITE_ICON = "/logo-icon.svg";

import { Home, Compass, Radio, Video, Mic2, Heart, Clock } from "lucide-react";

export const NAV_ITEMS = [
  { name: "Главная", icon: Home, href: "/" },
  { name: "Обзор", icon: Compass, href: "/explore" },
  { name: "Радио", icon: Radio, href: "/radio" },
  { name: "Видео", icon: Video, href: "/video" },
];

export const LIBRARY_ITEMS = [
  { name: "Любимые треки", icon: Heart, href: "/favorites" },
  { name: "Недавние", icon: Clock, href: "/recent" },
  { name: "Артисты", icon: Mic2, href: "/artists" },
];

export const MOCK_ARTISTS = [
  { id: 1, name: "The Weeknd", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TheWeeknd" },
  { id: 2, name: "Dua Lipa", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DuaLipa" },
  { id: 3, name: "Travis Scott", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Travis" },
  { id: 4, name: "Billie Eilish", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Billie" },
  { id: 5, name: "Drake", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Drake" },
  { id: 6, name: "Post Malone", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Post" },
  { id: 7, name: "Ariana Grande", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ariana" },
  { id: 8, name: "Kendrick Lamar", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kendrick" },
];
