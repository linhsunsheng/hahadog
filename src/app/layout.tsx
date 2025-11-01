import type { Metadata } from "next";
import { DM_Sans, Baloo_2 } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const bodyFont = DM_Sans({ subsets: ["latin"], variable: "--font-body" });
const headingFont = Baloo_2({ subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  title: "HAHA DOG! — Know what your dog needs",
  description: "Science-based daily nutrition targets for your dog.",
  icons: {
    icon: [
      { url: "/hahadog.svg", type: "image/svg+xml" },
      { url: "/hahadog.png", type: "image/png" },
    ],
    apple: "/hahadog.png",
    shortcut: "/hahadog.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${headingFont.variable} min-h-screen bg-white`}>
        <header className="w-full bg-brown900 text-white">
          <Navbar />
        </header>
        <main className="mx-auto max-w-6xl p-6 sm:p-8 lg:p-10">{children}</main>
      </body>
    </html>
  );
}

