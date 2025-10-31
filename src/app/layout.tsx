import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
const rounded = Nunito({ variable: "--font-geist-sans", subsets: ["latin"], weight: ["400","600","700" ] })

export const metadata: Metadata = {
  title: "Dog Daily — Know what your dog needs",
  description: "Science-based daily nutrition targets for your dog.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${rounded.variable} antialiased bg-[color:var(--color-yellow-200)] text-[color:var(--color-brown-900)] min-h-screen`}> 
        <Navbar />
        <main className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">{children}</main>
      </body>
    </html>
  );
}
