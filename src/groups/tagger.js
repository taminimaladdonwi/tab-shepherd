/**
 * Assigns and manages tags/labels for tab groups.
 */

const groupTags = new Map();

/**
 * Set tags for a group.
 * @param {string} groupId
 * @param {string[]} tags
 */
export function setTags(groupId, tags) {
  if (!Array.isArray(tags)) throw new TypeError('tags must be an array');
  groupTags.set(groupId, [...new Set(tags.map(t => t.trim().toLowerCase()))]);
}

/**
 * Get tags for a group.
 * @param {string} groupId
 * @returns {string[]}
 */
export function getTags(groupId) {
  return groupTags.get(groupId) ?? [];
}

/**
 * Add a single tag to a group.
 * @param {string} groupId
 * @param {string} tag
 */
export function addTag(groupId, tag) {
  const current = getTags(groupId);
  const normalized = tag.trim().toLowerCase();
  if (!current.includes(normalized)) {
    groupTags.set(groupId, [...current, normalized]);
  }
}

/**
 * Remove a single tag from a group.
 * @param {string} groupId
 * @param {string} tag
 */
export function removeTag(groupId, tag) {
  const normalized = tag.trim().toLowerCase();
  const current = getTags(groupId);
  groupTags.set(groupId, current.filter(t => t !== normalized));
}

/**
 * Find all group IDs that have a given tag.
 * @param {string} tag
 * @returns {string[]}
 */
export function findGroupsByTag(tag) {
  const normalized = tag.trim().toLowerCase();
  const result = [];
  for (const [groupId, tags] of groupTags.entries()) {
    if (tags.includes(normalized)) result.push(groupId);
  }
  return result;
}

/**
 * Clear all tags (used in tests / reset).
 */
export function clearAllTags() {
  groupTags.clear();
}
