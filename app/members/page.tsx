export const dynamic = "force-dynamic";

import {
  getMembers,
  getExpenses,
  getSettlements,
} from "@/lib/queries";
import { computeNetBalances, toMemberBalances } from "@/lib/balance";
import { MemberForm } from "@/components/member-form";
import { MemberRow } from "@/components/member-row";
import { EmptyState } from "@/components/empty-state";

export default async function MembersPage(): Promise<React.ReactElement> {
  const [members, expenses, settlements] = await Promise.all([
    getMembers(),
    getExpenses(),
    getSettlements(),
  ]);
  const activeMembers = members.filter((m) => m.active);

  const netBalances = computeNetBalances(
    members,
    expenses,
    settlements,
  );
  const memberBalances = toMemberBalances(netBalances);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-zinc-100">Members</h1>
        <span className="text-sm text-zinc-500">
          {activeMembers.length} total
        </span>
      </div>

      <MemberForm />

      {activeMembers.length === 0 ? (
        <EmptyState
          icon="👥"
          title="No members yet"
          description="Add your badminton group members above."
        />
      ) : (
        <div className="flex flex-col gap-2">
          {activeMembers.map((member) => (
            <MemberRow
              key={member.id}
              member={member}
              balance={memberBalances.find((b) => b.memberId === member.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
