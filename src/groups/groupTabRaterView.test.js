const { setRating, clearRatings } = require('./groupTabRater');
const {
  getRatingSummary,
  getTopRatedTabs,
  getGroupsWithLowRatings,
  getUnratedGroups
} = require('./groupTabRaterView');

beforeEach(() => clearRatings());

describe('getRatingSummary', () => {
  it('returns correct totals and distribution', () => {
    setRating('g1', 't1', 5);
    setRating('g1', 't2', 3);
    setRating('g1', 't3', 5);
    const summary = getRatingSummary('g1');
    expect(summary.totalRated).toBe(3);
    expect(summary.averageRating).toBeCloseTo(4.33, 1);
    expect(summary.distribution[5]).toBe(2);
    expect(summary.distribution[3]).toBe(1);
    expect(summary.distribution[1]).toBe(0);
  });
  it('handles group with no ratings', () => {
    const summary = getRatingSummary('empty');
    expect(summary.totalRated).toBe(0);
    expect(summary.averageRating).toBeNull();
  });
});

describe('getTopRatedTabs', () => {
  it('returns tabs sorted by rating descending', () => {
    setRating('g1', 't1', 2);
    setRating('g1', 't2', 5);
    setRating('g1', 't3', 4);
    const top = getTopRatedTabs('g1', 2);
    expect(top[0].tabId).toBe('t2');
    expect(top[1].tabId).toBe('t3');
  });
});

describe('getGroupsWithLowRatings', () => {
  it('identifies groups with average at or below threshold', () => {
    setRating('g1', 't1', 1);
    setRating('g1', 't2', 2);
    setRating('g2', 't3', 4);
    setRating('g2', 't4', 5);
    const low = getGroupsWithLowRatings(2);
    expect(low).toContain('g1');
    expect(low).not.toContain('g2');
  });
});

describe('getUnratedGroups', () => {
  it('returns groups that have no ratings', () => {
    setRating('g1', 't1', 3);
    const unrated = getUnratedGroups(['g1', 'g2', 'g3']);
    expect(unrated).toEqual(['g2', 'g3']);
  });
});
