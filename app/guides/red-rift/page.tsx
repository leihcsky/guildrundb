import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { siteConfig } from "@/config/site.config";
import { RED_RIFT_FAQ, RED_RIFT_GUIDE } from "@/lib/red-rift-meta";
import {
  breadcrumbJsonLd,
  buildGameEntityMetadata,
  entityJsonLd,
  faqJsonLd,
} from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = buildGameEntityMetadata({
  name: RED_RIFT_GUIDE.title,
  kind: "guide",
  description: RED_RIFT_GUIDE.description,
  path: `/guides/${RED_RIFT_GUIDE.slug}`,
});

const HERO_LINKS = {
  pimenta: "/heroes/pimenta",
  ming: "/heroes/ming",
  rip: "/heroes/rip",
  kai: "/heroes/kai",
  nyx: "/heroes/nyx",
  aria: "/heroes/aria",
  funke: "/heroes/funke",
  irini: "/heroes/irini",
  reyna: "/heroes/reyna",
  grace: "/heroes/grace",
  fiona: "/heroes/fiona",
  gustav: "/heroes/gustav",
  niklas: "/heroes/niklas",
  karsu: "/heroes/karsu",
  sal: "/heroes/sal",
} as const;

function HeroLink({ slug, label }: { slug: keyof typeof HERO_LINKS; label: string }) {
  return (
    <Link href={HERO_LINKS[slug]} className="underline-offset-2 hover:underline">
      {label}
    </Link>
  );
}

