const {
  recordCount,
  getCountHistory,
  getLatestCount,
  getPeakCount,
  getGroupsExceedingCount,
  clearGroupHistory,
  clearAll
} = require('./groupTabCounter');

beforeEach(() => {
  clearAll();
});

describe('recordCount', () => {
  test('records a count entry for a group', () => {
    recordCount('g1', 5);
    const history = getCountHistory('g1');
    expect(history).toHaveLength(1);
    expect(history[0].count).toBe(5);
    expect(typeof history[0].timestamp).toBe('number');
  });

  test('accumulates multiple entries', () => {
    recordCount('g1', 3);
    recordCount('g1', 7);
    expect(getCountHistory('g1')).toHaveLength(2);
  });

  test('throws on negative count', () => {
    expect(() => recordCount('g1', -1)).toThrow();
  });

  test('throws on non-number count', () => {
    expect(() => recordCount('g1', 'five')).toThrow();
  });
});

describe('getCountHistory', () => {
  test('returns empty array for unknown group', () => {
    expect(getCountHistory('unknown')).toEqual([]);
  });
});

describe('getLatestCount', () => {
  test('returns null for unknown group', () => {
    expect(getLatestCount('g1')).toBeNull();
  });

  test('returns most recent count', () => {
    recordCount('g1', 2);
    recordCount('g1', 9);
    expect(getLatestCount('g1')).toBe(9);
  });
});

describe('getPeakCount', () => {
  test('returns null for unknown group', () => {
    expect(getPeakCount('g1')).toBeNull();
  });

  test('returns maximum recorded count', () => {
    recordCount('g1', 4);
    recordCount('g1', 10);
    recordCount('g1', 6);
    expect(getPeakCount('g1')).toBe(10);
  });
});

describe('getGroupsExceedingCount', () => {
  test('returns groups whose latest count exceeds threshold', () => {
    recordCount('g1', 5);
    recordCount('g2', 15);
    recordCount('g3', 10);
    const result = getGroupsExceedingCount(9);
    expect(result).toContain('g2');
    expect(result).toContain('g3');
    expect(result).not.toContain('g1');
  });

  test('returns empty array when no groups exceed threshold', () => {
    recordCount('g1', 2);
    expect(getGroupsExceedingCount(100)).toEqual([]);
  });
});

describe('clearGroupHistory', () => {
  test('removes history for a specific group', () => {
    recordCount('g1', 5);
    recordCount('g2', 3);
    clearGroupHistory('g1');
    expect(getCountHistory('g1')).toEqual([]);
    expect(getCountHistory('g2')).toHaveLength(1);
  });
});
