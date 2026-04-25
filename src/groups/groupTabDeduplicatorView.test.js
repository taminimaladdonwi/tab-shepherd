import {
  getDeduplicationSummary,
  getMostDeduplicatedGroup,
  getUndeduplicatedGroups
} from './groupTabDeduplicatorView.js';
import { deduplicateGroup, clearDeduplicationHistory } from './groupTabDeduplicator.js';
import { createGroup, getAllGroups } from './manager.js';

beforeEach(() => {
  clearDeduplicationHistory();
});

describe('getDeduplicationSummary', () => {
  it('returns zeroed summary when no deduplication has run', () => {
    const summary = getDeduplicationSummary();
    expect(summary.totalRuns).toBe(0);
    expect(summary.totalRemoved).toBe(0);
    expect(summary.groupsAffected).toBe(0);
    expect(summary.averageRemovedPerRun).toBe(0);
  });

  it('reflects deduplication activity correctly', () => {
    const group = createGroup('g1', [
      { id: 1, url: 'https://example.com' },
      { id: 2, url: 'https://example.com' },
      { id: 3, url: 'https://other.com' }
    ]);
    deduplicateGroup(group.id);

    const summary = getDeduplicationSummary();
    expect(summary.totalRuns).toBe(1);
    expect(summary.totalRemoved).toBeGreaterThanOrEqual(1);
    expect(summary.groupsAffected).toBe(1);
    expect(summary.averageRemovedPerRun).toBeGreaterThan(0);
  });
});

describe('getMostDeduplicatedGroup', () => {
  it('returns null when no history exists', () => {
    expect(getMostDeduplicatedGroup()).toBeNull();
  });

  it('returns the group with the most duplicates removed', () => {
    const g1 = createGroup('g1', [
      { id: 1, url: 'https://a.com' },
      { id: 2, url: 'https://a.com' },
      { id: 3, url: 'https://a.com' }
    ]);
    const g2 = createGroup('g2', [
      { id: 4, url: 'https://b.com' },
      { id: 5, url: 'https://b.com' }
    ]);
    deduplicateGroup(g1.id);
    deduplicateGroup(g2.id);

    const result = getMostDeduplicatedGroup();
    expect(result).not.toBeNull();
    expect(result.groupId).toBe(g1.id);
    expect(result.totalRemoved).toBeGreaterThan(0);
  });
});

describe('getUndeduplicatedGroups', () => {
  it('returns all group ids when no deduplication has run', () => {
    createGroup('gA', []);
    createGroup('gB', []);
    const result = getUndeduplicatedGroups();
    expect(result).toEqual(expect.arrayContaining(['gA', 'gB']));
  });

  it('excludes groups that have been deduplicated', () => {
    const g = createGroup('gX', [
      { id: 10, url: 'https://dup.com' },
      { id: 11, url: 'https://dup.com' }
    ]);
    createGroup('gY', []);
    deduplicateGroup(g.id);

    const result = getUndeduplicatedGroups();
    expect(result).not.toContain('gX');
    expect(result).toContain('gY');
  });
});
