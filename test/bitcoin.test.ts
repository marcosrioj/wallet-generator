import test from "node:test";
import assert from "node:assert/strict";
import {
  BITCOIN_MAINNET_DERIVATION_PATH,
  BITCOIN_TESTNET_DERIVATION_PATH,
  bitcoinDerivationPath,
  generateBitcoinAddresses
} from "../src/wallets/bitcoin.js";
import { validatePublicAddress } from "../src/validation/validateAddress.js";

test("endereco BTC mainnet comeca com bc1", () => {
  const batch = generateBitcoinAddresses("mainnet", {
    count: 1,
    createdAt: new Date("2026-01-01T00:00:00.000Z")
  });

  try {
    const address = batch.records[0]!.address;
    assert.equal(address.startsWith("bc1"), true);
    assert.equal(validatePublicAddress(address, "bitcoin-mainnet").valid, true);
  } finally {
    batch.recoveryPhrase.clear();
  }
});

test("endereco BTC testnet comeca com tb1", () => {
  const batch = generateBitcoinAddresses("testnet", {
    count: 1,
    createdAt: new Date("2026-01-01T00:00:00.000Z")
  });

  try {
    const address = batch.records[0]!.address;
    assert.equal(address.startsWith("tb1"), true);
    assert.equal(validatePublicAddress(address, "bitcoin-testnet").valid, true);
  } finally {
    batch.recoveryPhrase.clear();
  }
});

test("derivation paths Bitcoin seguem BIP84", () => {
  assert.equal(BITCOIN_MAINNET_DERIVATION_PATH, "m/84'/0'/0'/0/0");
  assert.equal(BITCOIN_TESTNET_DERIVATION_PATH, "m/84'/1'/0'/0/0");
  assert.equal(bitcoinDerivationPath("mainnet", 2), "m/84'/0'/0'/0/2");
  assert.equal(bitcoinDerivationPath("testnet", 2), "m/84'/1'/0'/0/2");
});
