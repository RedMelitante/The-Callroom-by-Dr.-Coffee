# The Callroom by Dr. Coffee

Website for **The Callroom by Dr. Coffee** (callroomcoffee.com), the specialty coffee shop on the 2nd floor of Madonna Hospital, Cagayan de Oro.

Built from the Claude Design handoff in [`design/`](design/HANDOFF.md) with **Astro 7**, **Tailwind CSS v4** design tokens and **Preact** for the interactive parts. Every page keeps the design's exact layout, inline styles and copy.

## Quick start

Requires Node.js 22.23.4 or newer (see `.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:4321
```

| Command | Does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Build the static site into `dist/` |
| `npm run preview` | Preview the build with Astro |
| `npm run preview:cloudflare` | Serve `dist/` locally the way Cloudflare does (`wrangler dev`) |
| `npm run deploy` | Build and deploy to Cloudflare Workers (after `npx wrangler login`) |
| `npm run check` | Type-check the project |

## Pages

| Route | Page | Design file |
| --- | --- | --- |
| `/` | Home | `HomeBody` |
| `/menu` | Our Menu (full price list) | `OurMenuBody` |
| `/order` | Order Ahead catalog (`?series=Milk` opens a tab) | `MenuBody` |
| `/products/[slug]` | Drink detail, one page per drink (16) | `ProductBody` |
| `/cart` | Cart (plus the slide-out drawer on every page) | `CartBody`, `CartDrawer` |
| `/checkout` | Pickup checkout: contact → time → payment → review | `CheckoutBody` |
| `/order/confirmed` | Order confirmation | `ConfirmationBody` |
| `/coffee-cart-events` | Coffee Cart & Events | `EventsBody` |
| `/coffee-cart-events-booking-now` | Coffee cart booking (`?package=light` preselects) | `BookingBody` |
| `/about-us` | About | `AboutBody` |
| `/visit-us` | Visit Us, with the live Google Map | `VisitBody` |
| `/faq` | FAQ | `FaqBody` |
| `/blogs`, `/blogs/[slug]` | Blog list and posts | `BlogBody`, `ArticleBody` |
| `/account` | My account | `AccountBody` |
| 404 | Not found | `NotFoundBody` |

Old WordPress URLs redirect: `/shop` → `/menu`, `/coffee-cart` → `/coffee-cart-events`, `/frequently-asked-questions` → `/faq`.

## Where things live

| Path | What it is |
| --- | --- |
| `src/components/design/` | One component per design file, markup and inline styles kept verbatim |
| `src/layouts/BaseLayout.astro` | Page shell: desktop header, or mobile header + bottom nav below 1100px; footer, cart drawer, SEO tags |
| `src/lib/catalog.js` | **The menu**: drinks, series, prices, descriptions. Edit prices here |
| `src/lib/site.js` | **Shop settings**: contact details, kiosk landmark, feature flags |
| `src/lib/hours.js` | Opening hours (Manila time), open/closed pill, pickup slots |
| `src/lib/cart.js` | Cart, saved in the browser and shared across pages |
| `src/lib/submit.js` | Sends orders and booking requests |
| `src/styles/global.css` | Tailwind v4 `@theme` tokens, focus ring, blog article styles |
| `src/content/blog/` | Blog posts (Markdown) |
| `public/images/` | All design images (WebP) |
| `public/_headers` | Cloudflare response headers |
| `wrangler.jsonc` | Cloudflare Worker config |
| `scripts/cloudflare-redirects.mjs` | Generates the 301 redirects (`dist/_redirects`) on each build |
| `integrations/google-apps-script/` | Form service: emails orders and bookings, puts bookings on Google Calendar |
| `design/` | The original Claude Design handoff bundle |

## How orders and bookings reach the shop

There is no store backend yet, so the site works like this:

- **Bookings and orders backend:** [`integrations/google-apps-script/`](integrations/google-apps-script/README.md) holds the Google Apps Script deployed by redmelitante@gmail.com. Set its `/exec` URL as `PUBLIC_FORMS_ENDPOINT`. Then:
  - **coffee cart bookings** POST `action: "book"`. The script adds a yellow PENDING event to the cart's Google Calendar at the requested 30-minute slot and emails thecallroombydc@gmail.com and redmelitante@gmail.com;
  - **pickup orders** POST `action: "order"` (`FORMS_HANDLES_ORDERS = true` in `src/lib/site.js`). The script emails the order to the same two addresses. No calendar event.
- **If `PUBLIC_FORMS_ENDPOINT` is not set**, bookings and orders use the email hand-off: the customer's email app opens with the order or request filled in, addressed to thecallroombydc@gmail.com with a copy (CC) to the addresses in `REQUESTS_CC` (`src/lib/site.js`). The confirmation screen tells them to press send. Nothing goes on the calendar in this mode.
- **Payment** is taken at the kiosk for now (`ONLINE_PAYMENTS = false` in `src/lib/site.js`). The checkout still lets customers choose GCash, Maya or card, but the site never collects card details. Turning on online payment needs a payment provider (e.g. PayMongo) through a backend.
- **My account** shows the orders, bookings and details saved in that browser (`ACCOUNTS_ENABLED = false`). Real sign-in needs a backend.

The handoff targets **Medusa v2** for the store backend. When it is ready, swap `src/lib/catalog.js`, `src/lib/cart.js` and `src/lib/submit.js` for Medusa Store API calls, then set `ONLINE_PAYMENTS` and `ACCOUNTS_ENABLED` to `true` to show the design's payment and sign-in screens.

## Still to fill in

These are hidden on the site until they are filled in:

- **Kiosk landmark** for the Visit Us directions and the pickup slip: `KIOSK_LANDMARK` in `src/lib/site.js`.
- **"Drink Coffee and Do Good" cause text** on the About page: `DO_GOOD_TEXT` in `src/lib/site.js`.
- **Cup sizes in ounces** on drink pages: `SIZE_OZ` in `src/lib/catalog.js`.

Also worth doing:

- Review the drink descriptions in `src/lib/catalog.js`. The design only had text for Caramel Milk Therapy; the other 15 were written from each drink's one-line description.
- Salted Caramel Drip uses the same photo as Caramel Remedy (from the old site); reshoot it.
- Replace the photos with the full-size originals from the WordPress media library (`/wp-content/uploads/2026/09/`); the bundle's copies are about 950px.

## Blog posts

Add a Markdown file to `src/content/blog/`. The file name becomes the URL (`my-post.md` → `/blogs/my-post`). See `example-post.md`, which is a draft and isn't published:

```markdown
---
title: Post title
summary: One or two sentences for the header and the blog list.
category: Coffee tips
date: 2026-11-18
image: /images/hero-drinks.webp
imageAlt: Describe the image
draft: false
---

Post body in Markdown.
```

## Deploying: Cloudflare Workers

The site builds to static files in `dist/`, which a Cloudflare Worker serves. The config is in `wrangler.jsonc` (Worker name: `the-callroom-by-dr--coffee`).

**Set up (Cloudflare dashboard → Workers & Pages → Create → Import a repository):**
1. Pick this GitHub repo and the branch to deploy (`main`).
2. Build command: `npm run build`. Deploy command: `npx wrangler deploy`.
3. Under **Settings → Build → Variables and secrets** (build variables, not runtime variables), add:
   - `PUBLIC_FORMS_ENDPOINT`: the Google Apps Script `/exec` URL (see [its setup guide](integrations/google-apps-script/README.md));
   - `SITE_URL`: `https://callroomcoffee.com` (the default; change it only for a different domain).

   Both are read at build time, so trigger a new build after changing them.
4. Test on the `*.workers.dev` URL first. Then add the custom domain under the Worker's **Settings → Domains & Routes**. Copy the existing DNS records, MX and SPF/DKIM TXT included, before moving nameservers.

From a computer you can also run `npx wrangler login` once, then `npm run deploy`.

**What Cloudflare serves:**
- Clean URLs: pages are built as `about-us.html` and served at `/about-us`.
- `_redirects` is generated on each build by `scripts/cloudflare-redirects.mjs`. It holds:
  - **301s** from every old WordPress-style trailing-slash URL (`/about-us/` → `/about-us`);
  - **301s** for the renamed pages (`/shop` → `/menu`, `/coffee-cart` → `/coffee-cart-events`, `/frequently-asked-questions` → `/faq`).

  Query strings such as `gclid`, `utm_*` and `fbclid` are kept. To redirect more old URLs, add them to `OLD_URLS` in that script.
- Headers: `public/_headers` sets security headers and long caching for `/_astro/*` and `/images/*`.
- Unknown URLs get the 404 page with a real 404 status.

To test the production setup locally: `npm run build`, then `npm run preview:cloudflare` (runs `wrangler dev`).

## CI

`.github/workflows/ci.yml` type-checks and builds on every push and pull request.

---

Website by Digital Services Master
