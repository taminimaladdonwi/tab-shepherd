const {
  isValidState,
  setVisibility,
  getVisibility,
  removeVisibility,
  getGroupVisibility,
  getHiddenTabs,
  getVisibleTabs,
  getAllVisibilityRecords,
  clearVisibility
} = require('./groupTabVisibilityTracker');

beforeEach(() => clearVisibility());

describe('isValidState', () => {
  test('accepts valid states', () => {
    expect(isValidState('visible')).toBe(true);
    expect(isValidState('hidden')).toBe(true);
    expect(isValidState('unknown')).toBe(true);
  });

  test('rejects invalid states', () => {
    expect(isValidState('active')).toBe(false);
    expect(isValidState('')).toBe(false);
  });
});

describe('setVisibility / getVisibility', () => {
  test('stores and retrieves a visibility record', () => {
    setVisibility('g1', 't1', 'visible');
    const record = getVisibility('g1', 't1');
    expect(record).not.toBeNull();
    expect(record.state).toBe('visible');
    expect(record.groupId).toBe('g1');
    expect(record.tabId).toBe('t1');
  });

  test('returns null for unknown tab', () => {
    expect(getVisibility('g1', 'missing')).toBeNull();
  });

  test('throws on invalid state', () => {
    expect(() => setVisibility('g1', 't1', 'blinking')).toThrow();
  });

  test('stores optional meta fields', () => {
    setVisibility('g1', 't2', 'hidden', { reason: 'minimized' });
    const record = getVisibility('g1', 't2');
    expect(record.reason).toBe('minimized');
  });
});

describe('removeVisibility', () => {
  test('removes an existing record', () => {
    setVisibility('g1', 't1', 'visible');
    expect(removeVisibility('g1', 't1')).toBe(true);
    expect(getVisibility('g1', 't1')).toBeNull();
  });

  test('returns false for non-existent record', () => {
    expect(removeVisibility('g1', 'none')).toBe(false);
  });
});

describe('getGroupVisibility', () => {
  test('returns only records for the given group', () => {
    setVisibility('g1', 't1', 'visible');
    setVisibility('g1', 't2', 'hidden');
    setVisibility('g2', 't3', 'visible');
    const records = getGroupVisibility('g1');
    expect(records).toHaveLength(2);
    expect(records.every(r => r.groupId === 'g1')).toBe(true);
  });
});

describe('getHiddenTabs / getVisibleTabs', () => {
  test('filters by state correctly', () => {
    setVisibility('g1', 't1', 'visible');
    setVisibility('g1', 't2', 'hidden');
    setVisibility('g1', 't3', 'hidden');
    expect(getHiddenTabs('g1')).toHaveLength(2);
    expect(getVisibleTabs('g1')).toHaveLength(1);
  });
});

describe('getAllVisibilityRecords', () => {
  test('returns all records across groups', () => {
    setVisibility('g1', 't1', 'visible');
    setVisibility('g2', 't2', 'hidden');
    expect(getAllVisibilityRecords()).toHaveLength(2);
  });
});
