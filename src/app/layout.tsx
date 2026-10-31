import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pradakshina Tracker — Devotional Round Counter",
  description: "A peaceful, mobile-first companion for temple circumambulations.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#F7F1E6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[#F7F1E6] text-[#3D352D] antialiased flex flex-col font-sans selection:bg-[#E8DCC8]">
        {children}
      </body>
    </html>
  );
}
