// groupTabReminderView.js — View helpers for tab reminders

const { getRemindersForGroup, getAllReminders, getDueReminders } = require('./groupTabReminder');

function getReminderSummary(groupId) {
  const reminders = getRemindersForGroup(groupId);
  const now = Date.now();
  const due = reminders.filter(r => r.remindAt <= now);
  const upcoming = reminders.filter(r => r.remindAt > now);
  return {
    groupId,
    total: reminders.length,
    due: due.length,
    upcoming: upcoming.length
  };
}

function getUpcomingReminders(withinMs = 3600000) {
  const now = Date.now();
  return getAllReminders()
    .filter(r => r.remindAt > now && r.remindAt <= now + withinMs)
    .sort((a, b) => a.remindAt - b.remindAt);
}

function getDueReminderMessages(now = Date.now()) {
  return getDueReminders(now).map(r => ({
    groupId: r.groupId,
    tabId: r.tabId,
    message: r.message,
    overdueMs: now - r.remindAt
  }));
}

function getGroupsWithReminders() {
  const groups = new Set(getAllReminders().map(r => r.groupId));
  return Array.from(groups);
}

module.exports = {
  getReminderSummary,
  getUpcomingReminders,
  getDueReminderMessages,
  getGroupsWithReminders
};
