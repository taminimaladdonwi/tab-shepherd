import { getAllFreezeData, importFreezeData } from './groupTabFreezer.js';

/**
 * Exports all freeze data as a serializable object.
 * @returns {{ version: number, exportedAt: string, data: object }}
 */
export function exportFreezeData() {
  const data = getAllFreezeData();
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    data
  };
}

/**
 * Validates an imported freeze data payload.
 * @param {any} payload
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateFreezeImport(payload) {
  const errors = [];

  if (!payload || typeof payload !== 'object') {
    errors.push('Payload must be a non-null object');
    return { valid: false, errors };
  }

  if (payload.version !== 1) {
    errors.push(`Unsupported version: ${payload.version}`);
  }

  if (!payload.data || typeof payload.data !== 'object') {
    errors.push('Missing or invalid data field');
  } else {
    for (const [key, entry] of Object.entries(payload.data)) {
      if (typeof entry.reason !== 'string') {
        errors.push(`Entry "${key}" is missing a valid reason string`);
      }
      if (typeof entry.frozenAt !== 'string') {
        errors.push(`Entry "${key}" is missing a valid frozenAt timestamp`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Imports freeze data from a validated payload.
 * @param {object} payload
 * @returns {{ imported: number, errors: string[] }}
 */
export function importFreezeDataFromExport(payload) {
  const { valid, errors } = validateFreezeImport(payload);
  if (!valid) {
    return { imported: 0, errors };
  }

  importFreezeData(payload.data);
  return { imported: Object.keys(payload.data).length, errors: [] };
}
