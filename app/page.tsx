"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Topbar } from "../public/components/topbar";
import Image from "next/image";

const NAV_LINKS = [
  { label: "Manifesto", href: "#manifesto" },
  { label: "Pozicio", href: "#pozicio" },
  { label: "Aliĝi", href: "/registri" },
];

const MANIFESTO_CONTENT = {
  title: "MANIFESTO DE ESPERANTISTUJO",
  subtitle: "De Tribismo al Homaranismo",
  tagline: "Tutmonda Reto de Komunumoj • Unu Sola Planedo • Unu Komuna Lingvo",
  sections: [
    {
      number: "I",
      title: "LA PROBLEMO: LA HEREDITA MENSO DE LA NACIO-ŜTATO",
      content:
        "La nuna mondo ankoraŭ funkcias laŭ la sama mensa modelo, kiun havis triboj antaŭ miloj da jaroj. Ni nur ŝanĝis la nomon: de tribismo al naciismo. Kaj kun tiu nova nomo ni aldonis ion pli malfacilan: limojn.\n\nĈio, kio estas inter ĉi tiuj limoj, apartenas al unu ŝtato; kio estas ekster ili, al alia. Kaj kiel en ĉiu tribo, konfliktoj fariĝas preskaŭ neeviteblaj.\n\nĈi tiu modelo montriĝis neadekvata por la hodiaŭa homaro:\n\n1. **Korupto kaj neefikeco** en maldiafanaj burokratioj\n2. **Homa malŝparo**, ĉar talento restas kaptita de naskiĝloko\n3. **Kronika malsekureco** en forgesitaj regionoj\n4. **Monetaj sistemoj**, kiuj ofte malfortigas la ŝparadon de ordinaraj homoj\n\nPensi de la makroo (ŝtatoj) al la mikroo (homoj) generas dividon.\nNi proponas la malon: **pensi de la homoj al la komunumo**.",
    },
    {
      number: "II",
      title: "NIA VIZIO: TUTMONDA RETO DE ESPERANTISTAJ KOMUNUMOJ",
      content:
        "Ni kredas, ke ĉiuj homoj valoras egale, sendepende de nacieco, deveno aŭ religio.\n\nNi imagas mondon, kie homoj povas kunlabori preter limoj pere de komuna lingvo kaj komunaj valoroj.\n\nTial ni proponas la kreadon de **fizikaj komunumoj**, ligitaj en **tutmonda reto**, kie Esperanto estas la ĉiutaga lingvo de kunvivado.\n\nLa unua tia komunumo estos fondita en Viĉado, Kolombio, kiel modelo por estontaj komunumoj en aliaj lokoj de la mondo.",
    },
    {
      number: "III",
      title: "LA TEKNOLOGIAJ KAJ ORGANIZAJ KOLONOJ",
      content:
        "1. **Ágora – Kunordiga Sistemo**\n   Malfermitkoda ilo por proponi, financi kaj realigi projektojn en la komunumo kun plena travideblo.\n\n2. **Komuna Interŝanĝa Sistemo**\n   Ilo por faciligi komercon inter komunumoj de la reto, administrata loke laŭ komunaj principoj.\n\n3. **Task-bazita Kunlaboro**\n   Roloj ne estas permanentaj postenoj, sed provizoraj taskoj laŭ kapabloj kaj pruvitaj kontribuoj.\n\n4. **Reta Fidosistemo**\n   La kontribuoj de ĉiu ano estas videblaj kaj rekoneblaj tra la tuta reto de komunumoj.",
    },
    {
      number: "IV",
      title: "KIEL ĜI FUNKCIAS PRAKTIKE",
      content:
        "**Unua fazo: la fonda komunumo** en Viĉado.\n\n**Dua fazo:** helpi aliajn grupojn fondi similajn komunumojn en aliaj regionoj.\n\n**Tria fazo:** ligi tiujn komunumojn en tutmonda reto de kunlaboro.\n\nSekureco, ekonomio kaj organizado baziĝas sur travideblo, loka respondeco kaj reciproka fido.",
    },
    {
      number: "V",
      title: "ALVOKO AL AGO",
      content:
        "Ni ne kontraŭstaras ekzistantajn ŝtatojn.\nNi simple konstruas ekzemplon de alia maniero kunvivi.\n\n1. Aliĝu kiel **partoprenanto** kaj kontribuu viajn kapablojn.\n2. Helpu krei la unuan esperantistan komunumon kie la lingvo estas ĉiutaga realo.\n\nĈi tio estas praktika eksperimento:\nkio okazas kiam komunumo organiziĝas ĉirkaŭ travideblo, kontribuo kaj komuna lingvo?\n\nLa homaro ne bezonas pli da limoj.\nĜi bezonas pli da kunlaboraj nodoj.",
    },
  ],
};

