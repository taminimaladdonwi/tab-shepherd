/**
 * groupDuplicateFinder.js
 * Detects duplicate tabs across groups based on URL matching.
 */

import { getAllGroups } from './manager.js';

/**
 * Normalize a URL for comparison (strip trailing slash, fragment, etc.)
 * @param {string} url
 * @returns {string}
 */
export function normalizeUrl(url) {
  try {
    const u = new URL(url);
    u.hash = '';
    let href = u.toString();
    if (href.endsWith('/')) href = href.slice(0, -1);
    return href.toLowerCase();
  } catch {
    return url.trim().toLowerCase();
  }
}

/**
 * Find all tabs that share the same normalized URL across all groups.
 * @returns {Object} map of normalizedUrl -> Array<{ groupId, tabId, url }>
 */
export function findDuplicateTabs() {
  const groups = getAllGroups();
  const urlMap = {};

  for (const [groupId, group] of Object.entries(groups)) {
    const tabs = group.tabs || [];
    for (const tab of tabs) {
      const key = normalizeUrl(tab.url);
      if (!urlMap[key]) urlMap[key] = [];
      urlMap[key].push({ groupId, tabId: tab.id, url: tab.url });
    }
  }

  const duplicates = {};
  for (const [key, entries] of Object.entries(urlMap)) {
    if (entries.length > 1) duplicates[key] = entries;
  }

  return duplicates;
}

/**
 * Find duplicate tabs within a single group.
 * @param {string} groupId
 * @returns {Object} map of normalizedUrl -> Array<{ tabId, url }>
 */
export function findDuplicatesInGroup(groupId) {
  const groups = getAllGroups();
  const group = groups[groupId];
  if (!group) return {};

  const urlMap = {};
  for (const tab of group.tabs || []) {
    const key = normalizeUrl(tab.url);
    if (!urlMap[key]) urlMap[key] = [];
    urlMap[key].push({ tabId: tab.id, url: tab.url });
  }

  const duplicates = {};
  for (const [key, entries] of Object.entries(urlMap)) {
    if (entries.length > 1) duplicates[key] = entries;
  }

  return duplicates;
}

/**
 * Get a flat summary of duplicate counts per group.
 * @returns {Array<{ groupId, duplicateUrlCount, totalDuplicateTabs }>}
 */
export function getDuplicateSummary() {
  const groups = getAllGroups();
  return Object.keys(groups).map((groupId) => {
    const dupes = findDuplicatesInGroup(groupId);
    const urlCount = Object.keys(dupes).length;
    const tabCount = Object.values(dupes).reduce((sum, arr) => sum + arr.length, 0);
    return { groupId, duplicateUrlCount: urlCount, totalDuplicateTabs: tabCount };
  }).filter((s) => s.duplicateUrlCount > 0);
}
