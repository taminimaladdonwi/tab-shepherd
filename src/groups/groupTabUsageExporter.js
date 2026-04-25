import { getAllUsage } from './groupTabUsageTracker.js';

/**
 * Exports all tab usage data as a serialized JSON string.
 * @returns {string}
 */
export function exportUsage() {
  const usage = getAllUsage();
  return JSON.stringify({ version: 1, exportedAt: Date.now(), usage });
}

/**
 * Imports tab usage data from a serialized JSON string.
 * Returns the parsed usage map or throws on invalid input.
 * @param {string} serialized
 * @returns {Object}
 */
export function importUsage(serialized) {
  let parsed;
  try {
    parsed = JSON.parse(serialized);
  } catch {
    throw new Error('Invalid JSON in usage import');
  }

  if (!parsed || typeof parsed.usage !== 'object') {
    throw new Error('Missing usage data in import payload');
  }

  return parsed.usage;
}

/**
 * Serializes usage data for a specific group only.
 * @param {string} groupId
 * @returns {string}
 */
export function exportGroupUsage(groupId) {
  const all = getAllUsage();
  const filtered = Object.fromEntries(
    Object.entries(all).filter(([key]) => key.startsWith(`${groupId}::`)),
  );
  return JSON.stringify({ version: 1, exportedAt: Date.now(), groupId, usage: filtered });
}

/**
 * Validates a usage import payload without applying it.
 * @param {string} serialized
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateUsageImport(serialized) {
  const errors = [];
  try {
    const parsed = JSON.parse(serialized);
    if (!parsed.usage || typeof parsed.usage !== 'object') {
      errors.push('Missing or invalid usage field');
    } else {
      for (const [key, val] of Object.entries(parsed.usage)) {
        if (!key.includes('::')) errors.push(`Invalid key format: ${key}`);
        if (typeof val.count !== 'number') errors.push(`Missing count for key: ${key}`);
      }
    }
  } catch {
    errors.push('JSON parse error');
  }
  return { valid: errors.length === 0, errors };
}
