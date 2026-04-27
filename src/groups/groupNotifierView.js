/**
 * groupNotifierView.js
 * Read-only view helpers for inspecting group notification state.
 */

const { getListenerCount, getSupportedEvents } = require('./groupNotifier');

/**
 * Returns a summary object mapping each event name to its listener count.
 * @returns {Object} e.g. { groupCreated: 2, groupDeleted: 0, ... }
 */
function getListenerSummary() {
  const events = getSupportedEvents();
  return events.reduce((summary, event) => {
    summary[event] = getListenerCount(event);
    return summary;
  }, {});
}

/**
 * Returns the list of events that currently have at least one listener.
 * @returns {string[]}
 */
function getActiveEvents() {
  return getSupportedEvents().filter(event => getListenerCount(event) > 0);
}

/**
 * Returns the total number of listeners across all supported events.
 * @returns {number}
 */
function getTotalListenerCount() {
  return getSupportedEvents().reduce((total, event) => {
    return total + getListenerCount(event);
  }, 0);
}

/**
 * Returns true if the given event has at least one listener registered.
 * Throws if the event name is not among the supported events.
 * @param {string} event
 * @returns {boolean}
 */
function isEventActive(event) {
  const supported = getSupportedEvents();
  if (!supported.includes(event)) {
    throw new Error(`Unsupported event: "${event}". Supported events are: ${supported.join(', ')}`);
  }
  return getListenerCount(event) > 0;
}

module.exports = {
  getListenerSummary,
  getActiveEvents,
  getTotalListenerCount,
  isEventActive,
};
