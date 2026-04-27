const {
  addBookmark,
  clearBookmarks
} = require('./groupTabBookmarker');

const {
  getBookmarkSummary,
  getBookmarkedTabTitles,
  getMostBookmarkedGroup,
  getGroupsWithBookmarks
} = require('./groupTabBookmarkerView');

beforeEach(() => clearBookmarks());

const t1 = { id: 't1', url: 'https://a.com', title: 'Alpha' };
const t2 = { id: 't2', url: 'https://b.com', title: 'Beta' };
const t3 = { id: 't3', url: 'https://c.com', title: 'Gamma' };

describe('getBookmarkSummary', () => {
  test('returns counts for a group', () => {
    addBookmark('g1', t1, 'label-a');
    addBookmark('g1', t2);
    const summary = getBookmarkSummary('g1');
    expect(summary.total).toBe(2);
    expect(summary.labeled).toBe(1);
    expect(summary.unlabeled).toBe(1);
  });

  test('returns zeros for empty group', () => {
    const summary = getBookmarkSummary('g-empty');
    expect(summary.total).toBe(0);
  });
});

describe('getBookmarkedTabTitles', () => {
  test('returns titles of bookmarked tabs', () => {
    addBookmark('g1', t1);
    addBookmark('g1', t2);
    const titles = getBookmarkedTabTitles('g1');
    expect(titles).toContain('Alpha');
    expect(titles).toContain('Beta');
  });

  test('falls back to url if title missing', () => {
    addBookmark('g1', { id: 't9', url: 'https://x.com', title: '' });
    const titles = getBookmarkedTabTitles('g1');
    expect(titles).toContain('https://x.com');
  });
});

describe('getMostBookmarkedGroup', () => {
  test('returns group with most bookmarks', () => {
    addBookmark('g1', t1);
    addBookmark('g2', t2);
    addBookmark('g2', t3);
    const result = getMostBookmarkedGroup();
    expect(result.groupId).toBe('g2');
    expect(result.count).toBe(2);
  });

  test('returns null when no bookmarks exist', () => {
    expect(getMostBookmarkedGroup()).toBeNull();
  });
});

describe('getGroupsWithBookmarks', () => {
  test('returns unique group ids that have bookmarks', () => {
    addBookmark('g1', t1);
    addBookmark('g2', t2);
    addBookmark('g1', t3);
    const groups = getGroupsWithBookmarks();
    expect(groups).toHaveLength(2);
    expect(groups).toContain('g1');
    expect(groups).toContain('g2');
  });

  test('returns empty array when no bookmarks', () => {
    expect(getGroupsWithBookmarks()).toEqual([]);
  });
});
