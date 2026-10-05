# site

Personal site of Brad López. Astro, static HTML, with React islands only where something is interactive. One route per page; English and Spanish switch in place.

```sh
pnpm install
pnpm dev      # drafts are visible here
pnpm check    # types, including that es.json has every key en.json has
pnpm build    # drafts are left out
```

## Where things live

- `src/i18n/en.json`, `src/i18n/es.json`: every text on the site, same shape in both. A key missing in either fails `pnpm check`. Variables use `{name}`.
- `src/components/T.astro`: a translatable text in Astro pages, `<T k="home.title" />`. It renders English and carries its key, so the client swaps it.
- `src/i18n/store.ts`: the shared language atom (`$lang`) and the `useT()` hook for React islands.
- `src/scripts/i18n.ts`: applies the visitor's language and handles the ES/EN switch. A pre-paint script in `BaseHead.astro` picks the saved choice or the browser's language, and `Base.astro` applies Spanish before the first paint.
- `src/scripts/motion.ts`: headline, titles, diagrams, live windows, theme switch. anime.js only.
- `src/components/islands/`: the race, the work tabs and the article demos. They load when they scroll into view.
- `src/content/writing/<lang>/<slug>.mdx`: articles; both languages render on one page and only the visitor's shows. `draft: true` never reaches a build.
- `public/fonts/`: the fonts, served from the site.

## Rules

- Sizes in `rem`, `em`, `%` and `vw`, fluid with `clamp()`; no `px` anywhere.
- Light, dark and system themes share one token set in `global.css`.
- Motion: transform, opacity and filter only; nothing moves under `prefers-reduced-motion`; content is visible without JavaScript.
