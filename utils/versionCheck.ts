import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * URL of the version JSON file. Host this at your domain (e.g. https://khafi.org/version.json)
 * and update it when you release a new build.
 */
export const VERSION_CHECK_URL =
  'https://khafi.org/version.json';

export type VersionCheckResult =
  | { type: 'up-to-date' }
  | { type: 'update-optional'; storeUrl: string; latestVersion: string }
  | { type: 'update-required'; storeUrl: string; minimumVersion: string };

/**
 * Parse "1.2.3" into [1, 2, 3] for comparison.
 */
function parseVersion(version: string): number[] {
  return version.split('.').map((s) => parseInt(s.replace(/\D/g, '') || '0', 10));
}

/**
 * Returns true if current < required (current is older).
 */
export function isVersionOlder(current: string, required: string): boolean {
  const a = parseVersion(current);
  const b = parseVersion(required);
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const na = a[i] ?? 0;
    const nb = b[i] ?? 0;
    if (na < nb) return true;
    if (na > nb) return false;
  }
  return false;
}

/**
 * Fetch remote version config and compare with current app version.
 * Call this on app launch (and optionally from Settings "Check for updates").
 */
export async function checkForUpdate(): Promise<VersionCheckResult> {
  const currentVersion = Constants.expoConfig?.version ?? '0.0.0';
  const platform = Platform.OS;

  try {
    const res = await fetch(VERSION_CHECK_URL, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return { type: 'up-to-date' };

    const data = await res.json();
    const ios = data?.ios ?? {};
    const android = data?.android ?? {};
    const config = platform === 'ios' ? ios : android;

    const minimumVersion = config.minimumVersion ?? config.minimum_version;
    const latestVersion = config.latestVersion ?? config.latest_version ?? minimumVersion;
    const storeUrl =
      platform === 'ios'
        ? config.storeUrl ?? config.store_url ?? 'https://apps.apple.com/us/app/khafi/id6758224320'
        : config.storeUrl ?? config.store_url ?? '';

    if (!minimumVersion && !latestVersion) return { type: 'up-to-date' };

    if (minimumVersion && isVersionOlder(currentVersion, minimumVersion)) {
      return { type: 'update-required', storeUrl: storeUrl || 'https://apps.apple.com/us/app/khafi/id6758224320', minimumVersion };
    }

    if (latestVersion && isVersionOlder(currentVersion, latestVersion)) {
      return {
        type: 'update-optional',
        storeUrl: storeUrl || 'https://apps.apple.com/us/app/khafi/id6758224320',
        latestVersion,
      };
    }

    return { type: 'up-to-date' };
  } catch {
    return { type: 'up-to-date' };
  }
}
