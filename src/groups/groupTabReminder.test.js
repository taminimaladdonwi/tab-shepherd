const {
  setReminder,
  getReminder,
  removeReminder,
  getRemindersForGroup,
  getDueReminders,
  getAllReminders,
  clearReminders,
  isValidReminder
} = require('./groupTabReminder');

beforeEach(() => clearReminders());

describe('isValidReminder', () => {
  it('returns true for valid reminder', () => {
    expect(isValidReminder({ message: 'check this', remindAt: Date.now() + 1000 })).toBe(true);
  });
  it('returns false for empty message', () => {
    expect(isValidReminder({ message: '', remindAt: 1000 })).toBe(false);
  });
  it('returns false for non-positive remindAt', () => {
    expect(isValidReminder({ message: 'hi', remindAt: -1 })).toBe(false);
  });
});

describe('setReminder / getReminder', () => {
  it('stores and retrieves a reminder', () => {
    const r = setReminder('g1', 't1', { message: 'review tab', remindAt: 9999999 });
    expect(r.groupId).toBe('g1');
    expect(r.tabId).toBe('t1');
    expect(r.message).toBe('review tab');
    expect(getReminder('g1', 't1')).toEqual(r);
  });
  it('returns null for unknown tab', () => {
    expect(getReminder('g1', 'missing')).toBeNull();
  });
  it('throws on invalid reminder', () => {
    expect(() => setReminder('g1', 't1', { message: '', remindAt: 100 })).toThrow();
  });
});

describe('removeReminder', () => {
  it('removes an existing reminder', () => {
    setReminder('g1', 't1', { message: 'test', remindAt: 1000 });
    expect(removeReminder('g1', 't1')).toBe(true);
    expect(getReminder('g1', 't1')).toBeNull();
  });
  it('returns false for non-existent reminder', () => {
    expect(removeReminder('g1', 'nope')).toBe(false);
  });
});

describe('getRemindersForGroup', () => {
  it('returns all reminders for a group', () => {
    setReminder('g1', 't1', { message: 'a', remindAt: 1000 });
    setReminder('g1', 't2', { message: 'b', remindAt: 2000 });
    setReminder('g2', 't3', { message: 'c', remindAt: 3000 });
    expect(getRemindersForGroup('g1')).toHaveLength(2);
    expect(getRemindersForGroup('g2')).toHaveLength(1);
  });
});

describe('getDueReminders', () => {
  it('returns reminders whose remindAt is in the past', () => {
    const past = Date.now() - 5000;
    const future = Date.now() + 5000;
    setReminder('g1', 't1', { message: 'past', remindAt: past });
    setReminder('g1', 't2', { message: 'future', remindAt: future });
    const due = getDueReminders();
    expect(due).toHaveLength(1);
    expect(due[0].message).toBe('past');
  });
});

describe('getAllReminders / clearReminders', () => {
  it('returns all reminders', () => {
    setReminder('g1', 't1', { message: 'x', remindAt: 1000 });
    setReminder('g2', 't2', { message: 'y', remindAt: 2000 });
    expect(getAllReminders()).toHaveLength(2);
  });
  it('clears all reminders', () => {
    setReminder('g1', 't1', { message: 'x', remindAt: 1000 });
    clearReminders();
    expect(getAllReminders()).toHaveLength(0);
  });
});
