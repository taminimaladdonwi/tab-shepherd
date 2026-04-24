/**
 * groupNotifierView.js
 * Read-only view helpers for inspecting group notification state.
 */

const { getListenerCount, getSupportedEvents } = require('./groupNotifier');

function getListenerSummary() {
  const events = getSupportedEvents();
  return events.reduce((summary, event) => {
    summary[event] = getListenerCount(event);
    return summary;
  }, {});
}

function getActiveEvents() {
  return getSupportedEvents().filter(event => getListenerCount(event) > 0);
}

function getTotalListenerCount() {
  return getSupportedEvents().reduce((total, event) => {
    return total + getListenerCount(event);
  }, 0);
}

module.exports = {
  getListenerSummary,
  getActiveEvents,
  getTotalListenerCount,
};
