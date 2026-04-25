/**
 * groupTabSorter.js
 * Sorts tabs within a group by various fields.
 */

const SUPPORTED_SORT_FIELDS = ['title', 'url', 'domain', 'tabId'];

const sortHistory = new Map();

function extractDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function isSupportedField(field) {
  return SUPPORTED_SORT_FIELDS.includes(field);
}

function sortTabs(tabs, field = 'title', direction = 'asc') {
  if (!isSupportedField(field)) {
    throw new Error(`Unsupported sort field: ${field}`);
  }
  if (!['asc', 'desc'].includes(direction)) {
    throw new Error(`Unsupported sort direction: ${direction}`);
  }

  const sorted = [...tabs].sort((a, b) => {
    let valA, valB;
    if (field === 'domain') {
      valA = extractDomain(a.url || '').toLowerCase();
      valB = extractDomain(b.url || '').toLowerCase();
    } else if (field === 'tabId') {
      valA = a.id ?? a.tabId ?? 0;
      valB = b.id ?? b.tabId ?? 0;
      return direction === 'asc' ? valA - valB : valB - valA;
    } else {
      valA = (a[field] || '').toLowerCase();
      valB = (b[field] || '').toLowerCase();
    }
    if (valA < valB) return direction === 'asc' ? -1 : 1;
    if (valA > valB) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
}

function sortTabsInGroup(groupId, tabs, field = 'title', direction = 'asc') {
  const sorted = sortTabs(tabs, field, direction);
  if (!sortHistory.has(groupId)) sortHistory.set(groupId, []);
  sortHistory.get(groupId).push({ field, direction, timestamp: Date.now(), count: tabs.length });
  return sorted;
}

function getSortHistory(groupId) {
  return sortHistory.get(groupId) || [];
}

function clearSortHistory(groupId) {
  if (groupId !== undefined) {
    sortHistory.delete(groupId);
  } else {
    sortHistory.clear();
  }
}

function getSupportedSortFields() {
  return [...SUPPORTED_SORT_FIELDS];
}

module.exports = {
  sortTabs,
  sortTabsInGroup,
  getSortHistory,
  clearSortHistory,
  getSupportedSortFields,
};
