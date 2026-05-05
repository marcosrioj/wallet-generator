import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const OUTPUT_DIR = "output";
const forbidden = /mnemonic|privateKey|private key|xprv|seed|phrase|recovery/i;

if (!existsSync(OUTPUT_DIR)) {
  process.exit(0);
}

const entries = readdirSync(OUTPUT_DIR, { withFileTypes: true });
const violations = [];

for (const entry of entries) {
  if (!entry.isFile()) {
    continue;
  }
  const fullPath = join(OUTPUT_DIR, entry.name);
  const content = readFileSync(fullPath, "utf8");
  if (forbidden.test(content)) {
    violations.push(entry.name);
  }
}

if (violations.length > 0) {
  console.error("Termos sensíveis encontrados em arquivos de output:", violations.join(", "));
  process.exit(1);
}

process.exit(0);
