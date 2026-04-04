import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

const AUTH_ROUTES = ["/signin", "/login", "/signup"]
const PROTECTED_ROUTES = ["/home", "/settings", "/profile"]

export async function proxyHandler(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  const pathname = new URL(request.url).pathname

  // Logged-in user trying to access auth pages → send to dashboard
  if (session && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/home", request.url))
  }

  // Logged-out user trying to access protected pages → send to login
  if (!session && PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

// Next.js entry point (using both for compatibility)
export default async function middleware(request: NextRequest) {
  return proxyHandler(request)
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
}
