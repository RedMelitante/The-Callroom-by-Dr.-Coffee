# The Callroom by Dr. Coffee

The website for **The Callroom by Dr. Coffee**: a static landing page built with [Astro](https://astro.build).

## Quick start

Requires Node.js 22.23.4 or newer (see `.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:4321
```

## Editing the content

All the site's copy lives in **`src/site.config.ts`**: the headline, about text, feature cards, call to action and social links. Items marked `TODO` are placeholders to replace.

| Path | What it is |
| --- | --- |
| `src/site.config.ts` | Site copy and links |
| `src/pages/index.astro` | Landing page layout |
| `src/pages/404.astro` | Not-found page |
| `src/layouts/Base.astro` | `<head>`, meta tags, fonts |
| `src/styles/global.css` | Colours (CSS variables at the top), type and layout |
| `public/` | Static files served as-is (favicon, robots.txt) |

## Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Local dev server with hot reload |
| `npm run build` | Build the static site into `dist/` |
| `npm run preview` | Preview the built site locally |
| `npm start` | Serve `dist/` in production on `$PORT` (default 3000) |
| `npm run check` | Type-check `.astro` and `.ts` files |

## Deploying

The site is fully static, so any static host works (Railway, Netlify, Vercel, Cloudflare Pages, GitHub Pages).

**Railway:** create a service from this GitHub repo. Railway runs `npm run build` and then `npm start`, which serves `dist/` on the port Railway provides. Set the `SITE_URL` variable to the public URL (e.g. `https://thecallroom.com`) so canonical links and social previews are correct.

## CI

`.github/workflows/ci.yml` type-checks and builds the site on every push and pull request.
