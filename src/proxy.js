// middleware.ts

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const publicRoutes = ["/login", "/signup", "/verify-email"];

export function proxy(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;
  const isPublicRoute = publicRoutes.includes(pathname);

  // If route is public, allow access
  if (isPublicRoute) {
    // But if user already logged in and tries to access login/signup
    if (token && (pathname === "/login" || pathname === "/signup")) {
      try {
        jwt.verify(token, process.env.JWT_SECRET);
        return NextResponse.redirect(new URL("/", req.url));
      } catch {
        return NextResponse.next();
      }
    }

    return NextResponse.next();
  }

  // Everything else requires auth
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
