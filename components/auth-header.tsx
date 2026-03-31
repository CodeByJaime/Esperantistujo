"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import type { User } from "@supabase/supabase-js";

interface AuthHeaderProps {
  user: User | null;
}

export function AuthHeader({ user }: AuthHeaderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut } = useAuth();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        .font-sans-dm { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Header */}
      <header className="border-b border-white/10 bg-[#0a0a0a] relative z-40">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-4">
          <div className="flex items-center justify-between">
            {/* Left side with menu button */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <title>Menuo</title>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <Link href="/komenci" className="flex items-center gap-2 group">
                <Image src="/src/verda_stelo_line.svg" alt="Esperanto" width={32} height={32} />
                <span className="font-display text-xl font-bold text-white group-hover:text-esperanto-verda transition-colors">
                  Esperantistujo
                </span>
              </Link>
            </div>
            
            {/* Right side with user info */}
            <div className="flex items-center gap-4">
              <span className="font-sans-dm text-white/60 text-sm">
                Bonvenon, {user?.user_metadata?.display_name || user?.email}
              </span>
              <button
                type="button"
                onClick={() => signOut()}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-sans-dm text-sm rounded-lg transition-all"
              >
                Eliri
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/50 z-40 lg:hidden cursor-default"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setSidebarOpen(false);
            }
          }}
          aria-label="Fermi menuon"
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0a0a] border-r border-white/10 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0 lg:block lg:w-64`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <Link href="/komenci" className="flex items-center gap-2 group">
              <Image src="/src/verda_stelo_line.svg" alt="Esperanto" width={28} height={28} />
              <span className="font-display text-lg font-bold text-white group-hover:text-esperanto-verda transition-colors">
                Esperantistujo
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all lg:hidden"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <title>Fermi</title>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2">
            <Link
              href="/komenci"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-esperanto-verda/10 text-esperanto-verda font-sans-dm font-medium text-sm transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <title>Panelo</title>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Panelo
            </Link>
            
            <Link
              href="/komenci/perfil"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-white/70 hover:text-white font-sans-dm text-sm transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <title>Profilo</title>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profilo
            </Link>
            
            <Link
              href="/komenci/agordoj"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-white/70 hover:text-white font-sans-dm text-sm transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <title>Agordoj</title>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Agordoj
            </Link>
          </nav>

          {/* User section */}
          <div className="p-6 border-t border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-esperanto-verda/20 flex items-center justify-center">
                <span className="text-esperanto-verda font-display font-bold text-sm">
                  {(user?.user_metadata?.display_name || user?.email || 'U')?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-sans-dm text-white text-sm font-medium truncate">
                  {user?.user_metadata?.display_name || 'Uzanto'}
                </p>
                <p className="font-sans-dm text-white/40 text-xs truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => signOut()}
              className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-sans-dm text-sm rounded-lg transition-all"
            >
              Eliri
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
