import { getColorSummary, getColorDistribution, getUncoloredGroups } from './groupColorizerView.js';
import { setColor, clearColorHistory } from './groupColorizer.js';
import { createGroup, clearGroups } from './manager.js';

describe('groupColorizerView', () => {
  beforeEach(() => {
    clearGroups();
    clearColorHistory();
  });

  describe('getColorSummary', () => {
    it('returns summary with color info for each group', () => {
      createGroup('g1', 'Work');
      createGroup('g2', 'Personal');
      setColor('g1', '#ff0000');

      const summary = getColorSummary();
      expect(summary).toHaveLength(2);
      expect(summary.find(s => s.groupId === 'g1').color).toBe('#ff0000');
      expect(summary.find(s => s.groupId === 'g2').color).toBeNull();
    });

    it('returns empty array when no groups exist', () => {
      expect(getColorSummary()).toEqual([]);
    });
  });

  describe('getColorDistribution', () => {
    it('returns count of groups per color', () => {
      createGroup('g1', 'Work');
      createGroup('g2', 'Personal');
      createGroup('g3', 'Finance');
      setColor('g1', '#ff0000');
      setColor('g2', '#ff0000');
      setColor('g3', '#00ff00');

      const dist = getColorDistribution();
      expect(dist['#ff0000']).toBe(2);
      expect(dist['#00ff00']).toBe(1);
    });

    it('ignores uncolored groups', () => {
      createGroup('g1', 'Work');
      createGroup('g2', 'Personal');
      setColor('g1', '#0000ff');

      const dist = getColorDistribution();
      expect(Object.keys(dist)).toHaveLength(1);
      expect(dist['#0000ff']).toBe(1);
    });
  });

  describe('getUncoloredGroups', () => {
    it('returns groups without a color assigned', () => {
      createGroup('g1', 'Work');
      createGroup('g2', 'Personal');
      setColor('g1', '#ff0000');

      const uncolored = getUncoloredGroups();
      expect(uncolored).toHaveLength(1);
      expect(uncolored[0].id).toBe('g2');
    });

    it('returns all groups when none are colored', () => {
      createGroup('g1', 'Work');
      createGroup('g2', 'Personal');

      expect(getUncoloredGroups()).toHaveLength(2);
    });

    it('returns empty array when all groups are colored', () => {
      createGroup('g1', 'Work');
      setColor('g1', '#ff0000');

      expect(getUncoloredGroups()).toHaveLength(0);
    });
  });
});
