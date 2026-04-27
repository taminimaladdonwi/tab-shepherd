const {
  freezeTab,
  unfreezeTab,
  isFrozen,
  getFreezeInfo,
  getFrozenTabsInGroup,
  getAllFrozen,
  filterSuspendable,
  clearFrozen
} = require('./groupTabFreezer');

beforeEach(() => clearFrozen());

describe('freezeTab / isFrozen', () => {
  test('marks a tab as frozen', () => {
    freezeTab('g1', 't1', 'pinned');
    expect(isFrozen('g1', 't1')).toBe(true);
  });

  test('returns false for unfrozen tab', () => {
    expect(isFrozen('g1', 't99')).toBe(false);
  });

  test('throws on invalid reason', () => {
    expect(() => freezeTab('g1', 't1', '')).toThrow('Invalid freeze reason');
  });

  test('defaults reason to manual', () => {
    freezeTab('g1', 't2');
    expect(getFreezeInfo('g1', 't2').reason).toBe('manual');
  });
});

describe('unfreezeTab', () => {
  test('removes frozen entry', () => {
    freezeTab('g1', 't1');
    unfreezeTab('g1', 't1');
    expect(isFrozen('g1', 't1')).toBe(false);
  });

  test('returns false when tab was not frozen', () => {
    expect(unfreezeTab('g1', 'ghost')).toBe(false);
  });
});

describe('getFreezeInfo', () => {
  test('returns freeze metadata', () => {
    freezeTab('g1', 't1', 'media');
    const info = getFreezeInfo('g1', 't1');
    expect(info.reason).toBe('media');
    expect(info.groupId).toBe('g1');
    expect(info.tabId).toBe('t1');
    expect(typeof info.frozenAt).toBe('number');
  });

  test('returns null for unknown tab', () => {
    expect(getFreezeInfo('g1', 'none')).toBeNull();
  });
});

describe('getFrozenTabsInGroup', () => {
  test('returns only tabs for given group', () => {
    freezeTab('g1', 't1');
    freezeTab('g1', 't2');
    freezeTab('g2', 't3');
    expect(getFrozenTabsInGroup('g1')).toHaveLength(2);
    expect(getFrozenTabsInGroup('g2')).toHaveLength(1);
  });
});

describe('getAllFrozen', () => {
  test('returns all frozen entries', () => {
    freezeTab('g1', 't1');
    freezeTab('g2', 't2');
    expect(getAllFrozen()).toHaveLength(2);
  });
});

describe('filterSuspendable', () => {
  test('excludes frozen tabs', () => {
    freezeTab('g1', 't1');
    const tabs = [{ id: 't1' }, { id: 't2' }, { id: 't3' }];
    const result = filterSuspendable('g1', tabs);
    expect(result).toHaveLength(2);
    expect(result.map(t => t.id)).not.toContain('t1');
  });

  test('returns all tabs when none are frozen', () => {
    const tabs = [{ id: 'a' }, { id: 'b' }];
    expect(filterSuspendable('g1', tabs)).toHaveLength(2);
  });
});
