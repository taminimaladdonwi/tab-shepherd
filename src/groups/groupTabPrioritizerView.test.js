import {
  getPrioritySummary,
  getHighPriorityTabs,
  getLowPriorityTabs,
  getUnprioritizedTabs,
} from './groupTabPrioritizerView.js';
import {
  setPriority,
  clearAllPriorities,
} from './groupTabPrioritizer.js';

const GROUP_A = 'group-a';
const GROUP_B = 'group-b';

const tabs = [
  { id: 1, title: 'Alpha', url: 'https://alpha.com' },
  { id: 2, title: 'Beta', url: 'https://beta.com' },
  { id: 3, title: 'Gamma', url: 'https://gamma.com' },
  { id: 4, title: 'Delta', url: 'https://delta.com' },
];

function setup() {
  clearAllPriorities();
  setPriority(GROUP_A, 1, 'high');
  setPriority(GROUP_A, 2, 'medium');
  setPriority(GROUP_A, 3, 'low');
  // tab 4 is unprioritized
  setPriority(GROUP_B, 4, 'high');
}

describe('getPrioritySummary', () => {
  beforeEach(setup);

  it('returns count of each priority level for a group', () => {
    const summary = getPrioritySummary(GROUP_A, tabs.slice(0, 3));
    expect(summary.high).toBe(1);
    expect(summary.medium).toBe(1);
    expect(summary.low).toBe(1);
    expect(summary.unprioritized).toBe(0);
    expect(summary.total).toBe(3);
  });

  it('counts unprioritized tabs correctly', () => {
    const summary = getPrioritySummary(GROUP_A, tabs);
    expect(summary.unprioritized).toBe(1);
    expect(summary.total).toBe(4);
  });

  it('returns all zeros for empty tab list', () => {
    const summary = getPrioritySummary(GROUP_A, []);
    expect(summary.high).toBe(0);
    expect(summary.medium).toBe(0);
    expect(summary.low).toBe(0);
    expect(summary.unprioritized).toBe(0);
    expect(summary.total).toBe(0);
  });
});

describe('getHighPriorityTabs', () => {
  beforeEach(setup);

  it('returns only high priority tabs', () => {
    const result = getHighPriorityTabs(GROUP_A, tabs);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it('returns empty array when no high priority tabs exist', () => {
    clearAllPriorities();
    const result = getHighPriorityTabs(GROUP_A, tabs);
    expect(result).toEqual([]);
  });
});

describe('getLowPriorityTabs', () => {
  beforeEach(setup);

  it('returns only low priority tabs', () => {
    const result = getLowPriorityTabs(GROUP_A, tabs);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(3);
  });

  it('returns empty array when no low priority tabs exist', () => {
    clearAllPriorities();
    const result = getLowPriorityTabs(GROUP_A, tabs);
    expect(result).toEqual([]);
  });
});

describe('getUnprioritizedTabs', () => {
  beforeEach(setup);

  it('returns tabs with no priority set', () => {
    const result = getUnprioritizedTabs(GROUP_A, tabs);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(4);
  });

  it('returns all tabs when none are prioritized', () => {
    clearAllPriorities();
    const result = getUnprioritizedTabs(GROUP_A, tabs);
    expect(result).toHaveLength(4);
  });

  it('returns empty array when all tabs are prioritized', () => {
    setPriority(GROUP_A, 4, 'medium');
    const result = getUnprioritizedTabs(GROUP_A, tabs);
    expect(result).toHaveLength(0);
  });
});
