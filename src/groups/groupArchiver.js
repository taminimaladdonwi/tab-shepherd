// groupArchiver.js — archive and restore tab groups

const archived = new Map();

/**
 * Archive a group by id, storing a snapshot of its state.
 * @param {string} groupId
 * @param {object} group - group object from manager
 * @returns {object} archived entry
 */
function archiveGroup(groupId, group) {
  if (!groupId || !group) throw new Error('groupId and group are required');
  const entry = {
    groupId,
    group: { ...group, tabs: Array.isArray(group.tabs) ? [...group.tabs] : [] },
    archivedAt: Date.now(),
  };
  archived.set(groupId, entry);
  return entry;
}

/**
 * Restore a previously archived group.
 * @param {string} groupId
 * @returns {object|null} the restored group or null
 */
function restoreArchivedGroup(groupId) {
  const entry = archived.get(groupId);
  if (!entry) return null;
  archived.delete(groupId);
  return entry.group;
}

/**
 * Check if a group is currently archived.
 * @param {string} groupId
 * @returns {boolean}
 */
function isArchived(groupId) {
  return archived.has(groupId);
}

/**
 * Get all archived group entries.
 * @returns {object[]}
 */
function getAllArchived() {
  return Array.from(archived.values());
}

/**
 * Delete an archived group without restoring it.
 * @param {string} groupId
 * @returns {boolean}
 */
function deleteArchived(groupId) {
  return archived.delete(groupId);
}

/**
 * Clear all archived groups.
 */
function clearArchived() {
  archived.clear();
}

module.exports = {
  archiveGroup,
  restoreArchivedGroup,
  isArchived,
  getAllArchived,
  deleteArchived,
  clearArchived,
};
