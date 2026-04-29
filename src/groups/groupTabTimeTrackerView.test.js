const { startTracking, stopTracking, clearTimeRecords } = require('./groupTabTimeTracker');
const { getTimeSummary, getGroupsWithTracking, getTopTimeGroups, formatMs } = require('./groupTabTimeTrackerView');
const { createGroup, getAllGroups } = require('./manager');

jest.mock('./manager', () => {
  const groups = new Map();
  return {
    createGroup: (id, name) => { groups.set(id, { id, name }); return { id, name }; },
    getAllGroups: () => Array.from(groups.values()),
    __reset: () => groups.clear()
  };
});

beforeEach(() => {
  clearTimeRecords();
  require('./manager').__reset();
});

describe('formatMs', () => {
  test('formats seconds', () => expect(formatMs(5000)).toBe('5s'));
  test('formats minutes', () => expect(formatMs(90000)).toBe('1m 30s'));
  test('formats hours', () => expect(formatMs(3700000)).toBe('1h 1m'));
});

describe('getTimeSummary', () => {
  test('returns zero summary for untracked group', () => {
    const summary = getTimeSummary('g1');
    expect(summary.trackedTabCount).toBe(0);
    expect(summary.totalTrackedMs).toBe(0);
    expect(summary.mostTimeSpentTab).toBeNull();
  });

  test('returns correct summary after tracking', () => {
    startTracking('g1', 't1');
    stopTracking('g1', 't1');
    const summary = getTimeSummary('g1');
    expect(summary.trackedTabCount).toBe(1);
    expect(summary.totalTrackedMs).toBeGreaterThanOrEqual(0);
    expect(summary.groupId).toBe('g1');
  });
});

describe('getGroupsWithTracking', () => {
  test('returns only groups that have tracking data', () => {
    createGroup('g1', 'Group 1');
    createGroup('g2', 'Group 2');
    startTracking('g1', 't1');
    stopTracking('g1', 't1');
    const result = getGroupsWithTracking();
    expect(result).toContain('g1');
    expect(result).not.toContain('g2');
  });
});

describe('getTopTimeGroups', () => {
  test('returns groups sorted by total time descending', () => {
    createGroup('g1', 'Group 1');
    createGroup('g2', 'Group 2');
    startTracking('g1', 't1');
    stopTracking('g1', 't1');
    const result = getTopTimeGroups(5);
    expect(Array.isArray(result)).toBe(true);
    if (result.length > 1) {
      expect(result[0].totalMs).toBeGreaterThanOrEqual(result[1].totalMs);
    }
  });
});
