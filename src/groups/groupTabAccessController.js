/**
 * groupTabAccessController.js
 * Controls per-tab access permissions within groups.
 * Supports read/write/suspend access levels.
 */

const VALID_PERMISSIONS = ['read', 'write', 'suspend'];

const accessMap = new Map();

function makeKey(groupId, tabId) {
  return `${groupId}::${tabId}`;
}

function isValidPermission(permission) {
  return VALID_PERMISSIONS.includes(permission);
}

function setPermissions(groupId, tabId, permissions) {
  if (!groupId || !tabId) throw new Error('groupId and tabId are required');
  if (!Array.isArray(permissions)) throw new Error('permissions must be an array');
  const invalid = permissions.filter(p => !isValidPermission(p));
  if (invalid.length > 0) throw new Error(`Invalid permissions: ${invalid.join(', ')}`);
  accessMap.set(makeKey(groupId, tabId), { groupId, tabId, permissions: [...new Set(permissions)], updatedAt: Date.now() });
}

function getPermissions(groupId, tabId) {
  return accessMap.get(makeKey(groupId, tabId)) || null;
}

function hasPermission(groupId, tabId, permission) {
  const entry = getPermissions(groupId, tabId);
  if (!entry) return false;
  return entry.permissions.includes(permission);
}

function removePermissions(groupId, tabId) {
  return accessMap.delete(makeKey(groupId, tabId));
}

function getGroupPermissions(groupId) {
  const results = [];
  for (const [, value] of accessMap) {
    if (value.groupId === groupId) results.push(value);
  }
  return results;
}

function getTabsWithPermission(groupId, permission) {
  return getGroupPermissions(groupId)
    .filter(entry => entry.permissions.includes(permission))
    .map(entry => entry.tabId);
}

function clearAll() {
  accessMap.clear();
}

module.exports = {
  isValidPermission,
  setPermissions,
  getPermissions,
  hasPermission,
  removePermissions,
  getGroupPermissions,
  getTabsWithPermission,
  clearAll
};
