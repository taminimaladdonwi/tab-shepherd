const {
  pinTab,
  clearPinData
} = require('./groupTabPinTracker');

const {
  getPinSummary,
  getMostPinnedGroup,
  getGroupsWithPinnedTabs,
  getUnpinnedGroups,
  getPinReasonDistribution
} = require('./groupTabPinTrackerView');

beforeEach(() => clearPinData());

function setup() {
  pinTab('g1', 't1', 'important');
  pinTab('g1', 't2', 'manual');
  pinTab('g2', 't3', 'important');
}

describe('getPinSummary', () => {
  it('returns correct count and tabIds', () => {
    setup();
    const summary = getPinSummary('g1');
    expect(summary.groupId).toBe('g1');
    expect(summary.pinnedCount).toBe(2);
    expect(summary.tabIds).toContain('t1');
    expect(summary.tabIds).toContain('t2');
  });

  it('returns unique reasons', () => {
    setup();
    const summary = getPinSummary('g1');
    expect(summary.reasons).toContain('important');
    expect(summary.reasons).toContain('manual');
    expect(summary.reasons).toHaveLength(2);
  });

  it('returns empty summary for group with no pins', () => {
    const summary = getPinSummary('g99');
    expect(summary.pinnedCount).toBe(0);
  });
});

describe('getMostPinnedGroup', () => {
  it('returns the group with most pins', () => {
    setup();
    const result = getMostPinnedGroup(['g1', 'g2']);
    expect(result.groupId).toBe('g1');
    expect(result.pinnedCount).toBe(2);
  });

  it('returns null for empty group list', () => {
    expect(getMostPinnedGroup([])).toBeNull();
  });
});

describe('getGroupsWithPinnedTabs', () => {
  it('filters groups that have at least one pin', () => {
    setup();
    const result = getGroupsWithPinnedTabs(['g1', 'g2', 'g3']);
    expect(result).toContain('g1');
    expect(result).toContain('g2');
    expect(result).not.toContain('g3');
  });
});

describe('getUnpinnedGroups', () => {
  it('returns groups with no pinned tabs', () => {
    setup();
    const result = getUnpinnedGroups(['g1', 'g2', 'g3']);
    expect(result).toEqual(['g3']);
  });
});

describe('getPinReasonDistribution', () => {
  it('counts occurrences per reason', () => {
    setup();
    const dist = getPinReasonDistribution();
    expect(dist['important']).toBe(2);
    expect(dist['manual']).toBe(1);
  });

  it('returns empty object when no pins', () => {
    expect(getPinReasonDistribution()).toEqual({});
  });
});
