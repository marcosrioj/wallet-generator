import { describe, expect, it } from "vitest";
import { sanitizePublicRecord, hasForbiddenSecretText } from "../src/security/safeOutput";
import { sanitizeForLog } from "../src/security/redaction";

describe("Redação e proteção de segredos", () => {
  it("redacta frases com termos sensíveis", () => {
    const logged = sanitizeForLog({ mnemonic: "abandon abandon abandon" });
    expect(logged).toEqual({ mnemonic: "[DADO_SENSIVEL_OCULTO]" });
  });

  it("safeOutput rejeita campos sensíveis", () => {
    expect(() =>
      sanitizePublicRecord({
        coin: "ETH",
        network: "evm",
        address: "0x123",
        derivationPath: "m/44'/60'/0'/0/0",
        createdAt: "2026-01-01T00:00:00.000Z",
        warning: "endereço público",
        privateKey: "abc",
      } as Record<string, unknown>)
    ).toThrow("Campos não autorizados em saída pública");
  });

  it("detecta termos sensíveis", () => {
    expect(hasForbiddenSecretText("this text includes mnemonic")).toBe(true);
  });
});
