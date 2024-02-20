import fs from 'fs';
import path from 'path';
import semver from 'semver';
import inquirer from 'inquirer';
import { simpleGit } from 'simple-git';
import pkg from '../package.json';
import { logError, logInfo } from './utils';

async function run() {
  const skipChecks = !!process.env.SKIP_CHECKS;
  const git = simpleGit();
  const status = await git.status();

  if (!skipChecks) {
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
  }

  try {
    // different behavior based on prerelease version or not
    const prerelease = (semver.prerelease(pkg.version) ?? []).length;
    const prereleasepatch = prerelease > 2;

    let bumps = prerelease
      ? ['prereleasenext', 'prereleasepatch', 'prereleasedone']
      : ['premajor', 'preminor', 'prepatch', 'major', 'minor', 'patch'];

    const versions = bumps.map((type) => {
      let version: string | null = pkg.version;
      if (version) {
        switch (type) {
          case 'prereleasenext':
            if (prereleasepatch) {
              // 1.2.3-rc.1.2 -> 1.2.3-rc.1
              // strips the patch, so prerelease will inc to rc.2
              version = version.replace(/\.[^.]*$/gm, '');
            }
            // 1.2.3-rc.1 -> 1.2.3-rc.2
            // increments the last digit
            version = semver.inc(version, 'prerelease', 'rc', '1');
            break;
          case 'prereleasepatch':
            if (prereleasepatch) {
              // 1.2.3-rc.1.2 -> 1.2.3-rc.1.3
              // increments the last digit
              version = semver.inc(version, 'prerelease', 'rc', '1');
            } else {
              // 1.2.3-rc.1 -> 1.2.3-rc.1.2
              // adds a patch digit
              version = `${version}.2`;
            }
            break;
          case 'prereleasedone':
            // 1.2.3-rc.1 -> 1.2.3 or
            // 1.2.3-rc.1.2 -> 1.2.3
            // removes -rc from version
            version = version.replace(/-rc.*/gm, '');
            break;
          case 'premajor':
          case 'preminor':
          case 'prepatch': {
            // 1.2.3 -> 1.2.4-rc.1 or
            // 1.2.3 -> 1.3.0-rc.1 or
            // 1.2.3 -> 2.0.0-rc.1
            // increments and adds prerelease version
            const rtype = type as semver.ReleaseType;
            version = semver.inc(version, rtype, 'rc', '1');
            break;
          }
          default:
            // 1.2.3 -> 1.2.4 or
            // 1.2.3 -> 1.3.0 or
            // 1.2.3 -> 2.0.0
            // increments version
            version = semver.inc(version, type as semver.ReleaseType);
            break;
        }
        if (!version) {
          throw new Error(`Invalid version: ${version}`);
        }
      }
      return { name: `${type} ${version}`, value: version };
    });

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'bump',
        message: `${pkg.version}: select release type`,
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
    logInfo(`don't forget to git push -u origin ${branchName}`);
  } catch (err) {
    console.error(err);
  }
}

run();
