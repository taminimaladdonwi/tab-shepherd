import { sortGroups, sortAllGroups, getSortedGroupIds, getSupportedSortFields } from './groupSorter.js';
import { createGroup } from './manager.js';
import { setColor } from './groupColorizer.js';
import { pinGroup } from './groupPinner.js';

let groupA, groupB, groupC;

function setup() {
  groupA = createGroup('Alpha');
  groupA.createdAt = 1000;
  groupB = createGroup('Beta');
  groupB.createdAt = 3000;
  groupC = createGroup('Gamma');
  groupC.createdAt = 2000;
}

beforeEach(() => {
  setup();
});

describe('sortGroups', () => {
  test('sorts by name ascending', () => {
    const sorted = sortGroups([groupC, groupA, groupB], 'name', 'asc');
    expect(sorted.map(g => g.name)).toEqual(['Alpha', 'Beta', 'Gamma']);
  });

  test('sorts by name descending', () => {
    const sorted = sortGroups([groupA, groupB, groupC], 'name', 'desc');
    expect(sorted.map(g => g.name)).toEqual(['Gamma', 'Beta', 'Alpha']);
  });

  test('sorts by created ascending', () => {
    const sorted = sortGroups([groupB, groupC, groupA], 'created', 'asc');
    expect(sorted[0].name).toBe('Alpha');
    expect(sorted[2].name).toBe('Beta');
  });

  test('sorts by created descending', () => {
    const sorted = sortGroups([groupA, groupB, groupC], 'created', 'desc');
    expect(sorted[0].name).toBe('Beta');
  });

  test('sorts pinned groups first', () => {
    pinGroup(groupC.id);
    const sorted = sortGroups([groupA, groupB, groupC], 'pinned', 'asc');
    expect(sorted[0].id).toBe(groupC.id);
  });

  test('sorts by color', () => {
    setColor(groupA.id, '#aaaaaa');
    setColor(groupC.id, '#cccccc');
    const sorted = sortGroups([groupC, groupA, groupB], 'color', 'asc');
    expect(sorted[0].id).toBe(groupB.id);
  });

  test('throws on invalid sort field', () => {
    expect(() => sortGroups([groupA], 'invalid')).toThrow('Invalid sort field');
  });

  test('does not mutate original array', () => {
    const original = [groupC, groupA, groupB];
    sortGroups(original, 'name', 'asc');
    expect(original[0].name).toBe('Gamma');
  });
});

describe('sortAllGroups', () => {
  test('returns all groups sorted', () => {
    const sorted = sortAllGroups('name', 'asc');
    expect(sorted.length).toBeGreaterThanOrEqual(3);
    const names = sorted.map(g => g.name);
    expect(names).toEqual([...names].sort());
  });
});

describe('getSortedGroupIds', () => {
  test('returns array of ids', () => {
    const ids = getSortedGroupIds('name', 'asc');
    expect(Array.isArray(ids)).toBe(true);
    ids.forEach(id => expect(typeof id).toBe('string'));
  });
});

describe('getSupportedSortFields', () => {
  test('returns expected fields', () => {
    const fields = getSupportedSortFields();
    expect(fields).toContain('name');
    expect(fields).toContain('tabCount');
    expect(fields).toContain('created');
  });
});
