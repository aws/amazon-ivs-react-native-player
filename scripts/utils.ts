import chalk from 'chalk';

export function logInfo(info: string) {
  console.log(chalk.green(info));
}

export function logError(error: string) {
  console.log(chalk.red(`Error! ${error}`));
}
