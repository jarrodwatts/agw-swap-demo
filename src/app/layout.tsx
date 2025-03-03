import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AbstractWalletWrapper from "@/components/NextAbstractWalletProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AGW Swap",
  description: "Swap between tokens using AGW and Uniswap V2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AbstractWalletWrapper>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </AbstractWalletWrapper>
    </html>
  );
}
