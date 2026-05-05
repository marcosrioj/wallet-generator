const secretPatterns: RegExp[] = [
  /\bmnemonic\b/i,
  /\bprivate[\s_]?key\b/i,
  /\bxprv\b/i,
  /\bseed\b/i,
  /\bphrase\b/i,
  /\brecovery\b/i,
];

function isSensitiveKey(key: string): boolean {
  return secretPatterns.some((pattern) => pattern.test(key));
}

function hasSensitiveValue(value: string): boolean {
  return secretPatterns.some((pattern) => pattern.test(value));
}

export function sanitizeForLog(value: unknown): unknown {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (hasSensitiveValue(trimmed)) {
      return "[DADO_SENSIVEL_OCULTO]";
    }
    return trimmed;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeForLog(item));
  }

  if (value && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      if (isSensitiveKey(key)) {
        result[key] = "[DADO_SENSIVEL_OCULTO]";
      } else {
        result[key] = sanitizeForLog(item);
      }
    }
    return result;
  }

  return value;
}

export function clearString(value: string): string {
  return "\0".repeat(Math.max(0, value.length));
}
