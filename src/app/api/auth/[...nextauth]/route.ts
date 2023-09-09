import type { NextAuthOptions } from "next-auth";

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const OPTIONS: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = { id: "1", name: "admin", password: "admin" };

        if (
          credentials?.username == user.name &&
          credentials.password == user.password
        ) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: "adawd",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return "http://localhost:3001/login";
    },
  },
};

const handler = NextAuth(OPTIONS);

export { handler as GET, handler as POST };
