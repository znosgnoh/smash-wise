"use client";

import { useState, useActionState } from "react";
import { addMember } from "@/lib/actions/members";
import type { ActionResult } from "@/lib/types";

const initialState: ActionResult = { success: true };

export function MemberForm(): React.ReactElement {
  const [name, setName] = useState("");

  const [state, formAction, pending] = useActionState(
    async (): Promise<ActionResult> => {
      if (!name.trim()) {
        return { success: false, error: "Name is required" };
      }
      const result = await addMember({ name: name.trim() });
      if (result.success) {
        setName("");
      }
      return result;
    },
    initialState,
  );

  return (
    <form action={formAction} className="flex gap-2">
      <input
        type="text"
        maxLength={50}
        placeholder="Member name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 rounded-xl border border-white/10 bg-white/2 px-4 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-700 focus:border-cyan-500/50"
      />
      <button
        type="submit"
        disabled={pending}
        className="shrink-0 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-cyan-400 disabled:opacity-50"
      >
        {pending ? "Adding…" : "Add"}
      </button>
      {!state.success && (
        <p className="absolute mt-14 text-xs text-red-400">{state.error}</p>
      )}
    </form>
  );
}
