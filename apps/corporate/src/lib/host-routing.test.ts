import { describe, expect, it } from 'vitest';

import { resolveHostRoute, type HostRoutingConfig } from './host-routing';

const production: HostRoutingConfig = {
  corporateHost: 'pulsacity.com',
  demoHost: 'demo.pulsacity.com',
  legacyHosts: ['pulsacity.fr', 'www.pulsacity.fr'],
};

const development: HostRoutingConfig = {
  corporateHost: 'pulsacity.localhost:3000',
  demoHost: 'demo.localhost:3000',
  legacyHosts: [],
};

describe('host → target matrix (production)', () => {
  it.each([
    ['pulsacity.com', '/'],
    ['pulsacity.com', '/cgv'],
    ['PULSACITY.COM', '/'],
    ['pulsacity.com.', '/'],
    ['pulsacity-preview-abc.vercel.app', '/'],
  ])('%s%s serves the corporate page', (host, pathname) => {
    expect(resolveHostRoute({ host, pathname }, production)).toEqual({ kind: 'corporate' });
  });

  it('redirects www to the apex in 308, keeping the path and query', () => {
    expect(
      resolveHostRoute({ host: 'www.pulsacity.com', pathname: '/cgv', search: '?a=1' }, production),
    ).toEqual({
      kind: 'redirect',
      status: 308,
      location: 'https://pulsacity.com/cgv?a=1',
    });
  });

  it.each(['pulsacity.fr', 'www.pulsacity.fr'])('redirects %s to the .com in 301', (host) => {
    expect(resolveHostRoute({ host, pathname: '/mentions-legales' }, production)).toEqual({
      kind: 'redirect',
      status: 301,
      location: 'https://pulsacity.com/mentions-legales',
    });
  });

  it('rewrites a demo slug to the internal demo route', () => {
    expect(
      resolveHostRoute({ host: 'demo.pulsacity.com', pathname: '/as-du-2-roues' }, production),
    ).toEqual({
      kind: 'demo',
      slug: 'as-du-2-roues',
      rewriteTo: '/_hosts/demo/as-du-2-roues',
    });
  });

  it.each([
    ['the demo host root', '/'],
    ['a nested path', '/as-du-2-roues/contact'],
    ['an invalid slug', '/Pas Un Slug'],
    ['a path traversal attempt', '/../etc'],
  ])('shows « démo indisponible » for %s', (_label, pathname) => {
    expect(resolveHostRoute({ host: 'demo.pulsacity.com', pathname }, production)).toEqual({
      kind: 'demo-unavailable',
      rewriteTo: '/_hosts/demo',
    });
  });

  it('lets the demo host serve its own robots.txt', () => {
    expect(
      resolveHostRoute({ host: 'demo.pulsacity.com', pathname: '/robots.txt' }, production),
    ).toEqual({ kind: 'passthrough' });
  });

  it('refuses a sitemap on the demo host: it is never indexed', () => {
    expect(
      resolveHostRoute({ host: 'demo.pulsacity.com', pathname: '/sitemap.xml' }, production),
    ).toEqual({ kind: 'not-found' });
  });

  it('sends an unknown host to the domains lookup', () => {
    expect(resolveHostRoute({ host: 'garage-dupont.fr', pathname: '/' }, production)).toEqual({
      kind: 'lookup-domain',
      host: 'garage-dupont.fr',
    });
  });

  it('404s a request without a Host header', () => {
    expect(resolveHostRoute({ host: null, pathname: '/' }, production)).toEqual({
      kind: 'not-found',
    });
  });
});

describe('host → target matrix (development)', () => {
  it('serves the corporate page on pulsacity.localhost:3000', () => {
    expect(
      resolveHostRoute({ host: 'pulsacity.localhost:3000', pathname: '/' }, development),
    ).toEqual({ kind: 'corporate' });
  });

  it('serves demos on demo.localhost:3000', () => {
    expect(
      resolveHostRoute(
        { host: 'demo.localhost:3000', pathname: '/garage-exemple-fixture' },
        development,
      ),
    ).toEqual({
      kind: 'demo',
      slug: 'garage-exemple-fixture',
      rewriteTo: '/_hosts/demo/garage-exemple-fixture',
    });
  });

  it('redirects www over http in development', () => {
    expect(
      resolveHostRoute({ host: 'www.pulsacity.localhost:3000', pathname: '/' }, development),
    ).toEqual({
      kind: 'redirect',
      status: 308,
      location: 'http://pulsacity.localhost:3000/',
    });
  });
});
