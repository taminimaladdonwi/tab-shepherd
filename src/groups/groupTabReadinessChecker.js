/**
 * groupTabReadinessChecker.js
 * Evaluates whether tabs in a group are "ready" based on configurable criteria
 * such as load state, suspension status, and priority thresholds.
 */

const { isSuspended } = require('./suspender');
const { getPriority } = require('./groupTabPrioritizer');
const { getStatus } = require('./groupTabStatusTracker');

const DEFAULT_OPTIONS = {
  requireLoaded: true,
  excludeSuspended: true,
  minPriority: null,
  allowedStatuses: null,
};

/**
 * Check if a single tab meets readiness criteria.
 * @param {string} groupId
 * @param {object} tab - Tab object with at least { id, url, status }
 * @param {object} options
 * @returns {{ ready: boolean, reasons: string[] }}
 */
function checkTabReadiness(groupId, tab, options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const reasons = [];

  if (opts.excludeSuspended && isSuspended(tab.url)) {
    reasons.push('tab is suspended');
  }

  if (opts.requireLoaded && tab.status !== 'complete') {
    reasons.push(`tab status is '${tab.status}', expected 'complete'`);
  }

  if (opts.minPriority !== null) {
    const priority = getPriority(groupId, tab.id);
    if (priority === null || priority < opts.minPriority) {
      reasons.push(`priority ${priority} is below minimum ${opts.minPriority}`);
    }
  }

  if (opts.allowedStatuses !== null) {
    const tracked = getStatus(groupId, tab.id);
    if (!opts.allowedStatuses.includes(tracked)) {
      reasons.push(`tracked status '${tracked}' not in allowed list`);
    }
  }

  return { ready: reasons.length === 0, reasons };
}

/**
 * Evaluate readiness for all tabs in a group.
 * @param {string} groupId
 * @param {object[]} tabs
 * @param {object} options
 * @returns {{ tabId: string, ready: boolean, reasons: string[] }[]}
 */
function checkGroupReadiness(groupId, tabs, options = {}) {
  return tabs.map((tab) => ({
    tabId: tab.id,
    ...checkTabReadiness(groupId, tab, options),
  }));
}

/**
 * Returns only the tabs that pass readiness checks.
 * @param {string} groupId
 * @param {object[]} tabs
 * @param {object} options
 * @returns {object[]}
 */
function getReadyTabs(groupId, tabs, options = {}) {
  return tabs.filter((tab) => checkTabReadiness(groupId, tab, options).ready);
}

/**
 * Returns a summary of readiness across a group.
 * @param {string} groupId
 * @param {object[]} tabs
 * @param {object} options
 * @returns {{ total: number, readyCount: number, notReadyCount: number, readinessRate: number }}
 */
function getReadinessSummary(groupId, tabs, options = {}) {
  const results = checkGroupReadiness(groupId, tabs, options);
  const readyCount = results.filter((r) => r.ready).length;
  return {
    total: tabs.length,
    readyCount,
    notReadyCount: tabs.length - readyCount,
    readinessRate: tabs.length === 0 ? 0 : readyCount / tabs.length,
  };
}

module.exports = {
  checkTabReadiness,
  checkGroupReadiness,
  getReadyTabs,
  getReadinessSummary,
};
