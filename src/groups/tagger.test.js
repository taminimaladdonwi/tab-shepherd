import {
  setTags,
  getTags,
  addTag,
  removeTag,
  findGroupsByTag,
  clearAllTags,
} from './tagger.js';

beforeEach(() => {
  clearAllTags();
});

describe('setTags / getTags', () => {
  test('sets and retrieves tags for a group', () => {
    setTags('g1', ['work', 'urgent']);
    expect(getTags('g1')).toEqual(['work', 'urgent']);
  });

  test('deduplicates tags', () => {
    setTags('g1', ['work', 'Work', 'WORK']);
    expect(getTags('g1')).toEqual(['work']);
  });

  test('returns empty array for unknown group', () => {
    expect(getTags('unknown')).toEqual([]);
  });

  test('throws if tags is not an array', () => {
    expect(() => setTags('g1', 'work')).toThrow(TypeError);
  });
});

describe('addTag', () => {
  test('adds a new tag to a group', () => {
    setTags('g1', ['work']);
    addTag('g1', 'personal');
    expect(getTags('g1')).toContain('personal');
  });

  test('does not duplicate existing tag', () => {
    setTags('g1', ['work']);
    addTag('g1', 'Work');
    expect(getTags('g1').filter(t => t === 'work').length).toBe(1);
  });
});

describe('removeTag', () => {
  test('removes an existing tag', () => {
    setTags('g1', ['work', 'urgent']);
    removeTag('g1', 'urgent');
    expect(getTags('g1')).toEqual(['work']);
  });

  test('is a no-op for non-existent tag', () => {
    setTags('g1', ['work']);
    removeTag('g1', 'missing');
    expect(getTags('g1')).toEqual(['work']);
  });
});

describe('findGroupsByTag', () => {
  test('returns groups that have the tag', () => {
    setTags('g1', ['work']);
    setTags('g2', ['personal']);
    setTags('g3', ['work', 'urgent']);
    expect(findGroupsByTag('work').sort()).toEqual(['g1', 'g3']);
  });

  test('returns empty array when no groups match', () => {
    setTags('g1', ['work']);
    expect(findGroupsByTag('nonexistent')).toEqual([]);
  });
});
