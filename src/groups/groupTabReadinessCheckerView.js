/**
 * groupTabReadinessCheckerView.js
 * View helpers for presenting readiness check results.
 */

const {
  checkGroupReadiness,
  getReadinessSummary,
} = require('./groupTabReadinessChecker');

/**
 * Returns a human-readable report of which tabs are not ready and why.
 * @param {string} groupId
 * @param {object[]} tabs
 * @param {object} options
 * @returns {{ tabId: string, title: string, reasons: string[] }[]}
 */
function getNotReadyReport(groupId, tabs, options = {}) {
  const results = checkGroupReadiness(groupId, tabs, options);
  return results
    .filter((r) => !r.ready)
    .map((r) => {
      const tab = tabs.find((t) => t.id === r.tabId);
      return {
        tabId: r.tabId,
        title: tab ? tab.title || tab.url : r.tabId,
        reasons: r.reasons,
      };
    });
}

/**
 * Returns a formatted readiness rate string for a group.
 * @param {string} groupId
 * @param {object[]} tabs
 * @param {object} options
 * @returns {string}
 */
function getReadinessRateLabel(groupId, tabs, options = {}) {
  const summary = getReadinessSummary(groupId, tabs, options);
  const pct = Math.round(summary.readinessRate * 100);
  return `${summary.readyCount}/${summary.total} tabs ready (${pct}%)`;
}

/**
 * Returns groups with a readiness rate below a given threshold.
 * @param {Array<{ groupId: string, tabs: object[] }>} groups
 * @param {number} threshold - 0 to 1
 * @param {object} options
 * @returns {string[]}
 */
function getGroupsBelowReadinessThreshold(groups, threshold = 0.5, options = {}) {
  return groups
    .filter(({ groupId, tabs }) => {
      const summary = getReadinessSummary(groupId, tabs, options);
      return summary.readinessRate < threshold;
    })
    .map(({ groupId }) => groupId);
}

module.exports = {
  getNotReadyReport,
  getReadinessRateLabel,
  getGroupsBelowReadinessThreshold,
};
