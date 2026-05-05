# Modelo De Seguranca

## Objetivo

Gerar enderecos publicos novos localmente, com uma frase de recuperacao nova, sem rede em runtime e sem salvar segredos por padrao.

## O Que Protegemos

- Evitar dependencia de RPC, API, explorer ou servico externo durante o uso.
- Evitar que a frase de recuperacao seja salva em `output/`.
- Evitar logs acidentais de objetos com campos sensiveis.
- Evitar uso de gerador pseudoaleatorio nao criptografico no codigo da ferramenta.
- Reduzir a chance de suporte ver ou copiar a frase.

## O Que Nao Protegemos

- Maquina com malware.
- Keylogger.
- Gravador de tela.
- Camera externa apontada para o monitor.
- Pessoa mal-intencionada fisicamente presente.
- Dependencia npm comprometida antes da instalacao.
- Terminal com historico visual ou scrollback ja capturado.

## Threat Model Simples

Atacantes considerados:

- Malware local tentando ler tela, teclado, memoria ou arquivos.
- Suporte vendo ou copiando a frase de recuperacao.
- Dependencia npm maliciosa ou comprometida.
- Uso acidental de Bitcoin mainnet quando a intencao era apenas treinamento.
- Salvamento acidental de segredo em arquivo ou log.

## Risco De Malware Na Maquina

Se a maquina esta comprometida, a ferramenta nao consegue garantir seguranca. Malware pode capturar teclado, tela, memoria e arquivos temporarios do sistema. Para valores altos, use hardware wallet em maquina confiavel ou fluxo multisig.

## Risco De Suporte Ver A Frase

O suporte pode operar a ferramenta, mas nao deve ver a frase. O dono da carteira deve estar presente para anotar a frase em papel. Se o suporte viu a frase, a carteira deve ser considerada comprometida.

## Risco De Supply Chain npm

As dependencias sao conhecidas e listadas em `package-lock.json`, mas ainda existe risco de supply chain. Para uso sensivel:

- Rode `npm ci`, nao `npm install`, em ambiente controlado.
- Revise `package-lock.json`.
- Armazene uma copia auditada das dependencias.
- Use checksums e processo interno de aprovacao, se disponivel.

## Por Que Nao Existe Rede Em Runtime

A ferramenta so precisa gerar entropia local, derivar chaves e formatar enderecos. Consultar saldo, transmitir transacao ou buscar dados externos nao faz parte do objetivo. O wizard instala uma guarda que bloqueia chamadas por `fetch`, `http`, `https`, `net` e `tls`.

## Por Que Nao Salvamos Segredo Por Padrao

Salvar frase de recuperacao, private key ou xprv cria um ponto de vazamento simples. Por isso `safeOutput` aceita somente:

- coin
- network
- address
- derivationPath
- createdAt
- warning

Qualquer campo sensivel ou valor com padrao de segredo e rejeitado.

## Limpeza De Variaveis Sensiveis

O projeto limpa buffers de seed usados na derivacao Bitcoin e remove referencias ao texto sensivel depois do fluxo. Limpeza de string em JavaScript e best effort: o runtime pode manter copias internas ate a coleta de lixo.

## Recomendacoes Para Producao

- Use maquina limpa e offline.
- Para treinamento, nao use esta ferramenta com fundos reais.
- Para dinheiro real, prefira hardware wallet.
- Para valores altos, use multisig.
- Mantenha procedimento escrito para suporte.
- Nao permita gravacao de tela durante a exibicao da frase.
- Gere uma nova carteira se qualquer pessoa indevida viu a frase.
