import { simpleGit } from 'simple-git';
import pkg from '../package.json';
import { logError, logInfo } from './utils';

async function run() {
  const git = simpleGit();
  const status = await git.status();

  if (!status.current?.startsWith('release/')) {
    return logError('Must be on a release/ branch to create a tag');
  }

  try {
    await git.addAnnotatedTag(pkg.version, `release: ${pkg.version}`);
    logInfo(`created tag ${pkg.version}`);
    logInfo(`don't forget to git push origin ${pkg.version}`);
  } catch (err) {
    console.error(err);
  }
}

run();
