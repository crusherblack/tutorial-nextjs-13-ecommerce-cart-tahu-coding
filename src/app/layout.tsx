import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import Provider from "@/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "E-Commerce Tahu Coding",
  description: "Modern E-Commerce with latest stack",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <main className="mx-auto max-w-7xl px-8 min-h-screen">
            {children}
          </main>
        </Provider>
      </body>
    </html>
  );
}
