// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: process.env.SITE_URL || 'https://callroomcoffee.com',
  trailingSlash: 'never',
  integrations: [
    preact(),
    sitemap({
      // Leave out private pages and the old-URL redirects
      filter: (page) => !/\/(cart|checkout|account|order\/confirmed|coffee-cart|frequently-asked-questions|shop)$/.test(page),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  // Old WordPress URLs -> new routes
  redirects: {
    '/coffee-cart': '/coffee-cart-events',
    '/frequently-asked-questions': '/faq',
    '/shop': '/menu',
  },
});
