import { mkdir, readFile, stat, writeFile, appendFile } from "node:fs/promises";
import path from "node:path";
import type { PublicAddressRecord } from "../types.js";
import { hasSensitiveKey, looksLikeSecretString } from "./redaction.js";

const PUBLIC_FIELDS = [
  "coin",
  "network",
  "address",
  "derivationPath",
  "createdAt",
  "warning"
] as const;

const PUBLIC_FIELD_SET = new Set<string>(PUBLIC_FIELDS);

const OUTPUT_SENSITIVE_TERMS = [
  "mnemonic",
  "privateKey",
  "private key",
  "xprv",
  "seed",
  "phrase",
  "recovery"
];

export const DEFAULT_OUTPUT_DIR = path.resolve(process.cwd(), "output");

export function assertPublicAddressRecord(input: unknown): PublicAddressRecord {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new Error("Registro publico invalido.");
  }

  const record = input as Record<string, unknown>;
  const keys = Object.keys(record);

  for (const key of keys) {
    if (!PUBLIC_FIELD_SET.has(key)) {
      throw new Error(`Campo nao permitido para output publico: ${key}`);
    }

    if (hasSensitiveKey(key)) {
      throw new Error(`Campo sensivel bloqueado: ${key}`);
    }
  }

  for (const field of PUBLIC_FIELDS) {
    if (typeof record[field] !== "string" || record[field].trim() === "") {
      throw new Error(`Campo publico ausente ou invalido: ${field}`);
    }
  }

  assertNoSensitiveValues(record);

  return {
    coin: record.coin,
    network: record.network,
    address: record.address,
    derivationPath: record.derivationPath,
    createdAt: record.createdAt,
    warning: record.warning
  } as PublicAddressRecord;
}

export async function savePublicAddressRecords(
  records: readonly PublicAddressRecord[],
  outputDir = DEFAULT_OUTPUT_DIR
): Promise<void> {
  if (records.length === 0) {
    return;
  }

  const publicRecords = records.map((record) => assertPublicAddressRecord(record));
  await mkdir(outputDir, { recursive: true });

  const csvPath = path.join(outputDir, "addresses.csv");
  const csvExists = await fileExists(csvPath);
  const lines = publicRecords.map(recordToCsvLine).join("");

  if (!csvExists) {
    await writeFile(csvPath, `${PUBLIC_FIELDS.join(",")}\n${lines}`, "utf8");
  } else {
    await appendFile(csvPath, lines, "utf8");
  }

  const lastRecord = publicRecords.at(-1);
  if (lastRecord === undefined) {
    return;
  }

  await writeFile(
    path.join(outputDir, "last-address.txt"),
    [
      `coin=${lastRecord.coin}`,
      `network=${lastRecord.network}`,
      `address=${lastRecord.address}`,
      `derivationPath=${lastRecord.derivationPath}`,
      `createdAt=${lastRecord.createdAt}`,
      `warning=${lastRecord.warning}`,
      ""
    ].join("\n"),
    "utf8"
  );
}

export async function findSensitiveTermsInOutput(
  outputDir = DEFAULT_OUTPUT_DIR
): Promise<string[]> {
  if (!(await fileExists(outputDir))) {
    return [];
  }

  const findings: string[] = [];
  for (const fileName of ["addresses.csv", "last-address.txt"]) {
    const filePath = path.join(outputDir, fileName);
    if (!(await fileExists(filePath))) {
      continue;
    }

    const content = await readFile(filePath, "utf8");
    const lower = content.toLowerCase();
    for (const term of OUTPUT_SENSITIVE_TERMS) {
      if (lower.includes(term.toLowerCase())) {
        findings.push(`${fileName}: ${term}`);
      }
    }
  }

  return findings;
}

function assertNoSensitiveValues(record: Record<string, unknown>): void {
  for (const [key, value] of Object.entries(record)) {
    if (hasSensitiveKey(key)) {
      throw new Error(`Campo sensivel bloqueado: ${key}`);
    }

    if (typeof value === "string") {
      const lower = value.toLowerCase();
      const hasBlockedTerm = OUTPUT_SENSITIVE_TERMS.some((term) =>
        lower.includes(term.toLowerCase())
      );

      if (hasBlockedTerm || looksLikeSecretString(value)) {
        throw new Error(`Valor sensivel bloqueado no campo publico: ${key}`);
      }
    }
  }
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      return false;
    }

    throw error;
  }
}

function recordToCsvLine(record: PublicAddressRecord): string {
  return PUBLIC_FIELDS.map((field) => csvEscape(record[field])).join(",") + "\n";
}

function csvEscape(value: string): string {
  if (!/[",\n\r]/.test(value)) {
    return value;
  }

  return `"${value.replaceAll("\"", "\"\"")}"`;
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
