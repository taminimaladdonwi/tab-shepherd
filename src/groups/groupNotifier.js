/**
 * groupNotifier.js
 * Manages notification callbacks triggered by group lifecycle events.
 */

const listeners = new Map();

const VALID_EVENTS = ['created', 'deleted', 'suspended', 'restored', 'archived', 'merged', 'split'];

function isValidEvent(event) {
  return VALID_EVENTS.includes(event);
}

function onGroupEvent(event, callback) {
  if (!isValidEvent(event)) {
    throw new Error(`Invalid event type: "${event}". Valid events: ${VALID_EVENTS.join(', ')}`);
  }
  if (typeof callback !== 'function') {
    throw new Error('Callback must be a function');
  }
  if (!listeners.has(event)) {
    listeners.set(event, []);
  }
  listeners.get(event).push(callback);
}

function offGroupEvent(event, callback) {
  if (!listeners.has(event)) return;
  const updated = listeners.get(event).filter(cb => cb !== callback);
  listeners.set(event, updated);
}

function emitGroupEvent(event, payload) {
  if (!isValidEvent(event)) {
    throw new Error(`Cannot emit invalid event type: "${event}"`);
  }
  const cbs = listeners.get(event) || [];
  cbs.forEach(cb => cb({ event, ...payload, timestamp: Date.now() }));
}

function getListenerCount(event) {
  return (listeners.get(event) || []).length;
}

function clearListeners(event) {
  if (event) {
    listeners.delete(event);
  } else {
    listeners.clear();
  }
}

function getSupportedEvents() {
  return [...VALID_EVENTS];
}

module.exports = {
  onGroupEvent,
  offGroupEvent,
  emitGroupEvent,
  getListenerCount,
  clearListeners,
  getSupportedEvents,
};
