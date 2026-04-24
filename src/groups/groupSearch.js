/**
 * groupSearch.js
 * Search and filter groups by name, tags, color, and tab count.
 */

import { getAllGroups } from './manager.js';
import { getTags } from './tagger.js';
import { getColor } from './groupColorizer.js';
import { getGroupTabCount } from './groupStats.js';

/**
 * Normalize a string for case-insensitive comparison.
 * @param {string} str
 * @returns {string}
 */
function normalize(str) {
  return (str || '').toLowerCase().trim();
}

/**
 * Search groups by name substring.
 * @param {string} query
 * @returns {Array<object>}
 */
export function searchByName(query) {
  const q = normalize(query);
  if (!q) return getAllGroups();
  return getAllGroups().filter(g => normalize(g.name).includes(q));
}

/**
 * Filter groups that have a specific tag.
 * @param {string} tag
 * @returns {Array<object>}
 */
export function filterByTag(tag) {
  const t = normalize(tag);
  return getAllGroups().filter(g => {
    const tags = getTags(g.id) || [];
    return tags.map(normalize).includes(t);
  });
}

/**
 * Filter groups by assigned color.
 * @param {string} color
 * @returns {Array<object>}
 */
export function filterByColor(color) {
  const c = normalize(color);
  return getAllGroups().filter(g => normalize(getColor(g.id)) === c);
}

/**
 * Filter groups whose tab count is within [min, max].
 * @param {number} min
 * @param {number} max
 * @returns {Array<object>}
 */
export function filterByTabCount(min = 0, max = Infinity) {
  return getAllGroups().filter(g => {
    const count = getGroupTabCount(g.id);
    return count >= min && count <= max;
  });
}

/**
 * Run a composite search with multiple optional criteria.
 * @param {object} criteria
 * @param {string} [criteria.name]
 * @param {string} [criteria.tag]
 * @param {string} [criteria.color]
 * @param {number} [criteria.minTabs]
 * @param {number} [criteria.maxTabs]
 * @returns {Array<object>}
 */
export function searchGroups({ name, tag, color, minTabs, maxTabs } = {}) {
  let results = getAllGroups();

  if (name) {
    const q = normalize(name);
    results = results.filter(g => normalize(g.name).includes(q));
  }
  if (tag) {
    const t = normalize(tag);
    results = results.filter(g => (getTags(g.id) || []).map(normalize).includes(t));
  }
  if (color) {
    const c = normalize(color);
    results = results.filter(g => normalize(getColor(g.id)) === c);
  }
  if (minTabs !== undefined || maxTabs !== undefined) {
    const lo = minTabs ?? 0;
    const hi = maxTabs ?? Infinity;
    results = results.filter(g => {
      const count = getGroupTabCount(g.id);
      return count >= lo && count <= hi;
    });
  }

  return results;
}
