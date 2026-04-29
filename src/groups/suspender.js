import { getGroup, getAllGroups, deleteGroup } from './manager.js';

const SUSPENDED_PREFIX = 'chrome-extension://suspended#url=';

export function buildSuspendedUrl(originalUrl, title = '') {
  const params = new URLSearchParams({ url: originalUrl, title });
  return `${SUSPENDED_PREFIX}${params.toString()}`;
}

export function parseSuspendedUrl(suspendedUrl) {
  if (!suspendedUrl.startsWith(SUSPENDED_PREFIX)) return null;
  const query = suspendedUrl.slice(SUSPENDED_PREFIX.length);
  const params = new URLSearchParams(query);
  return { url: params.get('url'), title: params.get('title') };
}

export function isSuspended(url) {
  return typeof url === 'string' && url.startsWith(SUSPENDED_PREFIX);
}

export async function suspendTab(tabId) {
  if (typeof chrome === 'undefined' || !chrome.tabs) return { tabId, suspended: false, reason: 'no-chrome' };
  try {
    const tab = await chrome.tabs.get(tabId);
    if (isSuspended(tab.url)) return { tabId, suspended: false, reason: 'already-suspended' };
    const suspendedUrl = buildSuspendedUrl(tab.url, tab.title);
    await chrome.tabs.update(tabId, { url: suspendedUrl });
    return { tabId, suspended: true };
  } catch (err) {
    return { tabId, suspended: false, reason: err.message };
  }
}

export async function suspendGroup(groupId) {
  const group = getGroup(groupId);
  if (!group) throw new Error(`Group ${groupId} not found`);
  const results = await Promise.all(group.tabIds.map(tabId => suspendTab(tabId)));
  return { groupId, results };
}

export async function suspendAllGroups() {
  const groups = getAllGroups();
  return Promise.all(groups.map(g => suspendGroup(g.id)));
}

export async function restoreTab(tabId) {
  if (typeof chrome === 'undefined' || !chrome.tabs) return { tabId, restored: false };
  try {
    const tab = await chrome.tabs.get(tabId);
    const parsed = parseSuspendedUrl(tab.url);
    if (!parsed) return { tabId, restored: false, reason: 'not-suspended' };
    await chrome.tabs.update(tabId, { url: parsed.url });
    return { tabId, restored: true };
  } catch (err) {
    return { tabId, restored: false, reason: err.message };
  }
}

/**
 * Restores all suspended tabs in a group back to their original URLs.
 * @param {string} groupId - The ID of the group to restore.
 * @returns {Promise<{groupId: string, results: Array}>}
 */
export async function restoreGroup(groupId) {
  const group = getGroup(groupId);
  if (!group) throw new Error(`Group ${groupId} not found`);
  const results = await Promise.all(group.tabIds.map(tabId => restoreTab(tabId)));
  return { groupId, results };
}
