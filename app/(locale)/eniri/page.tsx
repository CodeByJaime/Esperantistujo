"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
//import GoogleAuth from "@/components/google-auth";

type Field = "retpoŝto" | "pasvorto";

export default function LoginPage() {
  const [form, setForm] = useState({ retpoŝto: "", pasvorto: "" });
  const [focused, setFocused] = useState<Field | null>(null);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [globalError, setGlobalError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signIn, loading } = useAuth();
  const router = useRouter();


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
    router.push("/");
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setGlobalError("");
    
    // Mostrar estado de carga inmediatamente
    setIsSubmitting(true);

    const result = await signIn(form.retpoŝto, form.pasvorto);
    
    if (result.error) {
      setGlobalError(result.error);
      setIsSubmitting(false);
      return;
    }

    // Redirección exitosa
    router.push("/komenci");
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

        {/* FORM */}
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
                  <div className="relative">
                    <input
                      id={f.key}
                      type={f.key === "pasvorto" && showPassword ? "text" : f.type}
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
                        } ${f.key === "pasvorto" ? "pr-12" : ""}`}
                    />
                    {f.key === "pasvorto" && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <title>Kaŝi pasvorton</title>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <title>Montri pasvorton</title>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
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
                disabled={loading || isSubmitting}
                className="w-full py-3.5 bg-esperanto-verda hover:bg-[#00b300] disabled:opacity-60 text-white font-sans-dm font-semibold text-sm rounded-lg transition-all duration-200 shadow-lg shadow-esperanto-verda/20 flex items-center justify-center gap-2"
              >
                {loading || isSubmitting ? (
                  <>
                    <svg className="spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <title>Ŝarĝado</title>
                      <path strokeLinecap="round" d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                    {isSubmitting ? "Redirektante..." : "Ensalutante…"}
                  </>
                ) : (
                  "Ensaluti →"
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

              {/* Divider
              <div className="my-6 flex items-center gap-4">
                <div className="flex-1 h-px bg-white/10" />
                <span className="font-sans-dm text-white/25 text-xs">aŭ</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <GoogleAuth/> */}
            </div>
          </div>
      </div>
    </div>
  );
}