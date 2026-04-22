export const dynamic = "force-dynamic";

import { getActiveMembers } from "@/lib/queries";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage(): Promise<React.ReactElement> {
  const members = await getActiveMembers();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8">
      <div className="text-center">
        <h1 className="bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-3xl font-bold text-transparent">
          Smash Wise
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Pick your name and enter your PIN
        </p>
      </div>
      <LoginForm members={members} />
    </div>
  );
}
