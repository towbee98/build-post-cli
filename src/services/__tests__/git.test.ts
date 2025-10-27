
import { getLatestCommit, getCommitRange } from '../git';
import simpleGit from 'simple-git';

jest.mock('simple-git');

describe('git', () => {
  const mockLog = jest.fn();
  const mockShow = jest.fn();

  beforeEach(() => {
    (simpleGit as jest.Mock).mockReturnValue({
      log: mockLog,
      show: mockShow,
    });
  });

  it('should get the latest commit', async () => {
    mockLog.mockResolvedValue({ latest: { hash: '123', message: 'test', author_name: 'tester', date: '2025-10-27' } });
    const commit = await getLatestCommit();
    expect(commit.commitHash).toBe('123');
  });

  it('should get a commit by hash', async () => {
    mockShow.mockResolvedValue('123\ntest\ntester\n2025-10-27');
    const commit = await getLatestCommit('123');
    expect(commit.commitHash).toBe('123');
  });

  it('should get a commit range', async () => {
    mockLog.mockResolvedValue({ all: [{ hash: '123', message: 'test', author_name: 'tester', date: '2025-10-27' }] });
    const commits = await getCommitRange('HEAD~1..HEAD');
    expect(commits.length).toBe(1);
    expect(commits[0].commitHash).toBe('123');
  });
});
