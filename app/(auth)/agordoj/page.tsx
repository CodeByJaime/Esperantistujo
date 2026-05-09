"use client";
import { useUserStore } from "@/lib/store";
import { AuthLayout } from "@/components/auth-layout";
import { useState, useEffect, useCallback } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import { LoadingScreen } from "@/components/ui";
import { settingsOperations, type UserSettings } from "@/lib/supabase";
import { toast } from "sonner";

type Section = "general" | "privacy" | "security" | "data";

export default function AgordojPage() {
  const { user } = useUserStore();
  const [activeSection, setActiveSection] = useState<Section>("general");
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm({
    defaultValues: {
      interface_language: "eo" as 'eo' | 'en' | 'es' | 'fr' | 'de',
      notifications_email: true,
      notifications_newsletter: false,
      profile_public: true,
      privacy_show_age: true,
      privacy_show_relationship: true,
      privacy_show_ethnicity: false,
      privacy_show_income: false,
      security_two_factor: false,
      security_session_alerts: true,
    },
    onSubmit: async ({ value }) => {
      if (!user?.id) return;
      try {
        await settingsOperations.updateSettings(user.id, value);
        toast.success("Agordoj konservitaj sukcese!");
      } catch (error) {
        console.error("Error saving settings:", error);
        toast.error("Eraro dum konservado de agordoj");
      }
    },
  });

  // ── FIX: suscripción reactiva al estado del form ──
  // form.getFieldValue() no dispara re-renders; useStore sí.
 const formValues = useStore(form.store, (state) => state.values);


  // Load existing settings on component mount
  const loadSettings = useCallback(async () => {
    if (!user?.id) return;
    try {
      setIsLoading(true);
      const settings = await settingsOperations.getSettings(user.id);
      if (settings) {
        Object.entries(settings).forEach(([key, val]) => {
          if (val !== null && val !== undefined) {
            form.setFieldValue(key as keyof UserSettings, val);
          }
        });
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, form.setFieldValue]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const navItems: { id: Section; label: string; icon: string }[] = [
    { id: "general",  label: "Ĝeneralaj",          icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" },
    { id: "privacy",  label: "Privateco",           icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" },
    { id: "security", label: "Sekureco",            icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
    { id: "data",     label: "Datuma Administrado", icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" },
  ];

  // Show loading screen while settings are being loaded
  if (isLoading) {
    return (
      <AuthLayout user={user}>
        <LoadingScreen 
          title="Ŝargante agordojn" 
          subtitle="Bonvolu atendi dum ni ŝargas viajn agordojn..." 
        />
      </AuthLayout>
    );
  }

  if (!user) {
    return (
      <AuthLayout user={null}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-esperanto-verda/15 border border-esperanto-verda/30 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-esperanto-verda" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <title>{"Agordoj"}</title>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="font-display text-2xl font-bold text-white mb-2">Agordoj ne alireblaj</h2>
            <p className="font-sans-dm text-white/50 text-sm">Bonvolu ensaluti por vidi viajn agordojn.</p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout user={user}>
      <div className="max-w-5xl mx-auto p-6">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-white mb-2">Agordoj</h1>
          <p className="font-sans-dm text-white/50 text-sm">
            Administru viajn preferojn, privatecon kaj sekurecon de la konto.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Sidebar nav ── */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                    activeSection === item.id
                      ? "bg-esperanto-verda/15 border border-esperanto-verda/30 text-esperanto-verda"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                  <span className="font-sans-dm text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Quick actions */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <h3 className="font-display text-base font-bold text-white mb-4">Rapidaj Agoj</h3>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => form.handleSubmit()}
                  className="w-full px-4 py-2 bg-esperanto-verda hover:bg-esperanto-verda/20 text-white font-sans-dm text-sm rounded-lg transition-all"
                >
                  Konservi ŝanĝojn
                </button>
                <button type="button" className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-sans-dm text-sm rounded-lg transition-all">
                  Ŝanĝi Pasvorton
                </button>
                <button type="button" className="w-full px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-sans-dm text-sm rounded-lg transition-all text-left border border-red-500/20">
                  Forigi Konton
                </button>
              </div>
            </div>
          </div>

          {/* ── Main content ── */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">

              {/* ── GENERAL ── */}
              {activeSection === "general" && (
                <div>
                  <h3 className="font-display text-xl font-bold text-white mb-6">Ĝeneralaj Agordoj</h3>
                  <div className="space-y-6">

                    {/* Language */}
                    <div>
                      <label htmlFor="interface_language" className="block font-sans-dm text-white/60 text-xs uppercase tracking-wider mb-2">
                        Interfaca Lingvo
                      </label>
                      <select
                        id="interface_language"
                        value={formValues.interface_language}
                        onChange={(e) => form.setFieldValue("interface_language", e.target.value as 'eo' | 'en' | 'es' | 'fr' | 'de')}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-esperanto-verda focus:bg-white/15 transition-all text-sm font-sans-dm appearance-none"
                      >
                        <option value="eo" className="bg-gray-900">Esperanto</option>
                        <option value="en" className="bg-gray-900">English</option>
                        <option value="es" className="bg-gray-900">Español</option>
                        <option value="fr" className="bg-gray-900">Français</option>
                        <option value="de" className="bg-gray-900">Deutsch</option>
                      </select>
                    </div>

                    {/* Notifications */}
                    <div className="border-t border-white/10 pt-6 space-y-4">
                      <p className="font-sans-dm text-white/60 text-xs uppercase tracking-wider">Sciigoj</p>

                      <Toggle
                        label="Retpoŝtaj Sciigoj"
                        description="Ricevu sciigojn retpoŝte"
                        checked={formValues.notifications_email}
                        onChange={(v) => form.setFieldValue("notifications_email", v)}
                      />

                      <Toggle
                        label="Novaĵletero"
                        description="Informoj pri novaj funkcioj kaj eventoj esperantistaj"
                        checked={formValues.notifications_newsletter}
                        onChange={(v) => form.setFieldValue("notifications_newsletter", v)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── PRIVACY ── */}
              {activeSection === "privacy" && (
                <div>
                  <h3 className="font-display text-xl font-bold text-white mb-2">Privateco</h3>
                  <p className="font-sans-dm text-white/40 text-sm mb-6">
                    Kontrolu kiu povas vidi viajn informojn en la komunumo.
                  </p>

                  <div className="space-y-4">
                    <Toggle
                      label="Profilo publika"
                      description="Aliaj uzantoj povas vidi vian profilon."
                      checked={formValues.profile_public}
                      onChange={(v) => form.setFieldValue("profile_public", v)}
                    />

                    {/* Visible fields — only active when profile is public */}
                    <div className={`pl-4 border-l-2 space-y-4 transition-opacity ${
                      formValues.profile_public
                        ? "border-esperanto-verda/30 opacity-100"
                        : "border-white/10 opacity-40 pointer-events-none"
                    }`}>
                      <p className="font-sans-dm text-white/60 text-xs uppercase tracking-wider mb-4">
                        Kampoj videblaj por aliaj
                      </p>

                      {(
                        [
                          { field: "privacy_show_age",          label: "Aĝo",            description: "Montri vian aĝon en la profilo" },
                          { field: "privacy_show_relationship",  label: "Rilata Statuso", description: "Montri ĉu vi havas partneron" },
                          { field: "privacy_show_ethnicity",     label: "Etna Grupo",     description: "Montri vian etnan identecon" },
                          { field: "privacy_show_income",        label: "Monata Enspezo", description: "Montri la enspeza gamo kiun vi elektis" },
                        ] as const
                      ).map(({ field, label, description }) => (
                        <div
                          key={field}
                          className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                        >
                          <div>
                            <p className="font-sans-dm text-white text-sm">{label}</p>
                            <p className="font-sans-dm text-white/40 text-xs mt-0.5">{description}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => form.setFieldValue(field, !formValues[field])}
                            disabled={!formValues.profile_public}
                            className={`relative shrink-0 inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              formValues[field] ? "bg-esperanto-verda" : "bg-white/20"
                            } ${!formValues.profile_public ? "cursor-not-allowed" : ""}`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                formValues[field] ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── SECURITY ── */}
              {activeSection === "security" && (
                <div>
                  <h3 className="font-display text-xl font-bold text-white mb-2">Sekureco</h3>
                  <p className="font-sans-dm text-white/40 text-sm mb-6">
                    Administru la sekurecon de via konto.
                  </p>

                  <div className="space-y-6">

                    {/* 2FA */}
                    <Toggle
                      label="Du-Faktora Aŭtentikigo (2FA)"
                      description="Aldonu duan tavolon da protekto al via konto"
                      checked={formValues.security_two_factor}
                      onChange={(v) => form.setFieldValue("security_two_factor", v)}
                    />

                    <div className="border-t border-white/10 pt-6 space-y-4">
                      <p className="font-sans-dm text-white/60 text-xs uppercase tracking-wider">
                        Sciigoj pri novaj sesioj
                      </p>

                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                        <div>
                          <p className="font-sans-dm text-white text-sm">Alerta retpoŝto</p>
                          <p className="font-sans-dm text-white/40 text-xs mt-0.5">
                            Ricevu retpoŝton kiam nova aparato ensalutas
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => form.setFieldValue("security_session_alerts", !formValues.security_session_alerts)}
                          className={`relative shrink-0 inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            formValues.security_session_alerts ? "bg-esperanto-verda" : "bg-white/20"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              formValues.security_session_alerts ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Active session */}
                      <div>
                        <p className="font-sans-dm text-white/60 text-xs uppercase tracking-wider mb-4">
                          Aktivaj Sesioj
                        </p>
                        <div className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-esperanto-verda rounded-full animate-pulse" />
                            <div>
                              <p className="font-sans-dm text-white text-sm">Nuna sesio</p>
                              <p className="font-sans-dm text-white/40 text-xs mt-0.5">{user.email}</p>
                            </div>
                          </div>
                          <span className="font-sans-dm text-esperanto-verda text-xs">Aktiva</span>
                        </div>
                      </div>

                    </div>{/* end border-t div */}
                  </div>{/* end space-y-6 */}
                </div>
              )}

              {/* ── DATA ── */}
              {activeSection === "data" && (
                <div>
                  <h3 className="font-display text-xl font-bold text-white mb-2">Datuma Administrado</h3>
                  <p className="font-sans-dm text-white/40 text-sm mb-6">
                    Administru viajn datumojn laŭ via rajto al privateco.
                  </p>

                  <div className="space-y-4">

                    {/* Export */}
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-sans-dm text-white text-sm font-medium">Elporti Datumojn</p>
                          <p className="font-sans-dm text-white/40 text-xs mt-1">
                            Elŝutu kopion de ĉiuj viaj datumoj en JSON-formato.
                          </p>
                        </div>
                        <button type="button" className="shrink-0 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-sans-dm text-sm rounded-lg transition-all">
                          Elporti
                        </button>
                      </div>
                    </div>

                    {/* Clear activity */}
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-sans-dm text-white text-sm font-medium">Viŝi Agad-Historion</p>
                          <p className="font-sans-dm text-white/40 text-xs mt-1">
                            Forigu vian agad-historion en la platformo. Ĉi tio ne forigas vian konton.
                          </p>
                        </div>
                        <button type="button" className="shrink-0 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-sans-dm text-sm rounded-lg transition-all">
                          Viŝi
                        </button>
                      </div>
                    </div>

                    {/* Delete account */}
                    <div className="p-4 bg-red-500/5 rounded-lg border border-red-500/20 mt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-sans-dm text-red-400 text-sm font-medium">Forigi Konton</p>
                          <p className="font-sans-dm text-white/40 text-xs mt-1">
                            Ĉi tio estas nerebligebla. Ĉiuj viaj datumoj estos definitive forigitaj.
                          </p>
                        </div>
                        <button type="button" className="shrink-0 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-sans-dm text-sm rounded-lg transition-all border border-red-500/30">
                          Forigi
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </AuthLayout>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="font-sans-dm text-white text-sm">{label}</p>
        <p className="font-sans-dm text-white/40 text-xs mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative shrink-0 inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-esperanto-verda" : "bg-white/20"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}