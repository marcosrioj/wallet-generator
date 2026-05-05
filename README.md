# safe-crypto-address-generator

Ferramenta local, simples e em modo terminal para gerar enderecos publicos novos de cripto sem depender de servicos externos em runtime.

Ela gera apenas carteiras de producao:

- Ethereum/EVM: `m/44'/60'/0'/0/0`
- Bitcoin mainnet Native SegWit BIP84: `m/84'/0'/0'/0/0`, endereco `bc1...`

Para valores altos, use hardware wallet ou multisig.

## O Que Ela Faz

- Gera uma frase de recuperacao nova com entropia criptograficamente segura.
- Deriva 1 a 20 enderecos sequenciais, com padrao 1.
- Mostra primeiro somente o endereco publico e o caminho de derivacao.
- Salva somente dados publicos em `output/addresses.csv` e `output/last-address.txt`.
- Exige confirmacao textual explicita antes de revelar a frase de recuperacao.
- Valida endereco publico ETH e BTC mainnet `bc1`.
- Bloqueia chamadas de rede em runtime com uma guarda local.

## O Que Ela Nao Faz

- Nao envia transacoes.
- Nao assina transacoes.
- Nao consulta saldo.
- Nao conecta em RPC, API, explorer, Infura, Alchemy, Etherscan ou servico externo.
- Nao tem telemetry, analytics ou tracking.
- Nao pede frase existente.
- Nao importa carteira existente.
- Nao gera vanity address.
- Nao copia segredo para clipboard.
- Nao salva frase de recuperacao, private key, xprv ou segredo em arquivo por padrao.
- Nao deve ser usada por suporte para ver, copiar, fotografar ou armazenar a frase.

## Instalacao

Requisitos:

- Git.
- Node.js LTS 20 ou superior.
- npm, incluido no Node.js.

Baixar pelo GitHub:

```bash
git clone https://github.com/marcosrioj/wallet-generator.git
cd wallet-generator
```

Instalar e verificar:

```bash
npm ci
npm run verify
```

Depois da instalacao e verificacao, desconecte a internet antes de executar o wizard.

## Executar No Windows

```bat
scripts\run-windows.bat
```

Ou:

```bat
npm run wizard
```

## Executar No macOS/Linux

```bash
./scripts/run-macos-linux.sh
```

Ou:

```bash
npm run wizard
```

## Rodar Offline Depois Da Instalacao

1. Execute `npm ci` enquanto ainda tem internet.
2. Execute `npm run verify`.
3. Desconecte Wi-Fi/cabo de rede.
4. Rode `npm run wizard`.
5. Gere o endereco.
6. Revele a frase de recuperacao somente se o dono da carteira estiver presente.

A ferramenta nao precisa de rede em runtime e instala uma guarda que bloqueia `fetch`, `http`, `https`, `net` e `tls` durante o wizard.

## Exemplo De Tela

```text
safe-crypto-address-generator

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
```

## Testes E Verificacao

```bash
npm run build
npm test
npm run verify
```

`npm run verify` executa:

1. TypeScript strict.
2. ESLint.
3. Testes automatizados.
4. Checagem contra uso de gerador pseudoaleatorio nao criptografico em `src/`.
5. Checagem de termos sensiveis em `output/`.

## Verificar Que So Dados Publicos Foram Salvos

```bash
npm run check:output-secrets
```

Os arquivos esperados sao:

- `output/addresses.csv`
- `output/last-address.txt`

Eles devem conter somente:

- coin
- network
- address
- derivationPath
- createdAt
- warning

## Regra Para Suporte

O suporte pode operar a ferramenta, mas nunca deve anotar, fotografar, copiar ou armazenar a frase de recuperacao. O dono da carteira deve estar presente para anotar em papel. Se o suporte viu a frase, considere a carteira comprometida e gere outra em ambiente seguro.

## Links

- Repositorio GitHub: https://github.com/marcosrioj/wallet-generator
- Git: https://git-scm.com/
- Node.js LTS: https://nodejs.org/
- npm `ci`: https://docs.npmjs.com/cli/v10/commands/npm-ci
- Runbook para suporte: [docs/RUNBOOK_SUPORTE.md](docs/RUNBOOK_SUPORTE.md)
- Guia do usuario final: [docs/GUIA_USUARIO_FINAL.md](docs/GUIA_USUARIO_FINAL.md)
- Checklist offline imprimivel: [docs/CHECKLIST_OFFLINE.md](docs/CHECKLIST_OFFLINE.md)
- Modelo de seguranca: [docs/SECURITY_MODEL.md](docs/SECURITY_MODEL.md)
- Politica de seguranca: [SECURITY.md](SECURITY.md)
- Fontes oficiais das bibliotecas e BIPs: [docs/SOURCES.md](docs/SOURCES.md)
- Dependencias do projeto: [package.json](package.json)
- Versoes travadas: [package-lock.json](package-lock.json)
- ethers GitHub: https://github.com/ethers-io/ethers.js/
- ethers v6 docs: https://docs.ethers.org/v6/
- bitcoinjs-lib GitHub: https://github.com/bitcoinjs/bitcoinjs-lib
- bip32 GitHub: https://github.com/bitcoinjs/bip32
- tiny-secp256k1 GitHub: https://github.com/bitcoinjs/tiny-secp256k1
- scure-bip39 GitHub: https://github.com/paulmillr/scure-bip39
- BIP39 oficial: https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki
- BIP44 oficial: https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
- BIP84 oficial: https://github.com/bitcoin/bips/blob/master/bip-0084.mediawiki
