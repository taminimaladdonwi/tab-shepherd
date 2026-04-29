const {
  isSuspensionBlockedByScore,
  filterSuspendableByScore,
  partitionByScore,
  DEFAULT_SUSPENSION_THRESHOLD
} = require('./groupTabScorerPolicy');
const { setScore, clearScores } = require('./groupTabScorer');

beforeEach(() => clearScores());

const GROUP = 'g1';

describe('isSuspensionBlockedByScore', () => {
  it('blocks tab with score >= threshold', () => {
    setScore(GROUP, 't1', 0.8);
    expect(isSuspensionBlockedByScore(GROUP, 't1', 0.25)).toBe(true);
  });
  it('does not block tab with score below threshold', () => {
    setScore(GROUP, 't2', 0.1);
    expect(isSuspensionBlockedByScore(GROUP, 't2', 0.25)).toBe(false);
  });
  it('does not block unscored tab', () => {
    expect(isSuspensionBlockedByScore(GROUP, 'unscored', 0.25)).toBe(false);
  });
  it('uses DEFAULT_SUSPENSION_THRESHOLD when not specified', () => {
    setScore(GROUP, 't3', DEFAULT_SUSPENSION_THRESHOLD);
    expect(isSuspensionBlockedByScore(GROUP, 't3')).toBe(true);
  });
});

describe('filterSuspendableByScore', () => {
  it('filters out protected tabs', () => {
    setScore(GROUP, 't1', 0.9);
    setScore(GROUP, 't2', 0.1);
    const tabs = [{ id: 't1' }, { id: 't2' }, { id: 't3' }];
    const result = filterSuspendableByScore(GROUP, tabs, 0.25);
    expect(result.map(t => t.id)).toEqual(['t2', 't3']);
  });
  it('throws if tabs is not an array', () => {
    expect(() => filterSuspendableByScore(GROUP, 'bad')).toThrow();
  });
});

describe('partitionByScore', () => {
  it('correctly partitions suspendable and protected tabs', () => {
    setScore(GROUP, 't1', 0.9);
    setScore(GROUP, 't2', 0.05);
    const tabs = [{ id: 't1' }, { id: 't2' }, { id: 't3' }];
    const { suspendable, protected: prot } = partitionByScore(GROUP, tabs, 0.25);
    expect(suspendable.map(t => t.id)).toEqual(['t2', 't3']);
    expect(prot.map(t => t.id)).toEqual(['t1']);
  });
  it('throws if tabs is not an array', () => {
    expect(() => partitionByScore(GROUP, null)).toThrow();
  });
  it('places all tabs in suspendable when none are scored', () => {
    const tabs = [{ id: 'a' }, { id: 'b' }];
    const { suspendable, protected: prot } = partitionByScore(GROUP, tabs);
    expect(suspendable).toHaveLength(2);
    expect(prot).toHaveLength(0);
  });
});
