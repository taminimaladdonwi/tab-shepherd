import {
  getLoadSummary,
  getFullyLoadedGroups,
  getGroupsWithErrors,
  getLoadStateDistribution
} from './groupTabLoadTrackerView.js';
import { setLoadState, clearLoadStates } from './groupTabLoadTracker.js';

beforeEach(() => {
  clearLoadStates();
});

describe('getLoadSummary', () => {
  it('returns counts per group', () => {
    setLoadState('g1', 't1', 'complete');
    setLoadState('g1', 't2', 'loading');
    setLoadState('g2', 't3', 'error');
    const summary = getLoadSummary(['g1', 'g2']);
    expect(summary['g1'].complete).toBe(1);
    expect(summary['g1'].loading).toBe(1);
    expect(summary['g1'].total).toBe(2);
    expect(summary['g2'].error).toBe(1);
  });

  it('returns empty summary for untracked group', () => {
    const summary = getLoadSummary(['g99']);
    expect(summary['g99'].total).toBe(0);
  });
});

describe('getFullyLoadedGroups', () => {
  it('returns groups where all tabs are complete', () => {
    setLoadState('g1', 't1', 'complete');
    setLoadState('g1', 't2', 'complete');
    setLoadState('g2', 't3', 'complete');
    setLoadState('g2', 't4', 'loading');
    const result = getFullyLoadedGroups(['g1', 'g2']);
    expect(result).toContain('g1');
    expect(result).not.toContain('g2');
  });

  it('excludes groups with no tracked tabs', () => {
    const result = getFullyLoadedGroups(['g99']);
    expect(result).toHaveLength(0);
  });
});

describe('getGroupsWithErrors', () => {
  it('returns groups that have at least one error tab', () => {
    setLoadState('g1', 't1', 'error');
    setLoadState('g2', 't2', 'complete');
    const result = getGroupsWithErrors(['g1', 'g2']);
    expect(result).toContain('g1');
    expect(result).not.toContain('g2');
  });
});

describe('getLoadStateDistribution', () => {
  it('aggregates state counts across all groups', () => {
    setLoadState('g1', 't1', 'complete');
    setLoadState('g1', 't2', 'loading');
    setLoadState('g2', 't3', 'error');
    setLoadState('g2', 't4', 'complete');
    const dist = getLoadStateDistribution(['g1', 'g2']);
    expect(dist.complete).toBe(2);
    expect(dist.loading).toBe(1);
    expect(dist.error).toBe(1);
  });

  it('returns zeroes when nothing is tracked', () => {
    const dist = getLoadStateDistribution([]);
    expect(dist.complete).toBe(0);
    expect(dist.loading).toBe(0);
    expect(dist.error).toBe(0);
  });
});
