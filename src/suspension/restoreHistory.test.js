import {
  recordRestore,
  getRestoreHistory,
  getLastRestore,
  getRestoresByGroup,
  clearRestoreHistory
} from './restoreHistory.js';

beforeEach(() => {
  clearRestoreHistory();
});

const mockRestore = (overrides = {}) => ({
  tabId: 1,
  url: 'https://example.com',
  groupId: 'group-1',
  restoredAt: Date.now(),
  ...overrides
});

describe('recordRestore', () => {
  it('adds a restore entry to history', () => {
    recordRestore(mockRestore());
    expect(getRestoreHistory()).toHaveLength(1);
  });

  it('stores multiple restores', () => {
    recordRestore(mockRestore({ tabId: 1 }));
    recordRestore(mockRestore({ tabId: 2 }));
    expect(getRestoreHistory()).toHaveLength(2);
  });
});

describe('getLastRestore', () => {
  it('returns null when history is empty', () => {
    expect(getLastRestore()).toBeNull();
  });

  it('returns the most recently recorded restore', () => {
    recordRestore(mockRestore({ tabId: 1, restoredAt: 1000 }));
    recordRestore(mockRestore({ tabId: 2, restoredAt: 2000 }));
    expect(getLastRestore().tabId).toBe(2);
  });
});

describe('getRestoresByGroup', () => {
  it('returns only restores matching the given groupId', () => {
    recordRestore(mockRestore({ tabId: 1, groupId: 'group-1' }));
    recordRestore(mockRestore({ tabId: 2, groupId: 'group-2' }));
    recordRestore(mockRestore({ tabId: 3, groupId: 'group-1' }));
    const result = getRestoresByGroup('group-1');
    expect(result).toHaveLength(2);
    expect(result.every(r => r.groupId === 'group-1')).toBe(true);
  });

  it('returns empty array when no restores match', () => {
    expect(getRestoresByGroup('nonexistent')).toEqual([]);
  });
});

describe('clearRestoreHistory', () => {
  it('removes all restore records', () => {
    recordRestore(mockRestore());
    clearRestoreHistory();
    expect(getRestoreHistory()).toHaveLength(0);
  });
});
