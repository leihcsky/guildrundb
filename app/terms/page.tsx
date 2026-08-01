import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { LegalNav, LegalProse } from "@/components/shared/legal-prose";
import { PageHeader } from "@/components/shared/page-header";
import { siteConfig } from "@/config/site.config";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description: `Terms of Service for ${siteConfig.name} — acceptable use, disclaimers, and limitations for this unofficial Guildrun wiki.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <Breadcrumb
        className="mb-4"
        items={[
          { label: "Home", href: "/" },
          { label: "Terms of Service" },
        ]}
      />
      <PageHeader
        title="Terms of Service"
        description={`Rules and disclaimers for using ${siteConfig.name}.`}
      />
      <p className="mb-6 text-sm text-muted-foreground">
        Last updated: {siteConfig.legalUpdatedAt}
      </p>
      <LegalNav current="/terms" />
      <LegalProse>
        <section className="space-y-3">
          <h2>Agreement</h2>
          <p>
            By accessing {siteConfig.name} at {siteConfig.url}, you agree to these Terms
            of Service. If you do not agree, please do not use the site.
          </p>
        </section>

        <section className="space-y-3">
          <h2>What the site provides</h2>
          <p>
            {siteConfig.name} offers unofficial reference material for {siteConfig.game},
            including databases and editorial guides related to heroes, relics, items,
            classes, builds, and keywords. Content is provided for informational and
            entertainment purposes only.
          </p>
          <p>
            Gameplay advice and numeric values may be incomplete, outdated after patches,
            or incorrect. Always verify critical details in the live game client.
          </p>
        </section>

        <section className="space-y-3">
          <h2>Unofficial status</h2>
          <p>
            {siteConfig.name} is a fan-made project and is not an official product of
            Leyline or the {siteConfig.game} development team. Use of game-related names
            and descriptive material does not imply endorsement. See{" "}
            <Link href="/copyright">Copyright</Link> for trademark and rights notices.
          </p>
        </section>

        <section className="space-y-3">
          <h2>Acceptable use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Attempt to disrupt, scrape abusively, or overload the site</li>
            <li>Use the site to distribute malware or illegal content</li>
            <li>
              Misrepresent {siteConfig.name} as an official Leyline or {siteConfig.game}{" "}
              product
            </li>
            <li>
              Copy site-original guides or curated builds for commercial republication
              without permission
            </li>
          </ul>
          <p>
            Fair-use quoting of short excerpts with attribution is generally fine for
            personal or community discussion.
          </p>
        </section>

        <section className="space-y-3">
          <h2>Intellectual property</h2>
          <p>
            Original site layout, branding for {siteConfig.name}, curated build write-ups,
            and original guide text are owned by the site operators unless otherwise
            noted. Game assets, names, and lore belong to their respective rights holders.
          </p>
        </section>

        <section className="space-y-3">
          <h2>No warranties</h2>
          <p>
            The site is provided &quot;as is&quot; without warranties of any kind,
            whether express or implied, including accuracy, completeness, or fitness for
            a particular purpose. We do not guarantee uninterrupted availability.
          </p>
        </section>

        <section className="space-y-3">
          <h2>Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, the operators of {siteConfig.name}{" "}
            are not liable for any indirect, incidental, or consequential damages
            arising from your use of the site or reliance on its content — including
            in-game outcomes, lost progress, or decisions made using our guides.
          </p>
        </section>

        <section className="space-y-3">
          <h2>External links</h2>
          <p>
            Links to Steam, Discord, or other third-party sites are provided for
            convenience. We are not responsible for the content or policies of those
            destinations.
          </p>
        </section>

        <section className="space-y-3">
          <h2>Privacy</h2>
          <p>
            How we handle information is described in the{" "}
            <Link href="/privacy">Privacy Policy</Link>.
          </p>
        </section>

        <section className="space-y-3">
          <h2>Changes</h2>
          <p>
            We may revise these terms from time to time. Continued use after an update
            constitutes acceptance of the revised terms. The &quot;Last updated&quot;
            date reflects the latest material change.
          </p>
        </section>

        <section className="space-y-3">
          <h2>Contact</h2>
          <p>
            Questions about these terms:{" "}
            <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>{" "}
            or <Link href="/contact">Contact</Link>.
          </p>
        </section>
      </LegalProse>
    </>
  );
}
