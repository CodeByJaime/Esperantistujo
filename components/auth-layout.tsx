"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface AuthLayoutProps {
  user: User | null;
  children: ReactNode;
}

export function AuthLayout({ user, children }: AuthLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const isActiveRoute = (route: string) => {
    return pathname === route;
  };

  useEffect(() => {
    console.log('AuthLayout mounted', { user });
  }, [user]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] lg:flex">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        .font-sans-dm { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Sidebar - Fixed position for all screen sizes */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 h-screen bg-[#0a0a0a] border-r border-white/10 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Image
                src="/src/verda_stelo_line.svg"
                alt="Esperanto"
                width={24}
                height={24}
              />

              <h2 className="font-display text-xl font-bold text-white">
                Esperantistujo
              </h2>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-6">
            {/* Main Navigation */}
            <div>
              <h3 className="font-sans-dm text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">
                Navigado
              </h3>
              <div className="space-y-1">
                <Link
                  href="/komenci"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-sans-dm font-medium text-sm transition-all ${
                    isActiveRoute('/komenci') 
                      ? 'bg-esperanto-verda/10 text-esperanto-verda' 
                      : 'hover:bg-white/10 text-white/70 hover:text-white'
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <title>Panelo</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Panelo
                </Link>

                <Link
                  href="/profilo"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-sans-dm font-medium text-sm transition-all ${
                    isActiveRoute('/profilo') 
                      ? 'bg-esperanto-verda/10 text-esperanto-verda' 
                      : 'hover:bg-white/10 text-white/70 hover:text-white'
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <title>Profilo</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Profilo
                </Link>

                <Link
                  href="/agordoj"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-sans-dm font-medium text-sm transition-all ${
                    isActiveRoute('/agordoj') 
                      ? 'bg-esperanto-verda/10 text-esperanto-verda' 
                      : 'hover:bg-white/10 text-white/70 hover:text-white'
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <title>Agordoj</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Agordoj
                </Link>
              </div>
            </div>

            {/* Governance Section */}
            <div>
              <h3 className="font-sans-dm text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">
                Gubernado
              </h3>
              <div className="space-y-1">
                <Link
                  href="#"
                  // href="/agora"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-white/70 hover:text-white font-sans-dm text-sm transition-all"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <title>Ágora</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  Ágora
                </Link>

                <Link
                  href="#"
                  // href="/civitanoj"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-white/70 hover:text-white font-sans-dm text-sm transition-all"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <title>Civitanoj</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Civitanoj
                </Link>

                <Link
                  // href="/financoj"
                  href="#"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-white/70 hover:text-white font-sans-dm text-sm transition-all"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <title>Financoj</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Financoj
                </Link>
              </div>
            </div>

            {/* Community Section */}
            <div>
              <h3 className="font-sans-dm text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">
                Komunumo
              </h3>
              <div className="space-y-1">
                <Link
                  href="#"
                  // href="/projektoj"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-white/70 hover:text-white font-sans-dm text-sm transition-all"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <title>Projektoj</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  Projektoj
                </Link>

                <Link
                  href="#"
                  // href="/diskuto"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-white/70 hover:text-white font-sans-dm text-sm transition-all"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <title>Diskuto</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  Diskuto
                </Link>

                <Link
                  href="#"
                  // href="/eventoj"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-white/70 hover:text-white font-sans-dm text-sm transition-all"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <title>Eventoj</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Eventoj
                </Link>
              </div>
            </div>
          </nav>

          {/* User section */}
          <div className="p-6 border-t border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-esperanto-verda/20 flex items-center justify-center">
                <span className="text-esperanto-verda font-display font-bold text-sm">
                  {(user?.user_metadata?.display_name || user?.user_metadata?.full_name || user?.email || "U")
                    ?.charAt(0)
                    .toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-sans-dm text-white text-sm font-medium truncate">
                  {user?.user_metadata?.display_name || user?.user_metadata?.full_name || "Uzanto"}
                </p>
                <p className="font-sans-dm text-white/40 text-xs truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-sans-dm text-sm rounded-lg transition-all"
            >
              Eliri
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Sidebar Overlay */}
        {sidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 bg-black/50 z-40 lg:hidden cursor-default"
            onClick={() => setSidebarOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setSidebarOpen(false);
              }
            }}
            aria-label="Fermi menuon"
          />
        )}

        {/* Mobile Menu Button */}
        <div className="lg:hidden bg-[#0a0a0a] border-b border-white/10 p-4">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <title>Menuo</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto h-screen lg:ml-64">{children}</main>
      </div>
    </div>
  );
}
