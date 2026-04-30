/**
 * groupTabAccessControllerPolicy.js
 * Policy integration: filters tabs eligible for suspension based on access control.
 */

const { hasPermission, getGroupPermissions } = require('./groupTabAccessController');

/**
 * Returns true if a tab is blocked from suspension by access control.
 */
function isSuspensionBlocked(groupId, tabId) {
  const perms = getGroupPermissions(groupId).find(e => e.tabId === tabId);
  if (!perms) return false; // no restriction set — allow suspension
  return !perms.permissions.includes('suspend');
}

/**
 * Filters a list of tabs, returning only those allowed to be suspended.
 * @param {string} groupId
 * @param {Array<{id: string}>} tabs
 */
function filterSuspendableTabs(groupId, tabs) {
  return tabs.filter(tab => !isSuspensionBlocked(groupId, tab.id));
}

/**
 * Partitions tabs into suspendable and blocked arrays.
 * @param {string} groupId
 * @param {Array<{id: string}>} tabs
 */
function partitionByAccess(groupId, tabs) {
  const suspendable = [];
  const blocked = [];
  for (const tab of tabs) {
    if (isSuspensionBlocked(groupId, tab.id)) {
      blocked.push(tab);
    } else {
      suspendable.push(tab);
    }
  }
  return { suspendable, blocked };
}

module.exports = {
  isSuspensionBlocked,
  filterSuspendableTabs,
  partitionByAccess
};
