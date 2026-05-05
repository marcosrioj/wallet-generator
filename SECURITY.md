# Politica De Seguranca

Esta ferramenta foi desenhada para uso local e offline na geracao de enderecos publicos novos.

## Pontos Criticos

- A frase de recuperacao controla os fundos.
- O suporte nao deve ver, copiar, fotografar ou armazenar a frase.
- Se qualquer pessoa nao autorizada viu a frase, a carteira deve ser considerada comprometida.
- Para dinheiro real ou valores altos, use hardware wallet ou multisig.

## Reportar Problemas

Ao revisar ou modificar o projeto, trate como problema critico qualquer comportamento que:

- Salve frase de recuperacao, private key, xprv ou segredo em arquivo.
- Faca chamada de rede em runtime.
- Use gerador pseudoaleatorio nao criptografico para material criptografico.
- Exiba segredo sem confirmacao explicita.
- Registre segredo em log ou stack trace.

## Limitacoes

JavaScript nao permite apagar strings imutaveis da memoria de forma garantida. O projeto limpa referencias sensiveis da melhor forma possivel, mas uma maquina com malware, keylogger, gravador de tela ou memoria comprometida continua sendo insegura.
