import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const { pathname, origin } = req.nextUrl;
  const session = req.auth;
  const role = session?.user?.role;

  const isAdminLogin = pathname === "/admin/login";
  const isTeamLogin = pathname === "/team/login";
  const isAdminPath = pathname.startsWith("/admin") && !isAdminLogin;
  const isTeamPath = pathname.startsWith("/team") && !isTeamLogin;

  if (isAdminPath) {
    if (!session) return NextResponse.redirect(new URL("/admin/login", origin));
    if (role !== "admin") return NextResponse.redirect(new URL("/team/login", origin));
  }

  if (isTeamPath) {
    if (!session) return NextResponse.redirect(new URL("/team/login", origin));
    if (role !== "teamLead" && role !== "helper" && role !== "admin") {
      return NextResponse.redirect(new URL("/team/login", origin));
    }
  }

  if (session && isAdminLogin && role === "admin") {
    return NextResponse.redirect(new URL("/admin", origin));
  }

  if (session && isTeamLogin) {
    return NextResponse.redirect(new URL("/team", origin));
  }
});

export const config = {
  matcher: ["/admin/:path*", "/team/:path*"],
};
