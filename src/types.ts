export type Coin = "ETH" | "BTC";

export type NetworkName =
  | "ethereum"
  | "bitcoin-mainnet"
  | "bitcoin-testnet";

export interface PublicAddressRecord {
  coin: Coin;
  network: NetworkName;
  address: string;
  derivationPath: string;
  createdAt: string;
  warning: string;
}

export interface SensitiveText {
  reveal(): string;
  clear(): void;
  isCleared(): boolean;
}

export interface GeneratedAddressBatch {
  records: PublicAddressRecord[];
  recoveryPhrase: SensitiveText;
}

export interface GenerateAddressOptions {
  count?: number;
  createdAt?: Date;
}

export const PUBLIC_OUTPUT_WARNING =
  "Apenas dados publicos; confirme moeda e rede antes de usar.";

export function normalizeAddressCount(count: number): number {
  if (!Number.isInteger(count) || count < 1 || count > 20) {
    throw new Error("A quantidade deve ser um numero inteiro entre 1 e 20.");
  }

  return count;
}
