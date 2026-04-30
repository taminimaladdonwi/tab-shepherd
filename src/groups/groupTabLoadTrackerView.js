import { getGroupLoadStates, getAllLoadStates } from './groupTabLoadTracker.js';

/**
 * Returns a summary of load states across all groups.
 */
export function getLoadSummary(groups) {
  const summary = {};
  for (const groupId of groups) {
    const states = getGroupLoadStates(groupId);
    const tabIds = Object.keys(states);
    const counts = { loading: 0, complete: 0, error: 0, untracked: 0 };
    for (const tabId of tabIds) {
      const state = states[tabId]?.state ?? 'untracked';
      if (counts[state] !== undefined) counts[state]++;
      else counts.untracked++;
    }
    summary[groupId] = { total: tabIds.length, ...counts };
  }
  return summary;
}

/**
 * Returns groups where all tracked tabs are in 'complete' state.
 */
export function getFullyLoadedGroups(groups) {
  return groups.filter(groupId => {
    const states = getGroupLoadStates(groupId);
    const tabIds = Object.keys(states);
    if (tabIds.length === 0) return false;
    return tabIds.every(tabId => states[tabId]?.state === 'complete');
  });
}

/**
 * Returns groups that have at least one tab in 'error' state.
 */
export function getGroupsWithErrors(groups) {
  return groups.filter(groupId => {
    const states = getGroupLoadStates(groupId);
    return Object.values(states).some(entry => entry?.state === 'error');
  });
}

/**
 * Returns the distribution of load states across all tracked tabs.
 */
export function getLoadStateDistribution(groups) {
  const dist = { loading: 0, complete: 0, error: 0 };
  for (const groupId of groups) {
    const states = getGroupLoadStates(groupId);
    for (const entry of Object.values(states)) {
      if (entry?.state && dist[entry.state] !== undefined) {
        dist[entry.state]++;
      }
    }
  }
  return dist;
}
