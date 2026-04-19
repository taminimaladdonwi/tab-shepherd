const { renameGroup, getRenameHistory, findGroupByName, clearRenameHistory } = require('./groupRenamer');
const { createGroup, getAllGroups } = require('./manager');

jest.mock('./manager', () => {
  const groups = new Map();
  return {
    createGroup: (id, name) => { const g = { id, name, tabs: [] }; groups.set(id, g); return g; },
    getGroup: (id) => groups.get(id) || null,
    getAllGroups: () => Array.from(groups.values()),
    __reset: () => groups.clear()
  };
});

const { __reset } = require('./manager');

beforeEach(() => {
  __reset();
  clearRenameHistory();
});

describe('renameGroup', () => {
  test('renames a group successfully', () => {
    createGroup('g1', 'Old Name');
    const result = renameGroup('g1', 'New Name');
    expect(result.name).toBe('New Name');
  });

  test('trims whitespace from new name', () => {
    createGroup('g1', 'Old');
    const result = renameGroup('g1', '  Trimmed  ');
    expect(result.name).toBe('Trimmed');
  });

  test('throws if group not found', () => {
    expect(() => renameGroup('missing', 'Name')).toThrow('Group not found');
  });

  test('throws if name is empty', () => {
    createGroup('g1', 'Old');
    expect(() => renameGroup('g1', '')).toThrow('Invalid group name');
    expect(() => renameGroup('g1', '   ')).toThrow('Invalid group name');
  });

  test('returns group unchanged if name is same', () => {
    createGroup('g1', 'Same');
    const result = renameGroup('g1', 'Same');
    expect(result.name).toBe('Same');
    expect(getRenameHistory('g1')).toHaveLength(0);
  });
});

describe('getRenameHistory', () => {
  test('records rename history', () => {
    createGroup('g1', 'A');
    renameGroup('g1', 'B');
    renameGroup('g1', 'C');
    const history = getRenameHistory('g1');
    expect(history).toHaveLength(2);
    expect(history[0]).toMatchObject({ from: 'A', to: 'B' });
    expect(history[1]).toMatchObject({ from: 'B', to: 'C' });
  });

  test('returns empty array for group with no history', () => {
    expect(getRenameHistory('unknown')).toEqual([]);
  });
});

describe('findGroupByName', () => {
  test('finds group by name case-insensitively', () => {
    createGroup('g1', 'Work Tabs');
    const found = findGroupByName('work tabs');
    expect(found).not.toBeNull();
    expect(found.id).toBe('g1');
  });

  test('returns null if not found', () => {
    expect(findGroupByName('Nonexistent')).toBeNull();
  });
});
