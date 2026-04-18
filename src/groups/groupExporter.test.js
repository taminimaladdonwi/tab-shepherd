import { exportGroup, exportAllGroups, serializeExport, deserializeExport } from './groupExporter.js';
import { createGroup, addTabToGroup, clearGroups } from './manager.js';
import { setTags } from './tagger.js';

beforeEach(() => {
  clearGroups();
});

describe('exportGroup', () => {
  test('exports a group with tabs and tags', () => {
    const g = createGroup('Work');
    addTabToGroup(g.id, 101);
    setTags(g.id, ['important', 'work']);
    const result = exportGroup(g.id);
    expect(result.id).toBe(g.id);
    expect(result.name).toBe('Work');
    expect(result.tabs).toContain(101);
    expect(result.tags).toEqual(expect.arrayContaining(['important', 'work']));
    expect(typeof result.exportedAt).toBe('number');
  });

  test('throws for unknown group', () => {
    expect(() => exportGroup('nonexistent')).toThrow('Group not found');
  });
});

describe('exportAllGroups', () => {
  test('returns empty array when no groups', () => {
    expect(exportAllGroups()).toEqual([]);
  });

  test('returns all groups', () => {
    createGroup('A');
    createGroup('B');
    const result = exportAllGroups();
    expect(result).toHaveLength(2);
    expect(result.map((g) => g.name)).toEqual(expect.arrayContaining(['A', 'B']));
  });
});

describe('serializeExport / deserializeExport', () => {
  test('round-trips group data', () => {
    const g = createGroup('Test');
    addTabToGroup(g.id, 55);
    const data = exportAllGroups();
    const json = serializeExport(data);
    const parsed = deserializeExport(json);
    expect(parsed.version).toBe(1);
    expect(parsed.groups).toHaveLength(1);
    expect(parsed.groups[0].name).toBe('Test');
    expect(parsed.groups[0].tabs).toContain(55);
  });

  test('deserializeExport throws on bad JSON', () => {
    expect(() => deserializeExport('not json')).toThrow('Invalid JSON export data');
  });

  test('deserializeExport throws on wrong format', () => {
    expect(() => deserializeExport(JSON.stringify({ version: 2, groups: [] }))).toThrow('Unrecognized export format');
  });
});
