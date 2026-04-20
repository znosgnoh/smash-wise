"use client";

import type { Member } from "@/lib/types";

interface MemberSelectorProps {
  members: Member[];
  selected: string[];
  onChange: (selected: string[]) => void;
  mode: "single" | "multi";
  label: string;
}

export function MemberSelector({
  members,
  selected,
  onChange,
  mode,
  label,
}: MemberSelectorProps): React.ReactElement {
  const activeMembers = members.filter((m) => m.active);

  function handleToggle(id: string): void {
    if (mode === "single") {
      onChange([id]);
      return;
    }
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  function handleSelectAll(): void {
    if (selected.length === activeMembers.length) {
      onChange([]);
    } else {
      onChange(activeMembers.map((m) => m.id));
    }
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-zinc-300">{label}</label>
        {mode === "multi" && (
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-xs text-cyan-400 transition-colors hover:text-cyan-300"
          >
            {selected.length === activeMembers.length
              ? "Deselect all"
              : "Select all"}
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {activeMembers.map((member) => {
          const isSelected = selected.includes(member.id);
          return (
            <button
              key={member.id}
              type="button"
              onClick={() => handleToggle(member.id)}
              className={`flex min-h-11 items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-all ${
                isSelected
                  ? "border border-cyan-500/50 bg-cyan-500/10 text-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.1)]"
                  : "border border-white/10 bg-white/2 text-zinc-400 hover:border-white/20"
              }`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                  isSelected ? "bg-cyan-500/20" : "bg-white/10"
                }`}
              >
                {member.name.charAt(0).toUpperCase()}
              </span>
              {member.name}
              {isSelected && <span className="text-cyan-400">✓</span>}
            </button>
          );
        })}
      </div>
      {mode === "multi" && (
        <p className="mt-1.5 text-xs text-zinc-600">
          {selected.length} of {activeMembers.length} selected
        </p>
      )}
    </div>
  );
}
