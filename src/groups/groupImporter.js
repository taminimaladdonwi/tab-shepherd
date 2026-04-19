import { createGroup, addTabToGroup } from './manager.js';
import { deserializeExport } from './groupExporter.js';
import { setTags } from './tagger.js';

const importErrors = [];

function getImportErrors() {
  return [...importErrors];
}

function clearImportErrors() {
  importErrors.length = 0;
}

function importGroup(serialized) {
  clearImportErrors();
  let data;
  try {
    data = deserializeExport(serialized);
  } catch (e) {
    importErrors.push(`Failed to parse import data: ${e.message}`);
    return null;
  }

  if (!data || !data.name) {
    importErrors.push('Invalid group data: missing name');
    return null;
  }

  const group = createGroup(data.name);

  if (data.tabs && Array.isArray(data.tabs)) {
    for (const tab of data.tabs) {
      if (tab && tab.id != null) {
        addTabToGroup(group.id, tab.id);
      } else {
        importErrors.push(`Skipped invalid tab entry: ${JSON.stringify(tab)}`);
      }
    }
  }

  if (data.tags && Array.isArray(data.tags)) {
    setTags(group.id, data.tags);
  }

  return group;
}

function importAllGroups(serialized) {
  clearImportErrors();
  let items;
  try {
    items = deserializeExport(serialized);
  } catch (e) {
    importErrors.push(`Failed to parse import data: ${e.message}`);
    return [];
  }

  if (!Array.isArray(items)) {
    importErrors.push('Expected an array of groups');
    return [];
  }

  return items
    .map(item => importGroup(JSON.stringify(item)))
    .filter(Boolean);
}

export { importGroup, importAllGroups, getImportErrors, clearImportErrors };
