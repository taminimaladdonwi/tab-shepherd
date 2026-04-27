import { getLinks, getAllLinks } from './groupTabLinker.js';

/**
 * Returns a high-level summary of all tab links across groups.
 */
export function getLinkSummary() {
  const all = getAllLinks();
  const byRelation = {};
  let totalLinks = 0;
  const groups = new Set();

  for (const entry of all) {
    totalLinks++;
    const rel = entry.relation || 'unknown';
    byRelation[rel] = (byRelation[rel] || 0) + 1;
    groups.add(entry.sourceGroup);
    groups.add(entry.targetGroup);
  }

  return {
    totalLinks,
    groupCount: groups.size,
    byRelation
  };
}

/**
 * Returns the tab (groupId + tabId) with the highest number of links.
 * Returns null if no links exist.
 */
export function getMostLinkedTab() {
  const all = getAllLinks();
  if (all.length === 0) return null;

  const counts = {};
  for (const entry of all) {
    const srcKey = `${entry.sourceGroup}::${entry.sourceTab}`;
    const tgtKey = `${entry.targetGroup}::${entry.targetTab}`;
    counts[srcKey] = (counts[srcKey] || 0) + 1;
    counts[tgtKey] = (counts[tgtKey] || 0) + 1;
  }

  let topKey = null;
  let topCount = 0;
  for (const [key, count] of Object.entries(counts)) {
    if (count > topCount) {
      topCount = count;
      topKey = key;
    }
  }

  if (!topKey) return null;
  const [groupId, tabIdStr] = topKey.split('::');
  return { groupId, tabId: Number(tabIdStr), linkCount: topCount };
}

/**
 * Returns all tab IDs linked to a specific tab within or across groups.
 */
export function getLinkedTabIds(groupId, tabId) {
  const links = getLinks(groupId, tabId);
  return links.map(link =>
    link.sourceGroup === groupId && link.sourceTab === tabId
      ? link.targetTab
      : link.sourceTab
  );
}

/**
 * Returns all links that connect tabs in different groups.
 */
export function getCrossGroupLinks() {
  return getAllLinks().filter(
    entry => entry.sourceGroup !== entry.targetGroup
  );
}
