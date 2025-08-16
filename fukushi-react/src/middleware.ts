import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes: (string | RegExp)[] = [
  '/login',
  '/lost-password',
  '/reset-password',
];

const matchesRoute = (path: string, routes: (string | RegExp)[]) =>
  routes.some((route): boolean => (typeof route === 'string' ? path === route : route.test(path)));

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token: string | undefined = request.cookies.get('access_token')?.value;

  //Check if the user is already logged in
  if (matchesRoute(pathname, publicRoutes) && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  //Check if the user is not logged in
  if (!token && !matchesRoute(pathname, publicRoutes)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/store/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
