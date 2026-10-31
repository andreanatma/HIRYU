import type { Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], display: "swap", variable: "--font-jakarta" });

// metadata tetap

// Viewport eksplisit (tanpa maximumScale/userScalable agar pengguna tetap bisa zoom — aksesibilitas).
// themeColor mewarnai address bar browser HP agar menyatu dengan navbar/hero.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#071D33",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* link Plus Jakarta dihapus; Material Symbols tetap */}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=block" rel="stylesheet" />
      </head>
      {/* overflow-x-clip: elemen dekoratif (blur/blob) yang melebihi layar tidak memunculkan scroll horizontal di HP */}
      <body className="overflow-x-clip">{children}</body>
    </html>
  );
}