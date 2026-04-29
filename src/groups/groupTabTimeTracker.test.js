const {
  startTracking,
  stopTracking,
  getTimeRecord,
  getTotalTime,
  getGroupTimeRecords,
  getMostTimeSpentTab,
  clearTimeRecords
} = require('./groupTabTimeTracker');

beforeEach(() => clearTimeRecords());

describe('startTracking / stopTracking', () => {
  test('records a session after stop', () => {
    startTracking('g1', 't1');
    stopTracking('g1', 't1');
    const record = getTimeRecord('g1', 't1');
    expect(record).not.toBeNull();
    expect(record.sessions).toHaveLength(1);
    expect(record.totalMs).toBeGreaterThanOrEqual(0);
  });

  test('does not double-start an active session', () => {
    startTracking('g1', 't1');
    startTracking('g1', 't1');
    stopTracking('g1', 't1');
    const record = getTimeRecord('g1', 't1');
    expect(record.sessions).toHaveLength(1);
  });

  test('stop without start does nothing', () => {
    stopTracking('g1', 't99');
    expect(getTimeRecord('g1', 't99')).toBeNull();
  });
});

describe('getTotalTime', () => {
  test('returns 0 for unknown tab', () => {
    expect(getTotalTime('g1', 'unknown')).toBe(0);
  });

  test('accumulates time across sessions', () => {
    startTracking('g1', 't1');
    stopTracking('g1', 't1');
    startTracking('g1', 't1');
    stopTracking('g1', 't1');
    expect(getTotalTime('g1', 't1')).toBeGreaterThanOrEqual(0);
    expect(getTimeRecord('g1', 't1').sessions).toHaveLength(2);
  });
});

describe('getGroupTimeRecords', () => {
  test('returns only records for the given group', () => {
    startTracking('g1', 't1');
    stopTracking('g1', 't1');
    startTracking('g2', 't2');
    stopTracking('g2', 't2');
    const g1Records = getGroupTimeRecords('g1');
    expect(Object.keys(g1Records)).toContain('t1');
    expect(Object.keys(g1Records)).not.toContain('t2');
  });
});

describe('getMostTimeSpentTab', () => {
  test('returns null for empty group', () => {
    expect(getMostTimeSpentTab('empty')).toBeNull();
  });

  test('returns the tab with most total time', () => {
    startTracking('g1', 't1');
    stopTracking('g1', 't1');
    startTracking('g1', 't1');
    stopTracking('g1', 't1');
    startTracking('g1', 't2');
    stopTracking('g1', 't2');
    const result = getMostTimeSpentTab('g1');
    expect(result).not.toBeNull();
    expect(result.tabId).toBeDefined();
  });
});
