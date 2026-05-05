import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const SEARCH_DIR = join(process.cwd(), "src");

function walk(dir: string, files: string[] = []): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
    } else if (entry.isFile() && full.endsWith(".ts")) {
      files.push(full);
    }
  }
  return files;
}

describe("Qualidade criptográfica", () => {
  it("não usa Math.random()", () => {
    const files = walk(SEARCH_DIR);
    const containsRandom = files.some((file) => /Math\.random\(\)/.test(readFileSync(file, "utf8")));
    expect(containsRandom).toBe(false);
  });
});
