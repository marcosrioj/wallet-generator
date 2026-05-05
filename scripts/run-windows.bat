@echo off
cd /d %~dp0\..

echo Instalando dependencias...
npm ci

if errorlevel 1 (
  echo Falha ao instalar.
  exit /b 1
)

echo Verificando ambiente local...
npm run verify
if errorlevel 1 (
  echo Verificacao falhou.
  exit /b 1
)

echo Iniciando wizard...
npm run wizard
