"use client";
import { useUserStore } from "@/lib/store";
import { AuthLayout } from "@/components/auth-layout";
import { useState } from "react";
import Image from "next/image";


export default function ProfiloPage() {
  const { user } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.user_metadata?.display_name || "");

  const handleSaveProfile = () => {
    // Aquí podríamos actualizar el metadata del usuario en Supabase
    setIsEditing(false);
  };

  if (!user) {
    return (
      <AuthLayout user={null}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-esperanto-verda/15 border border-esperanto-verda/30 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-esperanto-verda" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <title>Uzanto</title>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="font-display text-2xl font-bold text-white mb-2">Uzanto ne trovita</h2>
            <p className="font-sans-dm text-white/50 text-sm">
              Bonvolu ensaluti por vidi vian profilon.
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
          <h1 className="font-display text-3xl font-bold text-white mb-2">Via Profilo</h1>
          <p className="font-sans-dm text-white/50 text-sm">
            Administru viajn personajn informojn kaj agordojn.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-esperanto-verda/15 border border-esperanto-verda/30 flex items-center justify-center mx-auto mb-4">
                  {user.user_metadata?.avatar_url ? (
                    <Image 
                      src={user.user_metadata.avatar_url} 
                      alt="Profile" 
                      width={96} 
                      height={96} 
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <svg className="w-12 h-12 text-esperanto-verda" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <title>Uzanto</title>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                
                <h2 className="font-display text-xl font-bold text-white mb-1">
                  {user.user_metadata?.display_name || "Uzanto"}
                </h2>
                <p className="font-sans-dm text-white/50 text-sm mb-4">
                  {user.email}
                </p>
                
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-esperanto-verda rounded-full"></div>
                  <span className="font-sans-dm text-esperanto-verda text-xs">Aktiva</span>
                </div>
                
                <div className="text-left space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-sans-dm text-white/50 text-xs">Membro de</span>
                    <span className="font-sans-dm text-white text-xs">
                      {new Date(user.created_at).toLocaleDateString('eo-ES', { 
                        year: 'numeric', 
                        month: 'long' 
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-sans-dm text-white/50 text-xs">Statuso</span>
                    <span className="font-sans-dm text-esperanto-verda text-xs">Civitano</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl font-bold text-white">Personaj Informoj</h3>
                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 bg-esperanto-verda hover:bg-[#00b300] text-white font-sans-dm font-medium text-sm rounded-lg transition-all"
                  >
                  {isEditing ? "Nuligi" : "Redakti"}
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="displayName" className="block font-sans-dm text-white/70 text-sm mb-2">Montra Nomo</label>
                  {isEditing ? (
                    <input
                      id="displayName"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-esperanto-verda focus:bg-white/15 transition-all"
                      placeholder="Via nomo"
                    />
                  ) : (
                    <p className="font-sans-dm text-white">
                      {user.user_metadata?.display_name || "Ne difinita"}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block font-sans-dm text-white/70 text-sm mb-2">Retpoŝto</label>
                  <p id="email" className="font-sans-dm text-white">{user.email}</p>
                </div>
                
                <div>
                  <label htmlFor="userId" className="block font-sans-dm text-white/70 text-sm mb-2">Uzant-ID</label>
                  <p id="userId" className="font-sans-dm text-white/50 text-sm font-mono">{user.id}</p>
                </div>
              </div>
              
              {isEditing && (
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    className="px-6 py-2 bg-esperanto-verda hover:bg-[#00b300] text-white font-sans-dm font-medium text-sm rounded-lg transition-all"
                  >
                    Konservi ŝanĝojn
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white font-sans-dm font-medium text-sm rounded-lg transition-all"
                  >
                    Nuligi
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}