"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const NAV_LINKS = [
  { label: "Manifesto", href: "#manifesto" },
  { label: "Vizio", href: "#vision" },
];

// Simula sesión — reemplaza con tu auth real (NextAuth, Clerk, etc.)
const useSession = () => {
  const [isLoggedIn] = useState(false); // cambia a true para probar
  const user = isLoggedIn ? { name: "Johano", initials: "JO" } : null;
  return { user };
};

export const Topbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useSession();

  return (
    <header className="w-full bg-[#0a0a0a] border-b border-white/10 sticky top-0 z-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
        .topbar-logo { font-family: 'Playfair Display', serif; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image src="/src/verda_stelo_line.svg" alt="Esperanto" width={32} height={32} />
            <span className="topbar-logo text-lg sm:text-xl font-bold text-white group-hover:text-esperanto-verda transition-colors duration-200">
              Esperantistujo
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-white/50 hover:text-white text-sm font-sans tracking-wide transition-colors duration-200"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Desktop: auth area */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              // --- LOGUEADO ---
              <div className="flex items-center gap-3">
                <span className="text-white/50 text-sm font-sans">
                  Saluton, <span className="text-white">{user.name}</span>
                </span>
                <button
                  type="button"
                  className="w-9 h-9 rounded-full bg-esperanto-verda text-white text-sm font-bold flex items-center justify-center hover:bg-[#00b300] transition-colors"
                >
                  {user.initials}
                </button>
              </div>
            ) : (
              // --- DESLOGUEADO ---
              <>
                <Link
                  href="/login"
                  className="px-5 py-2 text-sm font-sans font-medium text-white/70 hover:text-white transition-colors duration-200"
                >
                  Eniri
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 text-sm font-sans font-semibold bg-esperanto-verda text-white rounded-lg hover:bg-[#00b300] transition-all duration-200 shadow-md shadow-esperanto-verda/20"
                >
                  Registri
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="sm:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-md hover:bg-white/5 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menuo"
          >
            <span className={`block w-5 h-0.5 bg-white/70 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-white/70 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-white/70 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-72 border-t border-white/10" : "max-h-0"}`}>
        <div className="px-4 py-4 flex flex-col gap-2">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="py-2.5 text-sm text-white/60 hover:text-white font-sans transition-colors border-b border-white/5"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            {user ? (
              <div className="flex items-center gap-3 py-2">
                <div className="w-9 h-9 rounded-full bg-esperanto-verda text-white text-sm font-bold flex items-center justify-center">
                  {user.initials}
                </div>
                <span className="text-white text-sm font-sans">{user.name}</span>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="w-full py-2.5 text-sm font-sans font-medium text-white/70 border border-white/20 rounded-lg text-center hover:border-white/40 hover:text-white transition-all"
                >
                  Eniri
                </Link>
                <Link
                  href="/register"
                  className="w-full py-2.5 text-sm font-sans font-semibold bg-esperanto-verda text-white rounded-lg text-center hover:bg-[#00b300] transition-all"
                >
                  Registri
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};