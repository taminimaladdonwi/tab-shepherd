const { setTabTags, clearAll } = require('./groupTabTagger');
const {
  getTagSummary,
  getMostTaggedTab,
  getUntaggedTabs,
  getTabsWithTag
} = require('./groupTabTaggerView');

const tabs = [
  { id: 't1', title: 'GitHub' },
  { id: 't2', title: 'Docs' },
  { id: 't3', title: 'Slack' }
];

beforeEach(() => {
  clearAll();
  setTabTags('g1', 't1', ['work', 'dev']);
  setTabTags('g1', 't2', ['work']);
  // t3 intentionally untagged
});

test('getTagSummary returns correct counts', () => {
  const summary = getTagSummary('g1', tabs);
  expect(summary.totalTaggedTabs).toBe(2);
  expect(summary.uniqueTags).toContain('work');
  expect(summary.uniqueTags).toContain('dev');
  expect(summary.tagFrequency['work']).toBe(2);
  expect(summary.tagFrequency['dev']).toBe(1);
  expect(summary.totalTags).toBe(3);
});

test('getMostTaggedTab returns tab with most tags', () => {
  const result = getMostTaggedTab('g1', tabs);
  expect(result.tab.id).toBe('t1');
  expect(result.tags).toContain('work');
  expect(result.tags).toContain('dev');
});

test('getMostTaggedTab returns null when no tags', () => {
  clearAll();
  expect(getMostTaggedTab('g1', tabs)).toBeNull();
});

test('getUntaggedTabs returns tabs without tags', () => {
  const untagged = getUntaggedTabs('g1', tabs);
  expect(untagged.map(t => t.id)).toEqual(['t3']);
});

test('getTabsWithTag returns matching tabs with title', () => {
  const result = getTabsWithTag('g1', tabs, 'work');
  expect(result).toHaveLength(2);
  expect(result.map(r => r.tabId)).toContain('t1');
  expect(result.map(r => r.tabId)).toContain('t2');
  expect(result[0]).toHaveProperty('title');
});

test('getTabsWithTag returns empty for unknown tag', () => {
  expect(getTabsWithTag('g1', tabs, 'nonexistent')).toEqual([]);
});
