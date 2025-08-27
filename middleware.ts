// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // /form を保護（将来サブパスが増えるなら '/form/:path*' へ）
  if (request.nextUrl.pathname.startsWith('/form')) {
    // ✅ 実体に合わせて 'lineId' をチェック
    const cookie = request.cookies.get('lineId');
    if (!cookie) {
      const login = new URL('/login', request.url);
      login.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(login);
    }
  }
  return NextResponse.next();
}

export const config = {
  // いまは '/form' だけでOK。配下も保護するなら ['/form/:path*']
  matcher: ['/form'],
};
