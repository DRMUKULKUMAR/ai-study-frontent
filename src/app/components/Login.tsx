import { useMemo, useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { Sparkles, LockKeyhole, Mail, UserRound } from "lucide-react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Login() {
  const { status, loginUser, registerUser, authError, clearAuthError } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });
  const location = useLocation();
  const destination = useMemo(
    () => (location.state as { from?: { pathname?: string } } | undefined)?.from?.pathname ?? "/",
    [location.state],
  );

  if (status === "authenticated") {
    return <Navigate to={destination} replace />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    clearAuthError();
    setIsSubmitting(true);

    try {
      if (isRegisterMode) {
        await registerUser({
          name: form.name,
          email: form.email,
          password: form.password,
          passwordConfirmation: form.passwordConfirmation,
        });
      } else {
        await loginUser({
          email: form.email,
          password: form.password,
        });
      }
    } catch {
      // Error is exposed by auth context.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background px-4 py-8 lg:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(94,182,162,0.18),transparent_44%),radial-gradient(circle_at_85%_0%,rgba(28,65,90,0.22),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.05),transparent_60%)]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-3xl border border-white/25 bg-white/70 p-6 shadow-2xl backdrop-blur-xl lg:p-8"
        >
          <div className="mb-8 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-lg">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-[var(--font-display)] text-2xl font-semibold text-foreground">AI Study</h1>
              <p className="text-sm text-muted-foreground">Premium learning workspace</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegisterMode && (
              <label className="block">
                <span className="mb-1.5 block text-sm text-muted-foreground">Full name</span>
                <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-white px-3 py-2.5">
                  <UserRound className="h-4 w-4 text-muted-foreground" />
                  <input
                    required
                    value={form.name}
                    onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                    className="w-full bg-transparent text-sm text-foreground outline-none"
                    placeholder="John Doe"
                    autoComplete="name"
                  />
                </div>
              </label>
            )}

            <label className="block">
              <span className="mb-1.5 block text-sm text-muted-foreground">Email</span>
              <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-white px-3 py-2.5">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  className="w-full bg-transparent text-sm text-foreground outline-none"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm text-muted-foreground">Password</span>
              <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-white px-3 py-2.5">
                <LockKeyhole className="h-4 w-4 text-muted-foreground" />
                <input
                  required
                  minLength={8}
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                  className="w-full bg-transparent text-sm text-foreground outline-none"
                  placeholder="Minimum 8 characters"
                  autoComplete={isRegisterMode ? "new-password" : "current-password"}
                />
              </div>
            </label>

            {isRegisterMode && (
              <label className="block">
                <span className="mb-1.5 block text-sm text-muted-foreground">Confirm password</span>
                <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-white px-3 py-2.5">
                  <LockKeyhole className="h-4 w-4 text-muted-foreground" />
                  <input
                    required
                    minLength={8}
                    type="password"
                    value={form.passwordConfirmation}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        passwordConfirmation: event.target.value,
                      }))
                    }
                    className="w-full bg-transparent text-sm text-foreground outline-none"
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                  />
                </div>
              </label>
            )}

            {authError && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-lg transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Please wait..."
                : isRegisterMode
                  ? "Create account"
                  : "Sign in"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setIsRegisterMode((value) => !value)}
            className="mt-4 w-full rounded-xl border border-border/70 px-4 py-2.5 text-sm text-foreground transition hover:bg-muted/70"
          >
            {isRegisterMode ? "Already have an account? Sign in" : "New here? Create account"}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
