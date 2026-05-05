import { getAddress, isAddress } from "ethers";
import * as bitcoin from "bitcoinjs-lib";
import { validateMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";
import { getBitcoinJsNetwork } from "../wallets/bitcoin.js";

export type AddressValidationType =
  | "ethereum"
  | "bitcoin-mainnet"
  | "bitcoin-testnet";

export type AddressValidationHint = AddressValidationType | "auto";

export interface AddressValidationResult {
  valid: boolean;
  type?: AddressValidationType;
  normalized?: string;
  reason?: string;
}

const MNEMONIC_WORD_COUNTS = new Set([12, 15, 18, 21, 24]);

export function validatePublicAddress(
  rawInput: string,
  hint: AddressValidationHint = "auto"
): AddressValidationResult {
  const input = rawInput.trim();

  if (input.length === 0) {
    return { valid: false, reason: "Informe um endereco publico." };
  }

  if (looksLikeRecoveryPhrase(input)) {
    return {
      valid: false,
      reason: "Cole somente endereco publico. Nao informe frase de recuperacao."
    };
  }

  if (hint === "ethereum") {
    return validateEthereum(input);
  }

  if (hint === "bitcoin-mainnet") {
    return validateBitcoin(input, "mainnet");
  }

  if (hint === "bitcoin-testnet") {
    return validateBitcoin(input, "testnet");
  }

  if (input.startsWith("0x")) {
    return validateEthereum(input);
  }

  if (input.toLowerCase().startsWith("bc1")) {
    return validateBitcoin(input, "mainnet");
  }

  if (input.toLowerCase().startsWith("tb1")) {
    return validateBitcoin(input, "testnet");
  }

  return {
    valid: false,
    reason: "Formato nao reconhecido para ETH, Bitcoin mainnet bc1 ou Bitcoin testnet tb1."
  };
}

export function looksLikeRecoveryPhrase(input: string): boolean {
  const normalized = input.trim().toLowerCase().replace(/\s+/g, " ");
  const words = normalized.split(" ").filter(Boolean);

  if (!MNEMONIC_WORD_COUNTS.has(words.length)) {
    return false;
  }

  if (validateMnemonic(normalized, wordlist)) {
    return true;
  }

  return words.every((word) => /^[a-z]+$/.test(word));
}

function validateEthereum(input: string): AddressValidationResult {
  if (!isAddress(input)) {
    return { valid: false, reason: "Endereco Ethereum/EVM invalido." };
  }

  return {
    valid: true,
    type: "ethereum",
    normalized: getAddress(input)
  };
}

function validateBitcoin(
  input: string,
  networkKind: "mainnet" | "testnet"
): AddressValidationResult {
  const expectedPrefix = networkKind === "mainnet" ? "bc1" : "tb1";
  if (!input.toLowerCase().startsWith(expectedPrefix)) {
    return {
      valid: false,
      reason: `Endereco Bitcoin ${networkKind} deve comecar com ${expectedPrefix}.`
    };
  }

  try {
    bitcoin.address.toOutputScript(input, getBitcoinJsNetwork(networkKind));
    return {
      valid: true,
      type: networkKind === "mainnet" ? "bitcoin-mainnet" : "bitcoin-testnet",
      normalized: input
    };
  } catch {
    return {
      valid: false,
      reason: `Endereco Bitcoin ${networkKind} invalido.`
    };
  }
}
