import NextAuth, { DefaultUser } from "next-auth";
import type { User } from "prisma/prisma-client";

type AuthUser = Omit<User, "password">;

declare module "next-auth" {
  interface Session {
    user: AuthUser;
  }
}

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT extends AuthUser {}
}
