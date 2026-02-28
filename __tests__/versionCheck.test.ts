/**
 * Tests for version check: isVersionOlder and checkForUpdate (no false "update required").
 * Run: npm test
 */
jest.mock('expo-constants', () => {
  const c = { expoConfig: { version: '1.1.7' } };
  (global as any).__mockExpoConstants = c;
  return { __esModule: true, default: c };
});
jest.mock('react-native', () => ({ Platform: { OS: 'ios' } }));

import { isVersionOlder, checkForUpdate } from '../utils/versionCheck';

const getMockConstants = () => (global as any).__mockExpoConstants as { expoConfig: { version: string } };

describe('isVersionOlder', () => {
  it('returns true when current is older', () => {
    expect(isVersionOlder('1.0.0', '1.0.1')).toBe(true);
    expect(isVersionOlder('1.1.2', '1.1.7')).toBe(true);
    expect(isVersionOlder('1.0.9', '1.1.0')).toBe(true);
    expect(isVersionOlder('0.9.9', '1.0.0')).toBe(true);
  });

  it('returns false when current is same or newer', () => {
    expect(isVersionOlder('1.1.7', '1.1.7')).toBe(false);
    expect(isVersionOlder('1.1.7', '1.1.2')).toBe(false);
    expect(isVersionOlder('1.2.0', '1.1.9')).toBe(false);
    expect(isVersionOlder('2.0.0', '1.9.9')).toBe(false);
  });

  it('handles missing segments (treats as 0)', () => {
    expect(isVersionOlder('1.1', '1.1.1')).toBe(true);
    expect(isVersionOlder('1.1.0', '1.1')).toBe(false);
  });
});

describe('checkForUpdate', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    getMockConstants().expoConfig.version = '1.1.7';
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('returns up-to-date when app version meets minimumVersion', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          ios: { minimumVersion: '1.1.2', latestVersion: '1.1.7', storeUrl: 'https://apps.apple.com/...' },
        }),
    });
    const result = await checkForUpdate();
    expect(result.type).toBe('up-to-date');
  });

  it('returns up-to-date when app version equals minimumVersion', async () => {
    getMockConstants().expoConfig.version = '1.1.7';
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          ios: { minimumVersion: '1.1.7', latestVersion: '1.1.7', storeUrl: 'https://apps.apple.com/...' },
        }),
    });
    const result = await checkForUpdate();
    expect(result.type).toBe('up-to-date');
  });

  it('returns update-required only when app version is strictly below minimumVersion', async () => {
    getMockConstants().expoConfig.version = '1.1.6';
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          ios: { minimumVersion: '1.1.7', latestVersion: '1.1.7', storeUrl: 'https://apps.apple.com/...' },
        }),
    });
    const result = await checkForUpdate();
    expect(result.type).toBe('update-required');
    if (result.type === 'update-required') {
      expect(result.storeUrl).toBeDefined();
      expect(result.minimumVersion).toBe('1.1.7');
    }
  });

  it('returns up-to-date on fetch failure (no false block)', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    const result = await checkForUpdate();
    expect(result.type).toBe('up-to-date');
  });

  it('returns up-to-date when response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false });
    const result = await checkForUpdate();
    expect(result.type).toBe('up-to-date');
  });

  it('returns up-to-date when config is empty (no false block)', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });
    const result = await checkForUpdate();
    expect(result.type).toBe('up-to-date');
  });

  it('returns up-to-date when minimumVersion is missing for platform', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ios: {}, android: {} }),
    });
    const result = await checkForUpdate();
    expect(result.type).toBe('up-to-date');
  });

  it('returns up-to-date when response is not an object (no false block)', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(null),
    });
    const result = await checkForUpdate();
    expect(result.type).toBe('up-to-date');
  });
});
