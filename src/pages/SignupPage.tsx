import { useAuthStore } from "@/hooks/useAuthStore";
import { apiClient } from "@/lib/apiClient";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

function FieldError({ msg }: { msg?: string }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.p
          key={msg}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden text-xs text-destructive-foreground"
        >
          {msg}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

export default function SignupPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, setToken } = useAuthStore();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/home" });
    }
  }, [isAuthenticated, navigate]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (username.trim().length < 3)
      errors.username = "Must be at least 3 characters.";
    else if (username.trim().length > 30)
      errors.username = "Must be 30 characters or fewer.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      errors.email = "Enter a valid email address.";
    if (password.length < 6) errors.password = "Must be at least 6 characters.";
    return errors;
  };

  const clearFieldError = (field: string) =>
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });

  const blurValidate = (field: string) => {
    const errors = validate();
    if (errors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: errors[field] }));
    } else {
      clearFieldError(field);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      triggerShake();
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.signup({
        username: username.trim(),
        email: email.trim(),
        password,
      });
      const tokenData = await apiClient.login({
        username: username.trim(),
        password,
      });
      setToken(tokenData.access_token, username.trim());
      setSuccess(true);
      setTimeout(() => navigate({ to: "/home" }), 1400);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.";
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
          <div className="skeleton h-80 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-40 -right-24 h-[520px] w-[520px] rounded-full blur-3xl opacity-20"
          style={{ background: "oklch(0.65 0.25 300)" }}
        />
        <div
          className="absolute -bottom-40 -left-24 h-[460px] w-[460px] rounded-full blur-3xl opacity-15"
          style={{ background: "oklch(0.75 0.18 55)" }}
        />
        <div
          className="absolute top-1/3 left-1/4 h-72 w-72 rounded-full blur-3xl opacity-10"
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
                "linear-gradient(135deg, oklch(0.65 0.25 300), oklch(0.7 0.2 0))",
            }}
          >
            <Sparkles className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            DocMind AI
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your intelligent document assistant
          </p>
        </motion.div>

        {/* Card with shake animation */}
        <motion.div
          animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-2xl"
        >
          {/* Success overlay */}
          <AnimatePresence>
            {success && (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 rounded-2xl bg-card/95 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
                >
                  <CheckCircle2
                    className="h-16 w-16"
                    style={{ color: "oklch(0.6 0.18 150)" }}
                  />
                </motion.div>
                <p className="font-display text-lg font-semibold text-foreground">
                  Account created!
                </p>
                <p className="text-sm text-muted-foreground">
                  Taking you to the dashboard…
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mb-6">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Create your account
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Start chatting with your documents today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Username */}
            <div className="space-y-1.5">
              <label
                htmlFor="signup-username"
                className="text-sm font-medium text-foreground"
              >
                Username
              </label>
              <input
                id="signup-username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  clearFieldError("username");
                }}
                onBlur={() => blurValidate("username")}
                placeholder="3–30 characters"
                autoComplete="username"
                data-ocid="signup-username"
                className={`w-full rounded-xl border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-smooth focus:outline-none focus:ring-2 focus:ring-primary/40 ${fieldErrors.username ? "border-destructive focus:border-destructive" : "border-input focus:border-primary"}`}
              />
              <FieldError msg={fieldErrors.username} />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="signup-email"
                className="text-sm font-medium text-foreground"
              >
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearFieldError("email");
                }}
                onBlur={() => blurValidate("email")}
                placeholder="you@example.com"
                autoComplete="email"
                data-ocid="signup-email"
                className={`w-full rounded-xl border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-smooth focus:outline-none focus:ring-2 focus:ring-primary/40 ${fieldErrors.email ? "border-destructive focus:border-destructive" : "border-input focus:border-primary"}`}
              />
              <FieldError msg={fieldErrors.email} />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="signup-password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearFieldError("password");
                  }}
                  onBlur={() => blurValidate("password")}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  data-ocid="signup-password"
                  className={`w-full rounded-xl border bg-background px-4 py-2.5 pr-11 text-sm text-foreground placeholder:text-muted-foreground transition-smooth focus:outline-none focus:ring-2 focus:ring-primary/40 ${fieldErrors.password ? "border-destructive focus:border-destructive" : "border-input focus:border-primary"}`}
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
              <FieldError msg={fieldErrors.password} />
            </div>

            {/* Global error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  key="signup-error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden rounded-lg border border-destructive/30 bg-destructive/15 px-3 py-2 text-sm text-destructive-foreground"
                  data-ocid="signup-error"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              data-ocid="signup-submit"
              className="w-full overflow-hidden rounded-xl py-2.5 font-display text-sm font-semibold text-primary-foreground transition-smooth hover:opacity-90 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.65 0.25 300) 0%, oklch(0.7 0.2 0) 100%)",
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Create Account
                </span>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary transition-smooth hover:text-primary/80"
              data-ocid="goto-login"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
