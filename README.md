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

- **The offer:** the sprint is not sold on its own. It is bundled into an AI Writing
  Skool membership, and AIWS has a 30-day free trial — so the page's price is "FREE"
  and the ask is "start the trial." The `#trial` section right below the hero exists to
  explain that before anyone scrolls further.
- **Checkout:** all 6 CTAs point at the SamCart checkout for the AIWS 30-day free
  trial with the sprint bundled in
  (`https://ship.samcart.com/products/ai-writing-skool-30-day-free-trial-sprint-addon`).
  Search `data-cta` in `index.html` to find them all. The footer's two plain
  "AI Writing Skool" links are deliberately different — they point at the Skool
  community page, since they're navigation rather than a buy button.
- **Countdown:** both timers count down to `SWO_OFFER.sprintStart` — the ISO timestamp
  in the config script at the top of `index.html`. Set it to the first live session.
  Once it passes, the timers zero out and read "The sprint is underway."
- **Analytics:** Fathom (site `IUQCZTMO`), loaded in `<head>`. CTA clicks and FAQ opens
  are tracked as events by the script at the bottom of the page.
- **Images:** the design's PNGs are stored as WebP (~1.5 MB total, down from ~17 MB).
  The two logos embedded in inline SVG (`asset-01`, `asset-26`) stay PNG.
