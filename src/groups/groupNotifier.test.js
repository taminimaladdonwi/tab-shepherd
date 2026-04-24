const {
  onGroupEvent,
  offGroupEvent,
  emitGroupEvent,
  getListenerCount,
  clearListeners,
  getSupportedEvents,
} = require('./groupNotifier');

const {
  getListenerSummary,
  getActiveEvents,
  getTotalListenerCount,
} = require('./groupNotifierView');

beforeEach(() => {
  clearListeners();
});

describe('onGroupEvent', () => {
  test('registers a listener for a valid event', () => {
    onGroupEvent('created', () => {});
    expect(getListenerCount('created')).toBe(1);
  });

  test('throws for invalid event type', () => {
    expect(() => onGroupEvent('exploded', () => {})).toThrow('Invalid event type');
  });

  test('throws if callback is not a function', () => {
    expect(() => onGroupEvent('created', 'not-a-fn')).toThrow('Callback must be a function');
  });

  test('supports multiple listeners on the same event', () => {
    onGroupEvent('deleted', () => {});
    onGroupEvent('deleted', () => {});
    expect(getListenerCount('deleted')).toBe(2);
  });
});

describe('offGroupEvent', () => {
  test('removes a registered listener', () => {
    const cb = jest.fn();
    onGroupEvent('suspended', cb);
    offGroupEvent('suspended', cb);
    expect(getListenerCount('suspended')).toBe(0);
  });

  test('does nothing if event has no listeners', () => {
    expect(() => offGroupEvent('restored', () => {})).not.toThrow();
  });
});

describe('emitGroupEvent', () => {
  test('calls registered listeners with event payload', () => {
    const cb = jest.fn();
    onGroupEvent('merged', cb);
    emitGroupEvent('merged', { groupId: 'g1' });
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb.mock.calls[0][0]).toMatchObject({ event: 'merged', groupId: 'g1' });
    expect(cb.mock.calls[0][0].timestamp).toBeDefined();
  });

  test('throws for invalid event type', () => {
    expect(() => emitGroupEvent('unknown', {})).toThrow('Cannot emit invalid event type');
  });

  test('does not throw if no listeners registered', () => {
    expect(() => emitGroupEvent('split', { groupId: 'g2' })).not.toThrow();
  });
});

describe('getSupportedEvents', () => {
  test('returns all valid event names', () => {
    const events = getSupportedEvents();
    expect(events).toContain('created');
    expect(events).toContain('archived');
    expect(events.length).toBeGreaterThan(0);
  });
});

describe('groupNotifierView', () => {
  test('getListenerSummary returns count per event', () => {
    onGroupEvent('created', () => {});
    onGroupEvent('created', () => {});
    onGroupEvent('deleted', () => {});
    const summary = getListenerSummary();
    expect(summary.created).toBe(2);
    expect(summary.deleted).toBe(1);
    expect(summary.suspended).toBe(0);
  });

  test('getActiveEvents returns only events with listeners', () => {
    onGroupEvent('restored', () => {});
    const active = getActiveEvents();
    expect(active).toContain('restored');
    expect(active).not.toContain('archived');
  });

  test('getTotalListenerCount sums all listeners', () => {
    onGroupEvent('created', () => {});
    onGroupEvent('deleted', () => {});
    onGroupEvent('deleted', () => {});
    expect(getTotalListenerCount()).toBe(3);
  });
});
