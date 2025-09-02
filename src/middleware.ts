import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/onboarding',
  '/profile',
  '/study-planner',
  '/mock-tests',
  '/content-hub',
  '/community',
  '/progress',
];

// Auth routes that should redirect authenticated users
const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
];

const publicPaths = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/privacy',
  '/terms',
  '/pricing',
  '/onboarding'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get JWT token from cookies
  const accessToken = request.cookies.get('xploar_access_token')?.value;
  const refreshToken = request.cookies.get('xploar_refresh_token')?.value;

  // Check if user is authenticated
  const isAuthenticated = accessToken && refreshToken;

  // Handle protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Handle auth routes
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (isAuthenticated) {
      // Redirect to dashboard if already authenticated
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Continue with the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
