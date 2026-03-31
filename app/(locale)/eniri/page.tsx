"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Field = "retpoŝto" | "pasvorto";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ retpoŝto: "", pasvorto: "" });
  const [focused, setFocused] = useState<Field | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [globalError, setGlobalError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e: Partial<Record<Field, string>> = {};
    if (!form.retpoŝto.includes("@")) e.retpoŝto = "Retpoŝtadreso ne validas.";
    if (!form.pasvorto) e.pasvorto = "Bonvolu enigi vian pasvorton.";
    return e;
  };

  const handleCancel = () => {
    setForm({ retpoŝto: "", pasvorto: "" });
    setErrors({});
    setFocused(null);
    setGlobalError("");
    setSubmitted(false);
    setLoading(false);
    router.push('/');
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setGlobalError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.retpoŝto,
        password: form.pasvorto,
      });

      if (error) {
        setGlobalError("Retpoŝto aŭ pasvorto malĝustas. Bonvolu reprovi.");
        return;
      }

      setSubmitted(true);
      setTimeout(() => {
        window.location.href = "/komenci";
      }, 2000);
    } catch {
      setGlobalError("Okazis eraro. Bonvolu reprovi.");
    } finally {
      setLoading(false);
    }
  };

  const fields: { key: Field; label: string; sublabel: string; type: string; placeholder: string }[] = [
    { key: "retpoŝto", label: "Retpoŝto",  sublabel: "Email",    type: "email",    placeholder: "vi@ekzemplo.com" },
    { key: "pasvorto", label: "Pasvorto",  sublabel: "Password", type: "password", placeholder: "Via pasvorto" },
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
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-6px); }
          40%       { transform: translateX(6px); }
          60%       { transform: translateX(-4px); }
          80%       { transform: translateX(4px); }
        }
        .shake { animation: shake 0.4s ease; }
        @keyframes checkPop {
          0%   { transform: scale(0); opacity: 0; }
          70%  { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        .check-pop { animation: checkPop 0.5s ease forwards; }
      `}</style>

      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-14 star-pattern overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-[#0a0a0a] via-[#0a0a0a]/80 to-[#001a00]/60" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-esperanto-verda/10 blur-[130px]" />

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
            "Revenu al via<br /><span className="text-esperanto-verda">komunumo.</span>"
          </blockquote>
          <p className="font-sans-dm text-white/40 text-sm">
            Return to your community.
          </p>
          <div className="mt-10 flex items-center gap-3">
            <div className="w-10 h-px bg-esperanto-verda/60" />
            <span className="font-sans-dm text-white/30 text-xs tracking-widest uppercase">
              Esperantistujo · Est. 2024
            </span>
          </div>
        </div>

        {/* Bottom decorative strip */}
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

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-16">

        {/* Mobile logo */}
        <div className="lg:hidden mb-10">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/src/verda_stelo_line.svg" alt="Esperantistujo" width={32} height={32} />
            <span className="font-display text-lg font-bold text-white">Esperantistujo</span>
          </Link>
        </div>

        {submitted ? (
          /* SUCCESS */
          <div className="max-w-md mx-auto w-full text-center fade-up">
            <div className="w-20 h-20 rounded-full bg-esperanto-verda/15 border border-esperanto-verda/30 flex items-center justify-center mx-auto mb-8 check-pop">
              <svg className="w-9 h-9 text-esperanto-verda" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <title>Sukceso</title>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-display text-3xl font-bold text-white mb-3">Bonvenon reen!</h2>
            <p className="font-sans-dm text-white/50 text-sm mb-8 leading-relaxed">
              Vi sukcese ensalutis. Ni ĝojas revidi vin.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3 bg-esperanto-verda text-white font-sans-dm font-semibold text-sm rounded-lg hover:bg-[#00b300] transition-all"
            >
              Iri al komenco →
            </Link>
          </div>
        ) : (
          /* FORM */
          <div className="max-w-md mx-auto w-full">
            {/* Header */}
            <div className="mb-10">
              <div className="fade-up flex items-center gap-2 mb-4">
                <div className="w-6 h-px bg-esperanto-verda" />
                <span className="font-sans-dm text-esperanto-verda text-xs tracking-[0.25em] uppercase">Ensaluti</span>
              </div>
              <h1 className="fade-up-2 font-display text-4xl sm:text-5xl font-black text-white leading-tight mb-3">
                Bonvenon<br />
                <span className="italic text-esperanto-verda">reen.</span>
              </h1>
              <p className="fade-up-3 font-sans-dm text-white/40 text-sm">
                Ĉu vi estas nova? {" "}
                <Link href="/registri" className="text-white/70 hover:text-esperanto-verda transition-colors underline underline-offset-2">
                  Krei konton
                </Link>
              </p>
            </div>

            {/* Global error */}
            {globalError && (
              <div className="shake mb-6 px-4 py-3 rounded-lg border border-red-500/30 bg-red-500/8 flex items-start gap-3">
                <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <title>Eraro</title>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                <p className="font-sans-dm text-red-400 text-sm">{globalError}</p>
              </div>
            )}

            {/* Fields */}
            <div className="space-y-5">
              {fields.map((f, i) => (
                <div key={f.key} className={`fade-up-${i + 3}`}>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <label htmlFor={f.key}>
                      <span className="font-display font-bold text-sm text-white/80">{f.label}</span>
                      <span className="font-sans-dm text-white/25 text-xs ml-2">{f.sublabel}</span>
                    </label>
                    {f.key === "pasvorto" && (
                      <Link href="/forgot-password" className="font-sans-dm text-xs text-white/30 hover:text-esperanto-verda transition-colors">
                        Forgesis?
                      </Link>
                    )}
                  </div>
                  <input
                    id={f.key}
                    type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    onFocus={() => setFocused(f.key)}
                    onBlur={() => setFocused(null)}
                    onKeyDown={e => e.key === "Enter" && handleSubmit()}
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
            <div className="mt-8 fade-up-5 space-y-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3.5 bg-esperanto-verda hover:bg-[#00b300] disabled:opacity-60 text-white font-sans-dm font-semibold text-sm rounded-lg transition-all duration-200 shadow-lg shadow-esperanto-verda/20 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <title>Ŝarĝado</title>
                      <path strokeLinecap="round" d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                    Ensalutante…
                  </>
                ) : (
                  <>Ensaluti →</>
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

              {/* Divider */}
              <div className="my-6 flex items-center gap-4">
                <div className="flex-1 h-px bg-white/10" />
                <span className="font-sans-dm text-white/25 text-xs">aŭ</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* OAuth placeholder */}
              <button
                type="button"
                className="w-full py-3 border border-white/10 hover:border-white/25 hover:bg-white/3 text-white/60 hover:text-white font-sans-dm text-sm rounded-lg transition-all duration-200 flex items-center justify-center gap-3"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" aria-label="Google">
                  <title>Google</title>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Daŭrigi per Google
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}