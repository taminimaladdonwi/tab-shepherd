// groupSchedulerView.js — Read-only views over group schedules

const { getAllSchedules, getSchedulesForGroup } = require('./groupScheduler');

function getScheduleSummary() {
  const all = getAllSchedules();
  const groupIds = [...new Set(all.map(s => s.groupId))];
  return {
    totalSchedules: all.length,
    groupsWithSchedules: groupIds.length,
    suspendSchedules: all.filter(s => s.action === 'suspend').length,
    restoreSchedules: all.filter(s => s.action === 'restore').length,
  };
}

function getNextScheduledGroups(action) {
  return getAllSchedules()
    .filter(s => s.action === action)
    .map(s => ({
      groupId: s.groupId,
      cronExpression: s.cronExpression,
      lastTriggered: s.lastTriggered,
    }));
}

function getGroupScheduleStatus(groupId) {
  const schedules = getSchedulesForGroup(groupId);
  if (schedules.length === 0) return { groupId, scheduled: false };
  return {
    groupId,
    scheduled: true,
    actions: schedules.map(s => ({
      action: s.action,
      cronExpression: s.cronExpression,
      lastTriggered: s.lastTriggered,
    })),
  };
}

module.exports = {
  getScheduleSummary,
  getNextScheduledGroups,
  getGroupScheduleStatus,
};
