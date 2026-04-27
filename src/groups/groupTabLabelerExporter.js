// groupTabLabelerExporter.js — Export and import tab label data

const { getAllLabels, setLabel, isValidLabel } = require('./groupTabLabeler');

function exportLabels() {
  const raw = getAllLabels();
  const entries = Object.entries(raw).map(([key, label]) => {
    const [groupId, tabId] = key.split('::');
    return { groupId, tabId, label };
  });
  return JSON.stringify({ version: 1, labels: entries });
}

function validateLabelImport(data) {
  const errors = [];
  if (!data || typeof data !== 'object') {
    errors.push('Import data must be an object');
    return errors;
  }
  if (data.version !== 1) errors.push('Unsupported version');
  if (!Array.isArray(data.labels)) {
    errors.push('labels must be an array');
    return errors;
  }
  data.labels.forEach((entry, i) => {
    if (!entry.groupId) errors.push(`Entry ${i}: missing groupId`);
    if (!entry.tabId) errors.push(`Entry ${i}: missing tabId`);
    if (!isValidLabel(entry.label)) errors.push(`Entry ${i}: invalid label "${entry.label}"`);
  });
  return errors;
}

function importLabels(jsonString) {
  let data;
  try {
    data = JSON.parse(jsonString);
  } catch {
    throw new Error('Invalid JSON for label import');
  }
  const errors = validateLabelImport(data);
  if (errors.length) throw new Error(`Import validation failed: ${errors.join('; ')}`);
  let imported = 0;
  for (const { groupId, tabId, label } of data.labels) {
    setLabel(groupId, tabId, label);
    imported++;
  }
  return { imported };
}

module.exports = { exportLabels, validateLabelImport, importLabels };
