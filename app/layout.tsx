import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "@rainbow-me/rainbowkit/styles.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Secure Fitness Data Platform",
  description: "Your encrypted fitness data, secured by blockchain technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
