import { NextResponse, type NextRequest } from "next/server";

// Edge gate: no session cookie -> login. The real session validation (DB, role, idle timeout)
// runs on the server in the layout and every server action. Middleware is NOT the only defence.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const open = pathname === "/dashboard-admin/login" || pathname === "/dashboard-admin/signup";
  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  if (!open && !req.cookies.get("apex_admin_session")) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard-admin/login";
    url.search = "?reason=expired";
    return NextResponse.redirect(url);
  }
  return res;
}

export const config = { matcher: ["/dashboard-admin/:path*"] };
