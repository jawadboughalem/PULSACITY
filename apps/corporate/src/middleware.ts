import { NextResponse, type NextRequest } from 'next/server';

import { DEMO_REWRITE_PREFIX, resolveHostRoute } from '@/lib/host-routing';

/** Applied to every response served on the demo host. */
function markNoindex(response: NextResponse): NextResponse {
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const route = resolveHostRoute({
    host: request.headers.get('host'),
    pathname,
    search,
  });

  switch (route.kind) {
    case 'redirect':
      return NextResponse.redirect(route.location, route.status);

    case 'demo': {
      const url = request.nextUrl.clone();
      url.pathname = route.rewriteTo;
      return markNoindex(NextResponse.rewrite(url));
    }

    case 'demo-unavailable': {
      const url = request.nextUrl.clone();
      url.pathname = route.rewriteTo;
      url.search = '';
      return markNoindex(NextResponse.rewrite(url));
    }

    case 'passthrough':
      return markNoindex(NextResponse.next());

    case 'not-found': {
      const url = request.nextUrl.clone();
      url.pathname = '/_hosts/not-found';
      url.search = '';
      return NextResponse.rewrite(url, { status: 404 });
    }

    case 'lookup-domain': {
      // The `domains` table lives behind Postgres, which the edge runtime cannot reach:
      // the lookup happens in a server component, which 404s when nothing matches.
      const url = request.nextUrl.clone();
      url.pathname = '/_hosts/unknown';
      url.search = '';
      return NextResponse.rewrite(url);
    }

    case 'corporate':
    default:
      // Internal host routes are never reachable from the corporate domain.
      if (pathname === DEMO_REWRITE_PREFIX || pathname.startsWith('/_hosts/')) {
        const url = request.nextUrl.clone();
        url.pathname = '/_hosts/not-found';
        url.search = '';
        return NextResponse.rewrite(url, { status: 404 });
      }
      return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Everything except Next internals, the API (reachable from the demo host too),
    // and static assets.
    '/((?!_next/static|_next/image|api/|showcase/|.*\\.(?:png|jpe?g|webp|gif|svg|ico|woff2?|ttf)$).*)',
  ],
};
