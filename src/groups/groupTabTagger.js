// groupTabTagger.js — Manage per-tab tags within groups

const tabTags = new Map(); // key: `${groupId}::${tabId}` => Set<string>

function makeKey(groupId, tabId) {
  return `${groupId}::${tabId}`;
}

function isValidTag(tag) {
  return typeof tag === 'string' && tag.trim().length > 0 && tag.length <= 64;
}

function setTabTags(groupId, tabId, tags) {
  if (!Array.isArray(tags)) throw new Error('tags must be an array');
  const valid = tags.filter(isValidTag).map(t => t.trim());
  tabTags.set(makeKey(groupId, tabId), new Set(valid));
  return [...valid];
}

function addTabTag(groupId, tabId, tag) {
  if (!isValidTag(tag)) throw new Error(`Invalid tag: ${tag}`);
  const key = makeKey(groupId, tabId);
  if (!tabTags.has(key)) tabTags.set(key, new Set());
  tabTags.get(key).add(tag.trim());
}

function removeTabTag(groupId, tabId, tag) {
  const key = makeKey(groupId, tabId);
  if (!tabTags.has(key)) return false;
  return tabTags.get(key).delete(tag.trim());
}

function getTabTags(groupId, tabId) {
  const key = makeKey(groupId, tabId);
  return tabTags.has(key) ? [...tabTags.get(key)] : [];
}

function hasTabTag(groupId, tabId, tag) {
  const key = makeKey(groupId, tabId);
  return tabTags.has(key) && tabTags.get(key).has(tag.trim());
}

function getTabsByTag(groupId, tabs, tag) {
  return tabs.filter(tab => hasTabTag(groupId, tab.id, tag));
}

function getAllTabTagsInGroup(groupId, tabs) {
  const result = {};
  for (const tab of tabs) {
    const tags = getTabTags(groupId, tab.id);
    if (tags.length > 0) result[tab.id] = tags;
  }
  return result;
}

function clearTabTags(groupId, tabId) {
  tabTags.delete(makeKey(groupId, tabId));
}

function clearAll() {
  tabTags.clear();
}

module.exports = {
  isValidTag,
  setTabTags,
  addTabTag,
  removeTabTag,
  getTabTags,
  hasTabTag,
  getTabsByTag,
  getAllTabTagsInGroup,
  clearTabTags,
  clearAll
};
