import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import {
  SITE_AUTHOR,
  SITE_AUTHOR_URL,
  SITE_CREATOR,
  SITE_DESCRIPTION,
  SITE_ICON,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_OG_IMAGE,
  SITE_PUBLISHER,
  SITE_TWITTER_HANDLE,
  SITE_URL,
} from "./lib/constants";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

const TTCommonsRegular = localFont({
  src: "../public/fonts/TTCommons-Regular.woff2",
  variable: "--font-ttcommons-regular",
  display: "swap",
  fallback: [
    "Inter",
    "-apple-system",
    "BlinkMacSystemFont",
    "system-ui",
    "sans-serif",
  ],
});

const TTCommonsMedium = localFont({
  src: "../public/fonts/TTCommons-Medium.woff2",
  variable: "--font-ttcommons-medium",
  display: "swap",
  fallback: [
    "Inter",
    "-apple-system",
    "BlinkMacSystemFont",
    "system-ui",
    "sans-serif",
  ],
});

const TTCommonsDemiBold = localFont({
  src: "../public/fonts/TTCommons-DemiBold.woff2",
  variable: "--font-ttcommons-demibold",
  display: "swap",
  fallback: [
    "Inter",
    "-apple-system",
    "BlinkMacSystemFont",
    "system-ui",
    "sans-serif",
  ],
});

const TTCommonsBold = localFont({
  src: "../public/fonts/TTCommons-Bold.woff2",
  variable: "--font-ttcommons-bold",
  display: "swap",
  fallback: [
    "Inter",
    "-apple-system",
    "BlinkMacSystemFont",
    "system-ui",
    "sans-serif",
  ],
});

export const viewport: Viewport = {
  themeColor: "#B38DFF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Luma — создаём удобство и свободу для Вас",
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_AUTHOR, url: SITE_AUTHOR_URL }],
  generator: "Next.js",
  keywords: SITE_KEYWORDS,
  referrer: "origin-when-cross-origin",
  creator: SITE_CREATOR,
  publisher: SITE_PUBLISHER,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Luma — создаём удобство и свободу для Вас",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: SITE_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Luma Music Streaming",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Luma — создаём удобство и свободу для Вас",
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE],
    creator: SITE_TWITTER_HANDLE,
  },
  icons: {
    icon: SITE_ICON,
    shortcut: SITE_ICON,
    apple: SITE_ICON,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${TTCommonsRegular.variable} ${TTCommonsMedium.variable} ${TTCommonsDemiBold.variable} ${TTCommonsBold.variable}`}
    >
      <body>
        <div id="__luma">
          <Header />
          <Sidebar />
          {children}
        </div>
      </body>
    </html>
  );
}
