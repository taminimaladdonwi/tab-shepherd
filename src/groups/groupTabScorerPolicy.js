const { getScore } = require('./groupTabScorer');

const DEFAULT_SUSPENSION_THRESHOLD = 0.25;

function isSuspensionBlockedByScore(groupId, tabId, threshold = DEFAULT_SUSPENSION_THRESHOLD) {
  const score = getScore(groupId, tabId);
  if (score === null) return false; // no score = not protected
  return score >= threshold;
}

function filterSuspendableByScore(groupId, tabs, threshold = DEFAULT_SUSPENSION_THRESHOLD) {
  if (!Array.isArray(tabs)) throw new Error('tabs must be an array');
  return tabs.filter(tab => !isSuspensionBlockedByScore(groupId, tab.id, threshold));
}

function partitionByScore(groupId, tabs, threshold = DEFAULT_SUSPENSION_THRESHOLD) {
  if (!Array.isArray(tabs)) throw new Error('tabs must be an array');
  const suspendable = [];
  const protected_ = [];
  for (const tab of tabs) {
    if (isSuspensionBlockedByScore(groupId, tab.id, threshold)) {
      protected_.push(tab);
    } else {
      suspendable.push(tab);
    }
  }
  return { suspendable, protected: protected_ };
}

module.exports = {
  DEFAULT_SUSPENSION_THRESHOLD,
  isSuspensionBlockedByScore,
  filterSuspendableByScore,
  partitionByScore
};
