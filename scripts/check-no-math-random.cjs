const { readdirSync, readFileSync, statSync } = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const sourceDir = path.join(root, "src");
const ignoredDirs = new Set([".git", "node_modules", "dist", "output", "coverage"]);
const extensions = new Set([".ts", ".js", ".cjs"]);
const findings = [];
const forbiddenToken = "Math" + ".random";

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (ignoredDirs.has(entry)) {
      continue;
    }

    const fullPath = path.join(dir, entry);
    const relativePath = path.relative(root, fullPath);
    const info = statSync(fullPath);

    if (info.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (!extensions.has(path.extname(entry))) {
      continue;
    }

    const content = readFileSync(fullPath, "utf8");
    if (content.includes(forbiddenToken)) {
      findings.push(relativePath);
    }
  }
}

walk(sourceDir);

if (findings.length > 0) {
  console.error(`Uso proibido de ${forbiddenToken} encontrado em: ${findings.join(", ")}`);
  process.exit(1);
}

console.log(`OK: ${forbiddenToken} nao encontrado em src/.`);
