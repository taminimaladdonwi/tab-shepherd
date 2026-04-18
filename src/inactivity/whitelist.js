/**
 * Checks whether a URL matches any whitelist pattern.
 * Patterns support a single '*' wildcard.
 */

import { getConfig } from './config.js';

/**
 * Convert a simple wildcard pattern to a RegExp.
 * @param {string} pattern
 * @returns {RegExp}
 */
function patternToRegex(pattern) {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  const regexStr = escaped.replace(/\*/g, '.*');
  return new RegExp(`^${regexStr}$`);
}

/**
 * Return true if the URL matches any pattern in the current whitelist.
 * @param {string} url
 * @returns {boolean}
 */
export function isWhitelisted(url) {
  if (!url) return false;
  const { whitelistPatterns } = getConfig();
  return whitelistPatterns.some((pattern) => patternToRegex(pattern).test(url));
}
