import prisma from "@/lib/prisma";
import type { NextAuthOptions } from "next-auth";
import { compare } from "bcrypt";

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const OPTIONS: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials", //use this for custom login
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "crusherblack",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const loginErrorMessage = "Invalid email or password";

        //check if email already exist or not
        const isUserExisted = await prisma.user.findUnique({
          where: {
            email: credentials?.username,
          },
        });

        //if not throw error
        if (!isUserExisted) {
          throw Error(loginErrorMessage);
        }

        //check if password that client input is them sama with hash password from db
        if (
          isUserExisted &&
          credentials?.password &&
          (await compare(credentials.password, isUserExisted.password))
        ) {
          const { password: _, ...restUser } = isUserExisted;
          //if email and password valid continue
          return restUser;
        }

        //throw error if password not valid
        throw Error(loginErrorMessage);
      },
    }),
  ],
  pages: {
    signIn: "/login", //tell next auth, this is url for custom login page
  },
  session: {
    strategy: "jwt", //make sure to set it to jwt
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET, //fill with your own secret from .env
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token = {
          ...user,
          ...token,
        };
      }
      return token;
    },
  },
};

const handler = NextAuth(OPTIONS);

export { handler as GET, handler as POST };