const STATS = [
  { value: "2 milionoj", label: "Esperantistoj en la mondo" },
  { value: "180+", label: "Landoj kun aktiva komunumo" },
  { value: "1887", label: "Jaro de la naskiĝo de Esperanto" },
];

// Helper function to render bold text properly
function renderTextWithBold(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/);
  return parts.map((part, index) => {
    if (index % 2 === 0) {
      return part;
    } else {
      return (
        <span
          key={`${part.replace(/\s+/g, "-")}-${index}`}
          className="text-esperanto-verda font-semibold"
        >
          {part}
        </span>
      );
    }
  });
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function AnimatedSection({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [_scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen font-serif">
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');
        body { font-family: 'DM Sans', sans-serif; }
        .font-display { font-family: 'Playfair Display', serif; }
        .star-pattern {
          background-image: radial-gradient(circle, rgba(0,153,0,0.08) 1px, transparent 1px);
          background-size: 32px 32px;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fadeUp 0.9s ease forwards; }
        .animate-fade-up-2 { animation: fadeUp 0.9s 0.2s ease forwards; opacity: 0; }
        .animate-fade-up-3 { animation: fadeUp 0.9s 0.4s ease forwards; opacity: 0; }
        .animate-fade-up-4 { animation: fadeUp 0.9s 0.6s ease forwards; opacity: 0; }
      `}</style>

      <Topbar />

      {/* HERO */}
      <section className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden star-pattern">
        {/* Green glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-esperanto-verda/10 blur-[120px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 sm:px-10 py-24 sm:py-32">
          {/* Eyebrow */}
          <div className="animate-fade-up flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-esperanto-verda" />
            <span className="text-esperanto-verda text-xs tracking-[0.3em] uppercase font-sans font-medium">
              La unua esperantista komunumo
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display animate-fade-up-2 text-5xl sm:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight mb-8">
            <span className="block text-white">Unu lingvo.</span>
            <span className="block text-white">Unu komunumo.</span>
            <span className="block italic text-esperanto-verda">
              Unu estonteco.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-up-3 font-sans text-gray-400 text-base sm:text-lg max-w-xl leading-relaxed mb-12">
            Ni konstruas la unuan esperantistan komunumon de la mondo,
            komencante per la fonda komunumo en Viĉado. Kiel partoprenanto, vi
            povos kunlabori en iu ajn komunumo de nia tutmonda reto.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up-4 flex flex-col sm:flex-row gap-4">
            <Link
              href="#igu"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-esperanto-verda text-white font-sans font-semibold text-sm tracking-wide rounded-lg hover:bg-esperanto-verda/80 transition-all duration-200 shadow-lg shadow-esperanto-verda/25"
            >
              Sekva paŝo
              <span className="text-lg">→</span>
            </Link>

            <Link
              href="#manifesto"
              className="inline-flex items-center justify-center px-8 py-4 border border-white/20 text-white font-sans font-medium text-sm tracking-wide rounded-lg hover:border-white/50 hover:bg-white/5 transition-all duration-200"
            >
              Legi la manifeston
            </Link>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
      </section>

      {/* STATS */}
      <section className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 py-16 grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-0 sm:divide-x sm:divide-white/10">
          {STATS.map((stat, i) => (
            <AnimatedSection key={stat.label} delay={i * 100}>
              <div className="sm:px-10 pl-0 last:pr-0 text-center sm:text-left">
                <div className="font-display text-3xl sm:text-4xl font-bold text-esperanto-verda mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm font-sans">
                  {stat.label}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* MANIFESTO */}
      <section
        id="manifesto"
        className="max-w-5xl mx-auto px-6 sm:px-10 py-24 sm:py-32"
      >
        <AnimatedSection>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-esperanto-verda" />
            <span className="text-esperanto-verda text-xs tracking-[0.3em] uppercase font-sans font-medium">
              Manifesto
            </span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            {MANIFESTO_CONTENT.title}
          </h2>
          <p className="text-esperanto-verda text-lg font-display font-medium mb-2">
            {MANIFESTO_CONTENT.subtitle}
          </p>
          <p className="text-gray-400 text-sm font-sans mb-16">
            {MANIFESTO_CONTENT.tagline}
          </p>
        </AnimatedSection>

        <div className="space-y-12">
          {MANIFESTO_CONTENT.sections.map((section, i) => (
            <AnimatedSection key={section.number} delay={i * 150}>
              <div className="group relative">
                {/* Section header with gradient background */}
                <div className="absolute inset-0 bg-linear-to-r from-esperanto-verda/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative bg-white/2 backdrop-blur-sm border border-white/10 rounded-2xl p-8 sm:p-10 hover:border-esperanto-verda/20 transition-all duration-300">
                  <div className="flex items-start gap-6 mb-8">
                    <div className="font-display text-4xl sm:text-5xl font-black text-esperanto-verda/20 group-hover:text-esperanto-verda/40 transition-colors duration-500 leading-none shrink-0">
                      {section.number}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight mb-3">
                        {section.title}
                      </h3>
                    </div>
                  </div>

                  <div className="text-gray-300 font-sans text-base sm:text-lg leading-relaxed space-y-4">
                    {section.content.split("\n\n").map((paragraph) => (
                      <div
                        key={`paragraph-${paragraph.slice(0, 20).replace(/\s+/g, "-")}-${section.number}`}
                        className="mb-4"
                      >
                        {paragraph.split("\n").map((line) => {
                          if (
                            line.trim().startsWith("1.") ||
                            line.trim().startsWith("2.") ||
                            line.trim().startsWith("3.") ||
                            line.trim().startsWith("4.")
                          ) {
                            return (
                              <div
                                key={`numbered-${line.slice(0, 20).replace(/\s+/g, "-")}-${section.number}`}
                                className="mb-3"
                              >
                                {renderTextWithBold(line)}
                              </div>
                            );
                          } else if (line.trim().startsWith("-")) {
                            return (
                              <div
                                key={`bullet-${line.slice(0, 20).replace(/\s+/g, "-")}-${section.number}`}
                                className="mb-2 flex items-start gap-2"
                              >
                                <span className="text-esperanto-verda mt-1">
                                  •
                                </span>
                                <span className="flex-1">
                                  {renderTextWithBold(line.trim().substring(1))}
                                </span>
                              </div>
                            );
                          } else if (line.trim() === "") {
                            return null;
                          } else {
                            return (
                              <p
                                key={`line-${line.slice(0, 20).replace(/\s+/g, "-")}-${section.number}`}
                                className="mb-2"
                              >
                                {renderTextWithBold(line)}
                              </p>
                            );
                          }
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* NIA POZICIO */}
      <section
        id="pozicio"
        className="max-w-5xl mx-auto px-6 sm:px-10 py-24 sm:py-32"
      >
        <AnimatedSection>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-esperanto-verda" />
            <span className="text-esperanto-verda text-xs tracking-[0.3em] uppercase font-sans font-medium">
              Nia pozicio
            </span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-16 leading-tight">
            Ni ne estas utopistoj.
            <br />
            <span className="text-esperanto-verda">Ni estas inĝenieroj.</span>
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-6">
                Zamenhof kiel modelo
              </h3>

              <p className="text-gray-400 font-sans text-base sm:text-lg leading-relaxed mb-6">
                En siaj lastaj jaroj, Zamenhof ne plu parolis nur pri lingvo,
                sed pri
                <span className="text-esperanto-verda font-semibold">
                  {" "}
                  homaranismo
                </span>
                : la ideo ke la vera problemo de la homaro ne estas manko de
                komunikilo, sed la maniero kiel homoj dividiĝas en apartajn
                tribojn nomatajn nacioj.
              </p>

              <p className="text-gray-400 font-sans text-base sm:text-lg leading-relaxed mb-6">
                En siaj privataj leteroj, li esprimis zorgon ke internacia
                lingvo, se ĝi restas nur ilo por kongresoj kaj korespondado,
                riskas fariĝi intelekta rondo anstataŭ vivanta realo. Por li, la
                lingvo devis esti
                <span className="text-esperanto-verda font-semibold">
                  {" "}
                  vivata ĉiutage{" "}
                </span>
                inter homoj de malsamaj devenoj.
              </p>

              <p className="text-gray-400 font-sans text-base sm:text-lg leading-relaxed mb-6">
                Lia revo ne estis nur komuniki sen limoj, sed ke homoj efektive
                <span className="text-esperanto-verda font-semibold">
                  {" "}
                  kunvivu sen limoj
                </span>
                . Ke ili loĝu, laboru kaj konstruu komune, tiel ke la lingvo
                fariĝu natura parto de la ĉiutaga vivo.
              </p>

              <p className="text-gray-400 font-sans text-base sm:text-lg leading-relaxed">
                Esperantistujo ne estas nova ideo. Ĝi estas provo realigi tiun
                neplenumitan parton de la vizio de Zamenhof: krei lokojn kie
                Esperanto ne estas nur parolata, sed vivata.
              </p>
            </div>
            <div className="relative">
              <Image
                src="/src/zamenhoff_flago.svg"
                alt="Zamenhof kiel idealisto"
                width={500}
                height={500}
                className="w-full h-auto rounded-2xl"
              />
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* CTA FINAL */}
      <section
        id="igu"
        className="relative overflow-hidden border-t border-white/10"
      >
        <div className="absolute inset-0 star-pattern opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-esperanto-verda/8 blur-[100px]" />
        <div className="relative max-w-3xl mx-auto px-6 sm:px-10 py-28 sm:py-36 text-center">
          <AnimatedSection>
            <p className="text-esperanto-verda text-xs tracking-[0.3em] uppercase font-sans font-medium mb-6">
              Fariĝu partoprenanto
            </p>
            <h2 className="font-display text-4xl sm:text-6xl font-black text-white leading-tight mb-8">
              Iĝu partoprenanto
              <br />
              <span className="italic text-esperanto-verda">nun.</span>
            </h2>
            <p className="text-gray-400 font-sans text-base sm:text-lg mb-12 max-w-xl mx-auto leading-relaxed">
              Registriĝu kiel partoprenanto de la unua esperantista komunumo de
              la mondo. Komencu en la fonda komunumo en Viĉado, Kolombio, kaj
              kunlaboru en iu ajn komunumo de nia tutmonda reto kiam ni kreskos.
              La projekto esperas financigi vian vojaĝon kaj loĝadon en ĉi tiu
              pionira urbo.
            </p>
            <Link
              href="/registri"
              className="inline-flex items-center gap-2 px-10 py-4 bg-esperanto-verda text-white font-sans font-semibold text-sm tracking-wide rounded-lg hover:bg-esperanto-verda/80 transition-all duration-200 shadow-xl shadow-esperanto-verda/20"
            >
              Registriĝi kiel partoprenanto
              <span className="text-lg">→</span>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-6 sm:px-10 py-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-display font-bold text-white/60 text-sm">
            Esperantistujo
          </span>
          <span className="text-white/30 text-xs font-sans">
            © {new Date().getFullYear()} — Konstruita kun 💚 en Esperanto
          </span>
          <div className="flex gap-6">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-white/40 hover:text-white text-xs font-sans transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
