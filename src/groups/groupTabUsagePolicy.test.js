import {
  setUsagePolicy,
  removeUsagePolicy,
  getUsagePolicy,
  evaluateTabsByUsagePolicy,
  clearUsagePolicies,
  getAllPolicyGroupIds,
} from './groupTabUsagePolicy.js';
import { recordTabUsage, clearAllUsage } from './groupTabUsageTracker.js';

beforeEach(() => {
  clearUsagePolicies();
  clearAllUsage();
});

describe('setUsagePolicy / getUsagePolicy', () => {
  it('stores and retrieves a policy', () => {
    setUsagePolicy('g1', { minUsageToProtect: 3 });
    expect(getUsagePolicy('g1')).toEqual({ minUsageToProtect: 3 });
  });

  it('returns null for unknown group', () => {
    expect(getUsagePolicy('unknown')).toBeNull();
  });

  it('throws on invalid groupId', () => {
    expect(() => setUsagePolicy('', {})).toThrow();
  });
});

describe('removeUsagePolicy', () => {
  it('removes an existing policy', () => {
    setUsagePolicy('g1', { minUsageToProtect: 2 });
    removeUsagePolicy('g1');
    expect(getUsagePolicy('g1')).toBeNull();
  });
});

describe('evaluateTabsByUsagePolicy', () => {
  const tabs = [
    { id: 'tab1', title: 'Tab 1' },
    { id: 'tab2', title: 'Tab 2' },
    { id: 'tab3', title: 'Tab 3' },
  ];

  it('returns all tabs as suspendable when no policy set', () => {
    const result = evaluateTabsByUsagePolicy('g1', tabs);
    expect(result.suspendable).toHaveLength(3);
    expect(result.protected).toHaveLength(0);
  });

  it('protects tabs meeting usage threshold', () => {
    recordTabUsage('g1', 'tab1');
    recordTabUsage('g1', 'tab1');
    recordTabUsage('g1', 'tab1');
    setUsagePolicy('g1', { minUsageToProtect: 3 });

    const result = evaluateTabsByUsagePolicy('g1', tabs);
    expect(result.protected.map((t) => t.id)).toContain('tab1');
    expect(result.suspendable.map((t) => t.id)).toContain('tab2');
    expect(result.suspendable.map((t) => t.id)).toContain('tab3');
  });

  it('does not protect tabs below threshold', () => {
    recordTabUsage('g1', 'tab2');
    setUsagePolicy('g1', { minUsageToProtect: 3 });

    const result = evaluateTabsByUsagePolicy('g1', tabs);
    expect(result.suspendable.map((t) => t.id)).toContain('tab2');
  });
});

describe('getAllPolicyGroupIds', () => {
  it('returns all group IDs with policies', () => {
    setUsagePolicy('g1', { minUsageToProtect: 1 });
    setUsagePolicy('g2', { minUsageToProtect: 5 });
    const ids = getAllPolicyGroupIds();
    expect(ids).toContain('g1');
    expect(ids).toContain('g2');
  });

  it('returns empty array when no policies', () => {
    expect(getAllPolicyGroupIds()).toHaveLength(0);
  });
});
