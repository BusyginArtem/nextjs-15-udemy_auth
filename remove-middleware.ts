import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
//
import { lucia } from "./lib/auth";

// Because of using the better-sqlite3 package this middleware doesn't work

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get(lucia.sessionCookieName);

  if (!sessionCookie) {
    return {
      user: null,
      session: null,
    };
  }

  const sessionId = sessionCookie.value;

  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await lucia.validateSession(sessionId);

  const response = NextResponse.next();

  try {
    if (result.session?.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      response.cookies.set({
        name: sessionCookie.name,
        value: sessionCookie.value,
        path: sessionCookie.attributes.path,
      });
    }

    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      response.cookies.set({
        name: sessionCookie.name,
        value: sessionCookie.value,
        path: sessionCookie.attributes.path,
      });
    }
  } catch {}

  return response;
}

export const config = {
  matcher: "/training",
};
