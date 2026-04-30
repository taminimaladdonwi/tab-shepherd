/**
 * groupTabAccessControllerView.js
 * View helpers for summarizing tab access control data.
 */

const { getGroupPermissions, getTabsWithPermission } = require('./groupTabAccessController');
const { getAllGroups } = require('./manager');

const VALID_PERMISSIONS = ['read', 'write', 'suspend'];

function getAccessSummary(groupId) {
  const entries = getGroupPermissions(groupId);
  const summary = { groupId, totalControlled: entries.length, byPermission: {} };
  for (const perm of VALID_PERMISSIONS) {
    summary.byPermission[perm] = entries.filter(e => e.permissions.includes(perm)).length;
  }
  return summary;
}

function getRestrictedTabs(groupId) {
  const entries = getGroupPermissions(groupId);
  return entries
    .filter(e => !e.permissions.includes('suspend'))
    .map(e => e.tabId);
}

function getPermissionDistribution(groupId) {
  const entries = getGroupPermissions(groupId);
  const dist = {};
  for (const entry of entries) {
    const key = [...entry.permissions].sort().join('+') || 'none';
    dist[key] = (dist[key] || 0) + 1;
  }
  return dist;
}

function getGroupsWithSuspensionRestrictions() {
  const groups = getAllGroups();
  return groups
    .filter(g => getTabsWithPermission(g.id, 'suspend').length < getGroupPermissions(g.id).length)
    .map(g => g.id);
}

module.exports = {
  getAccessSummary,
  getRestrictedTabs,
  getPermissionDistribution,
  getGroupsWithSuspensionRestrictions
};
