const {
  isValidAction,
  recordAccess,
  getAccessLog,
  getLastAccess,
  getAccessCount,
  getAccessLogByAction,
  clearAccessLog,
  getAllAccessLogs,
} = require('./groupAccessLog');

beforeEach(() => {
  clearAccessLog();
});

describe('isValidAction', () => {
  it('returns true for valid actions', () => {
    expect(isValidAction('activated')).toBe(true);
    expect(isValidAction('focused')).toBe(true);
    expect(isValidAction('restored')).toBe(true);
    expect(isValidAction('created')).toBe(true);
  });

  it('returns false for unknown actions', () => {
    expect(isValidAction('deleted')).toBe(false);
    expect(isValidAction('')).toBe(false);
  });
});

describe('recordAccess', () => {
  it('records an access entry for a group', () => {
    const entry = recordAccess('g1', 'tab1', 'activated');
    expect(entry.tabId).toBe('tab1');
    expect(entry.action).toBe('activated');
    expect(typeof entry.timestamp).toBe('number');
  });

  it('throws if groupId is missing', () => {
    expect(() => recordAccess(null, 'tab1')).toThrow('groupId is required');
  });

  it('throws for invalid action', () => {
    expect(() => recordAccess('g1', 'tab1', 'unknown')).toThrow('Invalid action');
  });

  it('defaults action to activated', () => {
    const entry = recordAccess('g1', 'tab1');
    expect(entry.action).toBe('activated');
  });
});

describe('getAccessLog', () => {
  it('returns empty array for unknown group', () => {
    expect(getAccessLog('nope')).toEqual([]);
  });

  it('returns all entries for a group', () => {
    recordAccess('g1', 'tab1', 'activated');
    recordAccess('g1', 'tab2', 'focused');
    expect(getAccessLog('g1')).toHaveLength(2);
  });
});

describe('getLastAccess', () => {
  it('returns null for unknown group', () => {
    expect(getLastAccess('g1')).toBeNull();
  });

  it('returns the most recent entry', () => {
    recordAccess('g1', 'tab1', 'activated');
    recordAccess('g1', 'tab2', 'focused');
    const last = getLastAccess('g1');
    expect(last.action).toBe('focused');
  });
});

describe('getAccessCount', () => {
  it('returns 0 for unknown group', () => {
    expect(getAccessCount('g1')).toBe(0);
  });

  it('returns correct count', () => {
    recordAccess('g1', 'tab1');
    recordAccess('g1', 'tab2');
    expect(getAccessCount('g1')).toBe(2);
  });
});

describe('getAccessLogByAction', () => {
  it('filters entries by action', () => {
    recordAccess('g1', 'tab1', 'activated');
    recordAccess('g1', 'tab2', 'focused');
    recordAccess('g1', 'tab3', 'activated');
    const result = getAccessLogByAction('g1', 'activated');
    expect(result).toHaveLength(2);
  });
});

describe('clearAccessLog', () => {
  it('clears a specific group', () => {
    recordAccess('g1', 'tab1');
    recordAccess('g2', 'tab2');
    clearAccessLog('g1');
    expect(getAccessLog('g1')).toHaveLength(0);
    expect(getAccessLog('g2')).toHaveLength(1);
  });

  it('clears all logs when no groupId given', () => {
    recordAccess('g1', 'tab1');
    recordAccess('g2', 'tab2');
    clearAccessLog();
    expect(Object.keys(getAllAccessLogs())).toHaveLength(0);
  });
});
