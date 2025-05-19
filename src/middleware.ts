import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";


export async function middleware(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
        secureCookie: process.env.NODE_ENV === "production"
      });
 console.log(token);
  // Protected routes
  const protectedRoutes = ["/admin"];
 
  const isProtectedRoute = protectedRoutes.some((path) => request.nextUrl.pathname.startsWith(path));
  

  // Redirect to login if protected route and no token
  if (isProtectedRoute && !token) {
   
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin route protection
  if (request.nextUrl.pathname.startsWith("/admin") && token?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }


  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/dashboard/:path*", "/subscription/verify"]
};
