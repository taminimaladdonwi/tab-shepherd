const {
  isValidRelay,
  setRelay,
  getRelay,
  removeRelay,
  getRelaysForGroup,
  advanceRelay,
  getRelayHistory,
  clearRelays
} = require('./groupTabRelayManager');

beforeEach(() => clearRelays());

test('isValidRelay rejects non-arrays and short arrays', () => {
  expect(isValidRelay(null)).toBe(false);
  expect(isValidRelay([])).toBe(false);
  expect(isValidRelay(['a'])).toBe(false);
  expect(isValidRelay(['a', 'b'])).toBe(true);
});

test('setRelay and getRelay store and retrieve relay', () => {
  setRelay('g1', 'r1', ['t1', 't2', 't3']);
  const relay = getRelay('g1', 'r1');
  expect(relay).not.toBeNull();
  expect(relay.tabIds).toEqual(['t1', 't2', 't3']);
});

test('setRelay throws on invalid relay', () => {
  expect(() => setRelay('g1', 'r1', ['only-one'])).toThrow();
});

test('removeRelay deletes relay', () => {
  setRelay('g1', 'r1', ['t1', 't2']);
  removeRelay('g1', 'r1');
  expect(getRelay('g1', 'r1')).toBeNull();
});

test('getRelaysForGroup returns only matching group relays', () => {
  setRelay('g1', 'r1', ['t1', 't2']);
  setRelay('g1', 'r2', ['t3', 't4']);
  setRelay('g2', 'r3', ['t5', 't6']);
  expect(getRelaysForGroup('g1')).toHaveLength(2);
  expect(getRelaysForGroup('g2')).toHaveLength(1);
});

test('advanceRelay activates first tab and shifts queue', () => {
  setRelay('g1', 'r1', ['t1', 't2', 't3']);
  const result = advanceRelay('g1', 'r1');
  expect(result.activatedTabId).toBe('t1');
  expect(result.done).toBe(false);
  expect(result.remaining).toEqual(['t2', 't3']);
});

test('advanceRelay marks done and removes relay when last tab reached', () => {
  setRelay('g1', 'r1', ['t1', 't2']);
  advanceRelay('g1', 'r1');
  const result = advanceRelay('g1', 'r1');
  expect(result.done).toBe(true);
  expect(getRelay('g1', 'r1')).toBeNull();
});

test('advanceRelay returns null for unknown relay', () => {
  expect(advanceRelay('g1', 'nope')).toBeNull();
});

test('getRelayHistory records advances', () => {
  setRelay('g1', 'r1', ['t1', 't2']);
  advanceRelay('g1', 'r1');
  const history = getRelayHistory();
  expect(history).toHaveLength(1);
  expect(history[0].activatedTabId).toBe('t1');
});

test('clearRelays empties all state', () => {
  setRelay('g1', 'r1', ['t1', 't2']);
  clearRelays();
  expect(getRelaysForGroup('g1')).toHaveLength(0);
  expect(getRelayHistory()).toHaveLength(0);
});
