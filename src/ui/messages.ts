export const APP_NAME = "Safe Crypto Address Generator";
export const OFFLINE_WARNING = "rode preferencialmente offline";
export const SUPPORT_WARNING =
  "suporte nunca deve ver/copiar a frase de recuperação";
export const HARDWARE_WARNING = "para valores altos, use hardware wallet";
export const MAINNET_RISK_WARNING =
  "AVISO: rede Mainnet envolve risco financeiro real. Gere apenas para uso autorizado.";

export const MENU = `
${APP_NAME}
- ${OFFLINE_WARNING}
- ${SUPPORT_WARNING}
- ${HARDWARE_WARNING}

Opções:
1. Gerar endereço Ethereum/EVM
2. Gerar endereço Bitcoin Testnet
3. Gerar endereço Bitcoin Mainnet
4. Validar endereço público
5. Mostrar checklist de segurança
0. Sair
`;

export const OPTION_1_TEXT = "Será gerada uma nova frase de recuperação local e derivado o endereço Ethereum/EVM (BIP44).";
export const OPTION_2_TEXT = "Será gerada uma nova frase de recuperação local e derivado o endereço Bitcoin Testnet Native SegWit (BIP84).";
export const OPTION_3_TEXT = "Será gerada uma nova frase de recuperação local e derivado o endereço Bitcoin Mainnet Native SegWit (BIP84).";

export const REVEAL_CONFIRMATION_TEXT =
  "Digite exatamente: EU ENTENDO QUE A FRASE DE RECUPERACAO CONTROLA OS FUNDOS";

export const CHECKLIST = `
Checklist de segurança:
1) Wi-Fi desligado.
2) Sem compartilhamento de tela.
3) Sem câmera apontada para a tela.
4) Sem gravação e sem print.
5) Sem backup em nuvem.
6) Dono da carteira anota a frase em papel.
7) Conferir endereço público com o solicitante.
`;

export function normalizeMenuChoice(value: string): string {
  return value.trim();
}

export function createWalletCount(value: string): number;
export function createWalletCount(value: number): number;
export function createWalletCount(value: string | number): number {
  const parsed = typeof value === "number" ? value : Number.parseInt(value.trim(), 10);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return 1;
  }
  if (parsed > 20) {
    return 20;
  }
  return parsed;
}

export function buildAmountMessage(): string {
  return "Quantos endereços de 1 a 20? [1]: ";
}
