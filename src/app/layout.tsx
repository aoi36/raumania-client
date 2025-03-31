import type { Metadata } from "next";
import { Header } from "@/components/Header";
import "./globals.css";
import {Cormorant_Garamond, Dancing_Script } from "next/font/google";

const cormorant_garamond = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cormorant-garamond',
  weight: "400"
})
const dancing_script = Dancing_Script({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dancing-script',
  weight: "400"
})

export const metadata: Metadata = {
  title: "Raumania",
  description: "Raumania Fragrance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorant_garamond.variable} ${dancing_script.variable} antialiased font-mono font-medium text-zinc-400`}
      >
        <main>
        <Header/>  
        {children}
        </main>
      
      </body>
    </html>
  );
}
