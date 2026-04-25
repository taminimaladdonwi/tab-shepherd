import {
  getUsageSummary,
  getTopUsedTabs,
  getUnusedGroups,
  getGroupUsageBreakdown,
} from './groupTabUsageTrackerView.js';
import { recordTabUsage, clearAllUsage } from './groupTabUsageTracker.js';
import { createGroup, clearGroups } from './manager.js';

function setup() {
  clearGroups();
  clearAllUsage();

  createGroup('g1', 'Alpha');
  createGroup('g2', 'Beta');
  createGroup('g3', 'Gamma');

  recordTabUsage('g1', 'tab1');
  recordTabUsage('g1', 'tab1');
  recordTabUsage('g1', 'tab1');
  recordTabUsage('g1', 'tab2');
  recordTabUsage('g2', 'tab3');
  recordTabUsage('g2', 'tab3');
}

describe('groupTabUsageTrackerView', () => {
  beforeEach(setup);

  describe('getUsageSummary', () => {
    it('returns correct tracked tab count', () => {
      const summary = getUsageSummary();
      expect(summary.trackedTabs).toBe(3);
    });

    it('returns correct total events', () => {
      const summary = getUsageSummary();
      expect(summary.totalEvents).toBe(6);
    });
  });

  describe('getTopUsedTabs', () => {
    it('returns tabs sorted by usage descending', () => {
      const top = getTopUsedTabs(3);
      expect(top[0].count).toBeGreaterThanOrEqual(top[1].count);
    });

    it('respects the n limit', () => {
      const top = getTopUsedTabs(2);
      expect(top.length).toBeLessThanOrEqual(2);
    });

    it('includes groupId and tabId', () => {
      const top = getTopUsedTabs(1);
      expect(top[0]).toHaveProperty('groupId');
      expect(top[0]).toHaveProperty('tabId');
    });
  });

  describe('getUnusedGroups', () => {
    it('returns groups with no usage', () => {
      const unused = getUnusedGroups();
      expect(unused).toContain('g3');
    });

    it('does not include groups with usage', () => {
      const unused = getUnusedGroups();
      expect(unused).not.toContain('g1');
      expect(unused).not.toContain('g2');
    });
  });

  describe('getGroupUsageBreakdown', () => {
    it('returns an entry per group', () => {
      const breakdown = getGroupUsageBreakdown();
      expect(breakdown.length).toBe(3);
    });

    it('includes totalEvents per group', () => {
      const breakdown = getGroupUsageBreakdown();
      const g1 = breakdown.find((b) => b.groupId === 'g1');
      expect(g1.totalEvents).toBe(4);
    });

    it('includes mostUsedTab', () => {
      const breakdown = getGroupUsageBreakdown();
      const g1 = breakdown.find((b) => b.groupId === 'g1');
      expect(g1.mostUsedTab).toBe('tab1');
    });

    it('returns null mostUsedTab for unused groups', () => {
      const breakdown = getGroupUsageBreakdown();
      const g3 = breakdown.find((b) => b.groupId === 'g3');
      expect(g3.mostUsedTab).toBeNull();
    });
  });
});
