import { getFilterResultSummary, getMatchingTabTitles, getDomainBreakdown } from './groupTabFilterView.js';
import { getAllGroups } from './manager.js';
import { isSuspended } from './suspender.js';

jest.mock('./manager.js');
jest.mock('./suspender.js');

const mockGroups = {
  g1: {
    name: 'Research',
    tabs: [
      { id: 1, url: 'https://github.com/tab-shepherd', title: 'Tab Shepherd' },
      { id: 2, url: 'https://github.com/other', title: 'Other Repo' },
      { id: 3, url: 'https://npmjs.com/package/jest', title: 'Jest on npm' },
    ],
  },
};

beforeEach(() => {
  getAllGroups.mockReturnValue(mockGroups);
  isSuspended.mockReturnValue(false);
});

test('getFilterResultSummary returns correct counts', () => {
  const summary = getFilterResultSummary('g1', { url: 'github' });
  expect(summary.groupId).toBe('g1');
  expect(summary.groupName).toBe('Research');
  expect(summary.totalTabs).toBe(3);
  expect(summary.matchedCount).toBe(2);
  expect(summary.unmatchedCount).toBe(1);
});

test('getFilterResultSummary handles unknown group', () => {
  const summary = getFilterResultSummary('nope', {});
  expect(summary.totalTabs).toBe(0);
  expect(summary.matchedCount).toBe(0);
  expect(summary.groupName).toBeNull();
});

test('getMatchingTabTitles returns titles of matched tabs', () => {
  const titles = getMatchingTabTitles('g1', { url: 'github' });
  expect(titles).toContain('Tab Shepherd');
  expect(titles).toContain('Other Repo');
  expect(titles).not.toContain('Jest on npm');
});

test('getDomainBreakdown counts tabs per domain', () => {
  const breakdown = getDomainBreakdown('g1');
  expect(breakdown['github.com']).toBe(2);
  expect(breakdown['npmjs.com']).toBe(1);
});

test('getDomainBreakdown returns empty for unknown group', () => {
  const breakdown = getDomainBreakdown('missing');
  expect(breakdown).toEqual({});
});

test('getMatchingTabTitles falls back to url when title missing', () => {
  getAllGroups.mockReturnValue({
    g2: { name: 'Test', tabs: [{ id: 9, url: 'https://example.com', title: '' }] },
  });
  const titles = getMatchingTabTitles('g2', {});
  expect(titles[0]).toBe('https://example.com');
});
