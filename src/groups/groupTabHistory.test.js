const {
  isValidAction,
  recordTabEvent,
  getTabHistory,
  getTabHistoryByAction,
  getRecentEvents,
  getMostFrequentTab,
  clearTabHistory,
  clearAll
} = require('./groupTabHistory');

beforeEach(() => clearAll());

const tab1 = { id: 1, url: 'https://example.com', title: 'Example' };
const tab2 = { id: 2, url: 'https://other.com', title: 'Other' };

describe('isValidAction', () => {
  it('returns true for valid actions', () => {
    expect(isValidAction('opened')).toBe(true);
    expect(isValidAction('closed')).toBe(true);
    expect(isValidAction('moved_in')).toBe(true);
    expect(isValidAction('moved_out')).toBe(true);
  });

  it('returns false for invalid actions', () => {
    expect(isValidAction('deleted')).toBe(false);
    expect(isValidAction('')).toBe(false);
  });
});

describe('recordTabEvent', () => {
  it('records a tab event and returns the entry', () => {
    const entry = recordTabEvent('g1', tab1, 'opened');
    expect(entry).toMatchObject({ tabId: 1, url: 'https://example.com', action: 'opened' });
    expect(typeof entry.timestamp).toBe('number');
  });

  it('returns null for invalid action', () => {
    expect(recordTabEvent('g1', tab1, 'invalid')).toBeNull();
  });

  it('returns null for missing groupId or tab', () => {
    expect(recordTabEvent(null, tab1, 'opened')).toBeNull();
    expect(recordTabEvent('g1', null, 'opened')).toBeNull();
  });
});

describe('getTabHistory', () => {
  it('returns all events for a group', () => {
    recordTabEvent('g1', tab1, 'opened');
    recordTabEvent('g1', tab2, 'closed');
    expect(getTabHistory('g1')).toHaveLength(2);
  });

  it('returns empty array for unknown group', () => {
    expect(getTabHistory('unknown')).toEqual([]);
  });
});

describe('getTabHistoryByAction', () => {
  it('filters events by action', () => {
    recordTabEvent('g1', tab1, 'opened');
    recordTabEvent('g1', tab2, 'closed');
    const opened = getTabHistoryByAction('g1', 'opened');
    expect(opened).toHaveLength(1);
    expect(opened[0].action).toBe('opened');
  });

  it('returns empty array for invalid action', () => {
    expect(getTabHistoryByAction('g1', 'bad')).toEqual([]);
  });
});

describe('getRecentEvents', () => {
  it('returns the last N events', () => {
    for (let i = 0; i < 15; i++) {
      recordTabEvent('g1', { id: i, url: `https://site${i}.com`, title: `Site ${i}` }, 'opened');
    }
    expect(getRecentEvents('g1', 5)).toHaveLength(5);
  });
});

describe('getMostFrequentTab', () => {
  it('returns the tab with the most events', () => {
    recordTabEvent('g1', tab1, 'opened');
    recordTabEvent('g1', tab1, 'closed');
    recordTabEvent('g1', tab2, 'opened');
    const result = getMostFrequentTab('g1');
    expect(result.tabId).toBe(1);
    expect(result.count).toBe(2);
  });

  it('returns null for empty history', () => {
    expect(getMostFrequentTab('g1')).toBeNull();
  });
});

describe('clearTabHistory', () => {
  it('removes history for a specific group', () => {
    recordTabEvent('g1', tab1, 'opened');
    clearTabHistory('g1');
    expect(getTabHistory('g1')).toEqual([]);
  });
});
