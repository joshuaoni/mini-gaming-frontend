import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const publicRoutes = ['/auth/login', '/auth/register'];
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  if (
    pathname.startsWith('/auth/login') ||
    pathname.startsWith('/auth/register')
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    const isAdmin = request.cookies.get('isAdmin')?.value;
    if (isAdmin === 'false') {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return fetch('http://localhost:8080/api/users/validate', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => {
      if (!response.ok) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
      return NextResponse.next();
    })
    .catch(() => {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    });
}
