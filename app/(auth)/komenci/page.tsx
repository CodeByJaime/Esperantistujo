"use client";
import { useAuth } from "@/contexts/AuthContext";
import { AuthLayout } from "@/components/auth-layout";
import Image from "next/image";

const ADVANTAGES = [
  {
    number: "01",
    emoji: "📐",
    title: "Grandeco + demografia malpleno",
    subtitle: "Size + demographic emptiness",
    body: "~100.000 km² kun ~80.000 loĝantoj. Denso tre malalta — marĝeno por plani sen socia frotado.",
  },
  {
    number: "02",
    emoji: "🏔️",
    title: "Savano plata",
    subtitle: "Flat savannah — cheap engineering",
    body: "Topografio preskaŭ plata — vojoj, akvodukto, energio kaj urbanismo multe pli malmultekostaj ol en montaro. Ne detruas arbaron por ekspansii.",
  },
  {
    number: "03",
    emoji: "💧",
    title: "Akvo strategia",
    subtitle: "Strategic water — Orinoco basin",
    body: "En jarcento de akva streso, tio valoras oron. Riveroj, rojoj, akvifoj kaj stabila pluvreĝimo.",
  },
  {
    number: "04",
    emoji: "⚖️",
    title: "Jura kadro: ZIDRES",
    subtitle: "Legal framework built for this",
    body: "La Ŝtato jam deklaris ke ĝi volas organizitajn projektojn tie. Ne iras kontraŭ la leĝo — iras kun la leĝo.",
  },
  {
    number: "05",
    emoji: "🌐",
    title: "Distanco de urbaj polusoj",
    subtitle: "Distance from urban poles",
    body: "Malpli krima premo. Malpli kultura ŝoko. Malpli 'kaosa tirado' tipa de grandaj urboj.",
  },
  {
    number: "06",
    emoji: "🗺️",
    title: "Viva landlimo kun Venezuelo",
    subtitle: "Live border with Venezuela",
    body: "Geopolitika ŝlosilo por estonteco. Potencialo de duflanka koridoro laŭleĝa kaj ekonomia.",
  },
  {
    number: "07",
    emoji: "🌱",
    title: "Tero malmultekosta kaj abunda",
    subtitle: "Cheap and abundant land",
    body: "Eble aĉeti grandajn etendaĵojn laŭleĝe. Skalebla por jardekoj.",
  },
  {
    number: "08",
    emoji: "☀️",
    title: "Malferma ĉielo por sunenergio",
    subtitle: "Open sky for solar energy",
    body: "Alta radiado, malmultaj ombroj, perfekta tereno por sunfarmoj.",
  },
  {
    number: "09",
    emoji: "🏙️",
    title: "Preskaŭ sen urba heredaĵo",
    subtitle: "Almost no urban legacy",
    body: "Ne estas informalaj kvartaloj antaŭaj. Ne estas malnovaj desegnoj kiuj limigas la planon.",
  },
];

const TEST_ITEMS = [
  "Planitan urbon",
  "Teknologigitan agrikulturon",
  "Distribuitan energion",
  "Akvan administradon",
  "Kunigitan komunumon",
];

const COLOMBIA_ITEMS = [
  "Akva potenco de la kontinento",
  "For de uraganoj, tertremoj kaj militoj",
  "Pordo inter Amazonio, Andoj kaj Orinokio",
];

const TOURISM_ITEMS = [
  "Interŝanĝoj inter universitatoj",
  "Retiriĝoj kaj intensivaj kursoj",
  "Intensa lingva lernado",
  "Internaciaj eventoj",
];

