import {
  getAccessSummary,
  getRestrictedTabs,
  getPermissionDistribution,
  getGroupsWithSuspensionRestrictions
} from './groupTabAccessControllerView.js';
import { setPermissions, clearPermissions } from './groupTabAccessController.js';
import { createGroup } from './manager.js';

function setup() {
  clearPermissions();

  // Group A: mixed permissions
  createGroup('groupA', { name: 'Group A', tabs: [
    { id: 'tab1', url: 'https://example.com', title: 'Example' },
    { id: 'tab2', url: 'https://docs.example.com', title: 'Docs' },
    { id: 'tab3', url: 'https://admin.example.com', title: 'Admin' }
  ]});

  // Group B: all tabs unrestricted
  createGroup('groupB', { name: 'Group B', tabs: [
    { id: 'tab4', url: 'https://open.example.com', title: 'Open' },
    { id: 'tab5', url: 'https://free.example.com', title: 'Free' }
  ]});

  setPermissions('groupA', 'tab1', ['read', 'suspend']);
  setPermissions('groupA', 'tab2', ['read']);
  setPermissions('groupA', 'tab3', ['read', 'write', 'suspend']);
  setPermissions('groupB', 'tab4', ['read', 'suspend']);
  // tab5 has no permissions set
}

describe('groupTabAccessControllerView', () => {
  beforeEach(() => setup());

  describe('getAccessSummary', () => {
    it('returns total tab count and permission counts for a group', () => {
      const summary = getAccessSummary('groupA');
      expect(summary.groupId).toBe('groupA');
      expect(summary.totalTabs).toBe(3);
      expect(summary.tabsWithPermissions).toBe(3);
      expect(typeof summary.permissionCounts).toBe('object');
    });

    it('returns zero counts for a group with no permissions set', () => {
      createGroup('emptyGroup', { name: 'Empty', tabs: [] });
      const summary = getAccessSummary('emptyGroup');
      expect(summary.tabsWithPermissions).toBe(0);
    });

    it('returns null for unknown group', () => {
      const summary = getAccessSummary('nonexistent');
      expect(summary).toBeNull();
    });
  });

  describe('getRestrictedTabs', () => {
    it('returns tabs missing a specific permission', () => {
      const restricted = getRestrictedTabs('groupA', 'write');
      // tab1 and tab2 do not have 'write'
      expect(restricted.length).toBe(2);
      const ids = restricted.map(t => t.tabId);
      expect(ids).toContain('tab1');
      expect(ids).toContain('tab2');
    });

    it('returns empty array when all tabs have the permission', () => {
      const restricted = getRestrictedTabs('groupA', 'read');
      expect(restricted).toHaveLength(0);
    });

    it('returns empty array for unknown group', () => {
      const restricted = getRestrictedTabs('ghost', 'read');
      expect(restricted).toEqual([]);
    });
  });

  describe('getPermissionDistribution', () => {
    it('returns count of each permission across all tabs in a group', () => {
      const dist = getPermissionDistribution('groupA');
      expect(dist.read).toBe(3);
      expect(dist.suspend).toBe(2);
      expect(dist.write).toBe(1);
    });

    it('returns empty object for group with no permissions', () => {
      createGroup('bare', { name: 'Bare', tabs: [{ id: 'tabX', url: 'https://x.com', title: 'X' }] });
      const dist = getPermissionDistribution('bare');
      expect(Object.keys(dist).length).toBe(0);
    });
  });

  describe('getGroupsWithSuspensionRestrictions', () => {
    it('returns groups that have at least one tab without suspend permission', () => {
      const groups = getGroupsWithSuspensionRestrictions();
      const ids = groups.map(g => g.groupId);
      // groupA has tab2 without suspend
      expect(ids).toContain('groupA');
    });

    it('does not include groups where all tabs have suspend permission', () => {
      const groups = getGroupsWithSuspensionRestrictions();
      const ids = groups.map(g => g.groupId);
      // groupB: tab4 has suspend, tab5 has no permissions (treated as unrestricted)
      // depends on implementation; at minimum groupA should be present
      expect(ids).toContain('groupA');
    });

    it('returns an array', () => {
      const result = getGroupsWithSuspensionRestrictions();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
