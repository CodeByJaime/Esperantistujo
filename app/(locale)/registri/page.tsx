"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";


type Field = "nomo" | "retpoŝto" | "pasvorto" | "konfirmo";

export default function RegisterPage() {
  const [form, setForm] = useState({ nomo: "", retpoŝto: "", pasvorto: "", konfirmo: "" });
  const [focused, setFocused] = useState<Field | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});

  const validate = () => {
    const e: Partial<Record<Field, string>> = {};
    if (!form.nomo.trim()) e.nomo = "Bonvolu enigi vian nomon.";
    if (!form.retpoŝto.includes("@")) e.retpoŝto = "Retpoŝtadreso ne validas.";
    if (form.pasvorto.length < 8) e.pasvorto = "Minimume 8 signoj.";
    if (form.pasvorto !== form.konfirmo) e.konfirmo = "Pasvortoj ne kongruas.";
    return e;
  };

  const handleCancel = () => {
    setForm({ nomo: "", retpoŝto: "", pasvorto: "", konfirmo: "" });
    setErrors({});
    setFocused(null);
    setSubmitted(false);
    setLoading(false);
    window.location.href = "/";
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    setSubmitted(true);
  };

  const fields: { key: Field; label: string; sublabel: string; type: string; placeholder: string }[] = [
    { key: "nomo",     label: "Nomo",      sublabel: "Name",             type: "text",     placeholder: "Via plena nomo" },
    { key: "retpoŝto", label: "Retpoŝto",  sublabel: "Email",            type: "email",    placeholder: "vi@ekzemplo.com" },
    { key: "pasvorto", label: "Pasvorto",  sublabel: "Password",         type: "password", placeholder: "Minimume 8 signoj" },
    { key: "konfirmo", label: "Konfirmo",  sublabel: "Confirm password", type: "password", placeholder: "Ripetu la pasvorton" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        .font-sans-dm { font-family: 'DM Sans', sans-serif; }
        .star-pattern {
          background-image: radial-gradient(circle, rgba(0,153,0,0.07) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up   { animation: fadeUp 0.7s ease forwards; }
        .fade-up-2 { animation: fadeUp 0.7s 0.1s ease forwards; opacity: 0; }
        .fade-up-3 { animation: fadeUp 0.7s 0.2s ease forwards; opacity: 0; }
        .fade-up-4 { animation: fadeUp 0.7s 0.3s ease forwards; opacity: 0; }
        .fade-up-5 { animation: fadeUp 0.7s 0.4s ease forwards; opacity: 0; }
        .fade-up-6 { animation: fadeUp 0.7s 0.5s ease forwards; opacity: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes checkPop {
          0%   { transform: scale(0); opacity: 0; }
          70%  { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        .check-pop { animation: checkPop 0.5s ease forwards; }
      `}</style>

      {/* LEFT PANEL — decorative, hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-14 star-pattern overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-[#0a0a0a] via-[#0a0a0a]/80 to-[#001a00]/60" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-esperanto-verda/10 blur-[130px]" />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 group w-fit">
               <Image src="/src/verda_stelo_line.svg" alt="Esperanto" width={32} height={32} />
            <span className="font-display text-xl font-bold text-white group-hover:text-esperanto-verda transition-colors">
              Esperantistujo
            </span>
          </Link>
        </div>

        {/* Quote */}
        <div className="relative z-10">
          <blockquote className="font-display text-3xl xl:text-4xl font-bold italic text-white leading-snug mb-6">
            "En la komenco estis<br />la <span className="text-esperanto-verda">vorto.</span>"
          </blockquote>
          <p className="font-sans-dm text-white/40 text-sm">
            En la komenco estis la vorto.
          </p>
          <div className="mt-10 flex items-center gap-3">
            <div className="w-10 h-px bg-esperanto-verda/60" />
            <span className="font-sans-dm text-white/30 text-xs tracking-widest uppercase">
              Esperantistujo · Est. 2024
            </span>
          </div>
        </div>

        {/* Bottom stat row */}
        <div className="relative z-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
          {[
            { v: "2M+", l: "Parolantoj" },
            { v: "180", l: "Landoj" },
            { v: "137", l: "Jaroj" },
          ].map(s => (
            <div key={s.l}>
              <div className="font-display text-2xl font-black text-esperanto-verda">{s.v}</div>
              <div className="font-sans-dm text-white/40 text-xs mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL — form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-16">

        {/* Mobile logo */}
        <div className="lg:hidden mb-10">
          <Link href="/" className="flex items-center gap-2">
              <Image src="/src/verda_stelo_line.svg" alt="Esperanto" width={32} height={32} />
            <span className="font-display text-lg font-bold text-white">Esperantistujo</span>
          </Link>
        </div>

        {submitted ? (
          /* SUCCESS STATE */
          <div className="max-w-md mx-auto w-full text-center fade-up">
            <div className="w-20 h-20 rounded-full bg-esperanto-verda/15 border border-esperanto-verda/30 flex items-center justify-center mx-auto mb-8 check-pop">
              <svg className="w-9 h-9 text-esperanto-verda" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <title>Checkmark</title>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-display text-3xl font-bold text-white mb-3">Bonvenon, {form.nomo.split(" ")[0]}!</h2>
            <p className="font-sans-dm text-white/50 text-sm mb-8 leading-relaxed">
              Via konto estis kreita. Ni sendis konfirman retmesaĝon al{" "}
              <span className="text-esperanto-verda">{form.retpoŝto}</span>.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3 bg-esperanto-verda text-white font-sans-dm font-semibold text-sm rounded-lg hover:bg-[#00b300] transition-all"
            >
              Iri al komenco →
            </Link>
          </div>
        ) : (
          /* FORM STATE */
          <div className="max-w-md mx-auto w-full">
            {/* Header */}
            <div className="mb-10">
              <div className="fade-up flex items-center gap-2 mb-4">
                <div className="w-6 h-px bg-esperanto-verda" />
                <span className="font-sans-dm text-esperanto-verda text-xs tracking-[0.25em] uppercase">Nova konto</span>
              </div>
              <h1 className="fade-up-2 font-display text-4xl sm:text-5xl font-black text-white leading-tight mb-3">
                Aliĝu al la<br />
                <span className="italic text-esperanto-verda">komunumo.</span>
              </h1>
              <p className="fade-up-3 font-sans-dm text-white/40 text-sm">
                Ĉu jam membro?{" "}
                <Link href="/eniri" className="text-white/70 hover:text-esperanto-verda transition-colors underline underline-offset-2">
                  Eniri
                </Link>
              </p>
            </div>

            {/* Fields */}
            <div className="space-y-5">
              {fields.map((f, i) => (
                <div
                  key={f.key}
                  className={`fade-up-${Math.min(i + 3, 6)}`}
                  style={{ animationDelay: `${0.15 + i * 0.08}s` }}
                >
                  <label htmlFor={f.key} className="block mb-1.5">
                    <span className="font-display font-bold text-sm text-white/80">{f.label}</span>
                    <span className="font-sans-dm text-white/25 text-xs ml-2">{f.sublabel}</span>
                  </label>
                  <input
                    id={f.key}
                    type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    onFocus={() => setFocused(f.key)}
                    onBlur={() => setFocused(null)}
                    className={`w-full bg-white/4 border rounded-lg px-4 py-3 text-white font-sans-dm text-sm placeholder-white/20 outline-none transition-all duration-200
                      ${focused === f.key
                        ? "border-esperanto-verda bg-white/6 shadow-[0_0_0_3px_rgba(0,153,0,0.12)]"
                        : errors[f.key]
                          ? "border-red-500/60"
                          : "border-white/10 hover:border-white/20"
                      }`}
                  />
                  {errors[f.key] && (
                    <p className="mt-1.5 text-red-400 text-xs font-sans-dm">{errors[f.key]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Submit */}
            <div className="mt-8 fade-up-6 space-y-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3.5 bg-esperanto-verda hover:bg-[#00b300] disabled:opacity-60 text-white font-sans-dm font-semibold text-sm rounded-lg transition-all duration-200 shadow-lg shadow-esperanto-verda/20 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <title>Loading spinner</title>
                      <path strokeLinecap="round" d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                    Kreante konton…
                  </>
                ) : (
                  <>Krei konton →</>
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="w-full py-3.5 bg-white/5 hover:bg-white/10 disabled:opacity-60 text-white/60 font-sans-dm font-medium text-sm rounded-lg transition-all duration-200 border border-white/10"
              >
                Nuligi kaj reveni
              </button>
              <p className="mt-4 text-center font-sans-dm text-white/25 text-xs leading-relaxed">
                Registriĝante, vi akceptas niajn{" "}
                <button type="button" className="underline hover:text-white/50 transition-colors">kondiĉojn</button>
                {" "}kaj{" "}
                <button type="button" className="underline hover:text-white/50 transition-colors">privatecan politikon</button>.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}