"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import { supabaseBrowser } from "@/lib/supabase-browser";

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    supabaseBrowser.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace(redirectTo);
      }
    });
  }, [redirectTo, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      const { data, error: authError } =
        mode === "login"
          ? await supabaseBrowser.auth.signInWithPassword({
              email: email.trim(),
              password,
            })
          : await supabaseBrowser.auth.signUp({
              email: email.trim(),
              password,
              options: {
                data: {
                  name: name.trim(),
                  about: about.trim(),
                },
              },
            });

      if (authError) {
        throw authError;
      }

      if (data.session) {
        router.replace(redirectTo);
        router.refresh();
        return;
      }

      setMessage("Account created. Please confirm your email, then login.");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Authentication failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative z-10 w-full max-w-md rounded-[2rem] border border-sage/30 bg-white/75 p-5 shadow-glow backdrop-blur-sm sm:p-7">
      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-green-dk">
        Secure access
      </p>
      <h1 className="mt-4 font-display text-[34px] tracking-[-0.03em] text-ink">
        {mode === "login" ? "Login to Biz Coach" : "Create your account"}
      </h1>
      <p className="mt-2 text-[14px] leading-6 text-ink-lt">
        Save your Company Brain sessions with Supabase auth before starting the coaching flow.
      </p>

      <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
        {mode === "signup" ? (
          <>
            <div>
              <label className="block text-[12px] font-medium text-ink" htmlFor="name">
                Name
              </label>
              <input
                autoComplete="name"
                className="mt-2 min-h-12 w-full rounded-2xl border border-sage/30 bg-[#f7f4ee]/70 px-4 text-[14px] text-ink outline-none placeholder:text-ink-lt focus:border-teal/40 focus:ring-2 focus:ring-teal/15"
                id="name"
                onChange={(event) => setName(event.target.value)}
                placeholder="Shivam Soni"
                required
                type="text"
                value={name}
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-ink" htmlFor="about">
                About
              </label>
              <textarea
                className="mt-2 min-h-24 w-full resize-none rounded-2xl border border-sage/30 bg-[#f7f4ee]/70 px-4 py-3 text-[14px] text-ink outline-none placeholder:text-ink-lt focus:border-teal/40 focus:ring-2 focus:ring-teal/15"
                id="about"
                onChange={(event) => setAbout(event.target.value)}
                placeholder="Tell us what you do, your role, or your company context."
                required
                value={about}
              />
            </div>
          </>
        ) : null}

        <div>
          <label className="block text-[12px] font-medium text-ink" htmlFor="email">
            Email
          </label>
          <input
            autoComplete="email"
            className="mt-2 min-h-12 w-full rounded-2xl border border-sage/30 bg-[#f7f4ee]/70 px-4 text-[14px] text-ink outline-none placeholder:text-ink-lt focus:border-teal/40 focus:ring-2 focus:ring-teal/15"
            id="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            required
            type="email"
            value={email}
          />
        </div>

        <div>
          <label className="block text-[12px] font-medium text-ink" htmlFor="password">
            Password
          </label>
          <input
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            className="mt-2 min-h-12 w-full rounded-2xl border border-sage/30 bg-[#f7f4ee]/70 px-4 text-[14px] text-ink outline-none placeholder:text-ink-lt focus:border-teal/40 focus:ring-2 focus:ring-teal/15"
            id="password"
            minLength={6}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Minimum 6 characters"
            required
            type="password"
            value={password}
          />
        </div>

        {error ? (
          <div className="rounded-2xl border border-coral/25 bg-coral-pale p-3 text-[12px] leading-5 text-ink">
            {error}
          </div>
        ) : null}

        {message ? (
          <div className="rounded-2xl border border-teal/25 bg-teal-pale p-3 text-[12px] leading-5 text-green-dk">
            {message}
          </div>
        ) : null}

        <button
          className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-ink px-5 text-[14px] font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting
            ? "Please wait..."
            : mode === "login"
              ? "Login and continue"
              : "Create account"}
        </button>
      </form>

      <button
        className="mt-5 w-full text-center text-[13px] text-ink-lt underline underline-offset-4 transition-colors hover:text-green-dk"
        onClick={() => {
          setMode((current) => (current === "login" ? "signup" : "login"));
          setError(null);
          setMessage(null);
        }}
        type="button"
      >
        {mode === "login"
          ? "New here? Create an account"
          : "Already have an account? Login"}
      </button>
    </div>
  );
}
