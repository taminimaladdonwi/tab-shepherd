// groupTabNotesExporter.js — Export/import tab notes

const { getAllNotes, setNote, clearNotes } = require('./groupTabNotes');

function exportNotes() {
  const all = getAllNotes();
  return {
    version: 1,
    exportedAt: Date.now(),
    notes: all
  };
}

function validateNotesImport(data) {
  if (!data || typeof data !== 'object') return false;
  if (data.version !== 1) return false;
  if (!data.notes || typeof data.notes !== 'object') return false;
  for (const [key, value] of Object.entries(data.notes)) {
    if (!key.includes('::')) return false;
    if (typeof value.text !== 'string') return false;
    if (typeof value.createdAt !== 'number') return false;
    if (typeof value.updatedAt !== 'number') return false;
  }
  return true;
}

function importNotes(data, { merge = false } = {}) {
  if (!validateNotesImport(data)) throw new Error('Invalid notes import data');
  if (!merge) clearNotes();
  for (const [key, value] of Object.entries(data.notes)) {
    const [groupId, tabId] = key.split('::');
    setNote(groupId, tabId, value.text);
  }
  return Object.keys(data.notes).length;
}

module.exports = {
  exportNotes,
  validateNotesImport,
  importNotes
};
