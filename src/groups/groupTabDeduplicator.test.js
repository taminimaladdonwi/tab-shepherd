import {
  deduplicateGroup,
  deduplicateAllGroups,
  getDeduplicationHistory,
  getTotalRemovedCount,
  clearDeduplicationHistory
} from './groupTabDeduplicator.js';
import { getGroup, getAllGroups } from './manager.js';
import { findDuplicateTabs } from './groupDuplicateFinder.js';

jest.mock('./manager.js');
jest.mock('./groupDuplicateFinder.js');

const mockTabs = [
  { id: 1, url: 'https://example.com', title: 'Example' },
  { id: 2, url: 'https://example.com', title: 'Example Dup' },
  { id: 3, url: 'https://other.com', title: 'Other' }
];

beforeEach(() => {
  clearDeduplicationHistory();
  jest.clearAllMocks();
});

describe('deduplicateGroup', () => {
  it('throws if group is not found', () => {
    getGroup.mockReturnValue(null);
    expect(() => deduplicateGroup('missing')).toThrow('Group not found: missing');
  });

  it('returns removed duplicate tabs', () => {
    getGroup.mockReturnValue({ id: 'g1', tabs: mockTabs });
    findDuplicateTabs.mockReturnValue([
      { url: 'https://example.com', tabs: [mockTabs[0], mockTabs[1]] }
    ]);

    const removed = deduplicateGroup('g1');
    expect(removed).toHaveLength(1);
    expect(removed[0].tabId).toBe(2);
    expect(removed[0].groupId).toBe('g1');
  });

  it('returns empty array when no duplicates', () => {
    getGroup.mockReturnValue({ id: 'g1', tabs: [mockTabs[0], mockTabs[2]] });
    findDuplicateTabs.mockReturnValue([]);

    const removed = deduplicateGroup('g1');
    expect(removed).toHaveLength(0);
  });

  it('records deduplication history when duplicates are removed', () => {
    getGroup.mockReturnValue({ id: 'g1', tabs: mockTabs });
    findDuplicateTabs.mockReturnValue([
      { url: 'https://example.com', tabs: [mockTabs[0], mockTabs[1]] }
    ]);

    deduplicateGroup('g1');
    const history = getDeduplicationHistory('g1');
    expect(history).toHaveLength(1);
    expect(history[0].removedCount).toBe(1);
    expect(history[0].groupId).toBe('g1');
  });
});

describe('deduplicateAllGroups', () => {
  it('returns summary of all groups with duplicates removed', () => {
    getAllGroups.mockReturnValue([{ id: 'g1', tabs: mockTabs }, { id: 'g2', tabs: [] }]);
    getGroup
      .mockReturnValueOnce({ id: 'g1', tabs: mockTabs })
      .mockReturnValueOnce({ id: 'g2', tabs: [] });
    findDuplicateTabs
      .mockReturnValueOnce([{ url: 'https://example.com', tabs: [mockTabs[0], mockTabs[1]] }])
      .mockReturnValueOnce([]);

    const summary = deduplicateAllGroups();
    expect(summary['g1']).toHaveLength(1);
    expect(summary['g2']).toBeUndefined();
  });
});

describe('getTotalRemovedCount', () => {
  it('returns 0 with no history', () => {
    expect(getTotalRemovedCount()).toBe(0);
  });

  it('accumulates removed count across runs', () => {
    getGroup.mockReturnValue({ id: 'g1', tabs: mockTabs });
    findDuplicateTabs.mockReturnValue([
      { url: 'https://example.com', tabs: [mockTabs[0], mockTabs[1]] }
    ]);

    deduplicateGroup('g1');
    deduplicateGroup('g1');
    expect(getTotalRemovedCount()).toBe(2);
  });
});
