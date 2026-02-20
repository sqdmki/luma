import type { Metadata, Viewport } from "next";
import { metadataConfig, viewportConfig } from "./config/metadata";
import { fontsVariables } from "./config/fonts";
import Sidebar from "./components/Sidebar";
import RightSidebar from "./components/RightSidebar";
import LayoutClient from "./layout-client";
import "./globals.css";

export const viewport: Viewport = viewportConfig;
export const metadata: Metadata = metadataConfig;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={fontsVariables}
      data-scroll-behavior="smooth"
    >
      <body>
        <div id="__luma">
          <Sidebar />
          <LayoutClient>{children}</LayoutClient>
          <RightSidebar />
        </div>
      </body>
    </html>
  );
}
