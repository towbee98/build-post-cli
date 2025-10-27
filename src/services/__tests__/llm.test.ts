
import { generatePost } from '../llm';
import * as config from '../../utils/config';
import * as platform from '../../utils/platform';
import fs from 'fs';
import yaml from 'yaml';

jest.mock('../../utils/config');
jest.mock('../../utils/platform');
jest.mock('fs');
jest.mock('yaml');
jest.mock('openai', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    chat: {
      completions: {
        create: jest.fn(() => Promise.resolve({ choices: [{ message: { content: 'test post' } }] })),
      },
    },
  })),
}));
jest.mock('groq-sdk', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    chat: {
      completions: {
        create: jest.fn(() => Promise.resolve({ choices: [{ message: { content: 'test post' } }] })),
      },
    },
  })),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ candidates: [{ content: { parts: [{ text: 'test post' }] } }] }),
  } as Response)
);

describe('llm', () => {
  beforeEach(() => {
    (config.getConfig as jest.Mock).mockReturnValue({ provider: 'openai', model: 'gpt-4o-mini' });
    (config.getApiKey as jest.Mock).mockReturnValue('test-key');
    (platform.getPlatformConfig as jest.Mock).mockReturnValue({ maxLength: 280 });
    (fs.readFileSync as jest.Mock).mockReturnValue('prompt: "{message}"');
    (yaml.parse as jest.Mock).mockReturnValue({ prompt: 'test prompt' });
  });

  it('should generate a post for a single commit', async () => {
    const post = await generatePost({ message: 'test commit' }, 'casual', 'twitter');
    expect(post).toBe('test post');
  });

  it('should generate a post for a commit range', async () => {
    const post = await generatePost([{ message: 'test commit' }], 'casual', 'twitter');
    expect(post).toBe('test post');
  });

  it('should truncate a post that is too long', async () => {
    (platform.getPlatformConfig as jest.Mock).mockReturnValue({ maxLength: 5 });
    const post = await generatePost({ message: 'test commit' }, 'casual', 'twitter');
    expect(post.length).toBe(5);
  });
});
