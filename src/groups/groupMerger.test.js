import { mergeGroups, mergeGroupsByTag } from './groupMerger.js';
import { createGroup, getGroup, addTabToGroup, getAllGroups, deleteGroup } from './manager.js';
import { setTags, getTags } from './tagger.js';

function setup() {
  // Clean slate — delete all groups
  for (const g of getAllGroups()) deleteGroup(g.id);
}

describe('mergeGroups', () => {
  beforeEach(setup);

  test('moves tabs from source groups to target', () => {
    createGroup('g1', 'Group 1');
    createGroup('g2', 'Group 2');
    createGroup('target', 'Target');
    addTabToGroup('g1', 101);
    addTabToGroup('g2', 102);

    mergeGroups(['g1', 'g2'], 'target', 'Target');

    const t = getGroup('target');
    expect(t.tabs).toContain(101);
    expect(t.tabs).toContain(102);
  });

  test('deletes source groups after merge', () => {
    createGroup('g1', 'Group 1');
    createGroup('target', 'Target');
    addTabToGroup('g1', 201);

    mergeGroups(['g1'], 'target');

    expect(getGroup('g1')).toBeNull();
  });

  test('unions tags from all source groups', () => {
    createGroup('g1', 'G1');
    createGroup('g2', 'G2');
    createGroup('target', 'Target');
    setTags('g1', ['work']);
    setTags('g2', ['personal']);
    setTags('target', ['shared']);

    mergeGroups(['g1', 'g2'], 'target');

    const tags = getTags('target');
    expect(tags).toContain('work');
    expect(tags).toContain('personal');
    expect(tags).toContain('shared');
  });

  test('creates target group if it does not exist', () => {
    createGroup('g1', 'G1');
    addTabToGroup('g1', 301);

    const result = mergeGroups(['g1'], 'new-target', 'New Target');
    expect(result).not.toBeNull();
    expect(result.tabs).toContain(301);
  });

  test('throws if no source groups provided', () => {
    expect(() => mergeGroups([], 'target')).toThrow();
  });
});

describe('mergeGroupsByTag', () => {
  beforeEach(setup);

  test('merges all groups with matching tag', () => {
    createGroup('a', 'A');
    createGroup('b', 'B');
    setTags('a', ['project']);
    setTags('b', ['project']);
    addTabToGroup('a', 401);
    addTabToGroup('b', 402);

    mergeGroupsByTag('project', 'a');

    const merged = getGroup('a');
    expect(merged.tabs).toContain(401);
    expect(merged.tabs).toContain(402);
    expect(getGroup('b')).toBeNull();
  });

  test('returns null if no groups match tag', () => {
    const result = mergeGroupsByTag('nonexistent-tag', 'x');
    expect(result).toBeNull();
  });
});
