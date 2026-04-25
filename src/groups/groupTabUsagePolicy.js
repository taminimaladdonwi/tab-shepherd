import { getGroupUsage, getMostUsedTab } from './groupTabUsageTracker.js';

const policies = new Map();

/**
 * Sets a usage-based policy for a group.
 * @param {string} groupId
 * @param {{ minUsageToProtect?: number, maxIdleTabs?: number }} policy
 */
export function setUsagePolicy(groupId, policy) {
  if (typeof groupId !== 'string' || !groupId) throw new Error('Invalid groupId');
  policies.set(groupId, { ...policy });
}

/**
 * Removes a usage policy for a group.
 * @param {string} groupId
 */
export function removeUsagePolicy(groupId) {
  policies.delete(groupId);
}

/**
 * Returns the usage policy for a group, or null.
 * @param {string} groupId
 * @returns {Object|null}
 */
export function getUsagePolicy(groupId) {
  return policies.get(groupId) || null;
}

/**
 * Evaluates which tabs in a group are eligible for suspension based on usage policy.
 * Tabs meeting the minUsageToProtect threshold are protected.
 * @param {string} groupId
 * @param {Array<{id: string|number}>} tabs
 * @returns {{ suspendable: Array, protected: Array }}
 */
export function evaluateTabsByUsagePolicy(groupId, tabs) {
  const policy = policies.get(groupId);
  if (!policy) {
    return { suspendable: [...tabs], protected: [] };
  }

  const { minUsageToProtect = 0 } = policy;
  const usage = getGroupUsage(groupId) || {};
  const suspendable = [];
  const protectedTabs = [];

  for (const tab of tabs) {
    const tabUsage = usage[tab.id];
    const count = tabUsage ? tabUsage.count : 0;
    if (count >= minUsageToProtect && minUsageToProtect > 0) {
      protectedTabs.push(tab);
    } else {
      suspendable.push(tab);
    }
  }

  return { suspendable, protected: protectedTabs };
}

/**
 * Clears all usage policies.
 */
export function clearUsagePolicies() {
  policies.clear();
}

/**
 * Returns all group IDs that have a usage policy.
 * @returns {string[]}
 */
export function getAllPolicyGroupIds() {
  return Array.from(policies.keys());
}
