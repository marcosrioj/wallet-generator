# Safe Crypto Address Generator

## O que a ferramenta faz

- Gera endereços públicos de:
  1. Ethereum/EVM em `0x...` (BIP44 `m/44'/60'/0'/0/0`).
  2. Bitcoin Testnet Native SegWit (`tb1...`) (BIP84 `m/84'/1'/0'/0/0`).
  3. Bitcoin Mainnet Native SegWit (`bc1...`) (BIP84 `m/84'/0'/0'/0/0`).
- Valida endereço público informado (ETH, BTC mainnet, BTC testnet).
- Grava somente informações públicas em `output/addresses.csv` e `output/last-address.txt`.

## O que a ferramenta não faz

- Não assina transações.
- Não envia transações.
- Não consulta saldo.
- Não conecta em RPC, API, explorer, Infura, Alchemy, Etherscan ou serviços externos.
- Não envia dados por rede (sem chamadas HTTP/HTTPS em runtime).
- Não importa carteira existente.
- Não faz vanity address.
- Não copia seed para clipboard.
- Não salva mnemonic / private key / seed em arquivo.
- Não registra segredos em logs.

## Como instalar

```bash
npm ci
```

## Como executar no Windows

```bat
scripts\run-windows.bat
```

ou:

```bat
npm run wizard
```

## Como executar no macOS/Linux

```bash
./scripts/run-macos-linux.sh
```

ou:

```bash
npm run wizard
```

## Como rodar offline

1. Faça a instalação em um ambiente com internet.
2. Após instalar, desligue a internet ou remova cabo/rede.
3. Execute `npm run wizard`.
4. A ferramenta inicia um menu em terminal e não depende de rede.

## Exemplo de tela

```text
Safe Crypto Address Generator
- rode preferencialmente offline
- suporte nunca deve ver/copiar a frase de recuperação
- para valores altos, use hardware wallet

Opções:
1. Gerar endereço Ethereum/EVM
2. Gerar endereço Bitcoin Testnet
3. Gerar endereço Bitcoin Mainnet
4. Validar endereço público
5. Mostrar checklist de segurança
0. Sair
```

## Como rodar testes

```bash
npm test
```

### Verificação completa

```bash
npm run verify
```

Esse passo roda:

1. `typecheck`
2. `lint`
3. testes
4. checagem de `Math.random()`
5. checagem de segredos em `output/`

## Verificar que só arquivos públicos foram salvos

Abra os arquivos abaixo:

- `output/addresses.csv`
- `output/last-address.txt`

Eles devem conter apenas:

- `coin`
- `network`
- `address`
- `derivationPath`
- `createdAt`
- `warning`

Não deve haver nenhum termo `mnemonic`, `seed`, `privateKey`, `xprv`, `phrase` ou `recovery`.

## Segurança

- Gere as carteiras em máquina local limpa.
- O dono da carteira deve estar presente para anotar a frase de recuperação.
- O suporte **nunca** deve guardar, fotografar ou digitar a frase de recuperação.
- Use o resultado apenas como endereço público.

## Limitação importante

- Esta ferramenta foi feita para operações simples de apoio e geração de endereço público.
- Para valores altos, sempre usar hardware wallet ou multisig.

