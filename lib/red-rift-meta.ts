import type { Guide } from "@/types";

/** List/search/sitemap metadata for the Red Rift clear guide. */
export const RED_RIFT_GUIDE: Guide = {
  slug: "red-rift",
  title: "Guildrun Red Rift — How to Unlock & Clear",
  description:
    "What Red Rift is in Guildrun Demo, how to unlock it, clear strategy for both Acts, best heroes and builds, a practical tier list, and FAQ.",
  content: "",
  updatedAt: "2026-08-03",
  tags: ["red-rift", "difficulty", "strategy", "endgame"],
};

export const RED_RIFT_FAQ = [
  {
    question: "How hard is Red Rift?",
    answer:
      "Red Rift is the top rung of the Demo difficulty ladder. It stacks every modifier from Base through SSS, so enemies hit harder, economy is tighter, and mistakes that were forgivable on lower rungs end runs. Treat it as an endgame check, not a warm-up.",
  },
  {
    question: "How to unlock Red Rift?",
    answer:
      "Clear the difficulty ladder in order. A successful run on each rung unlocks the next: Base → C → B → A → S → SS → SSS → Red Rift. You cannot jump straight to Red Rift from Base.",
  },
  {
    question: "Best hero for Red Rift?",
    answer:
      "There is no single best hero. First clears usually want a real tank (Pimenta, Ming, Rip, Kai), a protected carry (Nyx, Aria, Funke, Irini, Reyna), and a sustain Mystic (Grace, Fiona, Gustav). Pick from what the shop offers and cover those three jobs.",
  },
  {
    question: "Why can't I beat Red Rift?",
    answer:
      "Most failed runs die in Act 1 from a missing frontline, greed for board size over items, or a carry that eats the opening volley. Fix roles and positioning before blaming RNG. Also watch hero death limits on bosses — killing the dragon while over the death cap still loses.",
  },
];
