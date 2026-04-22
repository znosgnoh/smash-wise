export const dynamic = "force-dynamic";

import { getActivityLog } from "@/lib/queries";
import { EmptyState } from "@/components/empty-state";
import { ActivityList } from "@/components/activity-list";

export default async function ActivityPage(): Promise<React.ReactElement> {
  const entries = await getActivityLog();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-zinc-100">Activity Log</h1>
      {entries.length === 0 ? (
        <EmptyState
          icon="📝"
          title="No activity yet"
          description="Actions like adding expenses, settlements, and members will appear here."
        />
      ) : (
        <ActivityList entries={entries} />
      )}
    </div>
  );
}
