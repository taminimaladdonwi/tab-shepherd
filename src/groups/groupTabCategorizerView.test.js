import {
  getCategorySummary,
  getUncategorizedGroups,
  getMostCategorizedGroup,
  getTabsInCategoryAcrossGroups
} from './groupTabCategorizerView.js';
import { setCategory, clearCategories } from './groupTabCategorizer.js';
import { getAllGroups } from './manager.js';

jest.mock('./manager.js');

function setup() {
  clearCategories();
  getAllGroups.mockReturnValue([
    { id: 'g1', tabs: [{ id: 't1' }, { id: 't2' }] },
    { id: 'g2', tabs: [{ id: 't3' }] },
    { id: 'g3', tabs: [{ id: 't4' }, { id: 't5' }] }
  ]);
  setCategory('g1', 't1', 'work');
  setCategory('g1', 't2', 'research');
  setCategory('g2', 't3', 'work');
  // g3 tabs left uncategorized
}

describe('groupTabCategorizerView', () => {
  beforeEach(setup);

  describe('getCategorySummary', () => {
    it('returns total categorized count and breakdown', () => {
      const summary = getCategorySummary();
      expect(summary.totalCategorized).toBe(3);
      expect(summary.breakdown).toHaveProperty('work', 2);
      expect(summary.breakdown).toHaveProperty('research', 1);
    });
  });

  describe('getUncategorizedGroups', () => {
    it('returns groups that have no categorized tabs', () => {
      const result = getUncategorizedGroups();
      expect(result).toContain('g3');
      expect(result).not.toContain('g1');
      expect(result).not.toContain('g2');
    });
  });

  describe('getMostCategorizedGroup', () => {
    it('returns the group with the most categorized tabs', () => {
      const result = getMostCategorizedGroup();
      expect(result).toBe('g1');
    });

    it('returns null when no categories exist', () => {
      clearCategories();
      expect(getMostCategorizedGroup()).toBeNull();
    });
  });

  describe('getTabsInCategoryAcrossGroups', () => {
    it('returns all tabs matching the given category', () => {
      const result = getTabsInCategoryAcrossGroups('work');
      expect(result).toHaveLength(2);
      expect(result).toContainEqual({ groupId: 'g1', tabId: 't1' });
      expect(result).toContainEqual({ groupId: 'g2', tabId: 't3' });
    });

    it('returns empty array for unknown category', () => {
      expect(getTabsInCategoryAcrossGroups('nonexistent')).toEqual([]);
    });
  });
});
