import { getAddress, isAddress } from "ethers";
import * as bitcoin from "bitcoinjs-lib";
import type { CoinType, NetworkType } from "../types";

export interface ValidationResult {
  isValid: boolean;
  coin?: CoinType;
  network?: NetworkType;
}

export function isLikelyMnemonic(value: string): boolean {
  const trimmed = value.trim();
  const words = trimmed.split(/\s+/);
  return (
    words.length >= 12 &&
    words.length <= 24 &&
    words.every((word) => /^[\p{L}]+$/u.test(word))
  );
}

export function validateEthereumAddress(address: string): boolean {
  const candidate = address.trim();
  if (!candidate.startsWith("0x")) {
    return false;
  }
  if (isLikelyMnemonic(candidate)) {
    return false;
  }
  if (!isAddress(candidate)) {
    return false;
  }
  if (/[a-z]/.test(candidate.slice(2)) && /[A-F]/.test(candidate.slice(2))) {
    return getAddress(candidate) === candidate;
  }
  return true;
}

export function validateBitcoinAddress(address: string, network: "mainnet" | "testnet"): boolean {
  const candidate = address.trim();
  if (isLikelyMnemonic(candidate)) {
    return false;
  }

  try {
    const networkConfig = network === "mainnet" ? bitcoin.networks.bitcoin : bitcoin.networks.testnet;
    const requiredPrefix = network === "mainnet" ? "bc1" : "tb1";
    if (!candidate.startsWith(requiredPrefix)) {
      return false;
    }
    bitcoin.address.toOutputScript(candidate, networkConfig);
    return true;
  } catch {
    return false;
  }
}

export function validatePublicAddress(address: string): ValidationResult {
  const candidate = address.trim();
  if (isLikelyMnemonic(candidate)) {
    return { isValid: false };
  }

  if (candidate.startsWith("0x")) {
    return validateEthereumAddress(candidate) ? { isValid: true, coin: "ETH", network: "mainnet" } : { isValid: false };
  }

  if (candidate.startsWith("bc1")) {
    return validateBitcoinAddress(candidate, "mainnet")
      ? { isValid: true, coin: "BTC", network: "mainnet" }
      : { isValid: false };
  }

  if (candidate.startsWith("tb1")) {
    return validateBitcoinAddress(candidate, "testnet")
      ? { isValid: true, coin: "BTC", network: "testnet" }
      : { isValid: false };
  }

  return { isValid: false };
}
