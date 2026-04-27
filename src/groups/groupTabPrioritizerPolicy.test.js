const { setPriority, clearAll } = require('./groupTabPrioritizer');
const {
  isSuspensionBlocked,
  filterSuspendableTabs,
  partitionByPriority
} = require('./groupTabPrioritizerPolicy');

beforeEach(() => clearAll());

const tabs = [
  { id: 't1' },
  { id: 't2' },
  { id: 't3' },
  { id: 't4' }
];

describe('isSuspensionBlocked', () => {
  test('blocks critical tabs', () => {
    setPriority('g1', 't1', 'critical');
    expect(isSuspensionBlocked('g1', 't1')).toBe(true);
  });
  test('blocks high priority tabs', () => {
    setPriority('g1', 't2', 'high');
    expect(isSuspensionBlocked('g1', 't2')).toBe(true);
  });
  test('does not block normal tabs', () => {
    setPriority('g1', 't3', 'normal');
    expect(isSuspensionBlocked('g1', 't3')).toBe(false);
  });
  test('does not block low priority tabs', () => {
    setPriority('g1', 't4', 'low');
    expect(isSuspensionBlocked('g1', 't4')).toBe(false);
  });
  test('does not block unprioritized tabs', () => {
    expect(isSuspensionBlocked('g1', 'unknown')).toBe(false);
  });
});

describe('filterSuspendableTabs', () => {
  test('excludes critical and high priority tabs', () => {
    setPriority('g1', 't1', 'critical');
    setPriority('g1', 't2', 'high');
    setPriority('g1', 't3', 'normal');
    const result = filterSuspendableTabs('g1', tabs.slice(0, 3));
    expect(result.map(t => t.id)).toEqual(['t3']);
  });
  test('returns all tabs when none are prioritized', () => {
    const result = filterSuspendableTabs('g1', tabs);
    expect(result).toHaveLength(4);
  });
});

describe('partitionByPriority', () => {
  test('correctly partitions tabs into suspendable and blocked', () => {
    setPriority('g1', 't1', 'critical');
    setPriority('g1', 't3', 'high');
    const { suspendable, blocked } = partitionByPriority('g1', tabs);
    expect(blocked.map(t => t.id)).toEqual(expect.arrayContaining(['t1', 't3']));
    expect(suspendable.map(t => t.id)).toEqual(expect.arrayContaining(['t2', 't4']));
    expect(suspendable).toHaveLength(2);
    expect(blocked).toHaveLength(2);
  });
});
