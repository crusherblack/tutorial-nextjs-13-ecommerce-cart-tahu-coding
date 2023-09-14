import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

//this is custom middleware you may improve it as you like
export default async function middleware(req: NextRequest) {
  // Get the pathname of the request (e.g. /, /protected)
  const path = req.nextUrl.pathname;

  // If it's the root path, just render it
  if (path === "/") {
    return NextResponse.next();
  }

  //decript jwt based on NEXTAUTH_SECRET
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isPageProtected = path.includes("/dashboard");

  //if jwt token valid then continue, otherwise redirect to login
  if (!session && isPageProtected) {
    return NextResponse.redirect(new URL("/login", req.url));
  } else if (session && (path === "/login" || path === "/register")) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}
