// Determines which idle tabs should be suspended based on config and group rules

import { getIdleTabs } from '../inactivity/tracker.js';
import { getConfig } from '../inactivity/config.js';
import { isWhitelisted } from '../inactivity/whitelist.js';
import { getGroup } from '../groups/manager.js';
import { enqueue, isQueued } from './queue.js';

/**
 * Check if a group has suspension disabled
 * @param {string|null} groupId
 * @returns {boolean}
 */
function isGroupSuspensionDisabled(groupId) {
  if (!groupId) return false;
  const group = getGroup(groupId);
  return !!(group && group.suspensionDisabled);
}

/**
 * Evaluate all idle tabs and enqueue those that meet suspension criteria
 * @returns {number} number of tabs newly enqueued
 */
export function evaluateAndEnqueue() {
  const config = getConfig();
  const idleTabs = getIdleTabs(config.inactivityThresholdMs);
  let enqueued = 0;

  for (const { tabId, groupId } of idleTabs) {
    if (isQueued(tabId)) continue;
    if (isGroupSuspensionDisabled(groupId)) continue;

    // URL-level whitelist check happens in processor, but do a quick group check here
    enqueue(tabId, groupId || null, 'inactivity');
    enqueued++;
  }

  return enqueued;
}

/**
 * Determine if a specific tab should be suspended immediately
 * @param {number} tabId
 * @param {string} url
 * @param {string|null} groupId
 * @returns {boolean}
 */
export function shouldSuspend(tabId, url, groupId) {
  if (isWhitelisted(url)) return false;
  if (isQueued(tabId)) return false;
  if (isGroupSuspensionDisabled(groupId)) return false;
  return true;
}
