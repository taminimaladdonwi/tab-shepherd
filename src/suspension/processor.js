// Processes the suspension queue and performs actual tab suspension

import { getQueue, dequeue } from './queue.js';
import { buildSuspendedUrl, isSuspended } from '../groups/suspender.js';
import { isWhitelisted } from '../inactivity/whitelist.js';

/**
 * Suspend a single tab by redirecting it to the suspended URL
 * @param {{ tabId: number, groupId: string, reason: string }} entry
 * @returns {Promise<boolean>} true if suspended successfully
 */
export async function suspendTab(entry) {
  const { tabId, reason } = entry;
  try {
    const tab = await chrome.tabs.get(tabId);
    if (!tab || !tab.url) return false;
    if (isSuspended(tab.url)) return false;
    if (isWhitelisted(tab.url)) {
      dequeue(tabId);
      return false;
    }
    const suspendedUrl = buildSuspendedUrl(tab.url, tab.title || '', reason);
    await chrome.tabs.update(tabId, { url: suspendedUrl });
    dequeue(tabId);
    return true;
  } catch {
    dequeue(tabId);
    return false;
  }
}

/**
 * Process all entries currently in the suspension queue
 * @returns {Promise<number>} count of successfully suspended tabs
 */
export async function processQueue() {
  const entries = getQueue();
  let count = 0;
  for (const entry of entries) {
    const ok = await suspendTab(entry);
    if (ok) count++;
  }
  return count;
}
