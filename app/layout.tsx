import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kanyini OS",
  description: "Operations System for Kanyini Earth Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

