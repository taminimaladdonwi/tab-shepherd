// Scores tabs within a group based on configurable criteria (recency, priority, usage, etc.)
// Higher score = more valuable/important tab

const scores = new Map();
const scoreHistory = [];

const SCORE_WEIGHTS = {
  usageCount: 0.4,
  priority: 0.3,
  recency: 0.2,
  bookmarked: 0.1
};

function makeKey(groupId, tabId) {
  return `${groupId}::${tabId}`;
}

function isValidScore(score) {
  return typeof score === 'number' && isFinite(score) && score >= 0;
}

function setScore(groupId, tabId, score) {
  if (!groupId || !tabId) throw new Error('groupId and tabId are required');
  if (!isValidScore(score)) throw new Error('Score must be a non-negative finite number');
  const key = makeKey(groupId, tabId);
  const previous = scores.get(key) ?? null;
  scores.set(key, score);
  scoreHistory.push({ groupId, tabId, score, previous, timestamp: Date.now() });
}

function getScore(groupId, tabId) {
  const key = makeKey(groupId, tabId);
  return scores.get(key) ?? null;
}

function removeScore(groupId, tabId) {
  const key = makeKey(groupId, tabId);
  return scores.delete(key);
}

function computeScore({ usageCount = 0, priority = 0, recencyMs = Infinity, bookmarked = false } = {}) {
  const recencyScore = recencyMs === Infinity ? 0 : Math.max(0, 1 - recencyMs / (1000 * 60 * 60 * 24));
  const priorityNorm = Math.min(Math.max(priority, 0), 10) / 10;
  const usageNorm = Math.min(usageCount, 100) / 100;
  const bookmarkScore = bookmarked ? 1 : 0;
  return (
    usageNorm * SCORE_WEIGHTS.usageCount +
    priorityNorm * SCORE_WEIGHTS.priority +
    recencyScore * SCORE_WEIGHTS.recency +
    bookmarkScore * SCORE_WEIGHTS.bookmarked
  );
}

function scoreTabsInGroup(groupId, tabs) {
  if (!Array.isArray(tabs)) throw new Error('tabs must be an array');
  return tabs.map(tab => {
    const score = computeScore(tab.scoreInputs || {});
    setScore(groupId, tab.id, score);
    return { tabId: tab.id, score };
  });
}

function getGroupScores(groupId) {
  const result = {};
  for (const [key, score] of scores.entries()) {
    const [gId, tabId] = key.split('::');
    if (gId === groupId) result[tabId] = score;
  }
  return result;
}

function getScoreHistory() {
  return [...scoreHistory];
}

function clearScores() {
  scores.clear();
  scoreHistory.length = 0;
}

module.exports = {
  isValidScore,
  setScore,
  getScore,
  removeScore,
  computeScore,
  scoreTabsInGroup,
  getGroupScores,
  getScoreHistory,
  clearScores
};
