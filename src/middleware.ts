import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  AUTH_PATHS,
  DEFAULT_LOGIN_REDIRECT_PATH,
  PROTECTED_PATHS,
  API_AUTH_ROUTE_PREFIX,
} from '@/lib/constants/routes';

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;

  // BetterAuth session cookie check
  const sessionCookie =
    request.cookies.get('better-auth.session_token') ||
    request.cookies.get('__Secure-better-auth.session_token');

  const isAuthenticated = !!sessionCookie;

  const isApiAuthRoute = nextUrl.pathname.startsWith(API_AUTH_ROUTE_PREFIX);
  const isProtectedRoute =
    nextUrl.pathname.startsWith(PROTECTED_PATHS.SETTINGS_BASE) ||
    nextUrl.pathname.startsWith(PROTECTED_PATHS.DASHBOARD_BASE);

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isProtectedRoute && !isAuthenticated) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const loginUrl = new URL(AUTH_PATHS.LOGIN, nextUrl.origin);
    loginUrl.searchParams.set('callbackUrl', callbackUrl);
    return NextResponse.redirect(loginUrl);
  }

  if (
    isAuthenticated &&
    (nextUrl.pathname === AUTH_PATHS.LOGIN ||
      nextUrl.pathname === AUTH_PATHS.REGISTER)
  ) {
    return NextResponse.redirect(
      new URL(DEFAULT_LOGIN_REDIRECT_PATH, nextUrl.origin)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api(?!/auth)|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
