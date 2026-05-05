const { existsSync, readdirSync, readFileSync, statSync } = require("node:fs");
const path = require("node:path");

const outputDir = path.join(process.cwd(), "output");
const terms = ["mnemonic", "privateKey", "private key", "xprv", "seed", "phrase", "recovery"];
const findings = [];

function walk(dir) {
  if (!existsSync(dir)) {
    return;
  }

  for (const entry of readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const info = statSync(fullPath);

    if (info.isDirectory()) {
      walk(fullPath);
      continue;
    }

    const content = readFileSync(fullPath, "utf8").toLowerCase();
    for (const term of terms) {
      if (content.includes(term.toLowerCase())) {
        findings.push(`${path.relative(process.cwd(), fullPath)}: ${term}`);
      }
    }
  }
}

walk(outputDir);

if (findings.length > 0) {
  console.error(`Termos sensiveis encontrados em output/: ${findings.join(", ")}`);
  process.exit(1);
}

console.log("OK: nenhum termo sensivel encontrado em output/.");
