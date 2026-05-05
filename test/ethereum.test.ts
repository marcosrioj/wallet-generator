import { describe, expect, it } from "vitest";
import { generateEthereumWallets, ETH_DERIVATION_PATH } from "../src/wallets/ethereum";
import { validateEthereumAddress } from "../src/validation/validateAddress";

describe("Ethereum", () => {
  it("Gera endereço ETH válido", () => {
    const mnemonic =
      "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
    const result = generateEthereumWallets(1, mnemonic);
    expect(result.addresses).toHaveLength(1);
    const address = result.addresses[0]!.address;
    expect(validateEthereumAddress(address)).toBe(true);
  });

  it("Usa path de derivação BIP44 no formato esperado", () => {
    const mnemonic =
      "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
    const result = generateEthereumWallets(2, mnemonic);
    expect(result.addresses[0]!.derivationPath).toBe(`${ETH_DERIVATION_PATH}0`);
    expect(result.addresses[1]!.derivationPath).toBe(`${ETH_DERIVATION_PATH}1`);
  });
});
