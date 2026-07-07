"use client";

import { useState } from "react";
import posthog from "posthog-js";

type Role = "farmer" | "buyer";

const ROLE_COPY: Record<
  Role,
  { emoji: string; title: string; blurb: string; cta: string; placeholder: string }
> = {
  farmer: {
    emoji: "🌾",
    title: "I'm a farmer",
    blurb: "Sell your harvest to neighbors nearby. We handle delivery and payments — you keep growing.",
    cta: "Onboard my farm",
    placeholder: "farm@email.com",
  },
  buyer: {
    emoji: "🧺",
    title: "I want to buy produce",
    blurb: "Fresh, local food delivered from farms in your area. Skip the grocery-store middleman.",
    cta: "Notify me at launch",
    placeholder: "you@email.com",
  },
};

export default function Home() {
  const [role, setRole] = useState<Role | null>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function selectRole(next: Role) {
    setRole(next);
    setSubmitted(false);
    setEmail("");
    posthog.capture("role_selected", { role: next });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!role || !email) return;
    posthog.identify(email, { email, role });
    posthog.capture("waitlist_signup", { role });
    setSubmitted(true);
  }

  function handleRoleSwitched(currentRole: Role) {
    const nextRole = currentRole === "farmer" ? "buyer" : "farmer";
    posthog.capture("role_switched", { from_role: currentRole, to_role: nextRole });
    selectRole(nextRole);
  }

  return (
    <main className="flex flex-1 flex-col">
      {/* Header */}
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span aria-hidden>🚜</span>
          <span>Frank&apos;s Food</span>
        </div>
        <span className="rounded-full border border-current/15 px-3 py-1 text-xs font-medium opacity-70">
          Coming soon
        </span>
      </header>

      {/* Hero */}
      <section className="mx-auto w-full max-w-3xl px-6 pt-10 text-center sm:pt-16">
        <p className="mb-4 inline-block rounded-full bg-emerald-600/10 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400">
          Local farms → your table
        </p>
        <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
          Fresh from local farms, delivered to your door.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-balance text-lg opacity-70">
          Frank&apos;s Food connects nearby farmers with people who want real,
          local produce. Tell us who you are and we&apos;ll get you set up.
        </p>
      </section>

      {/* Choice cards */}
      <section className="mx-auto mt-12 w-full max-w-3xl px-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {(Object.keys(ROLE_COPY) as Role[]).map((key) => {
            const copy = ROLE_COPY[key];
            const active = role === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => selectRole(key)}
                data-attr={`choose-${key}`}
                aria-pressed={active}
                className={`group flex flex-col items-start rounded-2xl border p-6 text-left transition
                  ${
                    active
                      ? "border-emerald-600 bg-emerald-600/5 shadow-sm"
                      : "border-current/10 hover:border-emerald-600/60 hover:bg-emerald-600/[0.03]"
                  }`}
              >
                <span className="text-4xl" aria-hidden>
                  {copy.emoji}
                </span>
                <span className="mt-4 text-xl font-semibold">{copy.title}</span>
                <span className="mt-2 text-sm opacity-70">{copy.blurb}</span>
                <span className="mt-4 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  {active ? "Selected — enter your email below ↓" : "Choose this →"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Email capture, revealed after a role is chosen */}
        {role && (
          <div className="mt-6 rounded-2xl border border-current/10 bg-current/[0.02] p-6">
            {submitted ? (
              <div className="text-center">
                <p className="text-lg font-semibold">You&apos;re on the list! 🎉</p>
                <p className="mt-1 text-sm opacity-70">
                  Thanks — we&apos;ll reach out to{" "}
                  {role === "farmer" ? "get your farm onboarded" : "let you know the moment we launch"}.
                </p>
                <button
                  type="button"
                  onClick={() => handleRoleSwitched(role)}
                  className="mt-4 text-sm font-medium text-emerald-700 underline underline-offset-4 dark:text-emerald-400"
                >
                  Actually, I&apos;m {role === "farmer" ? "a buyer" : "a farmer"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={ROLE_COPY[role].placeholder}
                  className="flex-1 rounded-xl border border-current/15 bg-background px-4 py-3 text-base outline-none focus:border-emerald-600"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
                >
                  {ROLE_COPY[role].cta}
                </button>
              </form>
            )}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="mx-auto mt-auto w-full max-w-5xl px-6 py-10 text-center text-sm opacity-50">
        © {new Date().getFullYear()} Frank&apos;s Food · A Pajak Enterprises project
      </footer>
    </main>
  );
}
