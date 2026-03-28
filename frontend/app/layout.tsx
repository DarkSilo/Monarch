import React from "react";
import type { Metadata } from "next";
import { Manrope, Bitter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const bitter = Bitter({
  subsets: ["latin"],
  variable: "--font-display",
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
      <body className={`${manrope.variable} ${bitter.variable}`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
