#!/usr/bin/env node
import { Command } from "commander";
import { generateCommand } from "./commands/generate";
import { configCommand } from "./commands/config";
import { promptCommand } from "./commands/prompts";

const program = new Command();

program
  .name("buildpost")
  .description("Turn your git commits into engaging social media posts using AI.")
  .version("1.0.0");

program.addCommand(generateCommand);
program.addCommand(configCommand);
program.addCommand(promptCommand);

program.parse(process.argv);
