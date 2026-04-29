const {
  isValidFlag,
  setFlag,
  unsetFlag,
  hasFlag,
  getFlags,
  getTabsWithFlag,
  getFlaggedTabsInGroup,
  clearFlags,
  clearAll,
  getSupportedFlags
} = require('./groupTabFlagManager');

beforeEach(() => clearAll());

const tabs = [
  { id: 'tab1', title: 'GitHub' },
  { id: 'tab2', title: 'Docs' },
  { id: 'tab3', title: 'Slack' }
];

test('isValidFlag returns true for supported flags', () => {
  expect(isValidFlag('important')).toBe(true);
  expect(isValidFlag('review')).toBe(true);
  expect(isValidFlag('unknown')).toBe(false);
});

test('setFlag and hasFlag work correctly', () => {
  setFlag('g1', 'tab1', 'important');
  expect(hasFlag('g1', 'tab1', 'important')).toBe(true);
  expect(hasFlag('g1', 'tab1', 'review')).toBe(false);
});

test('setFlag throws for invalid flag', () => {
  expect(() => setFlag('g1', 'tab1', 'bogus')).toThrow();
});

test('unsetFlag removes a flag', () => {
  setFlag('g1', 'tab1', 'important');
  unsetFlag('g1', 'tab1', 'important');
  expect(hasFlag('g1', 'tab1', 'important')).toBe(false);
});

test('getFlags returns all flags for a tab', () => {
  setFlag('g1', 'tab1', 'important');
  setFlag('g1', 'tab1', 'review');
  const result = getFlags('g1', 'tab1');
  expect(result).toContain('important');
  expect(result).toContain('review');
  expect(result).toHaveLength(2);
});

test('getFlags returns empty array for unflagged tab', () => {
  expect(getFlags('g1', 'tab99')).toEqual([]);
});

test('getTabsWithFlag filters correctly', () => {
  setFlag('g1', 'tab1', 'important');
  setFlag('g1', 'tab3', 'important');
  const result = getTabsWithFlag('g1', tabs, 'important');
  expect(result.map(t => t.id)).toEqual(['tab1', 'tab3']);
});

test('getFlaggedTabsInGroup returns only tabs with at least one flag', () => {
  setFlag('g1', 'tab2', 'review');
  const result = getFlaggedTabsInGroup('g1', tabs);
  expect(result).toHaveLength(1);
  expect(result[0].id).toBe('tab2');
});

test('clearFlags removes all flags for a tab', () => {
  setFlag('g1', 'tab1', 'important');
  clearFlags('g1', 'tab1');
  expect(getFlags('g1', 'tab1')).toEqual([]);
});

test('getSupportedFlags returns array of valid flags', () => {
  const supported = getSupportedFlags();
  expect(Array.isArray(supported)).toBe(true);
  expect(supported).toContain('important');
});
