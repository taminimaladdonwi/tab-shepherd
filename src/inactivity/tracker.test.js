import {
  recordActivity,
  getInactiveDuration,
  removeTab,
  getIdleTabs,
  clearAll,
} from './tracker.js';

beforeEach(() => clearAll());

describe('recordActivity / getInactiveDuration', () => {
  test('returns Infinity for unknown tab', () => {
    expect(getInactiveDuration(99)).toBe(Infinity);
  });

  test('returns a small value immediately after recording', () => {
    recordActivity(1);
    expect(getInactiveDuration(1)).toBeLessThan(50);
  });
});

describe('removeTab', () => {
  test('removes tracking data so duration returns Infinity', () => {
    recordActivity(2);
    removeTab(2);
    expect(getInactiveDuration(2)).toBe(Infinity);
  });
});

describe('getIdleTabs', () => {
  test('returns tabs whose inactivity meets the threshold', () => {
    jest.useFakeTimers();
    recordActivity(10);
    recordActivity(11);

    jest.advanceTimersByTime(5000);
    recordActivity(11); // refresh tab 11

    jest.advanceTimersByTime(6000); // total 11 s for tab 10, 6 s for tab 11

    const idle = getIdleTabs(10000); // 10-second threshold
    expect(idle).toContain(10);
    expect(idle).not.toContain(11);

    jest.useRealTimers();
  });

  test('returns empty array when no tabs exceed threshold', () => {
    recordActivity(20);
    expect(getIdleTabs(60000)).toEqual([]);
  });
});
