"use client";
import { useUserStore } from "@/lib/store";
import { useState } from "react";
import { AuthLayout } from "@/components/auth-layout";

export default function AgordojPage() {
  const { user } = useUserStore();
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState("eo");

  if (!user) {
    return (
      <AuthLayout user={null}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-esperanto-verda/15 border border-esperanto-verda/30 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-esperanto-verda" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <title>Agordoj</title>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="font-display text-2xl font-bold text-white mb-2">Agordoj ne alireblaj</h2>
            <p className="font-sans-dm text-white/50 text-sm">
              Bonvolu ensaluti por vidi viajn agordojn.
            </p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout user={user}>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-white mb-2">Agordoj</h1>
          <p className="font-sans-dm text-white/50 text-sm">
            Administru viajn preferojn kaj agordojn de la konto.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Settings */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <h3 className="font-display text-xl font-bold text-white mb-6">Profilaj Agordoj</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="displayName" className="block font-sans-dm text-white/70 text-sm mb-2">Montra Nomo</label>
                  <input
                    id="displayName"
                    type="text"
                    defaultValue={user.user_metadata?.display_name || ""}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-esperanto-verda focus:bg-white/15 transition-all"
                    placeholder="Via nomo"
                  />
                </div>
                
                <div>
                  <label htmlFor="bio" className="block font-sans-dm text-white/70 text-sm mb-2">Biografio</label>
                  <textarea
                    id="bio"
                    rows={3}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-esperanto-verda focus:bg-white/15 transition-all resize-none"
                    placeholder="Diru ion pri vi..."
                  />
                </div>

                <div>
                  <label htmlFor="language" className="block font-sans-dm text-white/70 text-sm mb-2">Lingvo</label>
                  <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-esperanto-verda focus:bg-white/15 transition-all"
                  >
                    <option value="eo">Esperanto</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <h3 className="font-display text-xl font-bold text-white mb-6">Sciigoj</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-sans-dm text-white">Retpoŝtaj Sciigoj</p>
                    <p className="font-sans-dm text-white/50 text-sm">Ricevu sciigojn retpoŝte</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotifications(!notifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications ? 'bg-esperanto-verda' : 'bg-white/20'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-sans-dm text-white">Ĝisdatigoj de Novaĵletero</p>
                    <p className="font-sans-dm text-white/50 text-sm">Informoj pri novaj funkcioj kaj eventoj</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEmailUpdates(!emailUpdates)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      emailUpdates ? 'bg-esperanto-verda' : 'bg-white/20'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        emailUpdates ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Appearance Settings */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <h3 className="font-display text-xl font-bold text-white mb-6">Aspekto</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-sans-dm text-white">Malhela Reĝimo</p>
                    <p className="font-sans-dm text-white/50 text-sm">Uzu malhelan temon</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDarkMode(!darkMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      darkMode ? 'bg-esperanto-verda' : 'bg-white/20'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        darkMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <h3 className="font-display text-lg font-bold text-white mb-4">Agordoj</h3>
              <nav className="space-y-2">
                <a href="#general" className="block px-4 py-2 rounded-lg bg-esperanto-verda/10 text-esperanto-verda font-sans-dm text-sm">
                  Ĝeneralaj
                </a>
                <a href="#privacy" className="block px-4 py-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white font-sans-dm text-sm transition-all">
                  Privateco
                </a>
                <a href="#security" className="block px-4 py-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white font-sans-dm text-sm transition-all">
                  Sekureco
                </a>
                <a href="#data" className="block px-4 py-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white font-sans-dm text-sm transition-all">
                  Datuma Administrado
                </a>
              </nav>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 mt-6">
              <h3 className="font-display text-lg font-bold text-white mb-4">Rapidaj Agoj</h3>
              <div className="space-y-3">
                <button type="button" className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-sans-dm text-sm rounded-lg transition-all">
                  Elporti Datumojn
                </button>
                <button type="button" className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-sans-dm text-sm rounded-lg transition-all">
                  Ŝanĝi Pasvorton
                </button>
                <button type="button" className="w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-sans-dm text-sm rounded-lg transition-all">
                  Forigi Konton
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}