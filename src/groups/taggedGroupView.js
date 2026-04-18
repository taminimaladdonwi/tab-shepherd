/**
 * Provides a combined view of groups enriched with their tags.
 * Bridges manager.js and tagger.js.
 */

import { getAllGroups } from './manager.js';
import { getTags } from './tagger.js';

/**
 * Returns all groups with their associated tags included.
 * @returns {Array<{id: string, tabs: number[], tags: string[], [key: string]: any}>}
 */
export function getAllGroupsWithTags() {
  const groups = getAllGroups();
  return groups.map(group => ({
    ...group,
    tags: getTags(group.id),
  }));
}

/**
 * Returns groups filtered by a specific tag, with full group data.
 * @param {string} tag
 * @returns {Array}
 */
export function getGroupsByTag(tag) {
  return getAllGroupsWithTags().filter(group =>
    group.tags.includes(tag.trim().toLowerCase())
  );
}

/**
 * Returns a summary map of tag -> group count.
 * @returns {Object.<string, number>}
 */
export function getTagSummary() {
  const groups = getAllGroupsWithTags();
  const summary = {};
  for (const group of groups) {
    for (const tag of group.tags) {
      summary[tag] = (summary[tag] ?? 0) + 1;
    }
  }
  return summary;
}
