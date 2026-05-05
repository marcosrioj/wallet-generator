import { describe, expect, it } from "vitest";
import { validatePublicAddress } from "../src/validation/validateAddress";

describe("Validação de endereço", () => {
  it("recusa entrada com frase de recuperação", () => {
    const value =
      "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
    const result = validatePublicAddress(value);
    expect(result.isValid).toBe(false);
    expect(result.coin).toBeUndefined();
  });
});
