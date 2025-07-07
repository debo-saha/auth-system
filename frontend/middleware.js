// middleware.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname.startsWith("/auth") || pathname.startsWith("/reset-password");

  if (!token) {
    // Allow unauthenticated access to auth pages
    return NextResponse.next();
  }

  try {
    await jwtVerify(token, secret);

    // ✅ If authenticated, redirect away from /auth and /reset-password
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/dash", request.url));
    }

    return NextResponse.next();
  } catch (err) {
    // Token invalid or expired, proceed normally
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/auth/:path*", "/reset-password/:path*"],
};
