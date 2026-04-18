// Manages a queue of tabs pending suspension

const suspensionQueue = new Map(); // tabId -> { tabId, groupId, scheduledAt, reason }

/**
 * Add a tab to the suspension queue
 * @param {number} tabId
 * @param {string} groupId
 * @param {string} reason
 */
export function enqueue(tabId, groupId, reason = 'inactivity') {
  if (suspensionQueue.has(tabId)) return;
  suspensionQueue.set(tabId, {
    tabId,
    groupId,
    scheduledAt: Date.now(),
    reason,
  });
}

/**
 * Remove a tab from the suspension queue (e.g. it became active)
 * @param {number} tabId
 */
export function dequeue(tabId) {
  suspensionQueue.delete(tabId);
}

/**
 * Get all queued entries
 * @returns {Array}
 */
export function getQueue() {
  return Array.from(suspensionQueue.values());
}

/**
 * Check if a tab is currently queued
 * @param {number} tabId
 * @returns {boolean}
 */
export function isQueued(tabId) {
  return suspensionQueue.has(tabId);
}

/**
 * Clear the entire queue
 */
export function clearQueue() {
  suspensionQueue.clear();
}
