/**
 * groupTabFilterView.js
 * View helpers for presenting tab filter results.
 */

import { filterTabs, filterTabsByDomain } from './groupTabFilter.js';
import { getAllGroups } from './manager.js';

/**
 * Get a summary of filter results for a group.
 * @param {string} groupId
 * @param {Object} criteria
 * @returns {Object}
 */
export function getFilterResultSummary(groupId, criteria = {}) {
  const matched = filterTabs(groupId, criteria);
  const groups = getAllGroups();
  const group = groups[groupId];
  const total = group && Array.isArray(group.tabs) ? group.tabs.length : 0;

  return {
    groupId,
    groupName: group ? group.name : null,
    totalTabs: total,
    matchedCount: matched.length,
    unmatchedCount: total - matched.length,
    criteria,
  };
}

/**
 * Get only the titles of matched tabs.
 * @param {string} groupId
 * @param {Object} criteria
 * @returns {string[]}
 */
export function getMatchingTabTitles(groupId, criteria = {}) {
  return filterTabs(groupId, criteria).map(tab => tab.title || tab.url);
}

/**
 * Get a domain breakdown of tabs in a group.
 * @param {string} groupId
 * @returns {Object} domain -> count
 */
export function getDomainBreakdown(groupId) {
  const groups = getAllGroups();
  const group = groups[groupId];
  if (!group || !Array.isArray(group.tabs)) return {};

  const breakdown = {};
  for (const tab of group.tabs) {
    try {
      const { hostname } = new URL(tab.url);
      breakdown[hostname] = (breakdown[hostname] || 0) + 1;
    } catch {
      breakdown['unknown'] = (breakdown['unknown'] || 0) + 1;
    }
  }
  return breakdown;
}

/**
 * Get the top N domains by tab count in a group.
 * @param {string} groupId
 * @param {number} [limit=5] - Maximum number of domains to return
 * @returns {{ domain: string, count: number }[]} Sorted descending by count
 */
export function getTopDomains(groupId, limit = 5) {
  const breakdown = getDomainBreakdown(groupId);
  return Object.entries(breakdown)
    .map(([domain, count]) => ({ domain, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
