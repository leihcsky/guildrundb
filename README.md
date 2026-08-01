# Guildrun DB

Player-focused database site for **Guildrun** — heroes, relics, items, builds, and guides.

Built as a Phase 1 MVP: JSON/Markdown content, SEO-friendly App Router pages, no database / admin / auth.

## Stack

- Next.js 15 (App Router)
- React 19 + TypeScript (strict)
- Tailwind CSS + shadcn-style UI primitives
- Local content under `/content`
- Data access isolated in `lib/data.ts`
- Site branding/config in `config/site.config.ts`

## Brand assets

All logo and favicon files live under `public/brand/`:

```text
public/brand/
  logo.svg              # Header logo (~160×40, SVG)
  logo-mark.svg         # Square icon mark (32×32+)
  favicon.svg           # Browser tab icon
  apple-touch-icon.svg  # Replace with 180×180 PNG for production iOS
  og-default.svg        # Social share image (1200×630; PNG also OK)
```

Paths are configured in `config/site.config.ts` → `branding`. Replace the files when cloning for another game; no code changes needed unless dimensions differ.

The header uses `components/brand/site-logo.tsx`, which reads from `siteConfig.branding`.

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content

Edit JSON / Markdown files:

```text
content/heroes.json
content/relics.json
content/items.json
content/builds.json
content/guides/*.md
```

Pages never import JSON directly — they call helpers from `lib/data.ts`.

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Local development server |
| `npm run build`| Production build         |
| `npm run start`| Serve production build   |
| `npm run lint` | ESLint                   |
| `npm run format` | Prettier               |

## Deploy

Target: Cloudflare Pages (or any Next.js host). Set:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```
