const {
  sortTabs,
  sortTabsInGroup,
  getSortHistory,
  clearSortHistory,
  getSupportedSortFields,
} = require('./groupTabSorter');

const { getLastSortInfo, getSortSummary, getTabTitlesInOrder } = require('./groupTabSorterView');

const tabs = [
  { id: 3, title: 'Zephyr Docs', url: 'https://zephyr.io/docs' },
  { id: 1, title: 'Alpha Guide', url: 'https://alpha.com/guide' },
  { id: 2, title: 'Beta Overview', url: 'https://beta.org/overview' },
];

beforeEach(() => clearSortHistory());

describe('sortTabs', () => {
  test('sorts by title ascending', () => {
    const result = sortTabs(tabs, 'title', 'asc');
    expect(result[0].title).toBe('Alpha Guide');
    expect(result[2].title).toBe('Zephyr Docs');
  });

  test('sorts by title descending', () => {
    const result = sortTabs(tabs, 'title', 'desc');
    expect(result[0].title).toBe('Zephyr Docs');
  });

  test('sorts by domain ascending', () => {
    const result = sortTabs(tabs, 'domain', 'asc');
    expect(result[0].url).toContain('alpha.com');
  });

  test('sorts by tabId ascending', () => {
    const result = sortTabs(tabs, 'tabId', 'asc');
    expect(result[0].id).toBe(1);
    expect(result[2].id).toBe(3);
  });

  test('throws on unsupported field', () => {
    expect(() => sortTabs(tabs, 'color')).toThrow('Unsupported sort field');
  });

  test('throws on unsupported direction', () => {
    expect(() => sortTabs(tabs, 'title', 'random')).toThrow('Unsupported sort direction');
  });

  test('does not mutate original array', () => {
    const copy = [...tabs];
    sortTabs(tabs, 'title', 'asc');
    expect(tabs).toEqual(copy);
  });
});

describe('sortTabsInGroup', () => {
  test('records sort history', () => {
    sortTabsInGroup('g1', tabs, 'title', 'asc');
    const history = getSortHistory('g1');
    expect(history).toHaveLength(1);
    expect(history[0].field).toBe('title');
    expect(history[0].direction).toBe('asc');
    expect(history[0].count).toBe(3);
  });

  test('accumulates multiple sorts', () => {
    sortTabsInGroup('g1', tabs, 'title', 'asc');
    sortTabsInGroup('g1', tabs, 'domain', 'desc');
    expect(getSortHistory('g1')).toHaveLength(2);
  });
});

describe('getSupportedSortFields', () => {
  test('returns supported fields', () => {
    expect(getSupportedSortFields()).toContain('title');
    expect(getSupportedSortFields()).toContain('domain');
  });
});

describe('view helpers', () => {
  test('getLastSortInfo returns null for unsorted group', () => {
    expect(getLastSortInfo('unknown')).toBeNull();
  });

  test('getLastSortInfo returns last entry', () => {
    sortTabsInGroup('g2', tabs, 'url', 'asc');
    const info = getLastSortInfo('g2');
    expect(info.field).toBe('url');
  });

  test('getSortSummary returns mostUsedField', () => {
    sortTabsInGroup('g3', tabs, 'title', 'asc');
    sortTabsInGroup('g3', tabs, 'title', 'desc');
    sortTabsInGroup('g3', tabs, 'domain', 'asc');
    const summary = getSortSummary('g3');
    expect(summary.mostUsedField).toBe('title');
    expect(summary.totalSorts).toBe(3);
  });

  test('getTabTitlesInOrder maps titles', () => {
    const sorted = sortTabs(tabs, 'title', 'asc');
    const titles = getTabTitlesInOrder(sorted);
    expect(titles[0]).toBe('Alpha Guide');
  });
});
