const {
  isValidStatus,
  setStatus,
  getStatus,
  removeStatus,
  getStatusesForGroup,
  getTabsByStatus,
  getStatusCounts,
  clearStatuses,
  VALID_STATUSES
} = require('./groupTabStatusTracker');

beforeEach(() => {
  clearStatuses();
});

describe('isValidStatus', () => {
  test('returns true for valid statuses', () => {
    for (const s of VALID_STATUSES) {
      expect(isValidStatus(s)).toBe(true);
    }
  });

  test('returns false for invalid status', () => {
    expect(isValidStatus('unknown')).toBe(false);
    expect(isValidStatus('')).toBe(false);
  });
});

describe('setStatus / getStatus', () => {
  test('sets and retrieves a status', () => {
    setStatus('g1', 't1', 'active');
    const result = getStatus('g1', 't1');
    expect(result.status).toBe('active');
    expect(result.updatedAt).toBeDefined();
    expect(result.previous).toBeNull();
  });

  test('tracks previous status on update', () => {
    setStatus('g1', 't1', 'active');
    setStatus('g1', 't1', 'suspended');
    const result = getStatus('g1', 't1');
    expect(result.status).toBe('suspended');
    expect(result.previous.status).toBe('active');
  });

  test('throws for invalid status', () => {
    expect(() => setStatus('g1', 't1', 'invalid')).toThrow();
  });

  test('returns null for unknown tab', () => {
    expect(getStatus('g1', 'missing')).toBeNull();
  });
});

describe('removeStatus', () => {
  test('removes a tracked tab status', () => {
    setStatus('g1', 't1', 'frozen');
    removeStatus('g1', 't1');
    expect(getStatus('g1', 't1')).toBeNull();
  });
});

describe('getStatusesForGroup', () => {
  test('returns all statuses for a group', () => {
    setStatus('g1', 't1', 'active');
    setStatus('g1', 't2', 'suspended');
    setStatus('g2', 't3', 'frozen');
    const result = getStatusesForGroup('g1');
    expect(Object.keys(result)).toHaveLength(2);
    expect(result['t1'].status).toBe('active');
    expect(result['t2'].status).toBe('suspended');
  });
});

describe('getTabsByStatus', () => {
  test('returns tab ids matching given status in a group', () => {
    setStatus('g1', 't1', 'suspended');
    setStatus('g1', 't2', 'active');
    setStatus('g1', 't3', 'suspended');
    const suspended = getTabsByStatus('g1', 'suspended');
    expect(suspended).toHaveLength(2);
    expect(suspended).toContain('t1');
    expect(suspended).toContain('t3');
  });
});

describe('getStatusCounts', () => {
  test('returns correct counts per status', () => {
    setStatus('g1', 't1', 'active');
    setStatus('g1', 't2', 'active');
    setStatus('g1', 't3', 'frozen');
    const counts = getStatusCounts('g1');
    expect(counts.active).toBe(2);
    expect(counts.frozen).toBe(1);
    expect(counts.suspended).toBe(0);
  });
});
