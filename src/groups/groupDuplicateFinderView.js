/**
 * groupDuplicateFinderView.js
 * View helpers for presenting duplicate tab findings.
 */

import { findDuplicateTabs, findDuplicatesInGroup, getDuplicateSummary } from './groupDuplicateFinder.js';
import { getAllGroups } from './manager.js';

/**
 * Get a human-readable report of all cross-group duplicates.
 * @returns {Array<{ url: string, occurrences: number, groups: string[] }>}
 */
export function getCrossGroupDuplicateReport() {
  const dupes = findDuplicateTabs();
  return Object.entries(dupes).map(([normalizedUrl, entries]) => ({
    url: normalizedUrl,
    occurrences: entries.length,
    groups: [...new Set(entries.map((e) => e.groupId))],
  }));
}

/**
 * Get the group with the highest number of internal duplicate URLs.
 * @returns {{ groupId: string, duplicateUrlCount: number } | null}
 */
export function getMostDuplicatedGroup() {
  const summary = getDuplicateSummary();
  if (!summary.length) return null;
  return summary.reduce((max, cur) =>
    cur.duplicateUrlCount > max.duplicateUrlCount ? cur : max
  );
}

/**
 * Get a display-friendly list of duplicate URLs within a group.
 * @param {string} groupId
 * @returns {Array<{ url: string, tabIds: string[] }>}
 */
export function getDuplicateTabList(groupId) {
  const dupes = findDuplicatesInGroup(groupId);
  return Object.entries(dupes).map(([normalizedUrl, entries]) => ({
    url: normalizedUrl,
    tabIds: entries.map((e) => e.tabId),
  }));
}
