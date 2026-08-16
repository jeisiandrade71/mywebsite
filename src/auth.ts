import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { findAdminByEmail } from "@/lib/admins";
import { findTeamMemberByEmail } from "@/lib/teamMembers";

export type AppRole = "admin" | "teamLead" | "helper";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: AppRole;
    };
  }
  interface User {
    role: AppRole;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: AppRole;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") {
          return null;
        }

        const admin = await findAdminByEmail(email);
        if (admin) {
          const valid = await bcrypt.compare(password, admin.passwordHash);
          if (!valid) return null;
          return {
            id: admin._id!.toString(),
            email: admin.email,
            role: "admin" as const,
          };
        }

        const member = await findTeamMemberByEmail(email);
        if (member && member.active) {
          const valid = await bcrypt.compare(password, member.passwordHash);
          if (!valid) return null;
          return {
            id: member._id.toString(),
            email: member.email,
            name: member.name,
            role: member.role,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.role = (token.role as AppRole) ?? "helper";
      }
      return session;
    },
  },
});
