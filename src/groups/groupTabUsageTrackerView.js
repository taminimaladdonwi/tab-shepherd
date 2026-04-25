import {
  getGroupUsage,
  getMostUsedTab,
  getAllUsage,
} from './groupTabUsageTracker.js';
import { getAllGroups } from './manager.js';

/**
 * Returns a summary of tab usage across all groups.
 * @returns {Object}
 */
export function getUsageSummary() {
  const usage = getAllUsage();
  const entries = Object.entries(usage);
  const totalEvents = entries.reduce((sum, [, u]) => sum + (u.count || 0), 0);
  return {
    trackedTabs: entries.length,
    totalEvents,
  };
}

/**
 * Returns the top N most-used tabs across all groups.
 * @param {number} n
 * @returns {Array<{groupId: string, tabId: string|number, count: number}>}
 */
export function getTopUsedTabs(n = 5) {
  const usage = getAllUsage();
  return Object.entries(usage)
    .map(([key, u]) => {
      const [groupId, tabId] = key.split('::');
      return { groupId, tabId, count: u.count || 0 };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
}

/**
 * Returns groups that have no recorded tab usage.
 * @returns {string[]}
 */
export function getUnusedGroups() {
  const groups = getAllGroups();
  return groups
    .filter((g) => {
      const usage = getGroupUsage(g.id);
      return !usage || Object.keys(usage).length === 0;
    })
    .map((g) => g.id);
}

/**
 * Returns per-group usage stats including most-used tab.
 * @returns {Array<{groupId: string, tabCount: number, totalEvents: number, mostUsedTab: string|null}>}
 */
export function getGroupUsageBreakdown() {
  const groups = getAllGroups();
  return groups.map((g) => {
    const usage = getGroupUsage(g.id) || {};
    const tabs = Object.entries(usage);
    const totalEvents = tabs.reduce((sum, [, u]) => sum + (u.count || 0), 0);
    const mostUsed = getMostUsedTab(g.id);
    return {
      groupId: g.id,
      tabCount: tabs.length,
      totalEvents,
      mostUsedTab: mostUsed ? mostUsed.tabId : null,
    };
  });
}
