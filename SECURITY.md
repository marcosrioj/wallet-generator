# Modelo de segurança

## O que protegemos

- Não persistir a frase de recuperação, seed, mnemonic, chave privada ou `xprv`.
- Não expor segredos em logs.
- Não enviar dados pela rede.
- Salvar apenas campos públicos para auditoria mínima (endereço e metadados de derivação).

## O que não protegemos

- A máquina do operador já infectada por malware.
- Câmeras/microfones/screen-share ativos.
- Intervenção física do suporte durante anotação da frase.
- Erros humanos do dono da carteira ao copiar e armazenar.

## Riscos de malware na máquina

- Malware local pode capturar teclado, memória e tela.
- Se a máquina não estiver limpa e offline, o risco aumenta.
- Não há compensação técnica possível dentro desta ferramenta para falhas graves do endpoint local.

## Riscos de suporte ver seed

- Se qualquer pessoa do suporte vê a frase, a carteira deve ser considerada comprometida.
- A frase de recuperação controla total acesso aos fundos.

## Riscos de supply chain npm

- Dependências de Node.js podem sofrer adulteração.
- Solução:
  - Dependências minimizadas.
  - Uso de versões oficiais e consolidadas.
  - Verificação de lockfile no repositório.

## Por que não existe rede em runtime

- Sem rede não há consulta de saldo e não há exfiltração de seeds por canal de API.
- Reduz superfície de ataque e risco de interceptação.

## Por que não salvamos seed por padrão

- Seed salva em disco aumenta risco de vazamento posterior.
- O dono deve manter a frase em papel e sob controle próprio.

## Recomendações para produção

- Usar máquina de trabalho dedicada.
- Executar sem acesso de vídeo/áudio/teclado de terceiros durante a geração.
- Para valores altos, migrar para hardware wallet ou multisig com políticas de cosign.

