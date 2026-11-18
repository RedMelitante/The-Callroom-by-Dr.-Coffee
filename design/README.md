# The Callroom by Dr. Coffee — Website Design

Design handoff for the callroomcoffee.com rebuild (Astro + Medusa v2 + Tailwind v4, "Astro Medusa Storefront" template).

Live design canvas: https://claude.ai/artifact/FwdCfbRUStcKRTndzKWGou

## Folders

| Folder | What's inside |
|---|---|
| `pages/` | Every page and component as HTML, with image paths pointing to `../assets/images/`. Use these when building. |
| `canvas-source/` | The same files exactly as they are on the design canvas (images as `/_blob/…` links) plus `canvas.json` (the canvas layout). Keep these to re-import or compare. |
| `assets/images/` | All 30 images used in the design (WebP). |
| `assets/image-map.json` | Which canvas image link (`/_blob/…`) matches which image file. |

The `.dc.html` files are design components: plain HTML with inline styles, plus a small script at the bottom that holds repeating data (drink lists, FAQs, packages) and click behaviour. They need the canvas runtime (`support.js`) to render, so open them on the canvas to preview. Read them as the source for layout, copy, colours and spacing.

## How pages are built

Each page = layout + section, the same way an Astro page uses a layout:

- `Home.dc.html` (desktop 1440) and `Home-Mobile.dc.html` (mobile 390) are wrappers. They load:
  - `SiteHeader.dc.html` (desktop) or `MobileHeader.dc.html` (mobile, with ☰ menu)
  - the page section, e.g. `HomeBody.dc.html` ← **the real page content**
  - `SiteFooter.dc.html`
  - `BottomNav.dc.html` (mobile only)
- `CartDrawer.dc.html` is the slide-out cart.
- `Main.dc.html` is the design system (colours, type, buttons, badges, form fields, cards, Tailwind tokens).

## Pages

| Section file | Page | Suggested Astro route |
|---|---|---|
| HomeBody | Home | `/` |
| OurMenuBody | Our Menu (full price list) | `/menu` (old: `/shop/`) |
| MenuBody | Order Ahead (catalog) | `/order` |
| ProductBody | Drink detail (size, sugar, ice) | `/products/[handle]` |
| CartBody + CartDrawer | Cart | `/cart` |
| CheckoutBody | Checkout (pickup: contact → time → payment → review) | `/checkout` |
| ConfirmationBody | Order confirmed | `/order/confirmed` |
| EventsBody | Coffee Cart & Events | `/coffee-cart-events` |
| BookingBody | Coffee Cart booking | `/coffee-cart-events-booking-now` |
| AboutBody | About | `/about-us` |
| VisitBody | Visit Us | `/visit-us` |
| FaqBody | FAQ | `/faq` |
| BlogBody / ArticleBody | Blog list / post template | `/blogs`, `/blogs/[slug]` |
| AccountBody | My account | `/account` |
| NotFoundBody | 404 | `404.astro` |

Redirects to add from the old site: `/coffee-cart/` → `/coffee-cart-events/`, `/frequently-asked-questions/` → `/faq/`, `/shop/` → `/menu`.

## Design tokens (Tailwind v4)

```css
@theme {
  --color-espresso: #2B1A12;
  --color-roast: #5A3A28;
  --color-caramel: #E0A458;
  --color-caramel-ink: #8A4F17;
  --color-cream: #F7F0E4;
  --color-paper: #FFFBF4;
  --color-foam: #EFE4D2;
  --color-scrub: #2F6F6A;
  --color-scrub-50: #DCEBE8;
  --color-alert: #B5432A;
  --font-display: "Bricolage Grotesque", sans-serif;
  --font-sans: "DM Sans", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", monospace;
  --radius-card: 20px;
}
```

Fonts (Google Fonts): Bricolage Grotesque 500–800, DM Sans 400–700, IBM Plex Mono 400–600.

## Real data used (from the old site)

- 16 drinks in 5 series (Coffee, Milk Therapy, Yakult Gut Shot, Pulse Soda, Detoxi-Tea) with real prices. Coffee: hot/iced × Regular/Large; others ₱145 Regular / ₱170 Large; oat milk +₱20.
- Coffee cart packages: The Light Dose ₱8,000 (50 cups), The Full Prescription ₱12,000 (80 cups), The Emergency Brew Kit ₱18,000 (120 cups).
- Contact: 0932 723 3849 · thecallroombydc@gmail.com · Instagram @thecallroombydrcoffee · Facebook https://www.facebook.com/share/19KisJPYkX/
- Map: Madonna & Child Hospital — https://www.google.com/maps/place/Madonna+%26+Child+Hospital/@8.4771923,124.6352272,17z

Google Map embed for the Visit Us page (the design shows a still image):

```html
<iframe src="https://www.google.com/maps?q=Madonna+%26+Child+Hospital,+J.+Seri%C3%B1a+St,+Cagayan+de+Oro&ll=8.4771923,124.6352272&z=17&output=embed" width="100%" height="380" style="border:0" loading="lazy" title="Map to The Callroom, Madonna & Child Hospital"></iframe>
```

## Still to fill in

- Visit Us step 3: `[near LANDMARK]` (what's next to the kiosk)
- About: "Drink Coffee and Do Good" cause text
- Product page: size ounces `[oz]`
- Salted Caramel Drip uses the same photo as Caramel Remedy on the old site; reshoot.

## Notes on images

The photos were captured from callroomcoffee.com at about 950px (drinks originals are 1080px). For the live site, use the original files from the WordPress media library (`/wp-content/uploads/2026/09/`). The "Drink Coffee and Do Good" lettering is a new original made in Canva (https://canva.link/u39ope5y9yhwsfh); the old one had no known source.

Sample data in the design (order CR-0412, booking on 12 Dec, "Ana Reyes") is for illustration only.

---
Website by Digital Services Master
