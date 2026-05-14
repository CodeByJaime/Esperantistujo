"use client";
import { useEffect, useState, useMemo } from "react";
import { AuthLayout } from "@/components/auth-layout";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";

// ─── Constants (translated where possible) ──────────────────────────────────

const STATUS_LABEL: Record<string, { key: string; cls: string }> = {
  active: {
    key: "active",
    cls: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  },
  review: {
    key: "review",
    cls: "text-amber-400  bg-amber-400/10  border-amber-400/20",
  },
  paused: {
    key: "paused",
    cls: "text-white/30   bg-white/5       border-white/10",
  },
};

const DOT_COLOR: Record<string, string> = {
  verda: "bg-emerald-400",
  blue: "bg-blue-400",
  amber: "bg-amber-400",
  rose: "bg-rose-400",
};

const ACCENT: Record<string, string> = {
  verda: "text-emerald-400",
  blue: "text-blue-400",
  amber: "text-amber-400",
  rose: "text-rose-400",
};

const BORDER_HOVER: Record<string, string> = {
  verda: "hover:border-emerald-400/40",
  blue: "hover:border-blue-400/40",
  amber: "hover:border-amber-400/40",
  rose: "hover:border-rose-400/40",
};

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatValue(v: number, prefix?: string) {
  if (v >= 1_000_000) return `${prefix ?? ""}${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${prefix ?? ""}${(v / 1_000).toFixed(1)}k`;
  return `${prefix ?? ""}${v}`;
}

// Minimal SVG sparkline
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const W = 80,
    H = 28;
  const pts =
    data.length > 1
      ? data
          .map((v, i) => {
            const x = (i / (data.length - 1)) * W;
            const y = H - ((v - min) / (max - min || 1)) * H;
            return `${x},${y}`;
          })
          .join(" ")
      : `0,${H} ${W},${H}`;

  const strokeColor =
    color === "verda"
      ? "#00cc00"
      : color === "blue"
        ? "#60a5fa"
        : color === "amber"
          ? "#fbbf24"
          : "#fb7185";
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      fill="none"
      aria-hidden="true"
      role="img"
      aria-label="Sparkline chart"
    >
      <polyline
        points={pts}
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.8"
      />
      <polyline
        points={`0,${H} ${pts} ${W},${H}`}
        fill={`${strokeColor}18`}
        stroke="none"
      />
    </svg>
  );
}

