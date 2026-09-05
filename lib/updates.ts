import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { UpdateCategory, UpdatePost } from "@/types";

const updatesDir = path.join(process.cwd(), "content/updates");

const CATEGORIES: UpdateCategory[] = [
  "Patch Notes",
  "Site Update",
  "Meta Notes",
  "Release News",
];

function normalizeCategory(value: unknown): UpdateCategory {
  const raw = String(value ?? "Site Update").trim();
  return (CATEGORIES.find((item) => item === raw) ?? "Site Update") as UpdateCategory;
}

function toIsoDate(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  const raw = String(value ?? "").trim();
  if (!raw) return new Date().toISOString().slice(0, 10);
  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }
  return raw;
}

export function getUpdates(): UpdatePost[] {
  if (!fs.existsSync(updatesDir)) return [];

  const files = fs.readdirSync(updatesDir).filter((file) => file.endsWith(".md"));

  return files
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(updatesDir, file), "utf-8");
      const { data, content } = matter(raw);

      return {
        slug,
        title: String(data.title ?? slug),
        description: String(data.description ?? ""),
        content,
        publishedAt: toIsoDate(data.publishedAt ?? data.updatedAt),
        category: normalizeCategory(data.category),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      } satisfies UpdatePost;
    })
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}

export function getUpdateBySlug(slug: string): UpdatePost | undefined {
  return getUpdates().find((post) => post.slug === slug);
}

export function getLatestUpdates(limit = 3): UpdatePost[] {
  return getUpdates().slice(0, limit);
}
