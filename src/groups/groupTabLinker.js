/**
 * groupTabLinker.js
 * Links tabs across groups, tracking relationships between related tabs.
 */

const links = new Map();

function makeKey(groupId, tabId) {
  return `${groupId}::${tabId}`;
}

function isValidRelation(relation) {
  const valid = ['related', 'duplicate', 'parent', 'child', 'reference'];
  return valid.includes(relation);
}

function linkTabs(fromGroupId, fromTabId, toGroupId, toTabId, relation = 'related') {
  if (!isValidRelation(relation)) {
    throw new Error(`Invalid relation type: ${relation}`);
  }
  const key = makeKey(fromGroupId, fromTabId);
  if (!links.has(key)) {
    links.set(key, []);
  }
  const existing = links.get(key);
  const alreadyLinked = existing.some(
    l => l.toGroupId === toGroupId && l.toTabId === toTabId && l.relation === relation
  );
  if (!alreadyLinked) {
    existing.push({ toGroupId, toTabId, relation, linkedAt: Date.now() });
  }
}

function unlinkTabs(fromGroupId, fromTabId, toGroupId, toTabId) {
  const key = makeKey(fromGroupId, fromTabId);
  if (!links.has(key)) return;
  const filtered = links.get(key).filter(
    l => !(l.toGroupId === toGroupId && l.toTabId === toTabId)
  );
  if (filtered.length === 0) {
    links.delete(key);
  } else {
    links.set(key, filtered);
  }
}

function getLinks(groupId, tabId) {
  return links.get(makeKey(groupId, tabId)) || [];
}

function getLinksByRelation(groupId, tabId, relation) {
  return getLinks(groupId, tabId).filter(l => l.relation === relation);
}

function getAllLinks() {
  const result = [];
  for (const [key, entries] of links.entries()) {
    const [fromGroupId, fromTabId] = key.split('::');
    for (const entry of entries) {
      result.push({ fromGroupId, fromTabId, ...entry });
    }
  }
  return result;
}

function clearLinks() {
  links.clear();
}

function getSupportedRelations() {
  return ['related', 'duplicate', 'parent', 'child', 'reference'];
}

module.exports = {
  isValidRelation,
  linkTabs,
  unlinkTabs,
  getLinks,
  getLinksByRelation,
  getAllLinks,
  clearLinks,
  getSupportedRelations
};
