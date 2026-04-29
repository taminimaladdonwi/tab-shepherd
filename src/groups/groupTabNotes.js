// groupTabNotes.js — Per-tab notes within a group

const notes = new Map();

function makeKey(groupId, tabId) {
  return `${groupId}::${tabId}`;
}

function isValidNote(note) {
  return typeof note === 'string' && note.trim().length > 0 && note.length <= 2000;
}

function setNote(groupId, tabId, text) {
  if (!isValidNote(text)) throw new Error('Invalid note: must be a non-empty string up to 2000 characters');
  const key = makeKey(groupId, tabId);
  const existing = notes.get(key);
  notes.set(key, {
    text: text.trim(),
    createdAt: existing ? existing.createdAt : Date.now(),
    updatedAt: Date.now()
  });
}

function getNote(groupId, tabId) {
  return notes.get(makeKey(groupId, tabId)) || null;
}

function removeNote(groupId, tabId) {
  return notes.delete(makeKey(groupId, tabId));
}

function getNotesForGroup(groupId) {
  const result = {};
  for (const [key, value] of notes.entries()) {
    const [gId, tId] = key.split('::');
    if (gId === String(groupId)) {
      result[tId] = value;
    }
  }
  return result;
}

function getAllNotes() {
  const result = {};
  for (const [key, value] of notes.entries()) {
    result[key] = value;
  }
  return result;
}

function clearNotes() {
  notes.clear();
}

function getNoteCount(groupId) {
  let count = 0;
  for (const key of notes.keys()) {
    const [gId] = key.split('::');
    if (gId === String(groupId)) count++;
  }
  return count;
}

module.exports = {
  makeKey,
  isValidNote,
  setNote,
  getNote,
  removeNote,
  getNotesForGroup,
  getAllNotes,
  clearNotes,
  getNoteCount
};
