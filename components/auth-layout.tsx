"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AuthLayoutProps {
  user: User | null;
  children: ReactNode;
}

export function AuthLayout({ user, children }: AuthLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        .font-sans-dm { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0a0a] border-r border-white/10 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:flex lg:flex-col`}
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
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-esperanto-verda/10 text-esperanto-verda font-sans-dm font-medium text-sm transition-all"
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
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-white/70 hover:text-white font-sans-dm text-sm transition-all"
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
                  href="/komenci/agordoj"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-white/70 hover:text-white font-sans-dm text-sm transition-all"
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

            {/* Learning Section */}
            <div>
              <h3 className="font-sans-dm text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">
                Lernado
              </h3>
              <div className="space-y-1">
                <Link
                  href="/komenci/lecionoj"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-white/70 hover:text-white font-sans-dm text-sm transition-all"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <title>Lecionoj</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Lecionoj
                </Link>

                <Link
                  href="/komenci/ekzercoj"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-white/70 hover:text-white font-sans-dm text-sm transition-all"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <title>Ekzercoj</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                  Ekzercoj
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
                  href="/komenci/forumo"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-white/70 hover:text-white font-sans-dm text-sm transition-all"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <title>Forumo</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                    />
                  </svg>
                  Forumo
                </Link>

                <Link
                  href="/komenci/eventoj"
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
                  {(user?.user_metadata?.display_name || user?.email || "U")
                    ?.charAt(0)
                    .toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-sans-dm text-white text-sm font-medium truncate">
                  {user?.user_metadata?.display_name || "Uzanto"}
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
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
