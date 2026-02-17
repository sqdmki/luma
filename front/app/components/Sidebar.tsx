"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Flame, User, Settings, Disc3, type LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/app/lib/utils";

const USER = {
  name: "iliaz",
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

const SidebarItem = ({ icon: Icon, label, href, isActive }: SidebarItemProps) => {
  return (
    <Link href={href} className="w-full relative group block">
      {isActive && (
        <motion.div
          layoutId="sidebar-active-item"
          className="absolute inset-0 bg-white/10 rounded-[14px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
        />
      )}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute left-0 top-1/2 w-[4px] bg-[#B38DFF] rounded-r-full"
            style={{ y: "-50%", height: 20 }}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
      <motion.div
        whileTap={{ scale: 0.985 }}
        className={cn(
          "relative flex items-center gap-4 py-3 px-4 rounded-[14px] transition-colors duration-200 z-10",
          isActive ? "text-white" : "text-white/60 hover:text-white"
        )}
      >
        <Icon
          size={22}
          strokeWidth={isActive ? 2.5 : 2}
          className={cn(
            "transition-colors duration-300",
            isActive ? "text-[#B38DFF]" : "group-hover:text-white"
          )}
        />
        <span className={cn("font-medium text-[16px]", isActive && "font-semibold")}>{label}</span>
      </motion.div>
    </Link>
  );
};

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[338px] bg-(--bg-accent) rounded-[20px] p-[24px] flex flex-col items-start justify-between h-full overflow-hidden shrink-0">
      <div className="w-full flex flex-col gap-8">
        <div className="px-2">
          <Image
            className="w-[100px] h-auto"
            src="/logo-full.svg"
            alt="Luma"
            width={100}
            height={24}
            priority
          />
        </div>
        <nav className="flex flex-col gap-2 w-full">
          <AnimatePresence mode="popLayout">
            {NAV_ITEMS.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.28 }}
                >
                  <SidebarItem icon={item.icon} label={item.label} href={item.href} isActive={isActive} />
                </motion.div>
              );
            })}
          </AnimatePresence>
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
            <span className="text-white font-medium text-[15px] truncate">{USER.name}</span>
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
          <Settings size={20} className="text-white/40 hover:text-white transition-colors" />
        </motion.div>
      </div>
    </aside>
  );
}
