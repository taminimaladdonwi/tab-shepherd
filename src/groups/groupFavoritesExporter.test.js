const { exportFavorites, importFavorites } = require('./groupFavoritesExporter');
const { addFavorite, isFavorite, getAllFavorites, clearFavorites } = require('./groupFavorites');

beforeEach(() => clearFavorites());

test('exportFavorites produces valid JSON with version and exportedAt', () => {
  addFavorite('g1', 'note1');
  const json = exportFavorites();
  const parsed = JSON.parse(json);
  expect(parsed).toHaveProperty('version', 1);
  expect(parsed).toHaveProperty('exportedAt');
  expect(parsed.favorites).toHaveProperty('g1');
});

test('importFavorites imports all favorites', () => {
  addFavorite('g1', 'note1');
  const json = exportFavorites();
  clearFavorites();
  const { imported, skipped } = importFavorites(json);
  expect(imported).toContain('g1');
  expect(skipped).toHaveLength(0);
  expect(isFavorite('g1')).toBe(true);
});

test('importFavorites with merge skips existing', () => {
  addFavorite('g1', 'original');
  const json = exportFavorites();
  clearFavorites();
  addFavorite('g1', 'existing');
  const { imported, skipped } = importFavorites(json, { merge: true });
  expect(skipped).toContain('g1');
  expect(imported).toHaveLength(0);
});

test('importFavorites without merge clears existing', () => {
  addFavorite('g2', 'old');
  const json = JSON.stringify({ version: 1, exportedAt: Date.now(), favorites: { 'g3': { note: 'x', addedAt: Date.now() } } });
  importFavorites(json);
  expect(isFavorite('g2')).toBe(false);
  expect(isFavorite('g3')).toBe(true);
});

test('importFavorites throws on invalid JSON', () => {
  expect(() => importFavorites('not-json')).toThrow('Invalid JSON');
});

test('importFavorites throws on missing favorites key', () => {
  expect(() => importFavorites(JSON.stringify({ version: 1 }))).toThrow('Missing or invalid favorites data');
});
