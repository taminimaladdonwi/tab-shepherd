const {
  isValidPriority,
  setPriority,
  getPriority,
  removePriority,
  getGroupPriorities,
  getTabsByPriority,
  getSortedTabs,
  clearGroupPriorities,
  clearAll,
  getValidPriorities
} = require('./groupTabPrioritizer');

beforeEach(() => clearAll());

describe('isValidPriority', () => {
  test('accepts valid priorities', () => {
    expect(isValidPriority('critical')).toBe(true);
    expect(isValidPriority('high')).toBe(true);
    expect(isValidPriority('normal')).toBe(true);
    expect(isValidPriority('low')).toBe(true);
  });
  test('rejects invalid priorities', () => {
    expect(isValidPriority('urgent')).toBe(false);
    expect(isValidPriority('')).toBe(false);
  });
});

describe('setPriority / getPriority', () => {
  test('stores and retrieves priority', () => {
    setPriority('g1', 't1', 'high');
    const entry = getPriority('g1', 't1');
    expect(entry.priority).toBe('high');
    expect(entry.groupId).toBe('g1');
    expect(entry.tabId).toBe('t1');
  });
  test('throws on invalid priority', () => {
    expect(() => setPriority('g1', 't1', 'mega')).toThrow();
  });
  test('returns null for unknown tab', () => {
    expect(getPriority('g1', 'unknown')).toBeNull();
  });
});

describe('removePriority', () => {
  test('removes an existing entry', () => {
    setPriority('g1', 't1', 'low');
    expect(removePriority('g1', 't1')).toBe(true);
    expect(getPriority('g1', 't1')).toBeNull();
  });
  test('returns false when not found', () => {
    expect(removePriority('g1', 'ghost')).toBe(false);
  });
});

describe('getGroupPriorities', () => {
  test('returns only entries for the given group', () => {
    setPriority('g1', 't1', 'high');
    setPriority('g1', 't2', 'low');
    setPriority('g2', 't3', 'critical');
    const entries = getGroupPriorities('g1');
    expect(entries).toHaveLength(2);
    expect(entries.every(e => e.groupId === 'g1')).toBe(true);
  });
});

describe('getTabsByPriority', () => {
  test('filters by priority level', () => {
    setPriority('g1', 't1', 'high');
    setPriority('g1', 't2', 'low');
    setPriority('g1', 't3', 'high');
    expect(getTabsByPriority('g1', 'high')).toHaveLength(2);
    expect(getTabsByPriority('g1', 'low')).toHaveLength(1);
  });
});

describe('getSortedTabs', () => {
  test('sorts tabs by priority order', () => {
    setPriority('g1', 't1', 'low');
    setPriority('g1', 't2', 'critical');
    setPriority('g1', 't3', 'high');
    const tabs = [{ id: 't1' }, { id: 't2' }, { id: 't3' }];
    const sorted = getSortedTabs('g1', tabs);
    expect(sorted.map(t => t.id)).toEqual(['t2', 't3', 't1']);
  });
});

describe('clearGroupPriorities', () => {
  test('clears only the specified group', () => {
    setPriority('g1', 't1', 'high');
    setPriority('g2', 't2', 'low');
    clearGroupPriorities('g1');
    expect(getGroupPriorities('g1')).toHaveLength(0);
    expect(getGroupPriorities('g2')).toHaveLength(1);
  });
});

describe('getValidPriorities', () => {
  test('returns all four levels', () => {
    expect(getValidPriorities()).toEqual(['critical', 'high', 'normal', 'low']);
  });
});
