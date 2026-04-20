"use client";

import { useActionState } from "react";
import { removeMember } from "@/lib/actions/members";
import { MemberAvatar } from "@/components/member-avatar";
import { formatCurrency } from "@/lib/format";
import type { ActionResult, Member, MemberBalance } from "@/lib/types";

interface MemberRowProps {
  member: Member;
  balance: MemberBalance | undefined;
}

const initialState: ActionResult = { success: true };

export function MemberRow({
  member,
  balance,
}: MemberRowProps): React.ReactElement {
  const amt = balance?.amount ?? 0;

  const [, formAction, pending] = useActionState(
    async (_prev: ActionResult): Promise<ActionResult> => {
      return removeMember({ memberId: member.id });
    },
    initialState,
  );

  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/2 p-3 sm:p-4">
      <MemberAvatar name={member.name} />
      <div className="flex flex-1 flex-col">
        <span className="text-sm font-medium text-zinc-100">
          {member.name}
        </span>
        <span
          className={`font-mono text-sm font-semibold ${
            amt > 0
              ? "text-cyan-400"
              : amt < 0
                ? "text-amber-400"
                : "text-zinc-500"
          }`}
        >
          {amt > 0 && "+"}
          {formatCurrency(amt)}
        </span>
      </div>
      <form action={formAction}>
        <button
          type="submit"
          disabled={pending}
          className="min-h-11 min-w-11 rounded-lg border border-white/10 px-2 py-1 text-xs text-zinc-500 transition-colors hover:border-red-500/30 hover:text-red-400 disabled:opacity-50"
          aria-label={`Remove ${member.name}`}
        >
          {pending ? "…" : "Remove"}
        </button>
      </form>
    </div>
  );
}
