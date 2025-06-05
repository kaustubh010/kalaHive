import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Optional: redirect users to login if not authenticated
export default withAuth(
  function middleware(req) {
    // Example: You can add custom logic here if needed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Only allow access if logged in
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",       // protect dashboard
    "/onboarding/:path*",      // protect onboarding
    "/profile/:path*",         // protect profile
    "/settings/:path*",
    "/upload/:path*",
    "/notifications/:path*",
    // Exclude public stuff (login, signup, etc.)
  ],
};
