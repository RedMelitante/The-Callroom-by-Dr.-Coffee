// Astro integration: writes dist/_redirects for Cloudflare after each build.
// - Old WordPress URLs that changed get a permanent (301) redirect.
// - Every page's old trailing-slash URL (WordPress style, e.g. /about-us/) gets a 301 to the
//   clean URL (/about-us), instead of Cloudflare's default temporary 307.
// Cloudflare keeps the query string (gclid, utm_*, fbclid) on these redirects.
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

// Old URL -> new URL (from the design handoff). Add more here as they're found.
export const OLD_URLS = {
  '/shop': '/menu',
  '/coffee-cart': '/coffee-cart-events',
  '/frequently-asked-questions': '/faq',
};

function htmlFiles(dir, root = dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return htmlFiles(full, root);
    return name.endsWith('.html') ? ['/' + relative(root, full).replace(/\\/g, '/')] : [];
  });
}

export default function cloudflareRedirects() {
  return {
    name: 'cloudflare-redirects',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const out = fileURLToPath(dir);
        const lines = ['# Generated at build time by scripts/cloudflare-redirects.mjs', ''];
        for (const [from, to] of Object.entries(OLD_URLS)) lines.push(`${from} ${to} 301`, `${from}/ ${to} 301`);
        lines.push('');
        const pages = htmlFiles(out)
          .filter((f) => f !== '/index.html' && f !== '/404.html')
          .map((f) => f.replace(/\.html$/, '').replace(/\/index$/, ''))
          .filter((p) => !(p in OLD_URLS))
          .sort();
        for (const p of pages) lines.push(`${p}/ ${p} 301`);
        writeFileSync(join(out, '_redirects'), lines.join('\n') + '\n');
        logger.info(`_redirects: ${Object.keys(OLD_URLS).length * 2 + pages.length} rules`);
      },
    },
  };
}
