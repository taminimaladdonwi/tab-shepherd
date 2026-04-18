import { getAllGroupsWithTags, getGroupsByTag, getTagSummary } from './taggedGroupView.js';
import { createGroup, getAllGroups } from './manager.js';
import { setTags } from './tagger.js';

beforeEach(() => {
  // Reset state via manager if clearAll is available, otherwise rely on fresh imports
  jest.resetModules();
});

test('getAllGroupsWithTags returns groups with their tags', () => {
  const g1 = createGroup('Work');
  const g2 = createGroup('Personal');
  setTags(g1.id, ['work', 'important']);
  setTags(g2.id, ['personal']);

  const result = getAllGroupsWithTags();
  const workEntry = result.find(e => e.group.id === g1.id);
  expect(workEntry).toBeDefined();
  expect(workEntry.tags).toContain('work');
  expect(workEntry.tags).toContain('important');
});

test('getAllGroupsWithTags includes groups with no tags', () => {
  const g = createGroup('Untagged');
  const result = getAllGroupsWithTags();
  const entry = result.find(e => e.group.id === g.id);
  expect(entry).toBeDefined();
  expect(entry.tags).toEqual([]);
});

test('getGroupsByTag filters correctly', () => {
  const g1 = createGroup('Alpha');
  const g2 = createGroup('Beta');
  setTags(g1.id, ['dev']);
  setTags(g2.id, ['prod']);

  const devGroups = getGroupsByTag('dev');
  expect(devGroups.some(e => e.group.id === g1.id)).toBe(true);
  expect(devGroups.some(e => e.group.id === g2.id)).toBe(false);
});

test('getTagSummary returns tag to group count map', () => {
  const g1 = createGroup('G1');
  const g2 = createGroup('G2');
  const g3 = createGroup('G3');
  setTags(g1.id, ['shared', 'unique']);
  setTags(g2.id, ['shared']);
  setTags(g3.id, ['other']);

  const summary = getTagSummary();
  expect(summary['shared']).toBe(2);
  expect(summary['unique']).toBe(1);
  expect(summary['other']).toBe(1);
});
