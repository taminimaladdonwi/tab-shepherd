// groupSchedulerRunner.js — Evaluate due schedules and dispatch actions

const { getAllSchedules, recordTrigger } = require('./groupScheduler');

// Minimal cron matcher: checks if current time matches a cron expression
// Supports only numeric values and '*' wildcards for: minute hour dom month dow
function matchesCron(expression, date = new Date()) {
  const [minute, hour, dom, month, dow] = expression.trim().split(/\s+/);
  const check = (field, value) => field === '*' || parseInt(field, 10) === value;
  return (
    check(minute, date.getMinutes()) &&
    check(hour, date.getHours()) &&
    check(dom, date.getDate()) &&
    check(month, date.getMonth() + 1) &&
    check(dow, date.getDay())
  );
}

function getDueSchedules(date = new Date()) {
  return getAllSchedules().filter(s => matchesCron(s.cronExpression, date));
}

async function runDueSchedules(handlers = {}, date = new Date()) {
  const due = getDueSchedules(date);
  const results = [];

  for (const schedule of due) {
    const { groupId, action } = schedule;
    const handler = handlers[action];
    let success = false;
    let error = null;

    if (typeof handler === 'function') {
      try {
        await handler(groupId);
        recordTrigger(groupId, action);
        success = true;
      } catch (e) {
        error = e.message;
      }
    }

    results.push({ groupId, action, success, error });
  }

  return results;
}

module.exports = { matchesCron, getDueSchedules, runDueSchedules };
