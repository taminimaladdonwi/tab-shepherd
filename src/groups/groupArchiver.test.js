const {
  archiveGroup,
  restoreArchivedGroup,
  isArchived,
  getAllArchived,
  deleteArchived,
  clearArchived,
} = require('./groupArchiver');

const sampleGroup = (id = 'g1') => ({
  id,
  name: 'Test Group',
  tabs: [101, 102, 103],
});

beforeEach(() => {
  clearArchived();
});

describe('archiveGroup', () => {
  test('archives a group and returns entry with archivedAt', () => {
    const entry = archiveGroup('g1', sampleGroup());
    expect(entry.groupId).toBe('g1');
    expect(entry.group.tabs).toEqual([101, 102, 103]);
    expect(typeof entry.archivedAt).toBe('number');
  });

  test('throws if groupId is missing', () => {
    expect(() => archiveGroup(null, sampleGroup())).toThrow();
  });

  test('throws if group is missing', () => {
    expect(() => archiveGroup('g1', null)).toThrow();
  });

  test('stores a copy of tabs array', () => {
    const group = sampleGroup();
    archiveGroup('g1', group);
    group.tabs.push(999);
    const all = getAllArchived();
    expect(all[0].group.tabs).not.toContain(999);
  });
});

describe('isArchived', () => {
  test('returns true for archived group', () => {
    archiveGroup('g1', sampleGroup());
    expect(isArchived('g1')).toBe(true);
  });

  test('returns false for unknown group', () => {
    expect(isArchived('unknown')).toBe(false);
  });
});

describe('restoreArchivedGroup', () => {
  test('returns the group and removes from archive', () => {
    archiveGroup('g1', sampleGroup());
    const group = restoreArchivedGroup('g1');
    expect(group.id).toBe('g1');
    expect(isArchived('g1')).toBe(false);
  });

  test('returns null for non-existent group', () => {
    expect(restoreArchivedGroup('nope')).toBeNull();
  });
});

describe('deleteArchived', () => {
  test('removes archived group without restoring', () => {
    archiveGroup('g1', sampleGroup());
    const result = deleteArchived('g1');
    expect(result).toBe(true);
    expect(isArchived('g1')).toBe(false);
  });

  test('returns false for non-existent group', () => {
    expect(deleteArchived('ghost')).toBe(false);
  });
});

describe('getAllArchived', () => {
  test('returns all archived entries', () => {
    archiveGroup('g1', sampleGroup('g1'));
    archiveGroup('g2', sampleGroup('g2'));
    expect(getAllArchived()).toHaveLength(2);
  });
});
