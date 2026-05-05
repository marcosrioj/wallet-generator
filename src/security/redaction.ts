import { inspect } from "node:util";

const REDACTED = "[REDACTED]";

const SENSITIVE_KEY_PATTERNS = [
  /mnemonic/i,
  /private\s*key/i,
  /privateKey/i,
  /xprv/i,
  /seed/i,
  /phrase/i,
  /recovery/i,
  /frase/i,
  /recupera[cç][aã]o/i
];

const SENSITIVE_VALUE_PATTERNS = [
  /\b(?:xprv|tprv|yprv|zprv|vprv|uprv)[a-zA-Z0-9]+\b/,
  /\b0x[a-fA-F0-9]{64}\b/,
  /\b[a-fA-F0-9]{64}\b/
];

const POSSIBLE_MNEMONIC_WORD_COUNTS = new Set([12, 15, 18, 21, 24]);

export function hasSensitiveKey(key: string): boolean {
  return SENSITIVE_KEY_PATTERNS.some((pattern) => pattern.test(key));
}

export function looksLikeSecretString(value: string): boolean {
  const trimmed = value.trim();

  if (SENSITIVE_VALUE_PATTERNS.some((pattern) => pattern.test(trimmed))) {
    return true;
  }

  const words = trimmed.toLowerCase().split(/\s+/).filter(Boolean);
  if (
    POSSIBLE_MNEMONIC_WORD_COUNTS.has(words.length) &&
    words.every((word) => /^[a-z]+$/.test(word))
  ) {
    return true;
  }

  return false;
}

export function redact(value: unknown): unknown {
  return redactInternal(value, new WeakSet<object>(), undefined);
}

export function safeStringifyForLog(value: unknown): string {
  return inspect(redact(value), {
    colors: false,
    depth: 6,
    breakLength: 120,
    sorted: true
  });
}

export function createSensitiveText(value: string) {
  let current: string | undefined = value;

  return {
    reveal(): string {
      if (current === undefined) {
        throw new Error("O valor sensivel ja foi limpo.");
      }

      return current;
    },
    clear(): void {
      current = undefined;
    },
    isCleared(): boolean {
      return current === undefined;
    }
  };
}

function redactInternal(
  value: unknown,
  seen: WeakSet<object>,
  key: string | undefined
): unknown {
  if (key !== undefined && hasSensitiveKey(key)) {
    return REDACTED;
  }

  if (typeof value === "string") {
    return looksLikeSecretString(value) ? REDACTED : value;
  }

  if (typeof value !== "object" || value === null) {
    return value;
  }

  if (seen.has(value)) {
    return "[Circular]";
  }

  seen.add(value);

  if (Array.isArray(value)) {
    return value.map((item) => redactInternal(item, seen, undefined));
  }

  const output: Record<string, unknown> = {};
  for (const [entryKey, entryValue] of Object.entries(value)) {
    output[entryKey] = redactInternal(entryValue, seen, entryKey);
  }

  return output;
}
