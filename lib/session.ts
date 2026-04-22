import "server-only";
import { auth } from "@/lib/auth";

export interface SessionUser {
  id: string;
  name: string;
  role: string;
}

/** Get current authenticated user from session. Returns null if not authenticated. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  return {
    id: session.user.id,
    name: session.user.name ?? "",
    role: (session.user as { role?: string }).role ?? "member",
  };
}

/** Returns true if the current user has admin role. */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === "admin";
}
