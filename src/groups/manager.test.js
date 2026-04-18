import {
  createGroup,
  getGroup,
  getAllGroups,
  addTabToGroup,
  removeTabFromGroup,
  deleteGroup,
  clearAllGroups,
} from './manager.js';

beforeEach(() => clearAllGroups());

describe('createGroup', () => {
  test('creates a group with given name and tabIds', () => {
    const group = createGroup('My Group', [1, 2, 3]);
    expect(group.name).toBe('My Group');
    expect(group.tabIds).toEqual([1, 2, 3]);
    expect(group.id).toMatch(/^group-/);
  });

  test('defaults to empty tabIds', () => {
    const group = createGroup('Empty');
    expect(group.tabIds).toEqual([]);
  });
});

describe('getGroup', () => {
  test('returns existing group', () => {
    const created = createGroup('Test');
    expect(getGroup(created.id)).toEqual(created);
  });

  test('returns null for unknown id', () => {
    expect(getGroup('nonexistent')).toBeNull();
  });
});

describe('addTabToGroup', () => {
  test('adds a tab id to the group', () => {
    const group = createGroup('G', [1]);
    addTabToGroup(group.id, 2);
    expect(getGroup(group.id).tabIds).toContain(2);
  });

  test('does not add duplicate tab ids', () => {
    const group = createGroup('G', [1]);
    addTabToGroup(group.id, 1);
    expect(getGroup(group.id).tabIds.filter(id => id === 1)).toHaveLength(1);
  });

  test('throws for unknown group', () => {
    expect(() => addTabToGroup('bad-id', 5)).toThrow();
  });
});

describe('removeTabFromGroup', () => {
  test('removes a tab from group', () => {
    const group = createGroup('G', [1, 2]);
    removeTabFromGroup(group.id, 1);
    expect(getGroup(group.id).tabIds).not.toContain(1);
  });

  test('deletes group when last tab is removed', () => {
    const group = createGroup('G', [1]);
    removeTabFromGroup(group.id, 1);
    expect(getGroup(group.id)).toBeNull();
  });
});

describe('getAllGroups', () => {
  test('returns all created groups', () => {
    createGroup('A');
    createGroup('B');
    expect(getAllGroups()).toHaveLength(2);
  });
});

describe('deleteGroup', () => {
  test('removes group by id', () => {
    const group = createGroup('Del');
    deleteGroup(group.id);
    expect(getGroup(group.id)).toBeNull();
  });
});
