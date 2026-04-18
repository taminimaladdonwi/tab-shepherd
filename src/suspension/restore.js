import { parseSuspendedUrl, isSuspended } from '../groups/suspender.js';
import { removeTabFromGroup } from '../groups/manager.js';

/**
 * Restores a suspended tab by navigating it back to its original URL.
 * @param {number} tabId
 * @returns {Promise<boolean>} true if restored, false if not suspended
 */
export async function restoreTab(tabId) {
  const tab = await chrome.tabs.get(tabId);
  if (!isSuspended(tab.url)) return false;

  const { originalUrl } = parseSuspendedUrl(tab.url);
  if (!originalUrl) return false;

  await chrome.tabs.update(tabId, { url: originalUrl });
  return true;
}

/**
 * Restores all suspended tabs in a group.
 * @param {string} groupId
 * @param {object[]} tabs - array of tab objects belonging to the group
 * @returns {Promise<number>} count of restored tabs
 */
export async function restoreGroup(groupId, tabs) {
  let count = 0;
  for (const tab of tabs) {
    if (isSuspended(tab.url)) {
      const restored = await restoreTab(tab.id);
      if (restored) {
        await removeTabFromGroup(groupId, tab.id);
        count++;
      }
    }
  }
  return count;
}

/**
 * Restores all suspended tabs across all windows.
 * @returns {Promise<number>} count of restored tabs
 */
export async function restoreAll() {
  const tabs = await chrome.tabs.query({});
  let count = 0;
  for (const tab of tabs) {
    if (isSuspended(tab.url)) {
      const restored = await restoreTab(tab.id);
      if (restored) count++;
    }
  }
  return count;
}
