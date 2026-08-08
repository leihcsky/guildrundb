import fs from "fs";
import path from "path";

/** Hand-written class guide overlay (`content/meta/class-guides/{slug}.json`). */
export type ClassGuide = {
  /** Unique lead paragraph shown under the H1 — the main SEO body text. */
  intro: string;
  /** Concise meta description (~150 chars). Falls back to a trimmed intro. */
  seoDescription?: string;
  roleLabel: string;
  strength: string;
  weakness: string;
  howToPlay: {
    draft: string;
    shop: string;
    positioning: string;
  };
  /** Shop / relic priorities in plain language. */
  shopPriorities?: string[];
  /** Signature heroes with a one-line reason (slug is optional, used for context only). */
  signatureHeroes?: Array<{ name: string; why: string }>;
  faq: Array<{ question: string; answer: string }>;
  tips?: string[];
};

const GUIDE_DIR = path.join(process.cwd(), "content", "meta", "class-guides");

function stripBom(raw: string): string {
  return raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
}

export function getClassGuide(slug: string): ClassGuide | null {
  const filePath = path.join(GUIDE_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  try {
    const raw = JSON.parse(stripBom(fs.readFileSync(filePath, "utf-8"))) as ClassGuide;
    if (!raw || typeof raw !== "object") return null;
    if (typeof raw.intro !== "string" || !Array.isArray(raw.faq)) return null;
    return raw;
  } catch {
    return null;
  }
}
