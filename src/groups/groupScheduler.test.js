const {
  setSchedule,
  removeSchedule,
  getSchedule,
  getAllSchedules,
  getSchedulesForGroup,
  recordTrigger,
  clearSchedules,
} = require('./groupScheduler');

beforeEach(() => clearSchedules());

describe('setSchedule', () => {
  test('creates a schedule entry', () => {
    const s = setSchedule('g1', 'suspend', '0 2 * * *');
    expect(s.groupId).toBe('g1');
    expect(s.action).toBe('suspend');
    expect(s.cronExpression).toBe('0 2 * * *');
    expect(s.lastTriggered).toBeNull();
  });

  test('throws on invalid action', () => {
    expect(() => setSchedule('g1', 'delete', '0 2 * * *')).toThrow('Invalid action');
  });

  test('throws on invalid cron expression', () => {
    expect(() => setSchedule('g1', 'suspend', 'bad-cron')).toThrow('Invalid cron expression');
  });

  test('throws when groupId is missing', () => {
    expect(() => setSchedule(null, 'suspend', '0 2 * * *')).toThrow('groupId is required');
  });
});

describe('getSchedule', () => {
  test('returns null when not found', () => {
    expect(getSchedule('g1', 'suspend')).toBeNull();
  });

  test('returns schedule after creation', () => {
    setSchedule('g1', 'restore', '0 8 * * *');
    const s = getSchedule('g1', 'restore');
    expect(s).not.toBeNull();
    expect(s.action).toBe('restore');
  });
});

describe('removeSchedule', () => {
  test('removes an existing schedule', () => {
    setSchedule('g1', 'suspend', '0 2 * * *');
    expect(removeSchedule('g1', 'suspend')).toBe(true);
    expect(getSchedule('g1', 'suspend')).toBeNull();
  });

  test('returns false when not found', () => {
    expect(removeSchedule('g99', 'suspend')).toBe(false);
  });
});

describe('getSchedulesForGroup', () => {
  test('returns all schedules for a group', () => {
    setSchedule('g1', 'suspend', '0 2 * * *');
    setSchedule('g1', 'restore', '0 8 * * *');
    setSchedule('g2', 'suspend', '0 3 * * *');
    expect(getSchedulesForGroup('g1')).toHaveLength(2);
    expect(getSchedulesForGroup('g2')).toHaveLength(1);
  });
});

describe('recordTrigger', () => {
  test('updates lastTriggered', () => {
    setSchedule('g1', 'suspend', '0 2 * * *');
    const before = Date.now();
    recordTrigger('g1', 'suspend');
    const s = getSchedule('g1', 'suspend');
    expect(s.lastTriggered).toBeGreaterThanOrEqual(before);
  });

  test('returns false for unknown schedule', () => {
    expect(recordTrigger('g99', 'suspend')).toBe(false);
  });
});

describe('getAllSchedules', () => {
  test('returns all schedules across groups', () => {
    setSchedule('g1', 'suspend', '0 2 * * *');
    setSchedule('g2', 'restore', '0 8 * * *');
    expect(getAllSchedules()).toHaveLength(2);
  });
});
