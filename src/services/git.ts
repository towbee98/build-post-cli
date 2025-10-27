
import simpleGit from "simple-git";

export async function getLatestCommit(hash?: string) {
  const git = simpleGit();

  if (hash) {
    const log = await git.show([hash, "--pretty=format:%H%n%s%n%an%n%ad", "--no-patch"]);
    const [commitHash, message, author, date] = log.split("\n");
    return { commitHash, message, author, date };
  }

  const log = await git.log({ n: 1 });
  const latest = log.latest!;
  return {
    commitHash: latest.hash,
    message: latest.message,
    author: latest.author_name,
    date: latest.date,
  };
}

export async function getCommitRange(range: string) {
  const git = simpleGit();
  const [start, end] = range.split("..");
  const log = await git.log({ from: start, to: end });
  return log.all.map((commit) => ({
    commitHash: commit.hash,
    message: commit.message,
    author: commit.author_name,
    date: commit.date,
  }));
}

