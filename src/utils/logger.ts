import chalk from "chalk";
import ora from "ora";

export const spinner = ora();

export const log = {
  info: (msg: string) => console.log(chalk.blueBright(msg)),
  success: (msg: string) => console.log(chalk.greenBright(msg)),
  warn: (msg: string) => console.log(chalk.yellowBright(msg)),
  error: (msg: string) => console.log(chalk.redBright(msg)),
};
