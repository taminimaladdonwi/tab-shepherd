const {
  isValidTag,
  setTabTags,
  addTabTag,
  removeTabTag,
  getTabTags,
  hasTabTag,
  getTabsByTag,
  getAllTabTagsInGroup,
  clearTabTags,
  clearAll
} = require('./groupTabTagger');

beforeEach(() => clearAll());

test('isValidTag rejects empty and non-string values', () => {
  expect(isValidTag('')).toBe(false);
  expect(isValidTag('  ')).toBe(false);
  expect(isValidTag(null)).toBe(false);
  expect(isValidTag('work')).toBe(true);
});

test('setTabTags stores and returns valid tags', () => {
  const result = setTabTags('g1', 't1', ['work', 'urgent', '']);
  expect(result).toEqual(['work', 'urgent']);
  expect(getTabTags('g1', 't1')).toEqual(['work', 'urgent']);
});

test('addTabTag appends a tag', () => {
  addTabTag('g1', 't1', 'work');
  addTabTag('g1', 't1', 'focus');
  expect(getTabTags('g1', 't1')).toContain('work');
  expect(getTabTags('g1', 't1')).toContain('focus');
});

test('addTabTag throws on invalid tag', () => {
  expect(() => addTabTag('g1', 't1', '')).toThrow();
});

test('removeTabTag removes an existing tag', () => {
  setTabTags('g1', 't1', ['a', 'b']);
  const removed = removeTabTag('g1', 't1', 'a');
  expect(removed).toBe(true);
  expect(getTabTags('g1', 't1')).toEqual(['b']);
});

test('removeTabTag returns false for missing key', () => {
  expect(removeTabTag('g99', 't99', 'x')).toBe(false);
});

test('hasTabTag returns correct boolean', () => {
  setTabTags('g1', 't2', ['news']);
  expect(hasTabTag('g1', 't2', 'news')).toBe(true);
  expect(hasTabTag('g1', 't2', 'other')).toBe(false);
});

test('getTabsByTag filters tabs correctly', () => {
  const tabs = [{ id: 't1' }, { id: 't2' }, { id: 't3' }];
  setTabTags('g1', 't1', ['dev']);
  setTabTags('g1', 't3', ['dev', 'urgent']);
  const result = getTabsByTag('g1', tabs, 'dev');
  expect(result.map(t => t.id)).toEqual(['t1', 't3']);
});

test('getAllTabTagsInGroup returns only tagged tabs', () => {
  const tabs = [{ id: 't1' }, { id: 't2' }];
  setTabTags('g1', 't1', ['x']);
  const all = getAllTabTagsInGroup('g1', tabs);
  expect(Object.keys(all)).toEqual(['t1']);
  expect(all['t1']).toEqual(['x']);
});

test('clearTabTags removes tags for a specific tab', () => {
  setTabTags('g1', 't1', ['a', 'b']);
  clearTabTags('g1', 't1');
  expect(getTabTags('g1', 't1')).toEqual([]);
});
