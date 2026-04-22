export const dynamic = "force-dynamic";

import { getActiveMembers } from "@/lib/queries";
import { SetupPinForm } from "@/components/setup-pin-form";

export default async function SetupPinPage(): Promise<React.ReactElement> {
  const members = await getActiveMembers();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-zinc-100">Set Your PIN</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Choose your name and create a 4-digit PIN to log in
        </p>
      </div>
      <SetupPinForm members={members} />
    </div>
  );
}
