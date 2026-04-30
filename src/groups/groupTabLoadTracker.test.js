const {
  isValidState,
  setLoadState,
  getLoadState,
  removeLoadState,
  getGroupLoadStates,
  getTabsByState,
  getLoadSummary,
  getAllLoadStates,
  clearLoadStates,
} = require('./groupTabLoadTracker');

beforeEach(() => clearLoadStates());

describe('isValidState', () => {
  it('accepts valid states', () => {
    expect(isValidState('loading')).toBe(true);
    expect(isValidState('complete')).toBe(true);
    expect(isValidState('error')).toBe(true);
    expect(isValidState('unloaded')).toBe(true);
  });

  it('rejects invalid states', () => {
    expect(isValidState('pending')).toBe(false);
    expect(isValidState('')).toBe(false);
  });
});

describe('setLoadState / getLoadState', () => {
  it('stores and retrieves a load state', () => {
    setLoadState('g1', 't1', 'loading');
    const record = getLoadState('g1', 't1');
    expect(record).not.toBeNull();
    expect(record.state).toBe('loading');
    expect(record.groupId).toBe('g1');
    expect(record.tabId).toBe('t1');
  });

  it('throws on invalid state', () => {
    expect(() => setLoadState('g1', 't1', 'unknown')).toThrow();
  });

  it('returns null for unknown tab', () => {
    expect(getLoadState('g1', 'missing')).toBeNull();
  });

  it('stores optional meta fields', () => {
    setLoadState('g1', 't2', 'error', { reason: 'timeout' });
    expect(getLoadState('g1', 't2').reason).toBe('timeout');
  });
});

describe('removeLoadState', () => {
  it('removes an existing record', () => {
    setLoadState('g1', 't1', 'complete');
    expect(removeLoadState('g1', 't1')).toBe(true);
    expect(getLoadState('g1', 't1')).toBeNull();
  });

  it('returns false when record does not exist', () => {
    expect(removeLoadState('g1', 'ghost')).toBe(false);
  });
});

describe('getGroupLoadStates', () => {
  it('returns all records for a group', () => {
    setLoadState('g1', 't1', 'complete');
    setLoadState('g1', 't2', 'loading');
    setLoadState('g2', 't3', 'error');
    expect(getGroupLoadStates('g1')).toHaveLength(2);
    expect(getGroupLoadStates('g2')).toHaveLength(1);
  });
});

describe('getTabsByState', () => {
  it('filters tabs by state within a group', () => {
    setLoadState('g1', 't1', 'complete');
    setLoadState('g1', 't2', 'complete');
    setLoadState('g1', 't3', 'error');
    expect(getTabsByState('g1', 'complete')).toHaveLength(2);
    expect(getTabsByState('g1', 'error')).toHaveLength(1);
    expect(getTabsByState('g1', 'loading')).toHaveLength(0);
  });
});

describe('getLoadSummary', () => {
  it('returns counts per state for a group', () => {
    setLoadState('g1', 't1', 'complete');
    setLoadState('g1', 't2', 'loading');
    setLoadState('g1', 't3', 'error');
    const summary = getLoadSummary('g1');
    expect(summary.total).toBe(3);
    expect(summary.complete).toBe(1);
    expect(summary.loading).toBe(1);
    expect(summary.error).toBe(1);
    expect(summary.unloaded).toBe(0);
  });
});

describe('getAllLoadStates', () => {
  it('returns all records across groups', () => {
    setLoadState('g1', 't1', 'complete');
    setLoadState('g2', 't2', 'loading');
    expect(getAllLoadStates()).toHaveLength(2);
  });
});
