import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("Wizard", () => {
  it("Não deve incluir chamadas de rede no fluxo de UI", () => {
    const wizardSource = readFileSync(join(process.cwd(), "src/ui/wizard.ts"), "utf8");
    expect(wizardSource).not.toMatch(/fetch\(/i);
    expect(wizardSource).not.toMatch(/axios|request\(/i);
    expect(wizardSource).not.toMatch(/https?:\/\//i);
  });
});
