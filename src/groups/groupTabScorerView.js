const { getGroupScores } = require('./groupTabScorer');
const { getAllGroups } = require('./manager');

function getScoreSummary(groupId) {
  const scores = getGroupScores(groupId);
  const entries = Object.entries(scores);
  if (entries.length === 0) return { groupId, count: 0, average: null, highest: null, lowest: null };
  const values = entries.map(([, v]) => v);
  const average = values.reduce((a, b) => a + b, 0) / values.length;
  const highest = entries.reduce((a, b) => (b[1] > a[1] ? b : a));
  const lowest = entries.reduce((a, b) => (b[1] < a[1] ? b : a));
  return {
    groupId,
    count: entries.length,
    average: Math.round(average * 1000) / 1000,
    highest: { tabId: highest[0], score: highest[1] },
    lowest: { tabId: lowest[0], score: lowest[1] }
  };
}

function getTopScoredTabs(groupId, limit = 5) {
  const scores = getGroupScores(groupId);
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tabId, score]) => ({ tabId, score }));
}

function getLowScoredTabs(groupId, threshold = 0.2) {
  const scores = getGroupScores(groupId);
  return Object.entries(scores)
    .filter(([, score]) => score < threshold)
    .map(([tabId, score]) => ({ tabId, score }))
    .sort((a, b) => a.score - b.score);
}

function getUnscoredGroups() {
  const groups = getAllGroups();
  return groups
    .filter(g => Object.keys(getGroupScores(g.id)).length === 0)
    .map(g => g.id);
}

module.exports = {
  getScoreSummary,
  getTopScoredTabs,
  getLowScoredTabs,
  getUnscoredGroups
};
