import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script"; // Import Script for AdSense
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

// --- GLOBAL STYLES ---
// Ensures PDF styles are loaded globally
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PDF Studio",
  description: "Client-side PDF Editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // FIX 1: suppressHydrationWarning is REQUIRED for next-themes to work correctly
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* OPTIONAL: Google AdSense Script Placeholder */}
        {/* Uncomment and add your ID when ready */}
        {/* <Script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID" 
          crossOrigin="anonymous"
          strategy="lazyOnload"
        /> 
        */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}