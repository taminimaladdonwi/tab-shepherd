const {
  getReminderSummary,
  getUpcomingReminders,
  getDueReminderMessages,
  getGroupsWithReminders
} = require('./groupTabReminderView');
const { setReminder, clearReminders } = require('./groupTabReminder');

beforeEach(() => clearReminders());

describe('getReminderSummary', () => {
  it('returns correct counts for a group', () => {
    const past = Date.now() - 10000;
    const future = Date.now() + 10000;
    setReminder('g1', 't1', { message: 'due', remindAt: past });
    setReminder('g1', 't2', { message: 'upcoming', remindAt: future });
    const summary = getReminderSummary('g1');
    expect(summary.total).toBe(2);
    expect(summary.due).toBe(1);
    expect(summary.upcoming).toBe(1);
  });
  it('returns zeros for group with no reminders', () => {
    const summary = getReminderSummary('empty');
    expect(summary.total).toBe(0);
    expect(summary.due).toBe(0);
  });
});

describe('getUpcomingReminders', () => {
  it('returns reminders within the given window', () => {
    const soon = Date.now() + 1000;
    const later = Date.now() + 7200000;
    setReminder('g1', 't1', { message: 'soon', remindAt: soon });
    setReminder('g1', 't2', { message: 'later', remindAt: later });
    const upcoming = getUpcomingReminders(3600000);
    expect(upcoming).toHaveLength(1);
    expect(upcoming[0].message).toBe('soon');
  });
  it('returns results sorted by remindAt', () => {
    const now = Date.now();
    setReminder('g1', 't1', { message: 'second', remindAt: now + 2000 });
    setReminder('g1', 't2', { message: 'first', remindAt: now + 1000 });
    const upcoming = getUpcomingReminders();
    expect(upcoming[0].message).toBe('first');
  });
});

describe('getDueReminderMessages', () => {
  it('includes overdue duration', () => {
    const past = Date.now() - 5000;
    setReminder('g1', 't1', { message: 'overdue', remindAt: past });
    const messages = getDueReminderMessages();
    expect(messages).toHaveLength(1);
    expect(messages[0].overdueMs).toBeGreaterThan(0);
    expect(messages[0].message).toBe('overdue');
  });
});

describe('getGroupsWithReminders', () => {
  it('returns unique group ids that have reminders', () => {
    setReminder('g1', 't1', { message: 'a', remindAt: 1000 });
    setReminder('g2', 't2', { message: 'b', remindAt: 2000 });
    setReminder('g1', 't3', { message: 'c', remindAt: 3000 });
    const groups = getGroupsWithReminders();
    expect(groups).toHaveLength(2);
    expect(groups).toContain('g1');
    expect(groups).toContain('g2');
  });
});
