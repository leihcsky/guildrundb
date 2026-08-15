import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { LegalNav, LegalProse } from "@/components/shared/legal-prose";
import { PageHeader } from "@/components/shared/page-header";
import { siteConfig } from "@/config/site.config";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: `Contact ${siteConfig.name} for data corrections, copyright notices, partnerships, or general feedback about this Guildrun wiki.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <Breadcrumb
        className="mb-4"
        items={[
          { label: "Home", href: "/" },
          { label: "Contact" },
        ]}
      />
      <PageHeader
        title="Contact"
        description={`Reach the ${siteConfig.name} team.`}
      />
      <LegalNav current="/contact" />
      <LegalProse>
        <section className="space-y-3">
          <h2>Email</h2>
          <p>
            Primary contact for {siteConfig.name} ({siteConfig.creator}):{" "}
            <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
          </p>
          <p>
            This inbox is the same accountable contact listed on{" "}
            <Link href="/about">About</Link> for data corrections, copyright notices,
            privacy questions, and partnerships. We read every message, but response
            time may vary depending on volume. For the fastest fix, include the page
            URL and what looks wrong.
          </p>
        </section>

        <section className="space-y-3">
          <h2>What to write about</h2>
          <ul>
            <li>
              <strong>Data corrections</strong> — wrong relic text, missing hero ability,
              outdated {siteConfig.gameVersion} values
            </li>
            <li>
              <strong>Content ideas</strong> — guide topics, build requests, feature
              suggestions
            </li>
            <li>
              <strong>Copyright / takedown</strong> — rights-holder notices (see{" "}
              <Link href="/copyright">Copyright</Link>)
            </li>
            <li>
              <strong>Partnerships</strong> — community cross-links, non-commercial
              collaborations
            </li>
            <li>
              <strong>Privacy</strong> — questions covered by our{" "}
              <Link href="/privacy">Privacy Policy</Link>
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2>Useful details for bug reports</h2>
          <ul>
            <li>Full page URL (for example /heroes/irini)</li>
            <li>What you expected vs what you saw</li>
            <li>Browser and device, if the issue is visual</li>
            <li>Screenshot when helpful</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2>Before you email</h2>
          <p>
            Many answers are already on the site:
          </p>
          <ul>
            <li>
              <Link href="/about">About</Link> — what we cover and affiliation
            </li>
            <li>
              <Link href="/">Home FAQ</Link> — common player questions
            </li>
            <li>
              <Link href="/terms">Terms of Service</Link> — usage rules
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2>Official game support</h2>
          <p>
            {siteConfig.name} cannot help with Steam refunds, account issues, or
            official bug reports. For those, use Leyline / Steam support channels for{" "}
            {siteConfig.game}.
          </p>
        </section>
      </LegalProse>
    </>
  );
}
