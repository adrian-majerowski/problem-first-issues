#!/usr/bin/env node

import { Command } from "commander";
import { runInit } from "./commands/init.js";

const program = new Command();

program
  .name("feature-handoff")
  .description("Generate a problem-first GitHub Issue Form template.")
  .version("0.1.0");

program
  .command("init")
  .description("Create Feature Handoff GitHub Issue Form files.")
  .option("--force", "Overwrite existing generated files without asking.")
  .option("--no-config", "Do not create config.yml.")
  .action(async (options: { force?: boolean; config?: boolean }) => {
    const result = await runInit({
      cwd: process.cwd(),
      force: Boolean(options.force),
      config: options.config ?? true
    });

    if (result.status === "skipped") {
      process.exitCode = 1;
    }
  });

await program.parseAsync(process.argv);
