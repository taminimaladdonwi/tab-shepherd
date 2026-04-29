const {
  checkTabReadiness,
  checkGroupReadiness,
  getReadyTabs,
  getReadinessSummary,
} = require('./groupTabReadinessChecker');

jest.mock('./suspender', () => ({
  isSuspended: (url) => url && url.startsWith('suspended://'),
}));

jest.mock('./groupTabPrioritizer', () => ({
  getPriority: (groupId, tabId) => {
    const map = { 'tab-1': 3, 'tab-2': 1, 'tab-3': null };
    return map[tabId] ?? null;
  },
}));

jest.mock('./groupTabStatusTracker', () => ({
  getStatus: (groupId, tabId) => {
    const map = { 'tab-1': 'active', 'tab-2': 'idle', 'tab-3': null };
    return map[tabId] ?? null;
  },
}));

const GROUP_ID = 'group-1';

const tabs = [
  { id: 'tab-1', url: 'https://example.com', status: 'complete', title: 'Example' },
  { id: 'tab-2', url: 'https://other.com', status: 'loading', title: 'Other' },
  { id: 'tab-3', url: 'suspended://https://gone.com', status: 'complete', title: 'Gone' },
];

describe('checkTabReadiness', () => {
  it('marks a fully loaded, non-suspended tab as ready', () => {
    const result = checkTabReadiness(GROUP_ID, tabs[0]);
    expect(result.ready).toBe(true);
    expect(result.reasons).toHaveLength(0);
  });

  it('marks a loading tab as not ready', () => {
    const result = checkTabReadiness(GROUP_ID, tabs[1]);
    expect(result.ready).toBe(false);
    expect(result.reasons).toContain("tab status is 'loading', expected 'complete'");
  });

  it('marks a suspended tab as not ready when excludeSuspended is true', () => {
    const result = checkTabReadiness(GROUP_ID, tabs[2]);
    expect(result.ready).toBe(false);
    expect(result.reasons).toContain('tab is suspended');
  });

  it('allows suspended tabs when excludeSuspended is false', () => {
    const result = checkTabReadiness(GROUP_ID, tabs[2], { excludeSuspended: false });
    expect(result.ready).toBe(true);
  });

  it('respects minPriority option', () => {
    const result = checkTabReadiness(GROUP_ID, tabs[1], {
      requireLoaded: false,
      minPriority: 2,
    });
    expect(result.ready).toBe(false);
    expect(result.reasons.some((r) => r.includes('priority'))).toBe(true);
  });

  it('respects allowedStatuses option', () => {
    const result = checkTabReadiness(GROUP_ID, tabs[0], {
      allowedStatuses: ['idle'],
    });
    expect(result.ready).toBe(false);
    expect(result.reasons.some((r) => r.includes('active'))).toBe(true);
  });
});

describe('checkGroupReadiness', () => {
  it('returns a result for each tab', () => {
    const results = checkGroupReadiness(GROUP_ID, tabs);
    expect(results).toHaveLength(3);
    expect(results[0].tabId).toBe('tab-1');
  });
});

describe('getReadyTabs', () => {
  it('returns only ready tabs', () => {
    const ready = getReadyTabs(GROUP_ID, tabs);
    expect(ready).toHaveLength(1);
    expect(ready[0].id).toBe('tab-1');
  });
});

describe('getReadinessSummary', () => {
  it('returns correct counts and rate', () => {
    const summary = getReadinessSummary(GROUP_ID, tabs);
    expect(summary.total).toBe(3);
    expect(summary.readyCount).toBe(1);
    expect(summary.notReadyCount).toBe(2);
    expect(summary.readinessRate).toBeCloseTo(1 / 3);
  });

  it('returns rate of 0 for empty tab list', () => {
    const summary = getReadinessSummary(GROUP_ID, []);
    expect(summary.readinessRate).toBe(0);
  });
});
