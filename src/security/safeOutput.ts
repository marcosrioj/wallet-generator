import { appendFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { PublicAddressRecord } from "../types";

const ALLOWED_KEYS = new Set(["coin", "network", "address", "derivationPath", "createdAt", "warning"]);
const secretPatterns = [
  /\bmnemonic\b/i,
  /\bprivate[\s_]?key\b/i,
  /\bxprv\b/i,
  /\bseed\b/i,
  /\bphrase\b/i,
  /\brecovery\b/i,
];

const forbidden = /mnemonic|privateKey|private key|xprv|seed|phrase|recovery/i;

export function hasForbiddenSecretText(value: string): boolean {
  return forbidden.test(value);
}

function ensureNoForbiddenValues(record: PublicAddressRecord): void {
  for (const key of Object.keys(record)) {
    const value = (record as Record<string, unknown>)[key];
    if (typeof value === "string" && hasForbiddenSecretText(value)) {
      throw new Error("Tentativa de salvar possível dado sensível no output.");
    }
  }

  for (const key of Object.keys(record)) {
    if (secretPatterns.some((pattern) => pattern.test(key))) {
      throw new Error("Chave sensível detectada em saída pública.");
    }
  }
}

export function sanitizePublicRecord(input: Record<string, unknown>): PublicAddressRecord {
  const keys = Object.keys(input);
  const invalid = keys.filter((key) => !ALLOWED_KEYS.has(key));
  if (invalid.length > 0) {
    throw new Error(`Campos não autorizados em saída pública: ${invalid.join(", ")}`);
  }

  const missing = [...ALLOWED_KEYS].filter((key) => !keys.includes(key));
  if (missing.length > 0) {
    throw new Error(`Campos obrigatórios ausentes: ${missing.join(", ")}`);
  }

  const coin = input.coin as string;
  const network = input.network as string;
  const address = input.address as string;
  const derivationPath = input.derivationPath as string;
  const createdAt = input.createdAt as string;
  const warning = (input.warning ?? "") as string;

  if (![
    coin,
    network,
    address,
    derivationPath,
    createdAt,
    warning,
  ].every((value) => typeof value === "string" && value.trim() !== "")) {
    throw new Error("Campos públicos inválidos.");
  }

  const output: PublicAddressRecord = {
    coin: coin as PublicAddressRecord["coin"],
    network: network as PublicAddressRecord["network"],
    address: address.trim(),
    derivationPath: derivationPath.trim(),
    createdAt: createdAt.trim(),
    warning: String(warning).trim(),
  };

  ensureNoForbiddenValues(output);
  return output;
}

function toCsvValue(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function toCsvLine(record: PublicAddressRecord): string {
  return [
    toCsvValue(record.coin),
    toCsvValue(record.network),
    toCsvValue(record.address),
    toCsvValue(record.derivationPath),
    toCsvValue(record.createdAt),
    toCsvValue(record.warning),
  ].join(",");
}

function ensureDirectory(base: string): void {
  if (!existsSync(base)) {
    mkdirSync(base, { recursive: true });
  }
}

export function savePublicRecords(
  records: readonly Record<string, unknown>[],
  basePath = "output"
): void {
  const safeRecords = records.map((record) => sanitizePublicRecord(record));
  ensureDirectory(basePath);

  const csvPath = join(basePath, "addresses.csv");
  const lastAddressPath = join(basePath, "last-address.txt");
  const appendHeader = !existsSync(csvPath);
  const lines = safeRecords.map(toCsvLine).join("\n");
  const content = `${appendHeader ? "coin,network,address,derivationPath,createdAt,warning\n" : ""}${lines}\n`;
  appendFileSync(csvPath, content);

  const last = safeRecords[safeRecords.length - 1];
  writeFileSync(lastAddressPath, JSON.stringify(last, null, 2));
}

export function clearMemoryString(value: string): string {
  return "\0".repeat(Math.max(0, value.length));
}
