import {
  getFreezeSummary,
  getMostFrozenGroup,
  getGroupsWithFrozenTabs,
  getUnfrozenGroups
} from './groupTabFreezerView.js';
import { freezeTab, unfreezeTab, clearFreezeData } from './groupTabFreezer.js';
import { createGroup } from './manager.js';

beforeEach(() => {
  clearFreezeData();
});

describe('getFreezeSummary', () => {
  test('returns empty summary when no frozen tabs', () => {
    const summary = getFreezeSummary('g1');
    expect(summary.groupId).toBe('g1');
    expect(summary.frozenCount).toBe(0);
    expect(summary.frozenTabs).toEqual([]);
  });

  test('returns correct count and tabs for group', () => {
    freezeTab('g1', 'tab1', 'performance');
    freezeTab('g1', 'tab2', 'memory');
    const summary = getFreezeSummary('g1');
    expect(summary.frozenCount).toBe(2);
    expect(summary.frozenTabs).toContain('tab1');
    expect(summary.frozenTabs).toContain('tab2');
  });

  test('does not include tabs from other groups', () => {
    freezeTab('g1', 'tab1', 'performance');
    freezeTab('g2', 'tab2', 'memory');
    const summary = getFreezeSummary('g1');
    expect(summary.frozenCount).toBe(1);
    expect(summary.frozenTabs).not.toContain('tab2');
  });
});

describe('getMostFrozenGroup', () => {
  test('returns null when no frozen tabs exist', () => {
    expect(getMostFrozenGroup(['g1', 'g2'])).toBeNull();
  });

  test('returns group with most frozen tabs', () => {
    freezeTab('g1', 'tab1', 'performance');
    freezeTab('g2', 'tab2', 'memory');
    freezeTab('g2', 'tab3', 'memory');
    expect(getMostFrozenGroup(['g1', 'g2'])).toBe('g2');
  });
});

describe('getGroupsWithFrozenTabs', () => {
  test('returns empty array when nothing frozen', () => {
    expect(getGroupsWithFrozenTabs(['g1', 'g2'])).toEqual([]);
  });

  test('returns only groups that have at least one frozen tab', () => {
    freezeTab('g1', 'tab1', 'performance');
    const result = getGroupsWithFrozenTabs(['g1', 'g2']);
    expect(result).toContain('g1');
    expect(result).not.toContain('g2');
  });
});

describe('getUnfrozenGroups', () => {
  test('returns all groups when none have frozen tabs', () => {
    const result = getUnfrozenGroups(['g1', 'g2']);
    expect(result).toEqual(['g1', 'g2']);
  });

  test('excludes groups with frozen tabs', () => {
    freezeTab('g1', 'tab1', 'performance');
    const result = getUnfrozenGroups(['g1', 'g2']);
    expect(result).not.toContain('g1');
    expect(result).toContain('g2');
  });
});
