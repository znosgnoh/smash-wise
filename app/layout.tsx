import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { BottomNav, TopNav } from "@/components/nav";
import { Providers } from "@/components/providers";
import { ToastProvider } from "@/components/toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smash Wise — Share badminton money and sweat",
  description:
    "Shared expense tracker for your badminton group. Split costs, see balances, settle up.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-[#0a0a0a] font-sans text-zinc-100">
        <Providers>
          <ToastProvider>
            <TopNav />
            <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-20 pt-4 lg:pb-8 lg:pt-6">
              {children}
            </main>
            <BottomNav />
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
