import {
  recordTabUsage,
  getTabUsage,
  getGroupUsage,
  getMostUsedTab,
  getLeastUsedTabs,
  getUsageSummary,
  clearGroupUsage,
  clearAllUsage
} from './groupTabUsageTracker.js';

beforeEach(() => {
  clearAllUsage();
});

describe('recordTabUsage', () => {
  it('throws if groupId or tabId is missing', () => {
    expect(() => recordTabUsage(null, 1)).toThrow();
    expect(() => recordTabUsage('g1', null)).toThrow();
  });

  it('increments count on repeated calls', () => {
    recordTabUsage('g1', 1);
    recordTabUsage('g1', 1);
    recordTabUsage('g1', 1);
    expect(getTabUsage('g1', 1).count).toBe(3);
  });

  it('sets lastAccessed timestamp', () => {
    const before = Date.now();
    recordTabUsage('g1', 2);
    expect(getTabUsage('g1', 2).lastAccessed).toBeGreaterThanOrEqual(before);
  });
});

describe('getTabUsage', () => {
  it('returns null for untracked tab', () => {
    expect(getTabUsage('g1', 99)).toBeNull();
  });
});

describe('getGroupUsage', () => {
  it('returns all tab entries for a group', () => {
    recordTabUsage('g1', 1);
    recordTabUsage('g1', 2);
    recordTabUsage('g2', 3);
    const usage = getGroupUsage('g1');
    expect(usage).toHaveLength(2);
    expect(usage.map(e => e.tabId)).toContain(1);
    expect(usage.map(e => e.tabId)).toContain(2);
  });
});

describe('getMostUsedTab', () => {
  it('returns null for empty group', () => {
    expect(getMostUsedTab('g99')).toBeNull();
  });

  it('returns the tab with highest count', () => {
    recordTabUsage('g1', 1);
    recordTabUsage('g1', 2);
    recordTabUsage('g1', 2);
    expect(getMostUsedTab('g1').tabId).toBe(2);
  });
});

describe('getLeastUsedTabs', () => {
  it('returns tabs at or below threshold', () => {
    recordTabUsage('g1', 1);
    recordTabUsage('g1', 2);
    recordTabUsage('g1', 2);
    const least = getLeastUsedTabs('g1', 1);
    expect(least.map(e => e.tabId)).toContain(1);
    expect(least.map(e => e.tabId)).not.toContain(2);
  });
});

describe('getUsageSummary', () => {
  it('returns zeroed summary for unknown group', () => {
    expect(getUsageSummary('g99')).toEqual({ total: 0, unique: 0, average: 0 });
  });

  it('calculates total, unique, and average', () => {
    recordTabUsage('g1', 1);
    recordTabUsage('g1', 1);
    recordTabUsage('g1', 2);
    const s = getUsageSummary('g1');
    expect(s.total).toBe(3);
    expect(s.unique).toBe(2);
    expect(s.average).toBe(1.5);
  });
});

describe('clearGroupUsage', () => {
  it('removes only the specified group entries', () => {
    recordTabUsage('g1', 1);
    recordTabUsage('g2', 2);
    clearGroupUsage('g1');
    expect(getTabUsage('g1', 1)).toBeNull();
    expect(getTabUsage('g2', 2)).not.toBeNull();
  });
});
