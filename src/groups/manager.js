import { getIdleTabs } from '../inactivity/tracker.js';
import { isWhitelisted } from '../inactivity/whitelist.js';
import { getConfig } from '../inactivity/config.js';

const groups = new Map();

export function createGroup(name, tabIds = []) {
  const id = `group-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  groups.set(id, { id, name, tabIds: [...tabIds], createdAt: Date.now() });
  return groups.get(id);
}

export function getGroup(id) {
  return groups.get(id) || null;
}

export function getAllGroups() {
  return Array.from(groups.values());
}

export function addTabToGroup(groupId, tabId) {
  const group = groups.get(groupId);
  if (!group) throw new Error(`Group ${groupId} not found`);
  if (!group.tabIds.includes(tabId)) {
    group.tabIds.push(tabId);
  }
  return group;
}

export function removeTabFromGroup(groupId, tabId) {
  const group = groups.get(groupId);
  if (!group) return;
  group.tabIds = group.tabIds.filter(id => id !== tabId);
  if (group.tabIds.length === 0) {
    groups.delete(groupId);
  }
}

export function deleteGroup(id) {
  return groups.delete(id);
}

export async function groupIdleTabs() {
  const config = getConfig();
  const idleTabs = getIdleTabs(config.inactivityThreshold);

  const eligible = idleTabs.filter(({ tabId }) => {
    const tab = { url: '' };
    return !isWhitelisted(tab.url);
  });

  if (eligible.length === 0) return null;

  const tabIds = eligible.map(({ tabId }) => tabId);
  return createGroup(`Idle Tabs ${new Date().toLocaleTimeString()}`, tabIds);
}

export function clearAllGroups() {
  groups.clear();
}
