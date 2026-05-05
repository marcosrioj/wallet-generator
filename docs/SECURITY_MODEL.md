# Modelo de segurança

## Threat model simples

- Atacante local (malware, screen-share, webcam).
- Atacante remoto via rede.
- Erro operacional de suporte (exposição da frase).

## O que protegemos

- Segredos criptográficos (frase, seed, private key, xprv).
- Confidencialidade da frase de recuperação.
- Ausência de chamadas de rede em runtime.

## O que não protegemos

- Máquina infectada antes da geração.
- Armazenamento inseguro da frase pelo usuário.
- Falha humana de um operador que observa ou anota fora do protocolo.

## Riscos

- Malware local pode capturar tudo que aparece na tela e teclado.
- Conexão de rede ativa pode facilitar engenharia de engenharia de atualização indevida.
- Dependências npm alteradas podem introduzir comportamento malicioso.

## Por que não existe rede em runtime

- Sem rede, não há endpoint para exfiltrar dados.
- Também evita que a ferramenta vire carteira conectada e envie transações sem intenção.

## Por que não salvamos seed por padrão

- Seed em disco é ponto único de risco.
- Em suporte, evitar persistência reduz o impacto de erro operacional.

## Recomendações adicionais

- Rodar em máquina temporária e limpa.
- Usar hardware wallet para valores altos.
- Preferir criação de multisig quando aplicável.

