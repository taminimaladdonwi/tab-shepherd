/**
 * groupTabPrioritizerPolicy.js
 * Suspension policy integration: skip or defer high-priority tabs.
 */

const { getPriority } = require('./groupTabPrioritizer');

const SUSPENSION_BLOCKED = ['critical', 'high'];

function isSuspensionBlocked(groupId, tabId) {
  const entry = getPriority(groupId, tabId);
  if (!entry) return false;
  return SUSPENSION_BLOCKED.includes(entry.priority);
}

function filterSuspendableTabs(groupId, tabs) {
  return tabs.filter(tab => !isSuspensionBlocked(groupId, tab.id));
}

function partitionByPriority(groupId, tabs) {
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
  partitionByPriority
};
