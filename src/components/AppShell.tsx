"use client";

import Link from "next/link";
import Nav from "./Nav";
import { Header } from "./Header";
import { HoursSidebar } from "./HoursSidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <aside className="w-56 shrink-0 flex flex-col border-r border-[var(--border)] bg-[var(--sidebar)] text-[var(--sidebar-foreground)]">
          <Link href="/" className="p-4 border-b border-white/10">
            <h1 className="font-bold text-lg tracking-tight">Ticket V-Beide</h1>
          </Link>
          <div className="flex-1 overflow-y-auto px-2">
            <Nav />
          </div>
        </aside>
        <main className="min-w-0 flex-1 overflow-auto p-6 md:p-8">{children}</main>
        <HoursSidebar />
      </div>
    </div>
  );
}
