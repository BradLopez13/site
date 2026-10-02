# site

Personal site of Brad López, in English (`/`) and Spanish (`/es/`). Astro, static HTML, with React islands only where something is interactive.

```sh
pnpm install
pnpm dev      # drafts are visible here
pnpm check    # types, including that es.json has every key en.json has
pnpm build    # drafts are left out
```

## Where things live

- `src/i18n/en.json`, `src/i18n/es.json`: every interface string. `en.json` is the source of truth; a key missing in `es.json` fails `pnpm check`. Variables use `{name}` and `fmt()` fills them.
- `src/content/<collection>/<lang>/<slug>.mdx`: articles and case studies, one file per language with the same slug. `draft: true` never reaches a build. Company cases also need `cleared: true`, set only after checking the contract.
- `src/pages/[...lang]/`: one page file serves both languages.
- `src/components/islands/`: the interactive parts (the API game, the race, the backend tour, tabs, timeline). They load when they scroll into view.
- `src/data/`: what does not change with the language: real code from reservas, stacks, ids.

## Rules

- Sizes in `rem` and `em`, fluid with `clamp()`; no `px`.
- Motion follows the animacion-ui principles: transform, opacity and filter only, entrances when a block scrolls into view, nothing moves under `prefers-reduced-motion`.
