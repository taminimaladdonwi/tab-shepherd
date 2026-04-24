import {
  normalizeUrl,
  findDuplicateTabs,
  findDuplicatesInGroup,
  getDuplicateSummary,
} from './groupDuplicateFinder.js';
import { getAllGroups } from './manager.js';

jest.mock('./manager.js');

const mockGroups = {
  g1: {
    tabs: [
      { id: 't1', url: 'https://example.com/page' },
      { id: 't2', url: 'https://example.com/page/' },
      { id: 't3', url: 'https://other.com' },
    ],
  },
  g2: {
    tabs: [
      { id: 't4', url: 'https://other.com' },
      { id: 't5', url: 'https://unique.com' },
    ],
  },
};

beforeEach(() => {
  getAllGroups.mockReturnValue(mockGroups);
});

describe('normalizeUrl', () => {
  it('strips trailing slash', () => {
    expect(normalizeUrl('https://example.com/page/')).toBe('https://example.com/page');
  });

  it('strips fragment', () => {
    expect(normalizeUrl('https://example.com/page#section')).toBe('https://example.com/page');
  });

  it('lowercases the url', () => {
    expect(normalizeUrl('https://Example.COM/Page')).toBe('https://example.com/page');
  });

  it('handles invalid urls gracefully', () => {
    expect(normalizeUrl('not-a-url')).toBe('not-a-url');
  });
});

describe('findDuplicateTabs', () => {
  it('finds cross-group duplicates', () => {
    const dupes = findDuplicateTabs();
    expect(Object.keys(dupes).length).toBeGreaterThan(0);
    const otherKey = 'https://other.com';
    expect(dupes[otherKey]).toBeDefined();
    expect(dupes[otherKey].length).toBe(2);
  });

  it('includes group and tab info in results', () => {
    const dupes = findDuplicateTabs();
    const entry = dupes['https://other.com'][0];
    expect(entry).toHaveProperty('groupId');
    expect(entry).toHaveProperty('tabId');
  });
});

describe('findDuplicatesInGroup', () => {
  it('finds duplicates within a group', () => {
    const dupes = findDuplicatesInGroup('g1');
    const key = 'https://example.com/page';
    expect(dupes[key]).toBeDefined();
    expect(dupes[key].length).toBe(2);
  });

  it('returns empty object for unknown group', () => {
    expect(findDuplicatesInGroup('unknown')).toEqual({});
  });

  it('ignores unique tabs', () => {
    const dupes = findDuplicatesInGroup('g2');
    expect(Object.keys(dupes).length).toBe(0);
  });
});

describe('getDuplicateSummary', () => {
  it('returns only groups with duplicates', () => {
    const summary = getDuplicateSummary();
    const ids = summary.map((s) => s.groupId);
    expect(ids).toContain('g1');
    expect(ids).not.toContain('g2');
  });

  it('includes correct counts', () => {
    const summary = getDuplicateSummary();
    const g1 = summary.find((s) => s.groupId === 'g1');
    expect(g1.duplicateUrlCount).toBe(1);
    expect(g1.totalDuplicateTabs).toBe(2);
  });
});
