/**
 * groupSearchView.js
 * View helpers that format group search results.
 */

import { searchGroups, searchByName } from './groupSearch.js';
import { getTags } from './tagger.js';
import { getColor } from './groupColorizer.js';
import { getGroupTabCount } from './groupStats.js';

/**
 * Return a lightweight summary for each matched group.
 * @param {object} criteria — passed directly to searchGroups
 * @returns {Array<object>}
 */
export function getSearchResultSummary(criteria = {}) {
  const groups = searchGroups(criteria);
  return groups.map(g => ({
    id: g.id,
    name: g.name,
    tabCount: getGroupTabCount(g.id),
    tags: getTags(g.id) || [],
    color: getColor(g.id) || null
  }));
}

/**
 * Return only group names that match a name query.
 * @param {string} query
 * @returns {Array<string>}
 */
export function getMatchingGroupNames(query) {
  return searchByName(query).map(g => g.name);
}

/**
 * Return a count of how many groups match the given criteria.
 * @param {object} criteria
 * @returns {number}
 */
export function getSearchResultCount(criteria = {}) {
  return searchGroups(criteria).length;
}
