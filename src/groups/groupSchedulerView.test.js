const { setSchedule, clearSchedules, recordTrigger } = require('./groupScheduler');
const {
  getScheduleSummary,
  getNextScheduledGroups,
  getGroupScheduleStatus,
} = require('./groupSchedulerView');

beforeEach(() => clearSchedules());

describe('getScheduleSummary', () => {
  test('returns zeroes when no schedules', () => {
    const s = getScheduleSummary();
    expect(s.totalSchedules).toBe(0);
    expect(s.groupsWithSchedules).toBe(0);
  });

  test('counts suspend and restore separately', () => {
    setSchedule('g1', 'suspend', '0 2 * * *');
    setSchedule('g1', 'restore', '0 8 * * *');
    setSchedule('g2', 'suspend', '0 3 * * *');
    const s = getScheduleSummary();
    expect(s.totalSchedules).toBe(3);
    expect(s.groupsWithSchedules).toBe(2);
    expect(s.suspendSchedules).toBe(2);
    expect(s.restoreSchedules).toBe(1);
  });
});

describe('getNextScheduledGroups', () => {
  test('returns only matching action schedules', () => {
    setSchedule('g1', 'suspend', '0 2 * * *');
    setSchedule('g2', 'restore', '0 8 * * *');
    const suspends = getNextScheduledGroups('suspend');
    expect(suspends).toHaveLength(1);
    expect(suspends[0].groupId).toBe('g1');
  });

  test('includes lastTriggered in result', () => {
    setSchedule('g1', 'suspend', '0 2 * * *');
    recordTrigger('g1', 'suspend');
    const suspends = getNextScheduledGroups('suspend');
    expect(suspends[0].lastTriggered).not.toBeNull();
  });
});

describe('getGroupScheduleStatus', () => {
  test('returns scheduled false for group with no schedules', () => {
    const status = getGroupScheduleStatus('g99');
    expect(status.scheduled).toBe(false);
  });

  test('returns scheduled true with actions for known group', () => {
    setSchedule('g1', 'suspend', '0 2 * * *');
    setSchedule('g1', 'restore', '0 8 * * *');
    const status = getGroupScheduleStatus('g1');
    expect(status.scheduled).toBe(true);
    expect(status.actions).toHaveLength(2);
    expect(status.actions.map(a => a.action)).toContain('suspend');
    expect(status.actions.map(a => a.action)).toContain('restore');
  });
});
