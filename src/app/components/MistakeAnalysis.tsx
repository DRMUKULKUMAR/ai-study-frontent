import { useMemo } from "react";
import { motion } from "motion/react";
import { AlertCircle, ArrowUpRight, BookOpen, Target, TrendingDown, TrendingUp } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useDashboardData } from "../hooks/use-dashboard-data";
import { Skeleton } from "./ui/skeleton";

export function MistakeAnalysis() {
  const { isLoading, error, weakTopics, weeklySeries } = useDashboardData();

  const improving = useMemo(() => weakTopics.filter((topic) => topic.recentTrend === "improving").length, [weakTopics]);
  const declining = useMemo(() => weakTopics.filter((topic) => topic.recentTrend === "declining").length, [weakTopics]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 p-4 lg:p-8">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-72 w-full rounded-2xl" />
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-[var(--font-display)] text-3xl font-semibold text-foreground lg:text-5xl">
          Mistake Intelligence
        </h1>
        <p className="mt-2 text-sm text-muted-foreground lg:text-base">
          Live analysis powered by your backend mistake logs and topic performance.
        </p>
      </motion.div>

      {error && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/30 bg-white/70 p-4 shadow-xl backdrop-blur-xl">
          <p className="text-sm text-muted-foreground">Topics improving</p>
          <p className="mt-1 text-3xl font-semibold text-foreground">{improving}</p>
          <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2 py-0.5 text-xs text-secondary">
            <TrendingUp className="h-3 w-3" />
            Positive momentum
          </div>
        </div>
        <div className="rounded-2xl border border-white/30 bg-white/70 p-4 shadow-xl backdrop-blur-xl">
          <p className="text-sm text-muted-foreground">Topics declining</p>
          <p className="mt-1 text-3xl font-semibold text-foreground">{declining}</p>
          <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">
            <TrendingDown className="h-3 w-3" />
            Needs intervention
          </div>
        </div>
        <div className="rounded-2xl border border-white/30 bg-white/70 p-4 shadow-xl backdrop-blur-xl">
          <p className="text-sm text-muted-foreground">Tracked topics</p>
          <p className="mt-1 text-3xl font-semibold text-foreground">{weakTopics.length}</p>
          <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
            <Target className="h-3 w-3" />
            Personalized focus
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/30 bg-white/70 p-5 shadow-xl backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-[var(--font-display)] text-2xl font-semibold text-foreground">Weekly Mistake Trend</h2>
            <p className="text-sm text-muted-foreground">Real-time week-over-week stability</p>
          </div>
          <ArrowUpRight className="h-5 w-5 text-primary" />
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklySeries}>
              <defs>
                <linearGradient id="mistakeArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d4816a" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#d4816a" stopOpacity={0.06} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#7A7F87" />
              <YAxis stroke="#7A7F87" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="mistakes"
                stroke="#d4816a"
                strokeWidth={2.5}
                fill="url(#mistakeArea)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="space-y-3">
        {weakTopics.length ? (
          weakTopics.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/30 bg-white/70 p-5 shadow-xl backdrop-blur-xl"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-[var(--font-display)] text-xl font-semibold text-foreground">{item.topic}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.attempts} attempts | {item.mistakes} mistakes
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-semibold text-foreground">{item.accuracy}%</p>
                  <p className="text-xs text-muted-foreground">accuracy</p>
                </div>
              </div>
              <div className="mb-4 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-gradient-to-r from-secondary to-primary" style={{ width: `${item.accuracy}%` }} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border/60 bg-white px-3 py-2.5 text-sm text-muted-foreground">
                  <div className="mb-1 flex items-center gap-2 text-foreground">
                    <AlertCircle className="h-4 w-4 text-accent" />
                    Common pattern
                  </div>
                  Revisit timed practice for this topic and review step-by-step solutions.
                </div>
                <button className="flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90">
                  <BookOpen className="h-4 w-4" />
                  Start recovery practice
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-white/70 px-4 py-8 text-center text-sm text-muted-foreground">
            No mistake records found yet. Solve quizzes to generate personalized analytics.
          </div>
        )}
      </section>
    </div>
  );
}

