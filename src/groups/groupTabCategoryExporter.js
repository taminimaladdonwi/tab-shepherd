import { getAllCategories, getCategoriesForGroup } from './groupTabCategorizer.js';

/**
 * Exports all category data as a serializable object.
 * @returns {object}
 */
export function exportCategories() {
  const all = getAllCategories();
  return {
    version: 1,
    exportedAt: Date.now(),
    categories: all
  };
}

/**
 * Exports category data for a single group.
 * @param {string} groupId
 * @returns {object}
 */
export function exportGroupCategories(groupId) {
  const categories = getCategoriesForGroup(groupId);
  return {
    version: 1,
    exportedAt: Date.now(),
    groupId,
    categories
  };
}

/**
 * Validates an import payload.
 * @param {any} data
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateCategoryImport(data) {
  const errors = [];
  if (!data || typeof data !== 'object') {
    errors.push('Import data must be an object.');
    return { valid: false, errors };
  }
  if (data.version !== 1) {
    errors.push(`Unsupported version: ${data.version}`);
  }
  if (!data.categories || typeof data.categories !== 'object') {
    errors.push('Missing or invalid categories field.');
  }
  return { valid: errors.length === 0, errors };
}

/**
 * Imports categories from a previously exported payload.
 * @param {object} data
 * @param {Function} setCategory - setCategory(groupId, tabId, category)
 * @returns {{ imported: number, errors: string[] }}
 */
export function importCategories(data, setCategory) {
  const { valid, errors } = validateCategoryImport(data);
  if (!valid) return { imported: 0, errors };

  let imported = 0;
  const importErrors = [];

  for (const [key, category] of Object.entries(data.categories)) {
    const parts = key.split('::');
    if (parts.length !== 2) {
      importErrors.push(`Invalid key format: ${key}`);
      continue;
    }
    const [groupId, tabId] = parts;
    try {
      setCategory(groupId, tabId, category);
      imported++;
    } catch (err) {
      importErrors.push(`Failed to import ${key}: ${err.message}`);
    }
  }

  return { imported, errors: importErrors };
}
