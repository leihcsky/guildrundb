import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { LegalNav, LegalProse } from "@/components/shared/legal-prose";
import { PageHeader } from "@/components/shared/page-header";
import { siteConfig } from "@/config/site.config";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: `Privacy policy for ${siteConfig.name} — what we collect, cookies, analytics, and how to contact us.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <Breadcrumb
        className="mb-4"
        items={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy" },
        ]}
      />
      <PageHeader
        title="Privacy Policy"
        description={`How ${siteConfig.name} handles information when you use the site.`}
      />
      <p className="mb-6 text-sm text-muted-foreground">
        Last updated: {siteConfig.legalUpdatedAt}
      </p>
      <LegalNav current="/privacy" />
      <LegalProse>
        <section className="space-y-3">
          <h2>Overview</h2>
          <p>
            {siteConfig.name} ({siteConfig.url}) is a public reference site for{" "}
            {siteConfig.game}. You can browse heroes, relics, items, builds, and guides
            without creating an account. We aim to collect as little personal data as
            practical.
          </p>
        </section>

        <section className="space-y-3">
          <h2>Information we may process</h2>
          <h3>Technical and hosting logs</h3>
          <p>
            Like most websites, our hosting or CDN provider may automatically receive
            standard request data such as IP address, browser type, device information,
            referring URL, and timestamps. This information is used for security,
            reliability, and abuse prevention.
          </p>
          <h3>Contact messages</h3>
          <p>
            If you email us at{" "}
            <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>,
            we receive whatever you include in that message (for example your email
            address and the content of your report). We use it only to respond and to
            improve the site.
          </p>
          <h3>Analytics</h3>
          <p>
            We use <strong>Google Analytics 4</strong> (measurement ID{" "}
            {siteConfig.googleAnalyticsId}) to understand aggregate traffic such as
            pages viewed, approximate geography, device type, and referral sources.
            Google may process IP address and cookie or similar identifiers under its
            own privacy policy. You can learn more at{" "}
            <a
              href="https://policies.google.com/privacy"
              rel="noopener noreferrer"
              target="_blank"
            >
              Google&apos;s Privacy Policy
            </a>{" "}
            and opt out of Google Analytics via browser add-ons or your browser
            settings where available.
          </p>
          <p>
            We may also use hosting or CDN dashboards (for example Cloudflare) that
            summarize request logs for security and reliability.
          </p>
        </section>

        <section className="space-y-3">
          <h2>Cookies and local storage</h2>
          <p>
            The site may store preferences locally in your browser — for example theme
            preference (light / dark / system). Essential cookies or local storage used
            for basic functionality are not used to track you across other websites.
          </p>
          <p>
            Google Analytics may set or read cookies (or similar storage) to distinguish
            visits. If advertising or additional marketing cookies are added later, we
            will update this page before those features go live.
          </p>
        </section>

        <section className="space-y-3">
          <h2>Accounts</h2>
          <p>
            {siteConfig.name} does not currently require user accounts, logins, or
            passwords. If account features are added in the future, we will explain what
            account data is stored before signup becomes available.
          </p>
        </section>

        <section className="space-y-3">
          <h2>Third-party services</h2>
          <p>
            The site may load fonts, images, or infrastructure services from third-party
            providers. Those providers process requests under their own privacy
            policies. Embedded content (for example future video embeds) would also be
            subject to the third party&apos;s terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2>Children</h2>
          <p>
            The site is a general game reference. We do not knowingly collect personal
            information from children. If you believe a child has sent us personal data,
            contact us and we will delete it where reasonably possible.
          </p>
        </section>

        <section className="space-y-3">
          <h2>Your choices</h2>
          <ul>
            <li>Use browser settings to clear cookies and local storage.</li>
            <li>
              Contact us to request deletion of information you sent by email, subject
              to ordinary backup and legal retention limits.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2>Changes</h2>
          <p>
            We may update this Privacy Policy as the site evolves. The &quot;Last
            updated&quot; date at the top of this page will change when material
            revisions are published.
          </p>
        </section>

        <section className="space-y-3">
          <h2>Contact</h2>
          <p>
            Privacy questions:{" "}
            <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>{" "}
            or use the <Link href="/contact">Contact</Link> page.
          </p>
        </section>
      </LegalProse>
    </>
  );
}
