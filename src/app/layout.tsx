import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script"; 
// @ts-ignore
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

// @ts-ignore
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// @ts-ignore
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { PrivacyDialog } from "@/components/privacy-dialog";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FileLoom Studio",
  description: "Client-side PDF Editor - Edit PDFs directly in your browser without uploading to any server.",
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
        <script defer src="https://cloud.umami.is/script.js" data-website-id="915110e1-b168-4f6b-8344-7d00c068841b"></script>
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