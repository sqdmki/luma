"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Flame,
  User,
  Settings,
  Disc3,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils";

const USER = {
  name: "blckwht",
  isPremium: true,
};

type SidebarItemProps = {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive: boolean;
};

const NAV_ITEMS = [
  { icon: Search, label: "Поиск", href: "/search" },
  { icon: Home, label: "Главная", href: "/" },
  { icon: Disc3, label: "Моя коллекция", href: "/collection" },
  { icon: Flame, label: "Тренды", href: "/trends" },
] satisfies Array<Omit<SidebarItemProps, "isActive">>;

const SidebarItem = ({
  icon: Icon,
  label,
  href,
  isActive,
}: SidebarItemProps) => {
  return (
    <Link href={href} className="w-full relative group block">
      <div
        className={cn(
          "absolute inset-0 rounded-[14px] transition-colors duration-200",
          isActive ? "bg-white/5" : "bg-transparent",
        )}
      />
      <div
        className={cn(
          "absolute left-0 top-1/2 w-[3px] h-5 -translate-y-1/2 rounded-r-full transition-all duration-200",
          isActive ? "bg-[#B38DFF] opacity-100 scale-y-100" : "bg-[#B38DFF] opacity-0 scale-y-0",
        )}
      />
      <motion.div
        whileTap={{ scale: 0.985 }}
        className={cn(
          "relative flex items-center gap-4 py-4 px-[23px] rounded-[14px] transition-colors duration-200 z-10",
          isActive ? "text-white" : "text-white/60 hover:text-white",
        )}
      >
        <Icon
          size={22}
          strokeWidth={isActive ? 2.5 : 2}
          className={cn(
            "transition-colors duration-300",
            isActive ? "text-[#B38DFF]" : "group-hover:text-white",
          )}
        />
        <span
          className={cn("font-medium text-[16px]", isActive && "font-semibold")}
        >
          {label}
        </span>
      </motion.div>
    </Link>
  );
};

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[320px] bg-(--bg-accent) rounded-[20px] flex flex-col items-start justify-between h-full overflow-hidden shrink-0">
      <div className="w-full">
        <div className="w-full relative pt-[27px] px-[30px] pb-0 mb-[22px] flex items-center justify-between">
          <div className="flex items-center">
            <Image
              className="w-[90px] h-auto"
              src="/logo-full.svg"
              alt="Luma"
              width={90}
              height={22}
              quality={100}
              fetchPriority="high"
              priority
            />
          </div>
        </div>
        <nav className="flex flex-col w-full px-[8px]">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                isActive={isActive}
              />
            );
          })}
        </nav>
      </div>
      <div className="w-full mt-auto">
        <motion.div
          whileTap={{ scale: 0.985 }}
          className="bg-(--bg-color) p-4 rounded-[18px] flex items-center gap-3 w-full transition-colors cursor-pointer hover:bg-white/5"
        >
          <div className="w-10 h-10 rounded-full bg-[#1A1A1C] flex items-center justify-center overflow-hidden shrink-0">
            <User size={20} className="text-white/70" />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-white font-medium text-[15px] truncate">
              {USER.name}
            </span>
            <div className="flex items-center mt-1">
              {USER.isPremium ? (
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-[#B38DFF]/10 text-[13px] font-medium text-[#B38DFF] leading-none">
                  Luma Premium
                </span>
              ) : (
                <span className="text-[13px] text-white/40">Free Plan</span>
              )}
            </div>
          </div>
          <Settings
            size={20}
            className="text-white/40 hover:text-white transition-colors"
          />
        </motion.div>
      </div>
    </aside>
  );
}
