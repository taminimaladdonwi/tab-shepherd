import { getGroup, addTabToGroup, removeTabFromGroup } from './manager.js';

const moveHistory = [];

/**
 * Move a single tab from one group to another.
 * Returns the updated target group or throws if either group is missing.
 */
export function moveTab(tabId, fromGroupId, toGroupId) {
  const source = getGroup(fromGroupId);
  if (!source) throw new Error(`Source group not found: ${fromGroupId}`);

  const target = getGroup(toGroupId);
  if (!target) throw new Error(`Target group not found: ${toGroupId}`);

  if (!source.tabs.includes(tabId)) {
    throw new Error(`Tab ${tabId} not found in group ${fromGroupId}`);
  }

  removeTabFromGroup(fromGroupId, tabId);
  addTabToGroup(toGroupId, tabId);

  const record = { tabId, fromGroupId, toGroupId, movedAt: Date.now() };
  moveHistory.push(record);

  return getGroup(toGroupId);
}

/**
 * Move multiple tabs from one group to another.
 * Tabs not present in the source group are skipped.
 */
export function moveTabs(tabIds, fromGroupId, toGroupId) {
  const source = getGroup(fromGroupId);
  if (!source) throw new Error(`Source group not found: ${fromGroupId}`);

  const target = getGroup(toGroupId);
  if (!target) throw new Error(`Target group not found: ${toGroupId}`);

  const moved = [];
  for (const tabId of tabIds) {
    if (source.tabs.includes(tabId)) {
      removeTabFromGroup(fromGroupId, tabId);
      addTabToGroup(toGroupId, tabId);
      moveHistory.push({ tabId, fromGroupId, toGroupId, movedAt: Date.now() });
      moved.push(tabId);
    }
  }

  return { moved, target: getGroup(toGroupId) };
}

/**
 * Retrieve the full move history, optionally filtered by groupId.
 */
export function getMoveHistory(groupId = null) {
  if (!groupId) return [...moveHistory];
  return moveHistory.filter(
    (r) => r.fromGroupId === groupId || r.toGroupId === groupId
  );
}

export function clearMoveHistory() {
  moveHistory.length = 0;
}
