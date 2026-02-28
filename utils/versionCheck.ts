import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * URL of the version JSON file. Host this at your domain (e.g. https://khafi.org/version.json)
 * and update it when you release a new build.
 *
 * Forced update: set minimumVersion to the current store version (e.g. "1.1.7"). Any app
 * with a version lower than that will see a blocking "Update required" screen and cannot
 * use the app until they update. Update public/version.json and the same file on khafi.org.
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
    // Cache-bust so devices get fresh minimumVersion (needed for forced updates)
    const url = `${VERSION_CHECK_URL}?v=${Date.now()}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) return { type: 'up-to-date' };

    const raw = await res.json();
    const data = typeof raw === 'object' && raw !== null ? raw : {};
    const ios = data?.ios ?? {};
    const android = data?.android ?? {};
    const config = platform === 'ios' ? ios : android;

    const minimumVersion =
      typeof config.minimumVersion === 'string' ? config.minimumVersion : typeof config.minimum_version === 'string' ? config.minimum_version : undefined;
    const latestVersion =
      typeof config.latestVersion === 'string' ? config.latestVersion : typeof config.latest_version === 'string' ? config.latest_version : minimumVersion;
    const defaultIos = 'https://apps.apple.com/us/app/khafi/id6758224320';
    const defaultAndroid = 'https://play.google.com/store/apps/details?id=com.khafi.app';
    const storeUrl =
      platform === 'ios'
        ? config.storeUrl ?? config.store_url ?? defaultIos
        : config.storeUrl ?? config.store_url ?? defaultAndroid;

    if (!minimumVersion && !latestVersion) return { type: 'up-to-date' };

    if (minimumVersion && isVersionOlder(currentVersion, minimumVersion)) {
      return { type: 'update-required', storeUrl: storeUrl || (platform === 'ios' ? defaultIos : defaultAndroid), minimumVersion };
    }

    if (latestVersion && isVersionOlder(currentVersion, latestVersion)) {
      return {
        type: 'update-optional',
        storeUrl: storeUrl || (platform === 'ios' ? defaultIos : defaultAndroid),
        latestVersion,
      };
    }

    return { type: 'up-to-date' };
  } catch {
    return { type: 'up-to-date' };
  }
}
