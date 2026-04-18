/**
 * Wires browser events to the activity tracker and runs the idle-check loop.
 */

import { recordActivity, removeTab, getIdleTabs } from './tracker.js';
import { loadConfig, getConfig } from './config.js';
import { isWhitelisted } from './whitelist.js';

let checkIntervalId = null;

/** Initialise event listeners and start the periodic check loop. */
export async function startMonitor() {
  await loadConfig();

  // Record activity on navigation and tab activation
  chrome.tabs.onActivated.addListener(({ tabId }) => recordActivity(tabId));
  chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === 'complete') recordActivity(tabId);
  });
  chrome.tabs.onRemoved.addListener((tabId) => removeTab(tabId));

  // Seed existing tabs
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => recordActivity(tab.id));
  });

  scheduleCheck();
}

/** Stop the periodic check loop. */
export function stopMonitor() {
  if (checkIntervalId !== null) {
    clearInterval(checkIntervalId);
    checkIntervalId = null;
  }
}

function scheduleCheck() {
  const { checkIntervalMs } = getConfig();
  checkIntervalId = setInterval(runIdleCheck, checkIntervalMs);
}

async function runIdleCheck() {
  const { inactivityThresholdMs, autoSuspend } = getConfig();
  if (!autoSuspend) return;

  const idleTabIds = getIdleTabs(inactivityThresholdMs);
  for (const tabId of idleTabIds) {
    const tab = await chrome.tabs.get(tabId).catch(() => null);
    if (!tab || tab.active) continue;
    if (isWhitelisted(tab.url)) continue;
    chrome.tabs.discard(tabId);
  }
}
