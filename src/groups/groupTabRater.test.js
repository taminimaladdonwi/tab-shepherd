const {
  isValidRating,
  setRating,
  getRating,
  removeRating,
  getRatingsForGroup,
  getAverageRatingForGroup,
  getAllRatings,
  clearRatings
} = require('./groupTabRater');

beforeEach(() => clearRatings());

describe('isValidRating', () => {
  it('accepts integers 1-5', () => {
    [1, 2, 3, 4, 5].forEach(r => expect(isValidRating(r)).toBe(true));
  });
  it('rejects 0 and 6', () => {
    expect(isValidRating(0)).toBe(false);
    expect(isValidRating(6)).toBe(false);
  });
  it('rejects floats', () => {
    expect(isValidRating(3.5)).toBe(false);
  });
});

describe('setRating / getRating', () => {
  it('stores and retrieves a rating', () => {
    setRating('g1', 't1', 4, 'nice');
    const r = getRating('g1', 't1');
    expect(r.rating).toBe(4);
    expect(r.note).toBe('nice');
  });
  it('throws on invalid rating', () => {
    expect(() => setRating('g1', 't1', 6)).toThrow();
  });
  it('throws if groupId missing', () => {
    expect(() => setRating('', 't1', 3)).toThrow();
  });
  it('returns null for unknown key', () => {
    expect(getRating('g1', 'unknown')).toBeNull();
  });
});

describe('removeRating', () => {
  it('removes an existing rating', () => {
    setRating('g1', 't1', 3);
    expect(removeRating('g1', 't1')).toBe(true);
    expect(getRating('g1', 't1')).toBeNull();
  });
});

describe('getRatingsForGroup', () => {
  it('returns only ratings for the given group', () => {
    setRating('g1', 't1', 5);
    setRating('g1', 't2', 3);
    setRating('g2', 't3', 2);
    expect(getRatingsForGroup('g1')).toHaveLength(2);
  });
});

describe('getAverageRatingForGroup', () => {
  it('computes average correctly', () => {
    setRating('g1', 't1', 4);
    setRating('g1', 't2', 2);
    expect(getAverageRatingForGroup('g1')).toBe(3);
  });
  it('returns null when no ratings', () => {
    expect(getAverageRatingForGroup('none')).toBeNull();
  });
});

describe('getAllRatings', () => {
  it('returns all stored ratings', () => {
    setRating('g1', 't1', 1);
    setRating('g2', 't2', 5);
    expect(getAllRatings()).toHaveLength(2);
  });
});
