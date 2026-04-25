const {
  takeSnapshot,
  getSnapshots,
  getLatestSnapshot,
  diffWithLatest,
  clearSnapshots,
  clearAll,
} = require('./groupTabSnapshot');

const tabs1 = [
  { id: 1, url: 'https://a.com', title: 'A' },
  { id: 2, url: 'https://b.com', title: 'B' },
];

const tabs2 = [
  { id: 2, url: 'https://b.com', title: 'B' },
  { id: 3, url: 'https://c.com', title: 'C' },
];

beforeEach(() => clearAll());

describe('takeSnapshot', () => {
  test('returns a snapshot with correct shape', () => {
    const snap = takeSnapshot('g1', tabs1);
    expect(snap.groupId).toBe('g1');
    expect(snap.count).toBe(2);
    expect(snap.tabs).toHaveLength(2);
    expect(typeof snap.timestamp).toBe('number');
  });

  test('stores only id, url, title per tab', () => {
    const snap = takeSnapshot('g1', [{ id: 1, url: 'https://x.com', title: 'X', extra: 'ignored' }]);
    expect(snap.tabs[0]).toEqual({ id: 1, url: 'https://x.com', title: 'X' });
    expect(snap.tabs[0].extra).toBeUndefined();
  });

  test('throws when groupId is missing', () => {
    expect(() => takeSnapshot(null, tabs1)).toThrow();
  });

  test('throws when tabs is not an array', () => {
    expect(() => takeSnapshot('g1', null)).toThrow();
  });
});

describe('getSnapshots', () => {
  test('returns empty array when no snapshots exist', () => {
    expect(getSnapshots('unknown')).toEqual([]);
  });

  test('returns all snapshots in insertion order', () => {
    takeSnapshot('g1', tabs1);
    takeSnapshot('g1', tabs2);
    const snaps = getSnapshots('g1');
    expect(snaps).toHaveLength(2);
    expect(snaps[0].count).toBe(2);
    expect(snaps[1].count).toBe(2);
  });
});

describe('getLatestSnapshot', () => {
  test('returns null when no snapshots exist', () => {
    expect(getLatestSnapshot('g1')).toBeNull();
  });

  test('returns the most recent snapshot', () => {
    takeSnapshot('g1', tabs1);
    takeSnapshot('g1', tabs2);
    const latest = getLatestSnapshot('g1');
    expect(latest.tabs.map((t) => t.id)).toContain(3);
  });
});

describe('diffWithLatest', () => {
  test('treats all tabs as added when no snapshot exists', () => {
    const diff = diffWithLatest('g1', tabs1);
    expect(diff.added).toHaveLength(2);
    expect(diff.removed).toHaveLength(0);
  });

  test('correctly identifies added, removed, and unchanged tabs', () => {
    takeSnapshot('g1', tabs1);
    const diff = diffWithLatest('g1', tabs2);
    expect(diff.added.map((t) => t.id)).toEqual([3]);
    expect(diff.removed.map((t) => t.id)).toEqual([1]);
    expect(diff.unchanged.map((t) => t.id)).toEqual([2]);
  });
});

describe('clearSnapshots', () => {
  test('removes all snapshots for a specific group', () => {
    takeSnapshot('g1', tabs1);
    clearSnapshots('g1');
    expect(getSnapshots('g1')).toEqual([]);
  });

  test('does not affect other groups', () => {
    takeSnapshot('g1', tabs1);
    takeSnapshot('g2', tabs2);
    clearSnapshots('g1');
    expect(getSnapshots('g2')).toHaveLength(1);
  });
});
