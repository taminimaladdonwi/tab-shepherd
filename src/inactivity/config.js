/**
 * Default and user-configurable inactivity rules.
 */

export const DEFAULT_CONFIG = {
  /** Milliseconds before a tab is considered idle */
  inactivityThresholdMs: 30 * 60 * 1000, // 30 minutes
  /** How often (ms) the idle-check loop runs */
  checkIntervalMs: 60 * 1000, // 1 minute
  /** Whether to suspend (discard) idle tabs automatically */
  autoSuspend: true,
  /** URL patterns to never suspend (supports * wildcard) */
  whitelistPatterns: [],
};

let currentConfig = { ...DEFAULT_CONFIG };

/**
 * Load config from chrome.storage.sync and merge with defaults.
 * @returns {Promise<object>}
 */
export async function loadConfig() {
  return new Promise((resolve) => {
    chrome.storage.sync.get('tabShepherdConfig', (result) => {
      if (result.tabShepherdConfig) {
        currentConfig = { ...DEFAULT_CONFIG, ...result.tabShepherdConfig };
      }
      resolve(currentConfig);
    });
  });
}

/**
 * Persist updated config values to chrome.storage.sync.
 * @param {Partial<object>} updates
 * @returns {Promise<object>} the merged config
 */
export async function saveConfig(updates) {
  currentConfig = { ...currentConfig, ...updates };
  return new Promise((resolve) => {
    chrome.storage.sync.set({ tabShepherdConfig: currentConfig }, () => {
      resolve(currentConfig);
    });
  });
}

/** Return the in-memory config without hitting storage. */
export function getConfig() {
  return { ...currentConfig };
}
