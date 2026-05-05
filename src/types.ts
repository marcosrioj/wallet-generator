export type CoinType = "ETH" | "BTC";

export type NetworkType = "mainnet" | "testnet";

export interface PublicAddressRecord {
  coin: CoinType;
  network: NetworkType;
  address: string;
  derivationPath: string;
  createdAt: string;
  warning: string;
}

export interface WalletGenerationResult {
  mnemonic: string;
  addresses: PublicAddressRecord[];
}
