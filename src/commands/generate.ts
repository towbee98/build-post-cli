
import { Command } from "commander";
import { getLatestCommit, getCommitRange } from "../services/git";
import { generatePost } from "../services/llm";
import { copyToClipboard } from "../services/clipboard";
import ora from "ora";

export const generateCommand = new Command("generate")
  .description("Generate a post from your latest commit")
  .option("--commit <hash>", "Use a specific commit hash")
  .option("--range <range>", "Use a commit range (e.g., HEAD~3..HEAD)")
  .option("--style <style>", "Prompt style (casual, professional, technical)", "casual")
  .option("--platform <platform>", "Platform (twitter, linkedin, devto, generic)", "twitter")
  .option("--no-copy", "Don't copy output to clipboard")
  .action(async (options) => {
    const spinner = ora("Fetching commit and generating post...").start();

    try {
      let commits: any;
      if (options.range) {
        commits = await getCommitRange(options.range);
      } else {
        commits = await getLatestCommit(options.commit);
      }

      const post = await generatePost(commits, options.style, options.platform);

      spinner.stop();
      console.log("\n✨ Generated Post:\n");
      console.log(post);

      if (options.copy) {
        await copyToClipboard(post);
        console.log("\n📋 Copied to clipboard!");
      }
    } catch (err) {
      spinner.fail("Failed to generate post");
      console.error(err);
    }
  });

