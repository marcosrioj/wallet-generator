# RUNBOOK SUPORTE - Safe Crypto Address Generator

## Objetivo

Gerar endereço público para o cliente sem criar dependência técnica no suporte.

## Passo a passo

1. Preparar máquina limpa
   - Atualizar sistema.
   - Fechar navegadores e aplicações desnecessárias.
   - Verificar atualizações de segurança.
2. Instalar Node.js LTS
   - Confirmar versão instalada com `node -v`.
3. Baixar projeto
   - Clonar o repositório em pasta dedicada.
4. Rodar instalação
   - `npm ci`
5. Rodar verificação
   - `npm run verify`
6. Desconectar internet
   - Remover cabo / desligar Wi-Fi / validar sem conexão.
7. Executar wizard
   - `npm run wizard`
8. Escolher moeda/rede no menu
   - 1 para Ethereum/EVM
   - 2 para Bitcoin Testnet
   - 3 para Bitcoin Mainnet
9. Entregar endereço público ao solicitante
   - Confirmar apenas o campo `address`.
10. Pedir para o dono anotar frase de recuperação
   - Sem o suporte olhar.
   - Sem print, sem foto, sem nuvem.
11. Confirmar que não foi salvo segredo
   - Abrir `output/` e checar que não há `mnemonic`, `seed`, `privateKey`, `xprv`, `phrase`, `recovery`.
12. Apagar `output/` se necessário
   - `rm -rf output` (quando orientação de operação exigir limpeza imediata).
13. Guardar somente endereço público quando apropriado
   - Não armazenar seed em arquivo ou ferramenta de chat.

## Mensagens obrigatórias ao usuário

- "Suporte não deve ver nem copiar a frase."
- "Não é para anotar a frase no celular ou e-mail."
- "Sem foto da tela."

