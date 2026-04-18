const {
  saveSnapshot,
  getSnapshot,
  getAllSnapshots,
  deleteSnapshot,
  getSnapshotAge,
  clearAllSnapshots,
} = require('./sessionSnapshot');

const sampleTabs = [
  { tabId: 1, groupId: 'g1', url: 'https://example.com', title: 'Example' },
  { tabId: 2, groupId: 'g1', url: 'https://foo.com', title: 'Foo' },
];

beforeEach(() => clearAllSnapshots());

test('saveSnapshot stores a snapshot retrievable by sessionId', () => {
  saveSnapshot('s1', sampleTabs);
  const snap = getSnapshot('s1');
  expect(snap).not.toBeNull();
  expect(snap.sessionId).toBe('s1');
  expect(snap.tabs).toEqual(sampleTabs);
});

test('getSnapshot returns null for unknown sessionId', () => {
  expect(getSnapshot('unknown')).toBeNull();
});

test('getAllSnapshots returns all saved snapshots', () => {
  saveSnapshot('s1', sampleTabs);
  saveSnapshot('s2', sampleTabs);
  expect(getAllSnapshots()).toHaveLength(2);
});

test('deleteSnapshot removes the snapshot', () => {
  saveSnapshot('s1', sampleTabs);
  expect(deleteSnapshot('s1')).toBe(true);
  expect(getSnapshot('s1')).toBeNull();
});

test('deleteSnapshot returns false for non-existent snapshot', () => {
  expect(deleteSnapshot('nope')).toBe(false);
});

test('getSnapshotAge returns -1 for missing snapshot', () => {
  expect(getSnapshotAge('missing')).toBe(-1);
});

test('getSnapshotAge returns a non-negative number for existing snapshot', () => {
  saveSnapshot('s1', sampleTabs);
  const age = getSnapshotAge('s1');
  expect(age).toBeGreaterThanOrEqual(0);
});

test('saveSnapshot throws on invalid input', () => {
  expect(() => saveSnapshot(null, sampleTabs)).toThrow();
  expect(() => saveSnapshot('s1', 'notanarray')).toThrow();
});

test('clearAllSnapshots removes everything', () => {
  saveSnapshot('s1', sampleTabs);
  saveSnapshot('s2', sampleTabs);
  clearAllSnapshots();
  expect(getAllSnapshots()).toHaveLength(0);
});
