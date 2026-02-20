"use client";

import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import dynamic from "next/dynamic";

const Player = dynamic(() => import("./components/Player"), { ssr: false });

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative overflow-hidden flex-1 h-full flex flex-col bg-(--bg-accent) rounded-[20px]">
      <OverlayScrollbarsComponent
        defer
        options={{
          scrollbars: {
            theme: "os-theme-dark",
            visibility: "auto",
            autoHide: "leave",
            autoHideDelay: 500,
            dragScroll: true,
            clickScroll: false,
          },
        }}
        className="flex-1 h-full"
      >
        {children}
      </OverlayScrollbarsComponent>
      <style jsx global>{`
        .os-theme-dark {
          --os-handle-bg: rgba(255, 255, 255, 0.22) !important;
          --os-handle-bg-hover: rgba(255, 255, 255, 0.55) !important;
          --os-handle-bg-active: rgba(255, 255, 255, 0.72) !important;
        }
        .os-scrollbar.os-theme-dark {
          --os-size: 12px !important;
          --os-track-bg: transparent !important;
          --os-track-bg-hover: transparent !important;
          --os-track-bg-active: transparent !important;
          --os-handle-border-radius: 10px !important;
          --os-handle-perpendicular-size: 72% !important;
          --os-handle-perpendicular-size-hover: 100% !important;
          --os-handle-perpendicular-size-active: 100% !important;
        }
        .os-scrollbar.os-theme-dark .os-scrollbar-track {
          background: transparent !important;
          transition: none;
        }
        .os-scrollbar.os-theme-dark .os-scrollbar-handle {
          transition: background-color 0.2s ease, opacity 0.2s ease;
        }
      `}</style>
      <Player />
    </main>
  );
}
