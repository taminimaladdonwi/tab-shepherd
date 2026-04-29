const {
  isValidScore,
  setScore,
  getScore,
  removeScore,
  computeScore,
  scoreTabsInGroup,
  getGroupScores,
  getScoreHistory,
  clearScores
} = require('./groupTabScorer');

beforeEach(() => clearScores());

describe('isValidScore', () => {
  it('accepts zero and positive numbers', () => {
    expect(isValidScore(0)).toBe(true);
    expect(isValidScore(0.75)).toBe(true);
    expect(isValidScore(1)).toBe(true);
  });
  it('rejects negative, NaN, Infinity', () => {
    expect(isValidScore(-1)).toBe(false);
    expect(isValidScore(NaN)).toBe(false);
    expect(isValidScore(Infinity)).toBe(false);
  });
});

describe('setScore / getScore', () => {
  it('stores and retrieves a score', () => {
    setScore('g1', 't1', 0.8);
    expect(getScore('g1', 't1')).toBe(0.8);
  });
  it('returns null for unknown tab', () => {
    expect(getScore('g1', 'unknown')).toBeNull();
  });
  it('throws on invalid score', () => {
    expect(() => setScore('g1', 't1', -1)).toThrow();
  });
  it('throws on missing ids', () => {
    expect(() => setScore(null, 't1', 0.5)).toThrow();
  });
});

describe('removeScore', () => {
  it('removes an existing score', () => {
    setScore('g1', 't1', 0.5);
    expect(removeScore('g1', 't1')).toBe(true);
    expect(getScore('g1', 't1')).toBeNull();
  });
  it('returns false when not found', () => {
    expect(removeScore('g1', 'ghost')).toBe(false);
  });
});

describe('computeScore', () => {
  it('returns 0 for all-zero inputs', () => {
    expect(computeScore({})).toBe(0);
  });
  it('bookmarked tab scores higher', () => {
    const base = computeScore({ usageCount: 10 });
    const withBookmark = computeScore({ usageCount: 10, bookmarked: true });
    expect(withBookmark).toBeGreaterThan(base);
  });
  it('high priority increases score', () => {
    const low = computeScore({ priority: 1 });
    const high = computeScore({ priority: 9 });
    expect(high).toBeGreaterThan(low);
  });
});

describe('scoreTabsInGroup', () => {
  it('scores all tabs and stores results', () => {
    const tabs = [
      { id: 't1', scoreInputs: { usageCount: 50, priority: 5 } },
      { id: 't2', scoreInputs: { bookmarked: true } }
    ];
    const results = scoreTabsInGroup('g1', tabs);
    expect(results).toHaveLength(2);
    results.forEach(r => expect(r.score).toBeGreaterThanOrEqual(0));
    expect(getScore('g1', 't1')).not.toBeNull();
  });
  it('throws if tabs is not an array', () => {
    expect(() => scoreTabsInGroup('g1', null)).toThrow();
  });
});

describe('getGroupScores', () => {
  it('returns only scores for the given group', () => {
    setScore('g1', 't1', 0.5);
    setScore('g2', 't2', 0.9);
    const g1Scores = getGroupScores('g1');
    expect(Object.keys(g1Scores)).toEqual(['t1']);
  });
});

describe('getScoreHistory', () => {
  it('records history entries on setScore', () => {
    setScore('g1', 't1', 0.3);
    setScore('g1', 't1', 0.6);
    const history = getScoreHistory();
    expect(history).toHaveLength(2);
    expect(history[1].previous).toBe(0.3);
    expect(history[1].score).toBe(0.6);
  });
});
