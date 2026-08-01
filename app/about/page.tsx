import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { LegalNav, LegalProse } from "@/components/shared/legal-prose";
import { PageHeader } from "@/components/shared/page-header";
import { siteConfig } from "@/config/site.config";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About Guildrun Hub",
  description: `Learn what ${siteConfig.name} is, what data we cover for ${siteConfig.gameVersion}, and how this unofficial Guildrun wiki is built.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <Breadcrumb
        className="mb-4"
        items={[
          { label: "Home", href: "/" },
          { label: "About" },
        ]}
      />
      <PageHeader
        title="About"
        description={`What ${siteConfig.name} is for — and what it is not.`}
      />
      <LegalNav current="/about" />
      <LegalProse>
        <section className="space-y-3">
          <h2>What is Guildrun Hub?</h2>
          <p>
            {siteConfig.name} is an unofficial fan database and wiki for{" "}
            {siteConfig.game}, a single-player PvE roguelike autobattler from Leyline.
            The site focuses on fast lookups and decision support: heroes, relics,
            items, classes, combat keywords, builds, and guides.
          </p>
          <p>
            We are not a news portal or an official studio site. If you need patch
            announcements or store pages, use Steam or Leyline&apos;s official channels.
            If you need to compare a shop offer, check a hero kit, or plan a starter
            team, that is what this hub is for.
          </p>
        </section>

        <section className="space-y-3">
          <h2>What we cover</h2>
          <p>
            Current pages are maintained against <strong>{siteConfig.gameVersion}</strong>
            . Coverage includes:
          </p>
          <ul>
            <li>
              <Link href="/heroes">Heroes</Link> — classes, abilities, specializations,
              and synergy ideas
            </li>
            <li>
              <Link href="/relics">Relics</Link> — effects, rarity, and keyword links
            </li>
            <li>
              <Link href="/items">Items</Link> — stats and triggered effects
            </li>
            <li>
              <Link href="/classes">Classes</Link> — Warrior, Tank, Vanguard, Assassin,
              Duelist, Mystic, Mage
            </li>
            <li>
              <Link href="/keywords">Keywords</Link> — Rush, Crit, Shield, Burn, and
              other combat tags from in-game text
            </li>
            <li>
              <Link href="/builds">Builds</Link> and <Link href="/guides">Guides</Link> —
              curated comps and beginner-oriented tips
            </li>
          </ul>
          <p>{siteConfig.dataNotes}</p>
        </section>

        <section className="space-y-3">
          <h2>How the data is built</h2>
          <p>
            Entity text and structure come from localized game sheet dumps, then
            normalized into English-facing pages. Keywords are extracted from markup
            such as Rush or Crit tags inside relic and ability descriptions so related
            content can be linked without hand-tagging every row.
          </p>
          <p>
            Some numeric placeholders and unfinished sheet fields may still appear as
            the dataset expands. When that happens, we prefer clear English labels over
            inventing values.
          </p>
        </section>

        <section className="space-y-3">
          <h2>Affiliation</h2>
          <p>
            {siteConfig.name} is an independent fan project. It is{" "}
            <strong>not affiliated with, endorsed by, or connected to Leyline</strong> or
            the official {siteConfig.game} development team. Game names, characters,
            artwork, and trademarks belong to their respective rights holders. See our{" "}
            <Link href="/copyright">Copyright</Link> page for the full notice.
          </p>
        </section>

        <section className="space-y-3">
          <h2>Get in touch</h2>
          <p>
            Found a wrong effect, missing hero link, or broken page? Visit{" "}
            <Link href="/contact">Contact</Link> — corrections help everyone using the
            database.
          </p>
        </section>
      </LegalProse>
    </>
  );
}
