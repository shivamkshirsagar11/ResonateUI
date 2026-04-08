import { useAuthStore } from "@/hooks/useAuthStore";
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2, LogIn, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading: authLoading } = useAuthStore();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/home" });
    }
  }, [isAuthenticated, navigate]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Please fill in all fields.");
      triggerShake();
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      await login(username.trim(), password);
      navigate({ to: "/home" });
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Invalid credentials. Please try again.";
      setError(msg);
      triggerShake();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-4 w-80">
          <div className="skeleton h-10 w-40 rounded-lg mx-auto" />
          <div className="skeleton h-72 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-40 -left-24 h-[520px] w-[520px] rounded-full blur-3xl opacity-20"
          style={{ background: "oklch(0.65 0.25 300)" }}
        />
        <div
          className="absolute -bottom-40 -right-24 h-[460px] w-[460px] rounded-full blur-3xl opacity-15"
          style={{ background: "oklch(0.75 0.18 55)" }}
        />
        <div
          className="absolute top-1/2 right-1/3 h-72 w-72 -translate-y-1/2 rounded-full blur-3xl opacity-10"
          style={{ background: "oklch(0.6 0.18 150)" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Brand header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="mb-8 flex flex-col items-center"
        >
          <div
            className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.65 0.25 300), oklch(0.6 0.22 320))",
            }}
          >
            <Sparkles className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            DocMind AI
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Chat with your documents intelligently
          </p>
        </motion.div>

        {/* Card with shake animation */}
        <motion.div
          animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-border bg-card p-8 shadow-2xl"
        >
          <div className="mb-6">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Welcome back
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to access your documents
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Username */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-username"
                className="text-sm font-medium text-foreground"
              >
                Username
              </label>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setError("")}
                placeholder="your_username"
                autoComplete="username"
                data-ocid="login-username"
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-smooth focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setError("")}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  data-ocid="login-password"
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 pr-11 text-sm text-foreground placeholder:text-muted-foreground transition-smooth focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-smooth hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.p
                  key="login-error"
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 4 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="overflow-hidden rounded-lg border border-destructive/30 bg-destructive/15 px-3 py-2 text-sm text-destructive-foreground"
                  data-ocid="login-error"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Submit button with gradient */}
            <button
              type="submit"
              disabled={isSubmitting}
              data-ocid="login-submit"
              className="w-full overflow-hidden rounded-xl py-2.5 text-sm font-display font-semibold text-primary-foreground transition-smooth hover:opacity-90 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.65 0.25 300) 0%, oklch(0.6 0.22 320) 100%)",
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </span>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-5 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-primary transition-smooth hover:text-primary/80"
              data-ocid="goto-signup"
            >
              Create account
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
