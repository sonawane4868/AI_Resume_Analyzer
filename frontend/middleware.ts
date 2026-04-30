import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token");
  const { pathname } = req.nextUrl;

  // ✅ PUBLIC ROUTES
  const publicRoutes = ["/", "/login", "/register"];
  const isPublic = publicRoutes.includes(pathname);

  // 🔥 1. BLOCK auth pages if already logged in
  if (
    token &&
    (pathname === "/login" || pathname === "/register")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 🔥 2. ALLOW public routes
  if (isPublic) {
    return NextResponse.next();
  }

  // 🔥 3. PROTECT private routes
  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/history");

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};