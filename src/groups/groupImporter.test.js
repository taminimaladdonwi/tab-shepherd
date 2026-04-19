import { importGroup, importAllGroups, getImportErrors, clearImportErrors } from './groupImporter.js';
import { getAllGroups, clearGroups } from './manager.js';
import { exportGroup, exportAllGroups, serializeExport } from './groupExporter.js';
import { getTags } from './tagger.js';

beforeEach(() => {
  clearGroups();
  clearImportErrors();
});

describe('importGroup', () => {
  test('imports a group with tabs and tags', () => {
    const serialized = serializeExport({ name: 'Work', tabs: [{ id: 1 }, { id: 2 }], tags: ['dev', 'focus'] });
    const group = importGroup(serialized);
    expect(group).not.toBeNull();
    expect(group.name).toBe('Work');
    const tags = getTags(group.id);
    expect(tags).toContain('dev');
    expect(tags).toContain('focus');
  });

  test('returns null and records error for invalid JSON', () => {
    const group = importGroup('not-json');
    expect(group).toBeNull();
    const errors = getImportErrors();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toMatch(/Failed to parse/);
  });

  test('returns null for missing name', () => {
    const serialized = serializeExport({ tabs: [] });
    const group = importGroup(serialized);
    expect(group).toBeNull();
    expect(getImportErrors()[0]).toMatch(/missing name/);
  });

  test('skips invalid tabs and records errors', () => {
    const serialized = serializeExport({ name: 'Test', tabs: [{ id: 1 }, null, {}] });
    const group = importGroup(serialized);
    expect(group).not.toBeNull();
    const errors = getImportErrors();
    expect(errors.length).toBe(2);
  });

  test('imports group with no tabs or tags', () => {
    const serialized = serializeExport({ name: 'Empty' });
    const group = importGroup(serialized);
    expect(group).not.toBeNull();
    expect(group.name).toBe('Empty');
  });
});

describe('importAllGroups', () => {
  test('imports multiple groups', () => {
    const data = [
      { name: 'Alpha', tabs: [{ id: 10 }], tags: ['a'] },
      { name: 'Beta', tabs: [{ id: 20 }], tags: ['b'] }
    ];
    const serialized = serializeExport(data);
    const groups = importAllGroups(serialized);
    expect(groups.length).toBe(2);
    expect(groups.map(g => g.name)).toEqual(expect.arrayContaining(['Alpha', 'Beta']));
  });

  test('returns empty array and records error for non-array input', () => {
    const serialized = serializeExport({ name: 'Single' });
    const groups = importAllGroups(serialized);
    expect(groups).toEqual([]);
    expect(getImportErrors()[0]).toMatch(/Expected an array/);
  });

  test('returns empty array for invalid JSON', () => {
    const groups = importAllGroups('bad');
    expect(groups).toEqual([]);
  });
});
