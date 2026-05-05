import test from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { findSensitiveTermsInOutput } from "../src/security/safeOutput.js";
import { installNoNetworkGuard, isNoNetworkGuardInstalled } from "../src/security/noNetwork.js";

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("nenhum arquivo em output contem termos sensiveis", async () => {
  assert.deepEqual(await findSensitiveTermsInOutput(path.join(PROJECT_ROOT, "output")), []);
});

test("gerador aleatorio proibido nao aparece no codigo do projeto", () => {
  return assertNoForbiddenRandom(path.join(PROJECT_ROOT, "src"));
});

test("wizard instala bloqueio de rede em runtime", async () => {
  const wizardSource = await readFile(path.join(PROJECT_ROOT, "src/ui/wizard.ts"), "utf8");
  assert.match(wizardSource, /installNoNetworkGuard\(\)/);

  installNoNetworkGuard();
  assert.equal(isNoNetworkGuardInstalled(), true);
  assert.throws(() => fetch("https://example.com"), /rede bloqueada/i);
});

async function assertNoForbiddenRandom(dir: string): Promise<void> {
  const token = "Math" + ".random";
  const findings: string[] = [];

  async function walk(currentDir: string): Promise<void> {
    for (const entry of await readdir(currentDir)) {
      const fullPath = path.join(currentDir, entry);
      const info = await stat(fullPath);

      if (info.isDirectory()) {
        await walk(fullPath);
        continue;
      }

      if (!fullPath.endsWith(".ts")) {
        continue;
      }

      const content = await readFile(fullPath, "utf8");
      if (content.includes(token)) {
        findings.push(path.relative(PROJECT_ROOT, fullPath));
      }
    }
  }

  await walk(dir);
  assert.deepEqual(findings, []);
}
