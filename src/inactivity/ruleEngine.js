// ruleEngine.js — ties together tracker, whitelist, and rules to decide suspension
const { getInactiveDuration, getIdleTabs } = require('./tracker');
const { isWhitelisted } = require('./whitelist');
const { evaluateRule } = require('./rules');

/**
 * Evaluate a single tab for suspension eligibility.
 * @param {{ id: number, url: string }} tab
 * @returns {{ tabId: number, url: string, shouldSuspend: boolean, reason: string, rule: object|null }}
 */
function evaluateTab(tab) {
  if (isWhitelisted(tab.url)) {
    return { tabId: tab.id, url: tab.url, shouldSuspend: false, reason: 'whitelisted', rule: null };
  }

  const inactiveDurationMs = getInactiveDuration(tab.id);
  if (inactiveDurationMs === null) {
    return { tabId: tab.id, url: tab.url, shouldSuspend: false, reason: 'no_activity_record', rule: null };
  }

  const { shouldSuspend, rule } = evaluateRule(tab.url, inactiveDurationMs);
  return {
    tabId: tab.id,
    url: tab.url,
    shouldSuspend,
    reason: shouldSuspend ? 'rule_matched' : (rule ? 'threshold_not_reached' : 'no_rule'),
    rule
  };
}

/**
 * Evaluate all idle tabs and return those eligible for suspension.
 * @param {Array<{ id: number, url: string }>} tabs — all open tabs
 * @returns {Array} eligible tabs
 */
function getTabsEligibleForSuspension(tabs) {
  return tabs
    .map(tab => evaluateTab(tab))
    .filter(result => result.shouldSuspend);
}

module.exports = { evaluateTab, getTabsEligibleForSuspension };
