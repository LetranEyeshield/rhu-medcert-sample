// import { getToken } from "next-auth/jwt";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export async function proxy(req: NextRequest) {
//   const token = await getToken({
//     req,
//     secret: process.env.NEXTAUTH_SECRET,
//   });

//   const isAuthPage =
//     req.nextUrl.pathname.startsWith("/login") ||
//     req.nextUrl.pathname.startsWith("/register");

//   if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   if (token && isAuthPage) {
//     return NextResponse.redirect(new URL("/dashboard", req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*", "/login", "/register"],
// };


import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  const isAuthPage =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/register");

     const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/patients") ||
    pathname.startsWith("/appointments");

  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
 matcher: [
    "/dashboard/:path*",
    "/patients/:path*",
    "/medcert/:path*",
    "/fittowork/:path*",
  ],
};
