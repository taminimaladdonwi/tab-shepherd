import { getAllGroups, getGroup } from './manager.js';
import { getTags } from './tagger.js';

/**
 * Exports a single group by id as a plain object.
 */
export function exportGroup(groupId) {
  const group = getGroup(groupId);
  if (!group) throw new Error(`Group not found: ${groupId}`);
  const tags = getTags(groupId);
  return {
    id: group.id,
    name: group.name,
    tabs: group.tabs ? [...group.tabs] : [],
    tags: tags ? [...tags] : [],
    exportedAt: Date.now(),
  };
}

/**
 * Exports all groups as an array of plain objects.
 */
export function exportAllGroups() {
  const groups = getAllGroups();
  return groups.map((g) => exportGroup(g.id));
}

/**
 * Serializes exported groups to a JSON string.
 */
export function serializeExport(data) {
  return JSON.stringify({ version: 1, groups: data }, null, 2);
}

/**
 * Parses a JSON string previously created by serializeExport.
 * Returns { version, groups } or throws on invalid input.
 */
export function deserializeExport(jsonString) {
  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    throw new Error('Invalid JSON export data');
  }
  if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.groups)) {
    throw new Error('Unrecognized export format');
  }
  return parsed;
}
