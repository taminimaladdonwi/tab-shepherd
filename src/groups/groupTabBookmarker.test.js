const {
  addBookmark,
  removeBookmark,
  isBookmarked,
  getBookmark,
  getBookmarksForGroup,
  getAllBookmarks,
  updateLabel,
  clearBookmarks
} = require('./groupTabBookmarker');

beforeEach(() => clearBookmarks());

const tab1 = { id: 'tab-1', url: 'https://example.com', title: 'Example' };
const tab2 = { id: 'tab-2', url: 'https://foo.com', title: 'Foo' };

describe('addBookmark', () => {
  test('adds a bookmark and returns entry', () => {
    const entry = addBookmark('g1', tab1, 'my label');
    expect(entry.tabId).toBe('tab-1');
    expect(entry.label).toBe('my label');
    expect(entry.groupId).toBe('g1');
  });

  test('allows empty label', () => {
    const entry = addBookmark('g1', tab1);
    expect(entry.label).toBe('');
  });

  test('throws if tab missing', () => {
    expect(() => addBookmark('g1', null)).toThrow();
  });
});

describe('isBookmarked / getBookmark', () => {
  test('returns true after bookmark added', () => {
    addBookmark('g1', tab1);
    expect(isBookmarked('g1', 'tab-1')).toBe(true);
  });

  test('returns false for unknown tab', () => {
    expect(isBookmarked('g1', 'tab-99')).toBe(false);
  });

  test('getBookmark returns entry', () => {
    addBookmark('g1', tab1, 'ref');
    const bm = getBookmark('g1', 'tab-1');
    expect(bm.label).toBe('ref');
  });

  test('getBookmark returns null if not found', () => {
    expect(getBookmark('g1', 'tab-99')).toBeNull();
  });
});

describe('removeBookmark', () => {
  test('removes existing bookmark', () => {
    addBookmark('g1', tab1);
    expect(removeBookmark('g1', 'tab-1')).toBe(true);
    expect(isBookmarked('g1', 'tab-1')).toBe(false);
  });

  test('returns false if not present', () => {
    expect(removeBookmark('g1', 'tab-99')).toBe(false);
  });
});

describe('getBookmarksForGroup', () => {
  test('returns only bookmarks for the given group', () => {
    addBookmark('g1', tab1);
    addBookmark('g2', tab2);
    const result = getBookmarksForGroup('g1');
    expect(result).toHaveLength(1);
    expect(result[0].tabId).toBe('tab-1');
  });
});

describe('updateLabel', () => {
  test('updates label of existing bookmark', () => {
    addBookmark('g1', tab1, 'old');
    expect(updateLabel('g1', 'tab-1', 'new')).toBe(true);
    expect(getBookmark('g1', 'tab-1').label).toBe('new');
  });

  test('returns false if bookmark not found', () => {
    expect(updateLabel('g1', 'tab-99', 'x')).toBe(false);
  });

  test('throws on empty label', () => {
    addBookmark('g1', tab1);
    expect(() => updateLabel('g1', 'tab-1', '')).toThrow();
  });
});

describe('getAllBookmarks', () => {
  test('returns all bookmarks across groups', () => {
    addBookmark('g1', tab1);
    addBookmark('g2', tab2);
    expect(getAllBookmarks()).toHaveLength(2);
  });
});
