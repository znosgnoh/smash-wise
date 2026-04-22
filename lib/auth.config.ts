import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth config — no Node.js-only imports (Prisma, crypto, etc.).
 * Used by middleware and re-exported into the full auth config.
 */
export const authConfig = {
  callbacks: {
    authorized({ auth: session, request }) {
      const isLoggedIn = !!session?.user;
      const { pathname } = request.nextUrl;
      const isAuthPage = pathname === "/login" || pathname === "/setup-pin";

      // Redirect logged-in users away from auth pages
      if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL("/", request.nextUrl));
      }

      // Allow auth pages for unauthenticated users
      if (isAuthPage) return true;

      // Require auth for everything else
      return isLoggedIn;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "member";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [], // added in lib/auth.ts with Prisma-dependent logic
} satisfies NextAuthConfig;
