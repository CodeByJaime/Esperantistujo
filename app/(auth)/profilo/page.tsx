"use client";
import { useForm } from "@tanstack/react-form";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AuthLayout } from "@/components/auth-layout";
import { LoadingScreen } from "@/components/ui";
import { formatDate, useTranslation } from '@/lib/i18n';
import { useUserStore } from "@/lib/store";
import { profileOperations } from "@/lib/supabase";

const LANGUAGES_OPTIONS = [
  "Esperanto", "Angla", "Hispana", "Franca", "Germana", "Portugala",
  "Itala", "Rusa", "Ĉina", "Japana", "Araba", "Hindia", "Korea",
  "Nederlanda", "Pola", "Sveda", "Turka", "Vida", "Alia",
];

const EDUCATION_OPTIONS = [
  "Baza lernejo", "Meza lernejo", "Gimnazio / Liceo",
  "Teknika / Profesia", "Bakalaŭro", "Magistro", "Doktoro", "Postdoktora",
];

const INCOME_OPTIONS = [
  "Preferas ne diri", "< 500 USD", "500–1.000 USD",
  "1.000–2.000 USD", "2.000–4.000 USD", "4.000–8.000 USD", "> 8.000 USD",
];

const RELATIONSHIP_OPTIONS = [
  "Fraŭlo/a", "Rilata (ne geedzita)", "Geedzita", "Disigita", "Vidvo/a", "Preferas ne diri",
];

const ESPERANTO_LEVELS = [
  "Komencanto", "Baza", "Meza", "Avancita", "Flua", "Denaska",
];

const CHILDREN_OPTIONS = ["Neniu", "1", "2", "3", "4", "5+", "Preferas ne diri"];

