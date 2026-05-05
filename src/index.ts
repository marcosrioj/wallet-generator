#!/usr/bin/env node
import { runWizard } from "./ui/wizard.js";

runWizard().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Erro desconhecido.";
  console.error(`Erro fatal: ${message}`);
  process.exitCode = 1;
});
