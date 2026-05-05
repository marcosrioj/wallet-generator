import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";
import {
  assertPublicAddressRecord,
  findSensitiveTermsInOutput,
  savePublicAddressRecords
} from "../src/security/safeOutput.js";
import type { PublicAddressRecord } from "../src/types.js";

const PUBLIC_RECORD: PublicAddressRecord = {
  coin: "ETH",
  network: "ethereum",
  address: "0x0000000000000000000000000000000000000000",
  derivationPath: "m/44'/60'/0'/0/0",
  createdAt: "2026-01-01T00:00:00.000Z",
  warning: "Apenas dados publicos; confirme moeda e rede antes de usar."
};

test("safeOutput salva somente campos publicos", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "safe-output-"));

  try {
    await savePublicAddressRecords([PUBLIC_RECORD], dir);
    const csv = await readFile(path.join(dir, "addresses.csv"), "utf8");
    const last = await readFile(path.join(dir, "last-address.txt"), "utf8");

    assert.match(csv, /coin,network,address,derivationPath,createdAt,warning/);
    assert.match(last, /address=0x0000000000000000000000000000000000000000/);
    assert.deepEqual(await findSensitiveTermsInOutput(dir), []);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("safeOutput rejeita campos sensiveis", () => {
  assert.throws(
    () =>
      assertPublicAddressRecord({
        ...PUBLIC_RECORD,
        mnemonic: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
      }),
    /nao permitido|sensivel/
  );
});

test("safeOutput rejeita conteudo sensivel em campos publicos", () => {
  assert.throws(
    () =>
      assertPublicAddressRecord({
        ...PUBLIC_RECORD,
        warning: "seed"
      }),
    /sensivel/
  );
});
