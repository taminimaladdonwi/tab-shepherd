/**
 * groupPinner.js
 * Manages pinned state for tab groups, preventing pinned groups from being suspended or archived.
 */

const pinnedGroups = new Map(); // groupId -> { pinnedAt, reason }

/**
 * Pin a group to prevent it from being suspended or archived.
 * @param {string} groupId
 * @param {string} [reason]
 * @returns {{ groupId: string, pinnedAt: number, reason: string }}
 */
function pinGroup(groupId, reason = '') {
  if (!groupId) throw new Error('groupId is required');
  const entry = { groupId, pinnedAt: Date.now(), reason };
  pinnedGroups.set(groupId, entry);
  return entry;
}

/**
 * Unpin a group, allowing it to be suspended or archived again.
 * @param {string} groupId
 * @returns {boolean} true if the group was pinned and is now unpinned
 */
function unpinGroup(groupId) {
  return pinnedGroups.delete(groupId);
}

/**
 * Check whether a group is currently pinned.
 * @param {string} groupId
 * @returns {boolean}
 */
function isPinned(groupId) {
  return pinnedGroups.has(groupId);
}

/**
 * Get pin metadata for a group.
 * @param {string} groupId
 * @returns {{ groupId: string, pinnedAt: number, reason: string } | null}
 */
function getPinInfo(groupId) {
  return pinnedGroups.get(groupId) || null;
}

/**
 * Return all currently pinned group IDs.
 * @returns {string[]}
 */
function getAllPinned() {
  return Array.from(pinnedGroups.keys());
}

/**
 * Filter out pinned groups from a list of group IDs.
 * @param {string[]} groupIds
 * @returns {string[]}
 */
function filterOutPinned(groupIds) {
  return groupIds.filter(id => !pinnedGroups.has(id));
}

/**
 * Clear all pinned groups (primarily for testing).
 */
function clearPinned() {
  pinnedGroups.clear();
}

module.exports = {
  pinGroup,
  unpinGroup,
  isPinned,
  getPinInfo,
  getAllPinned,
  filterOutPinned,
  clearPinned
};
