const {
  exportRelays,
  validateRelayImport,
  importRelays
} = require('./groupTabRelayManagerExporter');
const { setRelay, getRelay, clearRelays } = require('./groupTabRelayManager');
const { createGroup, getAllGroups } = require('./manager');

beforeEach(() => {
  clearRelays();
  // Reset groups via manager if clearAll is available
  try { require('./manager').clearAll && require('./manager').clearAll(); } catch (_) {}
});

test('validateRelayImport rejects bad data', () => {
  expect(validateRelayImport(null)).toBe(false);
  expect(validateRelayImport({ version: 2, relays: {} })).toBe(false);
  expect(validateRelayImport({ version: 1, relays: { g1: [{ relayId: 'r1', tabIds: ['only'] }] } })).toBe(false);
});

test('validateRelayImport accepts valid structure', () => {
  const data = {
    version: 1,
    exportedAt: Date.now(),
    relays: { g1: [{ relayId: 'r1', tabIds: ['t1', 't2'] }] }
  };
  expect(validateRelayImport(data)).toBe(true);
});

test('importRelays throws on invalid data', () => {
  expect(() => importRelays({ version: 99, relays: {} })).toThrow();
});

test('importRelays restores relays', () => {
  const data = {
    version: 1,
    exportedAt: Date.now(),
    relays: { g1: [{ relayId: 'r1', tabIds: ['t1', 't2', 't3'] }] }
  };
  importRelays(data);
  const relay = getRelay('g1', 'r1');
  expect(relay).not.toBeNull();
  expect(relay.tabIds).toEqual(['t1', 't2', 't3']);
});

test('importRelays with merge:false clears existing relays', () => {
  setRelay('g2', 'r9', ['a', 'b']);
  const data = {
    version: 1,
    exportedAt: Date.now(),
    relays: { g1: [{ relayId: 'r1', tabIds: ['t1', 't2'] }] }
  };
  importRelays(data, { merge: false });
  expect(getRelay('g2', 'r9')).toBeNull();
  expect(getRelay('g1', 'r1')).not.toBeNull();
});

test('importRelays with merge:true preserves existing relays', () => {
  setRelay('g2', 'r9', ['a', 'b']);
  const data = {
    version: 1,
    exportedAt: Date.now(),
    relays: { g1: [{ relayId: 'r1', tabIds: ['t1', 't2'] }] }
  };
  importRelays(data, { merge: true });
  expect(getRelay('g2', 'r9')).not.toBeNull();
  expect(getRelay('g1', 'r1')).not.toBeNull();
});
