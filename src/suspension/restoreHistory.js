/**
 * Tracks a history of restored tabs for undo/audit purposes.
 * Stored in-memory; can be persisted via chrome.storage if needed.
 */

const history = [];
const MAX_HISTORY = 100;

/**
 * Records a restore event.
 * @param {number} tabId
 * @param {string} originalUrl
 * @param {string} [groupId]
 */
export function recordRestore(tabId, originalUrl, groupId = null) {
  history.unshift({
    tabId,
    originalUrl,
    groupId,
    restoredAt: Date.now(),
  });
  if (history.length > MAX_HISTORY) history.splice(MAX_HISTORY);
}

/**
 * Returns the full restore history.
 * @returns {object[]}
 */
export function getRestoreHistory() {
  return [...history];
}

/**
 * Returns the most recent restore entry, or null.
 * @returns {object|null}
 */
export function getLastRestore() {
  return history[0] ?? null;
}

/**
 * Returns restore history filtered by groupId.
 * @param {string} groupId
 * @returns {object[]}
 */
export function getRestoresByGroup(groupId) {
  return history.filter((entry) => entry.groupId === groupId);
}

/**
 * Clears the restore history.
 */
export function clearRestoreHistory() {
  history.splice(0, history.length);
}
