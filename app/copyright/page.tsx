import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { LegalNav, LegalProse } from "@/components/shared/legal-prose";
import { PageHeader } from "@/components/shared/page-header";
import { siteConfig } from "@/config/site.config";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Copyright & Trademark Notice",
  description: `Copyright and trademark notice for ${siteConfig.name} — unofficial fan site disclaimer for ${siteConfig.game} and Leyline assets.`,
  path: "/copyright",
});

export default function CopyrightPage() {
  return (
    <>
      <Breadcrumb
        className="mb-4"
        items={[
          { label: "Home", href: "/" },
          { label: "Copyright" },
        ]}
      />
      <PageHeader
        title="Copyright & Trademark"
        description="Ownership notice for game assets and this fan site."
      />
      <p className="mb-6 text-sm text-muted-foreground">
        Last updated: {siteConfig.legalUpdatedAt}
      </p>
      <LegalNav current="/copyright" />
      <LegalProse>
        <section className="space-y-3">
          <h2>Unofficial fan site</h2>
          <p>
            {siteConfig.name} is an <strong>unofficial fan website</strong>. It is not
            affiliated with, endorsed by, sponsored by, or connected to Leyline, the
            developers of {siteConfig.game}, or any related company.
          </p>
        </section>

        <section className="space-y-3">
          <h2>Game trademarks and assets</h2>
          <p>
            {siteConfig.game}, related character names, class names, item and relic
            names, logos, artwork, screenshots, audio, and other game materials are
            trademarks or copyrights of their respective rights holders (including
            Leyline and partners). All rights remain with those owners.
          </p>
          <p>
            Descriptive text, icons, and images shown on this site are used for
            identification, commentary, and reference purposes related to a video game
            database. No challenge to ownership is intended.
          </p>
        </section>

        <section className="space-y-3">
          <h2>Site-original content</h2>
          <p>
            Unless otherwise noted, original contributions created for {siteConfig.name}
            — including site branding for &quot;{siteConfig.name}&quot;, curated build
            write-ups, keyword summaries, and guide prose authored for this project —
            are copyrighted by the site operators.
          </p>
          <p>
            You may link to our pages freely. Republishing substantial original guides
            or builds elsewhere for commercial use requires prior written permission.
          </p>
        </section>

        <section className="space-y-3">
          <h2>Fair use / fair dealing</h2>
          <p>
            Short quotations of game text for the purpose of explaining mechanics,
            comparing relics, or documenting hero abilities are intended to fall under
            applicable fair use or fair dealing exceptions for criticism, comment, and
            informational reference. If you are a rights holder and believe material is
            used inappropriately, please contact us — we will review and respond in good
            faith.
          </p>
        </section>

        <section className="space-y-3">
          <h2>DMCA / takedown requests</h2>
          <p>
            To request removal of specific content, email{" "}
            <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>{" "}
            with:
          </p>
          <ul>
            <li>Your contact information and proof of authority to act for the owner</li>
            <li>A description of the copyrighted work</li>
            <li>The exact URL(s) on {siteConfig.url} you want reviewed</li>
            <li>A good-faith statement that the use is not authorized</li>
          </ul>
          <p>
            We will investigate and remove or revise material where appropriate.
          </p>
        </section>

        <section className="space-y-3">
          <h2>Related policies</h2>
          <ul>
            <li>
              <Link href="/terms">Terms of Service</Link>
            </li>
            <li>
              <Link href="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
          </ul>
        </section>
      </LegalProse>
    </>
  );
}
