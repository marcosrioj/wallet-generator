import { mkdirSync, rmSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { sanitizePublicRecord, savePublicRecords, hasForbiddenSecretText } from "../src/security/safeOutput";

describe("Saída pública", () => {
  const tmpDir = join(process.cwd(), "test-output");

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it("savePublicRecords grava apenas campos públicos permitidos", () => {
    mkdirSync(tmpDir, { recursive: true });
    const safe = sanitizePublicRecord({
      coin: "ETH",
      network: "mainnet",
      address: "0x52908400098527886E0F7030069857D2E4169EE7",
      derivationPath: "m/44'/60'/0'/0/0",
      createdAt: "2026-01-01T00:00:00.000Z",
      warning: "endereço público",
    });
    savePublicRecords([safe], tmpDir);
    const csv = readFileSync(join(tmpDir, "addresses.csv"), "utf8");
    expect(csv).toContain("coin,network,address");
    expect(csv).toContain("0x52908400098527886E0F7030069857D2E4169EE7");
  });

  it("bloqueia tentativa de salvar chave privada", () => {
    mkdirSync(tmpDir, { recursive: true });
    expect(() => {
      savePublicRecords([
        {
          coin: "BTC",
          network: "mainnet",
          address: "bc1qexample",
          derivationPath: "m/84'/0'/0'/0/0",
          createdAt: "2026-01-01T00:00:00.000Z",
          warning: "endereço público",
          privateKey: "abc",
        } as unknown as Record<string, unknown>,
      ], tmpDir);
    }).toThrow();
  });

  it("scan de termos sensíveis é estrito", () => {
    expect(hasForbiddenSecretText("wallet mnemonic words")).toBe(false);
    expect(hasForbiddenSecretText("recovery phrase")).toBe(true);
  });
});
