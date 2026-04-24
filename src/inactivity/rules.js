// Inactivity rules: define and evaluate suspension rules per tab/group

const rules = [];

/**
 * Add a rule: { id, matchPattern, inactiveThresholdMs, groupId }
 */
function addRule(rule) {
  if (!rule.id || !rule.matchPattern || !rule.inactiveThresholdMs) {
    throw new Error('Rule must have id, matchPattern, and inactiveThresholdMs');
  }
  if (typeof rule.inactiveThresholdMs !== 'number' || rule.inactiveThresholdMs <= 0) {
    throw new Error('inactiveThresholdMs must be a positive number');
  }
  try {
    new RegExp(rule.matchPattern);
  } catch (e) {
    throw new Error(`Invalid matchPattern: ${e.message}`);
  }
  const existing = rules.findIndex(r => r.id === rule.id);
  if (existing !== -1) {
    rules[existing] = rule;
  } else {
    rules.push(rule);
  }
}

function removeRule(id) {
  const idx = rules.findIndex(r => r.id === id);
  if (idx !== -1) rules.splice(idx, 1);
}

function getRules() {
  return [...rules];
}

function getRuleById(id) {
  return rules.find(r => r.id === id) || null;
}

/**
 * Find the first matching rule for a given URL.
 */
function matchRule(url) {
  for (const rule of rules) {
    try {
      const regex = new RegExp(rule.matchPattern);
      if (regex.test(url)) return rule;
    } catch (e) {
      // invalid pattern, skip
    }
  }
  return null;
}

/**
 * Evaluate whether a tab should be suspended based on rules.
 * @param {string} url
 * @param {number} inactiveDurationMs
 * @returns {{ shouldSuspend: boolean, rule: object|null }}
 */
function evaluateRule(url, inactiveDurationMs) {
  const rule = matchRule(url);
  if (!rule) return { shouldSuspend: false, rule: null };
  return {
    shouldSuspend: inactiveDurationMs >= rule.inactiveThresholdMs,
    rule
  };
}

function clearRules() {
  rules.length = 0;
}

module.exports = { addRule, removeRule, getRules, getRuleById, matchRule, evaluateRule, clearRules };