export default function ProfiloPage() {
  const { user } = useUserStore();
  const { t, language } = useTranslation();
  const user_id = user?.id || null;
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("personal");
  const [profileLoaded, setProfileLoaded] = useState(false);

  const form = useForm({
    defaultValues: {
      displayName: user?.user_metadata?.display_name || "",
      esperantoName: "",
      birthPlace: "",
      birthCountry: "",
      age: "",
      ethnicity: "",
      educationLevel: "",
      occupation: "",
      monthlyIncomeRange: "Preferas ne diri",
      height: "",
      languages: [] as string[],
      relationshipStatus: "Preferas ne diri",
      children: "",
      esperantoLevel: "Komencanto",
      esperantoSince: "",
      bio: "",
    },
    onSubmit: async ({ value }) => {
      if (!user_id) {
        return;
      }
      await profileOperations.updateProfile(user_id, value);

      setIsEditing(false);
    },
  });

  // Load existing profile data on component mount
  const loadProfile = useCallback(async () => {
    if (!user_id) return;

    try {
      const profile = await profileOperations.getProfile(user_id);
      if (profile) {
        // Update form with existing profile data
        form.setFieldValue("displayName", profile.display_name || user?.user_metadata?.display_name || "");
        form.setFieldValue("esperantoName", profile.esperanto_name || "");
        form.setFieldValue("birthPlace", profile.birth_place || "");
        form.setFieldValue("birthCountry", profile.birth_country || "");
        form.setFieldValue("age", profile.age ? profile.age.toString() : "");
        form.setFieldValue("ethnicity", profile.ethnicity || "");
        form.setFieldValue("educationLevel", profile.education_level || "");
        form.setFieldValue("occupation", profile.occupation || "");
        form.setFieldValue("monthlyIncomeRange", profile.monthly_income_range || "Preferas ne diri");
        form.setFieldValue("height", profile.height_cm ? profile.height_cm.toString() : "");
        form.setFieldValue("languages", profile.languages || []);
        form.setFieldValue("relationshipStatus", profile.relationship_status || "Preferas ne diri");
        form.setFieldValue("children", profile.children || "");
        form.setFieldValue("esperantoLevel", profile.esperanto_level || "Komencanto");
        form.setFieldValue("esperantoSince", profile.esperanto_since ? profile.esperanto_since.toString() : "");
        form.setFieldValue("bio", profile.bio || "");

        // Force re-render by updating state
        setProfileLoaded(true);
      } else {
        // No profile exists, set as loaded
        setProfileLoaded(true);
      }
    } catch (_error) {
      setProfileLoaded(true);
    }
  }, [user_id, user?.user_metadata?.display_name, form.setFieldValue]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const sections = [
    { id: "personal", label: t('profile.sections.personal'), icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { id: "esperanto", label: t('profile.sections.esperanto'), icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" },
    { id: "social", label: t('profile.sections.social'), icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
    { id: "economic", label: t('profile.sections.economic'), icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  ];

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
            <h2 className="font-display text-2xl font-bold text-white mb-2">{t('profile.userNotFound')}</h2>
            <p className="font-sans-dm text-white/50 text-sm">{t('profile.loginPrompt')}</p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Show loading spinner while profile data is being loaded
  if (!profileLoaded) {
    return (
      <AuthLayout user={user}>
        <LoadingScreen />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout user={user}>
      <div key={profileLoaded.toString()} className="max-w-5xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-white mb-2">{t('profile.title')}</h1>
          <p className="font-sans-dm text-white/50 text-sm">
            {t('profile.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── LEFT ── */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-esperanto-verda/15 border border-esperanto-verda/30 flex items-center justify-center mx-auto mb-4">
                  {user.user_metadata?.avatar_url ? (
                    <Image src={user.user_metadata.avatar_url} alt="Profile" width={96} height={96} className="rounded-full object-cover" />
                  ) : (
                    <svg className="w-12 h-12 text-esperanto-verda" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <title>Uzanto</title>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>

                <h2 className="font-display text-xl font-bold text-white mb-1">
                  {form.getFieldValue("displayName") || user.user_metadata?.display_name || "Uzanto"}
                </h2>
                {form.getFieldValue("esperantoName") && (
                  <p className="font-sans-dm text-esperanto-verda text-sm italic mb-1">
                    {form.getFieldValue("esperantoName")}
                  </p>
                )}
                <p className="font-sans-dm text-white/50 text-sm mb-3">{user.email}</p>

                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-esperanto-verda rounded-full animate-pulse" />
                  <span className="font-sans-dm text-esperanto-verda text-xs">Aktiva</span>
                </div>

                <div className="text-left space-y-2 border-t border-white/10 pt-4">
                  {(() => {
                    return null;
                  })()}

                  {form.getFieldValue("birthPlace") && (
                    <div className="flex justify-between items-center">
                      <span className="font-sans-dm text-white/50 text-xs">{t('profile.form.birthPlace')}</span>
                      <span className="font-sans-dm text-white text-xs">{form.getFieldValue("birthPlace")}</span>
                    </div>
                  )}

                  {form.getFieldValue("birthCountry") && (
                    <div className="flex justify-between items-center">
                      <span className="font-sans-dm text-white/50 text-xs">{t('profile.form.birthCountry')}</span>
                      <span className="font-sans-dm text-white text-xs">{form.getFieldValue("birthCountry")}</span>
                    </div>
                  )}

                  {form.getFieldValue("age") && (
                    <div className="flex justify-between items-center">
                      <span className="font-sans-dm text-white/50 text-xs">{t('profile.form.age')}</span>
                      <span className="font-sans-dm text-white text-xs">{form.getFieldValue("age")} j.</span>
                    </div>
                  )}

                  {form.getFieldValue("ethnicity") && (
                    <div className="flex justify-between items-center">
                      <span className="font-sans-dm text-white/50 text-xs">{t('profile.form.ethnicity')}</span>
                      <span className="font-sans-dm text-white text-xs">{form.getFieldValue("ethnicity")}</span>
                    </div>
                  )}

                  {form.getFieldValue("esperantoLevel") && (
                    <div className="flex justify-between items-center">
                      <span className="font-sans-dm text-white/50 text-xs">{t('profile.form.esperantoLevel')}</span>
                      <span className="font-sans-dm text-esperanto-verda text-xs">{form.getFieldValue("esperantoLevel")}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="font-sans-dm text-white/50 text-xs">{t('profile.form.memberSince')}</span>
                    <span className="font-sans-dm text-white text-xs">
                      {formatDate(new Date(user.created_at), language)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-sans-dm text-white/50 text-xs">{t('profile.form.relationshipStatus')}</span>
                    <span className="font-sans-dm text-esperanto-verda text-xs">{t('profile.relationshipOptions.married')}</span>
                  </div>
                </div>

                {
                  (() => {
                    const languages = form.getFieldValue("languages");
                    return languages && languages.length > 0;
                  })() && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="font-sans-dm text-white/50 text-xs mb-2 text-left">{t('profile.form.languages')}</p>
                      <div className="flex flex-wrap gap-1">
                        {form.getFieldValue("languages").map((l: string) => (
                          <span key={l} className="px-2 py-0.5 bg-esperanto-verda/10 border border-esperanto-verda/30 rounded-full text-esperanto-verda text-xs font-sans-dm">
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Section nav */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-2">
              {sections.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${activeSection === s.id
                    ? "bg-esperanto-verda/15 border border-esperanto-verda/30 text-esperanto-verda"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                  </svg>
                  <span className="font-sans-dm text-sm font-medium">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl font-bold text-white">
                  {sections.find(s => s.id === activeSection)?.label} {t('profile.form.info')}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-esperanto-verda hover:bg-[#00b300] text-white font-sans-dm font-medium text-sm rounded-lg transition-all"
                >
                  {isEditing ? t('profile.form.cancel') : t('profile.form.edit')}
                </button>
              </div>

              {/* ── PERSONAL ── */}
              {activeSection === "personal" && (
                <div className="space-y-5">
                  <Field label={t('profile.form.displayName')} htmlFor="displayName">
                    {isEditing ? (
                      <form.Field name="displayName">
                        {(field) => (
                          <Input id="displayName" value={field.state.value} onChange={field.handleChange} placeholder={t('profile.form.placeholders.displayName')} />
                        )}
                      </form.Field>
                    ) : <Value>{form.getFieldValue("displayName") || "—"}</Value>}
                  </Field>

                  <Field label={t('profile.form.esperantoName')} htmlFor="esperantoName">
                    {isEditing ? (
                      <form.Field name="esperantoName">
                        {(field) => (
                          <Input id="esperantoName" value={field.state.value} onChange={field.handleChange} placeholder={t('profile.form.placeholders.esperantoName')} />
                        )}
                      </form.Field>
                    ) : <Value>{form.getFieldValue("esperantoName") || "—"}</Value>}
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label={t('profile.form.birthPlace')} htmlFor="birthPlace">
                      {isEditing ? (
                        <form.Field name="birthPlace">
                          {(field) => (
                            <Input id="birthPlace" value={field.state.value} onChange={field.handleChange} placeholder={t('profile.form.placeholders.birthPlace')} />
                          )}
                        </form.Field>
                      ) : <Value>{form.getFieldValue("birthPlace") || "—"}</Value>}
                    </Field>
                    <Field label={t('profile.form.birthCountry')} htmlFor="birthCountry">
                      {isEditing ? (
                        <form.Field name="birthCountry">
                          {(field) => (
                            <Input id="birthCountry" value={field.state.value} onChange={field.handleChange} placeholder={t('profile.form.placeholders.birthCountry')} />
                          )}
                        </form.Field>
                      ) : <Value>{form.getFieldValue("birthCountry") || "—"}</Value>}
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label={t('profile.form.age')} htmlFor="age">
                      {isEditing ? (
                        <form.Field name="age">
                          {(field) => (
                            <Input id="age" type="number" value={field.state.value} onChange={field.handleChange} placeholder={t('profile.form.placeholders.age')} />
                          )}
                        </form.Field>
                      ) : <Value>{form.getFieldValue("age") ? `${form.getFieldValue("age")} jaroj` : "—"}</Value>}
                    </Field>
                    <Field label={t('profile.form.height')} htmlFor="height">
                      {isEditing ? (
                        <form.Field name="height">
                          {(field) => (
                            <Input id="height" type="number" value={field.state.value} onChange={field.handleChange} placeholder={t('profile.form.placeholders.height')} />
                          )}
                        </form.Field>
                      ) : <Value>{form.getFieldValue("height") ? `${form.getFieldValue("height")} cm` : "—"}</Value>}
                    </Field>
                  </div>

                  <Field label={t('profile.form.ethnicity')} htmlFor="ethnicity">
                    {isEditing ? (
                      <form.Field name="ethnicity">
                        {(field) => (
                          <Input id="ethnicity" value={field.state.value} onChange={field.handleChange} placeholder={t('profile.form.placeholders.ethnicity')} />
                        )}
                      </form.Field>
                    ) : <Value>{form.getFieldValue("ethnicity") || "—"}</Value>}
                  </Field>

                  <Field label={t('profile.form.email')} htmlFor="email">
                    <p id="email" className="font-sans-dm text-white">{user.email}</p>
                  </Field>

                  <Field label={t('profile.form.userId')} htmlFor="userId">
                    <p id="userId" className="font-sans-dm text-white/40 text-xs font-mono break-all">{user.id}</p>
                  </Field>

                  <Field label={t('profile.form.bio')} htmlFor="bio">
                    {isEditing ? (
                      <form.Field name="bio">
                        {(field) => (
                          <textarea
                            id="bio"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-esperanto-verda focus:bg-white/15 transition-all resize-none text-sm font-sans-dm"
                            placeholder={t('profile.form.placeholders.bio')}
                          />
                        )}
                      </form.Field>
                    ) : <Value>{form.getFieldValue("bio") || "—"}</Value>}
                  </Field>
                </div>
              )}

              {/* ── ESPERANTO ── */}
              {activeSection === "esperanto" && (
                <div className="space-y-5">
                  <Field label={t('profile.form.esperantoLevel')} htmlFor="esperantoLevel">
                    {isEditing ? (
                      <form.Field name="esperantoLevel">
                        {(field) => (
                          <Select id="esperantoLevel" value={field.state.value} onChange={field.handleChange} options={ESPERANTO_LEVELS} />
                        )}
                      </form.Field>
                    ) : <Value highlight>{form.getFieldValue("esperantoLevel") || "—"}</Value>}
                  </Field>

                  <Field label={t('profile.form.esperantoSince')} htmlFor="esperantoSince">
                    {isEditing ? (
                      <form.Field name="esperantoSince">
                        {(field) => (
                          <Input id="esperantoSince" type="number" value={field.state.value} onChange={field.handleChange} placeholder={t('profile.form.placeholders.esperantoSince')} />
                        )}
                      </form.Field>
                    ) : <Value>{form.getFieldValue("esperantoSince") ? `De ${form.getFieldValue("esperantoSince")}` : "—"}</Value>}
                  </Field>

                  <Field label={t('profile.form.languages')} htmlFor="languages">
                    {isEditing ? (
                      <form.Field name="languages">
                        {(field) => (
                          <div className="flex flex-wrap gap-2 mt-1">
                            {LANGUAGES_OPTIONS.map(lang => {
                              const selected = (field.state.value as string[]).includes(lang);
                              return (
                                <button
                                  key={lang}
                                  type="button"
                                  onClick={() =>
                                    field.handleChange(
                                      selected
                                        ? (field.state.value as string[]).filter(l => l !== lang)
                                        : [...(field.state.value as string[]), lang]
                                    )
                                  }
                                  className={`px-3 py-1 rounded-full text-xs font-sans-dm border transition-all ${selected
                                    ? "bg-esperanto-verda/20 border-esperanto-verda text-esperanto-verda"
                                    : "bg-white/5 border-white/20 text-white/50 hover:border-white/40"
                                    }`}
                                >
                                  {lang}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </form.Field>
                    ) : (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {form.getFieldValue("languages").length
                          ? form.getFieldValue("languages").map((l: string) => (
                            <span key={l} className="px-3 py-1 bg-esperanto-verda/10 border border-esperanto-verda/30 rounded-full text-esperanto-verda text-xs font-sans-dm">
                              {l}
                            </span>
                          ))
                          : <span className="font-sans-dm text-white/40 text-sm">—</span>
                        }
                      </div>
                    )}
                  </Field>
                </div>
              )}

              {/* ── SOCIAL ── */}
              {activeSection === "social" && (
                <div className="space-y-5">
                  <Field label={t('profile.form.educationLevel')} htmlFor="educationLevel">
                    {isEditing ? (
                      <form.Field name="educationLevel">
                        {(field) => (
                          <Select id="educationLevel" value={field.state.value} onChange={field.handleChange} options={EDUCATION_OPTIONS} placeholder={t('profile.form.placeholders.selectLevel')} />
                        )}
                      </form.Field>
                    ) : <Value>{form.getFieldValue("educationLevel") || "—"}</Value>}
                  </Field>

                  <Field label={t('profile.form.occupation')} htmlFor="occupation">
                    {isEditing ? (
                      <form.Field name="occupation">
                        {(field) => (
                          <Input id="occupation" value={field.state.value} onChange={field.handleChange} placeholder={t('profile.form.placeholders.occupation')} />
                        )}
                      </form.Field>
                    ) : <Value>{form.getFieldValue("occupation") || "—"}</Value>}
                  </Field>

                  <Field label={t('profile.form.relationshipStatus')} htmlFor="relationshipStatus">
                    {isEditing ? (
                      <form.Field name="relationshipStatus">
                        {(field) => (
                          <Select id="relationshipStatus" value={field.state.value} onChange={field.handleChange} options={RELATIONSHIP_OPTIONS} />
                        )}
                      </form.Field>
                    ) : <Value>{form.getFieldValue("relationshipStatus") || "—"}</Value>}
                  </Field>

                  <Field label={t('profile.form.children')} htmlFor="children">
                    {isEditing ? (
                      <form.Field name="children">
                        {(field) => (
                          <div className="flex gap-3 flex-wrap mt-1">
                            {CHILDREN_OPTIONS.map(opt => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => field.handleChange(opt)}
                                className={`px-4 py-2 rounded-lg text-sm font-sans-dm border transition-all ${field.state.value === opt
                                  ? "bg-esperanto-verda/20 border-esperanto-verda text-esperanto-verda"
                                  : "bg-white/5 border-white/20 text-white/50 hover:border-white/40"
                                  }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}
                      </form.Field>
                    ) : <Value>{form.getFieldValue("children") || "—"}</Value>}
                  </Field>
                </div>
              )}

              {/* ── ECONOMIC ── */}
              {activeSection === "economic" && (
                <div className="space-y-5">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="font-sans-dm text-white/40 text-xs leading-relaxed">
                      {t('profile.form.economicInfo')}
                    </p>
                  </div>

                  <Field label={t('profile.form.monthlyIncome')} htmlFor="monthlyIncomeRange">
                    {isEditing ? (
                      <form.Field name="monthlyIncomeRange">
                        {(field) => (
                          <div className="grid grid-cols-2 gap-2 mt-1">
                            {INCOME_OPTIONS.map(opt => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => field.handleChange(opt)}
                                className={`px-3 py-2 rounded-lg text-sm font-sans-dm border transition-all text-left ${field.state.value === opt
                                  ? "bg-esperanto-verda/20 border-esperanto-verda text-esperanto-verda"
                                  : "bg-white/5 border-white/20 text-white/50 hover:border-white/40"
                                  }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}
                      </form.Field>
                    ) : <Value>{form.getFieldValue("monthlyIncomeRange") || "—"}</Value>}
                  </Field>
                </div>
              )}

              {/* Save */}
              {isEditing && (
                <div className="mt-8 pt-6 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => form.handleSubmit()}
                    className="px-6 py-2.5 bg-transparent border border-esperanto-verda hover:bg-esperanto-verda/10 text-esperanto-verda font-sans-dm font-medium text-sm rounded-lg transition-all"
                  >
                    {t('profile.form.saveChanges')}
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

/* ── Helper components ── */

function Field({ label, htmlFor, children }: { label: string; htmlFor?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block font-sans-dm text-white/60 text-xs uppercase tracking-wider mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

function Value({ children, highlight }: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <p className={`font-sans-dm text-sm ${highlight ? "text-esperanto-verda font-medium" : "text-white"}`}>
      {children}
    </p>
  );
}

function Input({
  id, value, onChange, placeholder, type = "text",
}: {
  id: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-esperanto-verda focus:bg-white/15 transition-all text-sm font-sans-dm"
      placeholder={placeholder}
    />
  );
}

function Select({
  id, value, onChange, options, placeholder,
}: {
  id: string; value: string; onChange: (v: string) => void; options: string[]; placeholder?: string;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-esperanto-verda focus:bg-white/15 transition-all text-sm font-sans-dm appearance-none"
    >
      {placeholder && <option value="" className="bg-gray-900">{placeholder}</option>}
      {options.map(o => (
        <option key={o} value={o} className="bg-gray-900">{o}</option>
      ))}
    </select>
  );
}