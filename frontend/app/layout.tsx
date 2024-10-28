import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header/Header";
import { Roboto } from 'next/font/google';

const roboto = Roboto({ subsets: ['latin'], weight: '400' });

export const metadata: Metadata = {
  title: "Digichanges Challenge",
  description: "Desarrollada por Julían Ramos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`min-h-screen ${roboto.className}`}>
        <Header/>
        {children}
      </body>
    </html>
  );
}
