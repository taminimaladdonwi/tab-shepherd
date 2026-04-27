// groupTabReminderExporter.js — Export and import tab reminders

const { getAllReminders, setReminder, clearReminders } = require('./groupTabReminder');

function exportReminders() {
  return JSON.stringify(getAllReminders());
}

function validateReminderImport(data) {
  if (!Array.isArray(data)) return false;
  return data.every(r =>
    typeof r.groupId === 'string' &&
    typeof r.tabId === 'string' &&
    typeof r.message === 'string' && r.message.trim() !== '' &&
    typeof r.remindAt === 'number' && r.remindAt > 0
  );
}

function importReminders(jsonString, { replace = false } = {}) {
  let data;
  try {
    data = JSON.parse(jsonString);
  } catch {
    throw new Error('Invalid JSON for reminder import');
  }
  if (!validateReminderImport(data)) {
    throw new Error('Invalid reminder import format');
  }
  if (replace) clearReminders();
  const imported = [];
  for (const r of data) {
    const reminder = setReminder(r.groupId, r.tabId, { message: r.message, remindAt: r.remindAt });
    imported.push(reminder);
  }
  return imported;
}

module.exports = {
  exportReminders,
  importReminders,
  validateReminderImport
};
