import { filterTabsByUrl, filterTabsByTitle, filterTabsByDomain, filterTabsBySuspension, filterTabs } from './groupTabFilter.js';
import { getAllGroups } from './manager.js';
import { isSuspended } from './suspender.js';

jest.mock('./manager.js');
jest.mock('./suspender.js');

const mockGroups = {
  g1: {
    name: 'Work',
    tabs: [
      { id: 1, url: 'https://github.com/repo', title: 'GitHub Repo' },
      { id: 2, url: 'https://docs.google.com/doc', title: 'Google Doc' },
      { id: 3, url: 'chrome-extension://suspended#uri=https://example.com', title: 'Suspended Tab' },
    ],
  },
};

beforeEach(() => {
  getAllGroups.mockReturnValue(mockGroups);
  isSuspended.mockImplementation(url => url.startsWith('chrome-extension://suspended'));
});

test('filterTabsByUrl returns matching tabs', () => {
  const result = filterTabsByUrl('g1', 'github');
  expect(result).toHaveLength(1);
  expect(result[0].id).toBe(1);
});

test('filterTabsByUrl returns empty for no match', () => {
  expect(filterTabsByUrl('g1', 'stackoverflow')).toHaveLength(0);
});

test('filterTabsByTitle returns matching tabs', () => {
  const result = filterTabsByTitle('g1', 'google');
  expect(result).toHaveLength(1);
  expect(result[0].id).toBe(2);
});

test('filterTabsByDomain returns tabs matching domain', () => {
  const result = filterTabsByDomain('g1', 'github.com');
  expect(result).toHaveLength(1);
  expect(result[0].id).toBe(1);
});

test('filterTabsBySuspension returns suspended tabs', () => {
  const result = filterTabsBySuspension('g1', true);
  expect(result).toHaveLength(1);
  expect(result[0].id).toBe(3);
});

test('filterTabsBySuspension returns active tabs', () => {
  const result = filterTabsBySuspension('g1', false);
  expect(result).toHaveLength(2);
});

test('filterTabs applies multiple criteria', () => {
  const result = filterTabs('g1', { domain: 'google.com', suspended: false });
  expect(result).toHaveLength(1);
  expect(result[0].id).toBe(2);
});

test('filterTabs returns empty for unknown group', () => {
  expect(filterTabs('unknown', { url: 'github' })).toHaveLength(0);
});

test('filterTabsByUrl is case-insensitive', () => {
  const result = filterTabsByUrl('g1', 'GITHUB');
  expect(result).toHaveLength(1);
});
