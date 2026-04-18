const { createGroup, addTabToGroup, clearGroups } = require('./manager');
const { archiveGroup, clearArchived } = require('./groupArchiver');
const { setTags } = require('./tagger');
const {
  getGroupTabCount,
  getTotalTabCount,
  getAverageTabsPerGroup,
  getLargestGroup,
  getGroupSummary,
  getActiveGroupCount
} = require('./groupStats');

function setup() {
  clearGroups();
  clearArchived();
  const g1 = createGroup('Alpha');
  const g2 = createGroup('Beta');
  addTabToGroup(g1.id, { id: 1, url: 'https://a.com' });
  addTabToGroup(g1.id, { id: 2, url: 'https://b.com' });
  addTabToGroup(g2.id, { id: 3, url: 'https://c.com' });
  setTags(g1.id, ['work']);
  return { g1, g2 };
}

test('getGroupTabCount returns correct count', () => {
  const { g1 } = setup();
  expect(getGroupTabCount(g1.id)).toBe(2);
});

test('getTotalTabCount sums all tabs', () => {
  setup();
  expect(getTotalTabCount()).toBe(3);
});

test('getAverageTabsPerGroup returns average', () => {
  setup();
  expect(getAverageTabsPerGroup()).toBeCloseTo(1.5);
});

test('getLargestGroup returns group with most tabs', () => {
  const { g1 } = setup();
  const largest = getLargestGroup();
  expect(largest.id).toBe(g1.id);
});

test('getGroupSummary includes tags and archived status', () => {
  const { g1, g2 } = setup();
  archiveGroup(g2.id);
  const summary = getGroupSummary();
  const s1 = summary.find(s => s.id === g1.id);
  const s2 = summary.find(s => s.id === g2.id);
  expect(s1.tags).toContain('work');
  expect(s1.archived).toBe(false);
  expect(s2.archived).toBe(true);
});

test('getActiveGroupCount excludes archived groups', () => {
  const { g2 } = setup();
  archiveGroup(g2.id);
  expect(getActiveGroupCount()).toBe(1);
});

test('getLargestGroup returns null when no groups', () => {
  clearGroups();
  expect(getLargestGroup()).toBeNull();
});
