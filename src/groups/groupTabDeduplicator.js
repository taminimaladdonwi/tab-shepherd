import { findDuplicateTabs } from './groupDuplicateFinder.js';
import { moveTab } from './groupTabMover.js';
import { getGroup, getAllGroups } from './manager.js';

const deduplicationLog = new Map();

/**
 * Removes duplicate tabs within a single group, keeping the first occurrence.
 * Returns an array of removed tab ids.
 */
export function deduplicateGroup(groupId) {
  const group = getGroup(groupId);
  if (!group) throw new Error(`Group not found: ${groupId}`);

  const duplicates = findDuplicateTabs(group.tabs || []);
  const removedTabs = [];

  for (const { url, tabs } of duplicates) {
    // Keep the first tab, mark the rest as duplicates
    const [, ...extras] = tabs;
    for (const tab of extras) {
      removedTabs.push({ tabId: tab.id, url, groupId });
    }
  }

  if (removedTabs.length > 0) {
    const entry = {
      groupId,
      removedCount: removedTabs.length,
      removedTabs,
      timestamp: Date.now()
    };
    const history = deduplicationLog.get(groupId) || [];
    history.push(entry);
    deduplicationLog.set(groupId, history);
  }

  return removedTabs;
}

/**
 * Deduplicates all groups and returns a summary map of groupId -> removed tabs.
 */
export function deduplicateAllGroups() {
  const groups = getAllGroups();
  const summary = {};

  for (const group of groups) {
    const removed = deduplicateGroup(group.id);
    if (removed.length > 0) {
      summary[group.id] = removed;
    }
  }

  return summary;
}

/**
 * Returns the deduplication history for a group.
 */
export function getDeduplicationHistory(groupId) {
  return deduplicationLog.get(groupId) || [];
}

/**
 * Returns the total number of tabs removed across all deduplication runs.
 */
export function getTotalRemovedCount() {
  let total = 0;
  for (const history of deduplicationLog.values()) {
    for (const entry of history) {
      total += entry.removedCount;
    }
  }
  return total;
}

/**
 * Clears deduplication history.
 */
export function clearDeduplicationHistory() {
  deduplicationLog.clear();
}
