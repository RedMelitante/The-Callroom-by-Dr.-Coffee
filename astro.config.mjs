// @ts-check
import { defineConfig } from 'astro/config';

// Set SITE_URL (e.g. https://thecallroom.com) once you have a domain,
// so canonical URLs and social previews point at it.
export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:4321',
});
