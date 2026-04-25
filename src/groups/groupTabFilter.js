/**
 * groupTabFilter.js
 * Filter tabs within groups by various criteria such as URL pattern,
 * title keyword, domain, and suspension status.
 */

import { getAllGroups } from './manager.js';
import { isSuspended } from './suspender.js';

/**
 * Normalize a string for comparison.
 * @param {string} str
 * @returns {string}
 */
function normalize(str) {
  return (str || '').toLowerCase().trim();
}

/**
 * Filter tabs in a group by a URL substring or pattern.
 * @param {string} groupId
 * @param {string} urlPattern
 * @returns {Array}
 */
export function filterTabsByUrl(groupId, urlPattern) {
  const groups = getAllGroups();
  const group = groups[groupId];
  if (!group || !Array.isArray(group.tabs)) return [];
  const pattern = normalize(urlPattern);
  return group.tabs.filter(tab => normalize(tab.url).includes(pattern));
}

/**
 * Filter tabs in a group by title keyword.
 * @param {string} groupId
 * @param {string} keyword
 * @returns {Array}
 */
export function filterTabsByTitle(groupId, keyword) {
  const groups = getAllGroups();
  const group = groups[groupId];
  if (!group || !Array.isArray(group.tabs)) return [];
  const kw = normalize(keyword);
  return group.tabs.filter(tab => normalize(tab.title).includes(kw));
}

/**
 * Filter tabs in a group by domain.
 * @param {string} groupId
 * @param {string} domain
 * @returns {Array}
 */
export function filterTabsByDomain(groupId, domain) {
  const groups = getAllGroups();
  const group = groups[groupId];
  if (!group || !Array.isArray(group.tabs)) return [];
  const d = normalize(domain);
  return group.tabs.filter(tab => {
    try {
      const url = new URL(tab.url);
      return normalize(url.hostname).includes(d);
    } catch {
      return false;
    }
  });
}

/**
 * Filter tabs in a group by suspension status.
 * @param {string} groupId
 * @param {boolean} suspended - true to get suspended tabs, false for active
 * @returns {Array}
 */
export function filterTabsBySuspension(groupId, suspended) {
  const groups = getAllGroups();
  const group = groups[groupId];
  if (!group || !Array.isArray(group.tabs)) return [];
  return group.tabs.filter(tab => isSuspended(tab.url) === suspended);
}

/**
 * Apply multiple filters to tabs in a group.
 * @param {string} groupId
 * @param {Object} criteria - { url, title, domain, suspended }
 * @returns {Array}
 */
export function filterTabs(groupId, criteria = {}) {
  const groups = getAllGroups();
  const group = groups[groupId];
  if (!group || !Array.isArray(group.tabs)) return [];

  return group.tabs.filter(tab => {
    if (criteria.url !== undefined && !normalize(tab.url).includes(normalize(criteria.url))) return false;
    if (criteria.title !== undefined && !normalize(tab.title).includes(normalize(criteria.title))) return false;
    if (criteria.domain !== undefined) {
      try {
        const url = new URL(tab.url);
        if (!normalize(url.hostname).includes(normalize(criteria.domain))) return false;
      } catch {
        return false;
      }
    }
    if (criteria.suspended !== undefined && isSuspended(tab.url) !== criteria.suspended) return false;
    return true;
  });
}
