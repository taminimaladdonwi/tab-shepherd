const {
  muteTab,
  clearMuteRecords
} = require('./groupTabMutedTracker');
const {
  getMuteSummary,
  getMostMutedGroup,
  getGroupsWithMutedTabs,
  getUnmutedGroups
} = require('./groupTabMutedTrackerView');
const { createGroup, getAllGroups } = require('./manager');

jest.mock('./manager', () => {
  const groups = [];
  return {
    createGroup: (id, name) => { groups.push({ id, name }); },
    getAllGroups: () => [...groups],
    _reset: () => groups.splice(0)
  };
});

const { _reset } = require('./manager');

beforeEach(() => {
  clearMuteRecords();
  _reset();
});

test('getMuteSummary returns correct counts', () => {
  muteTab('g1', 't1', 'manual');
  muteTab('g1', 't2', 'policy');
  const tabs = [{ id: 't1' }, { id: 't2' }, { id: 't3' }];
  const summary = getMuteSummary('g1', tabs);
  expect(summary.mutedCount).toBe(2);
  expect(summary.unmutedCount).toBe(1);
  expect(summary.totalTabs).toBe(3);
});

test('getMuteSummary with no muted tabs', () => {
  const tabs = [{ id: 't1' }];
  const summary = getMuteSummary('g1', tabs);
  expect(summary.mutedCount).toBe(0);
  expect(summary.unmutedCount).toBe(1);
});

test('getMostMutedGroup returns group with most mutes', () => {
  muteTab('g1', 't1');
  muteTab('g1', 't2');
  muteTab('g2', 't3');
  const result = getMostMutedGroup();
  expect(result.groupId).toBe('g1');
  expect(result.mutedCount).toBe(2);
});

test('getMostMutedGroup returns null when no mutes', () => {
  expect(getMostMutedGroup()).toBeNull();
});

test('getGroupsWithMutedTabs lists unique group ids', () => {
  muteTab('g1', 't1');
  muteTab('g1', 't2');
  muteTab('g2', 't3');
  const groups = getGroupsWithMutedTabs();
  expect(groups).toContain('g1');
  expect(groups).toContain('g2');
  expect(groups).toHaveLength(2);
});

test('getUnmutedGroups excludes groups with muted tabs', () => {
  createGroup('g1', 'Group 1');
  createGroup('g2', 'Group 2');
  createGroup('g3', 'Group 3');
  muteTab('g1', 't1');
  const unmuted = getUnmutedGroups();
  expect(unmuted).not.toContain('g1');
  expect(unmuted).toContain('g2');
  expect(unmuted).toContain('g3');
});
