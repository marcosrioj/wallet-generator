import { createInterface, type Interface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { generateBitcoinAddresses } from "../wallets/bitcoin.js";
import { generateEthereumAddresses } from "../wallets/ethereum.js";
import { savePublicAddressRecords } from "../security/safeOutput.js";
import { installNoNetworkGuard } from "../security/noNetwork.js";
import { redact, safeStringifyForLog } from "../security/redaction.js";
import type { GeneratedAddressBatch, PublicAddressRecord, SensitiveText } from "../types.js";
import { validatePublicAddress } from "../validation/validateAddress.js";
import {
  MAIN_MENU,
  OFFLINE_CHECKLIST,
  REVEAL_CONFIRMATION,
  generationIntro
} from "./messages.js";

type GenerationKind = "ethereum" | "bitcoin-mainnet";

export async function runWizard(): Promise<void> {
  installNoNetworkGuard();

  const rl = createInterface({ input, output });

  try {
    let running = true;
    while (running) {
      console.log(MAIN_MENU);
      const choice = (await rl.question("Escolha uma opcao: ")).trim();

      try {
        if (choice === "1") {
          await handleGeneration(rl, "ethereum");
        } else if (choice === "2") {
          await handleGeneration(rl, "bitcoin-mainnet");
        } else if (choice === "3") {
          await handleValidation(rl);
        } else if (choice === "4") {
          console.log(OFFLINE_CHECKLIST);
        } else if (choice === "0") {
          running = false;
        } else {
          console.log("Opcao invalida.");
        }
      } catch (error) {
        const safeError = error instanceof Error ? error.message : safeStringifyForLog(error);
        console.error(`Erro: ${redact(safeError)}`);
      }
    }
  } finally {
    rl.close();
  }
}

async function handleGeneration(
  rl: Interface,
  kind: GenerationKind
): Promise<void> {
  console.log("");
  console.log(generationIntro(kind));

  if (kind === "bitcoin-mainnet") {
    const confirmation = (
      await rl.question("Digite MAINNET para confirmar que entende o risco: ")
    ).trim();
    if (confirmation !== "MAINNET") {
      console.log("Operacao cancelada.");
      return;
    }
  }

  const count = await askAddressCount(rl);
  const batch = createBatch(kind, count);

  try {
    printPublicAddresses(batch.records);
    await savePublicAddressRecords(batch.records);
    console.log("Dados publicos salvos em output/addresses.csv e output/last-address.txt.");

    await maybeRevealRecoveryPhrase(rl, batch.recoveryPhrase);
  } finally {
    batch.recoveryPhrase.clear();
  }
}

async function handleValidation(rl: Interface): Promise<void> {
  const address = await rl.question("Cole o endereco publico: ");
  const result = validatePublicAddress(address);

  if (result.valid) {
    console.log(`Endereco valido (${result.type}): ${result.normalized}`);
    return;
  }

  console.log(`Endereco invalido: ${result.reason}`);
}

function createBatch(kind: GenerationKind, count: number): GeneratedAddressBatch {
  if (kind === "ethereum") {
    return generateEthereumAddresses({ count });
  }

  return generateBitcoinAddresses({ count });
}

async function askAddressCount(rl: Interface): Promise<number> {
  const raw = (await rl.question("Quantidade de enderecos sequenciais (1-20, padrao 1): ")).trim();

  if (raw === "") {
    return 1;
  }

  const count = Number.parseInt(raw, 10);
  if (!Number.isInteger(count) || count < 1 || count > 20) {
    console.log("Quantidade invalida. Usando padrao 1.");
    return 1;
  }

  return count;
}

function printPublicAddresses(records: readonly PublicAddressRecord[]): void {
  console.log("");
  console.log("Endereco(s) publico(s) gerado(s):");
  for (const [index, record] of records.entries()) {
    console.log(`${index + 1}. ${record.address}`);
    console.log(`   derivationPath: ${record.derivationPath}`);
    console.log(`   network: ${record.network}`);
  }
  console.log("");
}

async function maybeRevealRecoveryPhrase(
  rl: Interface,
  recoveryPhrase: SensitiveText
): Promise<void> {
  const ownerPresent = (
    await rl.question("O DONO da carteira esta presente para anotar a frase? (s/N): ")
  )
    .trim()
    .toLowerCase();

  if (ownerPresent !== "s" && ownerPresent !== "sim") {
    console.log(
      "A frase nao sera exibida. Nao envie fundos para este endereco sem o dono ter anotado a frase."
    );
    return;
  }

  console.log("");
  console.log("Para revelar, digite exatamente:");
  console.log(REVEAL_CONFIRMATION);
  const typed = await rl.question("> ");

  if (typed !== REVEAL_CONFIRMATION) {
    console.log("Confirmacao incorreta. A frase nao sera exibida.");
    return;
  }

  console.log("");
  console.log("FRASE DE RECUPERACAO - MOSTRADA UMA UNICA VEZ");
  console.log(recoveryPhrase.reveal());
  console.log("");
  console.log("Oriente o dono a anotar em papel. Sem print, sem foto, sem nuvem.");
  await rl.question("Pressione Enter somente depois que o dono terminar de anotar.");
  console.clear();
  console.log("Frase removida da tela. Nenhum segredo foi salvo em arquivo.");
}
