import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = ["/auth/signin", "/api/auth"];

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Allow public files and auth routes
  if (
    pathname.startsWith("/_next") || 
    pathname.startsWith("/favicon.ico") ||
    PUBLIC_PATHS.some((path) => pathname.startsWith(path))
  ) {
    return NextResponse.next();
  }

  // If user is not logged in redirect to sign in
  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/auth/signin";
    loginUrl.searchParams.set("callbackUrl", req.url); // So they return after login
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    
    "/((?!_next/static|_next/image|favicon.ico|api/auth|auth/signin).*)",
  ],
};
