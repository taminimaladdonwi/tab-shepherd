const {
  pinGroup,
  unpinGroup,
  isPinned,
  getPinInfo,
  getAllPinned,
  filterOutPinned,
  clearPinned
} = require('./groupPinner');

beforeEach(() => {
  clearPinned();
});

describe('pinGroup', () => {
  it('pins a group and returns entry with metadata', () => {
    const result = pinGroup('g1', 'important');
    expect(result.groupId).toBe('g1');
    expect(result.reason).toBe('important');
    expect(typeof result.pinnedAt).toBe('number');
  });

  it('uses empty string as default reason', () => {
    const result = pinGroup('g2');
    expect(result.reason).toBe('');
  });

  it('throws if groupId is missing', () => {
    expect(() => pinGroup()).toThrow('groupId is required');
  });
});

describe('unpinGroup', () => {
  it('returns true when unpinning a pinned group', () => {
    pinGroup('g1');
    expect(unpinGroup('g1')).toBe(true);
  });

  it('returns false when group was not pinned', () => {
    expect(unpinGroup('nonexistent')).toBe(false);
  });

  it('makes the group no longer pinned', () => {
    pinGroup('g1');
    unpinGroup('g1');
    expect(isPinned('g1')).toBe(false);
  });
});

describe('isPinned', () => {
  it('returns true for a pinned group', () => {
    pinGroup('g1');
    expect(isPinned('g1')).toBe(true);
  });

  it('returns false for an unpinned group', () => {
    expect(isPinned('g99')).toBe(false);
  });
});

describe('getPinInfo', () => {
  it('returns pin metadata for a pinned group', () => {
    pinGroup('g1', 'keep alive');
    const info = getPinInfo('g1');
    expect(info).not.toBeNull();
    expect(info.reason).toBe('keep alive');
  });

  it('returns null for an unpinned group', () => {
    expect(getPinInfo('g99')).toBeNull();
  });
});

describe('getAllPinned', () => {
  it('returns all pinned group IDs', () => {
    pinGroup('g1');
    pinGroup('g2');
    const all = getAllPinned();
    expect(all).toContain('g1');
    expect(all).toContain('g2');
    expect(all).toHaveLength(2);
  });

  it('returns empty array when nothing is pinned', () => {
    expect(getAllPinned()).toEqual([]);
  });
});

describe('filterOutPinned', () => {
  it('removes pinned groups from the list', () => {
    pinGroup('g1');
    const result = filterOutPinned(['g1', 'g2', 'g3']);
    expect(result).toEqual(['g2', 'g3']);
  });

  it('returns all groups when none are pinned', () => {
    const result = filterOutPinned(['g1', 'g2']);
    expect(result).toEqual(['g1', 'g2']);
  });
});
