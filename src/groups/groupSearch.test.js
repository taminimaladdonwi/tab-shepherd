import {
  searchByName,
  filterByTag,
  filterByColor,
  filterByTabCount,
  searchGroups
} from './groupSearch.js';
import { createGroup, addTabToGroup } from './manager.js';
import { addTag } from './tagger.js';
import { setColor } from './groupColorizer.js';

let g1, g2, g3;

function setup() {
  const { clearAll } = require('./manager.js');
  clearAll?.();

  g1 = createGroup('Work');
  g2 = createGroup('Personal');
  g3 = createGroup('Work Archive');

  addTabToGroup(g1.id, 'tab-1');
  addTabToGroup(g1.id, 'tab-2');
  addTabToGroup(g2.id, 'tab-3');

  addTag(g1.id, 'important');
  addTag(g2.id, 'personal');
  addTag(g3.id, 'important');

  setColor(g1.id, '#ff0000');
  setColor(g3.id, '#ff0000');
}

beforeEach(setup);

describe('searchByName', () => {
  test('returns groups matching substring (case-insensitive)', () => {
    const results = searchByName('work');
    expect(results.map(g => g.id)).toContain(g1.id);
    expect(results.map(g => g.id)).toContain(g3.id);
    expect(results.map(g => g.id)).not.toContain(g2.id);
  });

  test('returns all groups for empty query', () => {
    expect(searchByName('').length).toBeGreaterThanOrEqual(3);
  });
});

describe('filterByTag', () => {
  test('returns groups with the specified tag', () => {
    const results = filterByTag('important');
    expect(results.map(g => g.id)).toContain(g1.id);
    expect(results.map(g => g.id)).toContain(g3.id);
    expect(results.map(g => g.id)).not.toContain(g2.id);
  });
});

describe('filterByColor', () => {
  test('returns groups with the specified color', () => {
    const results = filterByColor('#ff0000');
    expect(results.map(g => g.id)).toContain(g1.id);
    expect(results.map(g => g.id)).toContain(g3.id);
    expect(results.map(g => g.id)).not.toContain(g2.id);
  });
});

describe('filterByTabCount', () => {
  test('returns groups within tab count range', () => {
    const results = filterByTabCount(2, 2);
    expect(results.map(g => g.id)).toContain(g1.id);
    expect(results.map(g => g.id)).not.toContain(g2.id);
  });

  test('returns groups with at least min tabs', () => {
    const results = filterByTabCount(1);
    expect(results.length).toBeGreaterThanOrEqual(2);
  });
});

describe('searchGroups (composite)', () => {
  test('filters by name and tag together', () => {
    const results = searchGroups({ name: 'work', tag: 'important' });
    expect(results.map(g => g.id)).toContain(g1.id);
    expect(results.map(g => g.id)).toContain(g3.id);
    expect(results.map(g => g.id)).not.toContain(g2.id);
  });

  test('filters by color and minTabs', () => {
    const results = searchGroups({ color: '#ff0000', minTabs: 2 });
    expect(results.map(g => g.id)).toContain(g1.id);
    expect(results.map(g => g.id)).not.toContain(g3.id);
  });

  test('returns all groups when no criteria given', () => {
    expect(searchGroups({}).length).toBeGreaterThanOrEqual(3);
  });
});