export default function RedRiftGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Guides", path: "/guides" },
              {
                name: RED_RIFT_GUIDE.title,
                path: `/guides/${RED_RIFT_GUIDE.slug}`,
              },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            entityJsonLd({
              type: "Article",
              name: RED_RIFT_GUIDE.title,
              description: RED_RIFT_GUIDE.description,
              path: `/guides/${RED_RIFT_GUIDE.slug}`,
              dateModified: RED_RIFT_GUIDE.updatedAt,
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(RED_RIFT_FAQ)),
        }}
      />

      <Breadcrumb
        className="mb-6"
        items={[
          { label: "Home", href: "/" },
          { label: "Guides", href: "/guides" },
          { label: "Red Rift" },
        ]}
      />

      <article className="mx-auto max-w-3xl space-y-10">
        <header className="space-y-3">
          <h1 className="font-display text-4xl font-bold">
            {RED_RIFT_GUIDE.title}
          </h1>
          <p className="text-lg text-muted-foreground">
            {RED_RIFT_GUIDE.description}
          </p>
          <p className="text-sm text-muted-foreground">
            Updated {formatDate(RED_RIFT_GUIDE.updatedAt)} ·{" "}
            {siteConfig.gameVersion} · unofficial clear guide
          </p>
        </header>

        <nav className="flex flex-wrap gap-2 text-sm">
          {[
            { id: "what-is-red-rift", label: "What is it?" },
            { id: "strategy", label: "Strategy" },
            { id: "best-heroes", label: "Heroes" },
            { id: "builds", label: "Builds" },
            { id: "tier-list", label: "Tier list" },
            { id: "faq", label: "FAQ" },
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="rounded-md border border-border px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <section id="what-is-red-rift" className="scroll-mt-24 space-y-3">
          <h2 className="font-display text-2xl font-semibold">
            What is Red Rift?
          </h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              In Guildrun Demo, <strong className="text-foreground">Red Rift</strong>{" "}
              is the <strong className="text-foreground">top difficulty rung</strong>{" "}
              — the end of the eight-step ladder:
            </p>
            <p className="rounded-lg border border-border bg-card/50 px-4 py-3 text-sm text-foreground">
              Base → C → B → A → S → SS → SSS → <strong>Red Rift</strong>
            </p>
            <p>
              Each higher rung{" "}
              <strong className="text-foreground">stacks modifiers</strong> from
              every rung below it. On Red Rift you are effectively playing with the
              full pile: early HP pressure, tighter Shard income, item-rank caps,
              and every other ladder penalty you unlocked on the way up. That is why
              boards that “felt fine” on SSS suddenly collapse in Act 1.
            </p>
            <p>
              Players searching <em>guildrun red rift</em> almost always want the
              same thing: <strong className="text-foreground">how do I unlock
              it, and how do I clear both Acts?</strong> — not lore, and not the
              Unique relic also named “The Red Rift” in the database.
            </p>
          </div>
        </section>

        <section id="strategy" className="scroll-mt-24 space-y-4">
          <h2 className="font-display text-2xl font-semibold">
            Red Rift Strategy
          </h2>
          <p className="text-muted-foreground">
            Red Rift punishes Endless-mode greed. Survive first, finish missions
            second, build the dream board only after the frontline is honest.
          </p>

          <h3 className="text-lg font-semibold">1. Cover three jobs every run</h3>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>
              <strong className="text-foreground">Tank / first contact</strong> —
              someone who eats the opener (
              <HeroLink slug="pimenta" label="Pimenta" />,{" "}
              <HeroLink slug="ming" label="Ming" />,{" "}
              <HeroLink slug="rip" label="Rip" />,{" "}
              <HeroLink slug="kai" label="Kai" />).
            </li>
            <li>
              <strong className="text-foreground">Reliable clear / carry</strong>{" "}
              — damage that fires in Act 1, not only Act 2 fantasy (
              <HeroLink slug="nyx" label="Nyx" />,{" "}
              <HeroLink slug="aria" label="Aria" />,{" "}
              <HeroLink slug="funke" label="Funke" />,{" "}
              <HeroLink slug="reyna" label="Reyna" />,{" "}
              <HeroLink slug="irini" label="Irini" />).
            </li>
            <li>
              <strong className="text-foreground">Sustain</strong> — Shields,
              heals, or Stall peel (
              <HeroLink slug="grace" label="Grace" />,{" "}
              <HeroLink slug="fiona" label="Fiona" />,{" "}
              <HeroLink slug="gustav" label="Gustav" />).
            </li>
          </ul>

          <h3 className="text-lg font-semibold">2. Act 1 rules (where most runs die)</h3>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>
              Get <strong className="text-foreground">one carry to Rank B</strong>{" "}
              and itemized before the Act 1 challenge spike.
            </li>
            <li>
              Prefer <strong className="text-foreground">three geared heroes</strong>{" "}
              over four empty slots. Buying board size early is a common Red Rift
              trap.
            </li>
            <li>
              Starting mana / early Shields / Attack Speed beat “more Attack” when
              casts never happen.
            </li>
            <li>
              Fix <strong className="text-foreground">positioning</strong> after
              every loss — dive and splash delete Mystics before the tank falls.
            </li>
          </ul>

          <h3 className="text-lg font-semibold">3. Act 2 and dragons</h3>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>
              Once stable, fill item slots, finish the Anchor / mission track, and
              keep a <strong className="text-foreground">Backup</strong> piece that
              still contributes.
            </li>
            <li>
              Fully equipped mid ranks often beat naked higher ranks on this
              ladder.
            </li>
            <li>
              Dragon notes (community / clear guides): Fire punishes weak
              backlines — bring Shields/heals. Poison is usually the most
              forgiving. Frost pressures tanks — Frost control or extra peel helps.
            </li>
            <li>
              Watch <strong className="text-foreground">hero death limits</strong>.
              Killing a dragon while over the death cap still loses the fight.
            </li>
          </ul>

          <h3 className="text-lg font-semibold">4. Shop habits that end runs</h3>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>Forcing the same “favorite six” every attempt instead of pivoting.</li>
            <li>Skipping sustain to chase raw DPS.</li>
            <li>Letting a fragile carry tank the opener (classic{" "}
              <HeroLink slug="nyx" label="Nyx" /> failure mode).</li>
            <li>Taking off-theme Epics you cannot trigger yet.</li>
          </ul>
        </section>

        <section id="best-heroes" className="scroll-mt-24 space-y-4">
          <h2 className="font-display text-2xl font-semibold">
            Best Heroes for Red Rift
          </h2>
          <p className="text-muted-foreground">
            Priority for <em>first clears</em> — flexible job coverage beats a
            fixed “meta six.” Open each hero guide for shop / Rank B decisions.
          </p>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[28rem] text-left text-sm">
              <thead className="border-b border-border bg-card/60 text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Job</th>
                  <th className="px-3 py-2 font-medium">Strong picks</th>
                  <th className="px-3 py-2 font-medium">Why on Red Rift</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/80">
                  <td className="px-3 py-2 text-foreground">Frontline</td>
                  <td className="px-3 py-2">
                    <HeroLink slug="pimenta" label="Pimenta" />,{" "}
                    <HeroLink slug="ming" label="Ming" />,{" "}
                    <HeroLink slug="rip" label="Rip" />,{" "}
                    <HeroLink slug="kai" label="Kai" />
                  </td>
                  <td className="px-3 py-2">
                    Hold Act 1 openers; Defense / Max HP / Shield loops
                  </td>
                </tr>
                <tr className="border-b border-border/80">
                  <td className="px-3 py-2 text-foreground">Carry</td>
                  <td className="px-3 py-2">
                    <HeroLink slug="nyx" label="Nyx" />,{" "}
                    <HeroLink slug="aria" label="Aria" />,{" "}
                    <HeroLink slug="funke" label="Funke" />,{" "}
                    <HeroLink slug="reyna" label="Reyna" />,{" "}
                    <HeroLink slug="irini" label="Irini" />
                  </td>
                  <td className="px-3 py-2">
                    Clear + boss damage once protected
                  </td>
                </tr>
                <tr className="border-b border-border/80">
                  <td className="px-3 py-2 text-foreground">Sustain</td>
                  <td className="px-3 py-2">
                    <HeroLink slug="grace" label="Grace" />,{" "}
                    <HeroLink slug="fiona" label="Fiona" />,{" "}
                    <HeroLink slug="gustav" label="Gustav" />
                  </td>
                  <td className="px-3 py-2">
                    Shields / Stall clutch when splash deletes the backline
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-foreground">Flex / economy</td>
                  <td className="px-3 py-2">
                    <HeroLink slug="niklas" label="Niklas" />,{" "}
                    <HeroLink slug="karsu" label="Karsu" />,{" "}
                    <HeroLink slug="sal" label="Sal" />
                  </td>
                  <td className="px-3 py-2">
                    Items, ranged Frost, or Pimenta+Sal formation packages
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="builds" className="scroll-mt-24 space-y-4">
          <h2 className="font-display text-2xl font-semibold">
            Best Red Rift Builds
          </h2>
          <p className="text-muted-foreground">
            Templates, not scripts. Pivot when the shop hands you a better frame.
          </p>
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-4 space-y-2">
              <h3 className="font-semibold text-foreground">Standard Trinity</h3>
              <p className="text-sm text-muted-foreground">
                Tank + carry + Mystic sustain. Example:{" "}
                <HeroLink slug="pimenta" label="Pimenta" /> /{" "}
                <HeroLink slug="ming" label="Ming" /> +{" "}
                <HeroLink slug="aria" label="Aria" /> /{" "}
                <HeroLink slug="funke" label="Funke" /> +{" "}
                <HeroLink slug="grace" label="Grace" /> /{" "}
                <HeroLink slug="fiona" label="Fiona" />. Best first-clear shape.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 space-y-2">
              <h3 className="font-semibold text-foreground">Protected hyper-carry</h3>
              <p className="text-sm text-muted-foreground">
                One scaling DPS (
                <HeroLink slug="nyx" label="Nyx" />,{" "}
                <HeroLink slug="irini" label="Irini" />,{" "}
                <HeroLink slug="reyna" label="Reyna" />) with everyone else buying
                that carry time. Works when Act 1 already points at a spike hero —
                do not force it from an empty shop.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 space-y-2">
              <h3 className="font-semibold text-foreground">Rush frontline</h3>
              <p className="text-sm text-muted-foreground">
                <HeroLink slug="ming" label="Ming" /> /{" "}
                <HeroLink slug="rip" label="Rip" /> + Rush relics, with a safe
                carry behind. Strong when Rush pieces appear early; weak if Rush
                never triggers.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 space-y-2">
              <h3 className="font-semibold text-foreground">
                Formation pair (Pimenta + Sal)
              </h3>
              <p className="text-sm text-muted-foreground">
                Lover specs want Sal behind Pimenta. Add a third damage or sustain
                piece so the pair is not your whole Act 2 plan.
              </p>
            </div>
          </div>
        </section>

        <section id="tier-list" className="scroll-mt-24 space-y-4">
          <h2 className="font-display text-2xl font-semibold">
            Red Rift Tier List
          </h2>
          <p className="text-muted-foreground">
            Practical priority for{" "}
            <strong className="text-foreground">Demo first clears</strong> — not a
            PvP ladder. Shop RNG still rules; this is “what to value when offered.”
          </p>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[28rem] text-left text-sm">
              <thead className="border-b border-border bg-card/60 text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Tier</th>
                  <th className="px-3 py-2 font-medium">Heroes</th>
                  <th className="px-3 py-2 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/80">
                  <td className="px-3 py-2 font-medium text-foreground">S</td>
                  <td className="px-3 py-2">
                    <HeroLink slug="pimenta" label="Pimenta" />,{" "}
                    <HeroLink slug="grace" label="Grace" />,{" "}
                    <HeroLink slug="ming" label="Ming" />,{" "}
                    <HeroLink slug="nyx" label="Nyx" />*
                  </td>
                  <td className="px-3 py-2">
                    Frontline / clutch sustain / Rush tank. *Nyx only with a real
                    opener tank.
                  </td>
                </tr>
                <tr className="border-b border-border/80">
                  <td className="px-3 py-2 font-medium text-foreground">A</td>
                  <td className="px-3 py-2">
                    <HeroLink slug="aria" label="Aria" />,{" "}
                    <HeroLink slug="fiona" label="Fiona" />,{" "}
                    <HeroLink slug="kai" label="Kai" />,{" "}
                    <HeroLink slug="rip" label="Rip" />,{" "}
                    <HeroLink slug="funke" label="Funke" />,{" "}
                    <HeroLink slug="gustav" label="Gustav" />
                  </td>
                  <td className="px-3 py-2">
                    Excellent when protected or Shield/Stall fed
                  </td>
                </tr>
                <tr className="border-b border-border/80">
                  <td className="px-3 py-2 font-medium text-foreground">B</td>
                  <td className="px-3 py-2">
                    <HeroLink slug="reyna" label="Reyna" />,{" "}
                    <HeroLink slug="irini" label="Irini" />,{" "}
                    <HeroLink slug="niklas" label="Niklas" />,{" "}
                    <HeroLink slug="karsu" label="Karsu" />,{" "}
                    <HeroLink slug="sal" label="Sal" />
                  </td>
                  <td className="px-3 py-2">
                    Strong with the right package; slower or fussier starts
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-medium text-foreground">C</td>
                  <td className="px-3 py-2">Situational / learning picks</td>
                  <td className="px-3 py-2">
                    Fine on lower rungs; on Red Rift only if they complete a missing
                    job immediately
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="faq" className="scroll-mt-24 space-y-4">
          <h2 className="font-display text-2xl font-semibold">FAQ</h2>
          <div className="space-y-3">
            {RED_RIFT_FAQ.map((item) => (
              <div
                key={item.question}
                className="rounded-lg border border-border bg-card p-4"
              >
                <h3 className="font-medium text-foreground">{item.question}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3 border-t border-border pt-8">
          <h2 className="font-display text-2xl font-semibold">Next steps</h2>
          <p className="text-muted-foreground">
            New to the Demo loop? Start with{" "}
            <Link
              href="/guides/getting-started"
              className="underline-offset-2 hover:underline"
            >
              Getting Started
            </Link>
            . For placement keywords that matter on high difficulty, read{" "}
            <Link
              href="/guides/adjacent-positioning"
              className="underline-offset-2 hover:underline"
            >
              Adjacent positioning
            </Link>
            . Browse the full{" "}
            <Link href="/heroes" className="underline-offset-2 hover:underline">
              hero roster
            </Link>{" "}
            when the shop offers a name you do not recognize.
          </p>
        </section>
      </article>
    </>
  );
}
