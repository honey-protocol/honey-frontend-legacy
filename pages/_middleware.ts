import { NextResponse, NextRequest } from 'next/server';
export async function middleware(req: any, ev: any) {
  const { pathname } = req.nextUrl;
  if (pathname == '/') {
    const url = req.nextUrl.clone();
    url.pathname = '/farm';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