// Animated counter hook
function useCount(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    if (target === 0) {
      setCount(0);
      return;
    }
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

// ─── Components ────────────────────────────────────────────────────────────

function StatCard({
  stat,
  sparklineData,
}: {
  stat: any;
  sparklineData: number[];
}) {
  const animated = useCount(stat.value);
  return (
    <div
      className={`group relative bg-linear-to-br from-white/4 to-white/1 border border-white/8 rounded-2xl p-6 transition-all duration-300 ${BORDER_HOVER[stat.color]} overflow-hidden`}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{
          background: `radial-gradient(circle at 0% 0%, ${stat.color === "verda" ? "#00cc0008" : stat.color === "blue" ? "#60a5fa08" : stat.color === "amber" ? "#fbbf2408" : "#fb718508"} 0%, transparent 70%)`,
        }}
      />

      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-sans-dm text-white/40 text-xs tracking-widest uppercase mb-1">
            {stat.sublabel}
          </p>
          <p className="font-sans-dm text-white font-medium text-sm">
            {stat.label}
          </p>
        </div>
        <span
          className={`font-mono text-xl ${ACCENT[stat.color]} opacity-60 group-hover:opacity-100 transition-opacity`}
        >
          {stat.icon}
        </span>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div
            className={`font-display text-4xl font-black ${ACCENT[stat.color]} leading-none`}
          >
            {formatValue(animated, stat.prefix)}
          </div>
          <div
            className={`font-sans-dm text-xs mt-2 ${stat.deltaPositive ? "text-emerald-400/70" : "text-rose-400/70"}`}
          >
            ↑ {stat.delta}
          </div>
        </div>
        <div className="opacity-60 group-hover:opacity-100 transition-opacity">
          <Sparkline data={sparklineData} color={stat.color} />
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { t, formatDate } = useTranslation();

  const [data, setData] = useState<{
    userCount: number;
    postCount: number;
    voteCount: number;
    recentProjects: any[];
    activity: any[];
    userGrowth: number[];
  }>({
    userCount: 0,
    postCount: 0,
    voteCount: 0,
    recentProjects: [],
    activity: [],
    userGrowth: [0, 0, 0, 0, 0, 0, 0],
  });

  const [loading, setLoading] = useState(true);

  const now = formatDate(new Date(), {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);

        // 1. Fetch User Count
        const { count: userCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        // 2. Fetch Post Count
        const { count: postCount } = await supabase
          .from("posts")
          .select("*", { count: "exact", head: true });

        // 3. Fetch Vote Count
        const { count: voteCount } = await supabase
          .from("votes")
          .select("*", { count: "exact", head: true });

        // 4. Fetch Recent Projects (Posts of type 'project' or just latest)
        const { data: recentPosts } = await supabase
          .from("posts")
          .select("title, type, created_at, vote_count")
          .order("created_at", { ascending: false })
          .limit(5);

        // 5. Fetch Activity (Latest posts and profiles)
        const { data: latestPosts } = await supabase
          .from("posts")
          .select("title, created_at")
          .order("created_at", { ascending: false })
          .limit(3);

        const { data: latestProfiles } = await supabase
          .from("profiles")
          .select("display_name, created_at")
          .order("created_at", { ascending: false })
          .limit(2);

        // Combine activity
        const combinedActivity = [
          ...(latestPosts?.map((p) => ({
            type: "post",
            text: `${t("posts.create.new")}: ${p.title}`,
            time: p.created_at,
            dot: "blue",
          })) || []),
          ...(latestProfiles?.map((p) => ({
            type: "user",
            text: `${t("register.success.title").replace("{name}", p.display_name || t("ui.anonymous"))}`,
            time: p.created_at,
            dot: "verda",
          })) || []),
        ].sort(
          (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
        );

        // Simple mock growth data for now based on actual count
        const growth = [
          Math.floor(userCount! * 0.7),
          Math.floor(userCount! * 0.75),
          Math.floor(userCount! * 0.82),
          Math.floor(userCount! * 0.88),
          Math.floor(userCount! * 0.92),
          Math.floor(userCount! * 0.96),
          userCount || 0,
        ];

        setData({
          userCount: userCount || 0,
          postCount: postCount || 0,
          voteCount: voteCount || 0,
          recentProjects:
            recentPosts?.map((p) => ({
              name: p.title,
              status: "active", // Default since we don't have status in DB
              progress: Math.min(Math.floor((p.vote_count || 0) * 10), 100), // Mock progress
              team: Math.floor(Math.random() * 10) + 1, // Mock team size
            })) || [],
          activity: combinedActivity,
          userGrowth: growth,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading && user) {
      fetchDashboardData();
    }
  }, [authLoading, user, t]);

  const STATS = useMemo(
    () => [
      {
        id: "projects",
        label: t("dashboard.stats.projects"),
        sublabel: t("dashboard.stats.projectsSub"),
        value: data.postCount,
        delta: "+2",
        deltaPositive: true,
        icon: "⬡",
        color: "verda",
      },
      {
        id: "donors",
        label: t("dashboard.stats.donors"),
        sublabel: t("dashboard.stats.donorsSub"),
        value: data.voteCount,
        delta: "+5",
        deltaPositive: true,
        icon: "◈",
        color: "blue",
      },
      {
        id: "users",
        label: t("dashboard.stats.users"),
        sublabel: t("dashboard.stats.usersSub"),
        value: data.userCount,
        delta: "+12%",
        deltaPositive: true,
        icon: "◎",
        color: "amber",
      },
      {
        id: "funded",
        label: t("dashboard.stats.funded"),
        sublabel: t("dashboard.stats.fundedSub"),
        value: data.voteCount * 50, // Mocking value from votes
        prefix: "$",
        delta: "15%",
        deltaPositive: true,
        icon: "◆",
        color: "rose",
      },
    ],
    [data, t],
  );

  const timeAgo = (dateStr: string) => {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(dateStr).getTime()) / 1000,
    );
    let unit = "";
    let val = 0;

    if (seconds < 60) {
      val = seconds;
      unit = t("common.time.s");
    } else if (seconds < 3600) {
      val = Math.floor(seconds / 60);
      unit = t("common.time.m");
    } else if (seconds < 86400) {
      val = Math.floor(seconds / 3600);
      unit = t("common.time.h");
    } else {
      return formatDate(new Date(dateStr));
    }

    return t("common.time.ago").replace("{time}", `${val}${unit}`);
  };

  if (authLoading || (loading && !data.userCount)) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <svg
            className="w-5 h-5 text-emerald-400 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <title>{t("common.loading")}</title>
            <path strokeLinecap="round" d="M12 2a10 10 0 0 1 10 10" />
          </svg>
          <span className="font-sans-dm text-white/50 text-sm">
            {t("common.loading")}
          </span>
        </div>
      </div>
    );
  }

  return (
    <AuthLayout user={user}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
        .font-display  { font-family: 'Playfair Display', serif; }
        .font-sans-dm  { font-family: 'DM Sans', sans-serif; }
        .font-mono     { font-family: 'DM Mono', monospace; }
        .grid-bg {
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fade-up   { animation: fadeUp 0.6s ease forwards; }
        .fade-up-2 { animation: fadeUp 0.6s 0.1s ease forwards; opacity:0; }
        .fade-up-3 { animation: fadeUp 0.6s 0.2s ease forwards; opacity:0; }
        .fade-up-4 { animation: fadeUp 0.6s 0.3s ease forwards; opacity:0; }
      `}</style>

      <div className="min-h-screen bg-[#0a0a0a] grid-bg">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12 space-y-10">
          {/* ── Header ─────────────────────────────────────────────────────── */}
          <div className="fade-up flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/8 pb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-sans-dm text-emerald-400/70 text-xs tracking-widest uppercase">
                  {t("dashboard.activePanel")}
                </span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-black text-white leading-tight">
                {t("dashboard.title")}
              </h1>
              <p className="font-sans-dm text-white/30 text-sm mt-1">{now}</p>
            </div>
          </div>

          {/* ── KPI Cards ──────────────────────────────────────────────────── */}
          <div className="fade-up-2 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((stat) => (
              <StatCard
                key={stat.id}
                stat={stat}
                sparklineData={
                  stat.id === "users"
                    ? data.userGrowth
                    : [10, 15, 12, 18, 20, 22, stat.value]
                }
              />
            ))}
          </div>

          {/* ── Main content row ───────────────────────────────────────────── */}
          <div className="fade-up-3 grid lg:grid-cols-3 gap-6">
            {/* Projects table – takes 2 cols */}
            <div className="lg:col-span-2 bg-linear-to-br from-white/3 to-white/1 border border-white/8 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
                <div>
                  <h2 className="font-display text-lg font-bold text-white">
                    {t("dashboard.recentProjects.title")}
                  </h2>
                  <p className="font-sans-dm text-white/30 text-xs mt-0.5">
                    {t("dashboard.recentProjects.subtitle")}
                  </p>
                </div>
                <span className="font-sans-dm text-white/30 text-xs hover:text-white/60 cursor-pointer transition-colors">
                  {t("dashboard.recentProjects.viewAll")} →
                </span>
              </div>

              <div className="divide-y divide-white/5">
                {data.recentProjects.length > 0 ? (
                  data.recentProjects.map((proj) => (
                    <div
                      key={proj.name}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-white/2 transition-colors group"
                    >
                      <div className="relative w-9 h-9 shrink-0">
                        <svg
                          className="w-9 h-9 -rotate-90"
                          viewBox="0 0 36 36"
                          aria-hidden="true"
                        >
                          <circle
                            cx="18"
                            cy="18"
                            r="14"
                            fill="none"
                            stroke="rgba(255,255,255,0.06)"
                            strokeWidth="3"
                          />
                          <circle
                            cx="18"
                            cy="18"
                            r="14"
                            fill="none"
                            stroke={
                              proj.status === "active"
                                ? "#34d399"
                                : proj.status === "review"
                                  ? "#fbbf24"
                                  : "#ffffff30"
                            }
                            strokeWidth="3"
                            strokeDasharray={`${(proj.progress / 100) * 87.96} 87.96`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center font-mono text-[9px] text-white/50">
                          {proj.progress}%
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-sans-dm text-white/80 text-sm font-medium group-hover:text-white transition-colors truncate">
                          {proj.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1 rounded-full bg-white/6 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{
                                width: `${proj.progress}%`,
                                background:
                                  proj.status === "active"
                                    ? "#34d399"
                                    : proj.status === "review"
                                      ? "#fbbf24"
                                      : "#ffffff30",
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-sans-dm text-white/30 text-xs">
                          {proj.team} {t("dashboard.recentProjects.members")}
                        </span>
                        <span
                          className={`font-sans-dm text-xs px-2 py-0.5 rounded-full border ${STATUS_LABEL[proj.status].cls}`}
                        >
                          {t(`dashboard.recentProjects.status.${proj.status}`)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-10 text-center text-white/20 font-sans-dm text-sm">
                    {t("posts.empty.global")}
                  </div>
                )}
              </div>
            </div>

            {/* Activity feed */}
            <div className="bg-linear-to-br from-white/3 to-white/1 border border-white/8 rounded-2xl overflow-hidden flex flex-col">
              <div className="px-6 py-5 border-b border-white/8">
                <h2 className="font-display text-lg font-bold text-white">
                  {t("dashboard.activity.title")}
                </h2>
                <p className="font-sans-dm text-white/30 text-xs mt-0.5">
                  {t("dashboard.activity.subtitle")}
                </p>
              </div>
              <div className="flex-1 divide-y divide-white/5">
                {data.activity.length > 0 ? (
                  data.activity.map((item, i) => (
                    <div
                      key={`activity-${i}`}
                      className="flex items-start gap-3 px-6 py-4 hover:bg-white/2 transition-colors"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${DOT_COLOR[item.dot]}`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-sans-dm text-white/70 text-sm leading-snug">
                          {item.text}
                        </p>
                        <p className="font-mono text-white/25 text-xs mt-1">
                          {timeAgo(item.time)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-10 text-center text-white/20 font-sans-dm text-sm">
                    {t("comments.empty")}
                  </div>
                )}
              </div>
              <div className="px-6 py-4 border-t border-white/8">
                <button
                  type="button"
                  className="w-full font-sans-dm text-xs text-white/30 hover:text-white/60 transition-colors"
                >
                  {t("dashboard.activity.viewHistory")} →
                </button>
              </div>
            </div>
          </div>

          {/* ── Secondary row: donor breakdown + quick actions ─────────────── */}
          <div className="fade-up-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 hidden">
            {/* Donor tiers */}
            <div className="bg-linear-to-br from-white/3 to-white/1 border border-white/8 rounded-2xl p-6">
              <h2 className="font-display text-lg font-bold text-white mb-1">
                {t("dashboard.donors.title")}
              </h2>
              <p className="font-sans-dm text-white/30 text-xs mb-6">
                {t("dashboard.donors.subtitle")}
              </p>
              {[
                {
                  label: t("dashboard.donors.tiers.platinum"),
                  pct: 8,
                  n: Math.floor(data.voteCount * 0.08),
                  color: "#e2e8f0",
                },
                {
                  label: t("dashboard.donors.tiers.gold"),
                  pct: 22,
                  n: Math.floor(data.voteCount * 0.22),
                  color: "#fbbf24",
                },
                {
                  label: t("dashboard.donors.tiers.silver"),
                  pct: 35,
                  n: Math.floor(data.voteCount * 0.35),
                  color: "#94a3b8",
                },
                {
                  label: t("dashboard.donors.tiers.bronze"),
                  pct: 35,
                  n: Math.floor(data.voteCount * 0.35),
                  color: "#fb923c",
                },
              ].map((tier) => (
                <div key={tier.label} className="mb-4 last:mb-0">
                  <div className="flex justify-between font-sans-dm text-xs mb-1.5">
                    <span className="text-white/60">{tier.label}</span>
                    <span className="text-white/30">
                      {tier.n} · {tier.pct}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/6 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${tier.pct}%`,
                        background: tier.color,
                        opacity: 0.7,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* User growth mini chart */}
            <div className="bg-linear-to-br from-white/3 to-white/1 border border-white/8 rounded-2xl p-6">
              <h2 className="font-display text-lg font-bold text-white mb-1">
                {t("dashboard.users.title")}
              </h2>
              <p className="font-sans-dm text-white/30 text-xs mb-4">
                {t("dashboard.users.subtitle")}
              </p>
              <div className="flex items-end gap-1.5 h-20">
                {data.userGrowth.map((v, i) => {
                  const min = Math.min(...data.userGrowth);
                  const max = Math.max(...data.userGrowth);
                  const h = max === min ? 50 : ((v - min) / (max - min)) * 100;
                  return (
                    <div
                      key={`sparkline-user-${i}`}
                      className="flex-1 flex flex-col justify-end group/bar"
                    >
                      <div
                        className="rounded-t w-full transition-all duration-300 group-hover/bar:opacity-100 opacity-60"
                        style={{
                          height: `${Math.max(h, 8)}%`,
                          background: i === 6 ? "#60a5fa" : "#60a5fa50",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between font-mono text-white/20 text-[10px] mt-2">
                <span>W1</span>
                <span>W7</span>
              </div>
              <div className="mt-4 pt-4 border-t border-white/8 flex justify-between">
                <span className="font-sans-dm text-white/40 text-xs">
                  {t("dashboard.users.growth")}
                </span>
                <span className="font-sans-dm text-blue-400 text-xs font-medium">
                  +12% ↑
                </span>
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-linear-to-br from-white/3 to-white/1 border border-white/8 rounded-2xl p-6 flex flex-col">
              <h2 className="font-display text-lg font-bold text-white mb-1">
                {t("dashboard.quickActions.title")}
              </h2>
              <p className="font-sans-dm text-white/30 text-xs mb-6">
                {t("dashboard.quickActions.subtitle")}
              </p>
              <div className="flex-1 grid grid-cols-2 gap-3">
                {[
                  {
                    icon: "⬡",
                    label: t("dashboard.quickActions.newProject"),
                    color: "emerald",
                  },
                  {
                    icon: "◈",
                    label: t("dashboard.quickActions.addDonor"),
                    color: "blue",
                  },
                  {
                    icon: "◎",
                    label: t("dashboard.quickActions.inviteUser"),
                    color: "amber",
                  },
                  {
                    icon: "▣",
                    label: t("dashboard.quickActions.generateReport"),
                    color: "rose",
                  },
                ].map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    className={`group flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-white/3 border border-white/8 hover:border-${action.color}-400/30 hover:bg-${action.color}-400/5 transition-all duration-200 text-center`}
                  >
                    <span
                      className={`text-xl text-${action.color}-400/60 group-hover:text-${action.color}-400 transition-colors`}
                    >
                      {action.icon}
                    </span>
                    <span className="font-sans-dm text-white/40 group-hover:text-white/70 text-xs leading-tight transition-colors">
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
