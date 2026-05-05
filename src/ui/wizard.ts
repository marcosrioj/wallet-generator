import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { clearMemoryString, savePublicRecords, sanitizePublicRecord } from "../security/safeOutput";
import { enforceNoNetworkRuntime } from "../security/noNetwork";
import { sanitizeForLog } from "../security/redaction";
import { validatePublicAddress } from "../validation/validateAddress";
import {
  APP_NAME,
  CHECKLIST,
  MAINNET_RISK_WARNING,
  MENU,
  OFFLINE_WARNING,
  OPTION_1_TEXT,
  OPTION_2_TEXT,
  OPTION_3_TEXT,
  REVEAL_CONFIRMATION_TEXT,
  SUPPORT_WARNING,
  HARDWARE_WARNING,
  buildAmountMessage,
  createWalletCount,
  normalizeMenuChoice,
} from "./messages";
import { generateBitcoinWallets } from "../wallets/bitcoin";
import { generateEthereumWallets } from "../wallets/ethereum";

type MenuChoice = "0" | "1" | "2" | "3" | "4" | "5";

function showHeader(): void {
  console.log(`${APP_NAME}`);
  console.log(`- ${OFFLINE_WARNING}`);
  console.log(`- ${SUPPORT_WARNING}`);
  console.log(`- ${HARDWARE_WARNING}\n`);
}

function clearSensitiveData(value: string): string {
  return clearMemoryString(value);
}

async function promptNumbered(question: string, rl: readline.Interface): Promise<number> {
  const answer = (await rl.question(question)).trim();
  if (answer.length === 0) {
    return 1;
  }
  return createWalletCount(answer);
}

async function revealMnemonicPrompt(rl: readline.Interface, mnemonic: string): Promise<void> {
  const hasOwner = (await rl.question("O dono da carteira está presente para anotar a frase? (s/n): ")).trim().toLowerCase();
  if (hasOwner !== "s" && hasOwner !== "sim") {
    console.log("Pulando exibição da frase de recuperação.");
    return;
  }

  const confirmation = (await rl.question(`Confirme digitando: ${REVEAL_CONFIRMATION_TEXT}\n`)).trim();
  if (confirmation !== REVEAL_CONFIRMATION_TEXT) {
    console.log("Confirmação incorreta. A frase não será exibida.");
    return;
  }

  console.log("ATENÇÃO: Esta é a FRASE DE RECUPERAÇÃO. Anote em papel apenas uma vez.");
  console.log(`Frase de recuperação: ${mnemonic}`);
  console.log("Não tire print, não fotografe e não copie para apps ou nuvem.");
}

async function generateAndPersistEthereum(rl: readline.Interface): Promise<void> {
  console.log(OPTION_1_TEXT);
  const quantity = await promptNumbered(buildAmountMessage(), rl);
  const result = generateEthereumWallets(quantity);
  const records = result.addresses.map((item) => ({
    ...item,
    warning: item.warning + ` Caminho: ${item.derivationPath}`,
  }));

  for (const record of records) {
    const safeRecord = sanitizePublicRecord(record as Record<string, unknown>);
    console.log(`Endereço público: ${safeRecord.address}`);
    console.log(`Caminho de derivação: ${safeRecord.derivationPath}`);
  }

  savePublicRecords(records);
  await revealMnemonicPrompt(rl, result.mnemonic);
  result.mnemonic = clearSensitiveData(result.mnemonic);
}

async function generateAndPersistBitcoin(rl: readline.Interface, network: "mainnet" | "testnet"): Promise<void> {
  const networkDescription = network === "mainnet" ? OPTION_3_TEXT : OPTION_2_TEXT;
  console.log(networkDescription);
  if (network === "mainnet") {
    console.log(MAINNET_RISK_WARNING);
  }

  const quantity = await promptNumbered(buildAmountMessage(), rl);
  const result = generateBitcoinWallets(network, quantity);
  const records = result.addresses.map((item) => ({
    ...item,
    warning: item.warning + ` Caminho de derivação: ${item.derivationPath}`,
  }));

  for (const record of records) {
    const safeRecord = sanitizePublicRecord(record as Record<string, unknown>);
    console.log(`Endereço público: ${safeRecord.address}`);
    console.log(`Caminho de derivação: ${safeRecord.derivationPath}`);
  }

  savePublicRecords(records);
  await revealMnemonicPrompt(rl, result.mnemonic);
  result.mnemonic = clearSensitiveData(result.mnemonic);
}

async function validateAddressFlow(rl: readline.Interface): Promise<void> {
  const candidate = (await rl.question("Cole o endereço público para validar: ")).trim();
  const sanitized = sanitizeForLog(candidate);
  if (typeof sanitized !== "string") {
    console.log("Entrada inválida.");
    return;
  }

  const result = validatePublicAddress(sanitized);
  if (result.isValid) {
    console.log("Endereço válido.");
    if (result.coin === "BTC" && result.network === "mainnet") {
      console.log("Rede detectada: Bitcoin Mainnet (bc1).");
    } else if (result.coin === "BTC" && result.network === "testnet") {
      console.log("Rede detectada: Bitcoin Testnet (tb1).");
    } else if (result.coin === "ETH") {
      console.log("Rede detectada: Ethereum/EVM (0x...).");
    }
    return;
  }
  console.log("Endereço inválido ou não é endereço público válido.");
}

export async function runWizard(): Promise<void> {
  enforceNoNetworkRuntime();
  const rl = readline.createInterface({ input: stdin, output: stdout });

  showHeader();
  try {
    let running = true;
    while (running) {
      console.log(MENU);
      const choice = normalizeMenuChoice(await rl.question("Escolha uma opção: "));
      const typed = choice as MenuChoice;

      if (typed === "0") {
        running = false;
        continue;
      }

      if (typed === "1") {
        await generateAndPersistEthereum(rl);
      } else if (typed === "2") {
        await generateAndPersistBitcoin(rl, "testnet");
      } else if (typed === "3") {
        await generateAndPersistBitcoin(rl, "mainnet");
      } else if (typed === "4") {
        await validateAddressFlow(rl);
      } else if (typed === "5") {
        console.log(CHECKLIST);
      } else {
        console.log("Opção inválida.");
      }
    }
  } finally {
    rl.close();
  }
}
