import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { simpleGit } from 'simple-git';

async function run() {
  const git = simpleGit();

  const { current } = await git.status();
  const hash = await git.revparse('HEAD');

  const env = `
GIT_BRANCH=${current}
GIT_COMMIT=${hash}
`;

  fs.writeFileSync(path.join(__dirname, '../example/.env'), env);
  console.log(chalk.green(`wrote example .env with:\n${env}`));
}

run();
