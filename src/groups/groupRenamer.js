const { getGroup, getAllGroups } = require('./manager');

const renameHistory = new Map();

function renameGroup(groupId, newName) {
  if (!newName || typeof newName !== 'string' || newName.trim() === '') {
    throw new Error('Invalid group name');
  }

  const group = getGroup(groupId);
  if (!group) {
    throw new Error(`Group not found: ${groupId}`);
  }

  const trimmed = newName.trim();
  const oldName = group.name;

  if (oldName === trimmed) {
    return group;
  }

  group.name = trimmed;

  if (!renameHistory.has(groupId)) {
    renameHistory.set(groupId, []);
  }
  renameHistory.get(groupId).push({
    from: oldName,
    to: trimmed,
    renamedAt: Date.now()
  });

  return group;
}

function getRenameHistory(groupId) {
  return renameHistory.get(groupId) || [];
}

function findGroupByName(name) {
  if (!name) return null;
  const lower = name.toLowerCase();
  return getAllGroups().find(g => g.name && g.name.toLowerCase() === lower) || null;
}

function clearRenameHistory() {
  renameHistory.clear();
}

module.exports = { renameGroup, getRenameHistory, findGroupByName, clearRenameHistory };
