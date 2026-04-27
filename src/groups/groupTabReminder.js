// groupTabReminder.js — Set and manage reminders for tabs within groups

const reminders = new Map();

function makeKey(groupId, tabId) {
  return `${groupId}::${tabId}`;
}

function isValidReminder({ message, remindAt }) {
  if (typeof message !== 'string' || message.trim() === '') return false;
  if (typeof remindAt !== 'number' || remindAt <= 0) return false;
  return true;
}

function setReminder(groupId, tabId, { message, remindAt }) {
  if (!isValidReminder({ message, remindAt })) {
    throw new Error('Invalid reminder: message must be a non-empty string and remindAt must be a positive number');
  }
  const key = makeKey(groupId, tabId);
  const reminder = { groupId, tabId, message: message.trim(), remindAt, createdAt: Date.now() };
  reminders.set(key, reminder);
  return reminder;
}

function getReminder(groupId, tabId) {
  return reminders.get(makeKey(groupId, tabId)) || null;
}

function removeReminder(groupId, tabId) {
  return reminders.delete(makeKey(groupId, tabId));
}

function getRemindersForGroup(groupId) {
  const result = [];
  for (const reminder of reminders.values()) {
    if (reminder.groupId === groupId) result.push(reminder);
  }
  return result;
}

function getDueReminders(now = Date.now()) {
  const due = [];
  for (const reminder of reminders.values()) {
    if (reminder.remindAt <= now) due.push(reminder);
  }
  return due;
}

function getAllReminders() {
  return Array.from(reminders.values());
}

function clearReminders() {
  reminders.clear();
}

module.exports = {
  makeKey,
  isValidReminder,
  setReminder,
  getReminder,
  removeReminder,
  getRemindersForGroup,
  getDueReminders,
  getAllReminders,
  clearReminders
};
