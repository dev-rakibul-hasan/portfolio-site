import { NextResponse, type NextRequest } from "next/server";
import { isAdminEmail, hasConfiguredAdminEmails } from "@/lib/admin-access";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  if (!hasConfiguredAdminEmails()) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/login";
    redirectUrl.searchParams.set("error", "admin-not-configured");
    return NextResponse.redirect(redirectUrl);
  }

  const { response, user } = await updateSession(request);

  if (!user || !isAdminEmail(user.email)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/login";
    redirectUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};

