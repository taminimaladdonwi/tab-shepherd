const {
  addFavorite,
  removeFavorite,
  isFavorite,
  getFavorite,
  getAllFavorites,
  updateNote,
  getFavoritesSortedByDate,
  clearFavorites
} = require('./groupFavorites');

beforeEach(() => clearFavorites());

test('addFavorite adds a group', () => {
  const result = addFavorite('g1', 'my note');
  expect(result).toBe(true);
  expect(isFavorite('g1')).toBe(true);
});

test('addFavorite returns false if already favorited', () => {
  addFavorite('g1');
  expect(addFavorite('g1')).toBe(false);
});

test('addFavorite throws without groupId', () => {
  expect(() => addFavorite()).toThrow('groupId is required');
});

test('removeFavorite removes a group', () => {
  addFavorite('g1');
  expect(removeFavorite('g1')).toBe(true);
  expect(isFavorite('g1')).toBe(false);
});

test('removeFavorite returns false for unknown group', () => {
  expect(removeFavorite('unknown')).toBe(false);
});

test('getFavorite returns entry with note and addedAt', () => {
  addFavorite('g1', 'test note');
  const entry = getFavorite('g1');
  expect(entry).toHaveProperty('note', 'test note');
  expect(entry).toHaveProperty('addedAt');
});

test('getFavorite returns null for unknown group', () => {
  expect(getFavorite('nope')).toBeNull();
});

test('getAllFavorites returns all entries', () => {
  addFavorite('g1');
  addFavorite('g2');
  const all = getAllFavorites();
  expect(Object.keys(all)).toHaveLength(2);
});

test('updateNote updates the note', () => {
  addFavorite('g1', 'old');
  expect(updateNote('g1', 'new')).toBe(true);
  expect(getFavorite('g1').note).toBe('new');
});

test('updateNote returns false for unknown group', () => {
  expect(updateNote('nope', 'x')).toBe(false);
});

test('getFavoritesSortedByDate returns sorted list', () => {
  addFavorite('g1');
  addFavorite('g2');
  const sorted = getFavoritesSortedByDate();
  expect(sorted[0].groupId).toBe('g1');
  expect(sorted[1].groupId).toBe('g2');
});
