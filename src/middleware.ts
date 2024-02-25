import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { api } from "./trpc/client";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "./lib/constants";

export async function middleware(req: NextRequest): Promise<NextResponse> {
    if (!isProtectedRoute(req.nextUrl.pathname)) return NextResponse.next();

    const authCookie = cookies().get(SESSION_COOKIE_NAME);

    if (!authCookie) {
        return NextResponse.redirect(new URL("/signin", req.url));
    }

    const { user, session } = await api.session.validate.query({
        sessionId: authCookie.value,
    });

    if (!session) {
        return NextResponse.redirect(new URL("/signin", req.url));
    }

    if (isAdminRoute(req.nextUrl.pathname)) {
        if (user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "UNAUTHORIZED" },
                { status: 401 }
            );
        }
    }

    return NextResponse.next();
}

const isProtectedRoute = (pathname: string): boolean => {
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/static") ||
        pathname.startsWith("/signin") ||
        pathname.startsWith("/signup") ||
        pathname === "/" ||
        /\.(.*)$/.test(pathname)
    ) {
        return false;
    }
    return true;
};

const isAdminRoute = (pathname: string): boolean => {
    return pathname === "/site-settings";
};
