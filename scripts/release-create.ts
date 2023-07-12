import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import semver from 'semver';
import inquirer from 'inquirer';
import { simpleGit } from 'simple-git';
import pkg from '../package.json';

async function run() {
  const git = simpleGit();
  const status = await git.status();

  if (status.current !== 'main') {
    console.log(
      chalk.red('Error! Must be on main branch to create a release branch')
    );
    return;
  }

  if (!status.isClean()) {
    console.log(
      chalk.red('Error! Cannot create release with dirty working tree')
    );
    return;
  }

  if (status.ahead > 0) {
    console.log(
      chalk.red(
        `Error! Local commits on main must match with origin/main. You are ${status.ahead} commit(s) ahead`
      )
    );
    return;
  }

  if (status.behind > 0) {
    console.log(
      chalk.red(
        `Error! Local commits on main must match with origin/main. You are ${status.behind} commit(s) behind`
      )
    );
    return;
  }

  try {
    const versions = (['major', 'minor', 'patch'] as semver.ReleaseType[]).map(
      (type) => {
        const version = semver.inc(pkg.version, type);
        return { name: `${type} ${version}`, value: version };
      }
    );

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'bump',
        message: 'Select release type',
        default: versions[1].value,
        choices: versions,
      },
    ]);

    // update to new version
    pkg.version = answers.bump;

    // create release branch
    const branchName = `release/${pkg.version}`;
    await git.checkoutLocalBranch(branchName);

    // write version change
    fs.writeFileSync(
      path.join(__dirname, '../package.json'),
      `${JSON.stringify(pkg, null, '  ')}\n`
    );

    // commit version change
    const message = `created ${branchName} branch`;
    await git
      .add('package.json')
      .commit(`chore: ${message}`, { '--no-verify': null });

    console.log(chalk.green(message));
  } catch (err) {
    console.log(err);
  }
}

run();
