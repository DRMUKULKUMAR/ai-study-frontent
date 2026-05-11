import { useMemo, useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  BookOpenCheck,
  ChartNoAxesCombined,
  ClipboardList,
  LogOut,
  MessageSquare,
  Search,
  Sparkles,
  Bell,
  NotebookPen,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { getNotifications, saveNotifications } from "../lib/local-db";

export function Layout() {
  const location = useLocation();
  const { user, logoutUser } = useAuth();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [query, setQuery] = useState("");

  const navItems = useMemo(
    () => [
      { to: "/", icon: ChartNoAxesCombined, label: "Dashboard" },
      { to: "/chat", icon: MessageSquare, label: "AI Chat" },
      { to: "/quiz", icon: ClipboardList, label: "Smart Quiz" },
      { to: "/notes", icon: NotebookPen, label: "Notes" },
      { to: "/mistakes", icon: BookOpenCheck, label: "Progress" },
    ],
    [],
  );

  const notifications = useMemo(() => getNotifications().slice(0, 5), [isNotificationOpen]);
  const unreadCount = notifications.filter((item) => !item.read).length;

  const markNotificationsRead = () => {
    const next = getNotifications().map((item) => ({ ...item, read: true }));
    saveNotifications(next);
  };

  return (
    <div className="relative flex h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_12%,rgba(95,203,179,0.2),transparent_40%),radial-gradient(circle_at_85%_10%,rgba(34,95,122,0.2),transparent_36%),radial-gradient(circle_at_50%_90%,rgba(235,248,255,0.8),transparent_50%)]" />

      <aside className="relative z-10 hidden w-[280px] shrink-0 border-r border-white/20 bg-white/60 px-4 pb-5 pt-4 backdrop-blur-2xl lg:flex lg:flex-col">
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-white/30 bg-white/70 p-3 shadow-sm">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-lg">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="font-[var(--font-display)] text-xl font-semibold text-foreground">AI Study</p>
            <p className="text-xs text-muted-foreground">Premium workspace</p>
          </div>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-foreground/80 hover:bg-white/70"
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl border border-white/30 bg-white/75 p-3">
          <p className="truncate text-sm font-medium text-foreground">{user?.name ?? "Learner"}</p>
          <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          <button
            onClick={() => void logoutUser()}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-border/70 px-3 py-2 text-sm text-foreground transition hover:bg-muted/50"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <header className="border-b border-white/20 bg-white/55 px-4 py-3 backdrop-blur-xl lg:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="relative w-full max-w-xl">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search notes, quizzes, topics..."
                className="w-full rounded-xl border border-white/25 bg-white/75 py-2 pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-primary/40"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsNotificationOpen((value) => !value);
                  markNotificationsRead();
                }}
                className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/25 bg-white/75 transition hover:bg-white"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 text-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-accent" />
                )}
              </button>
              <div className="hidden rounded-xl border border-white/25 bg-white/75 px-3 py-2 text-right sm:block">
                <p className="max-w-[160px] truncate text-sm font-medium text-foreground">{user?.name}</p>
                <p className="max-w-[160px] truncate text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isNotificationOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-3 rounded-2xl border border-white/30 bg-white/85 p-3 shadow-xl"
              >
                <p className="mb-2 text-sm font-medium text-foreground">Notifications</p>
                <div className="space-y-2">
                  {notifications.length ? (
                    notifications.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-border/50 bg-white px-3 py-2"
                      >
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.body}</p>
                      </div>
                    ))
                  ) : (
                    <p className="rounded-xl border border-dashed border-border px-3 py-4 text-sm text-muted-foreground">
                      No notifications yet.
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        <main className="min-h-0 flex-1 overflow-auto pb-20 lg:pb-0">
          <Outlet />
        </main>

        <nav className="fixed inset-x-2 bottom-2 z-20 rounded-2xl border border-white/30 bg-white/80 p-1.5 shadow-2xl backdrop-blur-xl lg:hidden">
          <div className="grid grid-cols-5 gap-1">
            {navItems.map((item) => {
              const isActive = item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] transition ${
                    isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label.split(" ")[0]}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
