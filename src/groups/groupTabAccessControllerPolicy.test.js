const { setPermissions, clearAll } = require('./groupTabAccessController');
const {
  isSuspensionBlocked,
  filterSuspendableTabs,
  partitionByAccess
} = require('./groupTabAccessControllerPolicy');

beforeEach(() => clearAll());

describe('isSuspensionBlocked', () => {
  it('returns false when no permissions set (no restriction)', () => {
    expect(isSuspensionBlocked('g1', 't1')).toBe(false);
  });
  it('returns true when suspend permission is absent', () => {
    setPermissions('g1', 't1', ['read', 'write']);
    expect(isSuspensionBlocked('g1', 't1')).toBe(true);
  });
  it('returns false when suspend permission is present', () => {
    setPermissions('g1', 't1', ['read', 'suspend']);
    expect(isSuspensionBlocked('g1', 't1')).toBe(false);
  });
});

describe('filterSuspendableTabs', () => {
  it('filters out tabs blocked from suspension', () => {
    setPermissions('g1', 't1', ['read']); // blocked
    setPermissions('g1', 't2', ['suspend']); // allowed
    const tabs = [{ id: 't1' }, { id: 't2' }, { id: 't3' }];
    const result = filterSuspendableTabs('g1', tabs);
    expect(result.map(t => t.id)).toEqual(expect.arrayContaining(['t2', 't3']));
    expect(result.map(t => t.id)).not.toContain('t1');
  });
  it('returns all tabs when none are restricted', () => {
    const tabs = [{ id: 't1' }, { id: 't2' }];
    expect(filterSuspendableTabs('g1', tabs)).toHaveLength(2);
  });
});

describe('partitionByAccess', () => {
  it('partitions tabs correctly', () => {
    setPermissions('g1', 't1', ['read']); // blocked
    setPermissions('g1', 't2', ['suspend']); // suspendable
    const tabs = [{ id: 't1' }, { id: 't2' }, { id: 't3' }];
    const { suspendable, blocked } = partitionByAccess('g1', tabs);
    expect(suspendable.map(t => t.id)).toEqual(expect.arrayContaining(['t2', 't3']));
    expect(blocked.map(t => t.id)).toEqual(['t1']);
  });
  it('returns empty blocked when no restrictions', () => {
    const tabs = [{ id: 't1' }];
    const { blocked } = partitionByAccess('g1', tabs);
    expect(blocked).toHaveLength(0);
  });
});
