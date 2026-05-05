import { describe, expect, it } from "vitest";
import { BTC_MAINNET_DERIVATION_PATH, BTC_TESTNET_DERIVATION_PATH, generateBitcoinWallets } from "../src/wallets/bitcoin";
import { validateBitcoinAddress } from "../src/validation/validateAddress";

describe("Bitcoin", () => {
  const mnemonic =
    "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

  it("Gera endereço BTC mainnet começando com bc1", () => {
    const result = generateBitcoinWallets("mainnet", 1, mnemonic);
    const address = result.addresses[0]!.address;
    expect(address.startsWith("bc1")).toBe(true);
    expect(validateBitcoinAddress(address, "mainnet")).toBe(true);
  });

  it("Gera endereço BTC testnet começando com tb1", () => {
    const result = generateBitcoinWallets("testnet", 1, mnemonic);
    const address = result.addresses[0]!.address;
    expect(address.startsWith("tb1")).toBe(true);
    expect(validateBitcoinAddress(address, "testnet")).toBe(true);
  });

  it("Usa path BIP84 em mainnet e testnet", () => {
    const mainnet = generateBitcoinWallets("mainnet", 2, mnemonic);
    const testnet = generateBitcoinWallets("testnet", 2, mnemonic);
    expect(mainnet.addresses[0]!.derivationPath).toBe(`${BTC_MAINNET_DERIVATION_PATH}0`);
    expect(mainnet.addresses[1]!.derivationPath).toBe(`${BTC_MAINNET_DERIVATION_PATH}1`);
    expect(testnet.addresses[0]!.derivationPath).toBe(`${BTC_TESTNET_DERIVATION_PATH}0`);
    expect(testnet.addresses[1]!.derivationPath).toBe(`${BTC_TESTNET_DERIVATION_PATH}1`);
  });
});
