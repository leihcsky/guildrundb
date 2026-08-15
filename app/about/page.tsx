import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { LegalNav, LegalProse } from "@/components/shared/legal-prose";
import { PageHeader } from "@/components/shared/page-header";
import { siteConfig } from "@/config/site.config";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About Guildrun Hub",
  description: `Learn who runs ${siteConfig.name}, what data we cover for ${siteConfig.gameVersion}, and how this unofficial Guildrun wiki is edited.`,
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
        description={`Who runs ${siteConfig.name}, what we publish, and how we keep pages useful.`}
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
          <h2>Who operates this site</h2>
          <p>
            {siteConfig.name} is operated as an independent editorial project under the
            publishing name <strong>{siteConfig.creator}</strong>. There is no separate
            company entity behind the site. Day-to-day publishing, corrections, and
            policy pages are handled by the same project contact.
          </p>
          <p>
            Accountable contact for data fixes, copyright notices, privacy questions,
            and partnerships:{" "}
            <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
            . See <Link href="/contact">Contact</Link> for what to include in a report.
          </p>
          <p>
            Legal pages on this site were last reviewed on{" "}
            <strong>{siteConfig.legalUpdatedAt}</strong>.
          </p>
        </section>

        <section className="space-y-3">
          <h2>Editorial standards</h2>
          <p>
            We separate <strong>reference data</strong> from{" "}
            <strong>curated advice</strong>:
          </p>
          <ul>
            <li>
              Hero kits, relic effects, and item text are normalized from localized
              game sheets for {siteConfig.gameVersion}. We do not invent missing numbers.
            </li>
            <li>
              Builds, guides, class playbooks, and the tier list are written and
              reviewed as decision content — when to pick a line, what to skip, and how
              a composition is meant to play.
            </li>
            <li>
              Unfinished or disabled sheet rows (test items, boosters, empty stubs) are
              filtered out of public lists so the database does not look like a dump of
              half-finished export files.
            </li>
          </ul>
          <p>
            If in-game text and a page disagree after a patch, email the page URL and we
            will correct it. Balance advice can lag sheet updates; {siteConfig.dataNotes}
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
              <Link href="/builds">Builds</Link>, <Link href="/guides">Guides</Link>, and
              the <Link href="/tier-list">tier list</Link> — curated comps and strategy
            </li>
          </ul>
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
            Some numeric placeholders may still appear where the sheet only ships a
            template argument. When that happens, we prefer clear English labels over
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
