/**
 * groupLimiter.js
 * Enforces tab count limits on groups, preventing groups from exceeding
 * a configured maximum number of tabs.
 */

const limits = new Map();
const violations = [];

/**
 * Set a tab count limit for a group.
 * @param {string} groupId
 * @param {number} maxTabs
 */
function setLimit(groupId, maxTabs) {
  if (typeof maxTabs !== 'number' || maxTabs < 1) {
    throw new Error('maxTabs must be a positive number');
  }
  limits.set(groupId, maxTabs);
}

/**
 * Remove the limit for a group.
 * @param {string} groupId
 */
function removeLimit(groupId) {
  limits.delete(groupId);
}

/**
 * Get the limit for a group, or null if none is set.
 * @param {string} groupId
 * @returns {number|null}
 */
function getLimit(groupId) {
  return limits.has(groupId) ? limits.get(groupId) : null;
}

/**
 * Check whether adding a tab to a group would exceed its limit.
 * @param {string} groupId
 * @param {number} currentTabCount
 * @returns {{ allowed: boolean, limit: number|null, current: number }}
 */
function checkLimit(groupId, currentTabCount) {
  const limit = getLimit(groupId);
  if (limit === null) {
    return { allowed: true, limit: null, current: currentTabCount };
  }
  const allowed = currentTabCount < limit;
  if (!allowed) {
    violations.push({ groupId, limit, current: currentTabCount, timestamp: Date.now() });
  }
  return { allowed, limit, current: currentTabCount };
}

/**
 * Get all recorded limit violations.
 * @returns {Array}
 */
function getViolations() {
  return [...violations];
}

/**
 * Get all groups that have a limit set.
 * @returns {Array<{ groupId: string, limit: number }>}
 */
function getAllLimits() {
  return Array.from(limits.entries()).map(([groupId, limit]) => ({ groupId, limit }));
}

/**
 * Clear all limits and violations (used in tests).
 */
function clearAll() {
  limits.clear();
  violations.length = 0;
}

module.exports = {
  setLimit,
  removeLimit,
  getLimit,
  checkLimit,
  getViolations,
  getAllLimits,
  clearAll
};
