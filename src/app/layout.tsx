import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Email Gallery",
  description: "A collection of beautiful email designs and templates",
  keywords: "email, design, templates, gallery",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body
        className={`font-sans antialiased bg-white`}
        suppressHydrationWarning
      >
        <main>{children}</main>
      </body>
    </html>
  );
}
