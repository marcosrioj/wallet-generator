# Runbook Para Suporte

Use este passo a passo sem pular etapas.

## 1. Preparar Maquina Limpa

- Use uma maquina confiavel.
- Feche programas desnecessarios.
- Garanta que nao ha compartilhamento de tela, gravacao ou camera apontada para o monitor.
- Para valores altos, pare o processo e recomende hardware wallet ou multisig.

## 2. Instalar Node.js LTS

- Instale Node.js LTS 20 ou superior pelo site oficial do Node.js.
- Confirme no terminal:

```bash
node --version
npm --version
```

## 3. Baixar Projeto

Baixe ou copie a pasta do projeto `safe-crypto-address-generator` para a maquina.

## 4. Rodar npm ci

Com internet ainda conectada:

```bash
npm ci
```

## 5. Rodar npm run verify

```bash
npm run verify
```

O comando deve passar antes de usar a ferramenta.

## 6. Desconectar Internet

- Desligue Wi-Fi.
- Remova cabo de rede, se houver.
- Confirme que a maquina esta offline.

## 7. Rodar npm run wizard

```bash
npm run wizard
```

## 8. Escolher Moeda/Rede

O menu mostra:

1. Ethereum/EVM
2. Bitcoin Mainnet

Use somente quando o solicitante precisa de carteira de producao. Bitcoin mainnet usa dinheiro real.

## 9. Entregar Endereco Publico

A ferramenta mostra primeiro somente o endereco publico e o caminho de derivacao. Entregue o endereco publico ao solicitante conforme o procedimento interno.

## 10. Dono Anota A Frase

- Pergunte se o dono da carteira esta presente.
- O suporte nao deve ver a frase.
- O dono deve anotar em papel.
- Sem print.
- Sem foto.
- Sem nuvem.
- Sem mensagem instantanea.

Para revelar a frase, o operador deve digitar exatamente:

```text
EU ENTENDO QUE A FRASE DE RECUPERACAO CONTROLA OS FUNDOS
```

## 11. Confirmar Que Nao Foi Salvo Segredo

Depois do fluxo, rode:

```bash
npm run check:output-secrets
```

O resultado esperado e:

```text
OK: nenhum termo sensivel encontrado em output/.
```

## 12. Apagar output/ Se Necessario

A pasta `output/` contem apenas dados publicos, mas pode ser apagada se o procedimento exigir:

```bash
rm -rf output/
```

No Windows, apague a pasta `output` pelo Explorer ou pelo terminal.

## 13. Guardar Somente Endereco Publico

Quando apropriado, guarde somente:

- moeda
- rede
- endereco publico
- caminho de derivacao
- data de criacao

Nunca guarde a frase de recuperacao.

## Regra De Comprometimento

Se o suporte viu, fotografou, copiou ou armazenou a frase, considere a carteira comprometida. Gere uma nova carteira em ambiente seguro e nao envie fundos para a carteira comprometida.
