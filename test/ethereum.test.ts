import test from "node:test";
import assert from "node:assert/strict";
import { isAddress } from "ethers";
import {
  ETHEREUM_DERIVATION_PATH,
  ethereumDerivationPath,
  generateEthereumAddresses
} from "../src/wallets/ethereum.js";

test("endereco ETH gerado e valido", () => {
  const batch = generateEthereumAddresses({
    count: 1,
    createdAt: new Date("2026-01-01T00:00:00.000Z")
  });

  try {
    assert.equal(batch.records.length, 1);
    assert.equal(isAddress(batch.records[0]!.address), true);
  } finally {
    batch.recoveryPhrase.clear();
  }
});

test("derivation path Ethereum segue BIP44", () => {
  assert.equal(ETHEREUM_DERIVATION_PATH, "m/44'/60'/0'/0/0");
  assert.equal(ethereumDerivationPath(3), "m/44'/60'/0'/0/3");
});
