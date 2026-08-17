# Start Writing Online Sprint — landing page

A single static landing page for the Start Writing Online Sprint. No framework — one
`index.html` with inline CSS and vanilla JS, built and served through Vite.

## Structure

- `index.html` — the entire page (styles, markup, countdown timer, testimonial carousel, FAQ)
- `public/images/swo/` — illustrations, product shots, and logos used by the page
- `public/images/`, `public/fonts/` — assets from earlier versions of the page

## Develop

```
npm install
npm run dev      # local dev server at http://localhost:5173
npm run build    # outputs to dist/
npm run preview  # serve the built dist/
```

## Things to know

- **Checkout:** every purchase CTA points at the SamCart checkout
  (`https://ship.samcart.com/products/start-writing-online-sprint?coupon=SAVE50`).
  Search `data-cta` in `index.html` to find them all.
- **Countdown:** the cart timer reads `data-deadline` on `#cartCountdown` in `index.html`.
  Update that ISO timestamp to change the deadline; with no attribute it falls back to
  the upcoming Monday at midnight local time.
- **Analytics:** Fathom (site `IUQCZTMO`), loaded in `<head>`. CTA clicks and FAQ opens
  are tracked as events by the script at the bottom of the page.
- **Images:** the design's PNGs are stored as WebP (~1.5 MB total, down from ~17 MB).
  The two logos embedded in inline SVG (`asset-01`, `asset-26`) stay PNG.
