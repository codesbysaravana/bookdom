import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      async authorize() {
        return null;
      },
    }),
  ],
  pages: { signIn: "/sign-in" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }
      return session;
    },
    async authorized({ auth, request }) {
      return !!auth;
    },
  },
};
