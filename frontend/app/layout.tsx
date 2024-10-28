import type { Metadata } from "next";
import "./globals.css";
import Head from "next/head";
import Header from "./components/Header/Header";

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
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""/>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet" />
      </Head>
      <body className="min-h-screen">
        <Header/>
        {children}
      </body>
    </html>
  );
}
