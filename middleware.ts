import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is for authentication
  if (pathname.startsWith("/auth")) {
    return NextResponse.next()
  }

  // Check if the path is for public assets or API routes
  if (pathname.startsWith("/_next") || pathname.startsWith("/api/auth") || pathname === "/") {
    return NextResponse.next()
  }

  const token = await getToken({ req: request })

  // Redirect to login if not authenticated
  if (!token) {
    const url = new URL("/auth/login", request.url)
    url.searchParams.set("callbackUrl", encodeURI(request.url))
    return NextResponse.redirect(url)
  }

  // Check for admin-only routes
  if ((pathname.startsWith("/admin") || pathname.startsWith("/merchants/payouts")) && token.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
}

