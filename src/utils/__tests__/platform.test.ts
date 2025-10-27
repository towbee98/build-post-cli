
import { getPlatformConfig } from '../platform';

describe('platform', () => {
  it('should return the config for a specific platform', () => {
    const config = getPlatformConfig('twitter');
    expect(config.maxLength).toBe(280);
  });

  it('should return the generic config for an unknown platform', () => {
    const config = getPlatformConfig('unknown');
    expect(config.maxLength).toBe(Infinity);
  });
});
