const {
  setLimit,
  removeLimit,
  getLimit,
  checkLimit,
  getViolations,
  getAllLimits,
  clearAll
} = require('./groupLimiter');

beforeEach(() => {
  clearAll();
});

describe('setLimit / getLimit', () => {
  test('sets and retrieves a limit for a group', () => {
    setLimit('group-1', 5);
    expect(getLimit('group-1')).toBe(5);
  });

  test('returns null for groups with no limit', () => {
    expect(getLimit('group-unknown')).toBeNull();
  });

  test('throws if maxTabs is not a positive number', () => {
    expect(() => setLimit('group-1', 0)).toThrow();
    expect(() => setLimit('group-1', -3)).toThrow();
    expect(() => setLimit('group-1', 'five')).toThrow();
  });
});

describe('removeLimit', () => {
  test('removes the limit for a group', () => {
    setLimit('group-1', 10);
    removeLimit('group-1');
    expect(getLimit('group-1')).toBeNull();
  });

  test('does not throw when removing a non-existent limit', () => {
    expect(() => removeLimit('group-none')).not.toThrow();
  });
});

describe('checkLimit', () => {
  test('allows when no limit is set', () => {
    const result = checkLimit('group-1', 100);
    expect(result.allowed).toBe(true);
    expect(result.limit).toBeNull();
  });

  test('allows when current count is below the limit', () => {
    setLimit('group-1', 5);
    const result = checkLimit('group-1', 4);
    expect(result.allowed).toBe(true);
  });

  test('denies when current count equals the limit', () => {
    setLimit('group-1', 5);
    const result = checkLimit('group-1', 5);
    expect(result.allowed).toBe(false);
  });

  test('records a violation when limit is exceeded', () => {
    setLimit('group-1', 3);
    checkLimit('group-1', 3);
    const violations = getViolations();
    expect(violations).toHaveLength(1);
    expect(violations[0].groupId).toBe('group-1');
    expect(violations[0].limit).toBe(3);
    expect(violations[0].current).toBe(3);
  });
});

describe('getAllLimits', () => {
  test('returns all configured limits', () => {
    setLimit('group-a', 4);
    setLimit('group-b', 8);
    const all = getAllLimits();
    expect(all).toHaveLength(2);
    expect(all).toContainEqual({ groupId: 'group-a', limit: 4 });
    expect(all).toContainEqual({ groupId: 'group-b', limit: 8 });
  });

  test('returns empty array when no limits are set', () => {
    expect(getAllLimits()).toEqual([]);
  });
});
