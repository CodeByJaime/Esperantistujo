"use client";

import { useState } from "react";
import Link from "next/link";

type Step = 1 | 2 | 3;

interface FormData {
  // Step 1 — Identity
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  // Step 2 — Esperanto
  esperantoLevel: string;
  esperantoName: string;
  country: string;
  motivation: string;
  // Step 3 — Commitment
  acceptManifesto: boolean;
  acceptLanguage: boolean;
  acceptCommunity: boolean;
  newsletter: boolean;
}

const LEVELS = [
  { value: "nulo", label: "Nulo — neniam lernis", en: "Never studied Esperanto" },
  { value: "komencanto", label: "Komencanto", en: "Beginner — a few lessons" },
  { value: "meza", label: "Meza nivelo", en: "Intermediate — can hold conversations" },
  { value: "progresinta", label: "Progresinta", en: "Advanced — fluent speaker" },
  { value: "denaska", label: "Denaska parolanto", en: "Native / near-native speaker" },
];

const STEPS = [
  { num: 1, label: "Identeco", en: "Identity" },
  { num: 2, label: "Komunumo", en: "Community" },
  { num: 3, label: "Deklaro", en: "Declaration" },
];

export default function RegisterPage() {
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    esperantoLevel: "",
    esperantoName: "",
    country: "",
    motivation: "",
    acceptManifesto: false,
    acceptLanguage: false,
    acceptCommunity: false,
    newsletter: false,
  });

  const set = (field: keyof FormData, value: string | boolean) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validateStep = (s: Step): boolean => {
    const newErrors: typeof errors = {};
    if (s === 1) {
      if (!form.firstName.trim()) newErrors.firstName = "Bonvolu enigi vian nomon";
      if (!form.lastName.trim()) newErrors.lastName = "Bonvolu enigi vian familinomon";
      if (!form.email.includes("@")) newErrors.email = "Retpoŝtadreso ne valida";
      if (form.password.length < 8) newErrors.password = "Almenaŭ 8 signoj";
      if (form.password !== form.confirmPassword) newErrors.confirmPassword = "La pasvortoj ne kongruas";
    }
    if (s === 2) {
      if (!form.esperantoLevel) newErrors.esperantoLevel = "Bonvolu elekti vian nivelon";
      if (!form.country.trim()) newErrors.country = "Bonvolu enigi vian landon";
    }
    if (s === 3) {
      if (!form.acceptManifesto) newErrors.acceptManifesto = "Necesas akcepti la manifeston";
      if (!form.acceptLanguage) newErrors.acceptLanguage = "Necesas akcepti la lingvan politikon";
      if (!form.acceptCommunity) newErrors.acceptCommunity = "Necesas akcepti la komunumajn regulojn";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const next = () => {
    if (validateStep(step)) setStep((s) => (s < 3 ? (s + 1) as Step : s));
  };

  const prev = () => setStep((s) => (s > 1 ? (s - 1) as Step : s));

  const submit = () => {
    if (validateStep(3)) setSubmitted(true);
  };

  if (submitted) {
    return <SuccessScreen name={form.esperantoName || form.firstName} />;
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#F7F4EE", fontFamily: "'Georgia', serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;1,8..60,300&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --ink: #1A1A14;
          --ink-mid: #3D3D2E;
          --ink-muted: #7A7A60;
          --cream: #F7F4EE;
          --cream-dark: #EDE9DF;
          --green: #1F5C2E;
          --green-mid: #2D7A40;
          --green-light: #C8DFC8;
          --gold: #B8860B;
          --gold-light: #F0E4B0;
          --rule: #C8C4B8;
          --red: #9B2020;
        }
        .serif { font-family: 'Playfair Display', Georgia, serif; }
        .body-serif { font-family: 'Source Serif 4', Georgia, serif; }

        .form-input {
          width: 100%;
          background: #fff;
          border: 1px solid var(--rule);
          padding: 12px 16px;
          font-family: 'Source Serif 4', serif;
          font-size: 15px;
          color: var(--ink);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          appearance: none;
          border-radius: 0;
        }
        .form-input:focus {
          border-color: var(--green);
          box-shadow: 0 0 0 3px rgba(31,92,46,0.1);
        }
        .form-input.error { border-color: var(--red); }
        .form-input::placeholder { color: var(--ink-muted); font-style: italic; }

        select.form-input { cursor: pointer; }

        .form-label {
          display: block;
          font-family: 'Source Serif 4', serif;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--ink-muted);
          margin-bottom: 6px;
        }

        .field-error {
          font-family: 'Source Serif 4', serif;
          font-size: 12px;
          color: var(--red);
          font-style: italic;
          margin-top: 5px;
        }

        .btn-primary {
          background: var(--green);
          color: #fff;
          border: none;
          padding: 14px 36px;
          font-family: 'Source Serif 4', serif;
          font-size: 13px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .btn-primary:hover { background: var(--green-mid); transform: translateY(-1px); }
        .btn-primary:active { transform: scale(0.98); }

        .btn-ghost {
          background: transparent;
          color: var(--ink-muted);
          border: 1px solid var(--rule);
          padding: 14px 28px;
          font-family: 'Source Serif 4', serif;
          font-size: 13px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-ghost:hover { border-color: var(--green); color: var(--green); }

        .level-card {
          border: 1px solid var(--rule);
          padding: 14px 16px;
          cursor: pointer;
          transition: all 0.2s;
          background: #fff;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .level-card:hover { border-color: var(--green-light); }
        .level-card.selected {
          border-color: var(--green);
          background: rgba(31,92,46,0.04);
          box-shadow: 0 0 0 1px var(--green);
        }

        .checkbox-row {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 18px 0;
          border-bottom: 1px solid var(--rule);
          cursor: pointer;
        }
        .checkbox-row:last-child { border-bottom: none; }
        .checkbox-row.error-row { background: rgba(155,32,32,0.03); }

        .custom-checkbox {
          width: 20px;
          height: 20px;
          min-width: 20px;
          border: 1.5px solid var(--rule);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 2px;
          transition: all 0.15s;
          background: #fff;
        }
        .custom-checkbox.checked {
          background: var(--green);
          border-color: var(--green);
        }

        .step-dot {
          width: 8px;
          height: 8px;
          border-radius: 0;
          transition: all 0.3s;
        }

        textarea.form-input { resize: vertical; min-height: 100px; line-height: 1.6; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .step-content { animation: fadeIn 0.35s ease-out; }

        .password-strength-bar {
          height: 3px;
          background: var(--rule);
          margin-top: 8px;
          overflow: hidden;
        }
        .password-strength-fill {
          height: 100%;
          transition: width 0.3s, background 0.3s;
        }
      `}</style>

      {/* ── LEFT PANEL ── */}
      <div
        style={{
          width: "380px",
          minWidth: "380px",
          background: "#1F5C2E",
          padding: "60px 48px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            pointerEvents: "none",
          }}
        />

        {/* Watermark text */}
        <div
          className="serif"
          style={{
            position: "absolute",
            bottom: "-40px",
            right: "-40px",
            fontSize: "180px",
            fontWeight: 900,
            color: "rgba(255,255,255,0.04)",
            lineHeight: 1,
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          E
        </div>

        {/* Top: Logo */}
        <div style={{ position: "relative" }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg viewBox="0 0 200 200" width="16" height="16">
                <polygon
                  points="100,20 120,78 180,78 132,114 150,175 100,140 50,175 68,114 20,78 80,78"
                  fill="#B8860B"
                />
              </svg>
            </div>
            <span
              className="serif"
              style={{ fontSize: "16px", fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}
            >
              Esperantistujo
            </span>
          </Link>

          <div style={{ width: "40px", height: "1px", background: "rgba(255,255,255,0.2)", margin: "40px 0" }} />

          <h1
            className="serif"
            style={{
              fontSize: "36px",
              fontWeight: 900,
              color: "#fff",
              lineHeight: 1.1,
              marginBottom: "16px",
            }}
          >
            Aliĝu al
            <br />
            <em style={{ fontStyle: "italic", color: "#B8860B" }}>la projekto</em>
          </h1>
          <p
            className="body-serif"
            style={{
              fontSize: "14px",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.6)",
              fontWeight: 300,
            }}
          >
            Fariĝu parto de la unua urbo konstruita tute en Esperanto. Via voĉo konstruas la estontecon.
          </p>
        </div>

        {/* Middle: Step indicator */}
        <div style={{ position: "relative" }}>
          {STEPS.map((s, i) => (
            <div key={s.num} style={{ display: "flex", alignItems: "flex-start", gap: "20px", marginBottom: i < 2 ? "32px" : "0" }}>
              {/* Line connector */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    background: step > s.num ? "#B8860B" : step === s.num ? "#fff" : "rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s",
                    minWidth: "28px",
                  }}
                >
                  {step > s.num ? (
                    <svg viewBox="0 0 16 16" width="12" height="12">
                      <polyline points="2,8 6,12 14,4" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span
                      className="serif"
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: step === s.num ? "#1F5C2E" : "rgba(255,255,255,0.4)",
                      }}
                    >
                      {s.num}
                    </span>
                  )}
                </div>
                {i < 2 && (
                  <div
                    style={{
                      width: "1px",
                      height: "28px",
                      background: step > s.num ? "rgba(184,134,11,0.5)" : "rgba(255,255,255,0.15)",
                      transition: "background 0.4s",
                    }}
                  />
                )}
              </div>

              <div style={{ paddingTop: "4px" }}>
                <p
                  className="serif"
                  style={{
                    fontSize: "16px",
                    fontWeight: step === s.num ? 700 : 400,
                    color: step === s.num ? "#fff" : step > s.num ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.35)",
                    transition: "all 0.3s",
                  }}
                >
                  {s.label}
                </p>
                <p
                  className="body-serif"
                  style={{
                    fontSize: "12px",
                    fontStyle: "italic",
                    color: step === s.num ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)",
                    marginTop: "2px",
                    transition: "all 0.3s",
                  }}
                >
                  {s.en}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom: Quote */}
        <div style={{ position: "relative" }}>
          <div style={{ width: "40px", height: "1px", background: "rgba(255,255,255,0.2)", marginBottom: "24px" }} />
          <p
            className="serif"
            style={{
              fontSize: "14px",
              fontStyle: "italic",
              color: "rgba(255,255,255,0.45)",
              lineHeight: 1.6,
            }}
          >
            "En Esperanto, ĉiu estas denaska parolanto."
          </p>
          <p className="body-serif" style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", marginTop: "8px", letterSpacing: "0.1em" }}>
            — PRINCIPO DE ESPERANTISTUJO
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{ flex: 1, padding: "60px 72px", overflowY: "auto" }}>
        <div style={{ maxWidth: "520px", margin: "0 auto" }}>

          {/* Header */}
          <div style={{ marginBottom: "48px" }}>
            <p
              className="body-serif"
              style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: "12px" }}
            >
              Paŝo {step} el 3
            </p>
            <h2
              className="serif"
              style={{ fontSize: "32px", fontWeight: 700, lineHeight: 1.1, color: "var(--ink)", marginBottom: "8px" }}
            >
              {step === 1 && "Via identeco"}
              {step === 2 && "Via esperanta profilo"}
              {step === 3 && "Via deklaro"}
            </h2>
            <p
              className="body-serif"
              style={{ fontSize: "15px", color: "var(--ink-muted)", fontWeight: 300, lineHeight: 1.6 }}
            >
              {step === 1 && "Create your account to join the project."}
              {step === 2 && "Tell the community about your Esperanto journey."}
              {step === 3 && "By joining Esperantistujo, you make a declaration."}
            </p>
          </div>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div className="step-content">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <Field label="Nomo *" error={errors.firstName}>
                  <input
                    className={`form-input${errors.firstName ? " error" : ""}`}
                    placeholder="Via nomo"
                    value={form.firstName}
                    onChange={(e) => set("firstName", e.target.value)}
                  />
                </Field>
                <Field label="Familinomo *" error={errors.lastName}>
                  <input
                    className={`form-input${errors.lastName ? " error" : ""}`}
                    placeholder="Via familinomo"
                    value={form.lastName}
                    onChange={(e) => set("lastName", e.target.value)}
                  />
                </Field>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <Field label="Retpoŝtadreso *" error={errors.email}>
                  <input
                    className={`form-input${errors.email ? " error" : ""}`}
                    type="email"
                    placeholder="via@retposxto.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                </Field>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "32px" }}>
                <Field label="Pasvorto *" error={errors.password}>
                  <input
                    className={`form-input${errors.password ? " error" : ""}`}
                    type="password"
                    placeholder="Almenaŭ 8 signoj"
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                  />
                  <PasswordStrength password={form.password} />
                </Field>
                <Field label="Ripeti pasvorton *" error={errors.confirmPassword}>
                  <input
                    className={`form-input${errors.confirmPassword ? " error" : ""}`}
                    type="password"
                    placeholder="Ripetu vian pasvorton"
                    value={form.confirmPassword}
                    onChange={(e) => set("confirmPassword", e.target.value)}
                  />
                </Field>
              </div>

              {/* Divider */}
              <div style={{ borderTop: "1px solid var(--rule)", paddingTop: "24px", marginBottom: "24px" }}>
                <p className="body-serif" style={{ fontSize: "12px", color: "var(--ink-muted)", fontStyle: "italic" }}>
                  Jam havas konton?{" "}
                  <Link href="/login" style={{ color: "var(--green)", textDecoration: "underline" }}>
                    Ensaluti
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <div className="step-content">
              {/* Esperanto level */}
              <div style={{ marginBottom: "28px" }}>
                <label className="form-label">Via nivelo de Esperanto *</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {LEVELS.map((l) => (
                    <div
                      key={l.value}
                      className={`level-card${form.esperantoLevel === l.value ? " selected" : ""}`}
                      onClick={() => set("esperantoLevel", l.value)}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span
                          className="serif"
                          style={{
                            fontSize: "15px",
                            fontWeight: form.esperantoLevel === l.value ? 700 : 400,
                            color: form.esperantoLevel === l.value ? "var(--green)" : "var(--ink)",
                          }}
                        >
                          {l.label}
                        </span>
                        {form.esperantoLevel === l.value && (
                          <svg viewBox="0 0 16 16" width="16" height="16">
                            <polyline points="2,8 6,12 14,4" fill="none" stroke="#1F5C2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span
                        className="body-serif"
                        style={{ fontSize: "12px", color: "var(--ink-muted)", fontStyle: "italic" }}
                      >
                        {l.en}
                      </span>
                    </div>
                  ))}
                </div>
                {errors.esperantoLevel && <p className="field-error">{errors.esperantoLevel}</p>}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <Field label="Esperanta nomo (laŭvola)" error={undefined}>
                  <input
                    className="form-input"
                    placeholder="p.e. Verdulo, Lumino..."
                    value={form.esperantoName}
                    onChange={(e) => set("esperantoName", e.target.value)}
                  />
                </Field>
                <Field label="Lando de loĝado *" error={errors.country}>
                  <input
                    className={`form-input${errors.country ? " error" : ""}`}
                    placeholder="Via lando"
                    value={form.country}
                    onChange={(e) => set("country", e.target.value)}
                  />
                </Field>
              </div>

              <div style={{ marginBottom: "28px" }}>
                <Field label="Kial vi aliĝas? (laŭvola)" error={undefined}>
                  <textarea
                    className="form-input"
                    placeholder="Diru al ni pri via motivado por aliĝi al Esperantistujo..."
                    value={form.motivation}
                    onChange={(e) => set("motivation", e.target.value)}
                  />
                </Field>
              </div>

              {/* Info note */}
              <div
                style={{
                  background: "rgba(31,92,46,0.06)",
                  borderLeft: "3px solid var(--green)",
                  padding: "16px 20px",
                }}
              >
                <p className="body-serif" style={{ fontSize: "13px", color: "var(--ink-mid)", lineHeight: 1.6, fontStyle: "italic" }}>
                  Via esperanta nomo estos videbla al la komunumo. Se vi ne scias Esperanton, ne zorgu —
                  ni havas kursojn kaj helpajn rimedojn por ĉiuj niveloj.
                </p>
              </div>
            </div>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <div className="step-content">
              {/* Manifesto summary */}
              <div
                style={{
                  background: "#1F5C2E",
                  padding: "32px",
                  marginBottom: "32px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  className="serif"
                  style={{
                    position: "absolute",
                    top: "-20px",
                    right: "-20px",
                    fontSize: "120px",
                    fontWeight: 900,
                    color: "rgba(255,255,255,0.04)",
                    lineHeight: 1,
                    pointerEvents: "none",
                  }}
                >
                  ★
                </div>
                <p
                  className="serif"
                  style={{ fontSize: "20px", fontStyle: "italic", color: "#fff", lineHeight: 1.5, position: "relative" }}
                >
                  "Mi promesas partopreni en konstruado de komunumo bazita sur lingva egaleco, respekto, kaj la valoroj de Esperanto."
                </p>
                <p
                  className="body-serif"
                  style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "12px", letterSpacing: "0.1em" }}
                >
                  — LA PROMESO DE ESPERANTISTUJO
                </p>
              </div>

              {/* Checkboxes */}
              <div style={{ border: "1px solid var(--rule)", background: "#fff", marginBottom: "24px" }}>
                <CheckRow
                  checked={form.acceptManifesto}
                  onChange={(v) => set("acceptManifesto", v)}
                  hasError={!!errors.acceptManifesto}
                >
                  <span className="body-serif" style={{ fontSize: "14px", color: "var(--ink)", lineHeight: 1.5 }}>
                    Mi akceptas la{" "}
                    <a href="#" style={{ color: "var(--green)" }}>manifeston de Esperantistujo</a>{" "}
                    kaj ĝiajn principojn de lingva egaleco.
                  </span>
                </CheckRow>

                <CheckRow
                  checked={form.acceptLanguage}
                  onChange={(v) => set("acceptLanguage", v)}
                  hasError={!!errors.acceptLanguage}
                >
                  <span className="body-serif" style={{ fontSize: "14px", color: "var(--ink)", lineHeight: 1.5 }}>
                    Mi komprenas ke la lingvo de la komunumo estas Esperanto, kaj mi engaĝiĝas lerni
                    aŭ plibonigi miajn sciojn.
                  </span>
                </CheckRow>

                <CheckRow
                  checked={form.acceptCommunity}
                  onChange={(v) => set("acceptCommunity", v)}
                  hasError={!!errors.acceptCommunity}
                >
                  <span className="body-serif" style={{ fontSize: "14px", color: "var(--ink)", lineHeight: 1.5 }}>
                    Mi akceptas la{" "}
                    <a href="#" style={{ color: "var(--green)" }}>regulojn de la komunumo</a>{" "}
                    kaj la{" "}
                    <a href="#" style={{ color: "var(--green)" }}>politikon pri privateco</a>.
                  </span>
                </CheckRow>

                <CheckRow
                  checked={form.newsletter}
                  onChange={(v) => set("newsletter", v)}
                  hasError={false}
                  optional
                >
                  <span className="body-serif" style={{ fontSize: "14px", color: "var(--ink-muted)", lineHeight: 1.5, fontStyle: "italic" }}>
                    Mi volas ricevi novaĵojn pri la evoluo de Esperantistujo (laŭvola).
                  </span>
                </CheckRow>
              </div>

              {/* Required fields error summary */}
              {(errors.acceptManifesto || errors.acceptLanguage || errors.acceptCommunity) && (
                <div
                  style={{
                    background: "rgba(155,32,32,0.06)",
                    borderLeft: "3px solid var(--red)",
                    padding: "12px 16px",
                    marginBottom: "24px",
                  }}
                >
                  <p className="body-serif" style={{ fontSize: "13px", color: "var(--red)", fontStyle: "italic" }}>
                    Bonvolu akcepti ĉiujn necesajn deklarojn por daŭrigi.
                  </p>
                </div>
              )}

              {/* Summary */}
              <div
                style={{
                  background: "var(--cream-dark)",
                  padding: "20px 24px",
                  borderTop: "1px solid var(--rule)",
                }}
              >
                <p className="body-serif" style={{ fontSize: "12px", color: "var(--ink-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
                  Via konto
                </p>
                <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                  <SummaryItem label="Nomo" value={`${form.firstName} ${form.lastName}`} />
                  <SummaryItem label="Retpoŝto" value={form.email} />
                  <SummaryItem label="Lando" value={form.country || "—"} />
                  <SummaryItem label="Nivelo" value={LEVELS.find(l => l.value === form.esperantoLevel)?.label || "—"} />
                </div>
              </div>
            </div>
          )}

          {/* ── Navigation buttons ── */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "40px", paddingTop: "32px", borderTop: "1px solid var(--rule)" }}>
            <div>
              {step > 1 && (
                <button className="btn-ghost" onClick={prev}>
                  ← Reen
                </button>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {/* Step dots */}
              <div style={{ display: "flex", gap: "6px" }}>
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="step-dot"
                    style={{
                      width: step === n ? "24px" : "8px",
                      height: "8px",
                      background: step === n ? "#1F5C2E" : step > n ? "#B8860B" : "var(--rule)",
                    }}
                  />
                ))}
              </div>

              {step < 3 ? (
                <button className="btn-primary" onClick={next}>
                  Daŭrigi →
                </button>
              ) : (
                <button className="btn-primary" onClick={submit} style={{ background: "#B8860B" }}>
                  Aliĝi al Esperantistujo ★
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ──

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="form-label">{label}</label>
      {children}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4 : 3;
  const colors = ["transparent", "#9B2020", "#B8860B", "#2D7A40", "#1F5C2E"];
  const labels = ["", "Malforta", "Meza", "Bona", "Tre bona"];
  return (
    <div>
      <div className="password-strength-bar">
        <div
          className="password-strength-fill"
          style={{ width: `${(strength / 4) * 100}%`, background: colors[strength] }}
        />
      </div>
      {password.length > 0 && (
        <p className="body-serif" style={{ fontSize: "11px", color: colors[strength], marginTop: "4px", fontStyle: "italic" }}>
          {labels[strength]}
        </p>
      )}
    </div>
  );
}

function CheckRow({
  checked,
  onChange,
  hasError,
  optional = false,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  hasError: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`checkbox-row${hasError ? " error-row" : ""}`}
      onClick={() => onChange(!checked)}
      style={{ padding: "18px 20px" }}
    >
      <div className={`custom-checkbox${checked ? " checked" : ""}`}>
        {checked && (
          <svg viewBox="0 0 16 16" width="10" height="10">
            <polyline points="2,8 6,12 14,4" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <div style={{ flex: 1 }}>
        {children}
        {optional && (
          <span
            className="body-serif"
            style={{ fontSize: "11px", color: "var(--ink-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginLeft: "8px" }}
          >
            Laŭvola
          </span>
        )}
      </div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="body-serif" style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: "2px" }}>
        {label}
      </p>
      <p className="serif" style={{ fontSize: "14px", color: "var(--ink)", fontWeight: 700 }}>
        {value || "—"}
      </p>
    </div>
  );
}

function SuccessScreen({ name }: { name: string }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#1F5C2E",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "Georgia, serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=Source+Serif+4:opsz,wght@8..60,300;8..60,400&display=swap');
        @keyframes starPulse { 0%,100%{transform:scale(1) rotate(0deg)} 50%{transform:scale(1.08) rotate(5deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Grid bg */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />

      <div style={{ textAlign: "center", position: "relative", animation: "fadeUp 0.6s ease-out" }}>
        <div style={{ animation: "starPulse 3s ease-in-out infinite", display: "inline-block", marginBottom: "40px" }}>
          <svg viewBox="0 0 200 200" width="80" height="80">
            <polygon points="100,20 120,78 180,78 132,114 150,175 100,140 50,175 68,114 20,78 80,78" fill="#B8860B" />
          </svg>
        </div>

        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "56px", fontWeight: 900, color: "#fff", lineHeight: 1.05, marginBottom: "16px" }}>
          Bonvenon,<br />
          <em style={{ fontStyle: "italic", color: "#B8860B" }}>{name}!</em>
        </h1>

        <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "18px", color: "rgba(255,255,255,0.65)", fontWeight: 300, lineHeight: 1.7, maxWidth: "480px", margin: "0 auto 48px" }}>
          Vi estas nun parto de Esperantistujo. La urbo estas konstruata — kaj nun vi estas unu el ĝiaj arkitektoj.
        </p>

        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/dashboard"
            style={{
              display: "inline-block",
              background: "#B8860B",
              color: "#fff",
              fontFamily: "'Source Serif 4', serif",
              fontSize: "13px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "14px 32px",
              textDecoration: "none",
            }}
          >
            Iri al via panelo →
          </Link>
          <Link
            href="/"
            style={{
              display: "inline-block",
              color: "rgba(255,255,255,0.6)",
              fontFamily: "'Source Serif 4', serif",
              fontSize: "13px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "14px 0",
              textDecoration: "none",
              borderBottom: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            Reveni al komenco
          </Link>
        </div>
      </div>
    </div>
  );
}