#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."

printf "Instalando dependencias...\n"
npm ci

printf "Verificando ambiente local...\n"
npm run verify

printf "Iniciando wizard...\n"
npm run wizard
