import { simpleGit } from 'simple-git';
import { logError, logInfo } from './utils';

async function run() {
  const git = simpleGit();
  const status = await git.status();

  if (!status.current?.startsWith('release/')) {
    return logError(
      'Must be on a release/ branch to list commits for QA to verify'
    );
  }

  const tags = await git.tags();
  const latestTagCommit = await git.revparse(tags.latest ?? 'HEAD');

  const currentCommit = await git.revparse('HEAD');

  const summary = await git.log({
    from: latestTagCommit,
    to: currentCommit,
  });

  summary.all.forEach((commit) => {
    logInfo(commit.message);
  });
}

run();
