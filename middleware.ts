import { SUPABASE_URL, SUPABASE_PUBLIC_KEY } from '@/lib/supabase/env';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_PUBLIC_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );
  const { data: { user } } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  if (!user && needsLogin(path)) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.search = `?next=${encodeURIComponent(path + request.nextUrl.search)}`;
    return NextResponse.redirect(url);
  }
  return response;
}

// Course tabs (/bgu/physics-3/map ...), checkout, thanks and admin need a signed-in user.
// Course landing pages (/bgu/physics-3) and the catalog stay public.
const UNI = /^\/(bgu|tau)\/[a-z0-9-]+\/[a-z]+/;
function needsLogin(path: string) {
  return UNI.test(path) || path.startsWith('/thanks') || path.startsWith('/checkout') || path.startsWith('/admin');
}

export const config = {
  // every page (to keep the session fresh), but not static files or the Morning webhook
  matcher: ['/((?!_next/static|_next/image|api/morning|favicon.ico|icon.svg|apple-icon.png|logo.svg|logo-email.png|.*\\.(?:png|jpg|svg|webp|woff2?)$).*)'],
};
