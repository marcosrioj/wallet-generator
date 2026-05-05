export const TOOL_NAME = "safe-crypto-address-generator";

export const MAIN_MENU = `
${TOOL_NAME}

Avisos importantes:
- Rode preferencialmente offline.
- Suporte nunca deve ver/copiar a frase de recuperacao.
- Para valores altos, use hardware wallet.

Opcoes:
  1. Gerar endereco Ethereum/EVM
  2. Gerar endereco Bitcoin Mainnet
  3. Validar endereco publico
  4. Mostrar checklist de seguranca
  0. Sair
`;

export const OFFLINE_CHECKLIST = `
Checklist de seguranca:
[ ] Wi-Fi desligado
[ ] Sem compartilhamento de tela
[ ] Sem camera apontada
[ ] Sem gravacao
[ ] Sem print
[ ] Sem backup em nuvem
[ ] Dono da carteira presente para anotar em papel
[ ] Endereco publico conferido
`;

export const REVEAL_CONFIRMATION =
  "EU ENTENDO QUE A FRASE DE RECUPERACAO CONTROLA OS FUNDOS";

export function generationIntro(kind: "ethereum" | "bitcoin-mainnet"): string {
  if (kind === "ethereum") {
    return [
      "Sera gerada uma nova carteira Ethereum/EVM localmente.",
      "Primeiro sera exibido apenas o endereco publico 0x..."
    ].join("\n");
  }

  return [
    "Sera gerada uma nova carteira Bitcoin mainnet Native SegWit.",
    "O endereco publico comecara com bc1.",
    "ATENCAO: mainnet usa dinheiro real. Para valores altos, use hardware wallet ou multisig."
  ].join("\n");
}
