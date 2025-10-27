import { Command } from "commander";
import { getConfig, setProvider, setApiKey, resetConfig, showConfig } from "../utils/config";
import { log } from "../utils/logger";

export const configCommand = new Command("config");

configCommand
  .description("Manage BuildPost configuration");

configCommand
  .command("show")
  .description("Show current configuration")
  .action(() => {
    log.info("Current BuildPost Configuration:");
    showConfig();
  });

configCommand
  .command("set-provider")
  .description("Set LLM provider and optional model")
  .option("--provider <provider>", "openai, groq, or gemini", "openai")
  .option("--model <model>", "model name (e.g. gpt-4o-mini)")
  .action((opts) => {
    setProvider(opts.provider, opts.model);
    log.success(`Provider set to ${opts.provider} (${opts.model || "default model"})`);
  });

configCommand
  .command("set-key")
  .description("Save API key for a provider")
  .option("--provider <provider>", "openai, groq, or gemini", "openai")
  .argument("<key>", "API key value")
  .action((key, opts) => {
    setApiKey(opts.provider, key);
    log.success(`API key saved for ${opts.provider}`);
  });

configCommand
  .command("reset")
  .description("Reset configuration to defaults")
  .action(() => {
    resetConfig();
    log.warn("Configuration reset to defaults");
  });
