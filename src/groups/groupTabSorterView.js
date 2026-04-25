/**
 * groupTabSorterView.js
 * View helpers for tab sort results and history.
 */

const { getSortHistory } = require('./groupTabSorter');

function getLastSortInfo(groupId) {
  const history = getSortHistory(groupId);
  if (!history.length) return null;
  return history[history.length - 1];
}

function getSortSummary(groupId) {
  const history = getSortHistory(groupId);
  if (!history.length) {
    return { groupId, totalSorts: 0, lastSort: null, mostUsedField: null };
  }

  const fieldCounts = {};
  for (const entry of history) {
    fieldCounts[entry.field] = (fieldCounts[entry.field] || 0) + 1;
  }

  const mostUsedField = Object.entries(fieldCounts).sort((a, b) => b[1] - a[1])[0][0];

  return {
    groupId,
    totalSorts: history.length,
    lastSort: history[history.length - 1],
    mostUsedField,
  };
}

function getTabTitlesInOrder(sortedTabs) {
  return sortedTabs.map((tab) => tab.title || '(untitled)');
}

module.exports = {
  getLastSortInfo,
  getSortSummary,
  getTabTitlesInOrder,
};
