"use client";

import { motion } from "motion/react";
import { formatRelativeDate } from "@/lib/format";
import type { ActivityLogEntry } from "@/lib/types";

interface ActivityListProps {
  entries: ActivityLogEntry[];
}

const ACTION_ICONS: Record<string, string> = {
  "expense.create": "💰",
  "expense.delete": "🗑️",
  "expense.edit": "✏️",
  "settlement.create": "🤝",
  "member.add": "👤",
  "member.remove": "👋",
};

export function ActivityList({
  entries,
}: ActivityListProps): React.ReactElement {
  return (
    <div className="flex flex-col gap-2">
      {entries.map((entry, i) => (
        <motion.div
          key={entry.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.03, ease: "easeOut" }}
          className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/2 p-3"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-sm">
            {ACTION_ICONS[entry.action] ?? "📋"}
          </div>
          <div className="flex flex-1 flex-col gap-0.5">
            <span className="text-sm text-zinc-200">{entry.detail}</span>
            <span className="text-xs text-zinc-600">
              {formatRelativeDate(entry.createdAt)}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
