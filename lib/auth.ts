import NextAuth, { type DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

const allowedEmails = (process.env.ADMIN_EMAIL_ALLOWLIST || "")
  .split(",")
  .map((email) => email.trim())
  .filter(Boolean);

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      // Check if email is in allowlist
      if (allowedEmails.length > 0 && !allowedEmails.includes(user.email)) {
        return false;
      }

      return true;
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin",
    error: "/admin",
  },
});

/**
 * Helper function to require admin authentication in API routes
 */
export async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  if (allowedEmails.length > 0 && !allowedEmails.includes(session.user.email)) {
    throw new Error("Forbidden");
  }

  return session.user;
}
