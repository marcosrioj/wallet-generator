import * as bitcoin from "bitcoinjs-lib";
import { BIP32Factory } from "bip32";
import * as ecc from "tiny-secp256k1";
import { generateMnemonic, mnemonicToSeedSync } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";
import type { GenerateAddressOptions, GeneratedAddressBatch, PublicAddressRecord } from "../types.js";
import { PUBLIC_OUTPUT_WARNING, normalizeAddressCount } from "../types.js";
import { createSensitiveText } from "../security/redaction.js";

bitcoin.initEccLib(ecc);

const bip32 = BIP32Factory(ecc);

export const BITCOIN_MAINNET_BASE_DERIVATION_PATH = "m/84'/0'/0'/0";
export const BITCOIN_MAINNET_DERIVATION_PATH = `${BITCOIN_MAINNET_BASE_DERIVATION_PATH}/0`;

export function bitcoinDerivationPath(index: number): string {
  if (!Number.isInteger(index) || index < 0) {
    throw new Error("Indice de derivacao invalido.");
  }

  return `${BITCOIN_MAINNET_BASE_DERIVATION_PATH}/${index}`;
}

export function generateBitcoinAddresses(
  options: GenerateAddressOptions = {}
): GeneratedAddressBatch {
  const count = normalizeAddressCount(options.count ?? 1);
  const createdAt = (options.createdAt ?? new Date()).toISOString();
  const phrase = generateMnemonic(wordlist, 256);
  const recoveryPhrase = createSensitiveText(phrase);
  const seedBytes = mnemonicToSeedSync(phrase);
  const seedBuffer = Buffer.from(seedBytes);

  try {
    const network = getBitcoinJsNetwork();
    const root = bip32.fromSeed(seedBuffer, network);
    const records: PublicAddressRecord[] = [];

    for (let index = 0; index < count; index += 1) {
      const derivationPath = bitcoinDerivationPath(index);
      const child = root.derivePath(derivationPath);
      const payment = bitcoin.payments.p2wpkh({
        pubkey: Buffer.from(child.publicKey),
        network
      });

      if (payment.address === undefined) {
        throw new Error("Falha ao derivar endereco Bitcoin Native SegWit.");
      }

      records.push({
        coin: "BTC",
        network: "bitcoin-mainnet",
        address: payment.address,
        derivationPath,
        createdAt,
        warning: PUBLIC_OUTPUT_WARNING
      });
    }

    return { records, recoveryPhrase };
  } catch (error) {
    recoveryPhrase.clear();
    throw error;
  } finally {
    seedBytes.fill(0);
    seedBuffer.fill(0);
  }
}

export function getBitcoinJsNetwork(): bitcoin.Network {
  return bitcoin.networks.bitcoin;
}
