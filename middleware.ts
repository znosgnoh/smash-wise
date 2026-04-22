import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - /login, /setup-pin (auth pages)
     * - /api/auth (NextAuth API)
     * - /_next (Next.js internals)
     * - /favicon.ico, /icons, etc (static files)
     */
    "/((?!login|setup-pin|api/auth|_next|favicon\\.ico|icons|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
