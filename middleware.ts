import { NextResponse, type NextRequest } from "next/server";

// Public routes that don't require auth
const PUBLIC_PATHS = new Set<string>(["/", "/landing", "/login", "/_next", "/public", "/favicon.ico"]);

function isPublicPath(pathname: string) {
  if (pathname === "/") return true;
  if (pathname === "/landing") return true;
  if (pathname.startsWith("/login")) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname.startsWith("/public")) return true;
  if (pathname === "/favicon.ico") return true;
  return false;
}

export function middleware(_req: NextRequest) {
  // Disabled for now: Supabase JS stores sessions in localStorage by default,
  // which the middleware cannot access. We'll rely on client-side guards.
  return NextResponse.next();
}

export const config = {
  // Run only on favicon to effectively disable middleware
  matcher: ["/favicon.ico"],
};
