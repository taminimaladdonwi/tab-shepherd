import {
  getAnnotationSummary,
  getAnnotatedTabTitles,
  getGroupsWithAnnotations,
  getMostAnnotatedGroup
} from './groupTabAnnotatorView.js';
import { setAnnotation, clearAllAnnotations } from './groupTabAnnotator.js';

beforeEach(() => {
  clearAllAnnotations();
});

describe('getAnnotationSummary', () => {
  it('returns zero counts when no annotations exist', () => {
    const summary = getAnnotationSummary();
    expect(summary.totalAnnotations).toBe(0);
    expect(summary.annotatedGroups).toBe(0);
  });

  it('counts annotations across groups', () => {
    setAnnotation('g1', 1, 'note A');
    setAnnotation('g1', 2, 'note B');
    setAnnotation('g2', 3, 'note C');
    const summary = getAnnotationSummary();
    expect(summary.totalAnnotations).toBe(3);
    expect(summary.annotatedGroups).toBe(2);
  });
});

describe('getAnnotatedTabTitles', () => {
  it('returns empty array for unknown group', () => {
    expect(getAnnotatedTabTitles('g99', [])).toEqual([]);
  });

  it('returns titles of annotated tabs', () => {
    setAnnotation('g1', 10, 'important');
    const tabs = [
      { id: 10, title: 'Tab A' },
      { id: 11, title: 'Tab B' }
    ];
    const titles = getAnnotatedTabTitles('g1', tabs);
    expect(titles).toContain('Tab A');
    expect(titles).not.toContain('Tab B');
  });
});

describe('getGroupsWithAnnotations', () => {
  it('returns empty array when no annotations', () => {
    expect(getGroupsWithAnnotations()).toEqual([]);
  });

  it('returns group ids that have at least one annotation', () => {
    setAnnotation('g1', 1, 'x');
    setAnnotation('g3', 5, 'y');
    const groups = getGroupsWithAnnotations();
    expect(groups).toContain('g1');
    expect(groups).toContain('g3');
    expect(groups).not.toContain('g2');
  });
});

describe('getMostAnnotatedGroup', () => {
  it('returns null when no annotations', () => {
    expect(getMostAnnotatedGroup()).toBeNull();
  });

  it('returns the group id with the most annotations', () => {
    setAnnotation('g1', 1, 'a');
    setAnnotation('g2', 2, 'b');
    setAnnotation('g2', 3, 'c');
    setAnnotation('g2', 4, 'd');
    expect(getMostAnnotatedGroup()).toBe('g2');
  });
});
