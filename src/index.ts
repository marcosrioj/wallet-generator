import { runWizard } from "./ui/wizard";

void runWizard().catch((error) => {
  console.error("Falha ao iniciar o assistente:", error instanceof Error ? error.message : "Erro desconhecido");
  process.exit(1);
});
