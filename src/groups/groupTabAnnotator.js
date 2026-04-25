// groupTabAnnotator.js
// Allows attaching notes/annotations to tabs within a group

const annotations = new Map(); // key: `${groupId}::${tabId}`

function makeKey(groupId, tabId) {
  return `${groupId}::${tabId}`;
}

function setAnnotation(groupId, tabId, note) {
  if (typeof note !== 'string') throw new Error('Annotation must be a string');
  if (!groupId || !tabId) throw new Error('groupId and tabId are required');
  const key = makeKey(groupId, tabId);
  const entry = {
    note: note.trim(),
    createdAt: annotations.has(key) ? annotations.get(key).createdAt : Date.now(),
    updatedAt: Date.now()
  };
  annotations.set(key, entry);
  return entry;
}

function getAnnotation(groupId, tabId) {
  return annotations.get(makeKey(groupId, tabId)) || null;
}

function removeAnnotation(groupId, tabId) {
  return annotations.delete(makeKey(groupId, tabId));
}

function getAnnotationsForGroup(groupId) {
  const result = {};
  for (const [key, value] of annotations.entries()) {
    const [gid, tid] = key.split('::');
    if (gid === String(groupId)) {
      result[tid] = value;
    }
  }
  return result;
}

function getAllAnnotations() {
  const result = {};
  for (const [key, value] of annotations.entries()) {
    result[key] = value;
  }
  return result;
}

function clearAnnotations() {
  annotations.clear();
}

function getAnnotatedTabCount(groupId) {
  return Object.keys(getAnnotationsForGroup(groupId)).length;
}

module.exports = {
  setAnnotation,
  getAnnotation,
  removeAnnotation,
  getAnnotationsForGroup,
  getAllAnnotations,
  clearAnnotations,
  getAnnotatedTabCount
};
