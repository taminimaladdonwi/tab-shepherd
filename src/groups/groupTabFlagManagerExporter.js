// groupTabFlagManagerExporter.js
// Export and import flag data for backup or migration

const { setFlag, getFlags, clearAll } = require('./groupTabFlagManager');

function exportFlags(groupIds, tabsByGroup) {
  const result = {};
  for (const groupId of groupIds) {
    result[groupId] = {};
    const tabs = tabsByGroup[groupId] || [];
    for (const tab of tabs) {
      const tabFlags = getFlags(groupId, tab.id);
      if (tabFlags.length > 0) {
        result[groupId][tab.id] = tabFlags;
      }
    }
  }
  return JSON.stringify(result);
}

function validateFlagImport(data) {
  if (typeof data !== 'object' || data === null) return false;
  for (const groupId of Object.keys(data)) {
    const group = data[groupId];
    if (typeof group !== 'object' || group === null) return false;
    for (const tabId of Object.keys(group)) {
      if (!Array.isArray(group[tabId])) return false;
      if (!group[tabId].every(f => typeof f === 'string')) return false;
    }
  }
  return true;
}

function importFlags(jsonStr, { merge = false } = {}) {
  let data;
  try {
    data = JSON.parse(jsonStr);
  } catch {
    throw new Error('Invalid JSON for flag import');
  }
  if (!validateFlagImport(data)) throw new Error('Invalid flag import structure');
  if (!merge) clearAll();
  for (const groupId of Object.keys(data)) {
    for (const tabId of Object.keys(data[groupId])) {
      for (const flag of data[groupId][tabId]) {
        try {
          setFlag(groupId, tabId, flag);
        } catch {
          // skip invalid flags silently on import
        }
      }
    }
  }
  return true;
}

module.exports = {
  exportFlags,
  validateFlagImport,
  importFlags
};
