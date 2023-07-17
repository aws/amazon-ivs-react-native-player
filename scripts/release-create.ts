import fs from 'fs';
import path from 'path';
import semver from 'semver';
import inquirer from 'inquirer';
import { simpleGit } from 'simple-git';
import pkg from '../package.json';
import { logError, logInfo } from './utils';

async function run() {
  const git = simpleGit();
  const status = await git.status();

  if (status.current !== 'main') {
    return logError('Must be on main branch to create a release branch');
  }

  if (!status.isClean()) {
    return logError('Cannot create release with dirty working tree');
  }

  if (status.ahead > 0) {
    return logError(
      `Local commits on main must match with origin/main. You are ${status.ahead} commit(s) ahead`
    );
  }

  if (status.behind > 0) {
    return logError(
      `Local commits on main must match with origin/main. You are ${status.behind} commit(s) behind`
    );
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

    // write package.json version change
    const pkgFilePath = path.join(__dirname, '../package.json');
    fs.writeFileSync(pkgFilePath, `${JSON.stringify(pkg, null, '  ')}\n`);

    // write example xcode project version change
    const projectFilePath = path.join(
      __dirname,
      '../example/ios/AmazonIvsExample.xcodeproj/project.pbxproj'
    );
    const projectFile = fs.readFileSync(projectFilePath, { encoding: 'utf8' });

    const updatedProjectFile = projectFile.replaceAll(
      /MARKETING_VERSION = [\d.]+;/g,
      `MARKETING_VERSION = ${pkg.version};`
    );

    fs.writeFileSync(projectFilePath, updatedProjectFile);

    // commit version change(s)
    const message = `created ${branchName} branch`;
    await git
      .add(pkgFilePath)
      .add(projectFilePath)
      .commit(`chore: ${message}`, { '--no-verify': null });

    logInfo(message);
  } catch (err) {
    console.error(err);
  }
}

run();
