import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const TARGET_DIR = "src";

function walkFiles(directory) {
  const items = readdirSync(directory, { withFileTypes: true });
  const files = [];
  for (const item of items) {
    const fullPath = join(directory, item.name);
    if (item.isDirectory()) {
      files.push(...walkFiles(fullPath));
    } else if (item.isFile() && (fullPath.endsWith(".ts") || fullPath.endsWith(".js"))) {
      files.push(fullPath);
    }
  }
  return files;
}

const files = walkFiles(TARGET_DIR);
const pattern = /Math\.random\(\)/;
const matches = [];

for (const file of files) {
  const content = readFileSync(file, "utf8");
  if (pattern.test(content)) {
    matches.push(file);
  }
}

if (matches.length > 0) {
  console.error("Math.random() encontrado em:", matches.join("\n"));
  process.exit(1);
}

process.exit(0);
