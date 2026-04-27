// groupTabLabeler.js — Assign and manage labels on tabs within groups

const labels = new Map();

function makeKey(groupId, tabId) {
  return `${groupId}::${tabId}`;
}

const VALID_LABEL_RE = /^[\w\s\-]{1,64}$/;

function isValidLabel(label) {
  return typeof label === 'string' && VALID_LABEL_RE.test(label.trim());
}

function setLabel(groupId, tabId, label) {
  if (!isValidLabel(label)) throw new Error(`Invalid label: "${label}"`);
  labels.set(makeKey(groupId, tabId), label.trim());
}

function getLabel(groupId, tabId) {
  return labels.get(makeKey(groupId, tabId)) ?? null;
}

function removeLabel(groupId, tabId) {
  return labels.delete(makeKey(groupId, tabId));
}

function getLabelsForGroup(groupId) {
  const result = {};
  for (const [key, label] of labels.entries()) {
    const [gid, tid] = key.split('::');
    if (gid === String(groupId)) result[tid] = label;
  }
  return result;
}

function findTabsByLabel(groupId, searchLabel) {
  const normalized = searchLabel.trim().toLowerCase();
  const result = [];
  for (const [key, label] of labels.entries()) {
    const [gid, tid] = key.split('::');
    if (gid === String(groupId) && label.toLowerCase().includes(normalized)) {
      result.push(tid);
    }
  }
  return result;
}

function clearLabels(groupId) {
  for (const key of [...labels.keys()]) {
    if (key.startsWith(`${groupId}::`)) labels.delete(key);
  }
}

function getAllLabels() {
  return Object.fromEntries(labels);
}

module.exports = {
  isValidLabel,
  setLabel,
  getLabel,
  removeLabel,
  getLabelsForGroup,
  findTabsByLabel,
  clearLabels,
  getAllLabels
};
