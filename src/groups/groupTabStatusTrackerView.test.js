import {
  getStatusSummary,
  getGroupsWithStatus,
  getMostSuspendedGroup,
  getStatusDistribution
} from './groupTabStatusTrackerView.js';
import { setStatus, clearAllStatuses } from './groupTabStatusTracker.js';
import { createGroup } from './manager.js';

beforeEach(() => {
  clearAllStatuses();
});

describe('getStatusSummary', () => {
  it('returns empty summary when no statuses set', () => {
    const summary = getStatusSummary('g1');
    expect(summary).toEqual({ groupId: 'g1', total: 0, byStatus: {} });
  });

  it('returns correct counts per status', () => {
    setStatus('g1', 't1', 'suspended');
    setStatus('g1', 't2', 'suspended');
    setStatus('g1', 't3', 'active');
    const summary = getStatusSummary('g1');
    expect(summary.total).toBe(3);
    expect(summary.byStatus.suspended).toBe(2);
    expect(summary.byStatus.active).toBe(1);
  });
});

describe('getGroupsWithStatus', () => {
  it('returns only groups that have at least one tab with the given status', () => {
    setStatus('g1', 't1', 'suspended');
    setStatus('g2', 't2', 'active');
    setStatus('g3', 't3', 'suspended');
    const groups = getGroupsWithStatus('suspended');
    expect(groups).toContain('g1');
    expect(groups).toContain('g3');
    expect(groups).not.toContain('g2');
  });

  it('returns empty array when no group has the status', () => {
    setStatus('g1', 't1', 'active');
    expect(getGroupsWithStatus('suspended')).toEqual([]);
  });
});

describe('getMostSuspendedGroup', () => {
  it('returns null when nothing is tracked', () => {
    expect(getMostSuspendedGroup()).toBeNull();
  });

  it('returns the group with the most suspended tabs', () => {
    setStatus('g1', 't1', 'suspended');
    setStatus('g2', 't2', 'suspended');
    setStatus('g2', 't3', 'suspended');
    setStatus('g2', 't4', 'suspended');
    expect(getMostSuspendedGroup()).toBe('g2');
  });
});

describe('getStatusDistribution', () => {
  it('returns distribution across all groups', () => {
    setStatus('g1', 't1', 'suspended');
    setStatus('g1', 't2', 'active');
    setStatus('g2', 't3', 'suspended');
    const dist = getStatusDistribution();
    expect(dist.suspended).toBe(2);
    expect(dist.active).toBe(1);
  });

  it('returns empty object when nothing tracked', () => {
    expect(getStatusDistribution()).toEqual({});
  });
});
