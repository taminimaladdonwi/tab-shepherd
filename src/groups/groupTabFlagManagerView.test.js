const { setFlag, clearAll } = require('./groupTabFlagManager');
const {
  getFlagSummary,
  getFlagDistribution,
  getMostFlaggedTab,
  getUnflaggedTabs
} = require('./groupTabFlagManagerView');

beforeEach(() => clearAll());

const tabs = [
  { id: 'tab1', title: 'GitHub' },
  { id: 'tab2', title: 'Docs' },
  { id: 'tab3', title: 'Slack' }
];

test('getFlagSummary counts tabs per flag', () => {
  setFlag('g1', 'tab1', 'important');
  setFlag('g1', 'tab2', 'important');
  setFlag('g1', 'tab3', 'review');
  const summary = getFlagSummary('g1', tabs);
  expect(summary.important).toBe(2);
  expect(summary.review).toBe(1);
  expect(summary.ignore).toBe(0);
});

test('getFlagDistribution returns correct counts', () => {
  setFlag('g1', 'tab1', 'important');
  setFlag('g1', 'tab1', 'review');
  setFlag('g1', 'tab2', 'important');
  const dist = getFlagDistribution('g1', tabs);
  expect(dist.important).toBe(2);
  expect(dist.review).toBe(1);
  expect(dist.ignore).toBeUndefined();
});

test('getMostFlaggedTab returns tab with most flags', () => {
  setFlag('g1', 'tab1', 'important');
  setFlag('g1', 'tab1', 'review');
  setFlag('g1', 'tab1', 'ignore');
  setFlag('g1', 'tab2', 'important');
  const result = getMostFlaggedTab('g1', tabs);
  expect(result).not.toBeNull();
  expect(result.tab.id).toBe('tab1');
  expect(result.flagCount).toBe(3);
});

test('getMostFlaggedTab returns null when no flags', () => {
  expect(getMostFlaggedTab('g1', tabs)).toBeNull();
});

test('getUnflaggedTabs returns tabs without any flags', () => {
  setFlag('g1', 'tab1', 'important');
  const unflagged = getUnflaggedTabs('g1', tabs);
  expect(unflagged.map(t => t.id)).toEqual(['tab2', 'tab3']);
});

test('getUnflaggedTabs returns all when none flagged', () => {
  expect(getUnflaggedTabs('g1', tabs)).toHaveLength(3);
});
