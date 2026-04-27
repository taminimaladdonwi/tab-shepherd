import {
  exportFreezeData,
  validateFreezeImport,
  importFreezeDataFromExport
} from './groupTabFreezerExporter.js';
import { freezeTab, isFrozen, clearFreezeData } from './groupTabFreezer.js';

beforeEach(() => {
  clearFreezeData();
});

describe('exportFreezeData', () => {
  test('exports empty data when nothing is frozen', () => {
    const result = exportFreezeData();
    expect(result.version).toBe(1);
    expect(result.exportedAt).toBeDefined();
    expect(result.data).toEqual({});
  });

  test('exports existing freeze entries', () => {
    freezeTab('g1', 'tab1', 'performance');
    const result = exportFreezeData();
    const keys = Object.keys(result.data);
    expect(keys.length).toBe(1);
    const entry = Object.values(result.data)[0];
    expect(entry.reason).toBe('performance');
    expect(entry.frozenAt).toBeDefined();
  });
});

describe('validateFreezeImport', () => {
  test('rejects null payload', () => {
    const { valid, errors } = validateFreezeImport(null);
    expect(valid).toBe(false);
    expect(errors.length).toBeGreaterThan(0);
  });

  test('rejects unsupported version', () => {
    const { valid, errors } = validateFreezeImport({ version: 99, data: {} });
    expect(valid).toBe(false);
    expect(errors.some(e => e.includes('version'))).toBe(true);
  });

  test('rejects payload with invalid entry', () => {
    const payload = {
      version: 1,
      data: { 'g1::tab1': { reason: 123, frozenAt: 'bad' } }
    };
    const { valid, errors } = validateFreezeImport(payload);
    expect(valid).toBe(false);
    expect(errors.some(e => e.includes('reason'))).toBe(true);
  });

  test('accepts valid payload', () => {
    const payload = {
      version: 1,
      data: { 'g1::tab1': { reason: 'memory', frozenAt: new Date().toISOString() } }
    };
    const { valid } = validateFreezeImport(payload);
    expect(valid).toBe(true);
  });
});

describe('importFreezeDataFromExport', () => {
  test('returns errors on invalid payload', () => {
    const { imported, errors } = importFreezeDataFromExport(null);
    expect(imported).toBe(0);
    expect(errors.length).toBeGreaterThan(0);
  });

  test('imports valid freeze data and restores frozen state', () => {
    freezeTab('g1', 'tab1', 'performance');
    const exported = exportFreezeData();
    clearFreezeData();
    expect(isFrozen('g1', 'tab1')).toBe(false);

    const { imported, errors } = importFreezeDataFromExport(exported);
    expect(errors).toEqual([]);
    expect(imported).toBe(1);
    expect(isFrozen('g1', 'tab1')).toBe(true);
  });
});
