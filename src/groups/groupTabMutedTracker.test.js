const {
  muteTab,
  unmuteTab,
  isMuted,
  getMuteRecord,
  getMutedTabsInGroup,
  getAllMuted,
  getMuteReasonDistribution,
  clearMuteRecords,
  isValidReason
} = require('./groupTabMutedTracker');

beforeEach(() => clearMuteRecords());

test('isValidReason rejects empty or non-string', () => {
  expect(isValidReason('')).toBe(false);
  expect(isValidReason(null)).toBe(false);
  expect(isValidReason('auto')).toBe(true);
});

test('muteTab stores a record', () => {
  muteTab('g1', 't1', 'manual');
  expect(isMuted('g1', 't1')).toBe(true);
});

test('muteTab throws on invalid reason', () => {
  expect(() => muteTab('g1', 't1', '')).toThrow('Invalid mute reason');
});

test('unmuteTab removes the record', () => {
  muteTab('g1', 't1');
  unmuteTab('g1', 't1');
  expect(isMuted('g1', 't1')).toBe(false);
});

test('getMuteRecord returns correct record', () => {
  muteTab('g1', 't2', 'policy');
  const rec = getMuteRecord('g1', 't2');
  expect(rec.reason).toBe('policy');
  expect(rec.tabId).toBe('t2');
  expect(typeof rec.mutedAt).toBe('number');
});

test('getMuteRecord returns null for unknown', () => {
  expect(getMuteRecord('g1', 'unknown')).toBeNull();
});

test('getMutedTabsInGroup filters by group', () => {
  muteTab('g1', 't1');
  muteTab('g1', 't2');
  muteTab('g2', 't3');
  expect(getMutedTabsInGroup('g1')).toHaveLength(2);
  expect(getMutedTabsInGroup('g2')).toHaveLength(1);
});

test('getAllMuted returns all records', () => {
  muteTab('g1', 't1');
  muteTab('g2', 't2');
  expect(getAllMuted()).toHaveLength(2);
});

test('getMuteReasonDistribution counts reasons', () => {
  muteTab('g1', 't1', 'manual');
  muteTab('g1', 't2', 'manual');
  muteTab('g2', 't3', 'policy');
  const dist = getMuteReasonDistribution();
  expect(dist.manual).toBe(2);
  expect(dist.policy).toBe(1);
});

test('clearMuteRecords empties all records', () => {
  muteTab('g1', 't1');
  clearMuteRecords();
  expect(getAllMuted()).toHaveLength(0);
});
