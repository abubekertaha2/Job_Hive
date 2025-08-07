import { NextResponse } from 'next/server';
import { verifyToken } from './src/app/lib/auth';

export function middleware(req) {
  const token = req.cookies.get('token')?.value;

  const publicPaths = [
    '/login',
    '/signup',
    '/',
    '/api/auth',
    '/api/jobs',
  ];

  const { pathname } = req.nextUrl;

  if (publicPaths.includes(pathname) || pathname.startsWith('/_next') || pathname.startsWith('/assets')) {
    return NextResponse.next();
  }

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      return NextResponse.next();
    }
  }

  const loginUrl = new URL('/login', req.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/post-job/:path*',
  ],
};
