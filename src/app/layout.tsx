// src/app/layout.tsx
import type { Metadata } from "next";
// 1. Impor font Montserrat dari Google
import { Montserrat } from "next/font/google";
import "./globals.css";

// 2. Konfigurasi font dengan ketebalan yang dibutuhkan
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Pathera",
  description: "Temukan Jalur Karier Impianmu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 3. Terapkan class font ke body */}
      <body className={montserrat.className}>{children}</body>
    </html>
  );
}
