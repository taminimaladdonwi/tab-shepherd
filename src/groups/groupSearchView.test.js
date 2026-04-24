import {
  getSearchResultSummary,
  getMatchingGroupNames,
  getSearchResultCount
} from './groupSearchView.js';
import { createGroup, addTabToGroup } from './manager.js';
import { addTag } from './tagger.js';
import { setColor } from './groupColorizer.js';

let g1, g2;

beforeEach(() => {
  const { clearAll } = require('./manager.js');
  clearAll?.();

  g1 = createGroup('Alpha');
  g2 = createGroup('Beta');

  addTabToGroup(g1.id, 'tab-a');
  addTabToGroup(g1.id, 'tab-b');

  addTag(g1.id, 'dev');
  setColor(g1.id, '#00ff00');
});

describe('getSearchResultSummary', () => {
  test('returns summary objects with expected fields', () => {
    const results = getSearchResultSummary({ name: 'alpha' });
    expect(results).toHaveLength(1);
    const r = results[0];
    expect(r.id).toBe(g1.id);
    expect(r.name).toBe('Alpha');
    expect(r.tabCount).toBe(2);
    expect(r.tags).toContain('dev');
    expect(r.color).toBe('#00ff00');
  });

  test('returns empty array when nothing matches', () => {
    expect(getSearchResultSummary({ name: 'zzz' })).toHaveLength(0);
  });
});

describe('getMatchingGroupNames', () => {
  test('returns names matching query', () => {
    const names = getMatchingGroupNames('al');
    expect(names).toContain('Alpha');
    expect(names).not.toContain('Beta');
  });

  test('returns all names for empty query', () => {
    const names = getMatchingGroupNames('');
    expect(names.length).toBeGreaterThanOrEqual(2);
  });
});

describe('getSearchResultCount', () => {
  test('returns correct count for matching criteria', () => {
    expect(getSearchResultCount({ tag: 'dev' })).toBe(1);
  });

  test('returns 0 when no match', () => {
    expect(getSearchResultCount({ color: '#000000' })).toBe(0);
  });

  test('returns total group count with no criteria', () => {
    expect(getSearchResultCount()).toBeGreaterThanOrEqual(2);
  });
});
