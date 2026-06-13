import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/CartContext";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Smart Farm Marketplace - สดใหม่จากฟาร์มถึงโต๊ะคุณ",
  description: "ตลาดออนไลน์สำหรับคนรักสุขภาพ รวบรวมสินค้าเกษตรอินทรีย์คุณภาพสูงจากเกษตรกรไทย จัดส่งรวดเร็วตรงถึงบ้านคุณ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${newsreader.variable} ${plusJakartaSans.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-surface text-on-surface font-body-md text-body-md">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
