import { getAllGroups } from './manager.js';
import { getColor } from './groupColorizer.js';

/**
 * Returns a summary of color assignments for all groups.
 * @returns {Array<{groupId: string, name: string, color: string|null}>}
 */
export function getColorSummary() {
  const groups = getAllGroups();
  return groups.map(group => ({
    groupId: group.id,
    name: group.name,
    color: getColor(group.id) || null
  }));
}

/**
 * Returns a distribution map of color -> count of groups using that color.
 * @returns {Record<string, number>}
 */
export function getColorDistribution() {
  const groups = getAllGroups();
  const distribution = {};

  for (const group of groups) {
    const color = getColor(group.id);
    if (!color) continue;
    distribution[color] = (distribution[color] || 0) + 1;
  }

  return distribution;
}

/**
 * Returns all groups that do not have a color assigned.
 * @returns {Array<{id: string, name: string}>}
 */
export function getUncoloredGroups() {
  const groups = getAllGroups();
  return groups.filter(group => !getColor(group.id));
}