export default function VichadaPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-esperanto-verda animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <title>Ŝarĝante...</title>
            <path strokeLinecap="round" d="M12 2a10 10 0 0 1 10 10" />
          </svg>
          <span className="font-sans-dm text-white/50 text-sm">Ŝarĝande…</span>
        </div>
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
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up   { animation: fadeUp 0.8s ease forwards; }
        .fade-up-2 { animation: fadeUp 0.8s 0.15s ease forwards; opacity: 0; }
        .fade-up-3 { animation: fadeUp 0.8s 0.3s ease forwards; opacity: 0; }
      `}</style>

      {/* HERO */}
      <div className="relative min-h-screen flex items-center justify-center star-pattern border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-[#0a0a0a]/60 via-transparent to-[#0a0a0a]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-esperanto-verda/8 blur-[140px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 sm:px-12 lg:px-16 py-28 sm:py-36 text-center">
          <div className="fade-up flex items-center justify-center gap-3 mb-8">
            <div className="w-8 h-px bg-esperanto-verda" />
            <span className="font-sans-dm text-esperanto-verda text-xs tracking-[0.3em] uppercase">Elektita loko</span>
            <div className="w-8 h-px bg-esperanto-verda" />
          </div>
          <h1 className="fade-up-2 font-display text-6xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.9] mb-6">
            Kial<br />
            <span className="italic text-esperanto-verda">Vichada?</span>
          </h1>
          <p className="fade-up-3 font-sans-dm text-white/50 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Tiu ĉi projekto ne estas hazarda. Ĝi estas elektita loko kun unikaj
            geografiaĵoj, juraj kondiĉoj kaj estontaj avantaĝoj por konstrui
            planitan komunumon sen konflikto kun la ekzistanta socio.
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-24 space-y-32">

        {/* HERO SECTION */}
        <section className="text-center space-y-8">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-px bg-esperanto-verda" />
            <span className="font-sans-dm text-esperanto-verda text-sm tracking-[0.3em] uppercase font-medium">Teritorio escepta</span>
            <div className="w-12 h-px bg-esperanto-verda" />
          </div>
          <h2 className="font-display text-5xl sm:text-6xl font-black text-white leading-tight">
            15 Kialoj<br />
            <span className="italic text-esperanto-verda">por Vichada</span>
          </h2>
          <p className="font-sans-dm text-white/40 text-lg max-w-3xl mx-auto leading-relaxed">
            Ĉiu detalo estis analizita. Ĉiu decido havas strategian fundamenton.
          </p>
        </section>

        {/* ADVANTAGES GRID */}
        <section className="space-y-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ADVANTAGES.map((advantage) => (
              <div
                key={advantage.number}
                className="group relative bg-linear-to-br from-white/2 to-white/5 border border-white/8 rounded-2xl p-8 hover:border-esperanto-verda/30 hover:from-esperanto-verda/2 hover:to-esperanto-verda/5 transition-all duration-500 overflow-hidden"
              >
                {/* Background number */}
                <div className="absolute top-4 right-4 font-display text-6xl font-black text-white/3 group-hover:text-esperanto-verda/6 transition-colors duration-500">
                  {advantage.number}
                </div>
                
                {/* Content */}
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{advantage.emoji}</div>
                    <div className="flex-1">
                      <h3 className="font-display text-xl font-bold text-white leading-tight">
                        {advantage.title}
                      </h3>
                      <p className="font-sans-dm text-esperanto-verda/60 text-xs tracking-widest uppercase mt-1">
                        {advantage.subtitle}
                      </p>
                    </div>
                  </div>
                  <p className="font-sans-dm text-white/50 text-sm leading-relaxed">
                    {advantage.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SCALE TESTS SECTION */}
        <section className="grid lg:grid-cols-2 gap-8">
          <div className="bg-linear-to-br from-esperanto-verda/8 to-esperanto-verda/2 border border-esperanto-verda/20 rounded-3xl p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-esperanto-verda/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-esperanto-verda/20 flex items-center justify-center">
                  <span className="text-2xl">🧪</span>
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-white">Testoj je reala skalo</h3>
                  <p className="font-sans-dm text-esperanto-verda/70 text-xs tracking-widest uppercase">Real-scale testing</p>
                </div>
              </div>
              <p className="font-sans-dm text-white/60 text-sm mb-8">Vichada permesas testi:</p>
              <div className="space-y-4">
                {TEST_ITEMS.map((item) => (
                  <div key={item} className="flex items-center gap-4 group">
                    <div className="w-8 h-8 rounded-full bg-esperanto-verda/10 border border-esperanto-verda/30 flex items-center justify-center group-hover:bg-esperanto-verda/20 transition-colors">
                      <svg className="w-4 h-4 text-esperanto-verda" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <title>Kontrolo</title>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-sans-dm text-white/70 text-sm group-hover:text-white/90 transition-colors">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-esperanto-verda/20">
                <p className="font-display text-esperanto-verda font-bold italic text-lg">Sen batali kontraŭ iu.</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Colombia Card */}
            <div className="bg-white/3 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-white/8 flex items-center justify-center">
                  <span className="text-xl">🇨🇴</span>
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-white">Strategia valoro de Kolombio</h3>
                  <p className="font-sans-dm text-esperanto-verda/60 text-xs tracking-widest uppercase">Strategic value</p>
                </div>
              </div>
              <div className="space-y-3">
                {COLOMBIA_ITEMS.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-esperanto-verda/60 mt-2 shrink-0" />
                    <span className="font-sans-dm text-white/50 text-sm leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
              <p className="font-sans-dm text-esperanto-verda/80 text-sm mt-6 italic border-t border-white/8 pt-4">
                Kaj Vichada estas ĝia malplena landlimo.
              </p>
            </div>

            {/* Tourism Card */}
            <div className="bg-white/3 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-white/8 flex items-center justify-center">
                  <span className="text-xl">✈️</span>
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-white">Turismo de lernado</h3>
                  <p className="font-sans-dm text-esperanto-verda/60 text-xs tracking-widest uppercase">Learning tourism</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {TOURISM_ITEMS.map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-esperanto-verda/40 mt-2 shrink-0" />
                    <span className="font-sans-dm text-white/40 text-xs leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* GROWTH SECTION */}
        <section className="bg-linear-to-br from-white/4 to-white/1 border border-white/8 rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 bg-esperanto-verda/5 rounded-full blur-3xl" />
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-esperanto-verda" />
                <span className="font-sans-dm text-esperanto-verda text-xs tracking-[0.3em] uppercase">Estonteco</span>
              </div>
              <h3 className="font-display text-4xl font-black text-white leading-tight">
                Rebla eblo kreski<br />
                <span className="italic text-esperanto-verda">por jardekoj.</span>
              </h3>
              <p className="font-sans-dm text-white/40 text-sm leading-relaxed max-w-md">
                Ne estas projekto por 5 jaroj. Estas teritorio kiu permesas kreski
                50–100 jarojn sen kolizii kun fizikaj limoj.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { v: "100k", unit: "km²", l: "Teritorio", icon: "🗺️" },
                { v: "80k", unit: "hab.", l: "Loĝantoj", icon: "👥" },
                { v: "100+", unit: "jaroj", l: "Kreskomarĝeno", icon: "⏳" },
                { v: "∞", unit: "", l: "Ebloj", icon: "🚀" },
              ].map((stat) => (
                <div key={stat.l} className="bg-linear-to-br from-white/6 to-white/2 border border-white/10 rounded-xl p-6 text-center hover:border-esperanto-verda/30 transition-all duration-300">
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="font-display text-2xl font-black text-esperanto-verda">{stat.v}</div>
                  <div className="font-sans-dm text-white/30 text-xs mt-1">{stat.unit}</div>
                  <div className="font-sans-dm text-white/50 text-xs mt-2">{stat.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CLOSING SECTION */}
        <section className="text-center space-y-12 pt-16 border-t border-white/8">
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-px bg-esperanto-verda" />
            <span className="font-sans-dm text-esperanto-verda text-sm tracking-[0.3em] uppercase">Konkludo</span>
            <div className="w-12 h-px bg-esperanto-verda" />
          </div>
          <div className="max-w-4xl mx-auto space-y-8">
            <h3 className="font-display text-5xl font-black text-white leading-tight">
              Ne utopio.<br />
              <span className="italic text-esperanto-verda">Inĝenierado.</span>
            </h3>
            <p className="font-sans-dm text-white/40 text-lg leading-relaxed">
              Vichada ne estas elektita por izoliĝi, sed ĉar ĝi estas la sola loko
              kie eblas konstrui organizitan, laŭleĝan kaj estontecan komunumon
              sen konflikti kun la ekzistanta socio, samtempe alportante evoluon,
              investon kaj homan kapitalon al forgesita regiono.
            </p>
          </div>

          {/* Image Container */}
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute inset-0 bg-esperanto-verda/10 rounded-3xl blur-2xl" />
            <Image
              src="/src/vichada_esperanto.svg"
              alt="Vichada Esperanto - Mapo de la departemento"
              width={600}
              height={400}
              className="relative w-full h-auto rounded-3xl"
            />
            <div className="absolute -bottom-4 -right-4 px-4 py-2 bg-esperanto-verda/20 backdrop-blur-sm rounded-lg border border-esperanto-verda/30">
              <p className="font-sans-dm text-esperanto-verda text-xs font-medium">Vichada, Kolombio</p>
            </div>
          </div>
        </section>

      </div>
    </AuthLayout>
  );
}