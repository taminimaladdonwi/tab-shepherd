const {
  pinTab,
  unpinTab,
  isTabPinned,
  getPinInfo,
  getPinnedTabsInGroup,
  getAllPinnedTabs,
  getPinHistory,
  clearPinData,
  isValidReason
} = require('./groupTabPinTracker');

beforeEach(() => clearPinData());

describe('isValidReason', () => {
  it('accepts non-empty strings', () => {
    expect(isValidReason('manual')).toBe(true);
  });
  it('rejects empty strings', () => {
    expect(isValidReason('')).toBe(false);
  });
  it('rejects non-strings', () => {
    expect(isValidReason(null)).toBe(false);
  });
});

describe('pinTab', () => {
  it('pins a tab and returns entry', () => {
    const entry = pinTab('g1', 't1', 'important');
    expect(entry.groupId).toBe('g1');
    expect(entry.tabId).toBe('t1');
    expect(entry.reason).toBe('important');
    expect(entry.pinnedAt).toBeDefined();
  });

  it('uses default reason', () => {
    const entry = pinTab('g1', 't2');
    expect(entry.reason).toBe('manual');
  });

  it('throws on invalid reason', () => {
    expect(() => pinTab('g1', 't1', '')).toThrow('Invalid pin reason');
  });
});

describe('unpinTab', () => {
  it('unpins a pinned tab', () => {
    pinTab('g1', 't1');
    expect(unpinTab('g1', 't1')).toBe(true);
    expect(isTabPinned('g1', 't1')).toBe(false);
  });

  it('returns false for unpinned tab', () => {
    expect(unpinTab('g1', 'missing')).toBe(false);
  });
});

describe('getPinInfo', () => {
  it('returns pin info for pinned tab', () => {
    pinTab('g1', 't1', 'auto');
    const info = getPinInfo('g1', 't1');
    expect(info.reason).toBe('auto');
  });

  it('returns null for unpinned tab', () => {
    expect(getPinInfo('g1', 'none')).toBeNull();
  });
});

describe('getPinnedTabsInGroup', () => {
  it('returns only tabs in given group', () => {
    pinTab('g1', 't1');
    pinTab('g1', 't2');
    pinTab('g2', 't3');
    expect(getPinnedTabsInGroup('g1')).toHaveLength(2);
    expect(getPinnedTabsInGroup('g2')).toHaveLength(1);
  });
});

describe('getPinHistory', () => {
  it('records pin and unpin actions', () => {
    pinTab('g1', 't1');
    unpinTab('g1', 't1');
    const history = getPinHistory();
    expect(history).toHaveLength(2);
    expect(history[0].action).toBe('pin');
    expect(history[1].action).toBe('unpin');
  });
});

describe('getAllPinnedTabs', () => {
  it('returns all pinned tabs across groups', () => {
    pinTab('g1', 't1');
    pinTab('g2', 't2');
    expect(getAllPinnedTabs()).toHaveLength(2);
  });
});
