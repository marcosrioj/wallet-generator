import { HDNodeWallet, getAddress, isAddress } from "ethers";
import { generateMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";
import type { GenerateAddressOptions, GeneratedAddressBatch, PublicAddressRecord } from "../types.js";
import { PUBLIC_OUTPUT_WARNING, normalizeAddressCount } from "../types.js";
import { createSensitiveText } from "../security/redaction.js";

export const ETHEREUM_BASE_DERIVATION_PATH = "m/44'/60'/0'/0";
export const ETHEREUM_DERIVATION_PATH = `${ETHEREUM_BASE_DERIVATION_PATH}/0`;

export function ethereumDerivationPath(index: number): string {
  if (!Number.isInteger(index) || index < 0) {
    throw new Error("Indice de derivacao invalido.");
  }

  return `${ETHEREUM_BASE_DERIVATION_PATH}/${index}`;
}

export function generateEthereumAddresses(
  options: GenerateAddressOptions = {}
): GeneratedAddressBatch {
  const count = normalizeAddressCount(options.count ?? 1);
  const createdAt = (options.createdAt ?? new Date()).toISOString();
  const phrase = generateMnemonic(wordlist, 256);
  const recoveryPhrase = createSensitiveText(phrase);

  try {
    const records: PublicAddressRecord[] = [];

    for (let index = 0; index < count; index += 1) {
      const derivationPath = ethereumDerivationPath(index);
      const wallet = HDNodeWallet.fromPhrase(phrase, undefined, derivationPath);
      const address = getAddress(wallet.address);

      records.push({
        coin: "ETH",
        network: "ethereum",
        address,
        derivationPath,
        createdAt,
        warning: PUBLIC_OUTPUT_WARNING
      });
    }

    return { records, recoveryPhrase };
  } catch (error) {
    recoveryPhrase.clear();
    throw error;
  }
}

export function isValidEthereumAddress(address: string): boolean {
  return isAddress(address.trim());
}
