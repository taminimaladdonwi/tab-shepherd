// groupTabBookmarker.js — bookmark individual tabs within groups

const bookmarks = new Map(); // key: `${groupId}:${tabId}` => bookmark metadata

function makeKey(groupId, tabId) {
  return `${groupId}:${tabId}`;
}

function isValidLabel(label) {
  return typeof label === 'string' && label.trim().length > 0;
}

function addBookmark(groupId, tab, label = '') {
  if (!groupId || !tab || !tab.id) throw new Error('groupId and tab with id are required');
  const key = makeKey(groupId, tab.id);
  const entry = {
    groupId,
    tabId: tab.id,
    url: tab.url || '',
    title: tab.title || '',
    label: isValidLabel(label) ? label.trim() : '',
    bookmarkedAt: Date.now()
  };
  bookmarks.set(key, entry);
  return entry;
}

function removeBookmark(groupId, tabId) {
  const key = makeKey(groupId, tabId);
  return bookmarks.delete(key);
}

function isBookmarked(groupId, tabId) {
  return bookmarks.has(makeKey(groupId, tabId));
}

function getBookmark(groupId, tabId) {
  return bookmarks.get(makeKey(groupId, tabId)) || null;
}

function getBookmarksForGroup(groupId) {
  const result = [];
  for (const entry of bookmarks.values()) {
    if (entry.groupId === groupId) result.push(entry);
  }
  return result;
}

function getAllBookmarks() {
  return Array.from(bookmarks.values());
}

function updateLabel(groupId, tabId, label) {
  const key = makeKey(groupId, tabId);
  if (!bookmarks.has(key)) return false;
  if (!isValidLabel(label)) throw new Error('label must be a non-empty string');
  bookmarks.get(key).label = label.trim();
  return true;
}

function clearBookmarks() {
  bookmarks.clear();
}

module.exports = {
  addBookmark,
  removeBookmark,
  isBookmarked,
  getBookmark,
  getBookmarksForGroup,
  getAllBookmarks,
  updateLabel,
  clearBookmarks
};
