import { useMemo } from "react";
import { motion } from "motion/react";
import { Brain, Bug, ChevronRight, Target, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAuth } from "../context/AuthContext";
import { useDashboardData } from "../hooks/use-dashboard-data";
import { Skeleton } from "./ui/skeleton";

function StatCard({
  icon: Icon,
  label,
  value,
  meta,
}: {
  icon: typeof Brain;
  label: string;
  value: string;
  meta: string;
}) {
  return (
    <div className="rounded-2xl border border-white/30 bg-white/70 p-4 shadow-lg backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/12 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <TrendingUp className="h-4 w-4 text-accent" />
      </div>
      <p className="text-2xl font-semibold text-foreground">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-xs text-accent">{meta}</p>
    </div>
  );
}

export function Dashboard() {
  const { user } = useAuth();
  const {
    isLoading,
    error,
    weakTopics,
    recentActivity,
    weeklySeries,
    stats,
  } = useDashboardData();

  const topicBarData = useMemo(
    () =>
      weakTopics.map((item) => ({
        topic: item.topic.split(" ")[0],
        accuracy: item.accuracy,
      })),
    [weakTopics],
  );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 p-4 lg:p-8">
        <Skeleton className="h-24 w-full rounded-3xl" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          <Skeleton className="h-80 rounded-2xl xl:col-span-2" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 lg:p-8">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-white/30 bg-white/70 p-5 shadow-2xl backdrop-blur-2xl lg:p-7"
      >
        <p className="text-sm text-muted-foreground">Welcome back</p>
        <h1 className="font-[var(--font-display)] text-3xl font-semibold text-foreground lg:text-5xl">
          {user?.name ?? "Learner"}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground lg:text-base">
          Your live learning dashboard now tracks real backend activity and adapts your focus plan in real time.
        </p>
      </motion.section>

      {error && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Brain} label="Topics tracked" value={`${stats.topicsTracked}`} meta="Live from backend" />
        <StatCard icon={Target} label="Practice attempts" value={`${stats.totalAttempts}`} meta="Across all topics" />
        <StatCard icon={TrendingUp} label="Mastery rate" value={`${stats.masteryRate}%`} meta="Accuracy trend" />
        <StatCard icon={Bug} label="Mistakes logged" value={`${stats.mistakesLogged}`} meta="Needs attention" />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-white/30 bg-white/70 p-5 shadow-xl backdrop-blur-xl xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-[var(--font-display)] text-2xl font-semibold text-foreground">Weekly Performance</h2>
              <p className="text-sm text-muted-foreground">Live accuracy vs mistake trend</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklySeries}>
                <defs>
                  <linearGradient id="dashboardAccuracy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2c5f5d" stopOpacity={0.36} />
                    <stop offset="95%" stopColor="#2c5f5d" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#7A7F87" fontSize={12} />
                <YAxis stroke="#7A7F87" fontSize={12} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#2c5f5d"
                  strokeWidth={2.5}
                  fill="url(#dashboardAccuracy)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-white/30 bg-white/70 p-5 shadow-xl backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-[var(--font-display)] text-xl font-semibold text-foreground">Weak Topics</h2>
            <Link to="/mistakes" className="text-xs text-primary">
              View all
            </Link>
          </div>
          {weakTopics.length ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topicBarData}>
                  <XAxis dataKey="topic" stroke="#7A7F87" fontSize={11} />
                  <YAxis stroke="#7A7F87" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="accuracy" fill="#8b9d83" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-border px-3 py-8 text-center text-sm text-muted-foreground">
              No weak-topic data yet. Finish a quiz or chat session to build insights.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-white/30 bg-white/70 p-5 shadow-xl backdrop-blur-xl">
        <h2 className="mb-3 font-[var(--font-display)] text-xl font-semibold text-foreground">Recent Activity</h2>
        <div className="space-y-2">
          {recentActivity.length ? (
            recentActivity.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-border/50 bg-white px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))
          ) : (
            <p className="rounded-xl border border-dashed border-border px-3 py-7 text-center text-sm text-muted-foreground">
              Activity will appear here as you use chat, notes, and quizzes.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

