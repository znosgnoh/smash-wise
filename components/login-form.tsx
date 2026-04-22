"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import type { Member } from "@/lib/types";

interface LoginFormProps {
  members: Member[];
}

export function LoginForm({ members }: LoginFormProps): React.ReactElement {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!selectedId || pin.length !== 4) {
      setError("Select a member and enter a 4-digit PIN");
      return;
    }

    setPending(true);
    setError("");

    const result = await signIn("credentials", {
      memberId: selectedId,
      pin,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid PIN. Please try again.");
      setPending(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-sm"
    >
      <label className="text-sm font-medium text-zinc-400">
        Who are you?
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="mt-1 block w-full rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-3 text-sm text-zinc-100 outline-none transition-colors focus:border-cyan-500"
        >
          <option value="">Select your name…</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm font-medium text-zinc-400">
        PIN
        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          pattern="[0-9]{4}"
          placeholder="4-digit PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          className="mt-1 block w-full rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-3 text-center text-lg tracking-[0.5em] text-zinc-100 outline-none transition-colors focus:border-cyan-500"
        />
      </label>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-red-400"
        >
          {error}
        </motion.p>
      )}

      <button
        type="submit"
        disabled={pending || !selectedId || pin.length !== 4}
        className="mt-2 w-full rounded-xl bg-cyan-500 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Signing in…" : "Sign In"}
      </button>

      <p className="text-center text-xs text-zinc-600">
        First time?{" "}
        <a href="/setup-pin" className="text-cyan-500 hover:underline">
          Set up your PIN
        </a>
      </p>
    </motion.form>
  );
}
