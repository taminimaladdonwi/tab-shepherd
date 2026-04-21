/**
 * groupWatcher.js
 * Watches groups for changes and triggers callbacks on tab count thresholds.
 */

import { getGroup, getAllGroups } from './manager.js';

const watchers = new Map();

/**
 * Register a watcher for a group.
 * @param {string} groupId
 * @param {{ minTabs?: number, maxTabs?: number, onChange?: Function }} options
 * @returns {string} watcherId
 */
export function watchGroup(groupId, options = {}) {
  const watcherId = `${groupId}_${Date.now()}`;
  watchers.set(watcherId, { groupId, ...options });
  return watcherId;
}

/**
 * Remove a watcher by its ID.
 * @param {string} watcherId
 */
export function unwatchGroup(watcherId) {
  watchers.delete(watcherId);
}

/**
 * Get all active watchers.
 * @returns {Array}
 */
export function getWatchers() {
  return Array.from(watchers.entries()).map(([id, w]) => ({ watcherId: id, ...w }));
}

/**
 * Evaluate all watchers against current group state.
 * Calls onChange when thresholds are breached.
 */
export function evaluateWatchers() {
  const triggered = [];

  for (const [watcherId, watcher] of watchers.entries()) {
    const group = getGroup(watcher.groupId);
    if (!group) continue;

    const tabCount = group.tabs ? group.tabs.length : 0;
    const breached =
      (watcher.minTabs !== undefined && tabCount < watcher.minTabs) ||
      (watcher.maxTabs !== undefined && tabCount > watcher.maxTabs);

    if (breached) {
      triggered.push({ watcherId, groupId: watcher.groupId, tabCount });
      if (typeof watcher.onChange === 'function') {
        watcher.onChange({ groupId: watcher.groupId, tabCount, watcherId });
      }
    }
  }

  return triggered;
}

/**
 * Clear all watchers.
 */
export function clearWatchers() {
  watchers.clear();
}
