import React from "react";
import type { Metadata } from "next";
import { DM_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Monarch - Premium Clothing Store",
  description: "Shop premium fashion, apparel, and accessories with Monarch. Fast delivery and secure checkout.",
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${cormorant.variable}`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
