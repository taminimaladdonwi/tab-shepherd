// groupScheduler.js — Schedule automatic suspension/restoration for groups

const schedules = new Map();

const VALID_ACTIONS = ['suspend', 'restore'];

function isValidCron(expression) {
  // Simple validation: 5 space-separated fields
  return typeof expression === 'string' && expression.trim().split(/\s+/).length === 5;
}

function setSchedule(groupId, action, cronExpression) {
  if (!groupId) throw new Error('groupId is required');
  if (!VALID_ACTIONS.includes(action)) throw new Error(`Invalid action: ${action}`);
  if (!isValidCron(cronExpression)) throw new Error('Invalid cron expression');

  const key = `${groupId}:${action}`;
  schedules.set(key, {
    groupId,
    action,
    cronExpression,
    createdAt: Date.now(),
    lastTriggered: null,
  });
  return schedules.get(key);
}

function removeSchedule(groupId, action) {
  const key = `${groupId}:${action}`;
  return schedules.delete(key);
}

function getSchedule(groupId, action) {
  return schedules.get(`${groupId}:${action}`) || null;
}

function getAllSchedules() {
  return Array.from(schedules.values());
}

function getSchedulesForGroup(groupId) {
  return Array.from(schedules.values()).filter(s => s.groupId === groupId);
}

function recordTrigger(groupId, action) {
  const key = `${groupId}:${action}`;
  const schedule = schedules.get(key);
  if (!schedule) return false;
  schedule.lastTriggered = Date.now();
  return true;
}

function clearSchedules() {
  schedules.clear();
}

module.exports = {
  setSchedule,
  removeSchedule,
  getSchedule,
  getAllSchedules,
  getSchedulesForGroup,
  recordTrigger,
  clearSchedules,
};
