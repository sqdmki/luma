import localFont from "next/font/local";

export const TTInterfacesRegular = localFont({
  src: "../../public/fonts/TTInterfaces-Regular.woff2",
  variable: "--font-ttint-regular",
  display: "swap",
  fallback: [
    "Inter",
    "-apple-system",
    "BlinkMacSystemFont",
    "system-ui",
    "sans-serif",
  ],
});

export const TTInterfacesMedium = localFont({
  src: "../../public/fonts/TTInterfaces-Medium.woff2",
  variable: "--font-ttint-medium",
  display: "swap",
  fallback: [
    "Inter",
    "-apple-system",
    "BlinkMacSystemFont",
    "system-ui",
    "sans-serif",
  ],
});

export const TTInterfacesSemibold = localFont({
  src: "../../public/fonts/TTInterfaces-Semibold.woff2",
  variable: "--font-ttint-semibold",
  display: "swap",
  fallback: [
    "Inter",
    "-apple-system",
    "BlinkMacSystemFont",
    "system-ui",
    "sans-serif",
  ],
});

export const TTInterfacesBold = localFont({
  src: "../../public/fonts/TTInterfaces-Bold.woff2",
  variable: "--font-ttint-bold",
  display: "swap",
  fallback: [
    "Inter",
    "-apple-system",
    "BlinkMacSystemFont",
    "system-ui",
    "sans-serif",
  ],
});

export const TTInterfacesExtrabold = localFont({
  src: "../../public/fonts/TTInterfaces-Extrabold.woff2",
  variable: "--font-ttint-extrabold",
  display: "swap",
  fallback: [
    "Inter",
    "-apple-system",
    "BlinkMacSystemFont",
    "system-ui",
    "sans-serif",
  ],
});

export const fontsVariables = [
  TTInterfacesRegular.variable,
  TTInterfacesMedium.variable,
  TTInterfacesSemibold.variable,
  TTInterfacesBold.variable,
  TTInterfacesExtrabold.variable,
].join(" ");
