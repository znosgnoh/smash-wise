"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/history", label: "History", icon: "📋" },
  { href: "/members", label: "Members", icon: "👥" },
] as const;

export function BottomNav(): React.ReactElement {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/5 bg-[#0a0a0a]/90 backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-5xl items-center justify-around">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex min-h-14 min-w-14 flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs transition-colors ${
                isActive ? "text-cyan-400" : "text-zinc-500"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function TopNav(): React.ReactElement {
  const pathname = usePathname();

  return (
    <nav className="hidden border-b border-white/5 bg-[#0a0a0a]/90 backdrop-blur-md lg:block">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-lg font-bold text-transparent"
        >
          Smash Wise
        </Link>
        <div className="flex items-center gap-6">
          {tabs.map((tab) => {
            const isActive =
              tab.href === "/"
                ? pathname === "/"
                : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? "text-cyan-400"
                    : "text-zinc-400 hover:text-zinc-100"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
          <Link
            href="/log"
            className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-cyan-400"
          >
            Log Expense
          </Link>
        </div>
      </div>
    </nav>
  );
}
