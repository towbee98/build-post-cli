import { Command } from "commander";
import fs from "fs";
import path from "path";
import yaml from "yaml";
import { log } from "../utils/logger";

const PROMPT_DIR = path.join(process.env.HOME || "", ".buildpost", "prompts");

export const promptCommand = new Command("prompts");

promptCommand
  .description("Manage and view prompt templates");

promptCommand
  .command("list")
  .description("List available prompt templates")
  .action(() => {
    if (!fs.existsSync(PROMPT_DIR)) {
      log.warn("No prompts directory found. Run `buildpost prompts init` first.");
      return;
    }

    const files = fs.readdirSync(PROMPT_DIR).filter((f) => f.endsWith(".yaml"));
    if (!files.length) {
      log.warn("No templates found.");
      return;
    }

    log.info("Available prompt templates:");
    files.forEach((f) => console.log(`• ${f.replace(".yaml", "")}`));
  });

promptCommand
  .command("init")
  .description("Initialize default prompt templates")
  .action(() => {
    fs.mkdirSync(PROMPT_DIR, { recursive: true });
    const defaultTemplates = {
      casual: "You are a friendly developer writing casual, emoji-filled posts.",
      professional: "You are a polished software engineer writing LinkedIn-style updates.",
      technical: "You write educational, code-focused posts for Dev.to readers.",
    };

    for (const [name, desc] of Object.entries(defaultTemplates)) {
      const filePath = path.join(PROMPT_DIR, `${name}.yaml`);
      const content = yaml.stringify({
        name,
        description: desc,
        template: `Based on this commit, create a ${name} post.`,
      });
      fs.writeFileSync(filePath, content, "utf8");
    }

    log.success(`Default prompts initialized at ${PROMPT_DIR}`);
  });

promptCommand
  .command("edit <name>")
  .description("Edit a specific prompt file in your default editor")
  .action((name) => {
    const filePath = path.join(PROMPT_DIR, `${name}.yaml`);
    if (!fs.existsSync(filePath)) {
      log.error(`Prompt "${name}" not found. Run \`buildpost prompts list\` to see available ones.`);
      return;
    }

    const editor = process.env.EDITOR || "nano";
    require("child_process").spawnSync(editor, [filePath], { stdio: "inherit" });
  });
