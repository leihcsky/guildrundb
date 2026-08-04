export const siteConfig = {
  name: "Guildrun Hub",
  shortName: "GuildrunHub",
  game: "Guildrun",
  description:
    "Guildrun wiki for heroes, relics, items, classes, builds, and guides.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://guildrunhub.online",
  locale: "en_US",
  creator: "Guildrun Hub",
  gameVersion: "Demo 0.5.2",
  contactEmail: "contact@guildrunhub.online",
  /** Google Analytics 4 measurement ID (gtag.js). */
  googleAnalyticsId: "G-MN3QZETG27",
  dataNotes:
    "Database extracted from Guildrun Demo 0.5.2 game sheets. Balance-sensitive values may change with future patches.",
  legalUpdatedAt: "2026-08-04",
  faq: [
    {
      question: "What is Guildrun?",
      answer:
        "Guildrun is a single-player PvE roguelike autobattler from Leyline. You draft heroes, pick items and relics, set formations, and combat resolves automatically while you plan shop and route decisions between fights.",
    },
    {
      question: "Which game version does Guildrun Hub cover?",
      answer:
        "Heroes, relics, items, classes, and abilities on this site are maintained against Guildrun Demo 0.5.2. Recheck values after major balance patches.",
    },
    {
      question: "How should a new player start?",
      answer:
        "Browse the hero roster to learn classes and abilities, then explore relics and builds for starter comps. Use keywords like Rush or Crit to find related relics when you spot a effect in-game.",
    },
    {
      question: "Where can I find hero, relic, and item data?",
      answer:
        "Open Heroes for class, abilities, and specializations. Relics and Items list full effects and rarity. Builds and Guides offer curated team comps and strategy tips.",
    },
    {
      question: "Is Guildrun Hub an official website?",
      answer:
        "No. Guildrun Hub is an unofficial fan database and is not affiliated with, endorsed by, or connected to Leyline or the Guildrun development team.",
    },
  ],
  /**
   * Persistent chrome disclosure (header strip). Keep short; full legal copy lives on /about and /copyright.
   */
  unofficialBanner: {
    text: "Unofficial fan wiki · Demo 0.5.2 · Not affiliated with Leyline",
    linkLabel: "About this site",
    href: "/about",
  },
  seo: {
    // Query-facing: lead with "Guildrun wiki". Unofficial disclosure lives in chrome / About, not meta.
    homeTitle: "Guildrun Wiki — Heroes, Relics, Items & Builds",
    homeDescription:
      "Guildrun wiki for Demo 0.5.2 — searchable heroes, 300+ relics, items, classes, builds, and guides. Look up stats, effects, and synergies.",
    lists: {
      heroes: {
        title: "Guildrun Heroes — Roster, Classes & Abilities",
        description:
          "Browse all 25 Guildrun heroes with classes, abilities, specializations, and synergy relics.",
      },
      relics: {
        title: "Relic Index — Effects, Rarity & Keywords",
        description:
          "Search 300+ Guildrun relics by name, rarity, and combat keywords like Rush, Crit, and Shield.",
      },
      items: {
        title: "Item Index — Stats, Triggers & Pairings",
        description:
          "Browse Guildrun items with stats, triggered effects, and recommended hero pairings.",
      },
      classes: {
        title: "Class Index — Roles, Keywords & Synergies",
        description:
          "Explore all 7 Guildrun hero classes, signature keywords, and class-specific relic synergies.",
      },
      builds: {
        title: "Team Builds & Comp Notes",
        description:
          "Curated Guildrun team builds with core heroes, relics, playstyles, and starter comps.",
      },
      guides: {
        title: "Strategy Guides & Demo Tips",
        description:
          "Read Guildrun guides covering drafting, builds, relic picks, and demo progression.",
      },
      keywords: {
        title: "Keyword Hub — Rush, Crit, Shield & More",
        description:
          "Combat and class keywords from in-game text — find related relics, abilities, and classes.",
      },
    },
  },
  /**
   * Brand assets live under /public/brand/.
   * Replace files in place when cloning this template for another game.
   *
   * Recommended specs:
   * - logo.svg          — header logo, ~160×40 (SVG preferred)
   * - logo-mark.svg     — square icon, 32×32+
   * - favicon.svg       — browser tab icon, 32×32
   * - apple-touch-icon.png — 180×180 PNG for iOS home screen
   * - og-default.png    — 1200×630 for social sharing
   */
  branding: {
    logo: "/brand/logo.svg",
    logoMark: "/brand/logo-mark.svg",
    favicon: "/brand/favicon.svg",
    appleTouchIcon: "/brand/apple-touch-icon.svg",
    ogImage: "/brand/og-default.svg",
  },
  logo: {
    showText: true,
    width: 140,
    height: 36,
    markSize: 32,
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Heroes", href: "/heroes" },
    { label: "Relics", href: "/relics" },
    { label: "Items", href: "/items" },
    { label: "Classes", href: "/classes" },
    { label: "Builds", href: "/builds" },
    { label: "Guides", href: "/guides" },
    { label: "Keywords", href: "/keywords" },
  ],
  footer: {
    explore: [
      { label: "Heroes", href: "/heroes" },
      { label: "Relics", href: "/relics" },
      { label: "Items", href: "/items" },
      { label: "Builds", href: "/builds" },
      { label: "Guides", href: "/guides" },
    ],
    legal: [
      { label: "About", href: "/about" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Copyright", href: "/copyright" },
      { label: "Contact", href: "/contact" },
    ],
  },
  quickNav: [
    {
      label: "Heroes",
      href: "/heroes",
      description: "Roster, classes, abilities, and synergies",
    },
    {
      label: "Relics",
      href: "/relics",
      description: "Effects, rarity, and synergies",
    },
    {
      label: "Items",
      href: "/items",
      description: "Gear stats and recommended pairings",
    },
    {
      label: "Builds",
      href: "/builds",
      description: "Core comps and playstyles",
    },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
