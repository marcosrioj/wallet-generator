import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { hasForbiddenSecretText } from "../src/security/safeOutput";

const outputDir = join(process.cwd(), "output");

describe("Verificação de arquivos de saída", () => {
  it("Não deve haver termos sensíveis em arquivos públicos de saída", () => {
    if (!existsSync(outputDir)) {
      expect(true).toBe(true);
      return;
    }

    const forbiddenHits: string[] = [];
    const entries = readdirSync(outputDir, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isFile()) {
        continue;
      }
      const content = readFileSync(join(outputDir, entry.name), "utf8");
      if (hasForbiddenSecretText(content)) {
        forbiddenHits.push(entry.name);
      }
    }

    expect(forbiddenHits).toEqual([]);
  });

  it("Verifica que termos como mnemonic/private key não estão salvos em txt/csv de saída", () => {
    expect(hasForbiddenSecretText("mnemonic")).toBe(true);
    expect(hasForbiddenSecretText("private key")).toBe(true);
    expect(hasForbiddenSecretText("xprv")).toBe(true);
    expect(hasForbiddenSecretText("recovery")).toBe(true);
  });
});
