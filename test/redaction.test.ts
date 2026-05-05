import test from "node:test";
import assert from "node:assert/strict";
import {
  createSensitiveText,
  hasSensitiveKey,
  looksLikeSecretString,
  redact
} from "../src/security/redaction.js";
import { validatePublicAddress } from "../src/validation/validateAddress.js";

test("redaction remove campos sensiveis", () => {
  const value = redact({
    address: "0x0000000000000000000000000000000000000000",
    privateKey: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
  });

  assert.deepEqual(value, {
    address: "0x0000000000000000000000000000000000000000",
    privateKey: "[REDACTED]"
  });
});

test("detecta chaves e valores sensiveis", () => {
  assert.equal(hasSensitiveKey("mnemonic"), true);
  assert.equal(hasSensitiveKey("xprv"), true);
  assert.equal(
    looksLikeSecretString("0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"),
    true
  );
});

test("SensitiveText revela somente enquanto nao foi limpo", () => {
  const secret = createSensitiveText("abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about");
  assert.equal(secret.isCleared(), false);
  assert.match(secret.reveal(), /abandon/);
  secret.clear();
  assert.equal(secret.isCleared(), true);
  assert.throws(() => secret.reveal(), /limpo/);
});

test("validacao rejeita frase no campo de endereco", () => {
  const result = validatePublicAddress(
    "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
  );
  assert.equal(result.valid, false);
  assert.match(result.reason ?? "", /endereco publico/i);
});
