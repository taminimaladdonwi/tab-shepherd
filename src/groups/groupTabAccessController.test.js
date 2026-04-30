const {
  isValidPermission,
  setPermissions,
  getPermissions,
  hasPermission,
  removePermissions,
  getGroupPermissions,
  getTabsWithPermission,
  clearAll
} = require('./groupTabAccessController');

beforeEach(() => clearAll());

describe('isValidPermission', () => {
  it('accepts valid permissions', () => {
    expect(isValidPermission('read')).toBe(true);
    expect(isValidPermission('write')).toBe(true);
    expect(isValidPermission('suspend')).toBe(true);
  });
  it('rejects invalid permissions', () => {
    expect(isValidPermission('delete')).toBe(false);
    expect(isValidPermission('')).toBe(false);
  });
});

describe('setPermissions / getPermissions', () => {
  it('stores and retrieves permissions', () => {
    setPermissions('g1', 't1', ['read', 'write']);
    const entry = getPermissions('g1', 't1');
    expect(entry.permissions).toEqual(expect.arrayContaining(['read', 'write']));
    expect(entry.groupId).toBe('g1');
    expect(entry.tabId).toBe('t1');
  });
  it('returns null for unknown tab', () => {
    expect(getPermissions('g1', 'unknown')).toBeNull();
  });
  it('throws on invalid permission', () => {
    expect(() => setPermissions('g1', 't1', ['admin'])).toThrow();
  });
  it('throws if groupId missing', () => {
    expect(() => setPermissions(null, 't1', ['read'])).toThrow();
  });
  it('deduplicates permissions', () => {
    setPermissions('g1', 't1', ['read', 'read']);
    expect(getPermissions('g1', 't1').permissions).toEqual(['read']);
  });
});

describe('hasPermission', () => {
  it('returns true when permission exists', () => {
    setPermissions('g1', 't1', ['suspend']);
    expect(hasPermission('g1', 't1', 'suspend')).toBe(true);
  });
  it('returns false when permission absent', () => {
    setPermissions('g1', 't1', ['read']);
    expect(hasPermission('g1', 't1', 'suspend')).toBe(false);
  });
  it('returns false for unknown tab', () => {
    expect(hasPermission('g1', 'nope', 'read')).toBe(false);
  });
});

describe('removePermissions', () => {
  it('removes entry', () => {
    setPermissions('g1', 't1', ['read']);
    removePermissions('g1', 't1');
    expect(getPermissions('g1', 't1')).toBeNull();
  });
});

describe('getGroupPermissions', () => {
  it('returns all entries for a group', () => {
    setPermissions('g1', 't1', ['read']);
    setPermissions('g1', 't2', ['write']);
    setPermissions('g2', 't3', ['read']);
    expect(getGroupPermissions('g1')).toHaveLength(2);
  });
});

describe('getTabsWithPermission', () => {
  it('returns tab ids with given permission', () => {
    setPermissions('g1', 't1', ['suspend']);
    setPermissions('g1', 't2', ['read']);
    expect(getTabsWithPermission('g1', 'suspend')).toEqual(['t1']);
  });
});
