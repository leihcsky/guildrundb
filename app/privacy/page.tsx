import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { LegalNav, LegalProse } from "@/components/shared/legal-prose";
import { PageHeader } from "@/components/shared/page-header";
import { siteConfig } from "@/config/site.config";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: `Privacy policy for ${siteConfig.name} — cookies, Google Analytics, Google advertising technologies, and how to contact us.`,
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
            practical, and this policy explains what is processed when you visit —
            including cookies, analytics, and advertising technologies from Google and
            other third parties.
          </p>
        </section>

        <section className="space-y-3">
          <h2>Information we may process</h2>
          <h3>Technical and hosting logs</h3>
          <p>
            Like most websites, our hosting or CDN provider (currently Cloudflare) may
            automatically receive standard request data such as IP address, browser type,
            device information, referring URL, and timestamps. This information is used
            for security, reliability, performance, and abuse prevention.
          </p>
          <h3>Contact messages</h3>
          <p>
            If you email us at{" "}
            <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>,
            we receive whatever you include in that message (for example your email
            address and the content of your report). We use it only to respond and to
            improve the site.
          </p>
          <h3>Google Analytics</h3>
          <p>
            We use <strong>Google Analytics 4</strong> (measurement ID{" "}
            {siteConfig.googleAnalyticsId}) to understand aggregate traffic such as pages
            viewed, approximate geography, device type, and referral sources. Google may
            process IP addresses and cookies or similar identifiers under{" "}
            <a
              href="https://policies.google.com/privacy"
              rel="noopener noreferrer"
              target="_blank"
            >
              Google&apos;s Privacy Policy
            </a>
            . You can learn how Google uses data from sites that use its services at{" "}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              rel="noopener noreferrer"
              target="_blank"
            >
              How Google uses information from sites or apps that use our services
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2>Cookies, web beacons, and similar technologies</h2>
          <p>
            We and third parties may store or access information on your device using
            cookies, local storage, pixels/web beacons, or similar technologies. These
            may involve device identifiers and IP addresses.
          </p>
          <h3>Essential / preference storage</h3>
          <p>
            The site may store preferences locally in your browser — for example theme
            preference (light / dark / system). This storage is used for basic site
            functionality and is not used by us to track you across other websites.
          </p>
          <h3>Analytics cookies</h3>
          <p>
            Google Analytics may set or read cookies (or similar storage) to distinguish
            visits and measure how the site is used.
          </p>
          <h3>Advertising cookies (Google and partners)</h3>
          <p>
            When Google advertising products such as <strong>Google AdSense</strong> (or
            related Google ad services) are enabled on this site, third-party vendors —
            including Google — may place and read cookies on your browser, or use web
            beacons and IP addresses, to collect information as a result of ads being
            served.
          </p>
          <ul>
            <li>
              Third-party vendors, including Google, use cookies to serve ads based on a
              user&apos;s prior visits to this website or other websites.
            </li>
            <li>
              Google&apos;s use of advertising cookies enables it and its partners to
              serve ads to users based on their visit to this site and/or other sites on
              the Internet.
            </li>
            <li>
              Users may opt out of personalized advertising by visiting{" "}
              <a
                href="https://adssettings.google.com/"
                rel="noopener noreferrer"
                target="_blank"
              >
                Google Ads Settings
              </a>
              . Alternatively, you can opt out of some third-party vendors&apos; use of
              cookies for personalized advertising by visiting{" "}
              <a
                href="https://www.aboutads.info/choices/"
                rel="noopener noreferrer"
                target="_blank"
              >
                www.aboutads.info
              </a>
              .
            </li>
          </ul>
          <p>
            Additional third-party ad networks may also serve ads on this site. Where
            that happens, those vendors may use their own cookies or beacons under their
            own policies. We will keep this section updated as vendors change. For
            Google&apos;s partner-site practices, see{" "}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              rel="noopener noreferrer"
              target="_blank"
            >
              How Google uses information from sites or apps that use our services
            </a>
            .
          </p>
          <p>
            <strong>Current status:</strong> Google Analytics may run only after you
            allow Analytics in the cookie banner (or under Cookie settings in the
            footer). Google AdSense code is present on this site; ads display after
            Google approves the site. Advertising consent in the same banner controls
            related Google ad signals (Consent Mode).
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
            Besides Google, the site may load fonts, images, or infrastructure services
            from third-party providers (including Cloudflare). Those providers process
            requests under their own privacy policies. Embedded content (for example
            future video embeds) would also be subject to the third party&apos;s terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2>Children</h2>
          <p>
            The site is a general game reference for a broad audience. We do not
            knowingly collect personal information from children. If you believe a child
            has sent us personal data, contact us and we will delete it where reasonably
            possible. This site is not directed at children under 13 (or the equivalent
            age in your jurisdiction).
          </p>
        </section>

        <section className="space-y-3">
          <h2>Your choices</h2>
          <ul>
            <li>Use browser settings to block or clear cookies and local storage.</li>
            <li>
              Manage Google Analytics via browser controls or Google&apos;s available
              opt-out tools.
            </li>
            <li>
              Manage personalized ads via{" "}
              <a
                href="https://adssettings.google.com/"
                rel="noopener noreferrer"
                target="_blank"
              >
                Google Ads Settings
              </a>{" "}
              or{" "}
              <a
                href="https://www.aboutads.info/choices/"
                rel="noopener noreferrer"
                target="_blank"
              >
                aboutads.info
              </a>
              .
            </li>
            <li>
              Contact us to request deletion of information you sent by email, subject
              to ordinary backup and legal retention limits.
            </li>
          </ul>
          <p>
            A cookie consent banner appears on your first visit (and anytime you open{" "}
            <strong>Cookie settings</strong> in the footer). Non-essential Analytics and
            Advertising storage stays off until you accept or customize. We use Google
            Consent Mode so Google tags respect those choices. This supports privacy laws
            and Google&apos;s EU user consent policy for visitors in the EEA, UK, and
            Switzerland — and we show the same controls to all visitors for simplicity.
          </p>
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
