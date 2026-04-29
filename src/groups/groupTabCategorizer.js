const categories = new Map();

const VALID_CATEGORIES = ['work', 'personal', 'research', 'media', 'social', 'shopping', 'other'];

function makeKey(groupId, tabId) {
  return `${groupId}::${tabId}`;
}

function isValidCategory(category) {
  return VALID_CATEGORIES.includes(category);
}

function setCategory(groupId, tabId, category) {
  if (!isValidCategory(category)) {
    throw new Error(`Invalid category: ${category}. Must be one of: ${VALID_CATEGORIES.join(', ')}`);
  }
  const key = makeKey(groupId, tabId);
  const prev = categories.get(key);
  categories.set(key, { category, assignedAt: Date.now(), previousCategory: prev?.category || null });
}

function getCategory(groupId, tabId) {
  return categories.get(makeKey(groupId, tabId)) || null;
}

function removeCategory(groupId, tabId) {
  return categories.delete(makeKey(groupId, tabId));
}

function getCategoriesForGroup(groupId) {
  const result = {};
  for (const [key, value] of categories.entries()) {
    if (key.startsWith(`${groupId}::`)) {
      const tabId = key.split('::')[1];
      result[tabId] = value;
    }
  }
  return result;
}

function getTabsByCategory(groupId, category) {
  const result = [];
  for (const [key, value] of categories.entries()) {
    if (key.startsWith(`${groupId}::`) && value.category === category) {
      result.push(key.split('::')[1]);
    }
  }
  return result;
}

function getCategoryDistribution(groupId) {
  const dist = {};
  for (const cat of VALID_CATEGORIES) dist[cat] = 0;
  for (const [key, value] of categories.entries()) {
    if (key.startsWith(`${groupId}::`)) {
      dist[value.category] = (dist[value.category] || 0) + 1;
    }
  }
  return dist;
}

function clearCategories() {
  categories.clear();
}

module.exports = {
  isValidCategory,
  setCategory,
  getCategory,
  removeCategory,
  getCategoriesForGroup,
  getTabsByCategory,
  getCategoryDistribution,
  clearCategories,
  VALID_CATEGORIES
};
