import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "PIN Login",
      credentials: {
        memberId: { label: "Member", type: "text" },
        pin: { label: "PIN", type: "password" },
      },
      async authorize(credentials) {
        const memberId = credentials?.memberId as string | undefined;
        const pin = credentials?.pin as string | undefined;

        if (!memberId || !pin) return null;

        const member = await prisma.member.findFirst({
          where: { id: memberId, active: true },
        });

        if (!member || !member.pin) return null;

        // Compare PIN (stored as plain 4-digit for simplicity — no sensitive data)
        if (member.pin !== pin) return null;

        return {
          id: member.id,
          name: member.name,
          role: member.role,
        };
      },
    }),
  ],
});
