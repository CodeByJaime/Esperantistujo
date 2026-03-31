"use client";
import { useAuth } from "@/contexts/AuthContext";
import { AuthLayout } from "@/components/auth-layout";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white">Ŝarĝande...</div>
      </div>
    );
  }

  return (
    <AuthLayout user={user}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        .font-sans-dm { font-family: 'DM Sans', sans-serif; }
        .star-pattern {
          background-image: radial-gradient(circle, rgba(0,153,0,0.07) 1px, transparent 1px);
          background-size: 28px 28px;
        }
      `}</style>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-16">
        <div className="text-center mb-12">
          <h1 className="font-display text-5xl font-black text-white mb-4">
            Via <span className="text-esperanto-verda">panelo</span>
          </h1>
          <p className="font-sans-dm text-white/40 text-lg">
            Bonvenon en via persona spaco de Esperantistujo
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-esperanto-verda/50 transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-esperanto-verda/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-esperanto-verda" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <title>Profilo</title>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-white">Profilo</h3>
                <p className="font-sans-dm text-white/40 text-sm">Viaj personaj informoj</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-sans-dm text-white/60 text-sm">Nomo:</span>
                <span className="font-sans-dm text-white text-sm">{user?.user_metadata?.display_name || 'Ne agordita'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans-dm text-white/60 text-sm">Retpoŝto:</span>
                <span className="font-sans-dm text-white text-sm">{user?.email}</span>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-esperanto-verda/50 transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-esperanto-verda/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-esperanto-verda" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <title>Statistiko</title>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-white">Statistiko</h3>
                <p className="font-sans-dm text-white/40 text-sm">Via aktivado</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-sans-dm text-white/60 text-sm">Membraĝo:</span>
                <span className="font-sans-dm text-esperanto-verda text-sm">Nova</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans-dm text-white/60 text-sm">Statuso:</span>
                <span className="font-sans-dm text-white text-sm">Aktiva</span>
              </div>
            </div>
          </div>

          {/* Community Card */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-esperanto-verda/50 transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-esperanto-verda/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-esperanto-verda" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <title>Komunumo</title>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-white">Komunumo</h3>
                <p className="font-sans-dm text-white/40 text-sm">Konektiĝu</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-sans-dm text-white/60 text-sm">Parolantoj:</span>
                <span className="font-sans-dm text-white text-sm">2M+</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans-dm text-white/60 text-sm">Landoj:</span>
                <span className="font-sans-dm text-white text-sm">180</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="font-display text-2xl font-bold text-white mb-6">Rapidaj agoj</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              type="button"
              className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-esperanto-verda/50 transition-all text-left"
            >
              <h4 className="font-sans-dm font-semibold text-white mb-1">Redakti profilon</h4>
              <p className="font-sans-dm text-white/40 text-sm">Ĝisdatigu viajn informojn</p>
            </button>
            <button
              type="button"
              className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-esperanto-verda/50 transition-all text-left"
            >
              <h4 className="font-sans-dm font-semibold text-white mb-1">Lerni Esperanton</h4>
              <p className="font-sans-dm text-white/40 text-sm">Ekzercu vian lingvon</p>
            </button>
            <button
              type="button"
              className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-esperanto-verda/50 transition-all text-left"
            >
              <h4 className="font-sans-dm font-semibold text-white mb-1">Eventoj</h4>
              <p className="font-sans-dm text-white/40 text-sm">Trovu lokajn renkontiĝojn</p>
            </button>
            <button
              type="button"
              className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-esperanto-verda/50 transition-all text-left"
            >
              <h4 className="font-sans-dm font-semibold text-white mb-1">Forumo</h4>
              <p className="font-sans-dm text-white/40 text-sm">Partoprenu diskutojn</p>
            </button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}